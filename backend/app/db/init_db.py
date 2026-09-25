from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models import User, Category, Product, Order, OrderItem
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Re-initialize or check superadmin
        superadmin_user = db.query(User).filter(User.email == "superadmin@saasha.com").first()
        if not superadmin_user:
            print("Seeding Superadmin account...")
            super_admin = User(
                email="superadmin@saasha.com",
                hashed_password=get_password_hash("superadmin123"),
                full_name="Owner Super Admin",
                shop_name="SAASHA Global Spares HQ",
                phone="+91 9999999999",
                address="SAASHA Mobile Parts Hub, Suite 1",
                role="SUPERADMIN"
            )
            db.add(super_admin)
            db.commit()

        # Check standard users
        if db.query(User).count() <= 1:
            print("Seeding initial admins and shopkeeper...")
            admin1 = User(
                email="admin@saasha.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Main Admin",
                shop_name="SAASHA Spares Warehouse #1",
                phone="+91 9876543210",
                address="Mobile Wholesale Plaza, Warehouse 4",
                role="ADMIN"
            )
            admin2 = User(
                email="admin2@saasha.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Inventory Manager",
                shop_name="SAASHA Tech Logistics",
                phone="+91 9876543211",
                address="Mobile Wholesale Plaza, Warehouse 4",
                role="ADMIN"
            )
            shopkeeper = User(
                email="shopkeeper@saasha.com",
                hashed_password=get_password_hash("shop123"),
                full_name="Rahul Sharma",
                shop_name="Rahul Mobile Repair & Service Lab",
                phone="+91 9123456789",
                address="Shop #12, Electronics Repair Market, City Center",
                role="SHOPKEEPER"
            )
            db.add_all([admin1, admin2, shopkeeper])
            db.commit()

        # Reset & Reseed Categories for Mobile Phone Parts & Tools
        print("Seeding Mobile Phone Parts Categories...")
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()

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

        # Fetch Category IDs
        cat_disp = db.query(Category).filter(Category.slug == "display-assemblies").first()
        cat_bat = db.query(Category).filter(Category.slug == "batteries-power-cells").first()
        cat_flex = db.query(Category).filter(Category.slug == "charging-flex-cables").first()
        cat_ic = db.query(Category).filter(Category.slug == "ic-chips-motherboard").first()
        cat_cam = db.query(Category).filter(Category.slug == "camera-modules").first()
        cat_house = db.query(Category).filter(Category.slug == "housing-chassis").first()
        cat_tools = db.query(Category).filter(Category.slug == "repair-tools-equipment").first()

        print("Seeding Mobile Phone Parts Products...")
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
                specifications="Compatibility: iPhone 14 Pro Max | Type: Super Retina OLED 120Hz | Warranty: 6 Months | IC Swap Ready"
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
                specifications="Compatibility: Samsung S23 Ultra (SM-S918B) | Curved Edge 120Hz | Original Frame Included"
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
                specifications="Capacity: 5000mAh | Voltage: 3.87V | Protection: Dual IC | Fits: Xiaomi Redmi Note 12 Pro 5G"
            ),
            Product(
                name="Extended Endurance Battery for iPhone 13 Pro (3095mAh TI Chipset - Box of 5)",
                sku="BAT-IP13P-TI",
                category_id=cat_bat.id,
                description="Premium battery with original Texas Instruments IC control board. Battery health display 100% compatible.",
                image_url="https://images.unsplash.com/photo-1609592424074-9844f2d729a6?w=600&q=80",
                unit="Box (5 units)",
                wholesale_price=2850.0,
                retail_mrp=5500.0,
                moq=2,
                stock_quantity=90,
                is_featured=False,
                is_new=True,
                badge_text="TI Chip Original",
                specifications="Capacity: 3095mAh | OEM Grade A+ | Texas Instruments BMS Controller | Fits: iPhone 13 Pro"
            ),
            Product(
                name="USB Type-C Fast Charge Dock PCB Sub-Board for OnePlus 11 (Pack of 10)",
                sku="FLX-OP11-CHG",
                category_id=cat_flex.id,
                description="Original charging connector flex PCB board with dual SIM slot assembly, fast charging IC & microphone.",
                image_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
                unit="Pack (10 pcs)",
                wholesale_price=1800.0,
                retail_mrp=3800.0,
                moq=3,
                stock_quantity=150,
                is_featured=False,
                is_new=True,
                badge_text="Fast Charge Ready",
                specifications="Fits: OnePlus 11 5G | Supports 100W SuperVOOC | Includes Mic & Antenna Flex"
            ),
            Product(
                name="Lightning Charging Port & Mic Ribbon Flex for iPhone 12 Pro (Pack of 5)",
                sku="FLX-IP12P-CHG",
                category_id=cat_flex.id,
                description="Full assembly lower flex cable containing Lightning socket, dual noise-cancelling mics & cellular antenna contact pads.",
                image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
                unit="Box (5 pcs)",
                wholesale_price=1250.0,
                retail_mrp=2800.0,
                moq=2,
                stock_quantity=200,
                is_featured=True,
                is_new=False,
                badge_text="High Demand",
                specifications="Fits: iPhone 12 Pro | Color: Graphite/Gold/Pacific Blue | OEM Grade"
            ),
            Product(
                name="PMI632 902-00 Main Power Management IC Chip (Reball BGA - Pack of 10)",
                sku="IC-PMI632-BGA",
                category_id=cat_ic.id,
                description="Pre-balled BGA main PMIC chip for Qualcomm Snapdragon motherboard power rails repair. Essential chip for micro-soldering labs.",
                image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
                unit="Strip (10 chips)",
                wholesale_price=950.0,
                retail_mrp=2500.0,
                moq=2,
                stock_quantity=300,
                is_featured=True,
                is_new=True,
                badge_text="Micro-Repair Essential",
                specifications="Package: BGA | Pre-stenciled Lead Balls | Compatibility: Xiaomi, Vivo, OPPO Snapdragon Phones"
            ),
            Product(
                name="200MP Main Camera Sensor Module for Samsung Galaxy S23 Ultra / S22 Ultra",
                sku="CAM-SAM-200M",
                category_id=cat_cam.id,
                description="Original ISOCELL HP2 200 Megapixel primary rear camera sensor with OIS optical image stabilization motor.",
                image_url="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80",
                unit="Piece",
                wholesale_price=6800.0,
                retail_mrp=11500.0,
                moq=1,
                stock_quantity=25,
                is_featured=False,
                is_new=True,
                badge_text="100% OEM Tested",
                specifications="Sensor: 200MP OIS | Focus: Laser AF Compatible | Fits: Samsung S23 Ultra / S22 Ultra"
            ),
            Product(
                name="Rear Back Glass Panel Replacement with Camera Frame Ring for iPhone 14 Pro (Pack of 5)",
                sku="HOU-IP14P-GLS",
                category_id=cat_house.id,
                description="Laser-cut precision glass back cover with big camera hole cutout for fast installation without removing camera module.",
                image_url="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80",
                unit="Box (5 pcs)",
                wholesale_price=1100.0,
                retail_mrp=3200.0,
                moq=3,
                stock_quantity=180,
                is_featured=False,
                is_new=False,
                badge_text="Big Hole Easy Fit",
                specifications="Material: Sapphire-infused Glass | Includes Pre-applied Adhesive | Fits: iPhone 14 Pro"
            ),
            Product(
                name="Professional 2-in-1 Hot Air Rework Station & Soldering Iron (Sugon 8620DX Equivalent)",
                sku="TL-HOT-AIR-1000",
                category_id=cat_tools.id,
                description="1000W ultra-high power micro-processor controlled hot air gun rework station for IC BGA desoldering and SMD soldering.",
                image_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
                unit="Set",
                wholesale_price=9800.0,
                retail_mrp=15500.0,
                moq=1,
                stock_quantity=15,
                is_featured=True,
                is_new=True,
                badge_text="Lab Equipment",
                specifications="Power: 1000W | Temp Range: 100°C - 500°C | Airflow: 120L/min | Includes 4 Curved Nozzles"
            ),
            Product(
                name="Precision 3D Screwdriver Set for Mobile Phone Repair (5 Pcs Titanium Alloy)",
                sku="TL-DRV-3D-5PC",
                category_id=cat_tools.id,
                description="High precision magnetic S2 steel 3D screwdriver kit (Tri-Point Y0.6, Pentalobe P2, Phillips 1.5, Standoff Pin, Torx T2).",
                image_url="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80",
                unit="Set (5 drivers)",
                wholesale_price=1450.0,
                retail_mrp=2800.0,
                moq=2,
                stock_quantity=85,
                is_featured=False,
                is_new=True,
                badge_text="Anti-Slip Magnetic",
                specifications="Material: Aviation Aluminum Body + S2 Steel Heads | Bearing: Silent Swivel Cap"
            )
        ]

        db.add_all(products)
        db.commit()

        print("Database successfully updated with Mobile Phone Spare Parts & Tools catalog!")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
