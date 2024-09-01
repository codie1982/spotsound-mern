require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const colors = require("colors")
const {connectDB} = require("./config/db.js")
const cors = require('cors'); 

const usersRoutes = require("./routes/userRoutes.js")
const {errorHandler} = require("./middelware/errorHandler")
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
connectDB()
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware'i ayarlama
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,  // Güçlü ve gizli bir anahtar belirleyin
    resave: false,  // Oturum verisi değişmediği sürece oturumu yeniden kaydetme
    saveUninitialized: true,  // Boş oturumları kaydetme
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB bağlantı URL'si
        dbName:process.env.DB_SPOTSOUND,
        collectionName: process.env.SESSION_COLLECTION,  // Oturum verilerinin saklanacağı koleksiyon adı
        ttl: 14 * 24 * 60 * 60  // Oturumun sona erme süresi (14 gün)
    }),
    cookie: {
        secure: process.env.NODE_ENV === "development"? false : true, // true ise sadece HTTPS üzerinden gönderilir; geliştirme ortamında false olabilir
        maxAge: 14 * 24 * 60 * 60 * 1000  // Çerez süresi (milisaniye cinsinden)
    }
}));
app.use("/api/users",usersRoutes)

app.get("/",(req,res)=>{
    console.log("main Page",req.session)
    res.send("Welcome the spotsound" + req.sessionID)
})
app.get("/test",(req,res)=>{
    console.log("req.session",req.session)
    res.send("Welcome the spotsound" + req.sessionID)
})

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