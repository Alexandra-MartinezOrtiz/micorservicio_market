from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.invoice import Invoice, InvoiceList
from app.services.invoice_service import InvoiceService
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=Invoice)
def create_invoice(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear factura desde el carrito del usuario"""
    invoice_service = InvoiceService(db)
    return invoice_service.create_invoice_from_cart(current_user.id)

@router.get("/me", response_model=InvoiceList)
def get_user_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener facturas del usuario autenticado"""
    invoice_service = InvoiceService(db)
    return invoice_service.get_user_invoices(current_user.id)

@router.get("/{invoice_id}", response_model=Invoice)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener una factura específica"""
    invoice_service = InvoiceService(db)
    invoice = invoice_service.get_invoice_by_id(invoice_id)
    
    # Check if user owns the invoice or is admin
    if invoice.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver esta factura"
        )
    
    return invoice

@router.get("/admin/all", response_model=InvoiceList)
def get_all_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener todas las facturas (solo admin)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden ver todas las facturas"
        )
    invoice_service = InvoiceService(db)
    return invoice_service.get_all_invoices() 