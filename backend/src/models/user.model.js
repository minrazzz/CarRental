import { compare, hash } from 'bcryptjs'
import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    index: { unique: true, sparse: true }
  },
  phoneNumber: String,
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String
  },
  redeemPoints: {
    type: Number,
    default: 0
  }
})
// This is a pre-save hook that hashes the password before saving it to the database.
userSchema.pre('save', async function (next) {
  // hash the password only if it has been modified (or is new)
  if (this.isModified('password')) {
    const hashedPassword = await hash(this.password, 12)
    this.password = hashedPassword
  }
  next()
})
// compared the raw password with the hashed password in the database.
userSchema.methods.isValidPassword = async function (password) {
  return compare(password, this.password)
}
export const UserModel = model('User', userSchema)
