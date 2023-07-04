import React, { useState, useEffect } from "react";
import "../../../App.css";
import "./RegisteredUsers.css";
import { db } from "../../../config/firebase";
import {
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";

function LessonRegisteredUsers() {
  const location = useLocation();
  const lessonId = new URLSearchParams(location.search).get("lessonId");

  const [lesson, setLesson] = useState({
    sport: "",
    region: "",
    coachExp: "",
    description: "",
    hourlyRate: "",
    registeredUsers: [],
  });

  const lessonDocRef = doc(db, "lessons", lessonId);

  const getLesson = async () => {
    try {
      const docSnap = await getDoc(lessonDocRef);
      if (docSnap.exists()) {
        setLesson({ ...docSnap.data(), id: docSnap.id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLesson();
    };

    fetchData();
  }, []);

  const [registeredUsersProfiles, setRegisteredUsersProfiles] = useState([]);

  const getProfile = async (userId) => {
    const profileCollectionRef = query(
      collection(db, "users"),
      where("userId", "==", userId)
    );
    try {
      const data = await getDocs(profileCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return filteredData[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await Promise.all(
        lesson.registeredUsers.map((userId) => getProfile(userId))
      );
      setRegisteredUsersProfiles(profiles);
    };

    fetchProfiles();
  }, [lesson.registeredUsers]);

  return (
    <>
      <h1>Coaching Lesson</h1>

      <div>
        <div>
          <b>
            <label htmlFor="sport">Sport:</label>
          </b>
          <div>{lesson.sport}</div>
        </div>

        <div>
          <b>
            <label htmlFor="region">Region:</label>
          </b>
          <div>{lesson.region}</div>
        </div>

        <div>
          <b>
            <label htmlFor="coach-exp">Years of Coaching Exp.:</label>
          </b>
          <div>{lesson.coachExp}</div>
        </div>

        <div>
          <b>
            <label htmlFor="hourly-rate">Hourly Rate:</label>
          </b>
          <div>{lesson.hourlyRate}</div>
        </div>

        <div>
          <b>
            <label htmlFor="description">Description:</label>
          </b>
          <div>{lesson.description}</div>
        </div>
      </div>

      <h1>Registered Users</h1>

      {registeredUsersProfiles.map((profile) => {
        return (
          <div className="user-container">
            <div>
              <b>
                <label for="name">Name</label>
              </b>
              <div>{profile.name}</div>
            </div>

            <div>
              <b>
                <label for="gender">Gender</label>
              </b>
              <div>{profile.gender}</div>
            </div>

            <div>
              <b>
                <label for="dob">Date of Birth</label>
              </b>
              <div>{profile.dateOfBirth}</div>
            </div>

            <div>
              <b>
                <label for="teleTag">Telegram Tag</label>
              </b>
              <div>{profile.teleTag}</div>
            </div>

            <div>
              <b>
                <label for="experiences">Experiences</label>
              </b>
              <div>{profile.experiences}</div>
            </div>
          </div>
        );
      })}

      <a href="/upcoming-events">
        <button>Return to your Upcoming Events</button>
      </a>
    </>
  );
}

export default LessonRegisteredUsers;
