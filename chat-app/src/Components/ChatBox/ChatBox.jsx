import React from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
const ChatBox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          Utkarsh Rai <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} alt="" className="help" />
      </div>
      <div className="chat-message">
        <div className="s-message">
          <p className="msg">
            Hn, dekhte h, <br /> time milega to chalenge. <br />Abhi to pitr paksh chl rha h.
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>
        <div className="s-message">
          <img src={assets.pic1} className="mes-img" alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>
        <div className="r-message">
          <p className="msg">
            Aur Bhai kya haal h?, <br />
            Shekhar bhai ke yha <br />1 tareek ko ghoomne chalenge
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Send a message" />
        <input type="file" id="image" accept="image/png, image/jpeg " hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  );
};

export default ChatBox;
