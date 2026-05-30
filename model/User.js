const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"]
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a validate email"]
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: 8,
    select: false 
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      //this validate just work in create and save 
      validator: function(el) {
        return el === this.password;
      },
      message: "password snd password confirm are not the same"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  // --- E-commerce Fields ---
  // orders: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Order',
  //   },
  // ],
  // wishlists: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'WishList',
  //   },
  // ],
  hasShippingAddress: {
    type: Boolean,
    default: false,
  },
  shippingAddress: {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    province: { type: String },
    country: { type: String },
    phone: { type: String },
  }
}, {
  timestamps: true 
});

// Document middleware

// userSchema.pre('save', async function(next) {
 
//   if (!this.isModified('password')) return next();


//   this.password = await bcrypt.hash(this.password, 12);


//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();


//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });


// for new mongoose version
userSchema.pre('save', async function() {
  // check if password was modified
  if (this.isModified('password')) {

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }
  }

 
});


// query middleware
userSchema.pre(/^find/, function(next) {
  // dont show active:false ---- soft delete
  this.find({ active: { $ne: false } });
  next();
});

// Instance methods 

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire after 10 minute

  return resetToken; // sending row token to user
};

const User = mongoose.model('User', userSchema);

module.exports = User;

