import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import UpcomingEvents from "./components/pages/UpcomingEvents";
import Login from "./components/pages/auth/Login";
import NewLessonForm from "./components/pages/forms/NewLessonForm";
import NewSocialHangoutForm from "./components/pages/forms/NewSocialHangoutForm";
import UpdateLessonForm from "./components/pages/forms/UpdateLessonForm";
import UpdateSocialHangoutForm from "./components/pages/forms/UpdateSocialHangoutForm";
import LessonRegisteredUsers from "./components/pages/profiles/LessonRegisteredUsers";
import HangoutRegisteredUsers from "./components/pages/profiles/HangoutRegisteredUsers";
import AvailableLessons from "./components/pages/AvailableLessons";
import AvailableSocialHangouts from "./components/pages/AvailableSocialHangouts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignUp from "./components/pages/auth/SignUp";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <>
      {authUser ? (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upcoming-events" element={<UpcomingEvents />} />
            <Route path="/new-lesson-form" element={<NewLessonForm />} />
            <Route
              path="/new-socialhangout-form"
              element={<NewSocialHangoutForm />}
            />
            <Route path="/update-lesson-form" element={<UpdateLessonForm />} />
            <Route
              path="/update-socialhangout-form"
              element={<UpdateSocialHangoutForm />}
            />
            <Route
              path="/lesson-registered-users"
              element={<LessonRegisteredUsers />}
            />
            <Route
              path="/hangout-registered-users"
              element={<HangoutRegisteredUsers />}
            />
            <Route path="/available-lessons" element={<AvailableLessons />} />
            <Route
              path="/available-socialhangouts"
              element={<AvailableSocialHangouts />}
            />
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
