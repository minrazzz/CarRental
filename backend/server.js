import dotenv from 'dotenv'

import { app } from './src/app'
import { dbConnect } from './src/utils/db-connect'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  //initialize dotenv to read environment variables
  dotenv.config()
  dbConnect()
  console.log(`Server is running on port ${PORT}`)
})
