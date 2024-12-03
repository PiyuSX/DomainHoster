# TechSphere - Web Development Agency Website

## Storage Solution

The application currently uses **Browser's Local Storage** as its data storage solution. This is a simple, client-side storage that:

- Persists data in the browser
- Has a storage limit of about 5-10 MB (varies by browser)
- Is synchronous and easy to use
- Works offline
- Data persists until explicitly cleared

### Current Implementation

The storage is implemented in `src/services/DatabaseService.ts` and handles:
- Blog posts
- Portfolio items
- Admin authentication state

### Use Cases

The current localStorage solution is suitable for:
- Demo purposes
- Small applications
- Prototypes
- Offline-first applications

### Limitations

Local Storage has some limitations:
- Client-side only (data doesn't sync between devices)
- Limited storage capacity
- No query capabilities
- No built-in data validation
- Data is not secure (stored as plain text)

### Future Improvements

For a production environment, consider migrating to:

1. **Backend Database**
   - PostgreSQL for relational data
   - MongoDB for document-based data
   - Firebase for a full backend solution

2. **API Integration**
   - REST API with Express.js
   - GraphQL with Apollo
   - Next.js API routes

3. **Authentication**
   - JWT with proper backend validation
   - OAuth integration
   - Auth0 or similar service

### Current Data Structure

The application stores data in the following format:

```typescript
// Blog Posts
interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  image: string
}

// Portfolio Items
interface PortfolioItem {
  id: number
  title: string
  description: string
  category: string
  image: string
  link: string
  github?: string
}
```

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the admin panel:
   - URL: `/admin/login`
   - Username: piyush
   - Password: piyush7788@

### Technology Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons

## Deployment Guide

### Frontend Deployment (Vercel)

1. **Prerequisites**
   - A [Vercel](https://vercel.com) account
   - Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

2. **Deploy from Git**
   - Log in to your Vercel account
   - Click "New Project"
   - Import your Git repository
   - Select "Vite" as the framework preset
   - Configure project:
     ```
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Environment Variables**
   - In Vercel project settings, add these variables:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```

4. **Deployment Settings**
   - In your project's `vercel.json`:
     ```json
     {
       "buildCommand": "npm run build",
       "outputDirectory": "dist",
       "framework": "vite",
       "rewrites": [
         {
           "source": "/api/:path*",
           "destination": "https://your-backend-url.com/api/:path*"
         }
       ]
     }
     ```

### Backend Deployment (Vercel)

1. **Prepare Backend**
   - Create a new directory for backend: `backend`
   - Move server files there
   - Create `vercel.json` in backend directory:
     ```json
     {
       "version": 2,
       "builds": [
         {
           "src": "server.js",
           "use": "@vercel/node"
         }
       ],
       "routes": [
         {
           "src": "/(.*)",
           "dest": "server.js"
         }
       ]
     }
     ```

2. **Environment Variables**
   - Add these in Vercel project settings:
     ```
     MONGODB_URI=your-mongodb-connection-string
     EMAIL_USER=your-email
     EMAIL_PASSWORD=your-email-password
     ```

3. **Deploy Backend**
   - Navigate to backend directory
   - Run `vercel` command if you have Vercel CLI, or
   - Create new Vercel project and import backend repository

### Post-Deployment

1. **Connect Frontend to Backend**
   - Update frontend's `VITE_API_URL` to point to deployed backend URL
   - Redeploy frontend if needed

2. **Verify Deployment**
   - Test all API endpoints
   - Check admin login functionality
   - Verify email sending works
   - Test database operations

### Troubleshooting

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are installed
   - Check environment variables are set
   - Ensure build command is correct

2. **Runtime Errors**
   - Check browser console for frontend errors
   - Review Vercel function logs for backend errors
   - Verify MongoDB connection string is correct
   - Check API endpoints are properly configured

3. **Common Issues**
   - CORS errors: Update backend CORS configuration
   - 404 errors: Check vercel.json routing
   - Environment variables: Verify they're set and accessible
   - Database connection: Check MongoDB network access settings

### Maintenance

1. **Updates**
   - Use Vercel dashboard to monitor deployments
   - Set up automatic deployments from main branch
   - Keep dependencies updated
   - Monitor usage and performance

2. **Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor API response times
   - Check database performance
   - Set up uptime monitoring

For more detailed information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)