# Episilion Backend API

A comprehensive Node.js + Express backend API for the Episilion Hostels platform - a hostel booking system designed for UPSA students. This backend provides RESTful endpoints for hostel management, user authentication, AI-powered hostel search, payment processing, and subscription management.

## Project Overview

The Episilion Backend serves as the central API for the Episilion Hostels platform, a hostel booking and discovery system specifically designed for university students. The backend handles:

- User authentication (email/password and Google OAuth)
- Hostel data management with comprehensive details (pricing, locations, amenities, reviews)
- AI-powered hostel search using NVIDIA's NIM API
- Subscription management with premium tiers
- Payment processing via Paystack
- Manager dashboard for hostel administrators
- Favorites and reviews functionality
- Newsletter and waitlist subscriptions

The backend uses MySQL for data persistence and implements JWT-based authentication, caching with node-cache, and AI-powered search capabilities.

## Tech Stack

### Core Technologies

- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web framework
- **MySQL2** (v3.20.0) - MySQL database driver with promise support

### Authentication & Security

- **bcrypt** (v6.0.0) - Password hashing
- **jsonwebtoken** (v9.0.3) - JWT token generation and verification
- **passport** (v0.7.0) - Authentication middleware
- **passport-google-oauth20** (v2.0.0) - Google OAuth strategy

### AI & Integration

- **openai** (v6.34.0) - OpenAI SDK for NVIDIA NIM API integration
- **axios** (v1.16.1) - HTTP client for Paystack integration

### Utilities

- **dotenv** (v17.4.1) - Environment variable management
- **cors** (v2.8.6) - Cross-origin resource sharing
- **express-session** (v1.19.0) - Session management
- **node-cache** (v5.1.2) - In-memory caching
- **node-cron** (v4.2.1) - Scheduled task management
- **geolib** (v3.3.14) - Geospatial calculations
- **uuid** (v14.0.0) - Unique ID generation

### Development

- **nodemon** (v3.1.14) - Development server with auto-reload

## Project Structure

```
Episilion_Backend/
├── config/                 # Configuration files
│   ├── db.js              # MySQL database connection pool and cron jobs
│   ├── passport.js        # Passport.js Google OAuth configuration
│   ├── server.js         # Express server setup and route mounting
│   └── migrations/       # Database migration files (if any)
├── controllers/           # Request handlers
│   ├── authController.js         # User signup, login, Google OAuth
│   ├── favoritesController.js     # Favorites management
│   ├── hostelController.js       # Hostel data retrieval with caching
│   ├── intentController.js       # AI-powered hostel search
│   ├── managerAuthController.js  # Manager authentication
│   ├── managerDashBoardController.js # Manager dashboard operations
│   ├── paymentController.js      # Paystack payment processing
│   ├── reviewController.js       # Review management
│   ├── subscriberController.js   # Newsletter and waitlist subscriptions
│   └── userController.js        # User profile management
├── middleware/            # Custom middleware functions
│   ├── auth.js                    # Generic JWT authentication
│   ├── checkAIUsage.js            # AI usage limit validation
│   ├── checkDeviceUsage.js        # Device-based AI usage limits
│   ├── subscriptionMiddleware.js  # Subscription validation
│   ├── verifyManagerToken.js      # Manager JWT verification
│   ├── verifyToken.js             # User JWT verification
│   └── webhookMiddleware.js       # Payment webhook processing (empty)
├── routes/                # API route definitions
│   ├── auth.js                    # Authentication routes
│   ├── favoritesRoutes.js         # Favorites endpoints
│   ├── hostels.js                 # Hostel data endpoints
│   ├── intent.js                  # AI search endpoints
│   ├── managerAuthRoutes.js       # Manager authentication
│   ├── managerDashboardRoutes.js  # Manager dashboard endpoints
│   ├── paymentRoutes.js           # Payment processing
│   ├── reviews.js                 # Review endpoints
│   ├── subscriberRoutes.js        # Subscription endpoints
│   └── userRoutes.js              # User profile endpoints
├── services/              # Business logic services
│   ├── authService.js            # Google token verification
│   ├── favoritesService.js        # Favorites database operations
│   └── paystackService.js         # Paystack API integration
├── utils/                 # Utility functions
│   ├── cache.js                   # Cache configuration
│   ├── emailValidator.js          # Email validation
│   ├── favorites.validation.js    # Favorites input validation
│   ├── generateReference.js       # Payment reference generation
│   ├── hashPassword.js            # Password hashing utility
│   ├── listModels.js              # AI model listing
│   ├── randomIdGenerator.js       # UUID generation
│   ├── test.js                    # Testing utilities
│   └── timeService.js             # Time-related utilities
├── data/                  # Static data files
│   ├── team_Members_data.json     # Team member information
│   └── More_From_Us.json          # Additional project data
├── public/                # Static assets
│   └── images/                    # Hostel images
├── .env                   # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
└── README.md              # This file
```

## Environment Variables

The following environment variables are required for the application to function properly:

### Database Configuration

- `DB_HOST` - MySQL database host
- `DB_PORT` - MySQL database port
- `DB_USER` - MySQL database username
- `DB_PASSWORD` - MySQL database password
- `DB_NAME` - MySQL database name

### Authentication

- `JWT_SECRET` - Secret key for JWT token signing and verification
- `SESSION_SECRET` - Secret key for express-session

### Google OAuth

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### AI Integration

- `NVIDIA_API_KEY` - API key for NVIDIA NIM (AI model hosting)

### Payment Processing

- `PAYSTACK_SECRET_KEY` - Paystack secret key for payment verification

### Application Configuration

- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend application URL for OAuth redirects

## Database Schema

Based on the SQL queries in the codebase, the following database tables are used:

### Core Tables

#### `users`

- **Purpose**: Stores user account information
- **Key Columns**: `user_id`, `name`, `email`, `password`, `auth_provider`, `created_at`
- **Relationships**: Links to `ai_usage`, `favorites`, `reviews`, `subscriptions`, `payments`

#### `hostel_managers`

- **Purpose**: Stores hostel manager authentication data
- **Key Columns**: `id`, `username`, `password_hash`, `manager_hostel_id`
- **Relationships**: Links to hostels via `manager_hostel_id`

#### `hostels`

- **Purpose**: Main hostel information
- **Key Columns**: `hostel_id`, `name`, `type`, `main_image`, `hostel_perks`, `average_rating`, `total_reviews`
- **Relationships**: Links to `pricing`, `locations`, `rooms`, `amenities`, `rules`, `furnishing`, `contact`, `media`, `reviews`

### Supporting Tables

#### `pricing`

- **Purpose**: Hostel pricing information
- **Key Columns**: `hostel_id`, `price_min`, `price_max`, `billing_period`, `utilities_fee`, `maintenance_fee`, `caution_deposit`, `installment_allowed`, `refund_policy`

#### `locations`

- **Purpose**: Hostel location data and directions
- **Key Columns**: `hostel_id`, `latitude`, `longitude`, `distance_to_campus_in_minutes`, `distance_to_campus_in_meters`, `directions`

#### `rooms`

- **Purpose**: Room types and availability
- **Key Columns**: `room_id`, `hostel_id`, `room_type`, `price`, `available_rooms`

#### `amenities`

- **Purpose**: Hostel amenities list
- **Key Columns**: `id`, `hostel_id`, `amenity`

#### `rules`

- **Purpose**: Hostel rules and policies
- **Key Columns**: `id`, `hostel_id`, `rule`

#### `furnishing`

- **Purpose**: Room furnishing details
- **Key Columns**: `id`, `hostel_id`, `furnishing`

#### `contact`

- **Purpose**: Hostel contact information
- **Key Columns**: `hostel_id`, `manager_name`, `phone`, `whatsapp`, `email`, `office_hours`, `website`

#### `media`

- **Purpose**: Hostel images and media
- **Key Columns**: `hostel_id`, `url`, `type`

### User Interaction Tables

#### `reviews`

- **Purpose**: User reviews for hostels
- **Key Columns**: `review_id`, `hostel_id`, `user_id`, `rating`, `review_text`, `created_at`
- **Relationships**: Links to `users` and `hostels`

#### `favorites`

- **Purpose**: User's saved hostels
- **Key Columns**: `user_id`, `hostel_id`, `created_at`
- **Relationships**: Links to `users` and `hostels`

### Subscription & Payment Tables

#### `subscriptions`

- **Purpose**: User subscription plans
- **Key Columns**: `id`, `user_id`, `plan_id`, `starts_at`, `expires_at`, `daily_limit`, `status`, `created_at`
- **Relationships**: Links to `users` and `plans`

#### `plans`

- **Purpose**: Available subscription plans
- **Key Columns**: `id`, `amount`, `duration_days`, `daily_limit`

#### `payments`

- **Purpose**: Payment transaction records
- **Key Columns**: `id`, `user_id`, `plan_id`, `reference_code`, `amount`, `status`, `channel`, `paid_at`
- **Relationships**: Links to `users` and `plans`

### Usage Tracking Tables

#### `ai_usage`

- **Purpose**: Free tier AI usage tracking per user
- **Key Columns**: `user_id`, `requests_used`, `requests_limit` (default: 3)
- **Relationships**: Links to `users`

#### `device_ai_usage`

- **Purpose**: Device-based AI usage tracking (prevents abuse)
- **Key Columns**: `device_id`, `requests_used`, `requests_limit`

#### `usage_logs`

- **Purpose**: Daily usage tracking for premium users
- **Key Columns**: `user_id`, `usage_date`, `requests_used`
- **Relationships**: Links to `users`

### Marketing Tables

#### `newsletter_subscribers`

- **Purpose**: Newsletter subscription management
- **Key Columns**: `id`, `email`, `is_active`

#### `waitlist_subscribers`

- **Purpose**: Waitlist for platform access
- **Key Columns**: `id`, `email`, `is_active`

## Authentication & Authorization

### User Authentication Flow

#### 1. Email/Password Registration

- **Endpoint**: `POST /api/auth/signup`
- **Controller**: `authController.signup`
- **Process**:
  1. Validates email uniqueness in `users` table
  2. Hashes password using bcrypt (10 rounds)
  3. Inserts user into `users` table
  4. Creates corresponding `ai_usage` record with 3 free requests
  5. Returns success message

#### 2. Email/Password Login

- **Endpoint**: `POST /api/auth/login`
- **Controller**: `authController.login`
- **Process**:
  1. Queries `users` table by email
  2. Compares password hash using bcrypt
  3. Generates JWT token with user payload (expires in 7 days)
  4. Returns token and user info

#### 3. Google OAuth

- **Endpoints**:
  - `GET /api/auth/google` - Initiates OAuth flow
  - `GET /api/auth/google/callback` - Handles OAuth callback
- **Controller**: `authController.googleCallback`
- **Process**:
  1. Redirects to Google OAuth
  2. Receives user profile from Google
  3. Checks if user exists in `users` table
  4. If not exists, creates user with random password and `auth_provider: "google"`
  5. Generates JWT token
  6. Redirects to frontend with token and user data

### Manager Authentication Flow

#### Manager Login

- **Endpoint**: `POST /api/manager/auth/login`
- **Controller**: `managerAuthController.loginManager`
- **Process**:
  1. Queries `hostel_managers` table by username
  2. Compares password hash using bcrypt
  3. Generates JWT token with manager payload (expires in 7 days)
  4. Returns token and manager info including `hostelId`

### Middleware Protection

#### User JWT Verification

- **Middleware**: `verifyToken` (middleware/verifyToken.js)
- **Usage**: Protects user-specific routes
- **Process**:
  1. Extracts Bearer token from Authorization header
  2. Verifies token using `JWT_SECRET`
  3. Attaches decoded user data to `req.user`
  4. Passes control to next middleware

#### Manager JWT Verification

- **Middleware**: `verifyManagerToken` (middleware/verifyManagerToken.js)
- **Usage**: Protects manager dashboard routes
- **Process**: Similar to user verification but for manager tokens

#### Generic Auth Middleware

- **Middleware**: `authMiddleware` (middleware/auth.js)
- **Usage**: Alternative authentication middleware
- **Process**: Similar token verification but different error messages

### Authorization

The system implements role-based access control:

- **Regular Users**: Can access hostels, reviews, favorites, AI search (with limits)
- **Premium Users**: Higher AI request limits based on subscription
- **Managers**: Can access and modify their specific hostel data

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`

- **Purpose**: Register new user
- **Auth**: None
- **Request Body**: `{ name, email, password }`
- **Response**: Success message
- **Controller**: `authController.signup`

#### POST `/api/auth/login`

- **Purpose**: Login existing user
- **Auth**: None
- **Request Body**: `{ email, password }`
- **Response**: `{ token, user: { id, name, email, createdAt } }`
- **Controller**: `authController.login`

#### GET `/api/auth/google`

- **Purpose**: Initiate Google OAuth
- **Auth**: None
- **Response**: Redirects to Google OAuth page
- **Controller**: Passport.js Google Strategy

#### GET `/api/auth/google/callback`

- **Purpose**: Handle Google OAuth callback
- **Auth**: None
- **Response**: Redirects to frontend with token
- **Controller**: `authController.googleCallback`

### Hostel Routes (`/api/hostels`)

#### GET `/api/hostels`

- **Purpose**: Get all hostels with complete details
- **Auth**: None
- **Response**: Array of hostels with nested pricing, locations, amenities, rooms, rules, furnishing, contact, media, and reviews
- **Caching**: Uses node-cache for performance
- **Controller**: `hostelController.getHostels`

### Review Routes (`/api/reviews`)

#### POST `/api/reviews`

- **Purpose**: Add a review for a hostel
- **Auth**: Required (authMiddleware)
- **Request Body**: `{ hostel_id, rating, review_text }`
- **Response**: `{ message, reviewId }`
- **Controller**: `reviewController.addReview`

#### GET `/api/reviews/:hostelId`

- **Purpose**: Get all reviews for a specific hostel
- **Auth**: None
- **Response**: Array of reviews with user names
- **Controller**: `reviewController.getReviews`

### AI Search Routes (`/api/intent`)

#### POST `/api/intent/search`

- **Purpose**: AI-powered hostel search or general chat
- **Auth**: Required (verifyToken, checkAIUsage, checkDeviceUsage)
- **Request Body**: `{ query }`
- **Response**:
  - For hostel queries: `{ type: "hostels", reason, total, remainingRequests, result }`
  - For chat queries: `{ type: "chat", message, remainingRequests }`
  - For no matches: `{ type: "no_match", message, remainingRequests }`
- **Controller**: `intentController.searchHostelsAI`
- **AI Model**: NVIDIA Nemotron-3 Super 120B via NIM API

### Favorites Routes (`/api/favorites`)

#### POST `/api/favorites/:hostelId`

- **Purpose**: Add hostel to user's favorites
- **Auth**: Required (verifyToken)
- **Response**: `{ success, message, data }`
- **Controller**: `favoritesController.addFavoriteController`

#### GET `/api/favorites`

- **Purpose**: Get user's favorite hostels
- **Auth**: Required (verifyToken)
- **Response**: `{ success, count, data }`
- **Controller**: `favoritesController.getFavoritesController`

#### DELETE `/api/favorites/:hostelId`

- **Purpose**: Remove hostel from user's favorites
- **Auth**: Required (verifyToken)
- **Response**: `{ success, message }`
- **Controller**: `favoritesController.removeFavoriteController`

### Manager Routes (`/api/manager`)

#### POST `/api/manager/auth/login`

- **Purpose**: Manager login
- **Auth**: None
- **Request Body**: `{ managerHostelName, managerPassword }`
- **Response**: `{ message, token, manager: { id, hostel_id, username } }`
- **Controller**: `managerAuthController.loginManager`

#### GET `/api/manager/dashboard`

- **Purpose**: Get manager dashboard data
- **Auth**: Required (verifyManagerToken)
- **Response**: `{ pricing, location, room_types }`
- **Controller**: `managerDashBoardController.getManagerDashboard`

#### PUT `/api/manager/update-hostel`

- **Purpose**: Update hostel information
- **Auth**: Required (verifyManagerToken)
- **Request Body**: `{ minimum_price, maximum_price, installment_allowed, refunds_allowed, utilities, maintenance, caution_deposit, hostel_direction, distance_to_campus, room_types }`
- **Response**: Success message
- **Controller**: `managerDashBoardController.updateManagerHostel`

#### PUT `/api/manager/update-hostel-password`

- **Purpose**: Update manager password
- **Auth**: Required (verifyManagerToken)
- **Request Body**: `{ hostelManagerOldpassword, hostelMangerNewPaswword, hostelManagerComfirmPassword }`
- **Response**: Success message
- **Controller**: `managerDashBoardController.updateManagerPassword`

### Payment Routes (`/api/payments`)

#### POST `/api/payments/initialize`

- **Purpose**: Initialize Paystack payment
- **Auth**: Required (authMiddleware)
- **Request Body**: `{ planId }`
- **Response**: `{ authorization_url, reference }`
- **Controller**: `paymentController.initialize`

#### GET `/api/payments/verify/:reference`

- **Purpose**: Verify Paystack payment
- **Auth**: Required (authMiddleware)
- **Response**: Success message
- **Controller**: `paymentController.verify`

#### POST `/api/payments/webhook`

- **Purpose**: Paystack webhook handler
- **Auth**: None (verified via signature)
- **Response**: HTTP status
- **Controller**: `paymentController.webhook`

### User Routes (`/api`)

#### GET `/api/me`

- **Purpose**: Get current user profile with subscription info
- **Auth**: Required (authMiddleware)
- **Response**: `{ id, firstName, email, subscription: { subscribed, dailyLimit, remainingSearches, expiresAt } }`
- **Controller**: `userController.getMe`

### Subscriber Routes (`/api/subscribers`)

#### POST `/api/subscribers/newsletter`

- **Purpose**: Subscribe to newsletter
- **Auth**: None
- **Request Body**: `{ email }`
- **Response**: Success message
- **Controller**: `subscriberController.subscribeNewsletter`

#### POST `/api/subscribers/waitlist`

- **Purpose**: Join platform waitlist
- **Auth**: None
- **Request Body**: `{ email }`
- **Response**: Success message
- **Controller**: `subscriberController.joinWaitlist`

### Static Data Routes

#### GET `/api/teamMembers`

- **Purpose**: Get team member information
- **Auth**: None
- **Response**: `{ success, teamMembers }`
- **Source**: data/team_Members_data.json

#### GET `/api/moreProjects`

- **Purpose**: Get additional project information
- **Auth**: None
- **Response**: `{ success, moreProjects }`
- **Source**: data/More_From_Us.json

### Static Assets

#### GET `/images/*`

- **Purpose**: Serve hostel images
- **Auth**: None
- **Source**: public/images directory

## Middleware

### Authentication Middleware

#### `authMiddleware` (middleware/auth.js)

- **Purpose**: Generic JWT token verification
- **Process**: Extracts and verifies Bearer token from Authorization header
- **Error Messages**: "No token provided", "Invalid token"
- **Usage**: Payment routes, reviews, user profile

#### `verifyToken` (middleware/verifyToken.js)

- **Purpose**: User JWT token verification
- **Process**: Similar to authMiddleware but with different error handling
- **Error Messages**: "No token provided vg", "Something is wrong, try again !!"
- **Usage**: Favorites, intent search

#### `verifyManagerToken` (middleware/verifyManagerToken.js)

- **Purpose**: Manager JWT token verification
- **Process**: Verifies manager-specific tokens
- **Error Messages**: "Access denied", "Something is wrong, try again !!"
- **Usage**: Manager dashboard routes

### Usage Limiting Middleware

#### `checkAIUsage` (middleware/checkAIUsage.js)

- **Purpose**: Validates AI usage limits based on subscription tier
- **Process**:
  1. Checks for active subscription in `subscriptions` table
  2. For premium users: Validates daily limit from `usage_logs`
  3. For free users: Validates lifetime limit from `ai_usage` (default 3)
  4. Sets `req.isPremium` and `req.aiUsage` properties
- **Error Messages**:
  - "premium_limit_reached" - Premium daily limit exceeded
  - "account_limit_reached" - Free account limit exceeded
- **Usage**: AI search endpoint

#### `checkDeviceUsage` (middleware/checkDeviceUsage.js)

- **Purpose**: Device-based AI usage limiting (abuse prevention)
- **Process**:
  1. Extracts device ID from `x-device-id` header
  2. Skips validation for premium users
  3. For free users: Validates device limit from `device_ai_usage`
  4. Sets `req.deviceUsage` property
- **Error Messages**:
  - "No device ID provided" - Missing device header
  - "device_limit_reached" - Device limit exceeded
- **Usage**: AI search endpoint

#### `subscriptionMiddleware` (middleware/subscriptionMiddleware.js)

- **Purpose**: Subscription validation (currently unused in routes)
- **Process**:
  1. Checks for active subscription
  2. Validates expiration date
  3. Checks daily usage limits
  4. Updates expired subscriptions
- **Error Messages**:
  - "Subscription expired" - Expired subscription
  - "Daily request limit reached" - Daily limit exceeded
- **Usage**: Commented out in intent routes

### Webhook Middleware

#### `webhookMiddleware` (middleware/webhookMiddleware.js)

- **Purpose**: Payment webhook processing
- **Status**: Empty file (not implemented)
- **Usage**: Currently not used

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- NVIDIA API key for AI features
- Paystack account for payments
- Google OAuth credentials (optional)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Episilion_Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database Configuration
   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name

   # Authentication
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # AI Integration
   NVIDIA_API_KEY=your_nvidia_api_key

   # Payment Processing
   PAYSTACK_SECRET_KEY=your_paystack_secret_key

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Set up the database**
   - Create a MySQL database using the name specified in `DB_NAME`
   - The application will auto-create tables if they don't exist
   - Or run any migration files in the `config/migrations` directory

5. **Start the development server**

   ```bash
   nodemon config/server
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

### Database Initialization

The application includes a cron job in `config/db.js` that:

- Runs daily at midnight
- Deletes reviews older than 2 months
- Recalculates hostel average ratings and total review counts

### Static Assets

Place hostel images in the `public/images` directory. They will be accessible via `/images/*` endpoints.

## Known Issues / TODOs

### Debug Code Left in Production

- **File**: `controllers/intentController.js`
  - Lines 205, 223, 243, 250, 258, 263, 282-283, 299, 305-313, 317, 321, 377-379, 389, 392, 399, 403, 415
  - Issue: Extensive console.log statements for debugging AI search flow
  - Impact: Performance overhead and information leakage in production

- **File**: `controllers/hostelController.js`
  - Lines 5, 9, 109, 110
  - Issue: Console.log statements for caching operations
  - Impact: Performance overhead

- **File**: `config/server.js`
  - Lines 17, 89-103
  - Issue: Console.log statements for server startup and route listing
  - Impact: Information leakage in production

- **File**: `middleware/verifyToken.js`, `middleware/auth.js`
  - Line 30, 5-6
  - Issue: Console.log for error handling
  - Impact: Error information leakage

- **File**: `utils/hashPassword.js`
  - Lines 14-15
  - Issue: Console.log statements showing passwords and hashes
  - Impact: Security risk - sensitive data exposure

- **File**: `utils/randomIdGenerator.js`
  - Lines 26-40
  - Issue: Console.log statements for UUID generation
  - Impact: Performance overhead

### Code Quality Issues

- **File**: `routes/managerDashboardRoutes.js`
  - Lines 7-9
  - Issue: Commented out import for getManagerDashboard
  - Impact: Code maintenance issue

- **File**: `middleware/webhookMiddleware.js`
  - Issue: Empty file with no implementation
  - Impact: Webhook processing not implemented

- **File**: `config/server.js`
  - Lines 51-52
  - Issue: Duplicate route mounting for manager dashboard
  - Impact: Potential route conflicts

### Potential Issues

- **File**: `config/passport.js`
  - Lines 11-13
  - Issue: Hardcoded production callback URL regardless of NODE_ENV
  - Impact: OAuth may not work correctly in development

- **File**: `controllers/paymentController.js`
  - Line 47
  - Issue: Hardcoded production callback URL
  - Impact: Payment redirects may not work in development

- **File**: `routes/intent.js`
  - Line 9
  - Issue: subscriptionMiddleware is commented out
  - Impact: Subscription validation not enforced on AI search

### Data Validation

- **File**: `controllers/userController.js`
  - Lines 104-108
  - Issue: References `user.first_name` but SELECT query only returns `name`
  - Impact: Potential undefined values in response

### Security Considerations

- Password validation is minimal (only checks for empty strings)
- No rate limiting on authentication endpoints
- Device ID validation relies entirely on client-provided header
- No input sanitization beyond basic validation

### Performance Considerations

- No database connection pooling configuration visible
- Cache TTL not configured for hostel data
- No request timeout configuration for external API calls

### Missing Features

- No email verification for user registration
- No password reset functionality
- No user profile update endpoints
- No logout/token invalidation endpoint
- No admin panel for system management
