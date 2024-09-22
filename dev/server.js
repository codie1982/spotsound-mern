
require("dotenv").config()
const path = require('path');
const express = require("express")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const colors = require("colors")
const fileUpload = require('express-fileupload');
const { connectDB } = require("../api/config/db")
const performerRoutes = require("../api/routes/performerRoutes")
const performerGalleryRoutes = require("../api/routes/performerGalleryRoutes")
const blogRoutes = require("../api/routes/blogRoutes")
const blogGalleryRoutes = require("../api/routes/blogGalleryRoutes")
const albumGalleryRoutes = require("../api/routes/albumGalleryRoutes")
const albumRoutes = require("../api/routes/albumRoutes")
const playlistRoutes = require("../api/routes/playlistRoutes")
const playlistGalleryRoutes = require("../api/routes/playlistGalleryRoutes")
const packagesRoutes = require("../api/routes/packagesRoutes")
const genreRoutes = require("../api/routes/genreRoutes")
const uploadRoutes = require("../api/routes/uploadRoutes")
const downloadRoutes = require("../api/routes/downloadRoutes")
const usersRoutes = require("../api/routes/userRoutes")
const verifyRoutes = require("../api/routes/verifyRoutes")
const connectionRoutes = require("../api/routes/connectionRoutes")
const supportRoutes = require("../api/routes/supportRoutes")
const { errorHandler } = require("../api/middelware/errorHandler")


const cors = require('cors');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');



//const App = require('../frontend/src/index.js'); // React uygulamanızı bu şekilde import edin


const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
connectDB()
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(fileUpload({
  //limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5 GB aws sunucusunun bir kerede max upload miktarı.
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 GB aws sunucusunun bir kerede max upload miktarı.
}));

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

//performer
app.use("/api/v10/performer", performerRoutes)
//performer_gallery
app.use("/api/v10/performer-gallery", performerGalleryRoutes)
//subscribers

//song

//album
app.use("/api/v10/album", albumRoutes)
//album_gallery
app.use("/api/v10/album-gallery", albumGalleryRoutes)
//playlist
app.use("/api/v10/playlist", playlistRoutes)
//playlist-gallery
app.use("/api/v10/playlist-gallery", playlistGalleryRoutes)
//packages
app.use("/api/v10/package", packagesRoutes)
//genre
app.use("/api/v10/genre", genreRoutes)
//images
app.use("/api/v10/upload", uploadRoutes)
//download
app.use("/api/v10/download", downloadRoutes)
//stream
app.use("/api/v10/stream", uploadRoutes)
//user
app.use("/api/v10/user", usersRoutes)
//verify
app.use("/api/v10/verify", verifyRoutes)
//connection
app.use("/api/v10/connection", connectionRoutes)
//support
app.use("/api/v10/support", supportRoutes)
//blog
app.use("/api/v10/blog", blogRoutes)
//blog-gallery
app.use("/api/v10/blog-gallery", blogGalleryRoutes)

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  const sitemap = new SitemapStream({ hostname: 'https://www.spotsoundmusic.com' });
  const pipeline = sitemap.pipe(createGzip());

  // Sitemap'e eklemek istediğiniz URL'leri buraya dinamik olarak ekleyebilirsiniz
  sitemap.write({ url: '/', changefreq: 'monthly', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
  sitemap.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });

  // Eğer veritabanından dinamik içeriklerinizi çekiyorsanız, onları da sitemap'e ekleyin.
  // Örneğin:
  /*
  const pages = await getPagesFromDatabase();
  pages.forEach(page => {
    sitemap.write({ url: page.url, changefreq: 'monthly', priority: 0.7 });
  });
  */

  sitemap.end();

  streamToPromise(pipeline).then(sm => res.send(sm)).catch(console.error);
});

app.get('/images/cover', (req, res) => {
  const imagePath = path.join(__dirname, 'public/images', "cover.jpg");
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Resim gönderilirken hata oluştu:', err);
      res.status(404).send('Resim bulunamadı.');
    }
  });
});

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