from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models import User, Category, Product, Order, OrderItem
from app.core.security import get_password_hash
from app.core.config import settings

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check or create Superadmin from ENV configuration
        superadmin_user = db.query(User).filter(User.email == settings.SUPERADMIN_EMAIL).first()
        if not superadmin_user:
            print(f"Seeding Superadmin account from ENV ({settings.SUPERADMIN_EMAIL})...")
            super_admin = User(
                email=settings.SUPERADMIN_EMAIL,
                hashed_password=get_password_hash(settings.SUPERADMIN_PASSWORD),
                full_name=settings.SUPERADMIN_NAME,
                shop_name="SAASHA Global HQ",
                phone="+91 9999999999",
                address="SAASHA HQ Executive Desk",
                role="SUPERADMIN"
            )
            db.add(super_admin)
            db.commit()

        # Check standard categories
        if db.query(Category).count() == 0:
            print("Seeding Mobile Phone Parts Categories...")
            categories = [
                Category(
                    name="OLED & LCD Displays",
                    slug="display-assemblies",
                    description="Original Service Pack & OEM Grade A+ OLED / AMOLED screen assemblies for iPhone, Samsung, Xiaomi & OnePlus.",
                    image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80"
                ),
                Category(
                    name="Batteries & Power Cells",
                    slug="batteries-power-cells",
                    description="High capacity zero-cycle original battery packs with TI IC protection boards.",
                    image_url="https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&q=80"
                ),
                Category(
                    name="Charging Ports & Flex Cables",
                    slug="charging-flex-cables",
                    description="Type-C & Lightning charging port flex boards, mic flex, volume/power button flex ribbons.",
                    image_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"
                ),
                Category(
                    name="IC Chips & Motherboard Components",
                    slug="ic-chips-motherboard",
                    description="PMIC power ICs, Audio ICs, Touch ICs, Baseband chips & BGA micro-components.",
                    image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                ),
                Category(
                    name="Camera Modules & Lenses",
                    slug="camera-modules",
                    description="Original OEM rear main camera sensors, front selfie cameras & sapphire glass lens covers.",
                    image_url="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80"
                ),
                Category(
                    name="Housing, Back Glass & Frames",
                    slug="housing-chassis",
                    description="Full chassis housing frames, rear glass panels with pre-installed camera rings.",
                    image_url="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80"
                ),
                Category(
                    name="Repair Tools & Rework Stations",
                    slug="repair-tools-equipment",
                    description="Hot air rework stations, digital microscopes, precision screwdriver sets, OCA laminators & solder wire.",
                    image_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80"
                )
            ]
            db.add_all(categories)
            db.commit()

        # Check standard products
        if db.query(Product).count() == 0:
            print("Seeding Mobile Phone Parts Products...")
            cat_disp = db.query(Category).filter(Category.slug == "display-assemblies").first()
            cat_bat = db.query(Category).filter(Category.slug == "batteries-power-cells").first()
            cat_flex = db.query(Category).filter(Category.slug == "charging-flex-cables").first()
            cat_ic = db.query(Category).filter(Category.slug == "ic-chips-motherboard").first()
            cat_cam = db.query(Category).filter(Category.slug == "camera-modules").first()
            cat_house = db.query(Category).filter(Category.slug == "housing-chassis").first()
            cat_tools = db.query(Category).filter(Category.slug == "repair-tools-equipment").first()

            products = [
                Product(
                    name="Super Retina XDR OLED Screen for iPhone 14 Pro Max (Service Pack)",
                    sku="DSP-IP14PM-SP",
                    category_id=cat_disp.id,
                    description="100% Original Service Pack Super Retina XDR OLED assembly with Dynamic Island support, True Tone programmable, 120Hz ProMotion response.",
                    image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80",
                    unit="Box (5 units)",
                    wholesale_price=14500.0,
                    retail_mrp=28000.0,
                    moq=1,
                    stock_quantity=45,
                    is_featured=True,
                    is_new=True,
                    badge_text="Original Service Pack",
                    specifications="Compatibility: iPhone 14 Pro Max | Type: Super Retina OLED 120Hz | Warranty: 6 Months"
                ),
                Product(
                    name="Dynamic AMOLED 2X Display Assembly for Samsung Galaxy S23 Ultra (With Frame)",
                    sku="DSP-SAM-S23U",
                    category_id=cat_disp.id,
                    description="Original Samsung Service Pack AMOLED screen with pre-assembled aluminum chassis frame and S-Pen digitizer layer.",
                    image_url="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
                    unit="Box (3 units)",
                    wholesale_price=16200.0,
                    retail_mrp=26500.0,
                    moq=1,
                    stock_quantity=30,
                    is_featured=True,
                    is_new=False,
                    badge_text="Service Pack + Frame",
                    specifications="Compatibility: Samsung S23 Ultra | Curved Edge 120Hz | Original Frame Included"
                ),
                Product(
                    name="High Capacity 5000mAh Battery for Xiaomi Redmi Note 12 Pro (Pack of 10)",
                    sku="BAT-XIA-RN12P",
                    category_id=cat_bat.id,
                    description="Zero-cycle pure cobalt internal Li-Po battery pack. Integrated Dual IC protection board for over-charge safety.",
                    image_url="https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&q=80",
                    unit="Pack (10 pcs)",
                    wholesale_price=3200.0,
                    retail_mrp=6500.0,
                    moq=2,
                    stock_quantity=120,
                    is_featured=True,
                    is_new=True,
                    badge_text="50% Shop Margin",
                    specifications="Capacity: 5000mAh | Voltage: 3.87V | Fits: Xiaomi Redmi Note 12 Pro 5G"
                ),
                Product(
                    name="PMI632 902-00 Main Power Management IC Chip (Reball BGA - Pack of 10)",
                    sku="IC-PMI632-BGA",
                    category_id=cat_ic.id,
                    description="Pre-balled BGA main PMIC chip for Qualcomm Snapdragon motherboard power rails repair.",
                    image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
                    unit="Strip (10 chips)",
                    wholesale_price=950.0,
                    retail_mrp=2500.0,
                    moq=2,
                    stock_quantity=300,
                    is_featured=True,
                    is_new=True,
                    badge_text="Micro-Repair Essential",
                    specifications="Package: BGA | Pre-stenciled Lead Balls | Compatibility: Snapdragon Mobiles"
                ),
                Product(
                    name="Professional 2-in-1 Hot Air Rework Station & Soldering Iron (1000W)",
                    sku="TL-HOT-AIR-1000",
                    category_id=cat_tools.id,
                    description="1000W ultra-high power micro-processor controlled hot air gun rework station for IC BGA desoldering.",
                    image_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
                    unit="Set",
                    wholesale_price=9800.0,
                    retail_mrp=15500.0,
                    moq=1,
                    stock_quantity=15,
                    is_featured=True,
                    is_new=True,
                    badge_text="Lab Equipment",
                    specifications="Power: 1000W | Temp Range: 100°C - 500°C | Includes 4 Curved Nozzles"
                )
            ]
            db.add_all(products)
            db.commit()

        print("Database initialized successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
