
const asyncHandler = require("express-async-handler");
const aws = require("../config/aws")
const { v4: uuidv4 } = require('uuid');
const ApiResponse = require("../helpers/response")

const { getFileType } = require("../calculate/fileType")

const { calculateDownloadBalancing, selectedSongPackage } = require("../calculate/balance")

const Song = require("../models/songModel")
const Upload = require("../models/uploadModel")
const UploadUsageModel = require("../models/uploadUsageModel")
const DownloadUsage = require("../models/downloadUsageModel")
const Download = require("../models/downloadModel")
const DOWNLOAD_START = "start"
const DOWNLOAD_FINISH = "finish"
const { getFolderPath, sanitizeFileName, SONG, IMAGE, VIDEO } = require('../helpers/folder'); // Klasör yolunu belirleme fonksiyonunu içe aktarın
const { validateFolderPath } = require('../helpers/validatename'); // Klasör yolunu belirleme fonksiyonunu içe aktarın
const { convertUnit } = require("../calculate/convertUnit");


const download = asyncHandler(async (req, res) => {

  const userid = req.user._id
  const { songid, filetype,
    deviceId, deviceModel,
    osVersion, appVersion, platform,
    ipAddress, deviceBrand,
    osType, screenSize, tvType, networkType, isWifi, isMobile, ssid, bssid } = req.body



  let newDevice = {
    deviceId,
    deviceModel,
    osVersion,
    platform,
    appVersion,
    ipAddress, // Opsiyonel: Cihazın IP adresi
    networkInfo: { isWifi, isMobile, networkType },
    wifiInfo: { ssid, bssid },
    // TV cihazları için ek alanlar
    deviceBrand, // TV'nin markası (Samsung, LG vs.)
    osType, // TV'nin işletim sistemi (Tizen, WebOS, Android TV)
    screenSize, // TV'nin ekran boyutu (55 inches vs.)
    tvType, //: { type: String, enum: ['Smart TV', 'Android TV', 'Other'] } // TV türü
    status: DOWNLOAD_START
  }
  try {
    // Dosya türü kontrolü
    if (!filetype || (filetype !== SONG && filetype !== VIDEO)) {
      return res.status(400).json(ApiResponse.error(400, "Unsupported file type"));
    }


    if (filetype == SONG) {
      //Şarkı indirme işlemleri için
      const song = await Song.findById(songid)
      if (!song) return res.status(404).json(ApiResponse.error(404, "Song not found"));

      if (!song.downloadble) return res.status(404).json(ApiResponse.error(404, "this song can not downloadble"));
      let upload = await Upload.findOne({ uploadid: song.uploadid })
      if (!upload) {
        return res.status(404).json(ApiResponse.error(404, "File not found"));
      }
      
      //paylaşılamaz ise özel kullanıma uygun dur. 
      if (!song.canBeShared && upload.userid != userid)
        return res.status(404).json(ApiResponse.error(404, "this song is private"));

      // Lisans süresi kontrolü (varsa ve dolmuşsa)
      if (song.copyrightInfo && song.copyrightInfo.expirationDate) {
        if (new Date() > song.copyrightInfo.expirationDate) {
          return res.status(403).json(ApiResponse.error(403, "The license for this song has expired"));
        }
      }
      // Kullanıcının mevcut paketini ve limitlerini al
      const selectedPackage = await selectedSongPackage(userid);
      if (!selectedPackage) {
        return res.status(400).json(ApiResponse.error(400, "You do not have an active package"));
      }

     
      // İndirme limiti kontrolü (cihaz limiti dahil)
      const downloadRecord = await Download.findOne({ uploadid: songid });
      if (downloadRecord && downloadRecord.devices.length >= selectedPackage.limit.song.maxDevices) {
        return res.status(403).json(ApiResponse.error(403, "Device limit exceeded"));
      }
      // Bakiye kontrolü
      const balance = await calculateDownloadBalancing(userid);
      let upload_unit = upload.upload_unit != null ? upload.upload_unit : "kb"

      if (convertUnit(upload.upload_size, upload_unit, "mb") > balance.song.download) {
        return res.status(403).json(ApiResponse.error(403, "Insufficient balance for this download"));
      }
      // Cihaz kaydını güncelleme
      const downloadUUID = uuidv4();
      if (!downloadRecord) {
        const newDownloadRecord = new Download({
          uploadid: song.uploadid,
          downloadid: downloadUUID,
          userid,
          devices: [newDevice]
        });
        await newDownloadRecord.save();
      } else {
        downloadRecord.devices.push(newDevice);
        await downloadRecord.save();
      }

    }

    // AWS'den dosyayı indirme işlemi
    const fileKey = upload.data.Key; // S3 key'i
    const data = await aws.init.send(new GetObjectCommand(aws.setDownloadParam(fileKey)));
    res.setHeader('Content-Type', data.ContentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileKey.split('/').pop()}"`);
    res.setHeader('Download-UUID', downloadUUID); // Header'da UUID gönder
    // Dosyayı kullanıcıya gönder
    data.Body.pipe(res);
  } catch (error) {
    console.error('Genel Hata:', error);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error }));
  }
});

const download_complete = asyncHandler(async (req, res) => {
  const userid = req.user._id
  const { downloaduuid, deviceid } = req.body

  // İndirme kaydını UUID'ye göre bul
  const download = await Download.findOne({ downloadid: downloaduuid });
  if (!download) {
    return res.status(400).json(ApiResponse.error(400, "Download record not found"));
  }
  // Cihazın doğru olup olmadığını kontrol et
  const device = download.devices.find(device => device.deviceId === deviceid);
  if (!device) {
    return res.status(400).json(ApiResponse.error(400, "Device not authorized for this download"));
  }
  device.status = 'DOWNLOAD_FINISH';
  // İndirme kaydını kaydet
  await download.save();


  // İndirme bilgilerini güncelle veya oluştur
  const downloadUsage = await DownloadUsage.findOneAndUpdate(
    { userid: download.userid, uploadid: download.uploadid },
    {
      $inc: {
        count: 1, // İndirme sayısını artır
        download_size: convertUnit(download.download_size, download.download_unit || "kb", "kb") // İndirme boyutunu ekle (kb cinsinden)
      }
    },
    { new: true, upsert: true } // Eğer daha önce kaydedilmediyse yeni kayıt oluştur
  );
  res.status(200).json(ApiResponse.success(200, "Download confirmed and updated successfully", downloadUsage));

});
/**
 *   // İndirme bilgilerini kayıt altına alma
   
 */

module.exports = {
  download, download_complete
};
