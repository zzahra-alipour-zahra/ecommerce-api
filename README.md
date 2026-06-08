# Ecommerce API (Node.js + MongoDB + Docker)

A production-style backend API for an ecommerce system built with:

* Node.js
* Express.js
* MongoDB
* Docker & Docker Compose
* JWT Authentication
* Zarinpal Payment Gateway Integration

---

# Features

* User authentication and authorization using JWT
* Role-based access control (Admin/User)
* Product management (CRUD operations)
* Category management
* Brand management
* Color management
* Shopping cart and order processing
* Coupon management
* Product reviews
* Stock management with atomic updates
* MongoDB transactions for order safety
* Aggregation-based analytics and reporting
* Zarinpal payment gateway integration (Sandbox & Production)

---

# Architecture Flow

User → Create Order → Reserve Stock → Payment Request → Gateway Redirect → Payment Verification → Order Confirmation

---

# Base URLs

## Local Development

```text
http://localhost:7000
```

## API Base Path

```text
http://localhost:7000/api/v1
```

---

# Prerequisites

To run this project, you only need:

* Docker
* Docker Compose

No local installation of Node.js or MongoDB is required.

---

# Project Structure

```text
.
├── controllers
├── model
├── routes
├── services
├── utils
├── docs
│   └── postman
│       └── ecommerce-api.postman_collection.json
├── Dockerfile
├── docker-compose.yml
├── config.env
├── seeder.js
└── README.md
```

---

# Running the Project with Docker

## 1. Clone Repository

```bash
git clone https://github.com/zzahra-alipour-zahra/ecommerce-api.git
cd ecommerce-api
```

## 2. Create Environment File

Copy the example environment file:
```bash
cp .env.example config.env
```
Then update the values inside config.env as needed.

Example:

```env
PORT=7000
JWT_SECRET=your_secret_key
DATABASE_LOCAL=mongodb://mongodb:27017/ecommerce?replicaSet=rs0
```

---

## Environment Variables

The repository does not include real credentials or secrets.

Create a `config.env` file from `.env.example` and provide your own values for:

* JWT_SECRET
* Email configuration
* ZarinPal Merchant ID
* Other environment-specific settings



#  Email Service Configuration

This project uses Nodemailer for sending transactional emails.

---

## Development Setup (Mailtrap)

Use Mailtrap for development to safely test emails without sending real ones.

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=no-reply@example.com
```
## Production Setup

For production environments, it is recommended to use a reliable email service provider:

- SendGrid (recommended)
- Mailgun
- Amazon SES
- Gmail SMTP (basic usage for small applications)

These services provide better reliability, scalability, and delivery guarantees compared to basic SMTP setups.

---



## 3. Build and Start Containers

```bash
docker-compose up -d --build
```

After startup:

* API Server: [http://localhost:7000](http://localhost:7000)
* MongoDB: mongodb://localhost:27017
* Mongo Express: [http://localhost:8081](http://localhost:8081)

---

## 4. Initialize MongoDB Replica Set (First Run Only)

This project uses MongoDB Transactions. MongoDB transactions require a replica set, even in local development.

After the MongoDB container starts, run:

```bash
docker exec -it mongodb mongosh --eval "rs.initiate()"
##seed data
docker-compose exec api node seeder.js
```

This step is required only once.

---

## 5. Stop Containers

```bash
docker-compose down
```

---

# API Testing

A complete API collection is included for testing all endpoints.

Collection Location:

```text
/docs/postman/ecommerce-api.postman_collection.json
```

## Import Collection

1. Open Postman or Insomnia.
2. Click Import.
3. Select:

```text
docs/postman/ecommerce-api.postman_collection.json
```

4. Configure environment variables:

```text
dev.base_url=http://localhost:7000/api/v1
dev.adminToken=<your_admin_jwt_token>
```

All requests, sample payloads, and protected routes are already configured.

---

# Seed Users

The project includes sample users for authentication and authorization testing.

## Admin User

```text
Email: admin@test.com
Password: password123
```

## Normal User

```text
Email: user@test.com
Password: password123
```


If demo users do not exist, run:
```
docker-compose exec api node seeder.js
```

Or:
```
docker-compose exec api node seeder.js
```
---

# Available API Modules

* Authentication
* Users
* Products
* Categories
* Brands
* Colors
* Orders
* Coupons
* Reviews

---

# Docker Services

The project contains the following services:

## API Service

Node.js + Express application

## MongoDB

MongoDB configured as a single-node replica set to support transactions.

## Mongo Express

Web-based MongoDB administration interface.

Accessible at:

```text
http://localhost:8081
```

---

# MongoDB Features Used

* Transactions
* Aggregation Pipelines
* Indexing
* Population
* Atomic Updates
* Replica Set Configuration

---

# Postman Collection Coverage

The included Postman collection covers:

* Authentication flow
* User management
* Product CRUD operations
* Category CRUD operations
* Brand CRUD operations
* Color CRUD operations
* Coupon management
* Order workflow
* Admin-only routes
* Protected endpoints

---

# Notes for Reviewers

* Fully containerized using Docker and Docker Compose.
* No local Node.js or MongoDB installation required.
* Uses JWT-based authentication and authorization.
* Includes transactional order processing using MongoDB transactions.
* Implements role-based access control.
* Designed using scalable backend architecture patterns and containerized deployment workflows.
* Suitable as a backend foundation for ecommerce applications.

---

# Important Note

This project is intended for demonstration and educational purposes.

MongoDB is configured as a single-node replica set to support transactions in a local Docker environment.

Production deployment configurations such as load balancing, monitoring, centralized logging, CI/CD pipelines, and cloud infrastructure are not included in this repository.
