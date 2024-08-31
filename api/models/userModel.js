const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    type: { type: String,enum: ['internal', 'external'], default: 'internal' },
    path: { type: String }
});

const userSchema = mongoose.Schema({
    name: { type: String, required: [true, "Please add a name"] },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    birthdate: { type: Date },
    bio: { type: String,default: "" },
    genre:{type:String,enum: ['man', 'woman', 'pointout'], default: 'pointout' },
    profileImage: { type: imageSchema, default: () => ({}) },  // Varsayılan değer olarak boş bir obje döner,
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phoneNumbers: [{ // Telefon numaralarını array olarak tanımlama
        type: { type: String, enum: ['mobile', 'home', 'work'], required: true }, // Telefon tipi
        number: { type: String } // Telefon numarası
      }],
    addresses: [{ // Adresleri array olarak tanımlama
        street: { type: String }, // Sokak adı
        city: { type: String }, // Şehir
        state: { type: String }, // Eyalet/Bölge
        zip: { type: String }, // Posta kodu
        country: { type: String } // Ülke
    }],
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
      },
    appType: { type: String, enum: ['web', 'mobileApp'], required: true }, // Oturumun hangi
    authProvider: { type: String, enum: ['email', 'google'], required: true }, // Kayıt yöntemi alanı
    authProviderID: { type: String, default:"" }, // Kayıt yöntemi alanı
    email: { type: String, required: [true, "Please add a email"], unique: true },
    email_verify: { type: Boolean ,default: false }
}, { timestamps: true });

module.exports = mongoose.model("users", userSchema);