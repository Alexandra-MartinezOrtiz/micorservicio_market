from sqlalchemy.orm import Session
from app.models.invoice import Invoice, InvoiceItem
from app.models.product import Product
from app.schemas.invoice import InvoiceCreate
from typing import List, Optional
import uuid

class InvoiceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_invoices(self, user_id: int) -> List[Invoice]:
        return self.db.query(Invoice).filter(Invoice.user_id == user_id).order_by(Invoice.created_at.desc()).all()

    def get_invoice_by_id(self, invoice_id: int) -> Optional[Invoice]:
        return self.db.query(Invoice).filter(Invoice.id == invoice_id).first()

    def create_invoice(self, user_id: int, invoice_data: InvoiceCreate) -> Invoice:
        # Generate unique invoice number
        invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        
        # Create invoice
        db_invoice = Invoice(
            user_id=user_id,
            invoice_number=invoice_number,
            total_amount=invoice_data.total_amount
        )
        self.db.add(db_invoice)
        self.db.flush()  # Get the invoice ID

        # Create invoice items
        for item_data in invoice_data.items:
            product = self.db.query(Product).filter(Product.id == item_data.product_id).first()
            if not product:
                raise ValueError(f"Producto con ID {item_data.product_id} no encontrado")
            
            db_invoice_item = InvoiceItem(
                invoice_id=db_invoice.id,
                product_id=item_data.product_id,
                product_name=product.name,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                total_price=item_data.quantity * item_data.unit_price
            )
            self.db.add(db_invoice_item)

        self.db.commit()
        self.db.refresh(db_invoice)
        return db_invoice

    def get_all_invoices(self) -> List[Invoice]:
        return self.db.query(Invoice).order_by(Invoice.created_at.desc()).all()

    def get_total_sales(self) -> float:
        result = self.db.query(Invoice.total_amount).filter(Invoice.status == "paid").all()
        return sum(row[0] for row in result) if result else 0.0 