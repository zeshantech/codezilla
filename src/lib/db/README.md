# Database Setup (MongoDB)

This directory contains the necessary files for setting up and interacting with MongoDB for CodeZilla.

## Structure

- `connection.ts` - Handles connecting to MongoDB
- `models/` - Contains Mongoose models/schemas for database collections
- `seed.ts` - Contains logic to seed the database with initial data
- `seed-init.ts` - Handles initializing the seeding process
- `init.ts` - Main entry point for initializing the database

## Setup Instructions

1. Make sure MongoDB is installed and running on your system or use a cloud MongoDB service
2. Set the MongoDB URI in your .env.local file:

```
MONGODB_URI=mongodb://localhost:27017/codezilla
```

3. The database will be automatically initialized and seeded when the application starts in development mode

## Models

The database contains the following collections:

1. **Users** - Stores user information and problem progress
2. **Problems** - Stores programming problems
3. **Collections** - Stores problem collections

## API

The database API is exposed through the following modules:

- `src/lib/api/problems.ts` - API for problems
- `src/lib/api/collections.ts` - API for collections
- `src/lib/api/users.ts` - API for users

These APIs are then used by the React hooks in the application:

- `src/hooks/useProblems.ts`
- `src/hooks/useCollections.ts`
- `src/hooks/useUser.ts`
