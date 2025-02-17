// Importamos Firebase y los servicios que usaremos
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase (usa los datos de tu proyecto en Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDMuo1r_eExe9YTC2gEMa9FQhaqrQJ-kwg",
  authDomain: "ef-gueta-react.firebaseapp.com",
  projectId: "ef-gueta-react",
  storageBucket: "ef-gueta-react.appspot.com", // 🛠 CORRIGE esto (antes decía firebasestorage.app)
  messagingSenderId: "608264453917",
  appId: "1:608264453917:web:5527aa1ccaacafedec2bf4",
  measurementId: "G-G3DWW5F4GX"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos servicios
const db = getFirestore(app); // Base de datos Firestore
const auth = getAuth(app); // Autenticación

// Exportamos las instancias para usarlas en otros archivos
export { app, db, auth };