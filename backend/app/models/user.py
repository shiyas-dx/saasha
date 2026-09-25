from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    shop_name = Column(String, nullable=True)  # Name of retail shop for shopkeepers
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    role = Column(String, default="SHOPKEEPER", nullable=False) # "ADMIN" or "SHOPKEEPER"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="user")
