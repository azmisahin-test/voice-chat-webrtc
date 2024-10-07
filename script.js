// script.js

const DefaultMediaStreamConstraints = {
  audio: {
    echoCancellation: true,   // Eko iptali etkin
    noiseSuppression: true,   // Gürültü bastırma etkin
    sampleRate: 44100         // Örnekleme frekansı
  },
  video: {
    width: { ideal: 320 },   // Tercih edilen genişlik
    height: { ideal: 180 },  // Tercih edilen yükseklik
    frameRate: { ideal: 30 }, // Tercih edilen kare hızı
    facingMode: 'user'        // Kullanıcıya bakan kamera (ön kamera)
  }
};

let isMediaStreamStarted = false; // Medya akışı başlatıldı mı kontrolü

/**
 * Medya akışı başlatıcı fonksiyon. Kullanıcı tarafından belirtilen kısıtlamalar varsayılanlarla birleştirilir.
 * @param {MediaStreamConstraints} [userConstraints={}] - Kullanıcı tarafından belirtilen medya kısıtlamaları.
 * @returns {Promise<void>} - Başarı ya da hata durumuna göre bir promise döner.
 */
function initializeMediaStream(userConstraints = {}) {
  if (isMediaStreamStarted) {
    console.log('Medya akışı zaten başlatıldı!');
    return; // Eğer medya akışı zaten başlatıldıysa bir daha başlatma
  }

  // Varsayılan ve kullanıcı kısıtlamalarını birleştir
  const constraints = {
    audio: { ...DefaultMediaStreamConstraints.audio, ...userConstraints.audio },
    video: { ...DefaultMediaStreamConstraints.video, ...userConstraints.video }
  };

  return navigator.mediaDevices.getUserMedia(constraints)
    .then(onMediaStreamSuccess) // Medya akışı başarılı olduğunda tetiklenir
    .catch(onMediaStreamError); // Medya akışı hatası olduğunda tetiklenir
}

/**
 * Medya akışı başarıyla elde edildiğinde çalıştırılan callback fonksiyonu.
 * @param {MediaStream} stream - Başarıyla alınan MediaStream nesnesi.
 * @returns {void}
 */
function onMediaStreamSuccess(stream) {

  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;  // Otomatik oynat
  videoElement.controls = true;  // Video kontrol düğmeleri eklendi
  videoElement.muted = true;

  document.getElementById('app').appendChild(videoElement);
  console.log('Medya akışı başarıyla başlatıldı:', stream);

  isMediaStreamStarted = true;  // Medya akışı başlatıldığını işaretle
}

/**
 * Medya akışı başarısız olduğunda çalıştırılan callback fonksiyonu.
 * @param {Error} error - Medya akışını alma sırasında oluşan hata.
 * @returns {void}
 */
function onMediaStreamError(error) {
  console.error('Medya akışı başlatılamadı:', error);
  alert('Medya cihazlarına erişim sağlanamadı. Lütfen izin verdiğinizden emin olun.');
}
