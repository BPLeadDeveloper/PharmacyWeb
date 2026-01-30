/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "emergency_contact_name" VARCHAR(100),
    "emergency_contact_phone" VARCHAR(20),
    "is_active" BOOLEAN DEFAULT true,
    "is_email_verified" BOOLEAN DEFAULT false,
    "is_phone_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(6),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "pharmacists" (
    "pharmacist_id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "pharmacist_role" VARCHAR(50) NOT NULL DEFAULT 'PHARMACIST',
    "pharmacist_license_number" VARCHAR(100) NOT NULL,
    "license_state" VARCHAR(100) NOT NULL,
    "license_expiry_date" DATE NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "is_email_verified" BOOLEAN DEFAULT false,
    "is_phone_verified" BOOLEAN DEFAULT false,
    "assigned_by" BIGINT,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(6),

    CONSTRAINT "pharmacists_pkey" PRIMARY KEY ("pharmacist_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "admin_level" VARCHAR(50) DEFAULT 'STANDARD',
    "is_active" BOOLEAN DEFAULT true,
    "is_email_verified" BOOLEAN DEFAULT false,
    "is_phone_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(6),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "customer_notifications" (
    "notification_id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "notification_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP(6),
    "reference_type" VARCHAR(50),
    "reference_id" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "pharmacist_notifications" (
    "notification_id" BIGSERIAL NOT NULL,
    "pharmacist_id" BIGINT NOT NULL,
    "notification_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP(6),
    "reference_type" VARCHAR(50),
    "reference_id" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pharmacist_notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "admin_notifications" (
    "notification_id" BIGSERIAL NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "notification_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP(6),
    "reference_type" VARCHAR(50),
    "reference_id" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "brands" (
    "brand_id" SERIAL NOT NULL,
    "brand_name" TEXT NOT NULL,
    "origin_country" TEXT,
    "manufacturer_name" TEXT,
    "web_url" TEXT,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "hsn_codes" (
    "hsn_id" SERIAL NOT NULL,
    "hsn_code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "gst_rate" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "hsn_codes_pkey" PRIMARY KEY ("hsn_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" BIGSERIAL NOT NULL,
    "product_code" VARCHAR(100) NOT NULL,
    "product_name" VARCHAR(500) NOT NULL,
    "generic_name" VARCHAR(500),
    "brand_id" INTEGER,
    "category_id" INTEGER NOT NULL,
    "hsn_id" INTEGER NOT NULL,
    "requires_prescription" BOOLEAN DEFAULT false,
    "is_otc" BOOLEAN DEFAULT true,
    "is_controlled_substance" BOOLEAN DEFAULT false,
    "drug_schedule" VARCHAR(20),
    "dosage_form" VARCHAR(100),
    "strength" VARCHAR(100),
    "pack_size" VARCHAR(100),
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "address_id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "address_type" VARCHAR(20) NOT NULL,
    "is_default" BOOLEAN DEFAULT false,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "carts" (
    "cart_id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "cart_item_id" BIGSERIAL NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "added_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "prescription_id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "uploaded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "verified_by" BIGINT,
    "verified_at" TIMESTAMP(6),
    "rejection_reason" TEXT,
    "pharmacist_notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "prescription_documents" (
    "document_id" BIGSERIAL NOT NULL,
    "prescription_id" BIGINT NOT NULL,
    "document_path" VARCHAR(500) NOT NULL,
    "document_type" VARCHAR(50) NOT NULL DEFAULT 'application/pdf',
    "file_size_kb" INTEGER,
    "uploaded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" BIGSERIAL NOT NULL,
    "order_number" VARCHAR(100) NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "warehouse_id" INTEGER,
    "order_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "order_type" VARCHAR(50) NOT NULL,
    "requires_prescription" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "shipping_address_id" BIGINT NOT NULL,
    "billing_address_id" BIGINT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax_amount" DECIMAL(12,2) NOT NULL,
    "shipping_charges" DECIMAL(10,2) DEFAULT 0,
    "discount_amount" DECIMAL(10,2) DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "payment_status" VARCHAR(50) DEFAULT 'PENDING',
    "assigned_pharmacist_id" BIGINT,
    "assigned_at" TIMESTAMP(6),
    "processed_at" TIMESTAMP(6),
    "shipped_at" TIMESTAMP(6),
    "delivered_at" TIMESTAMP(6),
    "cancelled_at" TIMESTAMP(6),
    "cancellation_reason" TEXT,
    "special_instructions" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "inventory_id" BIGINT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,
    "discount_percent" DECIMAL(5,2) DEFAULT 0,
    "tax_rate" DECIMAL(5,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PENDING',

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_gateway" VARCHAR(50),
    "transaction_id" VARCHAR(255),
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) DEFAULT 'INR',
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "payment_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "refund_amount" DECIMAL(12,2) DEFAULT 0,
    "refund_date" TIMESTAMP(6),
    "gateway_response" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "shipment_id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "shipped_date" TIMESTAMP(6),
    "delivery_date" TIMESTAMP(6),
    "delivery_status" VARCHAR(50) DEFAULT 'PENDING',
    "delivered_to" VARCHAR(255),
    "delivery_signature_path" VARCHAR(500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("shipment_id")
);

-- CreateTable
CREATE TABLE "returns" (
    "return_id" BIGSERIAL NOT NULL,
    "return_number" VARCHAR(100) NOT NULL,
    "order_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "return_reason" VARCHAR(50) NOT NULL,
    "return_description" TEXT,
    "status" VARCHAR(50) DEFAULT 'REQUESTED',
    "requested_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(6),
    "approved_by" BIGINT,
    "received_at" TIMESTAMP(6),
    "refund_amount" DECIMAL(10,2),
    "refund_method" VARCHAR(50),
    "refunded_at" TIMESTAMP(6),
    "rejection_reason" TEXT,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("return_id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "return_item_id" BIGSERIAL NOT NULL,
    "return_id" BIGINT NOT NULL,
    "order_item_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "condition" VARCHAR(50),

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("return_item_id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "warehouse_id" SERIAL NOT NULL,
    "warehouse_name" VARCHAR(255) NOT NULL,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "operating_hours_start" TIME(6),
    "operating_hours_end" TIME(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "warehouse_service_areas" (
    "service_area_id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "estimated_delivery_days" INTEGER DEFAULT 3,
    "is_serviceable" BOOLEAN DEFAULT true,

    CONSTRAINT "warehouse_service_areas_pkey" PRIMARY KEY ("service_area_id")
);

-- CreateTable
CREATE TABLE "warehouse_inventory" (
    "inventory_id" BIGSERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "product_id" BIGINT NOT NULL,
    "batch_number" VARCHAR(100) NOT NULL,
    "vendor_id" INTEGER,
    "manufacturing_date" DATE,
    "expiry_date" DATE NOT NULL,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "quantity_available" INTEGER NOT NULL DEFAULT 0,
    "minimum_stock_level" INTEGER DEFAULT 10,
    "rack_location" VARCHAR(50),
    "received_date" DATE NOT NULL,
    "last_stock_update" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_damaged" BOOLEAN DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "warehouse_inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "adjustment_id" BIGSERIAL NOT NULL,
    "inventory_id" BIGINT NOT NULL,
    "adjustment_type" VARCHAR(50) NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "quantity_before" INTEGER NOT NULL,
    "quantity_after" INTEGER NOT NULL,
    "reason" TEXT,
    "adjusted_by" BIGINT NOT NULL,
    "adjusted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "reference_type" VARCHAR(50),
    "reference_id" BIGINT,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("adjustment_id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "vendor_id" SERIAL NOT NULL,
    "vendor_code" VARCHAR(50) NOT NULL,
    "vendor_name" VARCHAR(255) NOT NULL,
    "contact_person" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "gstin" VARCHAR(15),
    "pan" VARCHAR(10),
    "payment_terms" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "po_id" BIGSERIAL NOT NULL,
    "po_number" VARCHAR(100) NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "po_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "expected_delivery_date" DATE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax_amount" DECIMAL(12,2) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "payment_terms" VARCHAR(100),
    "notes" TEXT,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("po_id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "po_item_id" BIGSERIAL NOT NULL,
    "po_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity_ordered" INTEGER NOT NULL,
    "quantity_received" INTEGER DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("po_item_id")
);

-- CreateTable
CREATE TABLE "purchase_receipts" (
    "receipt_id" BIGSERIAL NOT NULL,
    "po_id" BIGINT NOT NULL,
    "receipt_number" VARCHAR(100) NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "received_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "received_by" BIGINT NOT NULL,
    "invoice_number" VARCHAR(100),
    "invoice_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_receipts_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateTable
CREATE TABLE "purchase_receipt_items" (
    "receipt_item_id" BIGSERIAL NOT NULL,
    "receipt_id" BIGINT NOT NULL,
    "po_item_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "batch_number" VARCHAR(100) NOT NULL,
    "quantity_received" INTEGER NOT NULL,
    "manufacturing_date" DATE,
    "expiry_date" DATE NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "purchase_receipt_items_pkey" PRIMARY KEY ("receipt_item_id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "setting_id" SERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT NOT NULL,
    "setting_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("setting_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacists_email_key" ON "pharmacists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacists_phone_key" ON "pharmacists"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "hsn_codes_hsn_code_key" ON "hsn_codes"("hsn_code");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key" ON "cart_items"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_order_id_key" ON "prescriptions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "returns_return_number_key" ON "returns"("return_number");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_service_areas_warehouse_id_postal_code_key" ON "warehouse_service_areas"("warehouse_id", "postal_code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_inventory_warehouse_id_product_id_batch_number_key" ON "warehouse_inventory"("warehouse_id", "product_id", "batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_vendor_code_key" ON "vendors"("vendor_code");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_receipts_receipt_number_key" ON "purchase_receipts"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "system_settings"("setting_key");

-- AddForeignKey
ALTER TABLE "pharmacists" ADD CONSTRAINT "pharmacists_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pharmacist_notifications" ADD CONSTRAINT "pharmacist_notifications_pharmacist_id_fkey" FOREIGN KEY ("pharmacist_id") REFERENCES "pharmacists"("pharmacist_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("brand_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_hsn_id_fkey" FOREIGN KEY ("hsn_id") REFERENCES "hsn_codes"("hsn_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("cart_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "pharmacists"("pharmacist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescription_documents" ADD CONSTRAINT "prescription_documents_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("prescription_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assigned_pharmacist_id_fkey" FOREIGN KEY ("assigned_pharmacist_id") REFERENCES "pharmacists"("pharmacist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "customer_addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "customer_addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "warehouse_inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "returns"("return_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("order_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_service_areas" ADD CONSTRAINT "warehouse_service_areas_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_inventory" ADD CONSTRAINT "warehouse_inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_inventory" ADD CONSTRAINT "warehouse_inventory_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("vendor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_inventory" ADD CONSTRAINT "warehouse_inventory_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "warehouse_inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_adjusted_by_fkey" FOREIGN KEY ("adjusted_by") REFERENCES "pharmacists"("pharmacist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("vendor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("po_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipts" ADD CONSTRAINT "purchase_receipts_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("po_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipts" ADD CONSTRAINT "purchase_receipts_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "pharmacists"("pharmacist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipts" ADD CONSTRAINT "purchase_receipts_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipt_items" ADD CONSTRAINT "purchase_receipt_items_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "purchase_receipts"("receipt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipt_items" ADD CONSTRAINT "purchase_receipt_items_po_item_id_fkey" FOREIGN KEY ("po_item_id") REFERENCES "purchase_order_items"("po_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_receipt_items" ADD CONSTRAINT "purchase_receipt_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
