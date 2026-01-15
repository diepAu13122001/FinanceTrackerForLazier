# FINANCE TRACKER - 6-WEEK SPRINT TO TET
## Day-by-Day Implementation Schedule (6 days/week, 6 hours/day)

**Total Duration:** 6 weeks (36 days, 216 hours)  
**Work Schedule:** Monday-Saturday, 6 hours/day  
**Rest Day:** Sunday  
**Target Launch:** Before Tết (January 28, 2026)

---

## WEEK 1: RAPID SETUP & CORE BACKEND (DAYS 1-6)

### Day 1 (Monday) - Project Setup & Database
**Hours:** 6h  
**Goal:** Initialize all projects and database schema

**Tasks:**
- [ ] **1h** - Create GitHub repository and project structure
  - Initialize Spring Boot projects (User, Expense, Analytics, Receipt services + Gateway)
  - Create React web project with Vite + TypeScript
  - Initialize React Native project
  - Set up folder structure for all projects
  - Add .gitignore files
  - Initial commit
- [ ] **2h** - Database design and setup
  - Design complete ER diagram (users, expenses, categories, budgets, receipts)
  - Create PostgreSQL database
  - Write SQL migration scripts
  - Create all tables with proper indexes
  - Define foreign key relationships
- [ ] **2.5h** - Create JPA entities for all services
  - User, Expense, Category, Budget, Receipt entities
  - Define relationships (@OneToMany, @ManyToOne)
  - Add validation annotations (@NotNull, @Size, @Email, etc.)
  - Create repositories (extend JpaRepository)
  - Add custom query methods
- [ ] **0.5h** - Test database setup
  - Test database connections
  - Test basic CRUD operations
  - Commit progress

**Deliverables:**
- All projects initialized
- Database schema complete
- JPA entities and repositories created
- Basic CRUD tested

---

### Day 2 (Tuesday) - User Service & Authentication
**Hours:** 6h  
**Goal:** Complete authentication system with testing

**Tasks:**
- [ ] **2.5h** - Implement JWT authentication
  - JWT utility class (generate, validate tokens)
  - Security configuration with Spring Security
  - AuthenticationFilter
  - BCrypt password hashing
  - POST /api/auth/register endpoint
  - POST /api/auth/login endpoint
  - Test authentication endpoints
- [ ] **1.5h** - User CRUD operations
  - GET /api/users/me (get current user)
  - PUT /api/users/me (update profile)
  - PUT /api/users/me/password (change password)
  - Avatar upload support
  - Input validation
- [ ] **1.5h** - Redis caching setup
  - Configure Spring Data Redis
  - Create Redis configuration class
  - Cache user profiles with @Cacheable
  - Cache JWT tokens (blacklist for logout)
  - Test caching behavior (cache hits, eviction)
- [ ] **0.5h** - Write critical tests
  - Test authentication endpoints
  - Test JWT generation/validation
  - Test password hashing
  - Test cache behavior

**Deliverables:**
- Authentication system working
- User CRUD complete
- Redis caching implemented
- Core tests passing

---

### Day 3 (Wednesday) - Expense Service Core
**Hours:** 6h  
**Goal:** Build expense management with categories

**Tasks:**
- [ ] **2h** - Expense CRUD operations
  - POST /api/expenses (create with validation)
  - GET /api/expenses (list with pagination & filters)
  - GET /api/expenses/{id} (get single expense)
  - PUT /api/expenses/{id} (update)
  - DELETE /api/expenses/{id} (soft delete)
  - Add sorting and filtering logic
- [ ] **1.5h** - Category management
  - Category entity and repository
  - POST /api/categories (create)
  - GET /api/categories (list all)
  - PUT /api/categories/{id} (update)
  - DELETE /api/categories/{id} (delete)
  - Seed Vietnamese default categories (Ăn uống, Mua sắm, Di chuyển, Giải trí, Y tế, Nhà cửa, Giáo dục, Khác)
  - Category colors and icons mapping
- [ ] **1.5h** - Multi-currency support
  - Support VND, USD, EUR
  - Currency conversion service (use exchange rate API)
  - Store original currency with expense
  - Calculate totals in user's preferred currency
  - Handle currency conversion errors
- [ ] **1h** - Write tests and optimize
  - Test expense CRUD operations
  - Test category management
  - Test currency conversion logic
  - Add database indexes for common queries
  - Test pagination and filtering

**Deliverables:**
- Expense CRUD complete
- Category system working
- Multi-currency supported
- Tests passing

---

### Day 4 (Thursday) - AI Integration (Voice + Parsing)
**Hours:** 6h  
**Goal:** Implement voice-to-expense feature

**Tasks:**
- [ ] **1h** - Set up Google Cloud Speech-to-Text
  - Create Google Cloud project (free tier)
  - Enable Speech-to-Text API
  - Get API credentials
  - Configure credentials in Spring Boot (environment variables)
  - Store credentials securely
- [ ] **1.5h** - Implement speech service
  - Create SpeechToTextService
  - Handle audio file upload (multipart)
  - Call Google Speech-to-Text API
  - Support Vietnamese language (vi-VN)
  - POST /api/expenses/voice/transcribe endpoint
  - Return transcription text
  - Handle API errors and timeouts
- [ ] **1.5h** - Set up Claude AI for expense parsing
  - Get Anthropic API key
  - Add Anthropic Java SDK dependency
  - Create ExpenseParserService
  - Design Vietnamese prompt:
    - Extract: amount, category, merchant, date
    - Handle slang and code-switching (Viglish)
    - Example: "Mua cà phê 45k ở Highlands" → {amount: 45000, currency: VND, category: "Ăn uống", merchant: "Highlands"}
  - Parse Claude response to structured data
- [ ] **1.5h** - Complete voice-to-expense pipeline
  - POST /api/expenses/voice endpoint
  - Flow: Audio → transcribe → parse → create expense
  - Return created expense with confidence scores
  - Add validation for parsed data
  - Handle edge cases (unclear audio, parsing failures)
- [ ] **0.5h** - Test and document
  - Test with 10+ Vietnamese voice samples
  - Record test audio files
  - Document supported phrases and formats
  - Measure accuracy (target 80%+)

**Deliverables:**
- Voice-to-text working
- AI parsing functional
- End-to-end voice expense creation
- 80%+ accuracy on test phrases

---

### Day 5 (Friday) - Receipt OCR Pipeline
**Hours:** 6h  
**Goal:** Build receipt scanning feature

**Tasks:**
- [ ] **1h** - Cloudinary setup
  - Create Cloudinary account (free tier)
  - Get API credentials (cloud name, API key, API secret)
  - Configure Cloudinary SDK in Spring Boot
  - Create ImageStorageService
  - POST /api/receipts/upload endpoint
  - Test image upload and retrieve URL
  - Handle upload errors
- [ ] **2h** - Tesseract OCR implementation
  - Configure Tesseract in project
  - Ensure Vietnamese language pack (vie.traineddata) is available
  - Create ReceiptOCRService
  - Implement image preprocessing:
    - Convert to grayscale
    - Increase contrast
    - Noise reduction
    - Deskew if needed
  - Extract text from preprocessed images
  - Test with 5+ sample Vietnamese receipts
  - Optimize preprocessing parameters
- [ ] **2h** - Receipt processing pipeline
  - Use Claude AI to parse OCR text
  - Design prompt to extract:
    - Total amount
    - Line items (optional)
    - Merchant name
    - Date
    - Handle noisy OCR text (missing characters, errors)
  - POST /api/expenses/receipt endpoint
  - Complete flow: Upload image → OCR → parse → create expense
  - Link receipt image URL to expense entity
  - Return created expense with receipt data
- [ ] **1h** - Test complete flow
  - Test with 5+ real Vietnamese receipts (coffee shops, restaurants, supermarkets)
  - Verify extraction accuracy
  - Handle edge cases (torn receipts, low quality photos)
  - Optimize OCR and parsing
  - Measure accuracy (target 75%+)

**Deliverables:**
- Receipt upload working
- OCR extraction functional
- Complete receipt-to-expense pipeline
- 75%+ accuracy on receipts

---

### Day 6 (Saturday) - Analytics Service & API Gateway
**Hours:** 6h  
**Goal:** Build analytics and set up gateway

**Tasks:**
- [ ] **2h** - Analytics endpoints
  - GET /api/analytics/summary (total spending, budget remaining, category count)
  - GET /api/analytics/by-category (spending grouped by category)
  - GET /api/analytics/by-merchant (top merchants with amounts)
  - GET /api/analytics/trends (spending over time - daily/weekly/monthly)
  - Support date range filters (start_date, end_date)
  - Support grouping (day, week, month)
  - Cache analytics results in Redis (TTL: 1 hour)
  - Implement cache invalidation on new expense
- [ ] **1.5h** - AI insights generation
  - Create AIInsightsService
  - Analyze spending patterns with Claude AI
  - Generate personalized insights:
    - Overspending alerts (comparing to budget)
    - Savings opportunities (unusual expenses)
    - Spending patterns (e.g., "You spend 40% on dining out")
    - Category trends (increasing/decreasing)
  - POST /api/analytics/insights/generate (trigger generation)
  - GET /api/analytics/insights (list all insights)
  - PUT /api/analytics/insights/{id}/read (mark as read)
  - Store insights in database
- [ ] **2h** - API Gateway setup
  - Create Spring Cloud Gateway project
  - Configure routes to all microservices:
    - /api/auth/** → User Service
    - /api/users/** → User Service
    - /api/expenses/** → Expense Service
    - /api/categories/** → Expense Service
    - /api/analytics/** → Analytics Service
    - /api/receipts/** → Receipt Service
  - Implement JWT authentication filter
  - Extract JWT and validate
  - Add user context to downstream requests
  - Configure CORS (allow web and mobile origins)
  - Add rate limiting filter (100 requests per minute per user)
  - Configure request size limits
  - Test routing to all services
- [ ] **0.5h** - Week review and testing
  - Test all backend endpoints through gateway
  - Test authentication flow
  - Check test coverage (aim for 70%+)
  - Write API documentation (Swagger/OpenAPI)
  - Commit all code
  - Plan Week 2

**Deliverables:**
- Analytics service complete
- AI insights working
- API Gateway functional
- Week 1 backend complete (all core features done)

---

## WEEK 2: FRONTEND WEB APP (DAYS 7-12)

### Day 7 (Monday) - Web App Foundation
**Hours:** 6h  
**Goal:** Set up React app with authentication

**Tasks:**
- [ ] **1.5h** - Configure React project
  - Install dependencies:
    - React Router DOM
    - TanStack Query (React Query)
    - Zustand (state management)
    - Axios
    - React Hook Form + Zod
    - shadcn/ui components
    - Tailwind CSS
    - Lucide React (icons)
  - Set up folder structure:
    - /src/pages
    - /src/components
    - /src/hooks
    - /src/services
    - /src/stores
    - /src/lib (utilities)
  - Configure path aliases (@/ for src)
  - Configure Tailwind CSS
  - Set up ESLint and Prettier
- [ ] **2h** - Create authentication pages
  - LoginPage with form:
    - Email and password inputs
    - Validation with React Hook Form + Zod
    - Submit button with loading state
    - Link to register page
  - RegisterPage with form:
    - Name, email, password, confirm password
    - Validation
    - Submit button
    - Link to login page
  - Create auth service (src/services/auth.ts):
    - login(email, password) → POST /api/auth/login
    - register(data) → POST /api/auth/register
    - logout()
  - Create auth store (Zustand):
    - Store user and token
    - Login/logout actions
    - Persist token in localStorage (securely)
  - Implement ProtectedRoute component
  - Test authentication flow
- [ ] **2h** - Build layout components
  - AppLayout component:
    - Sidebar navigation
    - Main content area
    - Responsive design (collapse sidebar on mobile)
  - Sidebar component:
    - Navigation links (Dashboard, Expenses, Analytics, Settings)
    - Active link highlighting
    - Icons with Lucide React
    - Logout button at bottom
  - Header component:
    - Page title
    - User menu dropdown (profile, settings, logout)
    - Search bar (optional)
  - Dark/light theme toggle:
    - Theme context
    - Theme switcher button
    - Persist theme preference
- [ ] **0.5h** - Test authentication and navigation
  - Test login with valid/invalid credentials
  - Test registration
  - Test protected routes redirect
  - Test navigation between pages
  - Test theme toggle

**Deliverables:**
- React app configured with all dependencies
- Authentication working (login, register, logout)
- Layout complete with navigation
- Routing functional
- Theme toggle working

---

### Day 8 (Tuesday) - Dashboard & Expense Management
**Hours:** 6h  
**Goal:** Build main expense features

**Tasks:**
- [ ] **2h** - Dashboard page
  - Create DashboardPage component
  - Summary cards section:
    - Total spending (this month)
    - Budget remaining
    - Top category
    - Compare with last month (percentage change)
    - Use shadcn/ui Card component
  - Recent expenses section:
    - List of last 10 expenses
    - Show amount, category, merchant, date
    - Click to view details
  - Quick action buttons:
    - Add Expense
    - Scan Receipt
    - Voice Input
  - Fetch dashboard data with TanStack Query
  - Add loading skeletons
  - Handle errors gracefully
- [ ] **2.5h** - Expenses page
  - Create ExpensesPage component
  - Expense table:
    - Use shadcn/ui Table component
    - Columns: Date, Category, Merchant, Amount, Actions
    - Show category icon and color
    - Format currency properly
  - Pagination:
    - Page size selector (10, 25, 50)
    - Previous/Next buttons
    - Page number display
  - Search and filter UI:
    - Search by merchant/description
    - Filter by category (multi-select)
    - Filter by date range (date picker)
    - Filter by amount range
    - Clear filters button
  - Sort options:
    - Sort by date, amount, category
    - Ascending/descending toggle
  - Delete confirmation dialog
  - Edit expense button (opens modal)
  - Create expense service (src/services/expenses.ts):
    - getExpenses(params) → GET /api/expenses
    - getExpense(id) → GET /api/expenses/{id}
    - createExpense(data) → POST /api/expenses
    - updateExpense(id, data) → PUT /api/expenses/{id}
    - deleteExpense(id) → DELETE /api/expenses/{id}
  - Implement with TanStack Query (useQuery, useMutation)
- [ ] **1h** - Add expense form
  - Create AddExpenseModal component
  - Form fields:
    - Amount (number input, required)
    - Currency selector (VND, USD, EUR)
    - Category dropdown (required)
    - Merchant (text input)
    - Date picker (default: today)
    - Description (textarea)
  - Validation with React Hook Form + Zod
  - Submit button with loading state
  - Cancel button
  - Success toast notification
  - Close modal after success
  - Refresh expense list
- [ ] **0.5h** - Test and polish
  - Test CRUD operations (create, read, update, delete)
  - Test validation (empty fields, invalid amounts)
  - Test filters and search
  - Test pagination
  - Test sorting
  - Fix any UI bugs

**Deliverables:**
- Dashboard complete with summary and recent expenses
- Expense list working with table view
- Search, filter, sort, pagination functional
- Add/edit expense modal working
- CRUD operations tested

---

### Day 9 (Wednesday) - Voice & Receipt Features
**Hours:** 6h  
**Goal:** Implement advanced input methods

**Tasks:**
- [ ] **2.5h** - Voice input feature
  - Add microphone button to Dashboard and Add Expense modal
  - Create VoiceInputModal component:
    - Microphone icon button
    - Recording indicator (animated red dot)
    - Show recording duration
    - Stop recording button
    - Show transcription result
    - Show parsed expense data
  - Implement audio recording:
    - Use MediaRecorder API
    - Record audio in webm format
    - Convert to blob
    - Show audio player for playback
  - Send audio to backend:
    - POST /api/expenses/voice with multipart/form-data
    - Show loading state
    - Handle errors
  - Display transcription and parsed data:
    - Show original Vietnamese transcription
    - Show parsed fields (amount, category, merchant, date)
    - Allow editing each field before saving
    - Confirmation buttons (Save, Re-record, Cancel)
  - Save expense after confirmation
  - Success message
  - Close modal
- [ ] **2.5h** - Receipt scanning feature
  - Create ReceiptUploadModal component:
    - Drag & drop upload area
    - Click to upload button
    - Camera capture button (for mobile browsers)
    - Use shadcn/ui components
  - Image upload UI:
    - Show upload area with dashed border
    - Show preview after selection
    - Show file size and name
    - Remove image button
  - Compress images before upload:
    - Use browser-image-compression library
    - Compress to max 1MB
    - Maintain aspect ratio
  - Send to backend:
    - POST /api/expenses/receipt with image
    - Show loading state with progress
    - Handle errors
  - Display extracted data:
    - Show receipt image preview
    - Show extracted fields (amount, merchant, date, items)
    - Allow editing each field
    - Show confidence scores (optional)
    - Confirmation buttons (Save, Upload New, Cancel)
  - Save expense after confirmation
  - Success message
  - Close modal
- [ ] **1h** - Test both features
  - Test voice recording with various Vietnamese phrases:
    - "Mua cà phê 50 nghìn ở Highlands hôm nay"
    - "Đi grab 35k"
    - "Ăn phở 45000"
  - Test receipt upload with real Vietnamese receipts
  - Test image compression
  - Test data editing before save
  - Test error scenarios (no mic permission, upload fails)
  - Test on different browsers

**Deliverables:**
- Voice input working with recording and transcription
- Receipt scanning functional with OCR
- Data review and editing working
- Both features tested with real data
- Error handling implemented

---

### Day 10 (Thursday) - Analytics & Charts
**Hours:** 6h  
**Goal:** Build analytics dashboard

**Tasks:**
- [ ] **2h** - Analytics page layout
  - Create AnalyticsPage component
  - Time period selector:
    - Buttons: This Week, This Month, Last 3 Months, This Year, Custom
    - Date range picker for custom period
    - Update charts when period changes
  - Summary cards section:
    - Total spending for period
    - Average daily spending
    - Most expensive category
    - Number of transactions
  - Chart containers with responsive grid:
    - 2 columns on desktop, 1 column on mobile
    - Use shadcn/ui Card for each chart
  - Create analytics service (src/services/analytics.ts):
    - getSummary(startDate, endDate) → GET /api/analytics/summary
    - getByCategory(startDate, endDate) → GET /api/analytics/by-category
    - getByMerchant(startDate, endDate) → GET /api/analytics/by-merchant
    - getTrends(startDate, endDate, groupBy) → GET /api/analytics/trends
  - Implement with TanStack Query
  - Add loading states for all charts
- [ ] **2.5h** - Implement charts with Recharts
  - Spending by category chart:
    - Pie chart showing percentage per category
    - Use category colors
    - Show category names and amounts
    - Tooltip with details
    - Legend
    - Center text showing total
  - Spending trends chart:
    - Line chart showing spending over time
    - X-axis: dates
    - Y-axis: amount
    - Multiple lines for comparison (current vs previous period)
    - Smooth curve
    - Gradient fill under line
    - Tooltip with date and amount
    - Legend
  - Top merchants chart:
    - Horizontal bar chart
    - Show top 10 merchants
    - Sort by amount (highest first)
    - Different colors for each bar
    - Show merchant names and amounts
    - Tooltip
  - Make all charts responsive:
    - Use ResponsiveContainer from Recharts
    - Adjust font sizes for mobile
    - Hide labels on small screens if needed
- [ ] **1h** - AI insights section
  - Create InsightsSection component
  - Display insights list:
    - Use InsightCard component for each insight
    - Show insight icon (based on type)
    - Show insight title
    - Show insight description/content
    - Show date generated
    - Color-coded by severity (info, warning, success)
    - Mark as read/unread indicator
  - Generate insights button:
    - Trigger POST /api/analytics/insights/generate
    - Show loading state
    - Show success message
    - Refresh insights list
  - Mark insights as read:
    - Click on insight to mark as read
    - Update UI immediately
    - Call PUT /api/analytics/insights/{id}/read
  - Empty state when no insights
- [ ] **0.5h** - Test analytics
  - Test with different time periods
  - Test with various data sets (few expenses, many expenses)
  - Test chart responsiveness on mobile
  - Test insights generation
  - Test mark as read functionality
  - Verify calculations are correct

**Deliverables:**
- Analytics page complete with time period selector
- All charts implemented and working:
  - Spending by category (pie chart)
  - Spending trends (line chart)
  - Top merchants (bar chart)
- AI insights displayed and interactive
- Responsive design on all screen sizes
- Tested with real data

---

### Day 11 (Friday) - Settings & Polish
**Hours:** 6h  
**Goal:** Complete web app features

**Tasks:**
- [ ] **2h** - Settings page
  - Create SettingsPage component with tabs:
    - Profile tab
    - Preferences tab
    - Categories tab
    - Security tab
  - Profile settings section:
    - Display name input
    - Email (read-only, show current)
    - Avatar upload:
      - Click to upload
      - Show current avatar
      - Preview new avatar
      - Crop functionality (optional)
    - Save button
  - Preferences section:
    - Currency preference dropdown (VND, USD, EUR)
    - Language selector (English, Tiếng Việt)
    - Theme toggle (Light, Dark, System)
    - Date format selector
    - Save button
  - Security section:
    - Change password form:
      - Current password
      - New password
      - Confirm new password
      - Validation
      - Submit button
  - Create settings service:
    - updateProfile(data) → PUT /api/users/me
    - updatePassword(data) → PUT /api/users/me/password
    - uploadAvatar(file) → POST /api/users/me/avatar
  - Handle form submissions
  - Show success/error toasts
- [ ] **1.5h** - Category management
  - Categories tab in Settings
  - List all categories:
    - Show default categories (cannot edit/delete)
    - Show custom categories (can edit/delete)
    - Display category icon, color, and name
    - Use shadcn/ui Table or Cards
  - Add custom category:
    - Button to open AddCategoryModal
    - Form: name, icon, color
    - Icon picker component (show common icons)
    - Color picker component (use color swatches)
    - Validation
    - Submit button
  - Edit category:
    - Click edit button on custom category
    - Open EditCategoryModal
    - Pre-fill form with current values
    - Same form as add
    - Update button
  - Delete category:
    - Delete button on custom categories
    - Confirmation dialog
    - Delete and refresh list
  - Create categories service:
    - getCategories() → GET /api/categories
    - createCategory(data) → POST /api/categories
    - updateCategory(id, data) → PUT /api/categories/{id}
    - deleteCategory(id) → DELETE /api/categories/{id}
- [ ] **1.5h** - Performance optimization
  - Code splitting:
    - Implement lazy loading for routes
    - Use React.lazy() and Suspense
    - Split large pages into chunks
  - Bundle optimization:
    - Analyze bundle size with vite-bundle-visualizer
    - Remove unused dependencies
    - Tree-shake lodash (import specific functions)
  - Image optimization:
    - Compress images
    - Use WebP format
    - Lazy load images
  - Add loading skeletons:
    - Create skeleton components for tables, cards, charts
    - Show during data fetching
    - Use shadcn/ui Skeleton component
  - Error boundaries:
    - Create ErrorBoundary component
    - Wrap main app sections
    - Show user-friendly error messages
  - API retry logic:
    - Configure TanStack Query retry (3 attempts)
    - Exponential backoff
    - Show retry status
- [ ] **1h** - PWA features
  - Configure manifest.json:
    - App name, description
    - Icons (192x192, 512x512)
    - Theme color, background color
    - Display mode: standalone
    - Start URL
  - Add service worker:
    - Use Vite PWA plugin or Workbox
    - Cache static assets
    - Cache API responses (stale-while-revalidate)
    - Offline fallback page
  - Add install prompt:
    - Detect if app is installable
    - Show install button in header or settings
    - Handle beforeinstallprompt event
    - Show success message after install
  - Test offline functionality:
    - Disconnect network
    - Verify cached pages load
    - Show offline indicator
  - Add to home screen:
    - Test on mobile browsers (Chrome, Safari)
    - Verify icon and name appear correctly

**Deliverables:**
- Settings page complete with all tabs:
  - Profile settings working
  - Preferences saved
  - Password change functional
  - Avatar upload working
- Category management working:
  - List all categories
  - Add custom categories
  - Edit custom categories
  - Delete custom categories
- Performance optimized:
  - Code splitting implemented
  - Bundle size reduced
  - Loading skeletons added
  - Error boundaries in place
- PWA features added:
  - Manifest configured
  - Service worker active
  - Install prompt working
  - Offline functionality tested

---

### Day 12 (Saturday) - Web Testing & Docker
**Hours:** 6h  
**Goal:** Test web app and containerize backend

**Tasks:**
- [ ] **2h** - Frontend testing with Vitest
  - Configure Vitest:
    - Update vite.config.ts
    - Set up testing environment
    - Configure jsdom
  - Write component tests:
    - Test Button component (renders, click events)
    - Test Input component (value changes, validation)
    - Test Form components (submission, validation errors)
    - Test Card components (renders content)
  - Write page tests:
    - Test LoginPage (form submission, validation, error handling)
    - Test DashboardPage (renders summary, expenses list)
    - Test ExpensesPage (table renders, filters work)
  - Mock API calls:
    - Mock Axios requests
    - Use MSW (Mock Service Worker) for API mocking
    - Test loading states
    - Test error states
  - Run tests:
    - Run `npm test`
    - Check coverage with `npm test -- --coverage`
    - Aim for 60%+ coverage on critical components
- [ ] **2h** - Docker configuration
  - Create Dockerfile for each microservice:
    - Use multi-stage builds (build stage + runtime stage)
    - Base image: openjdk:21-slim
    - Copy JAR files
    - Expose ports
    - Set environment variables
    - Optimize image sizes (remove build dependencies)
  - Create docker-compose.yml:
    - Define all services:
      - postgres (PostgreSQL 18)
      - redis (Redis latest)
      - user-service
      - expense-service
      - analytics-service
      - receipt-service
      - api-gateway
    - Configure networks (backend network)
    - Set up volumes:
      - postgres-data for database persistence
      - redis-data for Redis persistence
    - Configure environment variables for each service:
      - Database connection strings
      - Redis connection
      - JWT secret
      - API keys (Google Cloud, Anthropic, Cloudinary)
      - Service URLs
    - Set up health checks for all services
    - Configure restart policies
- [ ] **1.5h** - Test Docker deployment
  - Build all Docker images:
    - Run `docker-compose build`
    - Verify images built successfully
    - Check image sizes
  - Start all services:
    - Run `docker-compose up -d`
    - Check all containers are running: `docker ps`
    - Check logs: `docker-compose logs -f`
  - Test inter-service communication:
    - Test API Gateway routes to each service
    - Test database connections from services
    - Test Redis caching
  - Test web app with Dockerized backend:
    - Update API URL to gateway
    - Test login/register
    - Test expense CRUD
    - Test voice and receipt features
    - Test analytics
  - Stop services: `docker-compose down`
- [ ] **0.5h** - Week review and documentation
  - Review progress:
    - Web app feature complete ✅
    - Backend Dockerized ✅
    - Tests written ✅
  - Test complete web app end-to-end:
    - Full user journey (register → login → add expenses → view analytics)
  - Update documentation:
    - Update README with Docker instructions
    - Document environment variables
    - Add troubleshooting section
  - Commit all code to GitHub
  - Create Week 2 tag
  - Plan Week 3 (mobile app)

**Deliverables:**
- Frontend tests written with Vitest:
  - Component tests passing
  - Page tests passing
  - 60%+ test coverage
- All services Dockerized:
  - Dockerfiles for each service
  - docker-compose.yml complete
- Docker deployment tested:
  - All services running in containers
  - Inter-service communication working
  - Web app working with Dockerized backend
- Week 2 complete:
  - Web app fully functional
  - Tests passing
  - Documentation updated

---

## WEEK 3: MOBILE APP (DAYS 13-18)

### Day 13 (Monday) - Mobile Foundation
**Hours:** 6h  
**Goal:** Set up mobile app with navigation

**Tasks:**
- [ ] **1.5h** - React Native project configuration
  - Configure TypeScript (tsconfig.json)
  - Install dependencies:
    - @react-navigation/native
    - @react-navigation/native-stack
    - @react-navigation/bottom-tabs
    - @tanstack/react-query
    - zustand
    - axios
    - react-native-paper
    - react-native-vector-icons
    - @react-native-async-storage/async-storage
  - Set up folder structure:
    - /src/screens
    - /src/components
    - /src/navigation
    - /src/services
    - /src/stores
    - /src/hooks
    - /src/utils
  - Configure ESLint and Prettier
  - Configure Metro bundler
- [ ] **2h** - Navigation setup
  - Configure React Navigation:
    - Set up NavigationContainer
    - Create AuthStack (Login, Register screens)
    - Create MainStack (Dashboard, Expenses, Analytics, Settings)
    - Create BottomTabNavigator (Dashboard, Expenses, Analytics, Settings tabs)
  - Create navigation structure:
    - RootNavigator
(switches between Auth and Main)
    - Check if user is authenticated
    - Navigate accordingly
  - Create screen placeholders:
    - LoginScreen
    - RegisterScreen
    - DashboardScreen
    - ExpensesScreen
    - AnalyticsScreen
    - SettingsScreen
  - Configure tab bar:
    - Custom icons for each tab
    - Active/inactive colors
    - Badge for notifications (optional)
  - Test navigation:
    - Switch between screens
    - Test back button
    - Test tab navigation
- [ ] **2h** - Base components
  - Create reusable components:
    - Screen component (wrapper with SafeAreaView, KeyboardAvoidingView)
    - CustomHeader component (title, back button, actions)
    - CustomButton component (primary, secondary, outline variants)
    - CustomInput component (with label, error message, icon support)
    - LoadingSpinner component (full screen and inline)
    - ErrorMessage component (with retry button)
    - EmptyState component (icon, message, action button)
  - Style with React Native Paper theme
  - Make components reusable and configurable via props
  - Test components on both platforms
- [ ] **0.5h** - Test on both platforms
  - Run on Android emulator: `npx react-native run-android`
  - Run on iOS simulator: `npx react-native run-ios`
  - Test screen transitions
  - Test tab navigation
  - Verify components render correctly
  - Fix any platform-specific issues

**Deliverables:**
- React Native project configured
- Navigation structure complete:
  - Auth stack
  - Main stack with bottom tabs
  - Screen placeholders
- Base components created and styled
- Tested on both Android and iOS

---

### Day 14 (Tuesday) - Mobile Authentication
**Hours:** 6h  
**Goal:** Build auth screens and logic

**Tasks:**
- [ ] **2.5h** - Authentication screens
  - LoginScreen:
    - Email input (with email keyboard type)
    - Password input (with secure text entry)
    - Form validation (email format, required fields)
    - Login button with loading state
    - Error message display
    - "Forgot password?" link
    - "Don't have account? Register" link
    - Keyboard handling (dismiss on tap outside)
    - Use React Native Paper TextInput and Button
  - RegisterScreen:
    - Name input
    - Email input
    - Password input (show strength indicator)
    - Confirm password input
    - Form validation:
      - Email format
      - Password strength (min 8 chars, has number, has uppercase)
      - Passwords match
      - Required fields
    - Register button with loading state
    - Error message display
    - "Already have account? Login" link
    - Keyboard handling
  - Use React Hook Form for form state management
  - Add input focus management (auto-focus next field)
  - Test on both platforms
- [ ] **2h** - Authentication logic
  - Create auth service (src/services/auth.ts):
    - Reuse web API calls
    - login(email, password)
    - register(data)
    - logout()
    - Configure Axios base URL
    - Add request/response interceptors
  - Create auth store with Zustand:
    - State: user, token, isAuthenticated, isLoading
    - Actions: login, logout, setUser, setToken
    - Persist token in AsyncStorage
    - Load token on app start
  - Implement auto-login:
    - Check for token in AsyncStorage on app launch
    - Validate token
    - Auto-login if valid
    - Show splash screen during check
  - Protected navigation:
    - Check auth state in RootNavigator
    - Redirect to login if not authenticated
    - Redirect to dashboard if authenticated
  - Logout functionality:
    - Clear token from AsyncStorage
    - Clear auth store
    - Navigate to login screen
- [ ] **1h** - Profile screen
  - ProfileScreen (in Settings tab):
    - Display user information:
      - Avatar (circular)
      - Name
      - Email
    - Edit profile button (navigate to EditProfileScreen)
    - Change password button (navigate to ChangePasswordScreen)
    - Logout button (with confirmation)
  - EditProfileScreen:
    - Name input (pre-filled)
    - Email display (read-only)
    - Avatar upload button
    - Save button
    - Cancel button
  - ChangePasswordScreen:
    - Current password input
    - New password input
    - Confirm new password input
    - Validation
    - Submit button
    - Cancel button
  - Style with React Native Paper
- [ ] **0.5h** - Test authentication flow
  - Test login with valid credentials
  - Test login with invalid credentials
  - Test registration
  - Test form validation on both screens
  - Test token persistence (close and reopen app)
  - Test auto-login
  - Test logout
  - Test on both Android and iOS

**Deliverables:**
- Authentication screens complete:
  - LoginScreen with validation
  - RegisterScreen with validation
- Authentication logic working:
  - Auth service configured
  - Auth store with Zustand
  - Token persistence in AsyncStorage
  - Auto-login on app start
- Profile screen functional:
  - Display user info
  - Edit profile
  - Change password
  - Logout
- Tested on both platforms

---

### Day 15 (Wednesday) - Mobile Dashboard & Expenses
**Hours:** 6h  
**Goal:** Build main expense features

**Tasks:**
- [ ] **2h** - Dashboard screen
  - DashboardScreen layout:
    - Header with greeting ("Hello, [Name]!")
    - Summary cards section:
      - Total spending (this month)
      - Budget remaining
      - Top category
      - Use React Native Paper Card
      - Show currency symbol
      - Show percentage change from last month
    - Recent expenses section:
      - List last 10 expenses
      - Show expense item:
        - Category icon and color
        - Merchant name
        - Amount
        - Date
      - Tap to view details
      - Use FlatList for performance
    - Quick action buttons:
      - Floating Action Button (FAB) with menu:
        - Add Expense
        - Scan Receipt
        - Voice Input
      - Use React Native Paper FAB.Group
  - Pull-to-refresh:
    - RefreshControl on FlatList
    - Fetch latest data
    - Update summary and expenses
  - Fetch dashboard data:
    - Create dashboard service
    - Use TanStack Query (useQuery)
    - Handle loading state
    - Handle errors
  - Add loading skeletons for cards
  - Test on both platforms
- [ ] **2.5h** - Expenses List screen
  - ExpensesScreen layout:
    - Header with search bar
    - Filter button (opens filter modal)
    - Expense list:
      - Use FlatList with expense items
      - Show: category icon, merchant, amount, date
      - Tap to view ExpenseDetailScreen
      - Swipe actions:
        - Swipe left: Delete button
        - Swipe right: Edit button
        - Use react-native-swipe-list-view
  - Infinite scroll pagination:
    - Load more on scroll to bottom
    - Use onEndReached prop
    - Show loading indicator at bottom
  - Pull-to-refresh:
    - RefreshControl
    - Reset to page 1
  - Search functionality:
    - Search by merchant or description
    - Debounce search input (500ms)
    - Filter list as user types
  - Filter modal:
    - Filter by category (multi-select chips)
    - Filter by date range (date picker)
    - Filter by amount range (slider)
    - Apply and clear buttons
    - Use React Native Paper Modal
  - Create expense service:
    - getExpenses(params)
    - deleteExpense(id)
    - Use TanStack Query
  - Handle empty state (no expenses)
  - Test on both platforms
- [ ] **1h** - Add Expense screen
  - AddExpenseScreen (modal or full screen):
    - Form fields:
      - Amount input (numeric keyboard)
      - Currency selector (dropdown)
      - Category picker (modal with category list)
      - Merchant input
      - Date picker (native date picker)
      - Description (multiline input)
    - Validation:
      - Amount required and > 0
      - Category required
      - Date valid
    - Submit button with loading state
    - Cancel button
  - Category picker modal:
    - Show all categories in grid
    - Show category icon and name
    - Highlight selected category
    - Close on selection
  - Handle form submission:
    - Call createExpense API
    - Show success message (toast or snackbar)
    - Navigate back to expenses list
    - Refresh expenses
  - Use React Native Paper components
  - Test validation
  - Test on both platforms
- [ ] **0.5h** - Test and polish
  - Test dashboard:
    - Summary displays correctly
    - Recent expenses load
    - Pull-to-refresh works
    - FAB opens menu
  - Test expenses list:
    - List displays all expenses
    - Pagination works
    - Search works
    - Filters work
    - Swipe actions work
  - Test add expense:
    - Form validation
    - Submission works
    - List refreshes
  - Fix any UI/UX issues
  - Test on both platforms

**Deliverables:**
- Dashboard screen complete:
  - Summary cards with data
  - Recent expenses list
  - Pull-to-refresh
  - Quick action FAB
- Expenses list screen complete:
  - FlatList with expenses
  - Infinite scroll pagination
  - Search functionality
  - Filters (category, date, amount)
  - Swipe actions (edit, delete)
- Add expense screen complete:
  - Form with validation
  - Category picker
  - Date picker
  - Submission working
- All tested on Android and iOS

---

### Day 16 (Thursday) - Voice & Camera Features
**Hours:** 6h  
**Goal:** Implement voice and receipt scanning

**Tasks:**
- [ ] **3h** - Voice recording feature
  - Install dependencies:
    - @react-native-voice/voice (for speech recognition)
    - react-native-audio-recorder-player (for audio playback)
  - Create VoiceInputScreen (or modal):
    - Microphone button (large, centered)
    - Recording animation:
      - Pulse effect while recording
      - Show waveform (optional)
      - Show recording duration
    - Stop recording button
    - Playback controls (play, pause audio)
    - Status messages ("Listening...", "Processing...", "Done!")
  - Implement voice recording:
    - Request microphone permission
    - Start recording on mic button press
    - Record in WAV or M4A format
    - Stop recording and save file
    - Handle errors (no permission, recording failed)
  - Send audio to backend:
    - Convert audio file to blob/base64
    - POST /api/expenses/voice with multipart/form-data
    - Show loading indicator
    - Handle network errors
  - Display results:
    - Show transcription text
    - Show parsed expense data:
      - Amount (editable)
      - Category (editable picker)
      - Merchant (editable)
      - Date (editable picker)
    - Confirmation buttons:
      - Save (create expense)
      - Re-record (start over)
      - Cancel
  - Test voice recognition:
    - Test with Vietnamese phrases
    - Verify transcription accuracy
    - Test on both platforms (iOS voice recognition better)
- [ ] **2.5h** - Camera and receipt scanning
  - Install dependencies:
    - react-native-vision-camera (modern camera library)
    - react-native-image-picker (for gallery selection)
    - react-native-image-resizer (for image compression)
  - Create ReceiptScanScreen (or modal):
    - Camera view (full screen or large preview)
    - Capture button (centered at bottom)
    - Gallery button (select from photos)
    - Flash toggle button
    - Guide overlay (receipt frame)
  - Implement camera capture:
    - Request camera permission
    - Initialize camera
    - Take photo on capture button
    - Save photo temporarily
    - Show preview with retake/use buttons
  - Implement gallery selection:
    - Open image picker
    - Let user select receipt image
    - Show preview
  - Image preprocessing:
    - Resize image to max 1500px width (maintain aspect ratio)
    - Compress to max 1MB
    - Convert to JPEG
    - Use react-native-image-resizer
  - Upload receipt:
    - POST /api/expenses/receipt with image
    - Show upload progress
    - Show loading indicator
    - Handle errors
  - Display extracted data:
    - Show receipt image thumbnail
    - Show extracted fields:
      - Total amount (editable)
      - Merchant (editable)
      - Date (editable picker)
      - Items (list, optional)
    - Confidence indicators (optional)
    - Confirmation buttons:
      - Save (create expense)
      - Retake (scan again)
      - Cancel
  - Test receipt scanning:
    - Test with real Vietnamese receipts
    - Verify OCR accuracy
    - Test image compression
    - Test on both platforms
- [ ] **0.5h** - Integrate with expense list
  - Add voice and camera buttons to:
    - Dashboard FAB menu
    - Expenses screen header
    - AddExpenseScreen (alternative input methods)
  - Test full flow:
    - Dashboard → Voice Input → Create Expense → View in List
    - Dashboard → Scan Receipt → Create Expense → View in List
  - Test data accuracy
  - Handle permissions properly
  - Test on both platforms

**Deliverables:**
- Voice input feature complete:
  - Recording working
  - Transcription functional
  - Parsed data displayed
  - Expense created from voice
- Receipt scanning feature complete:
  - Camera capture working
  - Gallery selection working
  - Image compression functional
  - OCR extraction working
  - Expense created from receipt
- Both features integrated with main app
- Permissions handled correctly
- Tested on Android and iOS

---

### Day 17 (Friday) - Mobile Analytics
**Hours:** 6h  
**Goal:** Build analytics screen

**Tasks:**
- [ ] **2h** - Analytics screen layout
  - AnalyticsScreen structure:
    - Header with period selector
    - Summary cards section (total, average, top category)
    - Charts section (scrollable)
    - Insights section
  - Time period selector:
    - Horizontal scrollable chips/buttons:
      - This Week
      - This Month
      - Last 3 Months
      - This Year
      - Custom (opens date range picker)
    - Use React Native Paper SegmentedButtons
    - Update data when period changes
  - Summary cards:
    - Total spending for period
    - Average daily spending
    - Most expensive category
    - Number of transactions
    - Use React Native Paper Card
    - Format currency properly
  - Create analytics service:
    - getSummary(startDate, endDate)
    - getByCategory(startDate, endDate)
    - getByMerchant(startDate, endDate)
    - getTrends(startDate, endDate)
    - Use TanStack Query
  - Add loading states
  - Handle errors
  - Test data fetching
- [ ] **2.5h** - Charts implementation
  - Install react-native-chart-kit or victory-native
  - Spending by category chart:
    - Pie chart showing category distribution
    - Use category colors
    - Show percentages
    - Legend with category names and amounts
    - Make chart touchable (highlight segment on tap)
  - Spending trends chart:
    - Line chart showing spending over time
    - X-axis: dates (formatted)
    - Y-axis: amounts (formatted with currency)
    - Smooth curve
    - Grid lines
    - Tooltip on tap (show date and amount)
  - Top merchants chart:
    - Horizontal bar chart
    - Show top 5-10 merchants
    - Different colors for bars
    - Show merchant names and amounts
    - Scroll if too many merchants
  - Make charts responsive:
    - Adjust size based on screen width
    - Reduce labels on small screens
    - Ensure readability
  - Wrap charts in ScrollView
  - Add loading skeletons
  - Test on both platforms
- [ ] **1h** - AI insights section
  - Insights list:
    - Show insights cards
    - Use React Native Paper Card
    - Display for each insight:
      - Icon (based on type: warning, info, success)
      - Title
      - Description/content
      - Date generated
      - Color-coded border (by severity)
    - Mark as read indicator (dot or opacity)
    - Tap to mark as read
  - Generate insights button:
    - Floating button or regular button at top
    - Trigger POST /api/analytics/insights/generate
    - Show loading dialog
    - Show success message
    - Refresh insights list
  - Empty state:
    - Show when no insights
    - "No insights yet" message
    - Generate button
  - Handle insights interactions:
    - Tap insight to mark as read
    - Update UI immediately
    - Call API in background
  - Test insights display
  - Test generation
  - Test mark as read
- [ ] **0.5h** - Polish and test
  - Add pull-to-refresh to analytics screen
  - Add loading indicators
  - Test period selector (all options)
  - Test charts with different data sets
  - Test insights generation
  - Verify calculations are correct
  - Test on both platforms
  - Fix any UI issues

**Deliverables:**
- Analytics screen complete:
  - Period selector working
  - Summary cards displaying data
  - All charts implemented:
    - Spending by category (pie chart)
    - Spending trends (line chart)
    - Top merchants (bar chart)
  - AI insights section functional:
    - Display insights
    - Generate insights
    - Mark as read
- Responsive design
- Pull-to-refresh working
- Tested on Android and iOS

---

### Day 18 (Saturday) - Mobile Testing & Polish
**Hours:** 6h  
**Goal:** Test and polish mobile app

**Tasks:**
- [ ] **2h** - Manual testing on devices
  - Test on Android (physical device if possible):
    - Authentication flow
    - Dashboard (summary, recent expenses, FAB)
    - Expenses list (pagination, search, filters, swipe actions)
    - Add expense (form, validation)
    - Voice input (recording, transcription, parsing)
    - Receipt scanning (camera, OCR, parsing)
    - Analytics (charts, insights)
    - Settings (profile, preferences, categories)
  - Test on iOS (physical device if possible):
    - Same tests as Android
    - Check for platform-specific issues
  - Test edge cases:
    - No internet connection (show error messages)
    - Slow internet (show loading states)
    - Empty states (no expenses, no insights)
    - Large data sets (many expenses, many categories)
  - Test permissions:
    - Camera permission (request, handle denial)
    - Microphone permission (request, handle denial)
  - Test keyboard behavior:
    - Inputs scroll into view
    - Keyboard dismisses properly
    - Next/Done buttons work
- [ ] **1.5h** - Performance testing and optimization
  - Test app performance:
    - Measure screen transition times
    - Check FlatList scroll performance
    - Monitor memory usage
    - Check for memory leaks
  - Optimize FlatLists:
    - Use getItemLayout for fixed-height items
    - Set windowSize and maxToRenderPerBatch
    - Use keyExtractor properly
    - Remove unnecessary re-renders
  - Optimize images:
    - Resize large images
    - Use FastImage for caching
    - Compress uploaded images
  - Reduce bundle size:
    - Check for unused dependencies
    - Use Hermes engine (if not already)
    - Enable ProGuard (Android) and minification
  - Test performance improvements
- [ ] **1.5h** - UI/UX polish
  - Consistent styling:
    - Check all screens use theme colors
    - Ensure consistent spacing (padding, margins)
    - Verify font sizes and weights
    - Check icon consistency
  - Animations:
    - Add smooth transitions between screens
    - Animate list item additions/removals
    - Add micro-interactions (button press feedback, etc.)
    - Use react-native-reanimated for performance
  - Accessibility:
    - Add accessibilityLabel to buttons and inputs
    - Ensure color contrast meets standards
    - Test with screen reader (TalkBack on Android, VoiceOver on iOS)
    - Add accessible names to images
  - Error handling:
    - Show user-friendly error messages
    - Add retry buttons for failed requests
    - Handle network errors gracefully
    - Show appropriate empty states
  - Loading states:
    - Show skeletons while loading
    - Show progress indicators for uploads
    - Disable buttons during loading
  - Test all improvements
- [ ] **1h** - Build and prepare for distribution
  - Android build:
    - Update version in build.gradle
    - Configure release build in android/app/build.gradle
    - Generate signing key (if not done)
    - Build release APK: `cd android && ./gradlew assembleRelease`
    - Test release APK on device
  - iOS build (if Mac available):
    - Update version in Xcode
    - Configure release scheme
    - Archive and export IPA
    - Test on device
  - Create app metadata:
    - Write app description (English and Vietnamese)
    - Take screenshots (5-10 per platform)
    - Design app icon (1024x1024)
    - Create feature graphic
  - Document installation:
    - Write installation guide for APK
    - Create QR code for download
    - Test installation process

**Deliverables:**
- Mobile app fully tested:
  - All features working on Android
  - All features working on iOS
  - Edge cases handled
  - Permissions working
- Performance optimized:
  - Smooth scrolling
  - Fast screen transitions
  - Optimized images
- UI/UX polished:
  - Consistent styling
  - Smooth animations
  - Accessible
  - Good error handling
- Release builds created:
  - Android APK ready
  - iOS IPA ready (if applicable)
  - App metadata prepared
  - Installation guide written
- Week 3 complete: Mobile app functional and ready

---

## WEEK 4: AWS DEPLOYMENT (DAYS 19-24)

### Day 19 (Monday) - AWS Setup & Cost Controls
**Hours:** 6h  
**Goal:** Prepare AWS environment with strict budget

**Tasks:**
- [ ] **1h** - AWS account configuration
  - Verify/create AWS account
  - Enable MFA (Multi-Factor Authentication) on root account
  - Create IAM admin user (not using root)
  - Create IAM user for deployment
  - Configure AWS CLI with credentials
  - Set default region (choose cheapest: us-east-1 or ap-southeast-1)
- [ ] **2h** - Cost controls and monitoring
  - Set up AWS Budget:
    - Create budget with $25 monthly limit
    - Set alerts at $10, $15, $20, $25
    - Email notifications to your address
    - SMS alerts for critical thresholds
  - Create billing alerts:
    - Enable billing alerts in Billing preferences
    - Create CloudWatch billing alarm at $20
    - Another alarm at $24 (last warning)
  - Enable Cost Explorer:
    - Turn on Cost Explorer
    - Enable hourly resource-level granularity
    - Set up cost allocation tags
  - Review pricing:
    - EC2 t3.micro/t4g.micro Spot pricing
    - RDS Free Tier PostgreSQL
    - Data transfer costs
    - Calculate estimated monthly cost
  - Set up cost optimization:
    - Plan to use Spot Instances
    - Use AWS Free Tier where possible
    - Plan instance stop schedule (stop at night if needed)
- [ ] **2h** - Security and networking
  - Create VPC (use default VPC to save time):
    - Verify default VPC exists
    - Check subnets (public and private)
    - Verify Internet Gateway attached
  - Create Security Groups:
    - SG for EC2 (web-server-sg):
      - Inbound: SSH (22) from your IP
      - Inbound: HTTP (80) from anywhere
      - Inbound: HTTPS (443) from anywhere
      - Outbound: All traffic
    - SG for RDS (database-sg):
      - Inbound: PostgreSQL (5432) from web-server-sg
      - Outbound: All traffic
  - Create IAM roles:
    - EC2 role for CloudWatch logs
    - EC2 role for S3 access (for backups)
  - Create key pair for SSH:
    - Generate EC2 key pair
    - Download .pem file
    - Set permissions: `chmod 400 key.pem`
    - Store securely
  - Document security setup
- [ ] **1h** - Create deployment plan
  - Architecture diagram:
    - EC2 instance (all services via Docker)
    - RDS PostgreSQL (Free Tier)
    - CloudFront (optional, for CDN)
    - Route 53 (for domain, optional)
  - Deployment strategy:
    - Use single EC2 t3.micro Spot instance
    - Run all microservices in Docker containers
    - Use RDS Free Tier for PostgreSQL
    - Use EC2 instance for Redis (in Docker)
    - Use NGINX as reverse proxy
  - Cost breakdown (estimate):
    - EC2 t3.micro Spot: ~$3-5/month
    - RDS t3.micro (Free Tier): $0
    - Data transfer: ~$1-2/month
    - Total: ~$5-10/month (well under $25)
  - Write deployment checklist
  - Document rollback plan

**Deliverables:**
- AWS account secured with MFA
- IAM users and roles created
- Budget and billing alerts configured ($25 limit)
- Security Groups created
- SSH key pair generated
- Deployment plan documented
- Cost estimate: ~$5-10/month

---

### Day 20 (Tuesday) - EC2 & RDS Setup
**Hours:** 6h  
**Goal:** Launch and configure cloud infrastructure

**Tasks:**
- [ ] **2h** - Launch EC2 instance
  - Request Spot Instance:
    - Go to EC2 > Spot Requests
    - Launch instance:
      - AMI: Ubuntu Server 22.04 LTS
      - Instance type: t3.micro or t4g.micro
      - Spot vs On-Demand: Choose Spot (60-70% cheaper)
      - Max price: Set to on-demand price
    - Configure instance:
      - Network: Default VPC
      - Subnet: Public subnet (for Internet access)
      - Auto-assign Public IP: Enable
      - IAM role: EC2-CloudWatch-Role
      - User data: Script to update system on first boot
    - Add storage: 20 GB gp3 (cheaper than gp2)
    - Security group: web-server-sg
    - Review and launch
  - Allocate Elastic IP:
    - Allocate new Elastic IP
    - Associate with EC2 instance
    - Note: Elastic IP is free if associated, $0.005/hour if not
    - Document public IP
  - Test SSH access:
    - SSH into instance: `ssh -i key.pem ubuntu@<public-ip>`
    - Verify connection
  - Update system:
    - `sudo apt update && sudo apt upgrade -y`
    - Reboot if kernel updated
- [ ] **2h** - Install software on EC2
  - Install Docker:
    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    # Log out and log back in
    ```
  - Install Docker Compose:
    ```bash
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version
    ```
  - Install NGINX:
    ```bash
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
    ```
  - Install Git:
    ```bash
    sudo apt install git -y
    git --version
    ```
  - Install certbot (for SSL later):
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```
  - Configure firewall:
    ```bash
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw enable
    ```
  - Verify installations:
    - Test Docker: `docker run hello-world`
    - Test NGINX: Visit `http://<public-ip>` in browser
- [ ] **1.5h** - Set up RDS PostgreSQL
  - Launch RDS instance:
    - Go to RDS > Create database
    - Choose PostgreSQL
    - Version: 16 (latest stable)
    - Template: Free tier
    - DB instance identifier: finance-tracker-db
    - Master username: postgres
    - Master password: Generate strong password, save securely
    - DB instance class: db.t3.micro (Free Tier)
    - Storage: 20 GB gp2 (Free Tier includes 20 GB)
    - Don't enable storage autoscaling (to avoid extra costs)
    - VPC: Default VPC
    - Public access: No
    - VPC security group: database-sg
    - Additional config:
      - Initial database name: finance_tracker
      - Backup retention: 7 days (Free Tier includes 7 days)
      - Disable enhanced monitoring (costs extra)
    - Create database
  - Wait for RDS to be available (~10 minutes)
  - Note connection details:
    - Endpoint (e.g., finance-tracker-db.xxx.rds.amazonaws.com)
    - Port: 5432
    - Database name: finance_tracker
    - Username: postgres
    - Password: <saved password>
  - Test connection from EC2:
    ```bash
    sudo apt install postgresql-client -y
    psql -h <rds-endpoint> -U postgres -d finance_tracker
    # Enter password when prompted
    # Run: \l to list databases
    # Exit: \q
    ```
- [ ] **0.5h** - Configure environment variables
  - Create .env file for production:
    - Database connection string
    - Redis connection (localhost since it's in Docker)
    - JWT secret
    - API keys (Google Cloud, Anthropic, Cloudinary)
    - Service URLs
  - Secure .env file:
    ```bash
    chmod 600 .env
    ```
  - Don't commit .env to Git
  - Document environment variables in separate secure location

**Deliverables:**
- EC2 Spot instance running:
  - Ubuntu 22.04 LTS
  - Docker and Docker Compose installed
  - NGINX installed
  - Git installed
  - Elastic IP associated
  - SSH access working
- RDS PostgreSQL instance running:
  - db.t3.micro (Free Tier)
  - finance_tracker database created
  - Connection tested from EC2
- Environment variables configured
- Total cost so far: ~$0-2 (mostly Free Tier)

---

### Day 21 (Wednesday) - Deploy Backend Services
**Hours:** 6h  
**Goal:** Deploy all microservices to EC2

**Tasks:**
- [ ] **1.5h** - Clone repository and prepare code
  - Set up SSH key for GitHub on EC2:
    ```bash
    ssh-keygen -t ed25519 -C "your-email@example.com"
    cat ~/.ssh/id_ed25519.pub
    # Copy public key to GitHub > Settings > SSH keys
    ```
  - Clone repository:
    ```bash
    cd ~
    git clone git@github.com:your-username/finance-tracker.git
    cd finance-tracker
    ```
  - Create production docker-compose.yml:
    - Update database host to RDS endpoint
    - Update Redis to use Docker container
    - Set memory limits for each service:
      - Gateway: 256MB
      - User Service: 256MB
      - Expense Service: 256MB
      - Analytics Service: 256MB
      - Receipt Service: 256MB
      - PostgreSQL: Not needed (using RDS)
      - Redis: 128MB
    - Set environment variables from .env file
    - Configure health checks for all services
    - Configure restart policy: unless-stopped
  - Update application.properties for production:
    - Use environment variables
    - Enable production profiles
    - Disable debug logging
    - Configure connection pools (max 10 connections per service)
- [ ] **2h** - Build and push Docker images
  - Option 1: Build on EC2 (slower but simpler):
    ```bash
    cd finance-tracker
    docker-compose build
    ```
  - Option 2: Build locally and push to Docker Hub:
    ```bash
    # On local machine
    docker-compose build
    docker tag user-service:latest your-dockerhub/user-service:latest
    docker push your-dockerhub/user-service:latest
    # Repeat for all services
    
    # On EC2
    docker pull your-dockerhub/user-service:latest
    # Pull all services
    ```
  - Verify images built successfully:
    ```bash
    docker images
    ```
  - Check image sizes:
    - Aim for <200MB per service
    - If larger, optimize Dockerfiles
- [ ] **2h** - Deploy services with Docker Compose
  - Create Docker network:
    ```bash
    docker network create backend-network
    ```
  - Start services:
    ```bash
    cd finance-tracker
    docker-compose up -d
    ```
  - Check all containers running:
    ```bash
    docker ps
    ```
  - Check logs for each service:
    ```bash
    docker-compose logs -f user-service
    docker-compose logs -f expense-service
    docker-compose logs -f analytics-service
    docker-compose logs -f receipt-service
    docker-compose logs -f api-gateway
    docker-compose logs -f redis
    ```
  - Fix any startup issues:
    - Database connection errors
    - Missing environment variables
    - Port conflicts
    - Out of memory errors
  - Verify inter-service communication:
    - Test API Gateway can reach all services
    - Check database connections
    - Check Redis connections
  - Set up auto-restart:
    - Docker Compose already configured with restart: unless-stopped
    - Services will auto-restart on failure
- [ ] **0.5h** - Test deployed backend
  - Test API Gateway:
    ```bash
    curl http://localhost:8080/api/auth/register
    ```
  - Test each service health endpoint:
    ```bash
    curl http://localhost:8080/api/users/health
    curl http://localhost:8080/api/expenses/health
    curl http://localhost:8080/api/analytics/health
    curl http://localhost:8080/api/receipts/health
    ```
  - Test authentication:
    - Register a test user
    - Login and get JWT token
    - Test protected endpoints with token
  - Monitor resource usage:
    ```bash
    docker stats
    ```
  - Verify memory usage under limits
  - Check CPU usage
  - Monitor disk space: `df -h`

**Deliverables:**
- Repository cloned to EC2
- Production docker-compose.yml configured
- All Docker images built
- All services deployed and running:
  - API Gateway
  - User Service
  - Expense Service
  - Analytics Service
  - Receipt Service
  - Redis
- Services communicating correctly
- Database connected (RDS)
- APIs tested and working
- Resource usage monitored

---

### Day 22 (Thursday) - NGINX, SSL & Domain
**Hours:** 6h  
**Goal:** Configure reverse proxy and secure with SSL

**Tasks:**
- [ ] **2h** - Configure NGINX as reverse proxy
  - Create NGINX configuration:
    ```bash
    sudo nano /etc/nginx/sites-available/finance-tracker
    ```
  - Add configuration:
    ```nginx
    upstream api_backend {
        server localhost:8080;
    }
    
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        client_max_body_size 10M;
        
        # API routes
        location /api/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Health check
        location /health {
            proxy_pass http://api_backend/actuator/health;
        }
    }
    ```
  - Enable site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/finance-tracker /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    ```
  - Test configuration:
    ```bash
    sudo nginx -t
    ```
  - Reload NGINX:
    ```bash
    sudo systemctl reload nginx
    ```
  - Configure rate limiting:
    ```bash
    sudo nano /etc/nginx/nginx.conf
    ```
    Add in http block:
    ```nginx
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    ```
    Add in location /api/:
    ```nginx
    limit_req zone=api_limit burst=20 nodelay;
    ```
  - Configure CORS:
    Add to location /api/:
    ```nginx
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    ```
  - Reload NGINX again
  - Test API through NGINX:
    ```bash
    curl http://<public-ip>/api/auth/register
    ```
- [ ] **2h** - Set up domain (optional but recommended)
  - Option 1: Use free subdomain from Freenom or similar
  - Option 2: Buy cheap domain (~$1-2/year) from Namecheap/GoDaddy
  - Option 3: Use free Cloudflare subdomain (after Cloudflare setup)
  - Configure DNS:
    - If using own domain:
      - Add A record: @ → <elastic-ip>
      - Add A record: www → <elastic-ip>
      - Add CNAME for API: api → your-domain.com
    - Wait for DNS propagation (5-30 minutes)
    - Test: `ping your-domain.com`
  - Update NGINX config with domain:
    ```bash
    sudo nano /etc/nginx/sites-available/finance-tracker
    ```
    Update server_name to your actual domain
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```
  - Test domain:
    ```bash
    curl http://your-domain.com/api/health
    ```
- [ ] **1.5h** - Install SSL certificate
  - Get Let's Encrypt SSL certificate:
    ```bash
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```
  - Follow prompts:
    - Enter email
    - Agree to terms
    - Choose to redirect HTTP to HTTPS (option 2)
  - Certbot will automatically:
    - Get certificate
    - Update NGINX config
    - Set up HTTPS
    - Configure auto-renewal
  - Verify HTTPS working:
    - Visit https://your-domain.com/api/health in browser
    - Check for padlock icon
  - Test SSL configuration:
    - Visit https://www.ssllabs.com/ssltest/
    - Enter your domain
    - Aim for A+ rating
  - Set up certificate auto-renewal:
    ```bash
    sudo systemctl status certbot.timer
    ```
    Should show "active"
  - Test renewal:
    ```bash
    sudo certbot renew --dry-run
    ```
- [ ] **0.5h** - Final testing
  - Test HTTPS API endpoints:
    ```bash
    curl https://your-domain.com/api/health
    ```
  - Test from web browser
  - Test from Postman/Thunder Client
  - Test authentication flow:
    - Register user
    - Login
    - Access protected endpoints
  - Test all CRUD operations
  - Test voice and receipt endpoints
  - Test analytics endpoints
  - Monitor NGINX logs:
    ```bash
    sudo tail -f /var/log/nginx/access.log
    sudo tail -f /var/log/nginx/error.log
    ```
  - Document API base URL for frontend

**Deliverables:**
- NGINX configured as reverse proxy
- Rate limiting enabled (10 req/sec)
- CORS configured
- Domain configured (if using)
- SSL certificate installed
- HTTPS working
- Auto-renewal configured
- All APIs accessible via HTTPS
- Full system tested end-to-end

---

### Day 23 (Friday) - Monitoring & Backups
**Hours:** 6h  
**Goal:** Set up monitoring and automated backups

**Tasks:**
- [ ] **2h** - Configure CloudWatch monitoring
  - Install CloudWatch agent on EC2:
    ```bash
    wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
    sudo dpkg -i amazon-cloudwatch-agent.deb
    ```
  - Configure CloudWatch agent:
    ```bash
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
    ```
    Select:
    - Monitor system metrics
    - CPU, Memory, Disk, Network
    - Send to CloudWatch
  - Start agent:
    ```bash
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
      -a fetch-config \
      -m ec2 \
      -s \
      -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
    ```
  - Configure log streaming:
    - Stream Docker logs to CloudWatch
    - Create log groups:
      - /aws/ec2/finance-tracker/user-service
      - /aws/ec2/finance-tracker/expense-service
      - /aws/ec2/finance-tracker/analytics-service
      - /aws/ec2/finance-tracker/receipt-service
      - /aws/ec2/finance-tracker/api-gateway
      - /aws/ec2/finance-tracker/nginx
  - Set up Docker logging driver:
    Update docker-compose.yml:
    ```yaml
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    ```
  - Create CloudWatch dashboard:
    - Go to CloudWatch > Dashboards
    - Create dashboard: finance-tracker
    - Add widgets:
      - CPU Utilization
      - Memory Usage
      - Disk Usage
      - Network In/Out
      - Docker container stats
      - API response times (if available)
  - Set up alarms:
    - High CPU alarm (>80% for 5 minutes)
    - High Memory alarm (>90% for 5 minutes)
    - Disk space alarm (<2GB free)
    - Service down alarm (health check fail)
    - Configure email notifications
- [ ] **2h** - Set up automated database backups
  - Create backup script:
    ```bash
    sudo nano /home/ubuntu/backup.sh
    ```
    ```bash
    #!/bin/bash
    
    # Configuration
    BACKUP_DIR="/home/ubuntu/backups"
    DB_HOST="<rds-endpoint>"
    DB_NAME="finance_tracker"
    DB_USER="postgres"
    PGPASSWORD="<password>"
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
    S3_BUCKET="your-backup-bucket" # Optional
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    
    # Create backup
    echo "Starting backup at $DATE"
    export PGPASSWORD
    pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        echo "Backup successful: $BACKUP_FILE"
        
        # Compress backup
        gzip $BACKUP_FILE
        
        # Optional: Upload to S3
        # aws s3 cp $BACKUP_FILE.gz s3://$S3_BUCKET/
        
        # Delete backups older than 7 days
        find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
        
        echo "Backup completed successfully"
    else
        echo "Backup failed!"
        exit 1
    fi
    ```
  - Make script executable:
    ```bash
    chmod +x /home/ubuntu/backup.sh
    ```
  - Test backup script:
    ```bash
    ./backup.sh
    ```
  - Verify backup created
  - Set up cron job for daily backups:
    ```bash
    crontab -e
    ```
    Add:
    ```bash
    # Daily backup at 2 AM
    0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/backup.log 2>&1
    ```
  - Test backup restoration:
    ```bash
    # Restore test
    gunzip -c backup_20260115_020000.sql.gz | pg_restore -h <rds-endpoint> -U postgres -d finance_tracker_test
    ```
  - Document restoration procedure
- [ ] **1.5h** - Set up health checks and uptime monitoring
  - Create health check endpoint test script:
    ```bash
    sudo nano /home/ubuntu/health-check.sh
    ```
    ```bash
    #!/bin/bash
    
    SERVICES=(
        "https://your-domain.com/api/health"
        "https://your-domain.com/api/users/health"
        "https://your-domain.com/api/expenses/health"
        "https://your-domain.com/api/analytics/health"
        "https://your-domain.com/api/receipts/health"
    )
    
    for service in "${SERVICES[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" $service)
        if [ $response -eq 200 ]; then
            echo "✓ $service is UP"
        else
            echo "✗ $service is DOWN (HTTP $response)"
            # Send alert (email, Slack, etc.)
        fi
    done
    ```
  - Make executable: `chmod +x health-check.sh`
  - Set up uptime monitoring (choose one):
    - Option 1: UptimeRobot (free, 50 monitors, 5-min intervals)
    - Option 2: StatusCake (free, 10 monitors)
    - Option 3: AWS CloudWatch Synthetics (costs $0.001 per check)
  - Configure uptime monitoring:
    - Add your domain
    - Monitor interval: 5 minutes
    - HTTP(S) check
    - Check API health endpoints
    - Set up email alerts
    - Set up status page (optional)
  - Create health check cron:
    ```bash
    crontab -e
    ```
    Add:
    ```bash
    # Health check every 5 minutes
    */5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/health-check.log 2>&1
    ```
- [ ] **0.5h** - Document and test monitoring
  - Test all alarms:
    - Manually trigger high CPU (stress test)
    - Verify alarm email received
  - Test backup restoration:
    - Restore latest backup to test database
    - Verify data integrity
  - Review CloudWatch dashboard:
    - Check all metrics displaying
    - Verify no errors
  - Document monitoring setup:
    - CloudWatch dashboard URL
    - Alarm thresholds
    - Backup schedule
    - Restoration procedure
    - Health check URLs
  - Create runbook for common issues:
    - Service down: restart Docker container
    - High memory: restart services
    - Disk full: clean logs
    - Database issues: check RDS
  - Week 4 review:
    - All services deployed ✅
    - SSL configured ✅
    - Monitoring active ✅
    - Backups automated ✅
    - Total cost: ~$5-10/month ✅

**Deliverables:**
- CloudWatch agent installed and configured
- Log streaming to CloudWatch
- CloudWatch dashboard created
- Alarms configured (CPU, memory, disk, service health)
- Automated daily database backups
- Backup script tested
- Backup restoration procedure documented
- Health checks configured
- Uptime monitoring active
- Email alerts working
- Runbook created for common issues
- Week 4 complete: Backend fully deployed and monitored on AWS

---

## WEEK 5: FRONTEND DEPLOYMENT & CI/CD (DAYS 25-30)

### Day 24 (Saturday) - Deploy Web App & Start CI/CD
**Hours:** 6h  
**Goal:** Deploy React web app and set up CI/CD pipeline

**Tasks:**
- [ ] **2h** - Prepare web app for deployment
  - Update API base URL:
    - Create environment files:
      - .env.development (localhost)
      - .env.production (your AWS domain)
    - Update axios config to use environment variables:
    ```typescript
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    ```
  - Optimize production build:
    - Enable code splitting
    - Configure lazy loading for routes:
    ```typescript
    const Dashboard = lazy(() => import('./pages/Dashboard'));
    const Expenses = lazy(() => import('./pages/Expenses'));
    const Analytics = lazy(() => import('./pages/Analytics'));
    const Settings = lazy(() => import('./pages/Settings'));
    ```
    - Optimize images (compress, use WebP)
    - Remove console.logs
    - Enable minification
  - Build production version:
    ```bash
    npm run build
    ```
  - Test production build locally:
    ```bash
    npm run preview
    ```
  - Verify all features working
  - Check bundle size (aim for <500KB initial load)
- [ ] **2h** - Deploy to Vercel
  - Create Vercel account (if not already)
  - Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
  - Login to Vercel:
    ```bash
    vercel login
    ```
  - Deploy from local:
    ```bash
    cd finance-tracker-web
    vercel
    ```
  - Follow prompts:
    - Link to existing project or create new
    - Set up project
    - Deploy
  - Or deploy from GitHub:
    - Push code to GitHub
    - Go to vercel.com
    - Import project from GitHub
    - Connect repository
    - Configure:
      - Framework Preset: Vite
      - Build Command: `npm run build`
      - Output Directory: `dist`
      - Install Command: `npm install`
    - Add environment variables:
      - VITE_API_BASE_URL=https://your-domain.com
    - Deploy
  - Wait for deployment (~2-3 minutes)
  - Get deployment URL (e.g., finance-tracker.vercel.app)
  - Test deployed web app:
    - Test login/register
    - Test all features
    - Test on different browsers
    - Test on mobile browsers
  - Configure custom domain (optional):
    - Add domain in Vercel dashboard
    - Update DNS records (CNAME)
    - Wait for DNS propagation
    - Enable HTTPS (automatic)
- [ ] **1.5h** - Set up GitHub Actions for backend
  - Create .github/workflows directory:
    ```bash
    mkdir -p .github/workflows
    ```
  - Create backend CI/CD workflow:
    ```bash
    nano .github/workflows/backend-deploy.yml
    ```
    ```yaml
    name: Backend CI/CD
    
    on:
      push:
        branches: [main]
        paths:
          - 'backend/**'
      pull_request:
        branches: [main]
    
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          
          - name: Set up JDK 21
            uses: actions/setup-java@v3
            with:
              java-version: '21'
              distribution: 'temurin'
          
          - name: Cache Maven packages
            uses: actions/cache@v3
            with:
              path: ~/.m2
              key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
          
          - name: Run tests
            run: |
              cd backend
              mvn test
          
          - name: Generate test report
            if: always()
            uses: dorny/test-reporter@v1
            with:
              name: Maven Tests
              path: '**/target/surefire-reports/*.xml'
              reporter: java-junit
      
      deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'
        
        steps:
          - uses: actions/checkout@v3
          
          - name: Deploy to AWS EC2
            uses: appleboy/ssh-action@v1.0.0
            with:
              host: ${{ secrets.AWS_EC2_HOST }}
              username: ubuntu
              key: ${{ secrets.AWS_EC2_SSH_KEY }}
              script: |
                cd ~/finance-tracker
                git pull origin main
                docker-compose down
                docker-compose build
                docker-compose up -d
                docker system prune -f
    ```
  - Add GitHub secrets:
    - Go to GitHub repo > Settings > Secrets and variables > Actions
    - Add secrets:
      - AWS_EC2_HOST (your EC2 public IP or domain)
      - AWS_EC2_SSH_KEY (contents of your .pem file)
  - Test workflow:
    - Commit and push changes
    - Go to Actions tab
    - Verify workflow runs successfully
- [ ] **0.5h** - Set up GitHub Actions for frontend
  - Create frontend CI/CD workflow:
    ```bash
    nano .github/workflows/frontend-deploy.yml
    ```
    ```yaml
    name: Frontend CI/CD
    
    on:
      push:
        branches: [main]
        paths:
          - 'frontend-web/**'
      pull_request:
        branches: [main]
    
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          
          - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
              node-version: '20'
              cache: 'npm'
              cache-dependency-path: frontend-web/package-lock.json
          
          - name: Install dependencies
            run: |
              cd frontend-web
              npm ci
          
          - name: Run tests
            run: |
              cd frontend-web
              npm test
          
          - name: Build
            run: |
              cd frontend-web
              npm run build
      
      deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'
        
        steps:
          - uses: actions/checkout@v3
          
          - name: Deploy to Vercel
            uses: amondnet/vercel-action@v25
            with:
              vercel-token: ${{ secrets.VERCEL_TOKEN }}
              vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
              vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
              working-directory: frontend-web
              vercel-args: '--prod'
    ```
  - Add Vercel secrets to GitHub:
    - Get Vercel token: vercel.com > Settings > Tokens
    - Get Org ID and Project ID from Vercel project settings
    - Add to GitHub secrets:
      - VERCEL_TOKEN
      - VERCEL_ORG_ID
      - VERCEL_PROJECT_ID
  - Test workflow:
    - Commit and push changes
    - Verify deployment to Vercel

**Deliverables:**
- Web app deployed to Vercel
- Custom domain configured (optional)
- Web app fully functional with AWS backend
- GitHub Actions CI/CD for backend:
  - Run tests on PR
  - Deploy to EC2 on merge to main
- GitHub Actions CI/CD for frontend:
  - Run tests on PR
  - Deploy to Vercel on merge to main
- All secrets configured
- Automated deployment working

---

### Day 25 (Sunday) - REST DAY
**No work scheduled - rest and recharge for final push!**

---

### Day 26 (Monday) - Performance Optimization & Testing
**Hours:** 6h  
**Goal:** Optimize and thoroughly test entire system

**Tasks:**
- [ ] **2h** - Backend performance optimization
  - Database optimization:
    - Analyze slow queries:
    ```sql
    SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
    ```
    - Add missing indexes:
    ```sql
    CREATE INDEX idx_expenses_user_date ON expenses(user_id, date DESC);
    CREATE INDEX idx_expenses_category ON expenses(category_id);
    CREATE INDEX idx_expenses_date ON expenses(date);
    ```
    - Optimize N+1 queries (use @EntityGraph or JOIN FETCH)
    - Configure connection pool:
    ```properties
    spring.datasource.hikari.maximum-pool-size=10
    spring.datasource.hikari.minimum-idle=5
    spring.datasource.hikari.connection-timeout=30000
    ```
  - Redis optimization:
    - Increase cache TTL for static data (categories)
    - Decrease TTL for dynamic data (analytics: 1 hour)
    - Add cache warming on startup
    - Monitor cache hit rate
  - API optimization:
    - Enable GZIP compression in Spring Boot
    - Add pagination to all list endpoints
    - Implement proper HTTP caching headers
    - Add ETag support for frequently accessed resources
  - Docker optimization:
    - Reduce image sizes (remove build dependencies)
    - Optimize Docker layer caching
    - Set resource limits:
    ```yaml
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    ```
  - Monitor improvements:
    - Check API response times
    - Monitor database query times
    - Check memory usage
- [ ] **2h** - Frontend performance optimization
  - Bundle optimization:
    - Analyze bundle with vite-bundle-visualizer:
    ```bash
    npm run build -- --mode analyze
    ```
    - Remove unused dependencies
    - Code split large libraries
    - Tree-shake lodash (import specific functions)
  - Image optimization:
    - Compress all images
    - Use WebP format with fallback
    - Implement lazy loading:
    ```typescript
    <img loading="lazy" src="..." alt="..." />
    ```
    - Use srcset for responsive images
  - React optimization:
    - Add React.memo to frequently re-rendered components
    - Use useMemo for expensive calculations
    - Use useCallback for event handlers
    - Implement virtual scrolling for long lists (use react-window)
  - Caching optimization:
    - Configure TanStack Query stale time:
    ```typescript
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ```
    - Prefetch data on route hover
    - Add service worker for offline caching
  - Measure improvements:
    - Run Lighthouse audit (aim for 90+ score)
    - Check Core Web Vitals (LCP, FID, CLS)
    - Test on slow 3G connection
    - Verify improvements
- [ ] **1.5h** - Load testing
  - Install Apache JMeter or use k6:
    ```bash
    brew install k6  # or download from k6.io
    ```
  - Create load test script (k6):
    ```javascript
    import http from 'k6/http';
    import { check, sleep } from 'k6';
    
    export let options = {
      stages: [
        { duration: '1m', target: 10 },   // Ramp up to 10 users
        { duration: '3m', target: 50 },   // Stay at 50 users
        { duration: '1m', target: 100 },  // Spike to 100 users
        { duration: '1m', target: 0 },    // Ramp down
      ],
    };
    
    const BASE_URL = 'https://your-domain.com';
    
    export default function () {
      // Login
      let loginRes = http.post(`${BASE_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'password123',
      });
      
      check(loginRes, {
        'login successful': (r) => r.status === 200,
      });
      
      let token = loginRes.json('token');
      let headers = { Authorization: `Bearer ${token}` };
      
      // Get expenses
      let expensesRes = http.get(`${BASE_URL}/api/expenses`, { headers });
      check(expensesRes, {
        'expenses fetched': (r) => r.status === 200,
      });
      
      sleep(1);
    }
    ```
  - Run load test:
    ```bash
    k6 run load-test.js
    ```
  - Analyze results:
    - Response times (p95, p99)
    - Error rate
    - Requests per second
    - Resource usage during test
  - Identify bottlenecks:
    - Slow database queries
    - High memory usage
    - High CPU usage
    - Network latency
  - Fix issues and retest
- [ ] **0.5h** - End-to-end testing
  - Web app testing:
    - Test complete user journey (register → login → add expenses → view analytics → logout)
    - Test on Chrome, Firefox, Safari
    - Test on mobile browsers
    - Test voice input
    - Test receipt scanning
    - Test all CRUD operations
    - Test filters and search
    - Test pagination
    - Test analytics charts
    - Test dark/light theme
  - Mobile app testing:
    - Test on Android device
    - Test on iOS device
    - Test same user journey as web
    - Test offline functionality
    - Test camera and voice permissions
  - Document any bugs found
  - Fix critical bugs immediately
  - Create issues for minor bugs

**Deliverables:**
- Backend optimized:
  - Database indexes added
  - Connection pooling configured
  - Caching optimized
  - API response times improved
- Frontend optimized:
  - Bundle size reduced
  - Images optimized
  - React components optimized
  - Caching configured
  - Lighthouse score 90+
- Load testing completed:
  - Handles 100 concurrent users
  - Response times <500ms (p95)
  - Error rate <1%
- End-to-end testing completed:
  - All features working on web
  - All features working on mobile
  - Cross-browser tested
  - Critical bugs fixed

---

### Day 27 (Tuesday) - Documentation & Polish
**Hours:** 6h  
**Goal:** Complete all documentation

**Tasks:**
- [ ] **2h** - Write comprehensive README
  - Project overview section:
    - Name and tagline
    - Brief description (2-3 paragraphs)
    - Key features (bullet points)
    - Screenshots (4-6 images)
    - Demo links (web app, video)
  - Tech stack section:
    - Backend: Spring Boot 4, Java 21, PostgreSQL, Redis
    - Frontend: React, TypeScript, Tailwind, shadcn/ui
    - Mobile: React Native, React Native Paper
    - AI: Google Speech-to-Text, Claude AI, Tesseract OCR
    - Infrastructure: AWS EC2, RDS, Docker, NGINX
    - CI/CD: GitHub Actions, Vercel
  - Features section (detailed):
    - 🎤 Voice-to-expense (Vietnamese support)
    - 📸 Receipt scanning with OCR
    - 📊 AI-powered insights
    - 💰 Multi-currency support
    - 📱 Mobile and web apps
    - 🔒 Secure authentication
    - 📈 Analytics and charts
  - Architecture diagram:
    - Create diagram showing all components
    - Show data flow
    - Show AWS infrastructure
  - Getting started section:
    - Prerequisites
    - Installation steps
    - Configuration
    - Running locally
  - Deployment section:
    - Docker deployment
    - AWS deployment
    - Vercel deployment
  - API documentation link
  - Contributing guidelines
  - License (MIT recommended)
  - Contact information
- [ ] **1.5h** - Write API documentation
  - Use Swagger/OpenAPI:
    - Add springdoc-openapi dependency
    - Configure Swagger UI
    - Add annotations to controllers:
    ```java
    @Operation(summary = "Get all expenses")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/expenses")
    public ResponseEntity<Page<ExpenseDTO>> getExpenses(...) {
        ...
    }
    ```
  - Generate API documentation:
    - Access Swagger UI: `https://your-domain.com/swagger-ui.html`
    - Export OpenAPI spec
  - Create API documentation markdown:
    - Authentication endpoints (register, login, logout)
    - User endpoints (get profile, update profile, change password)
    - Expense endpoints (CRUD, voice, receipt)
    - Category endpoints (CRUD)
    - Analytics endpoints (summary, by category, trends, insights)
  - Include for each endpoint:
    - HTTP method and path
    - Request headers (authorization)
    - Request body (JSON example)
    - Response body (JSON example)
    - Status codes
    - Error responses
  - Add Postman collection:
    - Export Postman collection
    - Include in repository
    - Add import instructions
- [ ] **1.5h** - Write deployment guides
  - Local development guide:
    - Prerequisites
    - Clone repository
    - Configure environment variables
    - Run with Docker Compose
    - Access applications
    - Troubleshooting
  - AWS deployment guide:
    - Prerequisites (AWS account, domain)
    - Step 1: Set up AWS account and budget
    - Step 2: Launch EC2 instance
    - Step 3: Set up RDS database
    - Step 4: Configure security groups
    - Step 5: Deploy backend with Docker
    - Step 6: Configure NGINX and SSL
    - Step 7: Set up monitoring
    - Step 8: Configure backups
    - Cost breakdown and optimization tips
    - Troubleshooting common issues
  - Vercel deployment guide:
    - Prerequisites
    - Configure environment variables
    - Deploy from GitHub
    - Configure custom domain
    - Troubleshooting
  - Mobile app deployment guide:
    - Android:
      - Build APK
      - Sign APK
      - Distribute (Google Play or APK download)
    - iOS (if applicable):
      - Build IPA
      - TestFlight deployment
      - App Store submission
- [ ] **1h** - Create diagrams and visuals
  - Architecture diagram:
    - Use draw.io, Lucidchart, or Excalidraw
    - Show all components
    - Show connections
    - Color-code by layer (frontend, backend, database, external APIs)
  - Database ER diagram:
    - Show all tables
    - Show relationships
    - Show key fields
  - Sequence diagrams for key flows:
    - User registration and login
    - Voice-to-expense flow
    - Receipt scanning flow
    - Analytics generation flow
  - Screenshots for README:
    - Dashboard
    - Expense list
    - Add expense modal
    - Voice input
    - Receipt scanning
    - Analytics page
  - Take professional screenshots:
    - Use consistent test data
    - Show features in action
    - Use good lighting (for mobile screenshots)
    - Crop appropriately

**Deliverables:**
- Comprehensive README with:
  - Project overview
  - Features list
  - Screenshots
  - Tech stack
  - Architecture diagram
  - Getting started guide
  - Deployment instructions
- Complete API documentation:
  - Swagger UI available
  - Markdown documentation
  - Postman collection
- Deployment guides:
  - Local development
  - AWS deployment
  - Vercel deployment
  - Mobile app deployment
- Diagrams:
  - Architecture diagram
  - Database ER diagram
  - Sequence diagrams
  - Screenshots

---

### Day 28 (Wednesday) - Create Demo Materials
**Hours:** 6h  
**Goal:** Create demo video and blog post

**Tasks:**
- [ ] **3h** - Create demo video
  - Write video script:
    - Introduction (30 seconds):
      - "Hi, I'm [name], and I built a personal finance tracker with voice input and AI-powered insights"
      - Brief overview of features
    - Problem statement (30 seconds):
      - Manual expense tracking is tedious
      - Hard to remember all expenses
      - Difficult to analyze spending patterns
    - Solution walkthrough (4-5 minutes):
      - Show web app:
        - Quick registration/login
        - Dashboard overview
        - Add expense manually
        - Add expense with voice (Vietnamese)
        - Scan receipt with camera
        - View analytics and charts
        - View AI insights
      - Show mobile app:
        - Same key features
        - Emphasize camera and voice
      - Show backend architecture briefly
      - Mention AWS deployment
    - Technical highlights (1 minute):
      - Microservices architecture
      - AI integration (Google Speech-to-Text, Claude, Tesseract)
      - Multi-currency support
      - Cost-effective AWS deployment (<$10/month)
      - CI/CD with GitHub Actions
    - Conclusion (30 seconds):
      - Recap key features
      - Mention open source (GitHub link)
      - Call to action (try it, give feedback)
  - Record video:
    - Set up recording environment (quiet, good lighting)
    - Use screen recording software (OBS Studio, QuickTime, or Loom)
    - Record in 1080p
    - Show face picture-in-picture (optional)
    - Record demo:
      - Follow script
      - Show features clearly
      - Keep pace steady (not too fast)
      - Re-record sections if needed
  - Edit video:
    - Use DaVinci Resolve (free), iMovie, or similar
    - Add transitions between sections
    - Add text overlays for key points:
      - Feature names
      - Tech stack
      - Cost savings
    - Add background music (royalty-free from YouTube Audio Library)
    - Add intro title card
    - Add outro with GitHub link and contact
    - Color correct if needed
    - Adjust audio levels
  - Export video:
    - Export in 1080p
    - H.264 codec
    - Target file size: <200MB
  - Create thumbnail:
    - Eye-catching design
    - Include app screenshot
    - Add text: "AI-Powered Finance Tracker"
    - Use Canva or Figma
- [ ] **2.5h** - Write technical blog post
  - Title ideas:
    - "Building a Voice-Enabled Finance Tracker with Spring Boot, React, and Claude AI"
    - "How I Built a Full-Stack Finance App in 6 Weeks (AWS Deployment for <$10/month)"
    - "AI-Powered Personal Finance: Integrating Speech-to-Text and Claude for Vietnamese Expense Tracking"
  - Article structure:
    - Introduction (2-3 paragraphs):
      - Personal motivation for the project
      - Problem you're solving
      - Overview of solution
    - Architecture Overview (3-4 paragraphs):
      - Microservices architecture
      - Why this approach?
      - High-level diagram
      - Tech stack justification
    - Key Features (5-6 sections):
      - Voice-to-expense with Vietnamese support
        - Google Speech-to-Text API integration
        - Claude AI for parsing
        - Code examples
      - Receipt scanning with OCR
        - Tesseract setup
        - Image preprocessing
        - Claude parsing
        - Code examples
      - AI-powered insights
        - How Claude analyzes spending
        - Example prompts
        - Code examples
      - Multi-currency support
        - Implementation approach
      - Analytics and charts
        - Data aggregation
        - Chart libraries
      - Mobile app
        - React Native setup
        - Sharing code with web
    - AWS Deployment on a Budget (3-4 paragraphs):
      - Infrastructure choices (EC2 Spot, RDS Free Tier)
      - Docker deployment
      - Cost breakdown
      - Optimization tips
      - Monitoring and backups
    - Challenges and Solutions (3-4 sections):
      - Challenge: Vietnamese language support
        - Solution: Tuned prompts, handled Viglish
      - Challenge: OCR accuracy on receipts
        - Solution: Image preprocessing, AI parsing
      - Challenge: Keeping AWS costs low
        - Solution: Spot instances, Free Tier, efficient Docker
      - Challenge: Managing microservices complexity
        - Solution: API Gateway, Docker Compose, monitoring
    - Key Learnings (bullet points):
      - Microservices trade-offs
      - AI integration best practices
      - AWS cost optimization
      - Mobile development insights
      - Testing strategies
    - Future Improvements (bullet points):
      - Features to add (budgeting, recurring expenses, etc.)
      - Technical debt to address
      - Scalability improvements
    - Conclusion (2 paragraphs):
      - Summary of achievement
      - Encourage readers to try it
      - GitHub link, demo link
    - Add code snippets (properly formatted)
    - Add screenshots and diagrams
    - Add relevant links
  - Proofread and edit:
    - Check grammar and spelling
    - Ensure technical accuracy
    - Verify all links work
    - Check code formatting
  - Choose platform:
    - Medium
    - Dev.to
    - Personal blog
    - Hashnode
  - Format for platform:
    - Add tags (spring-boot, react, ai, aws, etc.)
    - Add cover image
    - Format code blocks
    - Add alt text for images
- [ ] **0.5h** - Publish and share
  - Upload video to YouTube:
    - Add title
    - Add description with links
    - Add tags
    - Choose thumbnail
    - Add to playlist
    - Set visibility (public)
  - Publish blog post:
    - Review one more time
    - Publish
    - Share canonical URL if cross-posting
  - Share on social media:
    - LinkedIn:
      - Share video and blog post
      - Write engaging caption
      - Tag relevant hashtags (#springboot, #reactjs, #ai, #aws)
    - Twitter/X:
      - Thread with key points
      - Share demo video
      - Link to blog post
    - Reddit:
      - r/java
      - r/reactjs
      - r/webdev
      - r/programming (be careful, read rules)
    - Vietnamese communities:
      - Viblo.asia
      - Facebook dev groups
      - DevChat
  - Ask for feedback

**Deliverables:**
- Professional demo video (5-7 minutes):
  - Clear audio and video
  - Shows all key features
  - Uploaded to YouTube
  - Engaging thumbnail
- Technical blog post (2000-3000 words):
  - Architecture explained
  - Key features detailed
  - Code examples included
  - Challenges and solutions discussed
  - Published on Medium/Dev.to
- Shared on social media:
  - LinkedIn post
  - Twitter thread
  - Reddit posts
  - Vietnamese communities

---

### Day 29 (Thursday) - Portfolio & Resume
**Hours:** 6h  
**Goal:** Update career materials and prepare for interviews

**Tasks:**
- [ ] **2.5h** - Update portfolio website
  - Add project section:
    - Project title: "AI-Powered Personal Finance Tracker"
    - Tagline: "Voice-enabled expense tracking with AI insights"
    - Project thumbnail/hero image
  - Project overview:
    - Problem statement
    - Solution overview
    - Impact/results
  - Key features section:
    - List 5-7 main features
    - Use icons
    - Brief description for each
  - Technical details:
    - Tech stack (with logos)
    - Architecture diagram
    - Code quality metrics:
      - Test coverage: 75%+
      - Code lines: ~15,000+
      - API endpoints: 30+
      - Microservices: 5
  - Screenshots and demo:
    - Embed YouTube video
    - Add 6-8 screenshots
    - Add mobile screenshots
  - Highlights and achievements:
    - "Deployed on AWS for <$10/month"
    - "80%+ accuracy on Vietnamese voice input"
    - "Automated CI/CD pipeline with GitHub Actions"
    - "Full-stack: Web + Mobile + Backend"
    - "AI integration: Google Cloud, Anthropic Claude"
  - Technical challenges section:
    - Challenge → Solution format
    - 3-4 interesting challenges
  - Links:
    - Live demo (web app URL)
    - GitHub repository
    - YouTube demo
    - Blog post
    - Download mobile app (QR code)
  - Call to action:
    - "Try the live demo"
    - "View the code on GitHub"
    - "Read the technical deep-dive"
  - Style and polish:
    - Responsive design
    - Professional look
    - Consistent with rest of portfolio
    - Good typography
    - Proper spacing
- [ ] **2h** - Update resume/CV (create 3 versions)
  - Version 1: Backend Engineer
    - Emphasize:
      - Microservices architecture
      - Spring Boot 4, Java 21
      - PostgreSQL, Redis
      - API design (RESTful)
      - Docker, AWS deployment
      - Testing (JUnit, Mockito, TestContainers)
      - CI/CD (GitHub Actions)
    - Project description:
      - "Designed and built microservices architecture with 5 services"
      - "Implemented JWT authentication and role-based access control"
      - "Integrated Google Cloud Speech-to-Text and Anthropic Claude AI"
      - "Deployed on AWS with 99.9% uptime and <$10/month cost"
      - "Achieved 80%+ test coverage with unit and integration tests"
      - "Set up automated CI/CD pipeline with GitHub Actions"
  - Version 2: Frontend/Full-Stack Engineer
    - Emphasize:
      - React, TypeScript
      - State management (Zustand, TanStack Query)
      - UI libraries (shadcn/ui, Tailwind CSS)
      - React Native for mobile
      - Performance optimization
      - Responsive design
      - Testing (Vitest, Cypress)
    - Project description:
      - "Built responsive web application with React and TypeScript"
      - "Developed cross-platform mobile app with React Native"
      - "Implemented advanced features: voice input, camera integration"
      - "Optimized performance: Lighthouse score 90+, bundle size <500KB"
      - "Deployed to Vercel with automated CI/CD"
  - Version 3: Full-Stack Engineer (balanced)
    - Balanced emphasis on both frontend and backend
    - Highlight end-to-end ownership
    - Project description:
      - "Architected and developed full-stack finance tracking application"
      - "Built microservices backend (Spring Boot) and React/React Native frontends"
      - "Integrated AI services for voice-to-text and expense parsing"
      - "Deployed on AWS with automated CI/CD and monitoring"
      - "Achieved 75%+ test coverage across stack"
  - For all versions:
    - Add to "Projects" section (prominently)
    - Quantify achievements:
      - Lines of code
      - Test coverage
      - Performance metrics
      - Cost savings
      - Development time (6 weeks)
    - Add relevant skills to "Skills" section:
      - Backend: Java, Spring Boot, PostgreSQL, Redis, Docker, AWS
      - Frontend: React, TypeScript, Tailwind CSS, React Native
      - AI/ML: Google Cloud APIs, Anthropic Claude, OCR
      - DevOps: Docker, GitHub Actions, AWS EC2/RDS, NGINX
      - Testing: JUnit, Mockito, TestContainers, Vitest, Cypress
    - Update "Summary" section to mention this project
    - Ensure ATS-friendly formatting (simple, readable by bots)
- [ ] **1h** - Create presentation slides
  - Slide 1: Title
    - Project name
    - Your name
    - Date
  - Slide 2: Problem
    - Why this project?
    - Pain points with expense tracking
  - Slide 3: Solution
    - Overview of your app
    - Key features
  - Slide 4: Architecture
    - Architecture diagram
    - Tech stack
  - Slide 5-6: Demo
    - Screenshots of key features
    - Or embed short video clips
  - Slide 7: Voice Input Feature
    - How it works
    - Google Speech-to-Text + Claude AI
    - Demo screenshot
  - Slide 8: Receipt Scanning
    - How OCR works
    - Image preprocessing
    - Claude parsing
    - Demo screenshot
  - Slide 9: AI Insights
    - How Claude analyzes spending
    - Example insights
  - Slide 10: Mobile App
    - Cross-platform with React Native
    - Key features
    - Screenshots
  - Slide 11: AWS Deployment
    - Infrastructure diagram
    - Cost optimization (<$10/month)
    - Monitoring and backups
  - Slide 12: Technical Challenges
    - Challenge 1 → Solution
    - Challenge 2 → Solution
    - Challenge 3 → Solution
  - Slide 13: Results and Metrics
    - Test coverage: 75%+
    - Performance: Lighthouse 90+
    - Cost: <$10/month
    - Development time: 6 weeks
    - Lines of code: 15,000+
  - Slide 14: Key Learnings
    - Technical learnings
    - Process learnings
  - Slide 15: Future Improvements
    - Features to add
    - Technical debt
  - Slide 16: Q&A
    - Thank you
    - Contact information
    - Links (GitHub, demo, blog)
  - Design tips:
    - Use consistent template
    - Minimal text per slide
    - Good visuals
    - High contrast
    - Professional colors
  - Practice presentation (aim for 10-15 minutes)
- [ ] **0.5h** - LinkedIn optimization
  - Update profile:
    - Add project to "Projects" section:
      - Title
      - Description
      - Skills used
      - Link to demo
      - Link to GitHub
      - Add media (screenshots, video)
  - Update "About" section:
    - Mention this project
    - Highlight your full-stack capabilities
  - Update "Experience" section:
    - Add as personal project or freelance work
  - Update "Skills" section:
    - Add any new skills learned
    - Endorsements will come later
  - Create LinkedIn post:
    - Announce project completion
    - Share demo video or screenshots
    - Brief description
    - Key achievements
    - Ask for feedback
    - Add relevant hashtags
    - Tag relevant people/companies (if appropriate)
  - Engage with comments

**Deliverables:**
- Portfolio updated with project:
  - Comprehensive project page
  - Screenshots and demo
  - Technical details
  - Links to all resources
- Resume updated (3 versions):
  - Backend engineer version
  - Frontend/Full-stack version
  - Balanced full-stack version
  - All quantified and ATS-friendly
- Presentation slides ready:
  - 15-16 professional slides
  - Ready for interviews
  - Practiced delivery
- LinkedIn optimized:
  - Project added to profile
  - Skills updated
  - Post published
  - Engaging with audience

---

### Day 30 (Friday) - Job Applications & Interview Prep
**Hours:** 6h  
**Goal:** Apply to jobs and prepare for interviews

**Tasks:**
- [ ] **2h** - Prepare STAR stories
  - Write 7-10 STAR stories about this project:
  
  1. **Situation**: Building voice input feature for Vietnamese users
     **Task**: Need to handle Vietnamese language and slang accurately
     **Action**: Integrated Google Speech-to-Text, fine-tuned Claude prompts, tested with 50+ phrases
     **Result**: Achieved 80%+ accuracy, handles Viglish code-switching
  
  2. **Situation**: AWS costs were exceeding budget in initial deployment
     **Task**: Reduce monthly costs to under $10
     **Action**: Switched to Spot instances, used RDS Free Tier, optimized Docker containers, set up budget alerts
     **Result**: Reduced costs from $30/month to <$10/month (67% savings)
  
  3. **Situation**: Receipt OCR was giving poor results with noisy images
     **Task**: Improve OCR accuracy to 75%+
     **Action**: Implemented image preprocessing (grayscale, contrast, denoising), used Claude to parse noisy OCR text
     **Result**: Improved accuracy from 50% to 80%, handles poor quality receipts
  
  4. **Situation**: Microservices were complex to manage and debug
     **Task**: Simplify deployment and improve observability
     **Action**: Created docker-compose setup, implemented centralized logging with CloudWatch, added health checks
     **Result**: Deployment time reduced from 30min to 5min, issues detected in <1min
  
  5. **Situation**: Frontend bundle size was over 1MB, slow load times
     **Task**: Reduce to <500KB and improve Lighthouse score
     **Action**: Code splitting, lazy loading, tree-shaking, image optimization, removed unused deps
     **Result**: Bundle reduced to 400KB, Lighthouse score improved from 70 to 93
  
  6. **Situation**: Needed to deploy quickly before Tết deadline
     **Task**: Complete entire project in 6 weeks
     **Action**: Created detailed day-by-day plan, prioritized MVP features, worked 6 days/week, automated with CI/CD
     **Result**: Completed on time with all features, deployed 3 days before deadline
  
  7. **Situation**: Integration tests were slow (5+ minutes)
     **Task**: Speed up test suite to <2 minutes
     **Action**: Used TestContainers with Docker caching, parallelized tests, optimized database setup
     **Result**: Test time reduced to 90 seconds, 80%+ coverage maintained
  
  - For each story, prepare:
    - 1-minute version (concise)
    - 3-minute version (detailed)
    - Key metrics and numbers
    - Lessons learned
- [ ] **1.5h** - Prepare technical explanations
  - Microservices architecture:
    - Why microservices vs monolith?
    - How services communicate
    - API Gateway pattern
    - Service discovery (if asked)
    - Challenges and solutions
    - Trade-offs
  - AI integration:
    - How Google Speech-to-Text works
    - How you designed Claude prompts
    - Handling edge cases
    - Cost considerations
    - Alternatives considered
  - Testing strategy:
    - Unit vs integration vs E2E
    - Test pyramid approach
    - Mocking strategies
    - TestContainers benefits
    - Coverage goals and why
  - AWS deployment:
    - Infrastructure choices
    - Why EC2 Spot vs on-demand
    - Why RDS Free Tier
    - Docker benefits
    - Monitoring and alerts
    - Backup strategy
    - Cost optimization
  - CI/CD pipeline:
    - GitHub Actions setup
    - Build → Test → Deploy flow
    - Secrets management
    - Rollback strategy
  - Performance optimization:
    - Backend optimizations (indexes, caching, pooling)
    - Frontend optimizations (code splitting, lazy loading)
    - Load testing approach
    - Metrics tracked
  - Database design:
    - Schema design decisions
    - Normalization vs denormalization
    - Indexes strategy
    - Soft delete vs hard delete
  - Security:
    - JWT authentication
    - Password hashing
    - API security
    - HTTPS/SSL
    - CORS configuration
- [ ] **1.5h** - Practice interview questions
  - Technical questions:
    - "Walk me through your project architecture"
    - "How did you handle Vietnamese language support?"
    - "What were the biggest technical challenges?"
    - "How do you ensure data security?"
    - "Explain your CI/CD pipeline"
    - "How do you handle errors in microservices?"
    - "What's your testing strategy?"
    - "How do you optimize API performance?"
    - "Why did you choose React over Vue/Angular?"
    - "How do you handle state management in React?"
  - System design questions:
    - "How would you scale this to 1 million users?"
    - "How would you add real-time features?"
    - "How would you handle multi-tenancy?"
    - "Design a notification system"
  - Behavioral questions:
    - "Tell me about a time you faced a difficult technical challenge"
    - "How do you prioritize features?"
    - "Tell me about a time you had to learn a new technology quickly"
    - "How do you handle tight deadlines?"
    - "Describe a time you disagreed with a technical decision"
  - Practice answers:
    - Record yourself answering
    - Time yourself (2-3 minutes per answer)
    - Refine based on playback
  - Prepare questions to ask:
    - About tech stack
    - About team structure
    - About projects you'd work on
    - About learning/growth opportunities
    - About deployment practices
    - About code review process
- [ ] **1h** - Find and apply to jobs
  - Identify 20 target companies:
    - Filter by:
      - Tech stack match (Java/Spring Boot or React)
      - Company size (startups to mid-size)
      - Location (remote or your city)
      - Industry interest
    - Job boards:
      - LinkedIn Jobs
      - Indeed
      - AngelList (startups)
      - Glassdoor
      - Company career pages
    - Vietnamese market:
      - TopDev
      - ITviec
      - VietnamWorks
      - CareerBuilder
  - Tailor resume for each application:
    - Use appropriate version (backend/frontend/full-stack)
    - Adjust keywords to match job description
    - Highlight relevant experience
  - Write custom cover letters (optional but recommended):
    - Paragraph 1: Why this company/role
    - Paragraph 2: How your project demonstrates fit
    - Paragraph 3: What you can contribute
    - Keep to 3-4 paragraphs
  - Submit applications:
    - Fill out application forms
    - Upload appropriate resume version
    - Add cover letter
    - Include portfolio link
    - Include project demo link
  - Track applications:
    - Create spreadsheet
    - Columns: Company, Role, Date Applied, Status, Notes
    - Follow up after 1 week if no response
- [ ] **0.5h** - Final preparation
  - Create "elevator pitch" (30 seconds):
    - Who you are
    - What you built
    - Key achievement
    - What you're looking for
    - Practice until natural
  - Prepare demo environment:
    - Ensure demo site is working
    - Have backup screenshots
    - Have backup video
    - Test on different devices
  - Organize materials:
    - Resume (PDF, multiple versions)
    - Portfolio link
    - GitHub link
    - Demo link
    - Blog post link
    - References (if any)
  - Set up interview space:
    - Quiet location
    - Good lighting
    - Test camera and microphone
    - Professional background
    - Close unnecessary apps
  - Mental preparation:
    - You've built something impressive
    - You can explain it clearly
    - You've prepared thoroughly
    - Be confident but humble
    - It's okay to say "I don't know, but here's how I'd figure it out"

**Deliverables:**
- 7-10 STAR stories written and practiced
- Technical explanations prepared for all major areas
- Interview questions practiced
- 20 companies identified
- 10+ job applications submitted
- Application tracking spreadsheet created
- Elevator pitch ready
- Demo environment tested
- Interview space prepared
- **Week 5 complete: Ready to interview and land a job!**

---

## WEEK 6: POLISH, LAUNCH & CELEBRATE (DAYS 31-36)

### Day 31 (Monday) - Final Testing & Bug Fixes
**Hours:** 6h  
**Goal:** Ensure everything is production-ready

**Tasks:**
- [ ] **3h** - Comprehensive testing
  - Full regression testing:
    - Web app (all features, all browsers)
    - Mobile app (all features, both platforms)
    - Backend APIs (all endpoints)
  - Edge case testing:
    - Empty states
    - Large data sets
    - Poor network conditions
    - Concurrent users
    - Invalid inputs
    - Permission denials
  - Cross-platform testing:
    - Windows, Mac, Linux
    - Android, iOS
    - Chrome, Firefox, Safari, Edge
  - Accessibility testing:
    - Screen reader compatibility
    - Keyboard navigation
    - Color contrast
    - Alt text on images
  - Security testing:
    - SQL injection attempts
    - XSS attempts
    - CSRF protection
    - Rate limiting
    - Authentication bypass attempts
  - Document all bugs found
- [ ] **2.5h** - Fix critical bugs
  - Prioritize bugs:
    - P0: Blocking (can't use app)
    - P1: Critical (major feature broken)
    - P2: Important (minor feature broken)
    - P3: Nice to have (cosmetic)
  - Fix P0 and P1 bugs immediately
  - Fix P2 bugs if time permits
  - Document P3 bugs for future
  - Test fixes thoroughly
  - Deploy fixes
- [ ] **0.5h** - Final polish
  - UI/UX improvements:
    - Fix any visual glitches
    - Ensure consistent spacing
    - Verify all icons display
    - Check all error messages
    - Verify loading states
  - Performance final check:
    - Run Lighthouse audit
    - Check API response times
    - Monitor memory usage
    - Test on slow connections
  - Final smoke test:
    - Complete user journey
    - All features working
    - No console errors
    - No broken links

**Deliverables:**
- All critical bugs fixed
- Important bugs fixed
- Nice-to-have bugs documented
- Final smoke test passed
- Production-ready application

---

### Day 32 (Tuesday) - Launch Preparation
**Hours:** 6h  
**Goal:** Prepare for public launch

**Tasks:**
- [ ] **2h** - Create launch materials
  - Product Hunt submission (if applicable):
    - Create Product Hunt account
    - Prepare submission:
      - Tagline
      - Description
      - First comment (detailed explanation)
      - Gallery (screenshots, demo video)
      - Maker info
    - Schedule launch (Tuesday-Thursday best)
  - Social media posts:
    - LinkedIn announcement:
      - Share journey
      - Highlight achievements
      - Include demo video/screenshots
      - Add call to action
    - Twitter/X thread:
      - Thread with key points
      - Screenshots
      - Demo video
      - GitHub link
    - Facebook/Instagram (if applicable):
      - Visual post
      - Brief description
      - Demo link
    - Vietnamese communities:
      - Viblo.asia post
      - Facebook group posts
      - DevChat announcement
  - Press release (optional):
    - If targeting media coverage
    - Include key facts
    - Quotes
    - Contact information
  - Email announcement (if you have a list):
    - To friends, family, colleagues
    - Brief introduction
    - Ask for feedback
    - Share links
- [ ] **1.5h** - Create user documentation
  - User guide:
    - Getting started
    - How to register
    - How to add expenses
    - How to use voice input
    - How to scan receipts
    - How to view analytics
    - How to customize settings
    - FAQs
  - Video tutorials (optional):
    - Short 1-2 minute clips
    - Each covering one feature
    - Upload to YouTube
    - Embed in app or website
  - Help center (optional):
    - Create simple help page
    - Categorize by topic
    - Searchable
    - Contact support
- [ ] **1.5h** - Prepare landing page (optional)
  - Create simple landing page:
    - Hero section with tagline
    - Key features
    - Screenshots/demo
    - Download/try buttons
    - Tech stack
    - About you
    - Contact
  - Use tools like:
    - Carrd (simple, free)
    - Webflow (more complex)
    - Just enhance your GitHub README
  - SEO optimization:
    - Meta tags
    - Open Graph tags
    - Sitemap
    - Analytics (Google Analytics)
- [ ] **1h** - Final checks
  - Verify all links work:
    - Demo site
    - GitHub repo
    - Blog post
    - Video
    - Download links
  - Test demo site:
    - Register new user
    - Complete full journey
    - Verify everything works
  - Check mobile app distribution:
    - APK downloadable
    - Installation instructions clear
    - QR code works
  - Prepare for traffic:
    - Monitor AWS costs
    - Check server capacity
    - Have scaling plan ready
  - Set up analytics:
    - Google Analytics for web
    - Track key metrics
    - Set up goals

**Deliverables:**
- Launch materials ready:
  - Product Hunt submission (if applicable)
  - Social media posts drafted
  - Email announcement ready
- User documentation complete:
  - User guide written
  - FAQs answered
  - Help resources available
- Landing page live (optional)
- All links verified
- Analytics configured
- Ready for launch!

---

### Day 33 (Wednesday) - LAUNCH DAY! 🚀
**Hours:** 6h  
**Goal:** Launch publicly and manage initial response

**Tasks:**
- [] **2h** - Execute launch
  - Morning (ideal launch time):
    - Publish Product Hunt submission (if applicable)
      - Submit at 12:01 AM PST for full day visibility
      - Monitor comments and respond quickly
      - Encourage friends to upvote and comment
    - Post on LinkedIn:
      - Share your journey post
      - Tag relevant hashtags (#buildinpublic, #fullstack, #ai)
      - Engage with comments immediately
    - Post on Twitter/X:
      - Launch announcement thread
      - Share demo video
      - Use hashtags (#indiehacker, #buildinpublic)
    - Post on Reddit:
      - r/SideProject
      - r/webdev
      - r/java (backend focused)
      - r/reactjs (frontend focused)
      - Follow subreddit rules carefully
      - Be authentic, not spammy
    - Post on Vietnamese platforms:
      - Viblo.asia article
      - Facebook dev groups
      - DevChat announcement
    - Send email announcement:
      - To friends, family, colleagues
      - Ask for honest feedback
  - Monitor and engage:
    - Respond to all comments (within 15-30 minutes)
    - Answer questions thoroughly
    - Thank people for feedback
    - Fix any issues reported immediately
    - Be humble and grateful
- [ ] **2h** - Handle feedback and questions
  - Monitor all channels:
    - Product Hunt comments
    - LinkedIn comments
    - Twitter mentions
    - Reddit threads
    - Email inbox
    - GitHub issues
  - Respond to feedback:
    - Thank for positive feedback
    - Address concerns constructively
    - Acknowledge bugs
    - Explain technical decisions
    - Take suggestions seriously
  - Track metrics:
    - Website visits
    - Demo signups
    - GitHub stars
    - Social media engagement
    - APK downloads
  - Create feedback spreadsheet:
    - Source (Product Hunt, LinkedIn, etc.)
    - Feedback/suggestion
    - Priority
    - Action needed
    - Status
- [ ] **1.5h** - Quick improvements based on feedback
  - Address quick wins:
    - Fix any critical bugs reported
    - Improve unclear documentation
    - Add missing features if simple
    - Update FAQs with common questions
  - Deploy improvements:
    - Push fixes to GitHub
    - CI/CD will auto-deploy
    - Announce improvements on social media
  - Update materials:
    - Update README if needed
    - Add new screenshots
    - Answer new FAQs
- [ ] **0.5h** - End of day review
  - Celebrate initial launch! 🎉
  - Review metrics:
    - How many people visited?
    - How many signed up?
    - How many GitHub stars?
    - Social media reach?
  - Review feedback:
    - What worked well?
    - What needs improvement?
    - Any surprising insights?
  - Plan next steps:
    - Critical improvements for tomorrow
    - Features to prioritize
    - Additional marketing activities
  - Thank early adopters:
    - Personal thank you messages
    - Acknowledge contributors
    - Share early wins

**Deliverables:**
- Public launch complete! 🚀
- All platforms posted
- Active engagement with audience
- Initial feedback collected
- Quick improvements deployed
- Metrics tracked
- Next steps planned
- **CONGRATULATIONS ON LAUNCHING!**

---

### Day 34 (Thursday) - Post-Launch Engagement
**Hours:** 6h  
**Goal:** Sustain momentum and grow user base

**Tasks:**
- [ ] **2h** - Continue engagement
  - Respond to all new feedback:
    - Product Hunt (if still active)
    - Social media comments
    - Email questions
    - GitHub issues
  - Share user testimonials:
    - Screenshot positive feedback
    - Share on social media
    - Add to README/landing page
  - Create engagement content:
    - "Day 1 metrics" post on LinkedIn/Twitter
    - Behind-the-scenes content
    - Technical deep-dive threads
    - Feature highlight posts
  - Reach out to influencers (optional):
    - Tech YouTubers
    - Tech bloggers
    - Podcast hosts
    - Ask if they'd be interested in featuring your project
- [ ] **2h** - Implement priority improvements
  - Review feedback from yesterday
  - Prioritize top 3-5 improvements:
    - Most requested features
    - Critical bugs
    - UX improvements
  - Implement improvements:
    - Fix bugs
    - Add small features
    - Improve documentation
    - Enhance onboarding
  - Test thoroughly
  - Deploy via CI/CD
  - Announce improvements:
    - Social media update
    - Product Hunt update (if applicable)
    - Email to early users
- [ ] **1.5h** - Expand reach
  - Submit to additional platforms:
    - Hacker News (Show HN)
      - Post: "Show HN: [Project Name] – [Brief Description]"
      - Best time: 7-9 AM PST on weekday
      - Engage with comments
    - Dev.to
      - Share your blog post
      - Engage with community
    - Hashnode
      - Cross-post blog
      - Join relevant communities
    - IndieHackers
      - Share your project
      - Participate in discussions
    - BetaList (if still in beta)
    - AlternativeTo (as alternative to other finance apps)
  - Engage in communities:
    - Answer related questions on Stack Overflow
    - Share insights in Discord communities
    - Contribute to discussions on Reddit
    - Help others with similar projects
  - Content marketing:
    - Consider writing follow-up posts:
      - "What I learned launching on Product Hunt"
      - "Day 1 metrics and insights"
      - "How I got my first 100 users"
- [ ] **0.5h** - Analytics review
  - Review metrics:
    - Website traffic
    - User signups
    - GitHub stars/forks
    - Social media engagement
    - APK downloads
  - Identify trends:
    - Which channels drove most traffic?
    - What content got most engagement?
    - Where are users dropping off?
  - Adjust strategy:
    - Double down on what works
    - Improve what doesn't
  - Set goals for next week:
    - User acquisition targets
    - Engagement targets
    - Feature completion targets

**Deliverables:**
- Active engagement maintained
- Priority improvements implemented and deployed
- Expanded to additional platforms
- User testimonials collected
- Analytics reviewed
- Strategy adjusted based on data

---

### Day 35 (Friday) - Job Interview Preparation & Applications
**Hours:** 6h  
**Goal:** Leverage project for job search

**Tasks:**
- [ ] **2h** - Conduct mock interviews
  - Technical mock interview:
    - Have friend/mentor ask you questions
    - Practice explaining your project (5 min, 15 min versions)
    - Practice system design questions
    - Practice coding questions related to your project
    - Get feedback on:
      - Clarity of explanations
      - Depth of knowledge
      - Communication style
      - Body language (if video)
  - Behavioral mock interview:
    - Practice STAR stories
    - Practice answering "Tell me about yourself"
    - Practice asking questions
    - Get feedback on:
      - Story structure
      - Confidence
      - Enthusiasm
      - Professionalism
  - Record yourself:
    - Video record your answers
    - Watch playback
    - Note areas for improvement:
      - Filler words ("um", "like")
      - Pacing (too fast/slow)
      - Eye contact (if video)
      - Hand gestures
  - Refine and re-practice
- [ ] **2h** - Apply to more jobs
  - Find 20 more companies:
    - Jobs posted in last week
    - Good culture fit
    - Tech stack match
    - Location/remote preference
  - Tailor applications:
    - Update resume for each role
    - Highlight relevant project aspects
    - Write custom cover letters:
      - Mention why this company
      - How your project relates to their work
      - What you can contribute
  - Submit applications:
    - Fill forms carefully
    - Include all required materials
    - Add portfolio link prominently
    - Follow up with hiring managers on LinkedIn (if appropriate)
  - Track applications:
    - Update spreadsheet
    - Set reminders to follow up
    - Note key details about each role
  - Reach out to referrals:
    - If you know anyone at target companies
    - Ask for informational interviews
    - Request referrals if appropriate
- [ ] **1.5h** - Build job search presence
  - Optimize LinkedIn for recruiters:
    - Add "Open to Work" badge
    - Update headline with key skills
    - Ensure profile is 100% complete
    - Engage with content in your industry
    - Share updates about your project
  - Engage with companies:
    - Follow target companies on LinkedIn
    - Engage with their posts (like, comment)
    - Share their content if relevant
    - Build genuine relationships
  - Create content:
    - Share technical insights from your project
    - Write about lessons learned
    - Create helpful threads/posts
    - Build your personal brand
  - Network:
    - Reach out to alumni
    - Connect with people in similar roles
    - Join relevant Slack/Discord communities
    - Attend virtual meetups/events
- [ ] **0.5h** - Prepare for upcoming interviews
  - Research companies you applied to:
    - Company mission and values
    - Recent news
    - Products/services
    - Tech stack
    - Team structure
    - Company culture
  - Prepare company-specific questions:
    - About their tech challenges
    - About their team
    - About their roadmap
    - About growth opportunities
  - Update your "cheat sheet":
    - Key facts about your project
    - Metrics to mention
    - STAR stories
    - Questions to ask
  - Prepare your environment:
    - Test camera and mic again
    - Ensure good lighting
    - Professional background
    - Have water ready
    - Have notebook for notes
  - Mental preparation:
    - Visualize successful interview
    - Remember your achievements
    - Stay positive and confident
    - It's a conversation, not an interrogation

**Deliverables:**
- Mock interviews completed with feedback
- 20+ additional job applications submitted
- LinkedIn optimized for recruiters
- Content created and shared
- Networking initiated
- Company research completed for applied roles
- Interview preparation finalized
- Total applications: 30-40 companies

---

### Day 36 (Saturday) - Final Polish & Celebration
**Hours:** 6h  
**Goal:** Final improvements and celebrate completion!

**Tasks:**
- [ ] **2h** - Final code cleanup
  - Code review:
    - Review all code for best practices
    - Remove commented code
    - Remove debug logs
    - Ensure consistent formatting
    - Check for code smells
  - Documentation review:
    - Update all README files
    - Ensure all comments are accurate
    - Update API documentation
    - Check all links work
  - Performance final touches:
    - Run final Lighthouse audit
    - Check bundle sizes
    - Optimize any remaining bottlenecks
  - Security final check:
    - Scan for vulnerabilities (npm audit, Snyk)
    - Ensure no secrets in code
    - Verify all endpoints are protected
    - Check HTTPS everywhere
  - Commit and push final changes
- [ ] **1.5h** - Create project retrospective
  - Write retrospective document:
    - **What went well:**
      - Completed in 6 weeks ✅
      - All features implemented ✅
      - Under budget deployment ✅
      - Learned new technologies ✅
      - (Add your specific wins)
    - **What could be improved:**
      - Testing could have been more comprehensive
      - Could have started documentation earlier
      - Mobile app design could be better
      - (Add your specific areas)
    - **Key learnings:**
      - Technical learnings (list specifics)
      - Process learnings
      - Time management insights
      - What you'd do differently
    - **Metrics achieved:**
      - Test coverage: X%
      - Lighthouse score: X
      - AWS cost: $X/month
      - GitHub stars: X
      - Users: X
      - (Add all your metrics)
    - **Next steps:**
      - Features to add
      - Technical debt to address
      - Marketing plans
      - Potential monetization
  - Share retrospective:
    - Publish as blog post
    - Share on social media
    - Add to project documentation
- [ ] **1.5h** - Plan future roadmap
  - Create public roadmap:
    - Near-term (1-2 months):
      - Bug fixes
      - Minor features
      - Performance improvements
    - Mid-term (3-6 months):
      - Major features (budgets, recurring expenses, notifications)
      - Mobile app improvements
      - API for third-party integrations
    - Long-term (6+ months):
      - Premium features
      - Desktop app
      - Partnerships
      - Potential monetization
  - Publish roadmap:
    - Add to GitHub README
    - Create GitHub projects/issues
    - Share with users
    - Ask for feedback on priorities
  - Set up contribution guidelines:
    - CONTRIBUTING.md file
    - Code of conduct
    - Issue templates
    - PR templates
    - Make it easy for others to contribute
- [ ] **1h** - CELEBRATION TIME! 🎉🎊
  - Reflect on your achievement:
    - You built a full-stack application in 6 weeks!
    - You learned new technologies
    - You deployed to production
    - You created something valuable
    - You documented everything
    - You launched publicly
    - You're interview-ready!
  - Share your success:
    - Final celebration post on social media
    - Thank everyone who helped
    - Share what you learned
    - Inspire others to build
  - Reward yourself:
    - Take yourself out to dinner
    - Buy something you've wanted
    - Take a day off to relax
    - Do something fun
    - YOU EARNED IT!
  - Document the journey:
    - Take final screenshots
    - Save metrics and milestones
    - Archive important feedback
    - Save launch day memories
  - Look forward:
    - Excited for job interviews
    - Excited to maintain and grow the project
    - Excited for what's next
    - Proud of what you built

**Deliverables:**
- Final code cleanup complete
- Retrospective written and published
- Future roadmap created and shared
- Contribution guidelines set up
- **PROJECT COMPLETE!** ✅
- **YOU DID IT!** 🎉

---

## POST-6-WEEK ACTIVITIES

### Ongoing Maintenance (Weekly)
- Monitor AWS costs
- Check error logs
- Respond to user feedback
- Fix critical bugs
- Update dependencies
- Review analytics

### Continuous Improvement (Monthly)
- Add requested features
- Improve performance
- Enhance documentation
- Grow user base
- Create content

### Job Search (Until Hired)
- Continue applying (5-10 per week)
- Practice interviewing
- Network actively
- Share project updates
- Engage with community

---

## SUCCESS CHECKLIST ✅

### Technical Achievements
- [x] Full-stack application (Web + Mobile + Backend)
- [x] Microservices architecture (5 services)
- [x] AI integration (Speech-to-Text, Claude, OCR)
- [x] AWS deployment (<$10/month)
- [x] CI/CD pipeline (GitHub Actions)
- [x] 75%+ test coverage
- [x] Lighthouse score 90+
- [x] Production-ready

### Career Achievements
- [x] Portfolio updated
- [x] Resume updated (3 versions)
- [x] GitHub repository public
- [x] Demo video created
- [x] Blog post published
- [x] LinkedIn optimized
- [x] 30+ job applications
- [x] Interview-ready

### Launch Achievements
- [x] Public launch
- [x] Social media presence
- [x] User documentation
- [x] Active users
- [x] Community feedback
- [x] Future roadmap

---

## FINAL NOTES

**You've accomplished something incredible in just 6 weeks!**

- ✅ Built a production-ready full-stack application
- ✅ Integrated cutting-edge AI technologies
- ✅ Deployed to AWS on a budget
- ✅ Created comprehensive documentation
- ✅ Launched publicly
- ✅ Positioned yourself for job opportunities

**Key Takeaways:**
1. **Planning works**: Your day-by-day plan kept you on track
2. **Consistency matters**: 6 hours/day, 6 days/week = success
3. **Ship it**: Perfect is the enemy of done
4. **Learn in public**: Share your journey
5. **You can do hard things**: 6 weeks of focused work pays off

**What's Next:**
1. **Land that job**: Use this project to showcase your skills
2. **Grow the product**: Add features, gain users
3. **Give back**: Help others on their journey
4. **Keep learning**: Technology never stops evolving
5. **Stay proud**: You built something real

**Before Tết (January 28, 2026):**
- ✅ Project complete and launched
- ✅ Portfolio updated
- ✅ Applications submitted
- ✅ Ready for interviews
- 🎊 Ready to celebrate Tết with family knowing you achieved your goal!

---

**CHÚC MỪNG NĂM MỚI! HAPPY TẾT! 🎊🎉**

**You did it! Now go celebrate and prepare for your bright future! 🚀**

---

**Timeline Version:** 2.0 (6-Week Sprint)  
**Last Updated:** January 15, 2026  
**Status:** READY TO EXECUTE! 🚀  
**Deadline:** Before Tết (January 28, 2026) ✅