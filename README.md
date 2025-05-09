# Travel App Platform

A Next.js application for discovering and sharing travel experiences.

## Features

- Content feed with travel posts from users
- Merchant profiles (restaurants, hotels, attractions, shopping venues, bars/clubs)
- User accounts for sharing travel posts
- Categories for content filtering
- MongoDB-based backend with API routes
- Social features (like, bookmark, and share)

## Local Development

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```
4. Run the development server:
```bash
npm run dev
```

### Production Build

To test the production build locally:

```bash
npm run build
npm start
```

## Deployment to Vercel

### Prerequisites

- A MongoDB database (Atlas recommended)
- Cloudinary account for image hosting
- Vercel account

### Steps to Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your project in the Vercel dashboard
3. Configure environment variables in the Vercel project settings:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `NEXTAUTH_URL` (set to your deployment URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Deploy!

### Using Vercel CLI

You can also deploy directly from the command line:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel
```

## License

MIT 