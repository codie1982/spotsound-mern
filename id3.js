const NodeID3 = require('node-id3');
const mm = require('music-metadata');
const fs = require('fs');
const path = require('path');

// MP3 dosyasının yolu
const filePath = path.join(__dirname, 'pre1.mp3');
// ID3 taglerini kontrol eden işlev
function checkID3Tags(filePath) {
    // MP3 dosyasındaki ID3 etiketlerini okuma
    const tags = NodeID3.read(filePath);
    console.log('tags:', tags || 'Bilinmiyor');
    console.log('---------------------------');
    if (tags) {
        console.log('Şarkı Başlığı:', tags.title || 'Bilinmiyor');
        console.log('Sanatçı:', tags.artist || 'Bilinmiyor');
        console.log('Albüm:', tags.album || 'Bilinmiyor');
        console.log('Yıl:', tags.year || 'Bilinmiyor');
        console.log('Tür:', tags.genre || 'Bilinmiyor');
        console.log('image:', tags.image || 'Bilinmiyor');
        console.log('raw:', tags.raw || 'Bilinmiyor');
        console.log('userDefinedText:', tags.userDefinedText || 'Bilinmiyor');
        console.log('encodingTechnology:', tags.encodingTechnology || 'Bilinmiyor');
        console.log('recordingTime:', tags.recordingTime || 'Bilinmiyor');
    } else {
        console.log('ID3 etiketleri bulunamadı veya dosya geçersiz.');
    }
}

// Fonksiyonu çağırın
checkID3Tags(filePath);