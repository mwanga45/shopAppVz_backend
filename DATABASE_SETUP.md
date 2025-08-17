# Database Setup Guide

This guide will help you set up the database connection for your NestJS backend application.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Installation

The required dependencies have already been installed:

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config
```

## Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database_name
   ```

## Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE your_database_name;
   ```

2. Create a user (optional):
   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
   ```

## Configuration Files

The application includes the following configuration files:

- `src/config/configuration.ts` - Main configuration with environment variables
- `src/config/database.config.ts` - Database-specific configuration
- `src/app.module.ts` - Updated to include database connection

## Running the Application

1. Make sure your PostgreSQL server is running
2. Start the application:
   ```bash
   npm run start:dev
   ```

## Database Synchronization

The `DB_SYNCHRONIZE` option is set to `false` by default for safety. In development, you can set it to `true` to automatically create tables based on your entities.

## Sample Entity

A sample `User` entity has been created at `src/entities/user.entity.ts` to demonstrate the database connection.

## Troubleshooting

- Ensure PostgreSQL is running and accessible
- Check your database credentials in the `.env` file
- Verify the database exists and is accessible
- Check the application logs for connection errors

## Production Considerations

- Set `DB_SYNCHRONIZE=false` in production
- Use strong passwords and secure database access
- Consider using connection pooling for better performance
- Enable SSL for database connections in production
