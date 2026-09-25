from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: int
    description: Optional[str] = None
    image_url: Optional[str] = None
    unit: str = "Box (12 pcs)"
    wholesale_price: float
    retail_mrp: float
    moq: int = 1
    stock_quantity: int = 100
    is_featured: bool = False
    is_new: bool = True
    badge_text: Optional[str] = None
    specifications: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    unit: Optional[str] = None
    wholesale_price: Optional[float] = None
    retail_mrp: Optional[float] = None
    moq: Optional[int] = None
    stock_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    is_new: Optional[bool] = None
    badge_text: Optional[str] = None
    specifications: Optional[str] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    pages: int
