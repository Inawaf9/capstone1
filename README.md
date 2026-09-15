# 🛒 E-Commerce System

<p align="center">
  <div align="center" style="background-color: white; padding: 20px;">
  <img src="tuwaiq-academy-logo.png" alt="Tuwaiq Academy" width="320"/>
</div>
</p>

<h3 align="center">E-Commerce REST API</h3>

<p align="center">
  A backend E-Commerce system built with <b>Java</b> and <b>Spring Boot</b>
  as part of the <b>Tuwaiq Academy Java Bootcamp</b>.
</p>

---

## 📌 About the Project

This project is a RESTful E-Commerce backend system developed using **Java and Spring Boot**.

The system manages the main components of an E-Commerce platform:

- Users
- Products
- Categories
- Merchants
- Merchant Stock

In addition to standard CRUD operations, the project implements multiple business features such as:

- Purchasing products
- Purchasing multiple quantities
- Restocking inventory
- Transferring balance
- Charging user balance
- Role management
- Product and category discounts
- Gift purchases
- Data consistency operations
- System statistics

The main goal of the project is to demonstrate **Spring Boot architecture, REST API development, validation, entity relationships, and business logic implementation**.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Java | Main programming language |
| Spring Boot | Backend framework |
| Spring Web | Building REST APIs |
| Jakarta Validation | Model and request validation |
| Lombok | Reducing boilerplate code |
| Maven | Dependency management |
| IntelliJ IDEA | Development environment |
| Git | Version control |
| GitHub | Repository and Pull Request management |

---

# 🏗️ Project Architecture

The application follows a simple layered architecture:

```text
Client
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Model / In-Memory Data
```

Each layer has a specific responsibility.

### Controller Layer

The Controller Layer is responsible for:

- Receiving HTTP requests
- Reading request bodies and path variables
- Calling the appropriate Service method
- Handling returned service cases
- Returning `ResponseEntity`
- Returning the appropriate HTTP status code

### Service Layer

The Service Layer contains the main business logic of the application.

It is responsible for:

- CRUD operations
- Searching for entities
- Validating entity relationships
- Purchasing operations
- Stock management
- Balance operations
- Role management
- Discounts
- Administrative operations
- System statistics

### Model Layer

The Model Layer represents the main entities of the E-Commerce system:

```text
User
Product
Category
Merchant
MerchantStock
```

---

# 📁 Project Structure

```text
e-commerce/
│
├── README.md
├── tuwaiq-academy-logo.png
├── ecommerce-uml-diagram.png
│
├── backend/
│   │
│   ├── src/main/java/com/nawaf/ecommerce/
│   │   │
│   │   ├── Api/
│   │   │   └── ApiResponse.java
│   │   │
│   │   ├── Controller/
│   │   │   ├── UserController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── MerchantController.java
│   │   │   └── MerchantStockController.java
│   │   │
│   │   ├── Model/
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Category.java
│   │   │   ├── Merchant.java
│   │   │   └── MerchantStock.java
│   │   │
│   │   ├── Service/
│   │   │   ├── UserService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CategoryService.java
│   │   │   ├── MerchantService.java
│   │   │   └── MerchantStockService.java
│   │   │
│   │   └── ECommerceApplication.java
│   │
│   └── pom.xml
│
└── frontend/
```

---

# 📊 UML Class Diagram

<p align="center">
  <div align="center" style="background-color: white; padding: 20px;">
    <img src="ecommerce-uml-diagram.png" alt="E-Commerce UML Class Diagram" width="900"/>
  </div>
</p>

The UML diagram represents the main entities of the system and the relationships between them.

---

## 👤 User

The `User` model represents users registered in the system.

Users can have one of two roles:

```text
customer
admin
```

A user also has a balance that can be used for operations such as:

- Purchasing products
- Purchasing gifts
- Purchasing multiple products
- Transferring balance

Admins can perform additional administrative operations.

---

## 📦 Product

The `Product` model represents a product available in the system.

A product contains information such as:

- ID
- Name
- Price
- Category ID

Each product can reference a category using:

```text
categoryId
```

The system supports applying discounts to either:

- One specific product
- All products belonging to a category

---

## 🏷️ Category

The `Category` model is used to organize products.

A product can belong to a category through:

```text
Product.categoryId
```

The system can also apply a percentage discount to every product belonging to a specific category.

---

## 🏪 Merchant

The `Merchant` model represents a merchant that sells products.

Merchants are connected to products through `MerchantStock`.

---

## 📚 MerchantStock

`MerchantStock` represents the inventory relationship between a merchant and a product.

Conceptually:

```text
Merchant
   │
   ▼
MerchantStock
   ▲
   │
Product
```

A MerchantStock record contains:

```text
merchantId
productId
stock
```

This allows the same product to have different stock quantities at different merchants.

Example:

```text
Merchant A
└── Product X → 10 units

Merchant B
└── Product X → 25 units
```

---

# 🌐 API Endpoints

The application provides CRUD endpoints and additional business endpoints.

---

## 👤 User Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/user/get` | Get all users |
| `POST` | `/api/v1/user/add` | Add a new user |
| `PUT` | `/api/v1/user/update/{id}` | Update an existing user |
| `DELETE` | `/api/v1/user/delete/{id}` | Delete a user |

---

## 📦 Product Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/product/get` | Get all products |
| `POST` | `/api/v1/product/add` | Add a new product |
| `PUT` | `/api/v1/product/update/{id}` | Update an existing product |
| `DELETE` | `/api/v1/product/delete/{id}` | Delete a product |

---

## 🏷️ Category Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/category/get` | Get all categories |
| `POST` | `/api/v1/category/add` | Add a new category |
| `PUT` | `/api/v1/category/update/{id}` | Update an existing category |
| `DELETE` | `/api/v1/category/delete/{id}` | Delete a category |

---

## 🏪 Merchant Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/merchant/get` | Get all merchants |
| `POST` | `/api/v1/merchant/add` | Add a new merchant |
| `PUT` | `/api/v1/merchant/update/{id}` | Update an existing merchant |
| `DELETE` | `/api/v1/merchant/delete/{id}` | Delete a merchant |

---

## 📚 Merchant Stock Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/stock/get` | Get all merchant stock records |
| `POST` | `/api/v1/stock/add` | Add a merchant stock record |
| `PUT` | `/api/v1/stock/update/{id}` | Update a merchant stock record |
| `DELETE` | `/api/v1/stock/delete/{id}` | Delete a merchant stock record |

---

# ⚙️ Business Endpoints

| # | Method | Endpoint | Feature |
|---:|---|---|---|
| 1 | `POST` | `/buy-product/{userId}/{productId}/{merchantId}` | Buy one product |
| 2 | `PUT` | `/add-stock/{merchantId}/{productId}/{quantity}` | Restock product |
| 3 | `POST` | `/buy-product/{userId}/{productId}/{merchantId}/{quantity}` | Buy multiple products |
| 4 | `POST` | `/transfer/{userId}/{receiverId}/{amount}` | Transfer balance |
| 5 | `PUT` | `/charge/{id}/{amount}` | Charge user balance |
| 6 | `PUT` | `/change-role-to-admin/{adminId}/{customerId}` | Change customer to admin |
| 7 | `PUT` | `/discount-category/{categoryId}/{percentage}` | Discount category products |
| 8 | `POST` | `/buy-gift/{senderId}/{receiverId}/{productId}/{merchantId}` | Buy product as gift |
| 9 | `PUT` | `/discount-product/{id}/{percentage}` | Discount specific product |
| 10 | `PUT` | `/products/fix-invalid-categories/{adminId}` | Fix invalid category references |
| 11 | `PUT` | `/stocks/fix-invalid-references/{adminId}` | Fix invalid stock references |
| 12 | `GET` | `/system-summary` | Get system statistics |

---

# 🚀 Business Features

## 1. 🛒 Buy Product

Allows a user to purchase one product from a specific merchant.

```http
POST /buy-product/{userId}/{productId}/{merchantId}
```

### Cases

Before completing the purchase, the system checks:

```text
User exists
      ↓
Product exists
      ↓
MerchantStock exists
      ↓
Stock > 0
      ↓
User has enough balance
      ↓
Purchase
```

Possible cases:

| Case | Result |
|---:|---|
| `0` | Product purchased successfully |
| `1` | User not found |
| `2` | Product not found |
| `3` | Merchant stock not found |
| `4` | Product is out of stock |
| `5` | User does not have enough balance |

### On Success

The system performs two changes:

```text
User Balance -= Product Price
Merchant Stock -= 1
```

---

# 2. 📥 Restock Product

Allows additional stock to be added to a product for a specific merchant.

```http
PUT /add-stock/{merchantId}/{productId}/{quantity}
```

The stock record is identified using:

```text
merchantId + productId
```

### On Success

```text
Current Stock += Quantity
```

This allows merchants to replenish their inventory without creating a new stock record.

---

# 3. 🛍️ Buy Multiple Products

Allows a user to purchase multiple units of the same product in one operation.

```http
POST /buy-product/{userId}/{productId}/{merchantId}/{quantity}
```

### Cases

The system verifies:

| Case | Result |
|---:|---|
| `0` | Products purchased successfully |
| `1` | User not found |
| `2` | Product not found |
| `3` | Merchant stock not found |
| `4` | Product is out of stock |
| `5` | Requested quantity exceeds available stock |
| `6` | User does not have enough balance |

The total price is calculated using:

```text
Total Price = Product Price × Quantity
```

### On Success

```text
User Balance -= Total Price
Merchant Stock -= Quantity
```

---

# 4. 💸 Transfer Balance

Allows one user to transfer part of their balance to another user.

```http
POST /transfer/{userId}/{receiverId}/{amount}
```

### Cases

| Case | Result |
|---:|---|
| `0` | Balance transferred successfully |
| `1` | Sender not found |
| `2` | Receiver not found |
| `3` | Sender does not have enough balance |
| `4` | Sender and receiver are the same user |
| `5` | Transfer amount is invalid |

### Business Rules

The system prevents:

```text
Transferring to yourself
Transferring a negative amount
Transferring zero
Transferring more than the available balance
```

### On Success

```text
Sender Balance   -= Amount
Receiver Balance += Amount
```

---

# 5. 💳 Charge User Balance

Adds money to an existing user's balance.

```http
PUT /charge/{id}/{amount}
```

### Business Rules

- User must exist
- Amount must be greater than zero

### On Success

```text
User Balance += Amount
```

---

# 6. 👑 Change Customer Role to Admin

Allows an admin to promote a customer to an admin.

```http
PUT /change-role-to-admin/{adminId}/{customerId}
```

### Cases

| Case | Result |
|---:|---|
| `0` | Role changed successfully |
| `1` | Admin not found |
| `2` | Customer not found |
| `3` | Requesting user is not an admin |
| `4` | Target user is already an admin |

### On Success

```text
customer
   ↓
 admin
```

This operation demonstrates simple role-based business authorization.

---

# 7. 🏷️ Discount Category

Applies a percentage discount to every product belonging to a specific category.

```http
PUT /discount-category/{categoryId}/{percentage}
```

### Business Rules

The percentage must satisfy:

```text
percentage > 0
percentage <= 100
```

The system searches through all products and applies the discount to products with the specified:

```text
categoryId
```

### Calculation

```text
Discount = Percentage / 100

New Price = Old Price - (Old Price × Discount)
```

Example:

```text
Price = 100
Discount = 20%

New Price = 80
```

---

# 8. 🎁 Buy Product as Gift

Allows one user to purchase a product as a gift for another user.

```http
POST /buy-gift/{senderId}/{receiverId}/{productId}/{merchantId}
```

### Cases

| Case | Result |
|---:|---|
| `0` | Gift purchased successfully |
| `1` | Sender not found |
| `2` | Receiver not found |
| `3` | Sender cannot gift themselves |
| `4` | Product not found |
| `5` | Merchant stock not found |
| `6` | Product is out of stock |
| `7` | Sender does not have enough balance |

### On Success

```text
Sender Balance -= Product Price
Merchant Stock -= 1
```

This operation connects multiple entities:

```text
Sender
   │
   │ pays
   ▼
Product
   │
   ▼
MerchantStock

Receiver
   ▲
   │
 Gift
```

It also requires communication between multiple services:

```text
UserService
    │
    ├── ProductService
    │
    └── MerchantStockService
```

---

# 9. 💰 Discount Product

Applies a percentage discount to one specific product.

```http
PUT /discount-product/{id}/{percentage}
```

### Cases

| Case | Result |
|---:|---|
| `0` | Discount applied successfully |
| `1` | Product not found |
| `2` | Invalid percentage |

### Percentage Rules

```text
0 < percentage <= 100
```

### Calculation

```text
Discount = Percentage / 100

New Price = Price - (Price × Discount)
```

---

# 10. 🔧 Fix Invalid Product Categories

Checks all products for category references that no longer point to an existing category.

```http
PUT /products/fix-invalid-categories/{adminId}
```

### Authorization

Only an admin can perform this operation.

### Cases

| Case | Result |
|---:|---|
| `0` | Invalid category references fixed |
| `1` | Admin not found |
| `2` | User is not authorized |

The system checks:

```text
Product.categoryId
        │
        ▼
Does Category exist?
     /       \
   Yes        No
   │           │
 Keep      Set to null
```

If a category no longer exists:

```java
product.setCategoryId(null);
```

This prevents products from keeping invalid references.

---

# 11. 🔧 Fix Invalid Merchant Stock References

Checks all `MerchantStock` records and repairs invalid references.

```http
PUT /stocks/fix-invalid-references/{adminId}
```

### Authorization

Only an admin can perform this operation.

### Cases

| Case | Result |
|---:|---|
| `0` | Invalid references fixed successfully |
| `1` | Admin not found |
| `2` | User is not authorized |

The system validates both:

```text
MerchantStock.productId
        │
        ▼
Does Product exist?

MerchantStock.merchantId
        │
        ▼
Does Merchant exist?
```

If the product does not exist:

```java
stock.setProductId(null);
```

If the merchant does not exist:

```java
stock.setMerchantId(null);
```

This feature helps maintain data consistency between entities.

---

# 12. 📊 System Summary

Provides an overview of the current E-Commerce system.

```http
GET /system-summary
```

The endpoint calculates system statistics from the current in-memory data.

### Summary Information

```text
Total Users
Total Customers
Total Admins

Total Products
Total Categories
Total Merchants

Total Stock Units
Out-of-Stock Products

Average Product Price
Most Expensive Product
Cheapest Product
```

Example response:

```json
{
  "totalUsers": 10,
  "totalCustomers": 8,
  "totalAdmins": 2,
  "totalProducts": 15,
  "totalCategories": 4,
  "totalMerchants": 3,
  "totalStockUnits": 120,
  "outOfStockProducts": 2,
  "averageProductPrice": 85.5,
  "mostExpensiveProduct": "Laptop",
  "cheapestProduct": "Cable"
}
```

---

# ✅ Validation

The application uses **Jakarta Validation** to validate incoming model data.

Validation happens before invalid data reaches the main business logic.

Common validation annotations include:

```java
@NotEmpty
@NotNull
@Size
@Min
@PositiveOrZero
@Email
@Pattern
```

---

## 👤 User Validation

The User model contains multiple validation rules.

### ID

The user ID must start with:

```text
u
```

Valid example:

```text
u001
```

Example pattern:

```java
@Pattern(
    regexp = "^u.*$",
    message = "User id must start with u"
)
```

---

### Role

A user can only have one of these roles:

```text
customer
admin
```

Example:

```java
@Pattern(
    regexp = "^(customer|admin)$",
    message = "Role must be either customer or admin"
)
```

---

### Password

The password must contain at least:

- 6 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

Example:

```java
@Pattern(
    regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$",
    message = "Password must contain uppercase, lowercase, number and special character"
)
```

Example valid password:

```text
Test@1
```

---

### Email

The email must have a valid email format.

```java
@Email
```

Example:

```text
user@example.com
```

---

### Balance

A user's balance cannot be negative.

```text
balance >= 0
```

---

# 🔐 Business Validation

Model validation and business validation have different responsibilities.

## Model Validation

Model validation checks the format and constraints of incoming data.

Examples:

```text
Is the field empty?
Is the email valid?
Is the password valid?
Is the role valid?
Is the number within the allowed range?
```

This is handled using Jakarta Validation and:

```java
@Valid
```

---

## Business Validation

Business validation checks whether an operation is logically allowed.

Examples:

```text
Does the user exist?

Does the product exist?

Does the category exist?

Does the merchant exist?

Does the MerchantStock exist?

Is the product available?

Does the user have enough balance?

Does the merchant have enough stock?

Is the requesting user an admin?

Is the transfer receiver different from the sender?
```

These rules are handled inside the **Service Layer**.

---

# 🔢 Service Result Cases

Service methods use integer result codes to communicate operation results to Controllers.

For example:

```java
public int transferBalance(
        String userId,
        String receiverId,
        double amount
)
```

Can return:

```text
0 → Balance transferred successfully
1 → User not found
2 → Receiver not found
3 → Insufficient balance
4 → Same user cannot be receiver
5 → Amount must be positive
```

The Controller converts these cases into HTTP responses.

Example:

```java
return switch (transferCase) {

    case 1 -> ResponseEntity
            .status(404)
            .body(new ApiResponse("User not found"));

    case 2 -> ResponseEntity
            .status(404)
            .body(new ApiResponse("Receiver not found"));

    case 3 -> ResponseEntity
            .status(400)
            .body(new ApiResponse("User doesn't have enough balance"));

    case 4 -> ResponseEntity
            .status(400)
            .body(new ApiResponse("Same user cannot be a receiver"));

    case 5 -> ResponseEntity
            .status(400)
            .body(new ApiResponse("Amount must be positive"));

    default -> ResponseEntity
            .status(200)
            .body(new ApiResponse("Balance transferred successfully"));
};
```

This creates a clear flow:

```text
Service
   │
   │ returns case
   ▼
Controller
   │
   │ converts case
   ▼
HTTP Response
```

---

# ♻️ Reusable Service Methods

The project avoids repeating entity search logic by using reusable Service methods.

Example:

```java
public User getUser(String id) {

    for (User user : users) {

        if (user.getId().equals(id)) {
            return user;
        }
    }

    return null;
}
```

Other business operations can reuse this method:

```java
User user = getUser(userId);
```

Instead of repeating the same search loop in every method.

The same concept is used across services for:

```text
getUser()
getProduct()
getCategory()
getMerchant()
getMerchantStock()
```

These are **internal Service methods** and are not separate API endpoints.

---

# 🔗 Service Relationships

Some operations require data from multiple services.

For example, purchasing a product requires:

```text
                UserService
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   ProductService     MerchantStockService
          │                   │
          ▼                   ▼
       Product           MerchantStock
```

The `UserService` can use other services to validate all required resources before completing the purchase.

Example flow:

```text
Purchase Request
      │
      ▼
Find User
      │
      ▼
Find Product
      │
      ▼
Find MerchantStock
      │
      ▼
Check Stock
      │
      ▼
Check Balance
      │
      ▼
Update Balance
      │
      ▼
Update Stock
      │
      ▼
Purchase Complete
```

---

# 💾 Data Storage

The current version of the project does not use a database.

Data is stored using Java collections such as:

```java
private final List<User> users = new ArrayList<>();
```

The same approach is used for:

```text
Users
Products
Categories
Merchants
MerchantStock
```

This means the data is stored **in memory**.

When the Spring Boot application stops:

```text
Application Stops
       ↓
In-Memory Data Is Lost
```

This project focuses primarily on understanding:

- Spring Boot
- REST APIs
- Layered architecture
- Dependency Injection
- Service Layer
- Business logic
- Validation
- Entity relationships
- HTTP responses

rather than database persistence.

---

# 🚦 HTTP Status Codes

The API uses different HTTP status codes depending on the result of an operation.

| Status Code | Meaning |
|---:|---|
| `200 OK` | Operation completed successfully |
| `201 Created` | New resource created successfully |
| `400 Bad Request` | Invalid input or business rule violation |

---

# 🧪 Example Purchase Flow

A product purchase demonstrates how multiple layers and entities interact.

```text
Client
  │
  │ POST /buy-product/...
  ▼
UserController
  │
  ▼
UserService
  │
  ├── getUser()
  │
  ├── ProductService.getProduct()
  │
  └── MerchantStockService
          │
          ▼
  getMerchantStockByProductIdAndMerchantId()
          │
          ▼
      Validate Stock
          │
          ▼
     Validate Balance
          │
          ▼
     Deduct Balance
          │
          ▼
      Reduce Stock
          │
          ▼
      Return Case 0
          │
          ▼
      UserController
          │
          ▼
       200 OK
```

---

# 🎯 Main Use Cases

The E-Commerce system supports the following main use cases:

1. Manage users.
2. Manage products.
3. Manage categories.
4. Manage merchants.
5. Manage merchant inventory.
6. Purchase one product.
7. Purchase multiple quantities of a product.
8. Restock merchant inventory.
9. Transfer balance between users.
10. Charge user balance.
11. Promote a customer to admin.
12. Apply discounts to categories.
13. Apply discounts to individual products.
14. Purchase a product as a gift.
15. Repair invalid product-category references.
16. Repair invalid merchant-stock references.
17. Generate system statistics.

---

# 🌿 Git Branch Strategy

The backend was developed incrementally using multiple feature branches.

```text
main
 │
 ├── feature/crud
 │      │
 │      ├── CRUD Operations
 │      ├── Buy Product
 │      └── Stock Restock
 │
 ├── feature/core-endpoints
 │      │
 │      ├── Buy Multiple Products
 │      ├── Transfer Balance
 │      ├── Charge User Balance
 │      ├── Change Role to Admin
 │      └── Discount Category
 │
 └── feature/extra-endpoints
        │
        ├── Buy Product as Gift
        ├── Discount Product
        ├── Fix Invalid Product Categories
        ├── Fix Invalid Stock References
        └── System Summary
```

Each branch represents a separate stage of backend development.

This makes the project history easier to understand and allows each group of features to be reviewed independently using Pull Requests.

---

# ▶️ Running the Project

## Requirements

Make sure the following are installed:

- Java
- Maven
- Git

---

## Clone the Repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd e-commerce
```

Then enter the backend:

```bash
cd backend
```

---

## Run Spring Boot

Using Maven Wrapper:

```bash
./mvnw spring-boot:run
```

The API will typically be available at:

```text
http://localhost:8080
```

---

# 📌 Design Decisions

Several design decisions were used throughout the project.

### Business Logic in Services

Controllers are kept focused on HTTP communication.

Business logic is placed inside:

```text
Service Layer
```

### Reusable Search Methods

Methods such as:

```text
getUser()
getProduct()
getCategory()
getMerchant()
getMerchantStock()
```

are reused by other service methods.

### Relationship Validation

Before creating or modifying related resources, the system checks that referenced entities exist.

Example:

```text
New Product
    │
    ▼
categoryId
    │
    ▼
CategoryService.getCategory()
    │
    ├── Exists → Continue
    │
    └── Missing → Reject
```

### Consistent Operation Cases

Service methods return consistent integer cases that Controllers translate into HTTP responses.

### Data Consistency

Administrative maintenance endpoints can detect and repair invalid references between entities.

---

# 👨‍💻 Developer

**Nawaf**

Software Engineering Graduate

Developed as part of the **Tuwaiq Academy Java Bootcamp**.

---

<p align="center">
  <img src="tuwaiq-academy-logo.png" alt="Tuwaiq Academy" width="240"/>
</p>

<p align="center">
  <b>Tuwaiq Academy — Java Bootcamp</b>
</p>
