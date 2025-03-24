from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, BackgroundTasks, Query, Body, Form
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError
from sqlmodel import Session
from src.core.config import CONFIG
from src.core.database import get_session
from src.core.security import create_access_token, ALGORITHM
from src.schemas.auth import TokenData, Token, OTPIn, ResetPassword, ForgotPassword, ChangePassword
from src.schemas.users import UserIn
from src.services.auth import register, login, generate_qr_totp, verify_totp, forgot_password, reset_password, change_password
from src.services.users import active_account, get_user_by_email
from src.utils.send_mail import send_mail
from src.utils.exceptions import BadRequest, ServerError, POST_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_account, get_account_by_username


router = APIRouter(tags=["Auth"], responses=POST_RESPONSES)

@router.post("/register", status_code=201, response_model=ApiResponse[str])
async def register_account(data: UserIn, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    token_data = TokenData(username=data.username, email=data.email)
    expires = timedelta(minutes=5)
    token = create_access_token(token_data, expires)
    background_tasks.add_task(send_mail,
        to=data.email,
        subject="Confirmación de cuenta",
        template_name="confirmation_template",
        data={
            "user_name": f"{data.first_name} {data.last_name}",
            "confirmation_link": f"{CONFIG.CLIENT_URL}/confirm-account?token={token}",
            "expiration_time": 5
        }
    )
    response =  register(session, data)
    return ApiResponse(status=201, data=response)



@router.post("/login", response_model=ApiResponse[Token | dict[str, bool]])
def login_account(form_data: OAuth2PasswordRequestForm = Depends(), recaptcha: str = Form(),session: Session = Depends(get_session)):
    response =  login(session, form_data.username, form_data.password, recaptcha)
    return ApiResponse(data=response)
    

@router.post("/confirm-account", response_model=ApiResponse[str])
def confirm_email(session: Session = Depends(get_session), token:str = Query()):
    try:

        if not token:
            raise BadRequest()
        payload = jwt.decode(token, CONFIG.SECRET_KEY, algorithms=[ALGORITHM])
        payload_email = payload.get("email")

        if not payload_email:
            raise BadRequest()

        response = active_account(session, payload_email)
        return ApiResponse(data=response)
    except ExpiredSignatureError as e:
        raise BadRequest("Token expirado") from e
    except Exception as e:
        raise ServerError() from e


@router.post("/resend-confirmation", response_model=ApiResponse[str])
def resend_email_confirmation(background_tasks: BackgroundTasks, email: str = Query(), session: Session = Depends(get_session)):
    user = get_user_by_email(session, email)
    token_data = TokenData(username=user.username, email=user.email)
    expires = timedelta(minutes=5)
    token = create_access_token(token_data, expires)
    background_tasks.add_task(send_mail,
        to=user.email,
        subject="Reenvío de confirmación de cuenta",
        template_name="confirmation_template",
        data={
            "user_name": f"{user.first_name} {user.last_name}",
            "confirmation_link": f"{CONFIG.CLIENT_URL}/confirm-account?token={token}",
            "expiration_time": 5
        }
    )

    return ApiResponse(data="Correo renviado correctamente")


@router.post("/otp", response_model=ApiResponse[str])
def create_otp(username: str = Body(embed=True), session: Session = Depends(get_session)):
    current_user = get_account_by_username(session, username)
    qr =  generate_qr_totp(current_user)
    return ApiResponse(data=qr)

@router.post("/verify-otp", response_model=ApiResponse[Token])
def verify_otp(data: OTPIn, session: Session = Depends(get_session)):
    current_user = get_account_by_username(session, data.username)
    response =  verify_totp(data.totp_code, current_user)

    return ApiResponse(data=response)

@router.post("/change-password", response_model=ApiResponse[str])
async def change_pwd(data: ChangePassword, session:Session = Depends(get_session), current_user = Depends(get_current_account)):
    response = change_password(session, data, current_user)
    return ApiResponse(data=response)
    
@router.post("/forgot-password", response_model=ApiResponse[str])
async def forgot_pwd(data: ForgotPassword,background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    user = forgot_password(session, data)
    if not user:
        raise BadRequest()
    token_data = TokenData(username=user.username, email=user.email)
    expires = timedelta(minutes=5)
    token = create_access_token(token_data, expires)
    background_tasks.add_task(send_mail,
        to=user.email,
        subject="Restablecer Contraseña",
        template_name="reset_template",
        data={
            "user_name": f"{user.first_name} {user.last_name}",
            "reset_link": f"{CONFIG.CLIENT_URL}/reset-password?token={token}",
            "expiration_time": 5
        }
    )
    return ApiResponse(data="Hemos enviado un mensaje a tu correo.")

@router.post("/reset-password", response_model=ApiResponse[str])
async def password_reset(data: ResetPassword, session: Session = Depends(get_session),  token: str | None = Query(default=None)):
    try:
        if not token:
            raise BadRequest()
        payload = jwt.decode(token, CONFIG.SECRET_KEY, algorithms=[ALGORITHM])
        payload_username = payload.get("username")
        response = reset_password(session, payload_username, data.password)

        return ApiResponse(data=response)
    except BadRequest as e:
        raise BadRequest() from e
    except ExpiredSignatureError as e:
        raise BadRequest("Token expirado") from e
    except InvalidSignatureError as e:
        raise BadRequest()
    except Exception as e:
        raise ServerError() from e
