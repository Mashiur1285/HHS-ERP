# Hospital Management System

A Laravel + React (Inertia.js) based hospital management system.

## Tech Stack

- **Backend:** Laravel 12, PostgreSQL
- **Frontend:** React 19, TypeScript, Tailwind CSS, Inertia.js
- **Build Tool:** Vite

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 20
- PostgreSQL

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Mashiur1285/hospital-management.git
cd hospital-management
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node dependencies

```bash
npm install
```

### 4. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure database

`.env` file এ PostgreSQL credentials দাও:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=hospital_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Create database

PostgreSQL এ `hospital_management` নামে একটা database বানাও।

### 7. Run migrations

```bash
php artisan migrate
```

### 8. Start the development server

দুইটা আলাদা terminal এ run করো:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev
```

এরপর browser এ যাও: **http://localhost:8000**
