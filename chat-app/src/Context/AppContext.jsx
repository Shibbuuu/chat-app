import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { createContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();
  const [intervalId, setIntervalId] = useState(null);

  const loadUserData = useCallback(async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User does not exist");
        return;
      }

      const userData = userSnap.data();
      setUserData(userData);

      navigate(userData.avatar && userData.name ? "/chat" : "/profile");

      await updateDoc(userRef, { lastSeen: serverTimestamp() });

      const id = setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, { lastSeen: serverTimestamp() });
        }
      }, 60000);
      setIntervalId(id);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData || [];
        const tempData = await Promise.all(chatItems.map(async (item) => {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          return { ...item, userData };
        }));

        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub();
        clearInterval(intervalId); // Clear the interval on unmount
      };
    }
  }, [userData, intervalId]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
