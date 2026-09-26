from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserOut

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    contact_phone: str
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str # PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    tracking_number: Optional[str] = None
    courier_name: Optional[str] = None
    estimated_delivery: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    order_number: str
    user_id: int
    total_amount: float
    total_items: int
    status: str
    shipping_address: str
    contact_phone: str
    notes: Optional[str] = None
    tracking_number: Optional[str] = None
    courier_name: Optional[str] = None
    estimated_delivery: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut] = []
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True
