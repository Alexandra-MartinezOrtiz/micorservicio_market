from pydantic import BaseModel
from typing import List
from datetime import datetime

class InvoiceItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class InvoiceItem(InvoiceItemBase):
    id: int
    product_name: str
    total_price: float

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    total_amount: float

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemBase]

class Invoice(InvoiceBase):
    id: int
    user_id: int
    invoice_number: str
    status: str
    created_at: datetime
    items: List[InvoiceItem]

    class Config:
        from_attributes = True

class InvoiceList(BaseModel):
    invoices: List[Invoice] 