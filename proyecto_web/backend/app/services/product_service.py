from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate, Product
from typing import List

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.product_repo = ProductRepository(db)

    def get_all_products(self) -> List[Product]:
        return self.product_repo.get_all()

    def get_product_by_id(self, product_id: int) -> Product:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return product

    def create_product(self, product_data: ProductCreate) -> Product:
        return self.product_repo.create(product_data)

    def update_product(self, product_id: int, product_data: ProductUpdate) -> Product:
        product = self.product_repo.update(product_id, product_data)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return product

    def delete_product(self, product_id: int) -> dict:
        success = self.product_repo.delete(product_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return {"message": "Producto eliminado exitosamente"}

    def get_total_products(self) -> int:
        return self.product_repo.get_total_products() 