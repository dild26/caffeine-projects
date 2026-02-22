# InfiTask DevOps & Auto-Update Module

## Overview
This document provides instructions for local development, deployment, and the auto-update functionality of the InfiTask application.

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- DFX (Internet Computer SDK)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd infitask
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Start local Internet Computer replica**
   ```bash
   dfx start --clean --background
   ```

4. **Deploy canisters locally**
   ```bash
   dfx deploy
   ```

5. **Start development server**
   ```bash
   cd frontend
   pnpm start
   ```

   The application will be available at `http://localhost:3000`

### Development Commands

- **Start development server**: `pnpm start`
- **Build for production**: `pnpm build`
- **Type checking**: `pnpm typescript-check`
- **Lint code**: `pnpm lint`
- **Format code**: `pnpm format`

## Deployment

### Local Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   pnpm build
   ```

2. **Deploy to local replica**
   ```bash
   dfx deploy
   ```

### Production Deployment (Internet Computer Mainnet)

1. **Set up wallet and identity**
   ```bash
   dfx identity new production
   dfx identity use production
   ```

2. **Add cycles to your wallet**
   Follow the instructions at: https://internetcomputer.org/docs/current/developer-docs/setup/cycles/

3. **Deploy to mainnet**
   ```bash
   dfx deploy --network ic
   ```

4. **Verify deployment**
   ```bash
   dfx canister --network ic id frontend
   dfx canister --network ic id backend
   ```

### Environment Configuration

Create a `.env` file in the frontend directory:

