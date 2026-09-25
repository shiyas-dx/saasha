from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from app.db.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductOut, ProductListResponse, CategoryOut

router = APIRouter(tags=["Products & Categories"])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/products", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    query: Optional[str] = Query(None, description="Search term for name, description, or SKU"),
    category_id: Optional[int] = Query(None),
    is_featured: Optional[bool] = Query(None),
    is_new: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("newest", description="newest, price_asc, price_desc, name_asc, popularity"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100)
):
    stmt = db.query(Product)

    if query:
        search_pattern = f"%{query}%"
        stmt = stmt.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.description.ilike(search_pattern),
                Product.sku.ilike(search_pattern)
            )
        )

    if category_id:
        stmt = stmt.filter(Product.category_id == category_id)

    if is_featured is not None:
        stmt = stmt.filter(Product.is_featured == is_featured)

    if is_new is not None:
        stmt = stmt.filter(Product.is_new == is_new)

    if min_price is not None:
        stmt = stmt.filter(Product.wholesale_price >= min_price)

    if max_price is not None:
        stmt = stmt.filter(Product.wholesale_price <= max_price)

    if sort_by == "price_asc":
        stmt = stmt.order_by(Product.wholesale_price.asc())
    elif sort_by == "price_desc":
        stmt = stmt.order_by(Product.wholesale_price.desc())
    elif sort_by == "name_asc":
        stmt = stmt.order_by(Product.name.asc())
    else:  # newest
        stmt = stmt.order_by(Product.id.desc())

    total = stmt.count()
    offset = (page - 1) * limit
    items = stmt.offset(offset).limit(limit).all()
    pages = (total + limit - 1) // limit if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": pages
    }

@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
