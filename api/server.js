require("dotenv").config()
const path = require("path")
const express = require("express")
const colors = require("colors")
const {connectDB} = require("./config/db.js")
const cors = require('cors'); 

const usersRoutes = require("./routes/users/users")
const {errorHandler} = require("./middelware/errorHandler")
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
connectDB()
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users",usersRoutes)


if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/build")))
    app.get("*",(_req,res)=>{
        res.sendFile(path.resolve(__dirname,"../","frontend","build","index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("Please set a production mode")
    })
}

app.use(errorHandler)
app.listen(PORT,()=>{console.log(`Started on Port : ${PORT}`)})