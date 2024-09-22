const mongoose = require('mongoose');
const imageSchema = require('./imageSchema');
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Başındaki ve sonundaki boşlukları temizler
  },
  content: {
    type: String,
    required: true, // Blog içeriği zorunludur
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Yazar bilgisi User modeline referans verir
    required: true,
  },
  category: {
    type: String, // Blog kategorisi
  },
  tags: [
    {
      type: String // Blog için isteğe bağlı etiketler
    }
  ],
  image: imageSchema,
  system: {
    type: Boolean,
    default: false, // system tarafından oluşturulan blogları belirlemek için
  },
  published: {
    type: Boolean,
    default: false, // Blog başlangıçta yayınlanmamış olarak gelir
  },
  publishedAt: {
    type: Date, // Yayınlanma tarihi
  },
}, { timestamps: true });

module.exports = blogSchema
