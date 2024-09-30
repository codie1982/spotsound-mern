
const asyncHandler = require("express-async-handler");
const axios = require("axios")
const aws = require("../config/aws")
const { v4: uuidv4 } = require('uuid');
const ApiResponse = require("../helpers/response")

const { getFileType } = require("../calculate/fileType")

const { calculateDownloadBalancing, selectedSongPackage } = require("../calculate/balance")

const Song = require("../models/songModel")
const Upload = require("../models/uploadModel")
const StreamUsage = require("../models/streamUsageModel")
const StreamProgress = require("../models/streamProgressModel")
const { getFolderPath, sanitizeFileName, SONG, IMAGE, VIDEO } = require('../helpers/folder'); // Klasör yolunu belirleme fonksiyonunu içe aktarın
const { validateFolderPath } = require('../helpers/validatename'); // Klasör yolunu belirleme fonksiyonunu içe aktarın
const { convertUnit } = require("../calculate/convertUnit");

const createStreamProgress = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { songid } = req.body

  // UUID oluşturma (her stream için benzersiz)
  const streamuuid = uuidv4();

  const song = await Song.findById(songid)
  try {
    // Kullanıcının bu şarkıdaki mevcut ilerlemesini bul veya yeni bir kayıt oluştur
    const streamProgress = new StreamProgress(
      {
        userid,
        songid,
        streamuuid,
        totalDuration: song.metadata.duration,
        lastUpdated: Date.now()
      },
    );
    let savedStreamProgress = await streamProgress.save()
    if (savedStreamProgress) {
      return res.status(200).json(ApiResponse.success(200, 'Stream progress saved', { id: streamUUID }));
    }
    return res.status(400).json(ApiResponse.success(400, 'no stream Progress', {}));

  } catch (error) {
    console.error('Error saving stream progress:', error);
    return res.status(500).json(ApiResponse.error(500, 'Error saving stream progress', { error }));
  }
});

const stream = asyncHandler(async (req, res) => {
  const userid = req.user._id
  const { songid, filetype,
    deviceId, deviceModel,
    osVersion, appVersion, platform, streamuuid
  } = req.body
  let newDevice = {
    deviceId,
    deviceModel,
    osVersion,
    platform,
    appVersion,
    ipAddress: req.ip, // Opsiyonel: Cihazın IP adresi
    // Ek cihaz bilgileri
  };

  try {
    if (!streamuuid) {
      return res.status(400).json(ApiResponse.error(400, "there is no streamuuid"));
    }
    const streamProgress = await StreamProgress.findOne({ streamuuid })
    // Dosya türü kontrolü
    if (!filetype || (filetype !== SONG && filetype !== VIDEO)) {
      return res.status(400).json(ApiResponse.error(400, "Unsupported file type"));
    }
    if (filetype == SONG) {
      //Şarkı indirme işlemleri için
      const song = await Song.findById(songid)
      if (!song) return res.status(404).json(ApiResponse.error(404, "Song not found"));
      const upload = await Upload.findOne({ uploadid: song.uploadid });
      if (!upload) return res.status(404).json(ApiResponse.error(404, "File not found"));
      if (!song.streamble) return res.status(403).json(ApiResponse.error(403, "This song cannot be streamed"));
      //paylaşılamaz ise özel kullanıma uygun dur. 
      if (!song.canBeShared && upload.userid.toString() !== userid.toString()) {
        return res.status(403).json(ApiResponse.error(403, "This song is private"));
      }

      // Lisans süresi kontrolü (varsa ve dolmuşsa)
      if (song.copyrightInfo && song.copyrightInfo.expirationDate) {
        if (new Date() > song.copyrightInfo.expirationDate) {
          return res.status(403).json(ApiResponse.error(403, "The license for this song has expired"));
        }
      }

      // AWS veya S3'den dosya bilgilerini al

      // Kullanıcının mevcut paketini ve limitlerini al
      const selectedPackage = await selectedSongPackage(userid);
      if (!selectedPackage) {
        return res.status(400).json(ApiResponse.error(400, "You do not have an active package"));
      }
      // Bakiye kontrolü
      /* const balance = await calculateDownloadBalancing(userid);
      let upload_unit = upload.upload_unit != null ? upload.upload_unit : "kb"

      if (convertUnit(upload.upload_size, upload_unit, "mb") > balance.song.download) {
        return res.status(403).json(ApiResponse.error(403, "Insufficient balance for this download"));
      } */
      // AWS'den dosyayı indirme işlemi
      const fileKey = upload.data.Key; // S3 key'i
      // const data = await aws.init.send(new aws.GetObjectCommand(aws.setStreamParam(fileKey)));
      // İlk stream kaydını yapıyoruz ve _id'yi alıyoruz
      const streamUsageId = await createStreamUsage(
        userid, songid, deviceId, platform, osVersion, appVersion, req.ip
      );
      // Toplu güncelleme için belirli bir zaman aralığı
      const intervalId = setInterval(async () => {
        if (bufferStreamedBytes > 0) {
          await updateStreamUsage(streamUsageId, bufferStreamedBytes);
          bufferStreamedBytes = 0;
        }
      }, 30000); // 30 saniyede bir güncelleme

      // Asenkron olarak imzalı URL oluşturma (örn. 1 saat geçerli)
      const signedUrl = await aws.generateSignedUrl(fileKey, 3600); // 1 saat geçerli imzalı URL
      const range = req.headers.range;
      const options = { method: 'GET', url: signedUrl, responseType: 'stream' };
      //const AWS = aws.init()
      //const data = await AWS.send(new aws.GetObjectCommand(aws.setStreamParam(fileKey)));
      if (range) {
        options.headers = { Range: range }; // Eğer range header varsa, parçalı istek yapılır
      }
      const s3Response = await axios(options); // İmzalı URL'den dosyayı çek
      const total = s3Response.headers['content-length'];
      let streamedBytes = 0; // Stream edilen byte miktarını takip edeceğimiz değişken
      let bufferThreshold = 10000000; // 2MB (örnek eşik değeri)
      let bufferStreamedBytes = 0; // Toplam buffer'da tutulan veri

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${total}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': s3Response.headers['content-type']
        });
      } else {
        res.writeHead(200, {
          'Content-Length': total,
          'Content-Type': s3Response.headers['content-type']
        });
      }
      // Stream edilen veri miktarını ölç
      s3Response.data.on('data', async (chunk) => {
        streamedBytes += chunk.length;
        bufferStreamedBytes += chunk.length;
        // Eğer bufferThreshold (örneğin 10MB) geçildiyse veritabanına kaydet
        if (bufferStreamedBytes >= bufferThreshold) {
          await updateStreamUsage(streamUsageId, bufferThreshold);
          bufferStreamedBytes = 0; // Buffer'ı sıfırla
        }
      });
      s3Response.data.pipe(res);

      s3Response.data.on('end', async () => {
        console.log(`Stream completed. Total streamed bytes: ${streamedBytes}`);
        if (bufferStreamedBytes > 0) {
          await updateStreamUsage(streamUsageId, bufferStreamedBytes);
        }
        clearInterval(intervalId); // Stream sona erdiğinde interval'ı temizle
      });

      s3Response.data.on('error', (err) => {

        clearInterval(intervalId); // Hata durumunda interval'ı temizle
        console.error('Stream error:', err);
        return res.status(500).json(ApiResponse.error(500, "Stream error", { err }));
      });
    }
  } catch (error) {
    console.error('Genel Hata:', error);
    return res.status(500).json(ApiResponse.error(500, 'Sunucu hatası.', { error }));
  }
});
const createStreamUsage = async (userid, songid, deviceId, platform, osVersion, appVersion, ipAddress) => {
  const streamUsage = new StreamUsage({
    userid: userid,
    songid: songid,
    deviceId: deviceId,
    platform: platform,
    osVersion: osVersion,
    appVersion: appVersion,
    ipAddress: ipAddress,
    streamedBytes: 0 // Başlangıçta 0
  });

  const savedStreamUsage = await streamUsage.save();
  return savedStreamUsage._id; // Kaydedilen `_id`yi döndür
};
// Bu fonksiyon veritabanına asenkron olarak güncellemeleri kaydeder
const updateStreamUsage = async (streamUsageId, bufferStreamedBytes) => {
  await StreamUsage.findByIdAndUpdate(
    streamUsageId,
    { $inc: { streamedBytes: bufferStreamedBytes }, lastStreamedAt: Date.now() },
    { new: true }
  );
};
const saveStreamProgress = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { streamuuid, currentPosition, totalDuration } = req.body;

  try {
    // Kullanıcının bu şarkıdaki mevcut ilerlemesini bul veya yeni bir kayıt oluştur
    const streamProgress = await StreamProgress.findOneAndUpdate(
      { streamuuid },
      {
        currentPosition,
        totalDuration,
        lastUpdated: Date.now()
      },
      { new: true } // Kayıt yoksa oluştur
    );

    return res.status(200).json(ApiResponse.success(200, 'Stream progress saved', streamProgress));
  } catch (error) {
    console.error('Error saving stream progress:', error);
    return res.status(500).json(ApiResponse.error(500, 'Error saving stream progress', { error }));
  }
});

const streamFromLastPosition = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { streamuuid } = req.body;
  try {
    // Kullanıcının bu şarkı için kaydedilen ilerlemesini al
    const streamProgress = await StreamProgress.findOne({ streamuuid });

    if (!streamProgress) {
      // Eğer ilerleme kaydedilmediyse, şarkıyı baştan başlat
      return res.status(200).json(ApiResponse.success(200, 'Starting stream from beginning', { startPosition: 0 }));
    }

    // Eğer ilerleme kaydedildiyse, o noktadan başlat
    return res.status(200).json(ApiResponse.success(200, 'Resuming stream from saved position', { startPosition: streamProgress.currentPosition }));
  } catch (error) {
    console.error('Error retrieving stream progress:', error);
    return res.status(500).json(ApiResponse.error(500, 'Error retrieving stream progress', { error }));
  }
});

const secondToByte = (bitrate, second) => {
  const bytesPerSecond = (bitrate * 1000) / 8; // Bitrate'ten byte hesaplama (bps -> Bps)
  return Math.floor(bytesPerSecond * second);  // Byte cinsinden pozisyonu hesapla
};
module.exports = {
  stream, saveStreamProgress, streamFromLastPosition, createStreamProgress
};
