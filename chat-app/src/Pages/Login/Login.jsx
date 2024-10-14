import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup } from "../../Config/firebase";
import { login } from "../../Config/firebase";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)
  const onSubmitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (state === "Sign Up") {
         signup(username, email, password);
      } else {
         login(email, password);
      }
      toast.success(`${state} successful`);
    } catch (error) {
      toast.error(error.message);
      
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className="login">
      <img src={assets.logo_big} className="logo" alt="" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{state}</h2>
        {state === "Sign Up" ? (
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="form-input"
            placeholder="Username"
            required
          />
        ) :<div></div>}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-input"
          placeholder="email-address"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="form-input"
          required
        />
        <button type="submit">{state}</button>
        <div className="login-term">
          <p>{" "} Agree to the terms of use & privacy policy. </p>
        </div>
        <div className="login-forgot">
          {state === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setState("Login")}>Click Here</span>
            </p>
          ) : (
            <p className="login-toggle">
              New to chat app{" "}
              <span onClick={() => setState("Sign Up")}> Create Account</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
