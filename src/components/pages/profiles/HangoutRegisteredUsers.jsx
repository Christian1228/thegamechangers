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

function HangoutRegisteredUsers() {
  const location = useLocation();
  const hangoutId = new URLSearchParams(location.search).get("hangoutId");

  const [hangout, setHangout] = useState({
    sport: "",
    region: "",
    location: "",
    date: "",
    time: "",
    expLevel: "",
    description: "",
    registeredUsers: [],
  });

  const hangoutDocRef = doc(db, "hangouts", hangoutId);

  const getHangout = async () => {
    try {
      const docSnap = await getDoc(hangoutDocRef);
      if (docSnap.exists()) {
        setHangout({ ...docSnap.data(), id: docSnap.id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getHangout();
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
        hangout.registeredUsers.map((userId) => getProfile(userId))
      );
      setRegisteredUsersProfiles(profiles);
    };

    fetchProfiles();
  }, [hangout.registeredUsers]);

  return (
    <>
      <h1>Social Hangout Activity</h1>

      <div>
        <div>
          <b>
            <label htmlFor="sport">Sport:</label>
          </b>
          <div>{hangout.sport}</div>
        </div>

        <div>
          <b>
            <label htmlFor="region">Region:</label>
          </b>
          <div>{hangout.region}</div>
        </div>

        <div>
          <b>
            <label htmlFor="location">Location:</label>
          </b>
          <div>{hangout.location}</div>
        </div>

        <div>
          <b>
            <label htmlFor="date">Date:</label>
          </b>
          <div>{hangout.date}</div>
        </div>

        <div>
          <b>
            <label htmlFor="time">Time:</label>
          </b>
          <div>{hangout.time}</div>
        </div>

        <div>
          <b>
            <label htmlFor="exp-level">Experience Level:</label>
          </b>
          <div>{hangout.expLevel}</div>
        </div>

        <div>
          <b>
            <label htmlFor="description">Description:</label>
          </b>
          <div>{hangout.description}</div>
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

export default HangoutRegisteredUsers;
