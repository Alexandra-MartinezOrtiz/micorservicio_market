from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_invoices: int
    total_sales: float 