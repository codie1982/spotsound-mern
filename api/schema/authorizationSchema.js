const mongoose = require('mongoose');

// Oturum şeması tanımlama
const authorizationSchema = new mongoose.Schema({
  role: { type: String, default: "user" },
  defaultRole: { type: Boolean, default: false },
  inheritedRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Authorization' }, // Başka bir rolden miras alınabilir
  level: { type: Number, default: 1 },  // Rol seviyesi, daha yüksek numaralar daha yüksek yetkiyi ifade eder
  authorities: [
    {
      title: { type: String },
      description: { type: String },
      key: { type: String },
      actions: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
      }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Kimin oluşturduğunu kaydet
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Kimin güncellediğini kaydet
});

// Model oluşturma
module.exports = authorizationSchema