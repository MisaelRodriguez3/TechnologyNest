from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, BackgroundTasks, Query, Body
import jwt
from jwt.exceptions import ExpiredSignatureError
from sqlmodel import Session
from src.core.config import CONFIG
from src.core.database import get_session
from src.core.security import create_access_token, ALGORITHM
from src.schemas.auth import AccountType, OAuth2PasswordRequestFormWithRecaptcha, TokenData, Token, OTPIn
from src.schemas.users import UserIn
from src.services.auth import register, login, generate_qr_totp, verify_totp
from src.services.users import active_account, get_user_by_email
from src.utils.send_mail import send_mail
from src.utils.exceptions import BadRequest, ServerError
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_account, get_account_by_username


router = APIRouter(tags=["Auth"])

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



@router.post("/login", response_model=ApiResponse[Token | dict[str, Any]])
def login_account(form_data: OAuth2PasswordRequestFormWithRecaptcha = Depends(), session: Session = Depends(get_session)):
    response =  login(session, form_data.username, form_data.password, form_data.recaptcha)
    return ApiResponse(data=response)
    

@router.post("/confirm-account", response_model=ApiResponse[str])
def confirm_email(session: Session = Depends(get_session), token:str = Query()):
    try:

        if not token:
            raise BadRequest()
        payload = jwt.decode(token, CONFIG.SECRET_KEY, algorithms=[ALGORITHM])
        payload_email = payload.get("email")

        if not payload_email:
            raise BadRequest("Token expirado")

        response = active_account(session, payload_email)
        return ApiResponse(data=response)
    except ExpiredSignatureError as e:
        raise BadRequest() from e
    except Exception as e:
        raise ServerError() from e


@router.post("/resend-confirmation", response_model=ApiResponse[str])
def resend_email_confirmation(email: str,background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
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

@router.post("/verify-otp")
def verify_otp(data: OTPIn, session: Session = Depends(get_session)):
    print("entrando a verify-otp")
    current_user = get_account_by_username(session, data.username)
    response =  verify_totp(data.totp_code, current_user)

    return ApiResponse(data=response)