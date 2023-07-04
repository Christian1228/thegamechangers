import React, { useState } from "react";
import "../../../App.css";
import "./Auth.css";
import { db, auth, googleProvider } from "../../../config/firebase";
import { addDoc, collection, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });

    setEmail("");
    setPassword("");
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const docRef = query(
          collection(db, "users"),
          where("userId", "==", auth.currentUser.uid)
        );
        const doc = docRef.get();

        if (doc.exists) {
          console.log(userCredential);
        } else {
          addDoc(collection(db, "users"), {
            userId: userCredential.user.uid,
            email: userCredential.user.email,
            name: "",
            gender: "",
            dateOfBirth: "",
            teleTag: "",
            experiences: [],
          });
          console.log(userCredential);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login">
      <div className="login-container">
        <img className="cover-logo" src="./images/Logo.png" alt="" />
        <h1>THE GAME CHANGERS</h1>
        <form className="login-form" onSubmit={signIn}>
          <h3>Log in to your Account</h3>
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
          <button type="submit">Sign In</button>
        </form>

        <p>or login using</p>
        <button onClick={signInWithGoogle}>Google</button>

        <p>Don't have an account?</p>
        <Link to="/signup">Create New Account</Link>
      </div>
    </div>
  );
}
