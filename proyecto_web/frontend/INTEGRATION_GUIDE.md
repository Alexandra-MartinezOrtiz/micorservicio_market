# 🚀 Guía de Integración con Backend FastAPI

Esta guía explica cómo integrar el frontend de Next.js con el backend de FastAPI.

## 📋 Cambios Realizados

### 1. Configuración de API
- ✅ Creado `src/lib/config/api.ts` con configuración de endpoints
- ✅ Configurada URL base: `http://localhost:8000`
- ✅ Implementadas funciones helper para requests autenticados

### 2. Tipos Actualizados
- ✅ `src/types/auth.ts` - Tipos de autenticación para FastAPI
- ✅ `src/types/product.ts` - Tipos de productos simplificados
- ✅ `src/types/cart.ts` - Nuevos tipos para carrito de compras
- ✅ `src/types/invoicing.ts` - Tipos para sistema de facturación
- ✅ `src/types/chat.ts` - Tipos de chat actualizados

### 3. Servicios Actualizados
- ✅ `src/lib/services/auth-service.ts` - Autenticación con JWT
- ✅ `src/lib/services/product-service.ts` - CRUD de productos
- ✅ `src/lib/services/cart-service.ts` - Gestión del carrito
- ✅ `src/lib/services/invoicing-service.ts` - Sistema de facturación
- ✅ `src/lib/services/chat-service.ts` - Chat con WebSocket
- ✅ `src/lib/services/user-service.ts` - Gestión de usuarios

### 4. Contexto de Autenticación
- ✅ `src/lib/auth/auth-context.tsx` - Actualizado para usar FastAPI
- ✅ Manejo de tokens JWT en localStorage
- ✅ Verificación automática de autenticación

## 🔧 Configuración Requerida

### 1. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. CORS en el Backend
Asegúrate de que tu backend FastAPI tenga CORS configurado para permitir requests desde `http://localhost:3000`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Endpoints Integrados

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login con JWT
- `GET /users/me` - Perfil del usuario autenticado

### Productos
- `GET /products` - Listar productos
- `GET /products/{id}` - Obtener producto específico
- `POST /products` - Crear producto (admin/employee)
- `PUT /products/{id}` - Actualizar producto
- `DELETE /products/{id}` - Eliminar producto

### Carrito
- `GET /cart` - Obtener carrito del usuario
- `POST /cart/add` - Agregar producto al carrito
- `POST /cart/remove` - Remover producto del carrito
- `GET /cart/total` - Obtener total del carrito

### Chat
- `GET /chat/messages` - Obtener mensajes
- `POST /chat/messages` - Enviar mensaje
- `WS /ws/chat` - WebSocket para mensajes en tiempo real

### Facturación
- `POST /invoicing/create` - Crear factura desde carrito
- `GET /invoicing/me` - Facturas del usuario
- `GET /invoicing/{id}` - Obtener factura específica

### Dashboard
- `GET /dashboard/stats` - Estadísticas del sistema

## 🔐 Autenticación JWT

El sistema ahora usa JWT tokens en lugar de Firebase:

1. **Login/Register**: Se obtiene un token JWT del backend
2. **Almacenamiento**: El token se guarda en `localStorage`
3. **Requests**: Se incluye automáticamente en el header `Authorization: Bearer <token>`
4. **Verificación**: Se verifica la validez del token en cada request

## 🛠️ Uso de los Servicios

### Autenticación
```typescript
import { authService } from '@/lib/services/auth-service';

// Login
const authData = await authService.login({ email, password });

// Register
const authData = await authService.register({ email, password, display_name });

// Obtener usuario actual
const user = await authService.getCurrentUser();
```

### Productos
```typescript
import { productService } from '@/lib/services/product-service';

// Listar productos
const products = await productService.getAllProducts();

// Crear producto
const newProduct = await productService.createProduct({
  name: 'Producto',
  description: 'Descripción',
  price: 99.99,
  stock: 10
});
```

### Carrito
```typescript
import { cartService } from '@/lib/services/cart-service';

// Obtener carrito
const cart = await cartService.getCart();

// Agregar producto
await cartService.addToCart({ product_id: 1, quantity: 2 });
```

## 🚨 Consideraciones Importantes

1. **CORS**: Asegúrate de que el backend permita requests desde el frontend
2. **Tokens**: Los tokens JWT se almacenan en localStorage (considera usar httpOnly cookies para mayor seguridad)
3. **Errores**: Todos los servicios manejan errores de forma consistente
4. **Tipos**: Los tipos TypeScript están actualizados para coincidir con la API

## 🔄 Migración de Firebase

Si estabas usando Firebase anteriormente:

1. **Autenticación**: Cambiado de Firebase Auth a JWT
2. **Base de datos**: Cambiado de Firestore a PostgreSQL
3. **Storage**: Eliminado (puedes agregar endpoints para manejo de archivos)
4. **WebSocket**: Cambiado de Socket.IO a WebSocket nativo

## 📝 Próximos Pasos

1. **Probar la integración** con el backend corriendo
2. **Actualizar componentes** que usen los servicios antiguos
3. **Implementar manejo de errores** en la UI
4. **Agregar loading states** para mejor UX
5. **Configurar variables de entorno** para diferentes entornos

## 🆘 Solución de Problemas

### Error de CORS
- Verifica que el backend tenga CORS configurado correctamente
- Asegúrate de que las URLs coincidan exactamente

### Error de Autenticación
- Verifica que el token JWT sea válido
- Revisa que el backend esté generando tokens correctamente

### Error de Conexión
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Revisa la configuración de la URL en `src/lib/config/api.ts` 