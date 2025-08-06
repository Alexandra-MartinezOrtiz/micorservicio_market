
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, user_routes, product_routes, cart_routes, chat_routes, invoice_routes, dashboard_routes
from app.websocket.chat import websocket_endpoint
from app.config import CORS_ORIGINS
from prometheus_fastapi_instrumentator import Instrumentator
import logging



# Configuración de logs estructurados
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

logger = logging.getLogger("market-backend")

app = FastAPI(
    title="Backend Market JALS",
    description="API completa para sistema de e-commerce con autenticación, productos, carrito, chat y facturación",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(auth_routes.router, prefix="/auth", tags=["Autenticación"])
app.include_router(user_routes.router, prefix="/users", tags=["Usuarios"])
app.include_router(product_routes.router, prefix="/products", tags=["Productos"])
app.include_router(cart_routes.router, prefix="/cart", tags=["Carrito"])
app.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])
app.include_router(invoice_routes.router, prefix="/invoicing", tags=["Facturación"])
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])

# WebSocket endpoint
app.add_websocket_route("/ws/chat", websocket_endpoint)


@app.get("/")
def root():
    logger.info("Acceso a endpoint raíz /")
    return {
        "message": "Bienvenido al Backend Market JALS",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    logger.info("Health check solicitado")
    return {"status": "healthy"}



# Instrumentación Prometheus
Instrumentator().instrument(app).expose(app)

# Ejemplo de log en un endpoint (puedes agregar logs similares en tus rutas y servicios)
# logger.info("Usuario autenticado correctamente: %s", user.email)
# logger.error("Error al autenticar usuario: %s", error)