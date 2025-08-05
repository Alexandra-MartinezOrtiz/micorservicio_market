# 🎣 Guía de Uso de Hooks - FastAPI Integration

Esta guía muestra cómo usar los hooks personalizados para integrar tu frontend Next.js con el backend de FastAPI.

## 📋 Hooks Disponibles

### 🔐 `useAuth` - Autenticación
```typescript
import { useAuth } from '@/lib/hooks';

const MyComponent = () => {
  const { 
    user, 
    loading, 
    error, 
    isAuthenticated, 
    login, 
    register, 
    logout 
  } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (success) {
      // Redirigir al dashboard
      router.push('/dashboard');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <div>No autenticado</div>;

  return (
    <div>
      <p>Bienvenido, {user?.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

### 📦 `useProducts` - Gestión de Productos
```typescript
import { useProducts } from '@/lib/hooks';

const ProductsList = () => {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  const handleCreateProduct = async () => {
    const success = await createProduct({
      name: 'Nuevo Producto',
      description: 'Descripción del producto',
      price: 99.99,
      stock: 10
    });

    if (success) {
      alert('Producto creado exitosamente');
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
};
```

### 🛒 `useCart` - Carrito de Compras
```typescript
import { useCart } from '@/lib/hooks';

const CartComponent = () => {
  const { 
    items, 
    total, 
    loading, 
    addToCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  const handleAddToCart = async (productId: number) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Producto agregado al carrito');
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    await updateQuantity(productId, quantity);
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.product.name}</span>
          <span>Cantidad: {item.quantity}</span>
          <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>
            -
          </button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
};
```

### 💬 `useChat` - Chat en Tiempo Real
```typescript
import { useChat } from '@/lib/hooks';

const ChatComponent = () => {
  const { 
    messages, 
    loading, 
    error, 
    connected, 
    sendMessage 
  } = useChat();

  const handleSendMessage = async (message: string) => {
    const success = await sendMessage(message);
    if (success) {
      // El mensaje se envió correctamente
      // Los nuevos mensajes llegarán automáticamente via WebSocket
    }
  };

  return (
    <div>
      <div className="connection-status">
        {connected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>
      
      <div className="messages">
        {messages.map(message => (
          <div key={message.id}>
            <span>{message.message}</span>
            <small>{new Date(message.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.message;
        handleSendMessage(input.value);
        input.value = '';
      }}>
        <input name="message" placeholder="Escribe un mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
```

### 🧾 `useInvoicing` - Facturación
```typescript
import { useInvoicing } from '@/lib/hooks';

const InvoicingComponent = () => {
  const { 
    invoices, 
    loading, 
    createInvoice, 
    getInvoicesByStatus 
  } = useInvoicing();

  const handleCreateInvoice = async (cartItems: any[]) => {
    const invoice = await createInvoice(cartItems);
    if (invoice) {
      alert(`Factura creada: ${invoice.invoice_number}`);
    }
  };

  const pendingInvoices = getInvoicesByStatus('pending');
  const paidInvoices = getInvoicesByStatus('paid');

  return (
    <div>
      <h2>Mis Facturas</h2>
      
      <h3>Pendientes ({pendingInvoices.length})</h3>
      {pendingInvoices.map(invoice => (
        <div key={invoice.id}>
          <p>Factura #{invoice.invoice_number}</p>
          <p>Total: ${invoice.total_amount}</p>
        </div>
      ))}

      <h3>Pagadas ({paidInvoices.length})</h3>
      {paidInvoices.map(invoice => (
        <div key={invoice.id}>
          <p>Factura #{invoice.invoice_number}</p>
          <p>Total: ${invoice.total_amount}</p>
        </div>
      ))}
    </div>
  );
};
```

### 📊 `useDashboard` - Estadísticas
```typescript
import { useDashboard } from '@/lib/hooks';

const DashboardComponent = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles</div>;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Usuarios</h3>
        <p>{stats.total_users}</p>
      </div>
      
      <div className="stat-card">
        <h3>Total Productos</h3>
        <p>{stats.total_products}</p>
      </div>
      
      <div className="stat-card">
        <h3>Total Ventas</h3>
        <p>${stats.total_sales}</p>
      </div>
    </div>
  );
};
```

## 🛡️ Layout Protegido

```typescript
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';

// Para rutas que requieren autenticación
const ProtectedPage = () => {
  return (
    <ProtectedLayout>
      <div>Contenido protegido</div>
    </ProtectedLayout>
  );
};

// Para rutas que requieren ser admin
const AdminPage = () => {
  return (
    <ProtectedLayout requireAdmin={true}>
      <div>Contenido solo para administradores</div>
    </ProtectedLayout>
  );
};
```

## 🔧 Configuración

### 1. Variables de Entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Backend FastAPI
Asegúrate de que tu backend tenga CORS configurado:
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

## 🚨 Manejo de Errores

Todos los hooks incluyen manejo de errores:

```typescript
const { error, clearError } = useAuth();

if (error) {
  return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={clearError}>Cerrar</button>
    </div>
  );
}
```

## 🔄 Estados de Carga

Todos los hooks incluyen estados de carga:

```typescript
const { loading } = useProducts();

if (loading) {
  return <div>Cargando...</div>;
}
```

## 📝 Notas Importantes

1. **Autenticación**: Los hooks manejan automáticamente los tokens JWT
2. **WebSocket**: El chat se conecta automáticamente al WebSocket
3. **Reconexión**: El WebSocket se reconecta automáticamente si se pierde la conexión
4. **Caché**: Los datos se mantienen en el estado local de React
5. **Errores**: Todos los errores se capturan y muestran de forma consistente

## 🎯 Próximos Pasos

1. **Integrar en componentes**: Usar estos hooks en tus componentes existentes
2. **Testing**: Crear tests para los hooks
3. **Optimización**: Implementar cache y optimizaciones de performance
4. **Offline**: Agregar soporte offline básico 