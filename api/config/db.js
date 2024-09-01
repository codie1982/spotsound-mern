
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.DB_SPOTSOUND})
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
const connectSessionDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.DB_SESSION})  
    console.log(`MongoDB Session Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = {connectDB,connectSessionDB}