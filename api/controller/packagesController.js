const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');
const PackageModel = require("../models/packageModel")
const ApiResponse = require("../helpers/response")
const { validateNamePath } = require("../helpers/validatename")
const PACKAGE_TYPE = {
  FREE: "free",
  MULTIPLE: "multiple",
  STUDENT: "student",
  MAXI: "maxi",
}
/**
  *  
 name: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 100 },
 title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
 description: { type: String, maxlength: 500, default: '' },
 price: {
   amount: { type: Number, required: true, min: 0 },
   currency: { type: String, required: true, enum: ['USD', 'EUR', 'TRY', 'GBP', 'JPY', 'AUD', 'CAD'], default: 'USD' }
 },
 features: [{ item: { type: String } }],
 category: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], required: true }
 package_content_type: { type: String, enum: ["standart", "multisubscribe", "student"] },
 limit: {
   song: {
     download: { type: Number, required: true, min: 0, default: 512 },
     upload: { type: Number, required: true, min: 0, default: 512 },
     unit: { type: String, enum: ["b", "kb", "mb", "gb"], default: "mb" },
   },
   video: {
     download: { type: Number, required: true, min: 0, default: 1024 },
     upload: { type: Number, required: true, min: 0, default: 1024 },
     unit: { type: String, required: true, enum: ["b", "kb", "mb", "gb"], default: "mb" },
   },
 },
 duration: {
   unlimited: { type: Boolean, default: false },
   time: { type: Number, required: true, min: 1, default: 30 },
   interval: { type: String, enum: ['day', 'month', 'year'], required: true, default: "day" },
 },// Default: 30 day
 isRenewable: { type: Boolean, default: true },
 renewalPrice: { type: Number, default: null, min: 0 }, // If null, use original price
 discount: { type: Number, min: 0, max: 100, default: 0 }, // Percentage discount
 sales_channel: { type: String, enum: ["google"] }, // google apple ve huawei şeklinde artacak.
 product_id: { type: String, default: "" }, //ürün IDsi hangi satış kanalı ile satış yapılacaksa o satış kanalının paket için vereceği ürün id'si
 default_package: { type: Boolean, default: false },
 delete: { type: Boolean, default: false },
 status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
 */
const addPackage = asyncHandler(async (req, res) => {
  const { name, title, description, amount, currency, category,
    uploadsonglimit, uploadvideolimit, downloadsonglimit, downloadvideolimit, unit,
    package_content_type,
    unlimited, duration_time, duration_interval,
    isRenewable, renewalPrice, discount, sales_channel,
    product_id, default_package, status
  } = req.body
  const features = req.body["features[]"];
  if (!name || !title || !description || !features) {
    res.status(400).json(ApiResponse.error(400, 'lütfen tüm alanları doldurunuz.', { error: "lütfen tüm alanları doldurunuz" }));
  }
  try {
    const findPackage = await PackageModel.find({ name: name, delete: false })
    if (findPackage.length > 0) {
      res.status(400).json(ApiResponse.error(400, 'Bu paket ismi daha önce oluşturulmuş. Paket ismi benzersiz olmalı', { error: "Paket ismi benzersiz olmalı" }));
    }
    const findProductid = await PackageModel.find({ product_id })
    if (findProductid.length > 0) {
      res.status(400).json(ApiResponse.error(400, 'bu product id si ile daha önce paket oluşturulmuş.', { error: "bu product id si ile daha önce paket oluşturulmuş" }));
    }
    var _fetaures = features.map(feature => {
      return { item: feature }
    })
    //Bu paket default olarak tanımlanmış ise diğüer paketleri otomatik olarak default değerini false yapmak gerekli
    if (default_package == "true") {
      const defaultPackages = await PackageModel.find({ default_package: true, delete: false })
      if (defaultPackages) {
        for (let i = 0; i < defaultPackages.length; i++) {
          await PackageModel.findByIdAndUpdate(defaultPackages[i]._id, { default_package: false })
        }
      }
    }

    const newPackage = new PackageModel({
      name,
      title,
      description,
      price: {
        amount,
        currency
      },
      features: _fetaures,
      category,
      package_content_type,
      limit: {
        song: {
          download: downloadsonglimit,
          upload: uploadsonglimit,
          unit: unit
        },
        video: {
          download: downloadvideolimit,
          upload: uploadvideolimit,
          unit: unit
        }
      },
      duration: {
        unlimited, time: duration_time, interval: duration_interval
      },
      isRenewable,
      renewalPrice,
      discount,
      default_package: default_package === null ? false : default_package === "true" ? true : false,
      sales_channel,
      product_id,
      status
    })
    await newPackage.save((err, result) => {
      if (err) {
        console.log("err", err)
        return res.status(400).json(ApiResponse
          .error(400, 'Paket oluşturulmadı. Daha sonra tekrar deneyiniz.', err));
      } else {
        return res.status(200).json(ApiResponse
          .success(200, 'Paket başarı ile oluşturuldu.', result));
      }
    })

  } catch (err) {
    console.log("err", err)
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
const getallPackages = asyncHandler(async (req, res) => {
  try {
    const packages = await PackageModel.find({ delete: false }, (["-delete", "-active", "-google_channel", "-appel_channel"]))
    if (packages.length > 0) {
      const _packages = packages.map(package => {
        delete package.google_channel
        delete package.appel_channel
        return package
      })
      return res.status(200).json(ApiResponse.success(200, 'Uygun paket listesi.', _packages));
    } else {
      return res.status(200).json(ApiResponse.error(404, 'herhangi bir paket tanımlı değil.', {}));
    }
  } catch (error) {
    console.error('Genel Hata:', err);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
const getallActivePackages = asyncHandler(async (req, res) => {
  try {
    const packages = await PackageModel.find({ delete: false, active: true }, (["-delete", "-active"]))

    if (packages.length > 0) {
      const _packages = packages.map(package => {
        delete package.google_channel
        delete package.apple_channel
        return package
      })

      return res.status(200).json(ApiResponse.success(200, 'Dosya yükleme işlemi tamamlandı.', _packages));
    } else {
      return res.status(404).json(ApiResponse.error(404, 'Kriterlere uyan bir paket tanımlı değil.', {}));
    }

  } catch (error) {
    console.error('Genel Hata:', err);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
const getPackage = asyncHandler(async (req, res) => {
  const { name } = req.query
  if (!validateNamePath(name))
    return res.status(400).json(ApiResponse.error(400, 'gerçerli bir paket adı giriniz.', {}));
  try {
    const findPackage = await PackageModel.findOne({ name, delete: false }, (["-delete", "-active"]))
    if (findPackage) {
      return res.status(200).json(ApiResponse.success(200, 'Paket bulundu.', findPackage));
    } else {
      return res.status(404).json(ApiResponse.success(404, 'Paket bulunamadı. Silinmiş veya ismi değişmiş olabilir.', findPackage));
    }
  } catch (error) {
    console.error('Genel Hata:', err);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
const deletePackage = asyncHandler(async (req, res) => {
  const { uploadtype } = req.body

  try {
    return res.status(200).json(ApiResponse.success(200, 'Dosya yükleme işlemi tamamlandı.',
      {
        totalFiles: totalFiles,
        successCount: successCount,
        failureCount: failureCount,
        successfulUploads: successfulUploads.map(result => ({
          name: result.name,
          url: result.url
        })),
        failedUploads: failedUploads.map(result => ({
          name: result.name,
          error: result.error
        }))
      }));
  } catch (error) {
    console.error('Genel Hata:', err);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
const updatePackage = asyncHandler(async (req, res) => {
  const { uploadtype } = req.body

  try {
    return res.status(200).json(ApiResponse.success(200, 'Dosya yükleme işlemi tamamlandı.',
      {
        totalFiles: totalFiles,
        successCount: successCount,
        failureCount: failureCount,
        successfulUploads: successfulUploads.map(result => ({
          name: result.name,
          url: result.url
        })),
        failedUploads: failedUploads.map(result => ({
          name: result.name,
          error: result.error
        }))
      }));
  } catch (error) {
    console.error('Genel Hata:', err);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error: err.message }));
  }
});
module.exports = {
  addPackage, getallPackages, getPackage, deletePackage, updatePackage, getallActivePackages, PACKAGE_TYPE
};
