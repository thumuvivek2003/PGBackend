#!/usr/bin/env python3
"""
Backend Structure Generator for PG/Hostel Management System
Generates complete folder structure and boilerplate files based on architecture
"""

import os
import sys

def create_directory(path):
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"✓ Created directory: {path}")
    else:
        print(f"⚠ Directory already exists: {path}")

def create_file(path, content):
    """Create file with content"""
    if os.path.exists(path):
        print(f"⚠ File already exists (skipping): {path}")
        return
    
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created file: {path}")

def generate_structure():
    """Generate complete backend structure"""
    
    print("\n🚀 Starting Backend Structure Generation...\n")
    
    # Define directory structure
    directories = [
        'src',
        'src/config',
        'src/controllers',
        'src/middlewares',
        'src/models',
        'src/routes',
        'src/services',
        'src/repositories',
        'src/utils',
        'src/validations',
        'src/tests',
    ]
    
    # Create directories
    print("📁 Creating Directories...")
    for directory in directories:
        create_directory(directory)
    
    print("\n📄 Creating Configuration Files...\n")
    
    # .env.example
    create_file('.env.example', """PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pg_management
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=redis://localhost:6379
""")
    
    # .gitignore
    create_file('.gitignore', """# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/
""")
    
    # package.json
    create_file('package.json', """{
  "name": "pg-hostel-management-backend",
  "version": "1.0.0",
  "description": "Backend API for PG/Hostel Management System",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --watchAll --verbose",
    "test:ci": "jest --ci"
  },
  "keywords": ["pg-management", "hostel", "node", "express", "mongodb"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
""")
    
    # README.md
    create_file('README.md', """# PG/Hostel Management System - Backend

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Bcrypt
- **Validation**: Joi

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   Update the values in `.env` file.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Tenants
- `GET /api/tenants` - Get all tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:id` - Get tenant by ID
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Create fee record
- `PUT /api/fees/:id` - Update fee record

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `DELETE /api/bills/:id` - Delete bill

## Project Structure

```
src/
 ├── config/         # Configuration files
 ├── controllers/    # Route handlers
 ├── middlewares/    # Custom middlewares
 ├── models/         # Mongoose models
 ├── routes/         # Route definitions
 ├── services/       # Business logic
 ├── repositories/   # Database operations
 ├── utils/          # Helper functions
 ├── validations/    # Validation schemas
 ├── app.js          # Express app setup
 └── server.js       # Entry point
```
""")
    
    print("\n📦 Creating Config Files...\n")
    
    # src/config/database.js
    create_file('src/config/database.js', """const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
""")
    
    # src/config/logger.js
    create_file('src/config/logger.js', """const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
""")
    
    # src/config/cloudinary.js
    create_file('src/config/cloudinary.js', """const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
""")
    
    print("\n🎨 Creating Models...\n")
    
    # src/models/User.js
    create_file('src/models/User.js', """const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['owner', 'manager'],
    default: 'owner'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = mongoose.model('User', userSchema);
""")
    
    # src/models/Room.js
    create_file('src/models/Room.js', """const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_no: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  rent: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  occupied_count: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['vacant', 'occupied'],
    default: 'vacant'
  },
  type: {
    type: String,
    enum: ['single', 'double', 'triple'],
    required: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
roomSchema.index({ room_no: 1 });
roomSchema.index({ status: 1 });

// Update status based on occupied_count
roomSchema.pre('save', function(next) {
  this.status = this.occupied_count >= this.capacity ? 'occupied' : 'vacant';
  next();
});

module.exports = mongoose.model('Room', roomSchema);
""")
    
    # src/models/Tenant.js
    create_file('src/models/Tenant.js', """const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please provide a valid email']
  },
  address: {
    type: String,
    trim: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  join_date: {
    type: Date,
    required: [true, 'Join date is required'],
    default: Date.now
  },
  leave_date: {
    type: Date
  },
  advance_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  id_docs: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'left'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
tenantSchema.index({ room_id: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ phone: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
""")
    
    # src/models/Fee.js
    create_file('src/models/Fee.js', """const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\\d{4}-\\d{2}$/, 'Month format should be YYYY-MM']
  },
  rent_amount: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: 0
  },
  paid_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  due_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'pending'
  },
  payment_date: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate due_amount and status before saving
feeSchema.pre('save', function(next) {
  this.due_amount = this.rent_amount - this.paid_amount;
  
  if (this.paid_amount === 0) {
    this.status = 'pending';
  } else if (this.paid_amount >= this.rent_amount) {
    this.status = 'paid';
  } else {
    this.status = 'partial';
  }
  
  next();
});

// Indexes
feeSchema.index({ tenant_id: 1, month: 1 }, { unique: true });
feeSchema.index({ month: 1 });
feeSchema.index({ status: 1 });

module.exports = mongoose.model('Fee', feeSchema);
""")
    
    # src/models/Bill.js
    create_file('src/models/Bill.js', """const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['electricity', 'water', 'maintenance'],
    required: [true, 'Bill type is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\\d{4}-\\d{2}$/, 'Month format should be YYYY-MM']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  shared_between: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
billSchema.index({ month: 1, type: 1 });

module.exports = mongoose.model('Bill', billSchema);
""")
    
    print("\n🛡️ Creating Middlewares...\n")
    
    # src/middlewares/auth.js
    create_file('src/middlewares/auth.js', """const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('./errorHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
""")
    
    # src/middlewares/errorHandler.js
    create_file('src/middlewares/errorHandler.js', """const logger = require('../config/logger');

// Async handler to wrap async route handlers
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Global error handler
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 handler
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};
""")
    
    # src/middlewares/validator.js
    create_file('src/middlewares/validator.js', """exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};
""")
    
    print("\n✅ Creating Validations...\n")
    
    # src/validations/authValidation.js
    create_file('src/validations/authValidation.js', """const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  }),
  email: Joi.string().email().required().trim().lowercase().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email'
  }),
  phone: Joi.string().required().trim().messages({
    'any.required': 'Phone number is required'
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long'
  }),
  role: Joi.string().valid('owner', 'manager').default('owner')
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});
""")
    
    # src/validations/roomValidation.js
    create_file('src/validations/roomValidation.js', """const Joi = require('joi');

exports.createRoomSchema = Joi.object({
  room_no: Joi.string().required().trim().messages({
    'any.required': 'Room number is required'
  }),
  rent: Joi.number().min(0).required().messages({
    'any.required': 'Rent amount is required',
    'number.min': 'Rent cannot be negative'
  }),
  capacity: Joi.number().min(1).required().messages({
    'any.required': 'Capacity is required',
    'number.min': 'Capacity must be at least 1'
  }),
  type: Joi.string().valid('single', 'double', 'triple').required().messages({
    'any.required': 'Room type is required'
  }),
  remarks: Joi.string().trim().allow('')
});

exports.updateRoomSchema = Joi.object({
  room_no: Joi.string().trim(),
  rent: Joi.number().min(0),
  capacity: Joi.number().min(1),
  occupied_count: Joi.number().min(0),
  type: Joi.string().valid('single', 'double', 'triple'),
  remarks: Joi.string().trim().allow('')
});
""")
    
    # src/validations/tenantValidation.js
    create_file('src/validations/tenantValidation.js', """const Joi = require('joi');

exports.createTenantSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'any.required': 'Tenant name is required'
  }),
  phone: Joi.string().required().trim().messages({
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().trim().lowercase().allow(''),
  address: Joi.string().trim().allow(''),
  room_id: Joi.string().required().messages({
    'any.required': 'Room ID is required'
  }),
  join_date: Joi.date().default(Date.now),
  advance_amount: Joi.number().min(0).default(0),
  id_docs: Joi.array().items(Joi.string())
});

exports.updateTenantSchema = Joi.object({
  name: Joi.string().trim(),
  phone: Joi.string().trim(),
  email: Joi.string().email().trim().lowercase().allow(''),
  address: Joi.string().trim().allow(''),
  room_id: Joi.string(),
  leave_date: Joi.date(),
  advance_amount: Joi.number().min(0),
  status: Joi.string().valid('active', 'left')
});
""")
    
    # src/validations/feeValidation.js
    create_file('src/validations/feeValidation.js', """const Joi = require('joi');

exports.createFeeSchema = Joi.object({
  tenant_id: Joi.string().required().messages({
    'any.required': 'Tenant ID is required'
  }),
  month: Joi.string().pattern(/^\\d{4}-\\d{2}$/).required().messages({
    'any.required': 'Month is required',
    'string.pattern.base': 'Month format should be YYYY-MM'
  }),
  rent_amount: Joi.number().min(0).required().messages({
    'any.required': 'Rent amount is required'
  }),
  paid_amount: Joi.number().min(0).default(0),
  payment_date: Joi.date()
});

exports.updateFeeSchema = Joi.object({
  paid_amount: Joi.number().min(0),
  payment_date: Joi.date()
});
""")
    
    # src/validations/billValidation.js
    create_file('src/validations/billValidation.js', """const Joi = require('joi');

exports.createBillSchema = Joi.object({
  type: Joi.string().valid('electricity', 'water', 'maintenance').required().messages({
    'any.required': 'Bill type is required'
  }),
  month: Joi.string().pattern(/^\\d{4}-\\d{2}$/).required().messages({
    'any.required': 'Month is required',
    'string.pattern.base': 'Month format should be YYYY-MM'
  }),
  amount: Joi.number().min(0).required().messages({
    'any.required': 'Amount is required'
  }),
  shared_between: Joi.array().items(Joi.string()),
  remarks: Joi.string().trim().allow('')
});
""")
    
    print("\n🎮 Creating Controllers...\n")
    
    # src/controllers/authController.js
    create_file('src/controllers/authController.js', """const User = require('../models/User');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role
  });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
""")
    
    # src/controllers/roomController.js
    create_file('src/controllers/roomController.js', """const Room = require('../models/Room');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
exports.getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().lean();

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Create room
// @route   POST /api/rooms
// @access  Private
exports.createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: room
  });
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
exports.updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Room updated successfully',
    data: room
  });
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
exports.deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  await room.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Room deleted successfully',
    data: {}
  });
});
""")
    
    # src/controllers/tenantController.js
    create_file('src/controllers/tenantController.js', """const Tenant = require('../models/Tenant');
const Room = require('../models/Room');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
exports.getTenants = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().populate('room_id', 'room_no type').lean();

  res.status(200).json({
    success: true,
    count: tenants.length,
    data: tenants
  });
});

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private
exports.getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id).populate('room_id');

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  res.status(200).json({
    success: true,
    data: tenant
  });
});

// @desc    Create tenant
// @route   POST /api/tenants
// @access  Private
exports.createTenant = asyncHandler(async (req, res) => {
  const { room_id } = req.body;

  // Check if room exists
  const room = await Room.findById(room_id);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  // Check if room has capacity
  if (room.occupied_count >= room.capacity) {
    return res.status(400).json({
      success: false,
      message: 'Room is full'
    });
  }

  const tenant = await Tenant.create(req.body);

  // Update room occupied count
  room.occupied_count += 1;
  await room.save();

  res.status(201).json({
    success: true,
    message: 'Tenant created successfully',
    data: tenant
  });
});

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private
exports.updateTenant = asyncHandler(async (req, res) => {
  let tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  // If changing room
  if (req.body.room_id && req.body.room_id !== tenant.room_id.toString()) {
    const oldRoom = await Room.findById(tenant.room_id);
    const newRoom = await Room.findById(req.body.room_id);

    if (!newRoom) {
      return res.status(404).json({
        success: false,
        message: 'New room not found'
      });
    }

    if (newRoom.occupied_count >= newRoom.capacity) {
      return res.status(400).json({
        success: false,
        message: 'New room is full'
      });
    }

    // Update room counts
    if (oldRoom) {
      oldRoom.occupied_count -= 1;
      await oldRoom.save();
    }
    newRoom.occupied_count += 1;
    await newRoom.save();
  }

  // If tenant is leaving
  if (req.body.status === 'left' && tenant.status === 'active') {
    const room = await Room.findById(tenant.room_id);
    if (room) {
      room.occupied_count -= 1;
      await room.save();
    }
    req.body.leave_date = req.body.leave_date || new Date();
  }

  tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Tenant updated successfully',
    data: tenant
  });
});

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private
exports.deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  // Update room occupied count if tenant is active
  if (tenant.status === 'active') {
    const room = await Room.findById(tenant.room_id);
    if (room) {
      room.occupied_count -= 1;
      await room.save();
    }
  }

  await tenant.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tenant deleted successfully',
    data: {}
  });
});
""")
    
    # src/controllers/feeController.js
    create_file('src/controllers/feeController.js', """const Fee = require('../models/Fee');
const Tenant = require('../models/Tenant');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private
exports.getFees = asyncHandler(async (req, res) => {
  const { month, status, tenant_id } = req.query;
  
  let query = {};
  if (month) query.month = month;
  if (status) query.status = status;
  if (tenant_id) query.tenant_id = tenant_id;

  const fees = await Fee.find(query)
    .populate('tenant_id', 'name phone room_id')
    .populate({
      path: 'tenant_id',
      populate: {
        path: 'room_id',
        select: 'room_no'
      }
    })
    .lean();

  res.status(200).json({
    success: true,
    count: fees.length,
    data: fees
  });
});

// @desc    Get single fee
// @route   GET /api/fees/:id
// @access  Private
exports.getFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id)
    .populate('tenant_id', 'name phone room_id');

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: 'Fee record not found'
    });
  }

  res.status(200).json({
    success: true,
    data: fee
  });
});

// @desc    Create fee
// @route   POST /api/fees
// @access  Private
exports.createFee = asyncHandler(async (req, res) => {
  const { tenant_id } = req.body;

  // Check if tenant exists
  const tenant = await Tenant.findById(tenant_id);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  const fee = await Fee.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Fee record created successfully',
    data: fee
  });
});

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private
exports.updateFee = asyncHandler(async (req, res) => {
  let fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: 'Fee record not found'
    });
  }

  fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Fee record updated successfully',
    data: fee
  });
});

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private
exports.deleteFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: 'Fee record not found'
    });
  }

  await fee.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Fee record deleted successfully',
    data: {}
  });
});
""")
    
    # src/controllers/billController.js
    create_file('src/controllers/billController.js', """const Bill = require('../models/Bill');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
exports.getBills = asyncHandler(async (req, res) => {
  const { month, type } = req.query;
  
  let query = {};
  if (month) query.month = month;
  if (type) query.type = type;

  const bills = await Bill.find(query)
    .populate('shared_between', 'room_no')
    .lean();

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills
  });
});

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
exports.getBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id)
    .populate('shared_between', 'room_no');

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found'
    });
  }

  res.status(200).json({
    success: true,
    data: bill
  });
});

// @desc    Create bill
// @route   POST /api/bills
// @access  Private
exports.createBill = asyncHandler(async (req, res) => {
  const bill = await Bill.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Bill created successfully',
    data: bill
  });
});

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
exports.updateBill = asyncHandler(async (req, res) => {
  let bill = await Bill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found'
    });
  }

  bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Bill updated successfully',
    data: bill
  });
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
exports.deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found'
    });
  }

  await bill.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Bill deleted successfully',
    data: {}
  });
});
""")
    
    print("\n🛣️ Creating Routes...\n")
    
    # src/routes/authRoutes.js
    create_file('src/routes/authRoutes.js', """const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { registerSchema, loginSchema } = require('../validations/authValidation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
""")
    
    # src/routes/roomRoutes.js
    create_file('src/routes/roomRoutes.js', """const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createRoomSchema, updateRoomSchema } = require('../validations/roomValidation');

router.use(protect);

router.route('/')
  .get(getRooms)
  .post(validate(createRoomSchema), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(validate(updateRoomSchema), updateRoom)
  .delete(deleteRoom);

module.exports = router;
""")
    
    # src/routes/tenantRoutes.js
    create_file('src/routes/tenantRoutes.js', """const express = require('express');
const router = express.Router();
const {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createTenantSchema, updateTenantSchema } = require('../validations/tenantValidation');

router.use(protect);

router.route('/')
  .get(getTenants)
  .post(validate(createTenantSchema), createTenant);

router.route('/:id')
  .get(getTenant)
  .put(validate(updateTenantSchema), updateTenant)
  .delete(deleteTenant);

module.exports = router;
""")
    
    # src/routes/feeRoutes.js
    create_file('src/routes/feeRoutes.js', """const express = require('express');
const router = express.Router();
const {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee
} = require('../controllers/feeController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createFeeSchema, updateFeeSchema } = require('../validations/feeValidation');

router.use(protect);

router.route('/')
  .get(getFees)
  .post(validate(createFeeSchema), createFee);

router.route('/:id')
  .get(getFee)
  .put(validate(updateFeeSchema), updateFee)
  .delete(deleteFee);

module.exports = router;
""")
    
    # src/routes/billRoutes.js
    create_file('src/routes/billRoutes.js', """const express = require('express');
const router = express.Router();
const {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
} = require('../controllers/billController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createBillSchema } = require('../validations/billValidation');

router.use(protect);

router.route('/')
  .get(getBills)
  .post(validate(createBillSchema), createBill);

router.route('/:id')
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;
""")
    
    print("\n🔧 Creating Utilities...\n")
    
    # src/utils/dateHelper.js
    create_file('src/utils/dateHelper.js', """/**
 * Get current month in YYYY-MM format
 */
exports.getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Get month range for filtering
 */
exports.getMonthRange = (month) => {
  const [year, monthNum] = month.split('-');
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59);
  return { startDate, endDate };
};

/**
 * Format date to readable string
 */
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

/**
 * Check if date is in past
 */
exports.isPastDate = (date) => {
  return new Date(date) < new Date();
};
""")
    
    # src/utils/calculator.js
    create_file('src/utils/calculator.js', """/**
 * Calculate total rent for a month
 */
exports.calculateMonthlyRent = (rooms) => {
  return rooms.reduce((total, room) => total + room.rent, 0);
};

/**
 * Calculate split bill amount per room
 */
exports.splitBillAmount = (totalAmount, numRooms) => {
  return Math.round((totalAmount / numRooms) * 100) / 100;
};

/**
 * Calculate due amount
 */
exports.calculateDueAmount = (rentAmount, paidAmount) => {
  return Math.max(0, rentAmount - paidAmount);
};

/**
 * Calculate occupancy rate
 */
exports.calculateOccupancyRate = (occupiedCount, totalCapacity) => {
  if (totalCapacity === 0) return 0;
  return Math.round((occupiedCount / totalCapacity) * 100);
};
""")
    
    print("\n🚀 Creating Main Application Files...\n")
    
    # src/app.js
    create_file('src/app.js', """const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./config/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const feeRoutes = require('./routes/feeRoutes');
const billRoutes = require('./routes/billRoutes');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/auth', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/bills', billRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
""")
    
    # src/server.js
    create_file('src/server.js', """require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`\\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.log('⚠️  Shutting down server due to unhandled promise rejection');
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
""")
    
    print("\n✅ Backend structure generated successfully!")
    print("\n📋 Next Steps:")
    print("1. Copy .env.example to .env and update values")
    print("2. Run: npm install")
    print("3. Run: npm run dev")
    print("4. Test API endpoints using the /health endpoint first")
    print("\n🎉 Happy coding!")

if __name__ == "__main__":
    try:
        generate_structure()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)