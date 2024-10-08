"use strict";

require("dotenv").config();
var path = require('path');
var express = require("express");
var session = require('express-session');
var MongoStore = require('connect-mongo');
var colors = require("colors");
var _require = require("../api/config/db.js"),
  connectDB = _require.connectDB;
var usersRoutes = require("../api/routes/userRoutes.js");
var verifyRoutes = require("../api/routes/verifyRoutes.js");
var connectionRoutes = require("../api/routes/connectionRoutes.js");
var supportRoutes = require("../api/routes/supportRoutes.js");
var _require2 = require("../api/middelware/errorHandler.js"),
  errorHandler = _require2.errorHandler;
var cors = require('cors');
var _require3 = require('sitemap'),
  SitemapStream = _require3.SitemapStream,
  streamToPromise = _require3.streamToPromise;
var _require4 = require('zlib'),
  createGzip = _require4.createGzip;
var fs = require('fs');

//const App = require('../frontend/src/index.js'); // React uygulamanızı bu şekilde import edin

var bodyParser = require("body-parser");
var PORT = process.env.PORT || 3000;
connectDB();
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"](path.join(__dirname, 'public')));

// Session middleware'i ayarlama
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  // Güçlü ve gizli bir anahtar belirleyin
  resave: false,
  // Oturum verisi değişmediği sürece oturumu yeniden kaydetme
  saveUninitialized: true,
  // Boş oturumları kaydetme
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    // MongoDB bağlantı URL'si
    dbName: process.env.DB_SPOTSOUND,
    collectionName: process.env.SESSION_COLLECTION,
    // Oturum verilerinin saklanacağı koleksiyon adı
    ttl: 14 * 24 * 60 * 60 // Oturumun sona erme süresi (14 gün)
  }),
  cookie: {
    secure: process.env.NODE_ENV === "development" ? false : true,
    // true ise sadece HTTPS üzerinden gönderilir; geliştirme ortamında false olabilir
    maxAge: 14 * 24 * 60 * 60 * 1000 // Çerez süresi (milisaniye cinsinden)
  }
}));
app.use("/api/v10/user", usersRoutes);
app.use("/api/v10/verify", verifyRoutes);
app.use("/api/v10/connection", connectionRoutes);
app.use("/api/v10/support", supportRoutes);
app.get('/sitemap.xml', function (req, res) {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  var sitemap = new SitemapStream({
    hostname: 'https://www.spotsoundmusic.com'
  });
  var pipeline = sitemap.pipe(createGzip());

  // Sitemap'e eklemek istediğiniz URL'leri buraya dinamik olarak ekleyebilirsiniz
  sitemap.write({
    url: '/',
    changefreq: 'monthly',
    priority: 1.0
  });
  sitemap.write({
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8
  });
  sitemap.write({
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.5
  });

  // Eğer veritabanından dinamik içeriklerinizi çekiyorsanız, onları da sitemap'e ekleyin.
  // Örneğin:
  /*
  const pages = await getPagesFromDatabase();
  pages.forEach(page => {
    sitemap.write({ url: page.url, changefreq: 'monthly', priority: 0.7 });
  });
  */

  sitemap.end();
  streamToPromise(pipeline).then(function (sm) {
    return res.send(sm);
  })["catch"](console.error);
});
app.get('/images/cover', function (req, res) {
  var imagePath = path.join(__dirname, 'public/images', "cover.jpg");
  res.sendFile(imagePath, function (err) {
    if (err) {
      console.error('Resim gönderilirken hata oluştu:', err);
      res.status(404).send('Resim bulunamadı.');
    }
  });
});
if (process.env.NODE_ENV === "production") {
  app.use(express["static"](path.join(__dirname, "../frontend/build")));
  app.get("*", function (_req, res) {
    res.sendFile(path.resolve(__dirname, "../", "frontend", "build", "index.html"));
  });
} else {
  app.get("/", function (req, res) {
    res.send("Please set a production mode");
  });
}
app.use(errorHandler);
app.listen(PORT, function () {
  console.log("Started on Port : ".concat(PORT));
});