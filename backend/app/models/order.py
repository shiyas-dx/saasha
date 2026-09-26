from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    total_items = Column(Integer, nullable=False)
    status = Column(String, default="PENDING", nullable=False) # PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    shipping_address = Column(Text, nullable=False)
    contact_phone = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    
    # Advanced Dispatch & Tracking Fields
    tracking_number = Column(String, nullable=True) # e.g. TRK-88992211
    courier_name = Column(String, nullable=True)    # e.g. BlueDart B2B / Delhivery Express
    estimated_delivery = Column(String, nullable=True) # e.g. 28 Sep 2026
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
