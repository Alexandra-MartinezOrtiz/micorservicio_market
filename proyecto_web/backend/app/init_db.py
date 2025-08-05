from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import user, product, cart, chat, invoice
from app.repositories.user_repository import UserRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate

# Import all models to ensure they are registered
from app.models.user import User
from app.models.product import Product
from app.models.cart import Cart
from app.models.chat import ChatMessage
from app.models.invoice import Invoice, InvoiceItem

def init_db():
    # Create all tables
    user.Base.metadata.create_all(bind=engine)
    product.Base.metadata.create_all(bind=engine)
    cart.Base.metadata.create_all(bind=engine)
    chat.Base.metadata.create_all(bind=engine)
    invoice.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin user already exists
        user_repo = UserRepository(db)
        admin_user = user_repo.get_by_email("admin@example.com")
        
        if not admin_user:
            # Create admin user
            admin_user = user_repo.create_user(
                email="admin@example.com",
                name="Administrador",
                password="admin123",
                is_admin=True
            )
            print(f"✅ Usuario administrador creado: {admin_user.email}")
        else:
            print(f"ℹ️  Usuario administrador ya existe: {admin_user.email}")
        
        # Check if products already exist
        product_repo = ProductRepository(db)
        existing_products = product_repo.get_all()
        
        if len(existing_products) == 0:
            # Create sample products
            sample_products = [
                ProductCreate(
                    name="Laptop",
                    description="Laptop de alta gama con procesador Intel i7",
                    price=999.99,
                    stock=10
                ),
                ProductCreate(
                    name="Auriculares",
                    description="Auriculares inalámbricos con cancelación de ruido",
                    price=199.99,
                    stock=25
                )
            ]
            
            for product_data in sample_products:
                product = product_repo.create(product_data)
                print(f"✅ Producto creado: {product.name} - ${product.price}")
        else:
            print(f"ℹ️  Ya existen {len(existing_products)} productos en la base de datos")
            
    except Exception as e:
        print(f"❌ Error al inicializar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Inicializando base de datos...")
    init_db()
    print("✅ Base de datos inicializada correctamente")
