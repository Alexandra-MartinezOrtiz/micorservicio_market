import os
from datetime import timedelta

# Intentar cargar dotenv, pero no fallar si no está disponible
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Warning: python-dotenv not available, using system environment variables only")

# ================================
# DATABASE CONFIGURATION
# ================================
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@db:5432/marketdb"
)

# ================================
# JWT CONFIGURATION
# ================================
SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta_muy_segura_aqui")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# ================================
# PASSWORD RESET CONFIGURATION
# ================================
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", 30))

# ================================
# CORS CONFIGURATION
# ================================
# CORS permite que el frontend se conecte al backend desde diferentes puertos
CORS_ORIGINS = [
    # URLs del frontend en desarrollo - Puerto 4000 principal
    "http://localhost:4000",    # Tu frontend principal
    "http://127.0.0.1:4000",
    
    # URLs adicionales para desarrollo
    "http://localhost:3000",    # Next.js estándar
    "http://127.0.0.1:3000",
    "http://localhost:8080",    # Otros frameworks
    "http://127.0.0.1:8080",
    
    # URLs de producción (añadir cuando sea necesario)
    # "https://tu-dominio-frontend.com",
    # "https://www.tu-dominio-frontend.com",
]

# También puedes usar variables de entorno para CORS
if os.getenv("FRONTEND_URLS"):
    additional_origins = os.getenv("FRONTEND_URLS").split(",")
    CORS_ORIGINS.extend([url.strip() for url in additional_origins])

# ================================
# EMAIL CONFIGURATION (SMTP)
# ================================
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)

# Configuración para desarrollo/testing
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "false").lower() == "true"

# ================================
# FRONTEND URL CONFIGURATION
# ================================
# URL del frontend para enlaces de reset password y otros enlaces
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4000")

# ================================
# FILE UPLOAD CONFIGURATION
# ================================
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB por defecto

# ================================
# SECURITY CONFIGURATION
# ================================
# Para producción, cambiar a False
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Configuración de rate limiting
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", 60))

# ================================
# API CONFIGURATION
# ================================
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# Configuración de paginación
DEFAULT_PAGE_SIZE = int(os.getenv("DEFAULT_PAGE_SIZE", 20))
MAX_PAGE_SIZE = int(os.getenv("MAX_PAGE_SIZE", 100))