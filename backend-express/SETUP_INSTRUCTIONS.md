# MERN Sign-Up Backend Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install required packages
npm install express mongoose bcrypt cors dotenv

# Install development dependencies
npm install --save-dev nodemon
```

### 2. Environment Configuration

Create a `.env` file in the `backend-express` directory:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important:** Replace the MongoDB URI with your actual Atlas connection string.

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 4. Test the API

The server will start on `http://localhost:5000`

**Available Endpoints:**
- `GET /` - API information
- `POST /api/auth/signup` - User registration
- `GET /api/auth/health` - Health check
- `GET /api/health` - Server health check

## 📁 File Structure

```
backend-express/
├── database.js              # MongoDB connection
├── models/
│   └── User.js             # User model with validation
├── routes/
│   └── auth.js             # Authentication routes
├── server.js               # Express server setup
├── .env                    # Environment variables
├── REACT_SIGNUP_EXAMPLE.jsx # React integration example
└── SETUP_INSTRUCTIONS.md   # This file
```

## 🔧 Configuration Details

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Update the `MONGO_URI` in your `.env` file

### CORS Configuration

The server is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:5173` (Vite development server)

## 🧪 Testing the Signup Endpoint

### Using curl:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "nid": "1234567890"
  }'
```

### Using Postman:

1. Method: POST
2. URL: `http://localhost:5000/api/auth/signup`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "nid": "1234567890"
}
```

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- Duplicate email/NID prevention
- CORS protection
- Error handling without sensitive data exposure

## 📝 Logging

The backend includes comprehensive logging:
- Database connection status
- Request/response details
- Password hashing operations
- Error tracking
- User creation confirmations

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check your `MONGO_URI` in `.env`
   - Verify Atlas cluster is running
   - Check IP whitelist settings

2. **CORS Errors**
   - Ensure frontend URL is in CORS origins
   - Check if frontend is running on correct port

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill existing process: `lsof -ti:5000 | xargs kill`

4. **Validation Errors**
   - Check required fields are provided
   - Verify email format
   - Ensure password is at least 6 characters
   - Check NID length (10-20 characters)

## 🔄 Integration with React

See `REACT_SIGNUP_EXAMPLE.jsx` for a complete React component that integrates with this backend.

## 📊 Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up proper logging
4. Configure HTTPS
5. Use environment-specific MongoDB URIs
6. Set up monitoring and error tracking

## 🆘 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all dependencies are installed
3. Ensure MongoDB Atlas is accessible
4. Check network connectivity
