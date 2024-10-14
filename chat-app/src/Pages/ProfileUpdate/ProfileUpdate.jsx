import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../Lib/upload";
import { AppContext } from "../../Context/AppContext";

const ProfileUpdate = () => {
  const { setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile Picture");
        return; // Prevent further execution
      }
      const docRef = doc(db, "users", uid);
      const updateData = { bio, name };

      if (image) {
        const imgUrl = await upload(image);
        updateData.avatar = imgUrl;
        setPrevImage(imgUrl);
      }

      await updateDoc(docRef, updateData);
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile updated successfully!");
      navigate("/chat");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data() || {};

        setName(userData.name || "");
        setPrevImage(userData.avatar || "");
        setBio(userData.bio || "");
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              id="avatar"
              accept=".png,.jpeg,.jpg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt="Upload Profile"
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)} // Corrected here
            value={bio}
            placeholder="Write profile bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          src={image ? URL.createObjectURL(image) : prevImage || assets.logo_icon}
          className="profile-pic"
          alt="Profile Preview"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
