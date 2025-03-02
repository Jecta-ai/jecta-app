# Jecta App

Jecta is a Next.js-based AI chatbot application that integrates with blockchain wallets (primarily Injective) and uses Supabase for data storage. This application allows users to interact with an AI assistant that can perform various blockchain-related tasks like checking balances, staking, swapping tokens, and more.

## Features

- AI-powered chatbot interface
- Blockchain wallet integration (Injective, Keplr, etc.)
- User authentication via wallet signatures
- Chat history storage and retrieval
- Token balance checking
- Validator staking functionality
- Token swapping capabilities
- Token sending functionality

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT with wallet signature verification
- **Blockchain Integration**: Injective Labs SDK, Cosmos SDK
- **AI Integration**: OpenRouter API

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- OpenRouter API key (for AI functionality)
- Basic knowledge of blockchain concepts

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Jecta-ai/jecta-app
cd jecta-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_JWT_SECRET`: Secret key for JWT token generation
- `OPENROUTER_API_KEY`: API key for OpenRouter
- `OPENROUTER_BASE_URL`: Base URL for OpenRouter API
- `MODEL`: AI model to use
- `BEARER_TOKEN`: Bearer token for API authentication
- `MAX_POSTS`: Maximum number of posts to retrieve

### 4. Database Setup

You need to set up the following tables in your Supabase PostgreSQL database:

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  nonce TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Chats Table
```sql
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id),
  sender_id INTEGER REFERENCES users(id),
  message JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

- `/app`: Main application code
  - `/api`: API routes for backend functionality
  - `/components`: React components
  - `/providers`: Context providers
  - `/services`: Service functions for API calls
- `/lib`: Utility libraries
- `/public`: Static assets
- `/ai`: AI-related functionality
- `/wallet`: Wallet integration code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here]
