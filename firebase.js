// firebase.js — Configuración compartida de Firebase para Coyohoot
const firebaseConfig = {
    apiKey: "AIzaSyCVDd3SGWd6Xlaf_1HsKa8P9vT6TV3rGJw",
    authDomain: "concurso-140ed.firebaseapp.com",
    projectId: "concurso-140ed",
    storageBucket: "concurso-140ed.firebasestorage.app",
    messagingSenderId: "193140991647",
    appId: "1:193140991647:web:e7deb922cf2c7b4b2da4aa",
    measurementId: "G-8XE7FX56F8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
