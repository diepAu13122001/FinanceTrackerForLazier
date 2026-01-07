# DAY 1: TECHNOLOGY REVIEW & ENVIRONMENT SETUP
(Complete Learning & Setup Guide (5 hours))

---

## HOUR 1: SPRING BOOT 4.0 NEW FEATURES

### Learning Objectives
- Understand what's new in Spring Boot 4.0
- Learn about virtual threads and their benefits
- Understand native image support
- Learn about improved observability

### Resources

#### Official Documentation
- **Spring Boot 4.0 Release Notes**: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes
- **Spring Boot Reference Guide**: https://docs.spring.io/spring-boot/docs/current/reference/html/
- **Migration Guide**: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide

#### Video Tutorials
- **"What's New in Spring Boot 4" by Spring.io**: https://www.youtube.com/c/SpringSourceDev
- **Spring Boot 4 Overview**: Search YouTube for "Spring Boot 4 new features"

### Key Topics to Study

#### 1. Virtual Threads (Project Loom Integration)
Virtual threads are lightweight threads that dramatically improve scalability.

**Key Concepts:**
```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true  # Enable virtual threads
```

**Benefits:**
- Handle thousands of concurrent requests with minimal memory
- Simplifies asynchronous programming
- Better than traditional thread pools for I/O-bound operations

**Read:**
- Virtual Threads in Spring Boot: https://spring.io/blog/2022/10/11/embracing-virtual-threads

#### 2. Native Image Support (GraalVM)
Compile Spring Boot apps to native executables for faster startup and lower memory usage.

**Benefits:**
- Startup time: ~0.1 seconds (vs 2-5 seconds for JVM)
- Memory usage: ~50MB (vs 200-300MB for JVM)
- Instant scale-up in cloud environments

**Read:**
- Spring Native Documentation: https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html

#### 3. Improved Observability
Better built-in support for metrics, tracing, and logging.

**New Features:**
- Auto-configured Micrometer observations
- Better integration with OpenTelemetry
- Enhanced logging with correlation IDs

**Read:**
- Observability Guide: https://spring.io/blog/2022/10/12/observability-with-spring-boot-3

#### 4. Other Important Changes
- **Java 17 minimum requirement** (but we'll use Java 21)
- **Jakarta EE 9+** (javax.* → jakarta.*)
- **Improved Docker support**
- **Better Kubernetes integration**

### Tasks for Hour 1

```markdown
✅ CHECKLIST:
- [ ] Read Spring Boot 4.0 Release Notes (15 min)
- [ ] Watch "What's New in Spring Boot 4" video (20 min)
- [ ] Read about Virtual Threads (15 min)
- [ ] Take notes on key features (10 min)
```

### Notes Template
Create a file: `day1-springboot4-notes.md`

```markdown
# Spring Boot 4.0 Key Features

## Virtual Threads
- What: Lightweight threads from Project Loom
- Why: Better scalability for I/O operations
- How: Enable in application.yml

## Native Image
- What: Compile to native executable with GraalVM
- Benefits: Fast startup, low memory
- Use case: Microservices, serverless

## Observability
- Auto-configured metrics
- Better tracing
- Built-in logging improvements

## Breaking Changes
- Java 17+ required
- Jakarta EE (not javax)
- Configuration changes

## Questions to Research Later
- How does virtual thread pooling work?
- When NOT to use virtual threads?
```

---

## HOUR 2: JAVA 21 FEATURES

### Learning Objectives
- Understand Java 21 LTS features
- Learn about virtual threads (Project Loom)
- Learn pattern matching enhancements
- Understand sequenced collections

### Resources

#### Official Documentation
- **Java 21 Release Notes**: https://www.oracle.com/java/technologies/javase/21-relnotes.html
- **JEP Index**: https://openjdk.org/jeps/0
- **Java Tutorial**: https://dev.java/learn/

#### Video Resources
- **"Java 21 New Features" by Amigoscode**: https://www.youtube.com/watch?v=z1u7n2dxJbU
- **"Java 21 Overview" by IntelliJ IDEA**: https://www.youtube.com/watch?v=UmQVc0MGTY0

### Key Features to Learn

#### 1. Virtual Threads (JEP 444) ⭐ MOST IMPORTANT
Virtual threads revolutionize concurrent programming in Java.

**Traditional Threads:**
```java
// Old way - expensive platform threads
ExecutorService executor = Executors.newFixedThreadPool(100);
for (int i = 0; i < 10000; i++) {
    executor.submit(() -> {
        // Task
    });
}
```

**Virtual Threads:**
```java
// New way - lightweight virtual threads
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10000; i++) {
        executor.submit(() -> {
            // Task - can create millions of these!
        });
    }
}
```

**Benefits:**
- Create millions of virtual threads (vs thousands of platform threads)
- Perfect for I/O-bound operations (database, API calls)
- Simpler than async/reactive programming

**Read:**
- Virtual Threads Guide: https://openjdk.org/jeps/444
- Tutorial: https://www.baeldung.com/java-virtual-thread-vs-thread

#### 2. Pattern Matching for Switch (JEP 441)
More expressive switch statements.

**Before:**
```java
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    System.out.println(i * 2);
}
```

**After (Java 21):**
```java
switch (obj) {
    case String s -> System.out.println(s.toUpperCase());
    case Integer i -> System.out.println(i * 2);
    case null -> System.out.println("Null value");
    default -> System.out.println("Unknown");
}
```

**Read:**
- Pattern Matching Tutorial: https://www.baeldung.com/java-switch-pattern-matching

#### 3. Record Patterns (JEP 440)
Destructure records in pattern matching.

```java
record Point(int x, int y) {}

static void printPoint(Object obj) {
    if (obj instanceof Point(int x, int y)) {
        System.out.println("x: " + x + ", y: " + y);
    }
}
```

#### 4. Sequenced Collections (JEP 431)
New interfaces for collections with defined order.

```java
// New methods for List, Deque, etc.
List<String> list = List.of("a", "b", "c");
list.getFirst();  // "a"
list.getLast();   // "c"
list.reversed();  // ["c", "b", "a"]
```

**Read:**
- Sequenced Collections: https://openjdk.org/jeps/431

#### 5. String Templates (Preview - JEP 430)
Better string interpolation.

```java
String name = "John";
int age = 30;

// Old way
String message = String.format("Name: %s, Age: %d", name, age);

// New way (Preview)
String message = STR."Name: \{name}, Age: \{age}";
```

### Tasks for Hour 2

```markdown
✅ CHECKLIST:
- [ ] Watch "Java 21 New Features" video (25 min)
- [ ] Read Virtual Threads JEP 444 (20 min)
- [ ] Read Pattern Matching examples (10 min)
- [ ] Take notes on features you'll use (5 min)
```

### Notes Template
Create: `day1-java21-notes.md`

```markdown
# Java 21 Key Features

## Virtual Threads ⭐
- Lightweight threads
- Use for: Database calls, HTTP requests, file I/O
- Avoid for: CPU-intensive tasks
- Code example: Executors.newVirtualThreadPerTaskExecutor()

## Pattern Matching
- Switch expressions with patterns
- No more if-instanceof-cast
- Guard clauses with 'when'

## Sequenced Collections
- getFirst(), getLast(), reversed()
- Works with List, Set, Map

## Features I'll Use in Project
1. Virtual Threads - for all async operations
2. Pattern Matching - for request handling
3. Records - for DTOs

## Questions
- How many virtual threads can I create? (Answer: millions)
- When should I NOT use virtual threads?
```

---

## HOUR 3: INSTALL DEVELOPMENT TOOLS

### Installation Checklist

#### 1. Java 21 JDK (15 min)

**Option A: SDKMAN (Recommended for Mac/Linux)**
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 21
sdk install java 21.0.1-tem

# Verify
java -version
# Should show: openjdk version "21.0.1"
```

**Option B: Direct Download (Windows/Mac/Linux)**
- Download from: https://adoptium.net/temurin/releases/?version=21
- Install the .msi (Windows) or .pkg (Mac)
- Add to PATH

**Verify Installation:**
```bash
java -version
javac -version
```

**Resources:**
- SDKMAN: https://sdkman.io/
- Adoptium (Eclipse Temurin): https://adoptium.net/

#### 2. IntelliJ IDEA (15 min)

**Download:**
- **Ultimate** (Free 30-day trial): https://www.jetbrains.com/idea/download/
- **Community** (Free forever): Also available at above link

**First-time Setup:**
1. Launch IntelliJ IDEA
2. Configure JDK:
   - File → Project Structure → SDKs
   - Add Java 21 SDK
3. Install Plugins:
   - Spring Boot Assistant
   - Lombok
   - Docker
   - Database Navigator

**Useful Shortcuts to Learn:**
- `Ctrl+Space` - Auto-complete
- `Ctrl+Shift+F10` - Run
- `Shift+Shift` - Search everywhere
- `Alt+Insert` - Generate code

**Resources:**
- IntelliJ IDEA Tutorial: https://www.jetbrains.com/idea/guide/

#### 3. Docker Desktop (10 min)

**Download & Install:**
- **Mac**: https://docs.docker.com/desktop/install/mac-install/
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Linux**: https://docs.docker.com/desktop/install/linux-install/

**After Installation:**
```bash
# Verify Docker
docker --version
docker-compose --version

# Test with Hello World
docker run hello-world
```

**Configure Docker:**
- Allocate at least 4GB RAM
- Enable Kubernetes (optional for now)

**Resources:**
- Docker Getting Started: https://docs.docker.com/get-started/

#### 4. PostgreSQL 18 (10 min)

**Option A: Docker (Recommended)**
```bash
# Pull PostgreSQL 18 image
docker pull postgres:18

# Run PostgreSQL
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=finance_tracker \
  -p 5432:5432 \
  -d postgres:18

# Verify
docker ps
```

**Option B: Local Installation**
- **Mac**: `brew install postgresql@18`
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Linux**: `apt-get install postgresql-18`

**Verify Installation:**
```bash
# Connect to database
docker exec -it postgres-dev psql -U postgres

# Inside psql:
\l               # List databases
\q               # Quit
```

**Resources:**
- PostgreSQL Documentation: https://www.postgresql.org/docs/18/

#### 5. Database Client (5 min)

**Choose One:**

**DBeaver (Free, Recommended)**
- Download: https://dbeaver.io/download/
- Connect to PostgreSQL:
  - Host: localhost
  - Port: 5432
  - Database: finance_tracker
  - Username: postgres
  - Password: postgres

**TablePlus (Paid, Beautiful UI)**
- Download: https://tableplus.com/

**pgAdmin (Free, Official)**
- Download: https://www.pgadmin.org/download/

#### 6. Postman or Thunder Client (5 min)

**Postman (Desktop App)**
- Download: https://www.postman.com/downloads/
- Create account (free)
- Great for API testing

**Thunder Client (VS Code Extension)**
- Install in VS Code
- Lightweight alternative
- Perfect for quick tests

**Resources:**
- Postman Learning Center: https://learning.postman.com/

### Tasks for Hour 3

```markdown
✅ INSTALLATION CHECKLIST:
- [ ] Install Java 21 JDK
- [ ] Verify: java -version shows 21.x.x
- [ ] Install IntelliJ IDEA
- [ ] Configure IntelliJ with Java 21
- [ ] Install Docker Desktop
- [ ] Verify: docker --version
- [ ] Run PostgreSQL in Docker
- [ ] Install database client (DBeaver)
- [ ] Connect to PostgreSQL
- [ ] Install Postman or Thunder Client
```

### Troubleshooting

**Java not found:**
```bash
# Mac/Linux: Add to ~/.zshrc or ~/.bashrc
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH=$JAVA_HOME/bin:$PATH

# Windows: Set environment variables
# JAVA_HOME=C:\Program Files\Java\jdk-21
# PATH=%JAVA_HOME%\bin;%PATH%
```

**Docker permission denied (Linux):**
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

**PostgreSQL connection refused:**
```bash
# Check if container is running
docker ps

# Check logs
docker logs postgres-dev

# Restart container
docker restart postgres-dev
```

---

## HOUR 4: NODE.JS & FRONTEND TOOLS

### Installation Checklist

#### 1. Node.js 20+ LTS (10 min)

**Option A: NVM (Recommended - Mac/Linux)**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

**Option B: Direct Download**
- Download LTS from: https://nodejs.org/en/download/
- Install the package
- Verify installation

**Resources:**
- NVM: https://github.com/nvm-sh/nvm
- Node.js Docs: https://nodejs.org/docs/latest-v20.x/api/

#### 2. VS Code (10 min)

**Download & Install:**
- Download: https://code.visualstudio.com/download
- Install for your OS

**Essential Extensions:**
1. **ESLint** - Linting for JavaScript/TypeScript
2. **Prettier** - Code formatter
3. **ES7+ React/Redux/React-Native snippets** - React shortcuts
4. **Tailwind CSS IntelliSense** - Tailwind autocomplete
5. **Thunder Client** - API testing (alternative to Postman)
6. **Docker** - Docker support
7. **GitLens** - Enhanced Git features
8. **Auto Rename Tag** - HTML/JSX tag renaming
9. **Import Cost** - Show size of imported packages
10. **Error Lens** - Inline error highlighting

**Install Extensions:**
```bash
# Open VS Code
# Press Ctrl+Shift+X (or Cmd+Shift+X on Mac)
# Search and install each extension
```

**Configure VS Code:**

Create `.vscode/settings.json` in your workspace:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Useful VS Code Shortcuts:**
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette
- `Ctrl+`` - Toggle terminal
- `Alt+Up/Down` - Move line up/down
- `Ctrl+D` - Multi-cursor select
- `F2` - Rename symbol

**Resources:**
- VS Code Docs: https://code.visualstudio.com/docs
- VS Code Tips: https://code.visualstudio.com/docs/getstarted/tips-and-tricks

#### 3. React Developer Tools (5 min)

**Browser Extensions:**

**Chrome:**
- React Developer Tools: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi

**Firefox:**
- React Developer Tools: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

**Features:**
- Inspect React component tree
- View component props and state
- Profile performance
- Highlight re-renders

#### 4. Git (5 min)

**Check if installed:**
```bash
git --version
```

**If not installed:**
- **Mac**: `brew install git` or comes with Xcode Command Line Tools
- **Windows**: Download from https://git-scm.com/download/win
- **Linux**: `apt-get install git`

**Configure Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify
git config --list
```

#### 5. Create Test Projects (10 min)

**Test Backend Setup:**
```bash
# Create test Spring Boot project
mkdir ~/test-spring-boot
cd ~/test-spring-boot

# Use Spring Initializr CLI or create via IntelliJ:
# File → New → Project → Spring Initializr
# - Java 21
# - Spring Boot 4.0.0
# - Dependencies: Spring Web, Spring Data JPA
```

**Test Frontend Setup:**
```bash
# Create test React project
npm create vite@latest test-react -- --template react-ts
cd test-react
npm install
npm run dev

# Open http://localhost:5173
# You should see Vite + React page
```

### Tasks for Hour 4

```markdown
✅ CHECKLIST:
- [ ] Install Node.js 20+ LTS
- [ ] Verify: node --version shows v20.x.x
- [ ] Install VS Code
- [ ] Install 10 essential VS Code extensions
- [ ] Configure VS Code settings
- [ ] Install React Developer Tools (browser)
- [ ] Install/configure Git
- [ ] Create test Spring Boot project
- [ ] Create test React project
- [ ] Run test React project successfully
```

---

## HOUR 5: TESTING FRAMEWORKS REVIEW

### Learning Objectives
- Understand testing pyramid
- Learn JUnit 5 basics
- Learn Vitest/Jest basics
- Understand testing best practices

### Testing Pyramid

```
       /\
      /  \     E2E Tests (Few)
     /____\    
    /      \   Integration Tests (Some)
   /________\  
  /          \ Unit Tests (Many)
 /____________\
```

**Key Principle:** More unit tests, fewer E2E tests

### 1. JUnit 5 (20 min)

#### Core Concepts

**Basic Test Structure:**
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    
    @Test
    void testAddition() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3));
    }
    
    @Test
    void testDivisionByZero() {
        Calculator calc = new Calculator();
        assertThrows(ArithmeticException.class, () -> {
            calc.divide(10, 0);
        });
    }
}
```

**Important Annotations:**
- `@Test` - Marks a test method
- `@BeforeEach` - Runs before each test
- `@AfterEach` - Runs after each test
- `@BeforeAll` - Runs once before all tests (static)
- `@AfterAll` - Runs once after all tests (static)
- `@DisplayName` - Custom test name
- `@Disabled` - Skip test

**Example with Setup/Teardown:**
```java
class UserServiceTest {
    
    private UserService userService;
    private UserRepository mockRepo;
    
    @BeforeEach
    void setUp() {
        mockRepo = mock(UserRepository.class);
        userService = new UserService(mockRepo);
    }
    
    @Test
    @DisplayName("Should create user with valid data")
    void testCreateUser() {
        // Given
        User user = new User("john@example.com", "John Doe");
        when(mockRepo.save(any(User.class))).thenReturn(user);
        
        // When
        User created = userService.createUser(user);
        
        // Then
        assertNotNull(created);
        assertEquals("john@example.com", created.getEmail());
        verify(mockRepo, times(1)).save(any(User.class));
    }
}
```

**Resources:**
- JUnit 5 User Guide: https://junit.org/junit5/docs/current/user-guide/
- Baeldung JUnit 5: https://www.baeldung.com/junit-5
- Video: "JUnit 5 Basics" by Amigoscode: https://www.youtube.com/watch?v=flpmSXVTqBI

#### 2. Mockito (10 min)

**Why Mock?**
- Isolate unit under test
- Avoid dependencies (database, external APIs)
- Control test behavior

**Basic Mocking:**
```java
import static org.mockito.Mockito.*;

// Create mock
UserRepository mockRepo = mock(UserRepository.class);

// Define behavior
when(mockRepo.findById(1L)).thenReturn(Optional.of(user));

// Verify interactions
verify(mockRepo, times(1)).findById(1L);
```

**Resources:**
- Mockito Documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html
- Baeldung Mockito: https://www.baeldung.com/mockito-series

### 3. Vitest (Frontend Testing) (15 min)

**What is Vitest?**
- Fast unit test framework for Vite projects
- Jest-compatible API
- Built-in TypeScript support

**Basic Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './utils';

describe('sum function', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
  
  it('should handle negative numbers', () => {
    expect(sum(-2, 3)).toBe(1);
  });
});
```

**React Component Test:**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Resources:**
- Vitest Guide: https://vitest.dev/guide/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Video: "Vitest Tutorial" by Web Dev Simplified: https://www.youtube.com/watch?v=7f-71kYhK00

### 4. Testing Best Practices (10 min)

**AAA Pattern:**
```java
@Test
void testUserCreation() {
    // Arrange - Set up test data
    String email = "test@example.com";
    
    // Act - Execute the code
    User user = userService.create(email);
    
    // Assert - Verify results
    assertNotNull(user);
    assertEquals(email, user.getEmail());
}
```

**Test Naming Conventions:**
```java
// Good names:
shouldCreateUserWhenValidDataProvided()
shouldThrowExceptionWhenEmailIsInvalid()
shouldReturnEmptyListWhenNoUsersExist()

// Bad names:
test1()
testUser()
createUserTest()
```

**What to Test:**
- ✅ Business logic
- ✅ Edge cases (null, empty, boundaries)
- ✅ Error handling
- ❌ Getters/setters (unless they have logic)
- ❌ Framework code
- ❌ Third-party libraries

**Coverage Goals:**
- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: User workflows

**Resources:**
- Testing Best Practices: https://www.baeldung.com/java-testing-best-practices
- Clean Tests: https://www.thoughtworks.com/insights/blog/coding-practices/clean-tests

### Tasks for Hour 5

```markdown
✅ CHECKLIST:
- [ ] Read JUnit 5 User Guide intro (10 min)
- [ ] Read Mockito documentation (5 min)
- [ ] Read Vitest guide (10 min)
- [ ] Watch testing tutorial video (20 min)
- [ ] Create testing notes document (10 min)
- [ ] Bookmark important testing resources (5 min)
```

### Create: `day1-testing-notes.md`

```markdown
# Testing Notes

## Testing Pyramid
- Many unit tests (fast, isolated)
- Some integration tests (test components together)
- Few E2E tests (slow, test entire system)

## JUnit 5
- @Test - test method
- @BeforeEach - setup before each test
- assertEquals, assertNotNull, assertThrows
- Use descriptive test names

## Mockito
- mock() - create mock object
- when().thenReturn() - define behavior
- verify() - check interactions
- Use for isolating dependencies

## Vitest (Frontend)
- describe() - test suite
- it() - individual test
- expect().toBe() - assertions
- vi.fn() - mock functions

## Best Practices
- AAA pattern: Arrange, Act, Assert
- Test one thing per test
- Use descriptive names
- Test edge cases
- Mock external dependencies
- Aim for 80%+ unit test coverage

## Resources Bookmarked
- [ ] JUnit 5 docs
- [ ] Mockito docs
- [ ] Vitest docs
- [ ] Testing Library docs
- [ ] Baeldung testing guides
```

---

## END OF DAY 1 CHECKLIST

### Completion Checklist

```markdown
✅ DAY 1 COMPLETE CHECKLIST:

HOUR 1: Spring Boot 4.0
- [ ] Read release notes
- [ ] Understand virtual threads
- [ ] Understand native image support
- [ ] Created springboot4-notes.md

HOUR 2: Java 21
- [ ] Watched Java 21 overview video
- [ ] Understand virtual threads (JEP 444)
- [ ] Understand pattern matching
- [ ] Created java21-notes.md

HOUR 3: Development Tools
- [ ] Java 21 JDK installed and verified
- [ ] IntelliJ IDEA installed and configured
- [ ] Docker Desktop installed and running
- [ ] PostgreSQL running in Docker
- [ ] Database client installed and connected
- [ ] Postman/Thunder Client installed

HOUR 4: Frontend Tools
- [ ] Node.js 20+ installed and verified
- [ ] VS Code installed with extensions
- [ ] React Developer Tools installed
- [ ] Git configured
- [ ] Test React project created and running

HOUR 5: Testing Review
- [ ] JUnit 5 basics understood
- [ ] Mockito concepts clear
- [ ] Vitest/Testing Library reviewed
- [ ] Testing best practices documented
- [ ] Created testing-notes.md

FINAL TASKS:
- [ ] All notes organized in a folder
- [ ] Development environment fully working
- [ ] Can run: java -version, node -version, docker ps
- [ ] Bookmark all important resources
- [ ] Plan tomorrow's tasks (Day 2)
```

### Verify Your Setup

Run these commands to verify everything works:

```bash
# Java
java -version
# Should show: openjdk version "21.0.1"

# Node.js
node --version
# Should show: v20.x.x

# Docker
docker --version
docker ps
# Should list running containers (PostgreSQL)

# Git
git --version

# Test PostgreSQL
docker exec -it postgres-dev psql -U postgres -c "SELECT version();"
# Should show PostgreSQL 18.x
```

---

## HOMEWORK (Optional, Evening)

If you have extra time or want to prepare for Day 2:

1. **Read ahead (30 min):**
   - Mockito documentation: https://www.baeldung.com/mockito-series
   - TestContainers intro: https://testcontainers.com/getting-started/

2. **Practice coding (30 min):**
   - Create simple Calculator class
   - Write JUnit tests for it
   - Practice AAA pattern

3. **Watch videos (30 min):**
   - "Testing Spring Boot Applications" by Spring.io
   - "React Testing Library Crash Course"

---

## TROUBLESHOOTING

### Common Issues

**Issue: Java command not found**
```bash
# Solution: Check PATH
echo $JAVA_HOME
# Should point to Java 21 installation

# Mac/Linux: Add to ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# Windows: Set in System Environment Variables
```

**Issue: Docker permission denied**
```bash
# Linux solution:
sudo usermod -aG docker $USER
# Then log out and back in
```

**Issue: PostgreSQL connection failed**
```bash
# Check if container is running
docker ps

# Check logs
docker logs postgres-dev

# Restart
docker restart postgres-dev

# If port conflict:
docker run --name postgres-dev -p 5433:5432 ...
```

**Issue: npm command not found**
```bash
# Reload shell after NVM installation
source ~/.bashrc  # or ~/.zshrc

# Or install Node.js directly from nodejs.org
```

---

## NEXT STEPS

Tomorrow (Day 2), you'll:
1. Deep dive into JUnit 5 and Mockito with hands-on practice
2. Write actual unit tests for sample services
3. Learn TestContainers for integration testing
4. Build confidence in testing

**Get a good night's rest! Day 2 will be hands-on coding. 🚀**

---

## QUICK REFERENCE CARD

Save this for easy access:

```markdown
# Day 1 Quick Reference

## Verify Installations
- Java: java -version (should be 21.x)
- Node: node --version (should be 20.x)
- Docker: docker --version
- Git: git --version

## Start PostgreSQL
docker start postgres-dev

## Connect to DB
docker exec -it postgres-dev psql -U postgres

## Important Links
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Java 21 Docs: https://dev.java/learn/
- React Docs: https://react.dev/
- JUnit 5: https://junit.org/junit5/
- Vitest: https://vitest.dev/

## VS Code Shortcuts
- Ctrl+P - Quick open
- Ctrl+Shift+P - Command palette
- Ctrl+` - Terminal

## IntelliJ Shortcuts
- Shift+Shift - Search everywhere
- Ctrl+Space - Auto-complete
- Alt+Insert - Generate code
```

---

**Congratulations on completing Day 1! 🎉**

You now have a fully configured development environment and understand the key technologies you'll be using. Tomorrow, you'll start writing actual code and tests!