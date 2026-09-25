from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db.database import get_db
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut, CategoryCreate, CategoryOut
from app.schemas.order import OrderOut, OrderStatusUpdate
from app.schemas.user import UserOut
from app.core.security import require_admin, require_superadmin

router = APIRouter(prefix="/admin", tags=["Admin Operations"], dependencies=[Depends(require_admin)])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "PENDING").count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_products = db.query(Product).count()
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 20).count()
    total_shopkeepers = db.query(User).filter(User.role == "SHOPKEEPER").count()
    total_admins = db.query(User).filter(User.role == "ADMIN").count()
    total_superadmins = db.query(User).filter(User.role == "SUPERADMIN").count()

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": round(total_revenue, 2),
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "total_shopkeepers": total_shopkeepers,
        "total_admins": total_admins,
        "total_superadmins": total_superadmins
    }

# Products Management
@router.post("/products", response_model=ProductOut)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    existing_sku = db.query(Product).filter(Product.sku == product_in.sku).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail=f"Product with SKU '{product_in.sku}' already exists.")

    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# Category Management
@router.post("/categories", response_model=CategoryOut)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists.")

    category = Category(**category_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

# Order Management
@router.get("/orders", response_model=List[OrderOut])
def get_all_orders(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(Order.id.desc()).all()

@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, status_in: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = ["PENDING", "APPROVED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
    if status_in.status.upper() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    order.status = status_in.status.upper()
    db.commit()
    db.refresh(order)
    return order

# Users / Role Management (SUPERADMIN, ADMIN, SHOPKEEPER)
@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()

@router.patch("/users/{user_id}/role")
def change_user_role(
    user_id: int, 
    role: str, 
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    role_upper = role.upper()
    if role_upper not in ["SUPERADMIN", "ADMIN", "SHOPKEEPER"]:
        raise HTTPException(status_code=400, detail="Role must be 'SUPERADMIN', 'ADMIN' or 'SHOPKEEPER'")

    # Only SUPERADMIN can promote someone to SUPERADMIN or demote a SUPERADMIN
    if (role_upper == "SUPERADMIN" or current_user.role != "SUPERADMIN") and current_user.role != "SUPERADMIN":
        raise HTTPException(status_code=403, detail="Only the Superadmin can assign or change Superadmin privileges.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role_upper
    db.commit()
    return {"message": f"User role updated to {role_upper}", "user_id": user_id, "role": role_upper}
