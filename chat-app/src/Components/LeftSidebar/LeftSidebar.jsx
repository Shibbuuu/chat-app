import React, { useContext, useState, useCallback, useEffect } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { AppContext } from "../../Context/AppContext";
import { db } from "../../Config/firebase";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { userData } = useContext(AppContext);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const inputHandler = useCallback(
    debounce(async (e) => {
      const input = e.target.value.trim();
      setShowSearch(!!input);

      if (input) {
        try {
          const userRef = collection(db, "users");
          const q = query(
            userRef,
            where("username", "==", input.toLowerCase())
          );
          const querySnap = await getDocs(q);

          if (!querySnap.empty) {
            const foundUser = querySnap.docs[0].data();
            setUser(foundUser.id !== userData.id ? foundUser : null);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUser(null);
      }
    }, 300),
    [userData]
  );

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
        <div className="ls-list">
          {showSearch && user ? (
            <div className="friends add-user">
              <img src={user.avatar} />
              <p>{user.name}</p>
            </div>
          ) : (
            Array.from({ length: 12 }, (_, index) => (
              <div className="friends" key={index}>
                <img src={assets.profile_img} alt="Profile" />
                <div>
                  <p>Utkarsh Rai</p>
                  <span>Hello, How are you?</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
