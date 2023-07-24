import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
      dbName: 'car-rental'
    })
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.log(error.message)
  }
}
