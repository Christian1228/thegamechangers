import React, { useState } from "react";
import "../../../App.css";
import { db, auth } from "../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        addDoc(collection(db, "users"), {
          userId: userCredential.user.uid,
          email: email,
          name: "",
          gender: "",
          dateOfBirth: "",
          teleTag: "",
          experiences: [],
        });

        console.log(userCredential);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <img className="cover-logo" src="./images/Logo.png" alt="" />
        <h1>THE GAME CHANGERS</h1>
        <form className="signup-form" onSubmit={signUp}>
          <h3>Create Account</h3>
          <label htmlFor="email">email</label>
          <input
            placeholder="Email..."
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>

        <p>Already have an account?</p>
        <Link to="/">Proceed to Login Page</Link>
      </div>
    </div>
  );
}
