from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models import User, Category, Product, Order, OrderItem
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users exist
        if db.query(User).count() == 0:
            print("Seeding initial users...")
            admin1 = User(
                email="admin@saasha.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Main Admin",
                shop_name="SAASHA Wholesale HQ",
                phone="+91 9876543210",
                address="Wholesale Hub, Warehouse 4",
                role="ADMIN"
            )
            admin2 = User(
                email="admin2@saasha.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Inventory Admin",
                shop_name="SAASHA Logistics",
                phone="+91 9876543211",
                address="Wholesale Hub, Warehouse 4",
                role="ADMIN"
            )
            shopkeeper = User(
                email="shopkeeper@saasha.com",
                hashed_password=get_password_hash("shop123"),
                full_name="Rahul Sharma",
                shop_name="Rahul Express Mart",
                phone="+91 9123456789",
                address="Shop #12, Central Market, City Center",
                role="SHOPKEEPER"
            )
            db.add_all([admin1, admin2, shopkeeper])
            db.commit()

        # Check if categories exist
        if db.query(Category).count() == 0:
            print("Seeding categories...")
            categories = [
                Category(
                    name="Electronics & Accessories",
                    slug="electronics-accessories",
                    description="Bulk mobile accessories, chargers, cables, soundbars & smart gadgets.",
                    image_url="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80"
                ),
                Category(
                    name="Packaged Foods & Groceries",
                    slug="packaged-foods-groceries",
                    description="Wholesale biscuits, instant noodles, cooking oils, snacks & staple foods.",
                    image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
                ),
                Category(
                    name="Beverages & Energy Drinks",
                    slug="beverages-energy-drinks",
                    description="Cases of soft drinks, fruit juices, packaged water & energy drinks.",
                    image_url="https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&q=80"
                ),
                Category(
                    name="Personal Care & Hygiene",
                    slug="personal-care-hygiene",
                    description="Shampoos, soaps, sanitizers, oral care & grooming wholesale cartons.",
                    image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80"
                ),
                Category(
                    name="Home Cleaning & Supplies",
                    slug="home-cleaning-supplies",
                    description="Detergents, floor cleaners, dishwash bars & paper towels in bulk boxes.",
                    image_url="https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80"
                )
            ]
            db.add_all(categories)
            db.commit()

        # Check if products exist
        if db.query(Product).count() == 0:
            print("Seeding wholesale products...")
            cat_elec = db.query(Category).filter(Category.slug == "electronics-accessories").first()
            cat_food = db.query(Category).filter(Category.slug == "packaged-foods-groceries").first()
            cat_bev = db.query(Category).filter(Category.slug == "beverages-energy-drinks").first()
            cat_care = db.query(Category).filter(Category.slug == "personal-care-hygiene").first()
            cat_clean = db.query(Category).filter(Category.slug == "home-cleaning-supplies").first()

            products = [
                Product(
                    name="FastCharge Type-C Braided Cable 65W (Pack of 20)",
                    sku="ELEC-CBL-001",
                    category_id=cat_elec.id,
                    description="High durability braided 65W Type-C fast charging cables. Retail margin: 45%.",
                    image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
                    unit="Box (20 pcs)",
                    wholesale_price=1200.0,
                    retail_mrp=2400.0,
                    moq=2,
                    stock_quantity=150,
                    is_featured=True,
                    is_new=True,
                    badge_text="High Margin 50%"
                ),
                Product(
                    name="Wireless Bluetooth Earbuds Pro (Carton of 10)",
                    sku="ELEC-EAR-002",
                    category_id=cat_elec.id,
                    description="Stereo sound, HD mic, 24hr battery back-up earbuds box set. Great impulse buy item for retail counters.",
                    image_url="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
                    unit="Carton (10 units)",
                    wholesale_price=4500.0,
                    retail_mrp=8990.0,
                    moq=1,
                    stock_quantity=80,
                    is_featured=True,
                    is_new=False,
                    badge_text="Hot Seller"
                ),
                Product(
                    name="Crunchy Whole Wheat Biscuit Box (24 Packs)",
                    sku="FOOD-BSC-001",
                    category_id=cat_food.id,
                    description="Freshly baked crispy wheat digestive biscuits. Long 9-month shelf life. Fast turnover product for grocery stores.",
                    image_url="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
                    unit="Box (24 packs)",
                    wholesale_price=480.0,
                    retail_mrp=720.0,
                    moq=5,
                    stock_quantity=500,
                    is_featured=True,
                    is_new=True,
                    badge_text="Fast Moving"
                ),
                Product(
                    name="Instant Curry Noodle Brick Pack (36 Units)",
                    sku="FOOD-NDL-002",
                    category_id=cat_food.id,
                    description="Popular spicy instant noodles. High consumer demand and quick retail store velocity.",
                    image_url="https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&q=80",
                    unit="Case (36 units)",
                    wholesale_price=540.0,
                    retail_mrp=900.0,
                    moq=4,
                    stock_quantity=350,
                    is_featured=False,
                    is_new=True,
                    badge_text="New Formula"
                ),
                Product(
                    name="Sparkling Citrus Energy Drink Cans (24 x 250ml)",
                    sku="BEV-ENG-001",
                    category_id=cat_bev.id,
                    description="Chilled refresh energy drink case. Eye-catching can packaging for display refrigerators.",
                    image_url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
                    unit="Crate (24 cans)",
                    wholesale_price=840.0,
                    retail_mrp=1440.0,
                    moq=3,
                    stock_quantity=200,
                    is_featured=True,
                    is_new=False,
                    badge_text="Top Profit"
                ),
                Product(
                    name="Natural Alphonso Mango Juice Bottles (12 x 1L)",
                    sku="BEV-JUC-002",
                    category_id=cat_bev.id,
                    description="100% fruit pulp mango nectar 1 Liter PET bottles. Sealed fresh in master cartons.",
                    image_url="https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80",
                    unit="Case (12 bottles)",
                    wholesale_price=720.0,
                    retail_mrp=1200.0,
                    moq=2,
                    stock_quantity=180,
                    is_featured=False,
                    is_new=False,
                    badge_text="Popular"
                ),
                Product(
                    name="Antibacterial Herbal Handwash Refill (Pack of 12 x 500ml)",
                    sku="CARE-HND-001",
                    category_id=cat_care.id,
                    description="Aloe Vera & Neem germ protection liquid hand wash refill pouches. High consumer retention.",
                    image_url="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80",
                    unit="Box (12 pouches)",
                    wholesale_price=600.0,
                    retail_mrp=1080.0,
                    moq=3,
                    stock_quantity=240,
                    is_featured=False,
                    is_new=True,
                    badge_text="Bulk Value"
                ),
                Product(
                    name="Charcoal Fresh Toothpaste Twin Pack (16 Packs)",
                    sku="CARE-TP-002",
                    category_id=cat_care.id,
                    description="Activated charcoal whitening toothpaste twin value packs.",
                    image_url="https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&q=80",
                    unit="Carton (16 packs)",
                    wholesale_price=1120.0,
                    retail_mrp=1920.0,
                    moq=2,
                    stock_quantity=160,
                    is_featured=True,
                    is_new=False,
                    badge_text="Best Value"
                ),
                Product(
                    name="Ultra Clean Detergent Powder 1kg (12 Bags)",
                    sku="CLN-DET-001",
                    category_id=cat_clean.id,
                    description="Stain remover washing powder bulk bundle. High margin utility staple.",
                    image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
                    unit="Bundle (12 bags)",
                    wholesale_price=780.0,
                    retail_mrp=1320.0,
                    moq=4,
                    stock_quantity=300,
                    is_featured=False,
                    is_new=False,
                    badge_text="Essential"
                ),
                Product(
                    name="Surface Sanitizer Spray 500ml (12 Bottles)",
                    sku="CLN-SAN-002",
                    category_id=cat_clean.id,
                    description="Multi-surface 99.9% virus protection spray for home and commercial stores.",
                    image_url="https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80",
                    unit="Box (12 bottles)",
                    wholesale_price=960.0,
                    retail_mrp=1800.0,
                    moq=2,
                    stock_quantity=110,
                    is_featured=False,
                    is_new=True,
                    badge_text="Commercial"
                )
            ]
            db.add_all(products)
            db.commit()

        print("Database initialized successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
