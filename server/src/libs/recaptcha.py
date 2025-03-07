import requests
from src.core.config import CONFIG
from src.utils.exceptions import BadRequest

def verify_captcha(token: str) -> bool:
    response = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={
            "secret": CONFIG.RECAPTCHA_SECRET_KEY,
            "response": token
        }
    )

    result = response.json()
    if not result.get("success"):
        raise BadRequest()

    return True