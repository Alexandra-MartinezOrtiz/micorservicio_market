# 🛒 Backend Market JALS - FastAPI + PostgreSQL

Backend completo para sistema de e-commerce con autenticación JWT, gestión de productos, carrito de compras, chat en tiempo real y sistema de facturación.

## 🚀 Funcionalidades

### 1. Autenticación y Usuarios
- **POST** `/auth/register` - Registrar usuario
- **POST** `/auth/login` - Login con JWT
- **GET** `/users/me` - Perfil del usuario autenticado
- Hashing de contraseñas con bcrypt
- Usuario administrador creado automáticamente:
  - Email: `admin@example.com`
  - Password: `admin123`

### 2. Productos
- **CRUD completo** en `/products`
- Campos: `id`, `name`, `description`, `price`, `stock`
- 2 productos iniciales creados automáticamente:
  - Laptop ($999.99)
  - Auriculares ($199.99)

### 3. Carrito
- Carrito por usuario autenticado
- **POST** `/cart/add` - Agregar producto
- **POST** `/cart/remove` - Remover producto
- **GET** `/cart/` - Listar productos en el carrito
- **GET** `/cart/total` - Calcular total

### 4. Chat
- **REST API:**
  - **GET** `/chat/messages` - Obtener mensajes
  - **POST** `/chat/messages` - Enviar mensaje
- **WebSocket:**
  - `/ws/chat` - Mensajes en tiempo real

### 5. Facturación
- **POST** `/invoicing/create` - Crear factura desde el carrito
- **GET** `/invoicing/me` - Facturas del usuario autenticado
- **GET** `/invoicing/{id}` - Obtener factura específica

### 6. Dashboard
- **GET** `/dashboard/stats` - Métricas del sistema:
  - Total de usuarios
  - Total de productos
  - Total de facturas (ventas)
  - Total de ventas

## 🛠️ Tecnologías

- **FastAPI** - Framework web
- **SQLAlchemy** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación (python-jose)
- **bcrypt** - Hashing de contraseñas (passlib)
- **WebSocket** - Chat en tiempo real
- **Docker & Docker Compose** - Contenedores

## 📋 Requisitos

- Docker
- Docker Compose

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd backend
```

### 2. Ejecutar con Docker Compose
```bash
# Construir y ejecutar los contenedores
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up -d --build
```

### 3. Inicializar la base de datos
```bash
# En una nueva terminal, ejecutar el script de inicialización
docker-compose exec backend python -m app.init_db
```

### 4. Verificar que todo funciona
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## 🔧 Configuración

### Variables de Entorno
```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/marketdb
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Puertos
- **Backend:** 8000
- **PostgreSQL:** 5432

## 📚 Uso de la API

### 1. Registro de Usuario
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "name": "Usuario Ejemplo",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 3. Obtener Productos
```bash
curl -X GET "http://localhost:8000/products"
```

### 4. Agregar al Carrito (con token)
```bash
curl -X POST "http://localhost:8000/cart/add" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 5. Crear Factura
```bash
curl -X POST "http://localhost:8000/invoicing/create" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🔐 Autenticación

### JWT Token
- Los tokens JWT se obtienen al hacer login
- Incluir en el header: `Authorization: Bearer <token>`
- Expiración: 30 minutos por defecto

### Roles
- **Usuario normal:** Puede ver productos, usar carrito, crear facturas
- **Administrador:** Puede gestionar productos, ver todas las facturas, acceder al dashboard

## 🗄️ Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `products` - Productos disponibles
- `cart` - Carrito de compras
- `chat_messages` - Mensajes del chat
- `invoices` - Facturas
- `invoice_items` - Items de las facturas

### Inicialización
El script `init_db.py` crea automáticamente:
- Usuario administrador
- Productos de ejemplo
- Todas las tablas necesarias

## 🧪 Testing

### Endpoints de Prueba
- **GET** `/` - Mensaje de bienvenida
- **GET** `/health` - Estado del servicio

### Usuario de Prueba
- Email: `admin@example.com`
- Password: `admin123`

## 📝 Notas de Desarrollo

### Estructura del Proyecto
```
app/
├── config.py          # Configuración
├── database.py        # Configuración de BD
├── main.py           # Aplicación principal
├── init_db.py        # Inicialización de BD
├── models/           # Modelos SQLAlchemy
├── schemas/          # Esquemas Pydantic
├── repositories/     # Capa de acceso a datos
├── services/         # Lógica de negocio
├── routes/           # Endpoints de la API
├── utils/            # Utilidades (auth, etc.)
└── websocket/        # WebSocket para chat
```

### Patrones Utilizados
- **Repository Pattern** - Para acceso a datos
- **Service Layer** - Para lógica de negocio
- **Dependency Injection** - Para inyección de dependencias
- **JWT Authentication** - Para autenticación segura

## 🐛 Solución de Problemas

### Error de Conexión a la BD
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps

# Reiniciar servicios
docker-compose restart
```

### Error de Dependencias
```bash
# Reconstruir imagen
docker-compose build --no-cache
```

### Limpiar Todo
```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar volúmenes
docker volume prune
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Disfruta desarrollando con este backend! 🚀**
