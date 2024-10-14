import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDNsjdDqGClWKpK5m_c4HhQy1cI6u5kXxE",
  authDomain: "chatappjs-4594d.firebaseapp.com",
  projectId: "chatappjs-4594d",
  storageBucket: "chatappjs-4594d.appspot.com",
  messagingSenderId: "910043901469",
  appId: "1:910043901469:web:65219b98db76fdd9aa60f4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const formatErrorMessage = (error) => {
  return error?.code?.split("/")[1]?.split("-").join(" ") || "An error occurred";
};

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, I am using the chat app",
      lastSeen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });

    toast.success("User registered successfully!");
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(formatErrorMessage(error) + " during signup.");
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!");
  } catch (error) {
    console.error("Login error:", error);
    toast.error(formatErrorMessage(error) + " during login.");
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(formatErrorMessage(error) + " during logout.");
  }
};

export { signup, login, logout, auth, db };
