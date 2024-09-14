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
const addPackage = asyncHandler(async (req, res) => {
  const { name, title, content, type, expireTime, uploadsonglimit, uploadvideolimit, apple_channel, google_channel } = req.body
  const features = req.body["features[]"];
  if (!name || !title || !content || !features || !type || !expireTime || !uploadsonglimit || !uploadvideolimit || !apple_channel || !google_channel) {
    res.status(400).json(ApiResponse.error(400, 'lütfen tüm alanları doldurunuz.', { error: "lütfen tüm alanları doldurunuz" }));
  }
  try {
    if (type == PACKAGE_TYPE.FREE || type == PACKAGE_TYPE.MULTIPLE || type == PACKAGE_TYPE.STUDENT || type == PACKAGE_TYPE.MAXI) {
      const findPackage = await PackageModel.find({ name: name, delete: false })
      if (findPackage.length > 0) {
        res.status(400).json(ApiResponse.error(400, 'Bu paket ismi daha önce oluşturulmuş.', { error: "Doğru paket seçimi yapınız" }));
      }
      var _fetaures = features.map(feature => {
        return { item: feature }
      })
      const newPackage = new PackageModel({
        name: name,
        type: type,
        title,
        content,
        features: _fetaures,
        expireTime: expireTime == null ? 1000 * 60 * 60 * 24 * 365 : 1000 * 60 * 60 * 24 * expireTime,
        uploadsonglimit: uploadsonglimit * 1024 * 1024,
        uploadvideolimit: uploadvideolimit * 1024 * 1024,
        google_channel,
        apple_channel,
      })
      await newPackage.save((err, result) => {
        if (err) {
          console.log("err", err)
          res.status(400).json(ApiResponse
            .success(400, 'Paket eklenemedi.', err));
        } else {
          console.log("result", result)
          res.status(200).json(ApiResponse
            .success(200, 'Dosya yükleme işlemi tamamlandı.', result));
        }
      })
    } else {
      res.status(400).json(ApiResponse.error(400, 'Doğru paket seçimi yapınız.', { error: "Doğru paket seçimi yapınız" }));
    }
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
  addPackage, getallPackages, getPackage, deletePackage, updatePackage, getallActivePackages
};
