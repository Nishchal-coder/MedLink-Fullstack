# Environment Setup Guide

## Frontend Environment Configuration

To fix the CORS error, you need to create a `.env` file in the `Frontned/my-app/` directory with the following content:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001

# Frontend Configuration
VITE_APP_TITLE=MedLink Healthcare
VITE_APP_VERSION=1.0.0
```

## Backend Environment Configuration

Create a `.env` file in the `backend-express/` directory with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
MONGODB_URI=mongodb+srv://username:nishchalrimal66@cluster.mongodb.net/medlink?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Steps to Fix CORS Error

1. **Create the frontend .env file** as shown above
2. **Create the backend .env file** as shown above
3. **Restart the backend server**:
   ```bash
   cd backend-express
   npm run dev
   ```
4. **Restart the frontend server**:
   ```bash
   cd Frontned/my-app
   npm run dev
   ```

## Verification

After setting up the environment files and restarting both servers:

1. Backend should be running on: `http://localhost:5001`
2. Frontend should be running on: `http://localhost:5173`
3. The CORS error should be resolved

## Troubleshooting

If you still see CORS errors:

1. **Check if both servers are running** on the correct ports
2. **Verify the .env files** are in the correct locations
3. **Clear browser cache** and refresh the page
4. **Check browser console** for any additional error messages
5. **Ensure no other processes** are using the same ports

## Port Configuration Summary

- **Backend API**: `http://localhost:5001/api`
- **Frontend**: `http://localhost:5173`
- **CORS Origins**: Allowed for localhost:3000, localhost:5173, localhost:5174
