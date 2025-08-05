from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.invoice_repository import InvoiceRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.dashboard import DashboardStats

class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.invoice_repo = InvoiceRepository(db)
        self.product_repo = ProductRepository(db)

    def get_stats(self) -> DashboardStats:
        total_users = self.user_repo.get_total_users()
        total_products = self.product_repo.get_total_products()
        total_invoices = len(self.invoice_repo.get_all_invoices())
        total_sales = self.invoice_repo.get_total_sales()

        return DashboardStats(
            total_users=total_users,
            total_products=total_products,
            total_invoices=total_invoices,
            total_sales=total_sales
        ) 