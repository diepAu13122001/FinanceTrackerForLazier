# AI-POWERED PERSONAL FINANCE TRACKER
## Project Requirements & Implementation Plan

**Version:** 1.0  
**Date:** December 2025  
**Timeline:** 6 weeks (42 days, 5 hours/day)  
**Target:** Java Developer Portfolio Project for Vietnam Market

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External API Integrations](#5-external-api-integrations)
6. [Data Models & API Specifications](#6-data-models--api-specifications)
7. [Testing Requirements](#7-testing-requirements)
8. [Deployment Requirements](#8-deployment-requirements)
9. [6-Week Implementation Plan](#9-6-week-implementation-plan)
10. [Success Metrics & KPIs](#10-success-metrics--kpis)
11. [Risks & Mitigation](#11-risks--mitigation)
12. [Appendix](#12-appendix)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview

The AI-Powered Personal Finance Tracker is a modern microservices-based application that enables users to track expenses effortlessly using voice input in Vietnamese and English. The system leverages artificial intelligence for natural language processing, automatic categorization, and personalized financial insights.

### 1.2 Business Value

- **Reduces expense logging time by 70%** through voice input
- **Provides actionable financial insights** using AI analysis
- **Supports Vietnamese language and culture** (VND currency, local merchants)
- **Demonstrates production-ready development skills** for job applications

### 1.3 Target Users

- Vietnamese professionals aged 25-45
- Individuals seeking better expense management
- Users comfortable with mobile/voice technology
- Budget-conscious consumers

### 1.4 Success Criteria

- ✅ 85%+ accuracy in Vietnamese speech recognition
- ✅ <200ms average API response time
- ✅ Support 100+ concurrent users
- ✅ 70%+ automated test coverage
- ✅ Zero critical security vulnerabilities

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Architecture Style

**Microservices Architecture** with API Gateway pattern

### 2.2 System Components Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Port 8080)                      │
│            Spring Cloud Gateway + JWT Validation                │
└─────────────────────────────────────────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      │                     │                     │
┌─────▼──────┐    ┌────────▼────────┐    ┌──────▼──────┐
│   USER     │    │    EXPENSE      │    │  ANALYTICS  │
│  SERVICE   │    │    SERVICE      │    │   SERVICE   │
│ (8081)     │    │    (8082)       │    │   (8083)    │
│            │    │                 │    │             │
│ - Auth/JWT │    │ - CRUD          │    │ - Reports   │
│ - Profile  │    │ - Voice Input   │    │ - AI        │
│ - Prefs    │    │ - Categories    │    │ - Budgets   │
└────────────┘    └─────────────────┘    └─────────────┘
      │                   │                      │
      └───────────────────┼──────────────────────┘
                          │
                  ┌───────▼────────┐
                  │    RECEIPT     │
                  │    SERVICE     │
                  │    (8084)      │
                  │                │
                  │ - OCR          │
                  │ - Images       │
                  └────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│ PostgreSQL │ Redis Cache │ RabbitMQ │ External APIs            │
│ (Database) │ (Sessions)  │ (Events) │ (AI Services)            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Technology Stack (2025)

#### Backend Framework
- **Java 21** (LTS - latest stable version)
- **Spring Boot 4.0.x** (latest major release)
- **Spring Cloud 2024.0.x** (coordinated with Boot 4)
- **Spring Security 7.x**
- **Spring Data JPA 4.x**
- **Spring WebFlux** (Reactive)
- **Spring AI 1.x** (for AI integration)

#### Databases
- **PostgreSQL 16.x** (primary database)
- **Redis 7.x** (caching and sessions)
- **MongoDB 7.x** (optional: for document storage)

#### Message Queue
- **RabbitMQ 3.13.x**

#### AI/ML Services
- **Google Cloud Speech-to-Text API v2**
- **Anthropic Claude API** (Claude 4 Sonnet)
- **Tesseract OCR 5.x**

#### DevOps & Tools
- **Docker 24.x** & Docker Compose
- **GitHub Actions** (CI/CD)
- **Maven 3.9.x** or Gradle 8.x
- **JUnit 5** (Jupiter)
- **Mockito 5.x**
- **TestContainers 1.19.x**
- **JaCoCo** (code coverage)

#### Cloud Deployment
- **Railway.app** or **Render.com**
- **Supabase** (PostgreSQL hosting)
- **Upstash** (Redis hosting)
- **CloudAMQP** (RabbitMQ hosting)

#### API Documentation
- **SpringDoc OpenAPI 3** (Swagger UI)

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 USER SERVICE (Microservice 1)

#### 3.1.1 User Registration

**Requirements:**
- Users can register with email and password
- Password must be hashed using BCrypt (strength 12)
- Email validation required
- Duplicate email prevention

**Acceptance Criteria:**
- [ ] `POST /api/users/register` endpoint
- [ ] Returns JWT token on success
- [ ] Returns 400 for invalid data
- [ ] Returns 409 for duplicate email

#### 3.1.2 User Authentication

**Requirements:**
- Users can login with email/password
- JWT token generation (access + refresh tokens)
- Token expiration: 1 hour (access), 7 days (refresh)

**Acceptance Criteria:**
- [ ] `POST /api/users/login` endpoint
- [ ] Returns JWT tokens on success
- [ ] Returns 401 for invalid credentials
- [ ] Implements rate limiting (5 attempts/minute)

#### 3.1.3 User Profile Management

**Requirements:**
- Users can view/edit profile
- Fields: name, email, avatar, language (vi/en), currency (VND/USD)
- Users can change password

**Acceptance Criteria:**
- [ ] `GET /api/users/me` endpoint
- [ ] `PUT /api/users/me` endpoint
- [ ] `PUT /api/users/password` endpoint
- [ ] Validates password strength

#### 3.1.4 Token Refresh

**Acceptance Criteria:**
- [ ] `POST /api/users/refresh` endpoint
- [ ] Accepts refresh token
- [ ] Returns new access token

#### Database Schema - User Service

```sql
-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    avatar_url VARCHAR(500),
    language VARCHAR(2) DEFAULT 'vi',
    currency VARCHAR(3) DEFAULT 'VND',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: refresh_tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.2 EXPENSE SERVICE (Microservice 2)

#### 3.2.1 Manual Expense Creation

**Requirements:**
- Users can create expenses manually
- Required fields: amount, currency, category, date
- Optional fields: merchant, notes, location

**Acceptance Criteria:**
- [ ] `POST /api/expenses` endpoint
- [ ] Validates amount > 0
- [ ] Supports VND and USD currencies
- [ ] Auto-converts currencies using exchange rate API

#### 3.2.2 Voice Expense Creation

**Requirements:**
- Users can upload audio files (WAV, MP3, M4A, OGG)
- System transcribes audio to text (Vietnamese/English)
- AI extracts: amount, category, merchant, date
- Auto-creates expense from extracted data

**Acceptance Criteria:**
- [ ] `POST /api/expenses/voice` endpoint
- [ ] Accepts audio file (max 10MB)
- [ ] Returns transcribed text + parsed expense
- [ ] Achieves 85%+ accuracy for Vietnamese
- [ ] Handles bilingual input (code-switching)

**Example Voice Inputs:**
- "Tôi vừa mua cà phê 45 nghìn ở Highlands"
- "Ăn tối 200k tại nhà hàng Hoa Viên"
- "Grab về nhà 35k"
- "Bought groceries for 500 thousand at Co.opmart"

#### 3.2.3 Expense Listing

**Acceptance Criteria:**
- [ ] `GET /api/expenses` endpoint
- [ ] Query params: page, size, startDate, endDate, category, minAmount, maxAmount
- [ ] Returns paginated results (20 items/page)
- [ ] Response time <100ms (with caching)

#### 3.2.4 Category Management

**Default Categories:**
- Food & Dining (Ăn uống)
- Transportation (Di chuyển)
- Shopping (Mua sắm)
- Entertainment (Giải trí)
- Healthcare (Y tế)
- Education (Giáo dục)
- Bills & Utilities (Hóa đơn)
- Other (Khác)

**Acceptance Criteria:**
- [ ] `GET /api/categories` endpoint
- [ ] `POST /api/categories` endpoint (custom)
- [ ] `PUT /api/categories/:id` endpoint
- [ ] `DELETE /api/categories/:id` endpoint

#### Database Schema - Expense Service

```sql
-- Table: expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    amount_vnd DECIMAL(15,2),  -- normalized to VND
    category_id UUID REFERENCES categories(id),
    merchant VARCHAR(200),
    notes TEXT,
    expense_date DATE NOT NULL,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_via VARCHAR(20) CHECK (created_via IN ('manual', 'voice', 'receipt'))
);

-- Indexes
CREATE INDEX idx_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_user_amount ON expenses(user_id, amount_vnd);

-- Table: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100),
    icon VARCHAR(50),
    color VARCHAR(7),
    user_id UUID,  -- NULL for default categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: merchants
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP
);
```

---

### 3.3 RECEIPT SERVICE (Microservice 3)

#### 3.3.1 Receipt Upload & OCR

**Requirements:**
- Users can upload receipt images
- System extracts text using OCR
- AI parses total, merchant, date, items
- Accepted formats: JPG, PNG, PDF (max 5MB)

**Acceptance Criteria:**
- [ ] `POST /api/receipts` endpoint
- [ ] Uploads image to storage
- [ ] Runs OCR processing
- [ ] Extracts structured data
- [ ] Returns receipt object

#### 3.3.2 Receipt Linking

**Acceptance Criteria:**
- [ ] `POST /api/receipts/:id/link` endpoint
- [ ] Links receipt to expense_id
- [ ] One expense can have multiple receipts

#### Database Schema - Receipt Service

```sql
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    expense_id UUID,  -- can be NULL initially
    image_url VARCHAR(500) NOT NULL,
    ocr_text TEXT,
    extracted_total DECIMAL(15,2),
    extracted_merchant VARCHAR(200),
    extracted_date DATE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);
```

---

### 3.4 ANALYTICS SERVICE (Microservice 4)

#### 3.4.1 Spending Summary

**Acceptance Criteria:**
- [ ] `GET /api/analytics/summary` endpoint
- [ ] Query params: period (day/week/month/year)
- [ ] Returns aggregated spending data
- [ ] Cached for 5 minutes

**Response Example:**
```json
{
  "period": "month",
  "total": 15000000,
  "currency": "VND",
  "byCategory": [
    {"category": "Food", "amount": 5000000, "percentage": 33.3},
    {"category": "Transport", "amount": 3000000, "percentage": 20.0}
  ],
  "topMerchants": [
    {"merchant": "Highlands Coffee", "amount": 1200000, "count": 24}
  ]
}
```

#### 3.4.2 Budget Tracking

**Acceptance Criteria:**
- [ ] `POST /api/budgets` endpoint
- [ ] `GET /api/budgets` endpoint
- [ ] `PUT /api/budgets/:id` endpoint
- [ ] `GET /api/budgets/status` endpoint
- [ ] Alerts when 90% threshold reached

#### 3.4.3 AI-Powered Insights

**Acceptance Criteria:**
- [ ] `GET /api/analytics/insights` endpoint
- [ ] Uses Claude API for analysis
- [ ] Returns personalized recommendations
- [ ] Detects anomalies (>2x avg spending)

**Example Insights:**
- "Your coffee spending increased 45% this month"
- "You could save 500k by cooking more at home"
- "Unusual expense: 2M entertainment (avg: 500k)"

#### 3.4.4 Voice Query

**Acceptance Criteria:**
- [ ] `POST /api/analytics/query` endpoint
- [ ] Accepts audio file or text query
- [ ] Returns structured answer + natural language response

**Example Queries:**
- "How much did I spend on food this month?"
- "Chi bao nhiêu tiền ăn uống tuần này?"
- "What's my biggest expense category?"

#### Database Schema - Analytics Service

```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3),
    period VARCHAR(20) CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budget_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    threshold INTEGER,  -- 90 = 90%
    triggered_at TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE
);
```

---

### 3.5 API GATEWAY

#### 3.5.1 Request Routing

**URL Prefix Mapping:**
- `/api/users/*` → User Service (8081)
- `/api/expenses/*` → Expense Service (8082)
- `/api/receipts/*` → Receipt Service (8084)
- `/api/analytics/*` → Analytics Service (8083)
- `/api/categories/*` → Expense Service (8082)
- `/api/budgets/*` → Analytics Service (8083)

#### 3.5.2 Authentication

- Validates JWT tokens for protected routes
- **Public routes:** `/register`, `/login`
- **Protected routes:** All others

#### 3.5.3 Rate Limiting

- **Global:** 1000 requests/hour per IP
- **Per user:** 100 requests/minute
- **Auth endpoints:** 5 requests/minute

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance Requirements

- API response time: **<200ms** (95th percentile)
- Database query time: **<100ms** (95th percentile)
- Speech-to-text processing: **<5 seconds**
- OCR processing: **<10 seconds**
- Support **100+ concurrent users**
- Handle **10,000+ expenses per user**

### 4.2 Security Requirements

- HTTPS/TLS 1.3 in production
- Password hashing: **BCrypt (strength 12)**
- JWT signing: **RS256 algorithm**
- SQL injection prevention (PreparedStatements)
- XSS prevention (input sanitization)
- CSRF protection
- Rate limiting on all endpoints
- Audit logging for sensitive operations

**OWASP Top 10 Compliance:**
- [ ] A01: Broken Access Control - RBAC implemented
- [ ] A02: Cryptographic Failures - Encrypted sensitive data
- [ ] A03: Injection - Parameterized queries
- [ ] A04: Insecure Design - Threat modeling completed
- [ ] A05: Security Misconfiguration - Hardened configs
- [ ] A06: Vulnerable Components - Regular updates
- [ ] A07: Authentication Failures - Secure auth
- [ ] A08: Software Integrity - Code signing
- [ ] A09: Security Logging - Comprehensive logging
- [ ] A10: SSRF - URL validation

### 4.3 Reliability Requirements

- **Uptime:** 99.5% (3.6 hours downtime/month acceptable)
- **Database backups:** Daily automated
- **Point-in-time recovery:** Up to 7 days
- Circuit breaker for external API calls
- Graceful degradation when AI services fail

### 4.4 Maintainability Requirements

- **Code coverage:** 70% minimum
- **Code quality:** SonarQube grade B+ or higher
- Clean architecture principles
- Comprehensive API documentation
- README with setup instructions

---

## 5. EXTERNAL API INTEGRATIONS

### 5.1 Google Cloud Speech-to-Text API

**Purpose:** Convert audio to text

**Configuration:**
- Endpoint: `speech.googleapis.com/v2`
- Authentication: Service Account JSON key
- Language codes: `vi-VN` (Vietnamese), `en-US` (English)
- Audio encoding: LINEAR16, FLAC, MP3, OGG_OPUS
- Sample rate: 16000 Hz minimum
- Enable automatic punctuation
- Enable word confidence scores

**Error Handling:**
- Retry on transient failures (3 attempts)
- Fallback: Return error to user
- Log all API failures

**Cost Optimization:**
- Cache frequent phrases
- Use batch processing when possible
- Monitor usage limits

### 5.2 Anthropic Claude API

**Purpose:** NLP, expense parsing, insights generation

**Configuration:**
- Endpoint: `api.anthropic.com/v1/messages`
- Authentication: API key (X-API-Key header)
- Model: `claude-sonnet-4-20250514`

**Use Cases:**

1. **Expense Parsing**
   - Input: Transcribed text
   - Output: Structured expense data (JSON)

2. **Category Classification**
   - Input: Expense description
   - Output: Category ID + confidence score

3. **Insights Generation**
   - Input: User spending data (last 30 days)
   - Output: Personalized recommendations

4. **Natural Language Query**
   - Input: User question
   - Output: SQL query + natural language answer

**Error Handling:**
- Retry on rate limits (exponential backoff)
- Fallback: Use rule-based parsing
- Cache common responses (24 hours)

### 5.3 Tesseract OCR

**Purpose:** Extract text from receipt images

**Configuration:**
- Installation: Local library (not API)
- Language: Vietnamese + English

**Pre-processing Pipeline:**
1. Convert to grayscale
2. Increase contrast
3. Denoise
4. Deskew (rotate to 0 degrees)

**Post-processing:**
- Spell check common Vietnamese words
- Validate extracted amounts (regex)
- Confidence threshold: 80% minimum

---

## 6. DATA MODELS & API SPECIFICATIONS

### 6.1 Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-31T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "amount": "Amount must be greater than 0"
    }
  },
  "timestamp": "2025-12-31T10:30:00Z"
}
```

### 6.2 Key API Endpoints

#### POST /api/users/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Nguyen Van A"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyen Van A"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /api/expenses/voice

**Request:** `multipart/form-data`
- `audio`: file
- `language`: "vi" or "en"

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "transcription": "mua cà phê bốn mươi lăm nghìn ở Highlands",
    "expense": {
      "id": "uuid",
      "amount": 45000,
      "currency": "VND",
      "category": "Food & Dining",
      "merchant": "Highlands Coffee",
      "confidence": 0.92
    }
  }
}
```

#### GET /api/analytics/summary

**Query Params:**
- `period`: day | week | month | year
- `startDate`: YYYY-MM-DD (optional)
- `endDate`: YYYY-MM-DD (optional)

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total": 15000000,
    "currency": "VND",
    "byCategory": [
      {"category": "Food", "amount": 5000000, "percentage": 33.3}
    ]
  }
}
```

---

## 7. TESTING REQUIREMENTS

### 7.1 Unit Testing

**Framework:** JUnit 5 (Jupiter)  
**Mocking:** Mockito 5.x  
**Assertions:** AssertJ

**Coverage Target:** 70% minimum

**Test Structure:**
```java
@SpringBootTest
class ExpenseServiceTest {
    @Mock
    private ExpenseRepository repository;
    
    @InjectMocks
    private ExpenseService service;
    
    @Test
    void createExpense_ValidInput_ReturnsExpense() {
        // Given
        CreateExpenseRequest request = ...;
        
        // When
        Expense result = service.createExpense(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAmount()).isEqualTo(45000);
    }
}
```

### 7.2 Integration Testing

**Framework:** Spring Boot Test + TestContainers

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class ExpenseControllerIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:16");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void createExpense_Success() {
        ResponseEntity<ExpenseResponse> response = 
            restTemplate.postForEntity("/api/expenses", 
                request, ExpenseResponse.class);
        
        assertThat(response.getStatusCode())
            .isEqualTo(HttpStatus.CREATED);
    }
}
```

### 7.3 Load Testing

**Tool:** Apache JMeter or Gatling  
**Target:** 100 concurrent users

**Test Scenarios:**
- Create expense: 50 requests/second
- Get expenses list: 100 requests/second
- Voice expense creation: 10 requests/second

**Success Criteria:**
- 95th percentile response time <200ms
- Error rate <1%
- No memory leaks

---

## 8. DEPLOYMENT REQUIREMENTS

### 8.1 Docker Configuration

**Dockerfile (Example - User Service):**
```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/user-service-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: finance_tracker
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"
      - "15672:15672"
  
  user-service:
    build: ./user-service
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/finance_tracker
      SPRING_REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### 8.2 CI/CD Pipeline

**.github/workflows/ci-cd.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: mvn clean install
      
      - name: Run tests
        run: mvn test
      
      - name: Generate coverage report
        run: mvn jacoco:report
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push to DockerHub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker-compose push
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 8.3 Environment Configuration

**application-prod.yml:**
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate
  redis:
    host: ${REDIS_HOST}
    password: ${REDIS_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: 3600
  refresh-expiration: 604800

google:
  cloud:
    speech:
      credentials: ${GOOGLE_CREDENTIALS_JSON}

anthropic:
  api-key: ${ANTHROPIC_API_KEY}
```

---

## 9. 6-WEEK IMPLEMENTATION PLAN

### WEEK 1: Foundation & Spring Boot 4

#### Day 1: Modern Java Features
**Morning (2.5 hours):**
- Study Java 21 features: Records, Pattern Matching, Sealed Classes
- Review Streams API and functional programming
- Practice: Convert old POJOs to Records

**Afternoon (2.5 hours):**
- Learn CompletableFuture for async operations
- Practice: Build async file processor
- Study Optional best practices

**Goal:** Comfortable with modern Java syntax

#### Day 2: Spring Boot 4 Setup
**Morning:**
- Install Java 21, IntelliJ IDEA, PostgreSQL, Docker
- Create Spring Boot 4 project with Spring Initializr
- Add dependencies: Web, JPA, PostgreSQL, Security

**Afternoon:**
- Build simple REST API: User CRUD
- Configure application.properties
- Test endpoints with Postman

**Goal:** Working Spring Boot project with database

#### Day 3: Spring Security & JWT
**Morning:**
- Study Spring Security 7 architecture
- Implement JWT token generation
- Create UserDetailsService

**Afternoon:**
- Build /register and /login endpoints
- Implement JWT validation filter
- Test authentication flow

**Goal:** Working JWT authentication

#### Day 4: Database Design - Part 1
**Morning:**
- Design User entity
- Design Expense entity
- Design Category entity

**Afternoon:**
- Design Receipt entity
- Design Budget entity
- Create ER diagram

**Goal:** Complete database schema diagram

#### Day 5: Database Implementation
**Morning:**
- Review indexing strategies
- Plan Redis caching keys
- Study PostgreSQL JSONB

**Afternoon:**
- Implement all entities with JPA
- Create repositories
- Write migration scripts

**Goal:** All entities implemented

#### Day 6: System Architecture
**Morning:**
- Design microservices architecture
- Plan service boundaries
- Design REST API endpoints

**Afternoon:**
- Create OpenAPI documentation
- Design error handling
- Plan inter-service communication

**Goal:** Complete architecture diagram

#### Day 7: Week 1 Review
**Morning:**
- Review all Week 1 code and refactor
- Set up Redis with Docker
- Implement basic caching

**Afternoon:**
- Write unit tests for User Service
- Test Redis caching
- Prepare for Week 2

**Goal:** Solid foundation ready

---

### WEEK 2: AI Integration

#### Day 8: Google Speech-to-Text
**Morning:**
- Create Google Cloud account
- Enable Speech-to-Text API
- Generate credentials

**Afternoon:**
- Build audio upload endpoint
- Implement speech-to-text for Vietnamese
- Test with sample audio files

**Goal:** Working speech-to-text

#### Day 9: Claude API - Part 1
**Morning:**
- Get Claude API key
- Add Anthropic SDK
- Study prompt engineering

**Afternoon:**
- Create ExpenseParserService
- Test parsing Vietnamese expenses
- Extract amount, category, merchant

**Goal:** Claude parsing Vietnamese expenses

#### Day 10: Claude API - Part 2
**Morning:**
- Improve prompts for 85%+ accuracy
- Handle edge cases
- Add validation logic

**Afternoon:**
- Build expense categorization
- Create Vietnamese category mapping
- Test with 20+ sample phrases

**Goal:** Robust expense parsing

#### Day 11: Voice Pipeline Integration
**Morning:**
- Combine Speech-to-Text + Claude
- Build POST /expenses/voice endpoint
- Handle audio → transcription → parsing → save

**Afternoon:**
- Add error handling
- Implement retry logic
- Test end-to-end flow

**Goal:** Complete voice expense logging

#### Day 12: Tesseract OCR Setup
**Morning:**
- Install Tesseract + Vietnamese pack
- Add tess4j dependency
- Study image preprocessing

**Afternoon:**
- Build image upload endpoint
- Implement OCR for Vietnamese receipts
- Test with sample receipt images

**Goal:** Working OCR for receipts

#### Day 13: Receipt Data Extraction
**Morning:**
- Use Claude to extract data from OCR text
- Build structured extraction prompt
- Handle various receipt formats

**Afternoon:**
- Create Receipt entity
- Link receipt to expense
- Test complete flow

**Goal:** Complete receipt scanning pipeline

#### Day 14: Week 2 Review
**Morning:**
- Review all AI integration code
- Optimize API costs
- Measure accuracy rates

**Afternoon:**
- Write integration tests
- Create test data: 50+ samples
- Document API usage

**Goal:** AI features optimized

---

### WEEK 3: Core Services Development

#### Day 15: User Service Complete
**Morning:**
- Implement profile management
- Add currency/language preferences
- Build password reset

**Afternoon:**
- Implement refresh tokens
- Add RBAC (USER, ADMIN)
- Write comprehensive tests

**Goal:** User Service 100% complete

#### Day 16: Expense CRUD
**Morning:**
- Implement GET /expenses (pagination)
- Build POST /expenses
- Add PUT and DELETE

**Afternoon:**
- Implement category management
- Add merchant autocomplete
- Test all endpoints

**Goal:** Complete expense CRUD

#### Day 17: Expense Advanced Features
**Morning:**
- Multi-currency conversion
- Expense search and filtering
- Statistics endpoint

**Afternoon:**
- Integrate voice expense from Day 11
- Add expense validation
- Write integration tests

**Goal:** Expense Service feature-complete

#### Day 18: Analytics - Data Aggregation
**Morning:**
- Build spending by category
- Implement time period analysis
- Create top merchants analysis

**Afternoon:**
- Build budget tracking
- Implement budget alerts
- Add Redis caching

**Goal:** Core analytics working

#### Day 19: Analytics - AI Insights
**Morning:**
- Build AI insights generator
- Prompt for spending analysis
- Generate recommendations

**Afternoon:**
- Implement anomaly detection
- Build monthly report generator
- Test insights quality

**Goal:** AI-powered insights working

#### Day 20: Voice Query Feature
**Morning:**
- Build NL query parser
- Handle "How much did I spend on food?"
- Map NL to database query

**Afternoon:**
- Implement voice query endpoint
- Test with Vietnamese queries
- Add voice response generation

**Goal:** Voice query working

#### Day 21: Week 3 Review
**Morning:**
- Review all service code
- Ensure consistent error handling
- Check code quality

**Afternoon:**
- Write end-to-end tests
- Test complete user journeys
- Fix bugs

**Goal:** All core services integrated

---

### WEEK 4: Microservices Architecture

#### Day 22: Service Separation - User
**Morning:**
- Create separate module for User Service
- Extract user-related code
- Configure separate properties

**Afternoon:**
- Set up separate database schema
- Test User Service on port 8081
- Document APIs

**Goal:** User Service running independently

#### Day 23: Service Separation - Others
**Morning:**
- Create Expense Service module (8082)
- Create Analytics Service module (8083)
- Move code to services

**Afternoon:**
- Create Receipt Service module (8084)
- Configure databases
- Test all services running

**Goal:** All 4 microservices independent

#### Day 24: API Gateway Setup
**Morning:**
- Create API Gateway project (8080)
- Add Spring Cloud Gateway
- Configure routes

**Afternoon:**
- Implement JWT validation
- Add rate limiting
- Configure CORS

**Goal:** API Gateway routing

#### Day 25: Service Communication
**Morning:**
- Add Spring Cloud OpenFeign
- Implement service-to-service calls
- Add circuit breaker

**Afternoon:**
- Test service communication
- Handle failures gracefully
- Add timeout configs

**Goal:** Services communicating reliably

#### Day 26: Spring WebFlux
**Morning:**
- Study Reactor (Mono/Flux)
- Convert Analytics to WebFlux
- Use R2DBC

**Afternoon:**
- Implement WebSocket
- Build real-time alerts
- Test reactive endpoints

**Goal:** Analytics Service reactive

#### Day 27: Event-Driven with RabbitMQ
**Morning:**
- Set up RabbitMQ
- Add Spring AMQP
- Create expense.created event

**Afternoon:**
- Publish events on expense creation
- Analytics consumes events
- Implement notifications

**Goal:** Event-driven communication

#### Day 28: Week 4 Review
**Morning:**
- Review microservices architecture
- Test inter-service communication
- Verify event flows

**Afternoon:**
- Load test with JMeter (1000 requests)
- Optimize queries
- Document architecture

**Goal:** Microservices solid

---

### WEEK 5: Testing & Security

#### Day 29: Unit Testing
**Morning:**
- Write tests for User Service (80%)
- Write tests for Expense Service
- Use JUnit 5 + Mockito

**Afternoon:**
- Write tests for Analytics Service
- Write tests for Receipt Service
- Run coverage reports (JaCoCo)

**Goal:** 70%+ test coverage

#### Day 30: Integration Testing
**Morning:**
- Set up TestContainers
- Write integration tests for User APIs
- Test transactions

**Afternoon:**
- Write integration tests for Expense
- Test voice expense end-to-end
- Test OCR flow

**Goal:** Critical flows tested

#### Day 31: Security Hardening
**Morning:**
- Review OWASP Top 10
- Implement input validation
- Add SQL injection prevention

**Afternoon:**
- Implement rate limiting
- Add XSS protection
- Configure HTTPS/TLS

**Goal:** Security best practices

#### Day 32: Performance - Database
**Morning:**
- Analyze slow queries
- Add database indexes
- Optimize N+1 problems

**Afternoon:**
- Configure connection pooling
- Add query result caching
- Test performance improvements

**Goal:** Database queries <100ms

#### Day 33: Performance - API
**Morning:**
- Profile API endpoints
- Implement Redis caching
- Add cache invalidation

**Afternoon:**
- Optimize AI API calls
- Compress responses (GZIP)
- Test response times

**Goal:** API responses <200ms

#### Day 34: Load Testing
**Morning:**
- Create JMeter test plans
- Run load tests (100 concurrent users)
- Identify bottlenecks

**Afternoon:**
- Add Spring Boot Actuator
- Configure health checks
- Set up logging

**Goal:** Handle 100+ concurrent users

#### Day 35: Week 5 Review
**Morning:**
- Review test results
- Fix security vulnerabilities
- Address bottlenecks

**Afternoon:**
- Code review and cleanup
- Update documentation
- Prepare for deployment

**Goal:** Production-ready code

---

### WEEK 6: Deployment & Polish

#### Day 36: Dockerization
**Morning:**
- Write Dockerfile for each service
- Create multi-stage builds
- Build and test images

**Afternoon:**
- Create docker-compose.yml
- Add PostgreSQL, Redis, RabbitMQ
- Test with docker-compose up

**Goal:** All services in Docker

#### Day 37: CI/CD Pipeline
**Morning:**
- Create .github/workflows/ci.yml
- Configure build and test jobs
- Add coverage reporting

**Afternoon:**
- Configure Docker image builds
- Add deployment job
- Test CI/CD pipeline

**Goal:** Working CI/CD

#### Day 38: Cloud Deployment - Databases
**Morning:**
- Set up PostgreSQL on Supabase
- Configure Redis on Upstash
- Set up RabbitMQ on CloudAMQP

**Afternoon:**
- Deploy User Service to Railway
- Deploy Expense Service
- Configure environment variables

**Goal:** Core services deployed

#### Day 39: Cloud Deployment - Complete
**Morning:**
- Deploy Analytics Service
- Deploy Receipt Service
- Deploy API Gateway

**Afternoon:**
- Configure custom domain
- Set up SSL certificates
- Test production environment

**Goal:** Complete system live

#### Day 40: Documentation - Technical
**Morning:**
- Write comprehensive README (English)
- Add Vietnamese README
- Document architecture

**Afternoon:**
- Complete Swagger documentation
- Write setup instructions
- Document deployment

**Goal:** Professional documentation

#### Day 41: Demo & Presentation
**Morning:**
- Create demo script
- Record demo video (5-7 minutes)
- Prepare test scenarios

**Afternoon:**
- Create presentation slides
- Write blog post for Viblo
- Prepare for interviews

**Goal:** Demo materials ready

#### Day 42: Final Polish & Launch
**Morning:**
- Final testing in production
- Fix remaining bugs
- Optimize performance

**Afternoon:**
- Update CV with project details
- Post on LinkedIn and Viblo
- Share on GitHub
- **Celebrate! 🎉**

**Goal:** Project launched!

---

## 10. SUCCESS METRICS & KPIs

### Technical Metrics
- [ ] API response time <200ms (95th percentile)
- [ ] Speech recognition accuracy ≥85% for Vietnamese
- [ ] OCR accuracy ≥80% for receipts
- [ ] Test coverage ≥70%
- [ ] Zero critical security vulnerabilities
- [ ] Support 100+ concurrent users
- [ ] Database query time <100ms
- [ ] Uptime ≥99.5%

### Business Metrics
- [ ] Expense logging time reduced by 70%
- [ ] 90%+ user satisfaction with AI accuracy
- [ ] <5 seconds voice input processing
- [ ] Support 10,000+ expenses per user

### Code Quality Metrics
- [ ] SonarQube quality gate: PASSED
- [ ] Technical debt ratio: <5%
- [ ] Code smells: <100
- [ ] Duplicated code: <3%

### Portfolio Metrics
- [ ] Complete README (English + Vietnamese)
- [ ] API documentation with examples
- [ ] Demo video (5-7 minutes)
- [ ] Architecture diagrams
- [ ] GitHub stars target: 50+
- [ ] Blog post on Viblo.asia

---

## 11. RISKS & MITIGATION

### Technical Risks

**Risk 1: AI API costs exceed budget**
- **Mitigation:** Implement caching, use cheaper models for simple tasks

**Risk 2: Speech recognition accuracy below target**
- **Mitigation:** Fine-tune prompts, add manual correction option

**Risk 3: Performance issues with complex queries**
- **Mitigation:** Redis caching, database indexing, query optimization

**Risk 4: Third-party API downtime**
- **Mitigation:** Circuit breakers, graceful degradation, fallback logic

### Business Risks

**Risk 1: Project takes longer than 6 weeks**
- **Mitigation:** MVP-first approach, cut optional features

**Risk 2: Difficulty finding job after completion**
- **Mitigation:** Network actively, share on LinkedIn/Viblo, strong demo

### Learning Risks

**Risk 1: Spring Boot 4 has breaking changes**
- **Mitigation:** Follow migration guide, start with tutorials

**Risk 2: Complex microservices for first project**
- **Mitigation:** Build monolith first, split gradually

---

## 12. APPENDIX

### 12.1 Learning Resources

**Official Documentation:**
- Spring Boot 4: https://spring.io/projects/spring-boot
- Spring Security 7: https://spring.io/projects/spring-security
- Spring AI: https://spring.io/projects/spring-ai
- Java 21: https://dev.java/learn/

**Video Courses:**
- "Spring Boot Microservices" - Udemy
- "Reactive Programming with WebFlux" - Pluralsight
- Spring Academy (free) - https://spring.academy

**Vietnamese Communities:**
- Viblo.asia - Share progress
- Facebook: "Java Vietnam", "Spring Boot Vietnam"
- GitHub: Search "spring boot microservices"

### 12.2 Tools & IDE Setup

**Required Software:**
- IntelliJ IDEA (Community or Ultimate)
- Java 21 (Eclipse Temurin)
- Maven 3.9.x or Gradle 8.x
- Docker Desktop
- PostgreSQL 16
- Postman or Thunder Client
- Git

**IntelliJ Plugins:**
- Spring Boot Assistant
- Lombok
- SonarLint
- Docker
- Database Navigator

### 12.3 Code Style Guide

- Follow Google Java Style Guide
- Use Lombok for boilerplate reduction
- Controller methods: PascalCase with HTTP verb prefix
- Service methods: camelCase with action verbs
- Constants: UPPER_SNAKE_CASE
- Package structure: feature-based (not layer-based)

### 12.4 Git Workflow

**Branch Strategy:**
- `main`: Production-ready code
- `develop`: Development branch
- `feature/xxx`: New features
- `bugfix/xxx`: Bug fixes

**Commit Message Format (Conventional Commits):**
```
feat: Add voice expense creation endpoint
fix: Correct JWT token validation logic
docs: Update README with setup instructions
test: Add integration tests for expense service
refactor: Simplify expense parsing logic
perf: Optimize database queries with indexing
```

### 12.5 Project Showcase Checklist

- [ ] GitHub repository with descriptive name
- [ ] Comprehensive README (English + Vietnamese)
- [ ] Screenshots/GIFs of key features
- [ ] Architecture diagram
- [ ] API documentation (Swagger UI)
- [ ] Demo video (YouTube/Loom)
- [ ] Blog post on Viblo.asia
- [ ] LinkedIn post announcement
- [ ] CV updated with project details
- [ ] Prepare 5-minute demo for interviews

### 12.6 Interview Preparation

**Be ready to explain:**
- Why microservices architecture?
- How does JWT authentication work?
- How did you achieve 85% Vietnamese speech accuracy?
- What are the trade-offs of using AI APIs?
- How would you scale to 1M users?
- What security measures did you implement?
- How do you handle API failures?
- What was the hardest technical challenge?

**Technical Questions:**
- Explain Spring Boot auto-configuration
- How does Spring Security filter chain work?
- What is reactive programming with WebFlux?
- Explain database indexing strategy
- How does Redis caching improve performance?
- What is the Circuit Breaker pattern?
- How do microservices communicate?

---

## CONCLUSION

This comprehensive requirements document provides everything you need to build a production-ready AI-powered finance tracker over 6 weeks. Follow the daily plan systematically, commit regularly to GitHub, and document your progress.

**Key Takeaways:**
- Modern tech stack (Spring Boot 4, Java 21)
- Real-world problem solving (voice input, AI integration)
- Production-ready practices (testing, security, deployment)
- Portfolio-ready presentation (documentation, demo, blog)

**Next Steps:**
1. Set up your development environment
2. Create GitHub repository
3. Start Day 1 tomorrow
4. Share progress weekly on LinkedIn/Viblo
5. Network with Vietnamese Java communities

Good luck with your project! This will significantly improve your chances of landing a Java developer position in Vietnam. 🚀

---

**Document Version:** 1.0  
**Last Updated:** December 31, 2025  
**Total Pages:** 40+  
**Total Requirements:** 100+</parameter>
