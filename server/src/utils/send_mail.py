from aiosmtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import jinja2
from pathlib import Path
from src.core.config import CONFIG
from src.libs.logger import logger

current_file = Path(__file__).resolve()
SRC = current_file.parent.parent

templates_dir = SRC / "templates"
LOGO = SRC / "static/logo.jpg"

template_loader = jinja2.FileSystemLoader(searchpath=templates_dir)
template_env = jinja2.Environment(loader=template_loader)


async def send_mail(to: str, subject: str, template_name: str, data: dict) -> bool:  # 🔥 Cambio de orden
    """Función para enviar correos a los usuarios."""
    logger.info(f"Enviando correo a {to}")
    try:
        template = template_env.get_template(f"{template_name}.html")  # 🔥 Añade extensión
        html_content = template.render(**data)

        message = MIMEMultipart()
        message["From"] = CONFIG.EMAIL_USER
        message["To"] = to
        message["Subject"] = subject

        message.attach(MIMEText(html_content, "html"))

        if LOGO.exists(): 
            with open(LOGO, "rb") as img_file:
                mime_image = MIMEImage(img_file.read())
                mime_image.add_header("Content-ID", "<logo>")
                message.attach(mime_image)

        smtp = SMTP(
            hostname=CONFIG.SMTP_SERVER,
            port=CONFIG.SMTP_PORT,
            use_tls=True,
            timeout=30 
        )
        
        await smtp.connect()
        await smtp.login(CONFIG.EMAIL_USER, CONFIG.EMAIL_PASSWORD)
        await smtp.send_message(message)
        await smtp.quit() 
        
        logger.info(f"Correo enviado exitosamente a {to}")
        return True
        
    except Exception as e:
        logger.error(f"Error crítico: {str(e)}", exc_info=True)
        raise e