import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut
from app.core.security import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderOut)
def create_order(order_in: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_number = f"SA-{uuid.uuid4().hex[:8].upper()}"
    total_amount = 0.0
    total_items = 0
    order_items_to_create = []

    for item_in in order_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item_in.product_id} not found")
        
        if item_in.quantity < product.moq:
            raise HTTPException(
                status_code=400, 
                detail=f"Product '{product.name}' requires a minimum order quantity of {product.moq}."
            )
        
        if product.stock_quantity < item_in.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}"
            )

        subtotal = product.wholesale_price * item_in.quantity
        total_amount += subtotal
        total_items += item_in.quantity

        order_items_to_create.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                unit_price=product.wholesale_price,
                quantity=item_in.quantity,
                subtotal=subtotal
            )
        )

        # Deduct stock
        product.stock_quantity -= item_in.quantity

    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        total_amount=total_amount,
        total_items=total_items,
        status="PENDING",
        shipping_address=order_in.shipping_address,
        contact_phone=order_in.contact_phone,
        notes=order_in.notes
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_items_to_create:
        item.order_id = order.id
        db.add(item)
    
    db.commit()
    db.refresh(order)

    return order

@router.get("", response_model=List[OrderOut])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "ADMIN":
        # Admin can view all orders in user orders endpoint or admin endpoint
        return db.query(Order).order_by(Order.id.desc()).all()
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).all()

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "ADMIN" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return order
