const callButton = document.getElementById("callButton");
const remoteAudio = document.getElementById("remoteAudio");
let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

callButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      database.ref("candidates").push(event.candidate.toJSON());
    }
  };

  peerConnection.ontrack = (event) => {
    remoteAudio.srcObject = event.streams[0];
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  database.ref("offers").push({ sdp: offer.sdp, type: offer.type });

  database.ref("answers").on("child_added", async (snapshot) => {
    const answer = snapshot.val();
    if (!peerConnection.currentRemoteDescription && answer) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  });

  database.ref("candidates").on("child_added", async (snapshot) => {
    const candidate = new RTCIceCandidate(snapshot.val());
    await peerConnection.addIceCandidate(candidate);
  });
};
