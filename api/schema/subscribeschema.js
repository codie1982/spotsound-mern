const mongoose = require("mongoose");
const subscribeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Kullanıcı referansı
    required: true
  },
  packageid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package', // Paket referansı
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['GooglePlay', 'PayPal', 'CreditCard', 'ApplePay'], // Desteklenen ödeme yöntemleri
    default: 'GooglePlay'
  },
  purchaseToken: {
    type: String, // Google Play veya başka bir ödeme sisteminden gelen doğrulama token'ı
    required: true
  },
  receiptData: {
    type: String, // Fatura bilgileri
    required: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'canceled', 'pending'],
    default: 'pending'
  },
  subscriptionType: {
    type: String,
    enum: ['one-time', 'recurring'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      enum: ['USD', 'EUR', 'TRY', 'GBP', 'JPY', 'AUD', 'CAD'], // Desteklenen para birimleri
      default: 'USD'
    }
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    default: function () {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Varsayılan olarak 30 gün sonra bitiş
    }
  },
  autoRenew: {
    type: Boolean, // Otomatik yenileme seçeneği
    default: false
  },
  cancellationDate: {
    type: Date, // Kullanıcı aboneliği iptal ederse iptal tarihi
    default: null
  },
  transactionId: {
    type: String, // Ödeme sağlayıcıdan gelen işlem ID'si
    required: true
  }
}, { timestamps: true });

module.exports = subscribeSchema;