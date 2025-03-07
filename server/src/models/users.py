from sqlmodel import Field
import pyotp
from .common import Base
from sqlalchemy import event, inspect
from src.core.security import hash_password, encrypt_data

IMAGE = "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"

class User(Base, table=True):
    """Representation of the `tbl_users` table of the database"""

    __tablename__ = "tbl_users"
    
    first_name: str = Field(nullable=False, min_length=5, max_length=100)
    last_name: str = Field(nullable=False, min_length=5, max_length=100)
    username: str = Field(min_length=5, max_length=20, index=True, unique=True)
    email: str = Field(nullable=False, unique=True, index=True)
    password: str = Field(nullable=False, min_length=8, max_length=255)
    is_confirmed: bool = Field(default=False)
    mfa_active: bool = Field(default=False)
    totp_secret: str = Field(nullable=True)
    image_url: str = Field(default=IMAGE, nullable=False, max_length=255)


@event.listens_for(User, "before_insert")
def hash_password_on_insert(mapper, connection, target: User):
    """Hash password before user creation"""
    target.password = hash_password(target.password)

@event.listens_for(User, "before_update")
def hash_password_on_update(mapper, connection, target: User):
    """Hash password only if changed during updates"""
    insp = inspect(target)
    if insp.attrs.password.history.has_changes():
        target.password = hash_password(target.password)

@event.listens_for(User, "before_update")
def encrypt_totp_secret(mapper, connection, target: User):
    """Encrypt TOTP secret when modified and MFA is active"""
    insp = inspect(target)
    
    if not insp.attrs.mfa_active.history.has_changes():
        return
    
    if target.mfa_active:
        target.totp_secret = encrypt_data(pyotp.random_base32())
    elif not target.mfa_active:
        # Clear TOTP secret if MFA is deactivated
        target.totp_secret = None