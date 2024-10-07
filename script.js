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
let localStream = null; // Yerel medya akışını sakla

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
  localStream = stream; // Yerel akışı sakla

  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  videoElement.controls = true;
  videoElement.muted = true; // Kendi sesini duymaması için

  document.getElementById('app').appendChild(videoElement);
  console.log('Medya akışı başarıyla başlatıldı:', stream);

  isMediaStreamStarted = true;  // Medya akışı başlatıldığını işaretle

  // Socket.IO ile sinyalleri gönder
  socket.emit('signal', { type: 'stream', streamId: localStream.id });
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

// Diğer kullanıcıdan gelen sinyalleri dinle
socket.on('signal', (data) => {
  console.log('Diğer kullanıcıdan sinyal alındı:', data);
  // Burada gelen sinyalleri işleyin (örneğin, başka bir video öğesi ekleyerek)
});
