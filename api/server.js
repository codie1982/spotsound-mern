require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const colors = require("colors")
const { connectDB } = require("./config/db.js")
const cors = require('cors');

const usersRoutes = require("./routes/userRoutes.js")
const connectionRoutes = require("./routes/connectionRoutes.js")

const { errorHandler } = require("./middelware/errorHandler")
const nodemailer = require('nodemailer');


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
    dbName: process.env.DB_SPOTSOUND,
    collectionName: process.env.SESSION_COLLECTION,  // Oturum verilerinin saklanacağı koleksiyon adı
    ttl: 14 * 24 * 60 * 60  // Oturumun sona erme süresi (14 gün)
  }),
  cookie: {
    secure: process.env.NODE_ENV === "development" ? false : true, // true ise sadece HTTPS üzerinden gönderilir; geliştirme ortamında false olabilir
    maxAge: 14 * 24 * 60 * 60 * 1000  // Çerez süresi (milisaniye cinsinden)
  }
}));
app.use("/api/users", usersRoutes)
app.use("/api/connection", connectionRoutes)
app.post("/testmail", (req, res) => {
  // SMTP taşıyıcısını yapılandırma
  let transporter = nodemailer.createTransport({
    host: 'mail.kurumsaleposta.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'info@spotsoundmusic.com', // Kullanıcı adı
      pass: 'S2=:2qY15j:OD:qv', // Şifreniz
    },
    tls: {
      // Güvenli olmayan yeniden müzakereye izin verir, ancak güvenli değil
      rejectUnauthorized: false,
    }
  });
  // Test mail gönderimi
  transporter.sendMail({
    from: 'info@spotsoundmusic.com', // Gönderici
    to: 'granitjeofizik@gmail.com', // Alıcı
    subject: 'Test',
    text: 'Bu bir test mailidir.'
  }, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Mesaj gönderildi: %s', info.messageId);
    console.log("info : ",info)
  });
  res.send("Welcome the spotsound")
})
app.get("/test", (req, res) => {
  res.send("Welcome the spotsound")
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "frontend", "build", "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.send("Please set a production mode")
  })
}

app.use(errorHandler)
app.listen(PORT, () => { console.log(`Started on Port : ${PORT}`) })