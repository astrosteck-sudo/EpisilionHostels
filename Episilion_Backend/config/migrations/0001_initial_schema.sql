-- defaultdb.device_ai_usage definition

CREATE TABLE "device_ai_usage" (
  "device_id" varchar(255) NOT NULL,
  "requests_used" int DEFAULT '0',
  "requests_limit" int DEFAULT '3',
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY ("device_id")
);


-- defaultdb.favorites definition

CREATE TABLE "favorites" (
  "id" int NOT NULL AUTO_INCREMENT,
  "user_id" int NOT NULL,
  "hostel_id" varchar(50) NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE KEY "user_id" ("user_id","hostel_id")
);


-- defaultdb.hostels definition

CREATE TABLE "hostels" (
  "hostel_id" varchar(50) NOT NULL,
  "name" varchar(100) DEFAULT NULL,
  "type" varchar(20) DEFAULT NULL,
  "university" varchar(100) DEFAULT NULL,
  "year_established" int DEFAULT NULL,
  "main_image" text,
  "total_reviews" int DEFAULT '0',
  "average_rating" decimal(2,1) DEFAULT '0.0',
  PRIMARY KEY ("hostel_id")
);


-- defaultdb.newsletter_subscribers definition

CREATE TABLE "newsletter_subscribers" (
  "id" bigint unsigned NOT NULL AUTO_INCREMENT,
  "email" varchar(255) NOT NULL,
  "is_active" tinyint(1) NOT NULL DEFAULT '1',
  "subscribed_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE KEY "email" ("email")
);


-- defaultdb.payments definition

CREATE TABLE "payments" (
  "id" int NOT NULL AUTO_INCREMENT,
  "user_id" int NOT NULL,
  "plan_id" int NOT NULL,
  "reference_code" varchar(255) NOT NULL,
  "amount" int NOT NULL,
  "status" varchar(50) DEFAULT 'pending',
  "channel" varchar(50) DEFAULT NULL,
  "paid_at" timestamp NULL DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE KEY "reference_code" ("reference_code")
);


-- defaultdb.plans definition

CREATE TABLE "plans" (
  "id" int NOT NULL AUTO_INCREMENT,
  "name" varchar(100) NOT NULL,
  "amount" int NOT NULL,
  "duration_days" int NOT NULL,
  "daily_limit" int NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);


-- defaultdb.subscriptions definition

CREATE TABLE "subscriptions" (
  "id" int NOT NULL AUTO_INCREMENT,
  "user_id" int NOT NULL,
  "plan_id" int NOT NULL,
  "starts_at" datetime NOT NULL,
  "expires_at" datetime NOT NULL,
  "daily_limit" int NOT NULL,
  "status" varchar(50) DEFAULT 'active',
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);


-- defaultdb.usage_logs definition

CREATE TABLE "usage_logs" (
  "id" int NOT NULL AUTO_INCREMENT,
  "user_id" int NOT NULL,
  "usage_date" date NOT NULL,
  "requests_used" int DEFAULT '0',
  PRIMARY KEY ("id"),
  UNIQUE KEY "unique_usage" ("user_id","usage_date")
);


-- defaultdb.users definition

CREATE TABLE "users" (
  "user_id" int NOT NULL AUTO_INCREMENT,
  "name" varchar(100) NOT NULL,
  "email" varchar(100) NOT NULL,
  "password" varchar(255) NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "auth_provider" enum('local','google') NOT NULL DEFAULT 'local',
  PRIMARY KEY ("user_id"),
  UNIQUE KEY "email" ("email")
);


-- defaultdb.waitlist_subscribers definition

CREATE TABLE "waitlist_subscribers" (
  "id" bigint unsigned NOT NULL AUTO_INCREMENT,
  "email" varchar(255) NOT NULL,
  "is_active" tinyint(1) NOT NULL DEFAULT '1',
  "joined_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE KEY "email" ("email")
);


-- defaultdb.ai_usage definition

CREATE TABLE "ai_usage" (
  "ai_usage_id" int NOT NULL AUTO_INCREMENT,
  "user_id" int NOT NULL,
  "requests_used" int DEFAULT '0',
  "requests_limit" int DEFAULT '3',
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY ("ai_usage_id"),
  KEY "fk_ai_usage_user" ("user_id"),
  CONSTRAINT "fk_ai_usage_user" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- defaultdb.amenities definition

CREATE TABLE "amenities" (
  "amenities_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "amenity" varchar(100) NOT NULL,
  PRIMARY KEY ("amenities_id"),
  UNIQUE KEY "hostel_id" ("hostel_id","amenity"),
  CONSTRAINT "amenities_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- defaultdb.contact definition

CREATE TABLE "contact" (
  "contact_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "manager_name" varchar(100) DEFAULT NULL,
  "phone" varchar(20) DEFAULT NULL,
  "whatsapp" varchar(20) DEFAULT NULL,
  "email" varchar(100) DEFAULT NULL,
  "office_hours" varchar(50) DEFAULT '5:00am to 12:00am',
  "website" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("contact_id"),
  UNIQUE KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "contact_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE
);


-- defaultdb.furnishing definition

CREATE TABLE "furnishing" (
  "furnishing_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "furnishing" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("furnishing_id"),
  UNIQUE KEY "hostel_id" ("hostel_id","furnishing"),
  CONSTRAINT "furnishing_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- defaultdb.hostel_managers definition

CREATE TABLE "hostel_managers" (
  "id" int NOT NULL AUTO_INCREMENT,
  "manager_hostel_id" varchar(50) NOT NULL,
  "username" varchar(100) NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE KEY "manager_hostel_id" ("manager_hostel_id"),
  UNIQUE KEY "username" ("username"),
  CONSTRAINT "hostel_managers_ibfk_1" FOREIGN KEY ("manager_hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE
);


-- defaultdb.locations definition

CREATE TABLE "locations" (
  "location_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "distance_to_campus_in_minutes" int DEFAULT NULL,
  "directions" text,
  "latitude" decimal(10,6) DEFAULT NULL,
  "longitude" decimal(10,6) DEFAULT NULL,
  PRIMARY KEY ("location_id"),
  KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "locations_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- defaultdb.media definition

CREATE TABLE "media" (
  "media_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "url" varchar(255) DEFAULT NULL,
  "type" varchar(50) DEFAULT NULL,
  PRIMARY KEY ("media_id"),
  KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "media_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE
);


-- defaultdb.pricing definition

CREATE TABLE "pricing" (
  "pricing_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) NOT NULL,
  "price_min" int DEFAULT NULL,
  "price_max" int DEFAULT NULL,
  "billing_period" varchar(50) DEFAULT NULL,
  "installment_allowed" tinyint(1) DEFAULT NULL,
  "utilities_fee" int DEFAULT NULL,
  "maintenance_fee" int DEFAULT NULL,
  "caution_deposit" int DEFAULT NULL,
  "refund_policy" text,
  PRIMARY KEY ("pricing_id"),
  UNIQUE KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "pricing_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE
);


-- defaultdb.reviews definition

CREATE TABLE "reviews" (
  "review_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "rating" int NOT NULL,
  "review_text" text,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "user_id" int DEFAULT NULL,
  PRIMARY KEY ("review_id"),
  KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "reviews_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "reviews_chk_1" CHECK ((`rating` between 1 and 5))
);


-- defaultdb.rooms definition

CREATE TABLE "rooms" (
  "room_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) NOT NULL,
  "room_type" varchar(50) DEFAULT NULL,
  "price" int DEFAULT NULL,
  "available_rooms" int DEFAULT NULL,
  PRIMARY KEY ("room_id"),
  KEY "hostel_id" ("hostel_id"),
  CONSTRAINT "rooms_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE
);


-- defaultdb.rules definition

CREATE TABLE "rules" (
  "rules_id" int NOT NULL AUTO_INCREMENT,
  "hostel_id" varchar(50) DEFAULT NULL,
  "rule" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("rules_id"),
  UNIQUE KEY "hostel_id" ("hostel_id","rule"),
  CONSTRAINT "rules_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels" ("hostel_id") ON DELETE CASCADE ON UPDATE CASCADE
);