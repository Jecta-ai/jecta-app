# Jecta App

Jecta is a Next.js-based AI Copilot application that integrates with Injective Blockchain and uses Supabase for data storage. This application allows users to interact with an AI Copilot that can perform various blockchain-related tasks like checking balances, staking, swapping tokens, and more.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Injective](https://img.shields.io/badge/Injective-0052FF?style=for-the-badge&logo=injectiveprotocol&logoColor=white)

<img src="https://pbs.twimg.com/profile_images/1887520476555046912/wxXggXte_400x400.jpg" alt="Jecta" width="100" height="100">

## Features

- AI-powered Copilot interface
- Blockchain wallet integration (Leap, Keplr)
- User authentication via wallet signatures
- Chat history storage and retrieval
- Token balance checking
- Validator staking functionality
- Unstaking functionality
- DefiLlama integration for TVL informations of the ecosystem
- Token swapping capabilities
- Token sending functionality
- Portfolio management
- Portfolio analysis
- Transaction search & AI-powered analysis
- Search latest Injective news with Venice API
- Token analysis using Sonia
- Injective burn auction tools (get & place bid auction)

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT with wallet signature verification
- **Blockchain Integration**: Injective Typescript SDK, Cosmos SDK
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
  id UUID PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  nonce UUID
);
```

#### Chats Table

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY,
  ai_id UUID,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT
);
```

#### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
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

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

This means you are free to:

- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

See the LICENSE file for more details.
