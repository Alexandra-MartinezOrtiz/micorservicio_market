from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.invoice_repository import InvoiceRepository
from app.repositories.cart_repository import CartRepository
from app.schemas.invoice import InvoiceCreate, Invoice, InvoiceList
from typing import List

class InvoiceService:
    def __init__(self, db: Session):
        self.db = db
        self.invoice_repo = InvoiceRepository(db)
        self.cart_repo = CartRepository(db)

    def get_user_invoices(self, user_id: int) -> InvoiceList:
        invoices = self.invoice_repo.get_user_invoices(user_id)
        return InvoiceList(invoices=invoices)

    def create_invoice_from_cart(self, user_id: int) -> Invoice:
        # Get user cart
        cart_items = self.cart_repo.get_user_cart(user_id)
        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El carrito está vacío"
            )

        # Calculate total
        total_amount = self.cart_repo.get_cart_total(user_id)

        # Create invoice items from cart
        invoice_items = []
        for cart_item in cart_items:
            product = cart_item.product
            invoice_items.append({
                "product_id": cart_item.product_id,
                "quantity": cart_item.quantity,
                "unit_price": product.price
            })

        # Create invoice
        invoice_data = InvoiceCreate(
            total_amount=total_amount,
            items=invoice_items
        )

        invoice = self.invoice_repo.create_invoice(user_id, invoice_data)

        # Clear cart after creating invoice
        self.cart_repo.clear_cart(user_id)

        return invoice

    def get_invoice_by_id(self, invoice_id: int) -> Invoice:
        invoice = self.invoice_repo.get_invoice_by_id(invoice_id)
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Factura no encontrada"
            )
        return invoice

    def get_all_invoices(self) -> InvoiceList:
        invoices = self.invoice_repo.get_all_invoices()
        return InvoiceList(invoices=invoices)

    def get_total_sales(self) -> float:
        return self.invoice_repo.get_total_sales() 