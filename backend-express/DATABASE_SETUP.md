# MedLink Database Setup Guide

## 🚀 Quick Start

### Prerequisites
- MongoDB installed and running
- Node.js and npm installed
- Backend dependencies installed

### 1. Database Connection Setup

Ensure your `.env` file contains the correct MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/medlink
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medlink
```

### 2. Initialize Database

Run the database initialization script:

```bash
cd backend-express
npm run db:init
```

This will:
- Create all required collections
- Set up indexes for optimal performance
- Create default hospital records
- Create superadmin user

### 3. Seed Database (Optional)

To populate with sample data:

```bash
npm run db:seed
```

## 📊 Database Collections

### Required Collections

1. **users** - User accounts and authentication
2. **patients** - Patient medical profiles
3. **hospitals** - Hospital information
4. **medicalrecords** - Medical records and documents
5. **prescriptions** - Medication prescriptions
6. **fileassets** - Uploaded files and documents
7. **auditlogs** - System audit trail

### Collection Creation Script

```javascript
// Create collections with proper validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password", "role"],
      properties: {
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        role: {
          enum: ["superadmin", "admin", "doctor", "user", "emergency_access"]
        }
      }
    }
  }
});

db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "hospital", "mrn"],
      properties: {
        user: {
          bsonType: "objectId"
        },
        hospital: {
          bsonType: "objectId"
        },
        mrn: {
          bsonType: "string",
          maxLength: 50
        }
      }
    }
  }
});
```

## 🔍 Indexes Setup

### Performance Indexes

```javascript
// Users collection indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "hospital": 1 });
db.users.createIndex({ "status": 1 });

// Patients collection indexes
db.patients.createIndex({ "user": 1 }, { unique: true });
db.patients.createIndex({ "hospital": 1 });
db.patients.createIndex({ "mrn": 1 }, { unique: true });

// Medical records indexes
db.medicalrecords.createIndex({ "patient": 1 });
db.medicalrecords.createIndex({ "hospital": 1 });
db.medicalrecords.createIndex({ "doctor": 1 });
db.medicalrecords.createIndex({ "recordType": 1 });
db.medicalrecords.createIndex({ "status": 1 });
db.medicalrecords.createIndex({ "recordDate": 1 });

// Prescriptions indexes
db.prescriptions.createIndex({ "patient": 1 });
db.prescriptions.createIndex({ "doctor": 1 });
db.prescriptions.createIndex({ "hospital": 1 });
db.prescriptions.createIndex({ "status": 1 });
db.prescriptions.createIndex({ "prescribedDate": 1 });

// File assets indexes
db.fileassets.createIndex({ "patient": 1 });
db.fileassets.createIndex({ "hospital": 1 });
db.fileassets.createIndex({ "uploadedBy": 1 });
db.fileassets.createIndex({ "fileType": 1 });
db.fileassets.createIndex({ "uploadedAt": 1 });

// Audit logs indexes
db.auditlogs.createIndex({ "user": 1 });
db.auditlogs.createIndex({ "action": 1 });
db.auditlogs.createIndex({ "objectType": 1 });
db.auditlogs.createIndex({ "objectId": 1 });
db.auditlogs.createIndex({ "timestamp": 1 });
```

## 🏥 Default Data Setup

### Create Default Hospital

```javascript
db.hospitals.insertOne({
  name: "MedLink General Hospital",
  location: "Main City, State",
  contactPhone: "+1-555-0123",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Create Superadmin User

```javascript
// Password will be hashed by the application
db.users.insertOne({
  username: "superadmin",
  password: "$2a$12$hashedpassword", // Will be hashed by bcrypt
  role: "superadmin",
  firstName: "Super",
  lastName: "Admin",
  status: "Active",
  mustChangePassword: false,
  isPhoneVerified: false,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 🔧 Database Scripts

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:init": "node scripts/initDatabase.js",
    "db:seed": "node scripts/seedDatabase.js",
    "db:reset": "node scripts/resetDatabase.js",
    "db:backup": "node scripts/backupDatabase.js"
  }
}
```

### Database Initialization Script

Create `scripts/initDatabase.js`:

```javascript
const mongoose = require('mongoose');
const { User, Hospital, Patient, MedicalRecord, Prescription, FileAsset, AuditLog } = require('../src/models');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create default hospital
    const defaultHospital = await Hospital.findOneAndUpdate(
      { name: 'MedLink General Hospital' },
      {
        name: 'MedLink General Hospital',
        location: 'Main City, State',
        contactPhone: '+1-555-0123'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Default hospital created/updated');

    // Create superadmin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('superadmin123', 12);
    
    const superadmin = await User.findOneAndUpdate(
      { username: 'superadmin' },
      {
        username: 'superadmin',
        password: hashedPassword,
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        status: 'Active',
        mustChangePassword: false,
        isPhoneVerified: false,
        hospital: defaultHospital._id
      },
      { upsert: true, new: true }
    );
    console.log('✅ Superadmin user created/updated');

    console.log('✅ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
```

## 📈 Performance Optimization

### Connection Pool Settings

```javascript
// In your database connection
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
});
```

### Query Optimization

```javascript
// Use projection to limit fields
const user = await User.findById(userId).select('username role firstName lastName');

// Use lean() for read-only queries
const patients = await Patient.find({ hospital: hospitalId }).lean();

// Use pagination for large datasets
const records = await MedicalRecord.find({ patient: patientId })
  .sort({ recordDate: -1 })
  .limit(20)
  .skip(page * 20);
```

## 🔒 Security Configuration

### Database Access Control

```javascript
// Create database user with limited permissions
db.createUser({
  user: "medlink_app",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "medlink" }
  ]
});
```

### Network Security

```javascript
// Bind to localhost only in development
mongod --bind_ip 127.0.0.1

// Use SSL in production
mongod --sslMode requireSSL --sslPEMKeyFile /path/to/cert.pem
```

## 📊 Monitoring and Maintenance

### Health Check Query

```javascript
// Check database health
db.runCommand({ ping: 1 });

// Check collection statistics
db.patients.stats();

// Check index usage
db.patients.getIndexes();
```

### Backup Strategy

```bash
# Create backup
mongodump --db medlink --out ./backups/$(date +%Y%m%d)

# Restore backup
mongorestore --db medlink ./backups/20250101/medlink/
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password
   - Check database permissions
   - Ensure correct database name

3. **Index Creation Failed**
   - Check for duplicate keys
   - Verify index syntax
   - Ensure sufficient disk space

### Debug Commands

```javascript
// Check current connections
db.currentOp()

// Check slow queries
db.getProfilingStatus()

// Check database size
db.stats()
```

## 📝 Environment Variables

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/medlink

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=5001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## ✅ Verification Checklist

- [ ] MongoDB installed and running
- [ ] Database connection successful
- [ ] All collections created
- [ ] Indexes created successfully
- [ ] Default hospital created
- [ ] Superadmin user created
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Frontend connecting to backend
- [ ] File uploads working
- [ ] Authentication working
- [ ] Patient data accessible

## 🎯 Next Steps

After database setup:

1. **Test API Endpoints**: Verify all endpoints are working
2. **Frontend Integration**: Test frontend-backend communication
3. **Data Migration**: Import existing data if applicable
4. **Performance Testing**: Load test the system
5. **Security Audit**: Review access controls and permissions
6. **Backup Setup**: Configure automated backups
7. **Monitoring**: Set up database monitoring and alerts
