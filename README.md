# CodeZilla

A comprehensive platform for practicing programming problems with real-time coding and testing.

## Features

- Browse and solve programming problems with different difficulty levels
- Collections of problems organized by topics
- Real-time code editor with syntax highlighting
- User progress tracking
- MongoDB database integration

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Database**: MongoDB with Mongoose
- **State Management**: React Query
- **Code Editor**: Monaco Editor

## Database Implementation

The application uses MongoDB for data persistence, with the following models:

- **Users**: Store user profiles and problem progress
- **Problems**: Store programming problems, test cases, and solutions
- **Collections**: Group problems by topics or difficulty

### Database Setup

1. Install MongoDB locally or use a cloud service like MongoDB Atlas.
2. Set up your MongoDB connection string in the `.env.local` file:

```
MONGODB_URI=mongodb://localhost:27017/codezilla
NODE_ENV=development
```

3. The application will automatically connect to MongoDB and seed initial data when started in development mode.

### API Structure

The API layer is implemented with:

- **Database Models** (`src/lib/db/models/*`): Mongoose schemas
- **API Handlers** (`src/lib/api/*`): Functions to interact with the database
- **React Hooks** (`src/hooks/*`): Custom hooks that use React Query to fetch data
- **API Routes** (`src/app/api/*`): Next.js API routes for HTTP endpoints

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/codezilla
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- The database is automatically seeded with initial data.
- To manually trigger database initialization, visit `/api/init-db` in your browser.

## Database Schema Migration

When making changes to the database schema:

1. Update the TypeScript types in `src/types/index.ts`
2. Update the corresponding Mongoose models in `src/lib/db/models/`
3. Update the API handlers in `src/lib/api/`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
