const asyncHandler = require("express-async-handler");
const { Upload } = require('@aws-sdk/lib-storage'); // Upload sınıfını buradan içe aktarın
const { v4: uuidv4 } = require('uuid');
const ApiResponse = require("../helpers/response")
const allowedSongsMimeTypes = require("../helpers/mimes/songmimes")
const allowedImageMimeTypes = require("../helpers/mimes/imagesmimes")
const allowedVideoMimeTypes = require("../helpers/mimes/videomimes")
const aws = require("../config/aws")

const UploadModel = require("../models/uploadModel")
const { getFolderPath, sanitizeFileName, SONG, IMAGE, VIDEO } = require('../helpers/folder'); // Klasör yolunu belirleme fonksiyonunu içe aktarın
const validateFolderPath = require('../helpers/validatefolder'); // Klasör yolunu belirleme fonksiyonunu içe aktarın

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100 MB
const upload = asyncHandler(async (req, res) => {
  const { uploadtype } = req.body
  const userid = req.user._id
  let _progress = 0;
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json(ApiResponse.error(400, 'Hiçbir dosya yüklenmedi.'));
    }

    let uploadedFiles = req.files.files;

    // Eğer tek dosya yüklendiyse, onu diziye çevir
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }



    // Sadece ses dosyalarını kabul eden MIME türleri

    // Klasör yolunu doğrulama
    if (folderPath && !validateFolderPath(folderPath)) {
      return res.status(400).json(ApiResponse.error(400, 'Geçersiz klasör yolu.'));
    }
    const uploadPromises = uploadedFiles.map(async (file) => {
      // Dosya türü kontrolü
      let fileType = '';
      if (allowedSongsMimeTypes.includes(file.mimetype)) {
        fileType = SONG;
      } else if (allowedVideoMimeTypes.includes(file.mimetype)) {
        fileType = VIDEO;
      } else if (allowedImageMimeTypes.includes(file.mimetype)) {
        fileType = IMAGE;
      } else {
        return { name: file.name, error: 'Desteklenmeyen dosya türü.', success: false };
      }
      const folderPath = getFolderPath(uploadtype, userid); // Örneğin: "music/Artist1/"
      const uniqueFileName = `${uuidv4()}-${sanitizeFileName(file.name)}`;
      const objectKey = `${folderPath.concat(uniqueFileName)}`; // Örneğin: "music/Artist1/uuid-filename.mp3"
      const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
      //TODO kullanıcının kalan hakkı ile kontrol edilmesi gerekli
      if (totalSize > MAX_TOTAL_SIZE) {
        return res.status(400).send('Toplam dosya boyutu 100 MB\'ı aşamaz.');
      }
      try {
        const parallelUploads3 = new Upload({
          client: aws.init(),
          params: aws.setParam(objectKey, file.data, file.mimetype),
        });

        parallelUploads3.on('httpUploadProgress', (progress) => {
          console.log(`Yükleme ilerlemesi (${file.name}): ${progress.loaded} / ${progress.total}`);
          _progress = progress.loaded
        });

        const data = await parallelUploads3.done();
        return { url: data.Location, name: file.name, success: true };
      } catch (err) {
        console.error(`Yükleme Hatası (${file.name}):`, err);
        return { name: file.name, error: 'Yükleme sırasında bir hata oluştu.', success: false };
      }
    })
    const uploadResults = await Promise.all(uploadPromises);

    // Başarı ve Hata Sayısını Hesaplama
    const totalFiles = uploadResults.length;
    const successfulUploads = uploadResults.filter(result => result.success);
    const failedUploads = uploadResults.filter(result => !result.success);
    const successCount = successfulUploads.length;
    const failureCount = failedUploads.length;

    // Geri Bildirim JSON'u Oluşturma
    const uploadDoc = new UploadModel({
      userid: userid,
      uploadType: uploadType,
      totalsize: totalSize,
      folder: folderPath,
      files: uploadedFiles.map((file) => {
        return {
          name: file.name,
          size: file.size,
          mimetype: file.mimetype
        }
      }),
      successfulUploads: successfulUploads.map(result => ({
        name: result.name,
        url: result.url
      })),
      failedUploads: failedUploads.map(result => ({
        name: result.name,
        error: result.error
      })),
      progress: _progress,
      successCount: successCount,
      failureCount: failureCount,
    });
    uploadDoc.save((result) => {

    })

    //Yükleme tamamlandıktan sonra bir song nesnesş oluşturulmalı




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
  upload
};
