import React, { useState, useEffect } from "react";
import "../../../App.css";
import "./Availability.css";
import { db } from "../../../config/firebase";
import {
  getDocs,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Button from "@mui/material/Button";

function AvailableLessons() {
  const [lessons, setLessons] = useState([]);
  const [profiles, setProfiles] = useState({});

  // Filters
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const sportData = [
    "Badminton",
    "Basketball",
    "Bowling",
    "Cycling",
    "Football",
    "Kayaking",
    "Rugby",
    "Squash",
    "Swimming",
    "Table Tennis",
    "Tennis",
    "Track and Field",
    "Touch Rugby",
    "Water Polo",
  ];
  const regionData = ["North", "South", "East", "West", "Central"];

  const auth = getAuth();

  const getLessons = async () => {
    try {
      const lessonsCollectionRef = query(
        collection(db, "lessons"),
        where("userId", "!=", auth.currentUser.uid),
        ...(selectedSport ? [where("sport", "==", selectedSport)] : []),
        ...(selectedRegion ? [where("region", "==", selectedRegion)] : [])
      );

      const data = await getDocs(lessonsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLessons(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const getProfiles = async () => {
    const profilePromises = lessons.map((lesson) => getProfile(lesson.userId));
    try {
      const profilesData = await Promise.all(profilePromises);
      const profilesObj = profilesData.reduce((obj, profile, index) => {
        obj[lessons[index].id] = profile;
        return obj;
      }, {});
      setProfiles(profilesObj);
    } catch (err) {
      console.error(err);
    }
  };

  const getProfile = async (id) => {
    const profilesCollectionRef = query(
      collection(db, "users"),
      where("userId", "==", id)
    );

    try {
      const data = await getDocs(profilesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return filteredData[0];
    } catch (err) {
      console.error(err);
    }
  };

  const updateRegisteredUsers = async (newUserId, id) => {
    const lessonRef = doc(db, "lessons", id);
    await updateDoc(lessonRef, {
      registeredUsers: arrayUnion(newUserId),
    });
    getLessons();
  };

  useEffect(() => {
    getLessons();
  }, [selectedSport, selectedRegion]);

  useEffect(() => {
    if (lessons.length > 0) {
      getProfiles();
    }
  }, [lessons]);

  return (
    <div className="available-classes-container">
      <div className="available-classes">
        <div className="top-section">
          <div className="avail-header">
            <h1>Available Classes</h1>
          </div>

          <div className="filters">
            <div className="filter">
              <label htmlFor="sportFilter" className="filter-labels">
                Sport:
              </label>
              <select
                id="sportFilter"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <option value="">All Sports</option>
                {sportData.map((op) => (
                  <option>{op}</option>
                ))}
              </select>
            </div>

            <div className="filter">
              <label htmlFor="regionFilter" className="filter-labels">
                Region:
              </label>
              <select
                id="regionFilter"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regionData.map((op) => (
                  <option>{op}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="body">
          {lessons.length === 0 ? (
            <div className="empty-info">No Available Lessons</div>
          ) : (
            lessons.map((lesson) => {
              const profile = profiles[lesson.id];
              return (
                <div className="lesson-card">
                  <div className="lesson-info">
                    <div key={lesson.id}>
                      <div className="lesson-sub-info">
                        <div className="coach-info">
                          <div className="card-labels">
                            <b>
                              <label htmlFor="name">Coach's Name:</label>
                            </b>
                          </div>
                          <div>{profile && profile.name}</div>
                        </div>

                        <div className="lesson-other-info">
                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="sport">Sport:</label>
                              </b>
                            </div>
                            <div>{lesson.sport}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="region">Region:</label>
                              </b>
                            </div>
                            <div>{lesson.region}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="coach-exp">
                                  Years of Coaching Exp.:
                                </label>
                              </b>
                            </div>
                            <div>{lesson.coachExp}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="hourly-rate">
                                  Hourly Rate:
                                </label>
                              </b>
                            </div>
                            <div>{lesson.hourlyRate}</div>
                          </div>
                        </div>
                      </div>

                      <div className="card-contents">
                        <div className="card-labels">
                          <b>
                            <label htmlFor="description">Description:</label>
                          </b>
                        </div>
                        <div>{lesson.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="register-button">
                    {lesson.registeredUsers.includes(auth.currentUser.uid) ? (
                      <Button variant="contained" disabled>
                        Registered
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.preventDefault();
                          updateRegisteredUsers(
                            auth.currentUser.uid,
                            lesson.id
                          ).then(() => {
                            window.location.href = "/upcoming-events";
                          });
                        }}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailableLessons;
