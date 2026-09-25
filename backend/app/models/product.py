from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    unit = Column(String, default="Box (12 pcs)", nullable=False) # e.g. Box, Carton, Pack, Dozen, Piece
    wholesale_price = Column(Float, nullable=False) # Supplier price to shopkeeper per unit
    retail_mrp = Column(Float, nullable=False) # Retail MRP per unit for profit estimation
    moq = Column(Integer, default=1, nullable=False) # Minimum Order Quantity
    stock_quantity = Column(Integer, default=100, nullable=False)
    is_featured = Column(Boolean, default=False)
    is_new = Column(Boolean, default=True)
    badge_text = Column(String, nullable=True) # e.g. "Best Seller", "High Margin", "Hot Offer"
    specifications = Column(Text, nullable=True) # JSON or plain text key-value specs
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
