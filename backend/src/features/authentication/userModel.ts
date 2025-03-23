import { Schema, model, InferSchemaType, Types } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name field is required.'],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Email must be a valid email address.'],
    },
    emailVerificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedDate: Date,
    password: {
      type: String,
      required: [true, 'Password field is required.'],
      trim: true,
      select: false,
      minlength: [5, 'Password must be at least 5 characters.'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirmed password field is required.'],
      trim: true,
      validate: {
        validator: function (savedPassword) {
          return this.password === savedPassword;
        },
        message: 'Password and confirm  password must match.',
      },
    },
    passwordResetToken: String,
    passwordTokenExpiresAt: Date,
    passwordChangedAt: Date,
    photo: String,
    photoPublicId: String,
    creditLimit: Number,
    creditDays: Number,
    role: {
      type: String,
      enum: {
        values: ['user', 'super-admin', 'admin', 'wholesaler'],
        message: '{VALUE} is not valid.',
      },
      default: 'user',
    },
    address: String,
    phone: String,
    state: String,
    country: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual('token', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'Token',
});

// Hash the password before saving it to database and set confirmed password to empty string.
userSchema.pre('save', async function () {
  // If password is not modified, return
  if (!this.isModified('password')) return;
  // Otherwise, hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // set confirmed password to empty string.
  this.confirmPassword = '';
});

userSchema.methods.isPasswordCorrect = async function (
  userPassword: string,
  savedPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, savedPassword);
};

userSchema.methods.detectPasswordChange = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );

    return changedTimestamp > JWTTimeStamp;
  }
  return false;
};

userSchema.virtual('access', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'AccessDb',
});

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  isPasswordCorrect: (
    userPassword: string,
    savedPassword: string
  ) => Promise<boolean>;
  detectPasswordChange: (JWTTimeStamp: number) => boolean;
};

export type UserTypes = InferSchemaType<typeof userSchema>;

export default model<IUser>('User', userSchema);
