## Description

Assessment Backend API built with NestJS framework, featuring user authentication, and product management.

## Prerequisites

Before running this application, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### API Documentation

Access the [Postman Documentation](https://documenter.getpostman.com/view/29238176/2sB34bJi6i).

## Getting Started

### 1. Clone the Repository

```bash
$ git clone <repository-url>
$ cd assesmen_backend
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production


# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/assessment_db"

```

### 3. Install Dependencies

```bash
$ npm install
```

### 4. Start Database with Docker

```bash
$ docker-compose up -d
```

This will start PostgreSQL database in a Docker container.

### 5. Database Migration & Setup

```bash
# Run database migrations
$ npx prisma migrate dev

# Generate Prisma client
$ npx prisma generate
```

### 6. Run the Application

```bash
# Development mode (recommended)
$ npm run start:dev

# Or standard development mode
$ npm run start

# Production mode
$ npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (requires auth)

### Products

- `GET /api/products` - Get user's products (requires auth)
- `POST /api/products` - Create product (requires auth)
- `GET /api/products/:id` - Get specific product (requires auth & ownership)
- `PATCH /api/products/:id` - Update product (requires auth & ownership)
- `DELETE /api/products/:id` - Delete product (requires auth & ownership)

## Project Structure

```
src/
├── auth/                 # Authentication & authorization
│   ├── guards/          # Auth & ownership guards
│   ├── jwt/             # JWT token service
│   └── middleware/      # Auth middleware
├── common/              # Shared utilities
│   ├── error.filter.ts  # Global error handling
│   ├── prisma.service.ts# Database service
│   └── validation.service.ts
├── config/              # Configuration files
├── product/             # Product module
├── user/               # User module
└── main.ts             # Application entry point
```

## Database Management

### Prisma Commands

```bash
# View database status
$ npx prisma migrate status

# Reset database (development only)
$ npx prisma migrate reset

# Open Prisma Studio (database GUI)
$ npx prisma studio

# Generate Prisma client after schema changes
$ npx prisma generate
```

### Docker Commands

```bash
# Start database
$ docker-compose up -d

# Stop database
$ docker-compose down

# View database logs
$ docker-compose logs postgres

# Reset database volume (deletes all data)
$ docker-compose down -v
```

## Development Workflow

### Quick Start (Step by Step)

1. **Start Database**

   ```bash
   $ docker-compose up -d
   ```

2. **Setup Database**

   ```bash
   $ npx prisma migrate dev
   $ npx prisma generate
   ```

3. **Start Development Server**

   ```bash
   $ npm run start:dev
   ```

4. **Test API**
   - Use Postman, Thunder Client, or any HTTP client
   - Import API collection if available
   - Base URL: `http://localhost:3000`

### Making Changes

1. **Database Schema Changes**

   ```bash
   # Edit prisma/schema.prisma
   $ npx prisma migrate dev --name describe_your_change
   $ npx prisma generate
   ```

2. **Code Changes**
   - Server auto-restarts with `npm run start:dev`
   - Check logs for any errors
