import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import (
    SMTP_SERVER,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    FROM_EMAIL,
    FRONTEND_URL
)

def send_password_reset_email(email: str, name: str, reset_token: str) -> None:
    """Envía email con enlace para resetear contraseña"""
    
    # URL de reset (debes ajustar según tu frontend)
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    
    # Contenido del email
    subject = "Restablece tu contraseña"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Restablecer contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Restablece tu contraseña</h2>
            
            <p>Hola {name},</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
            
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" 
                   style="background-color: #3498db; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Restablecer Contraseña
                </a>
            </div>
            
            <p>Este enlace expirará en 30 minutos por seguridad.</p>
            
            <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
            
            <p>Saludos,<br>El equipo de soporte</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
                Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
                <a href="{reset_url}">{reset_url}</a>
            </p>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Hola {name},
    
    Recibimos una solicitud para restablecer la contraseña de tu cuenta.
    
    Visita el siguiente enlace para crear una nueva contraseña:
    {reset_url}
    
    Este enlace expirará en 30 minutos por seguridad.
    
    Si no solicitaste este cambio, puedes ignorar este email.
    
    Saludos,
    El equipo de soporte
    """
    
    # Crear mensaje
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = email
    
    # Añadir partes del mensaje
    text_part = MIMEText(text_body, "plain")
    html_part = MIMEText(html_body, "html")
    
    msg.attach(text_part)
    msg.attach(html_part)
    
    # Enviar email
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Error enviando email: {e}")
        raise e