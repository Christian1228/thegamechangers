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

function AvailableSocialHangouts() {
  const [hangouts, setHangouts] = useState([]);
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

  const getHangouts = async () => {
    try {
      const hangoutsCollectionRef = query(
        collection(db, "hangouts"),
        where("userId", "!=", auth.currentUser.uid),
        ...(selectedSport ? [where("sport", "==", selectedSport)] : []),
        ...(selectedRegion ? [where("region", "==", selectedRegion)] : [])
      );

      const data = await getDocs(hangoutsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setHangouts(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const getProfiles = async () => {
    const profilePromises = hangouts.map((hangout) =>
      getProfile(hangout.userId)
    );
    try {
      const profilesData = await Promise.all(profilePromises);
      const profilesObj = profilesData.reduce((obj, profile, index) => {
        obj[hangouts[index].id] = profile;
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
    const hangoutRef = doc(db, "hangouts", id);
    await updateDoc(hangoutRef, {
      registeredUsers: arrayUnion(newUserId),
    });
    getHangouts();
  };

  useEffect(() => {
    getHangouts();
  }, [selectedSport, selectedRegion]);

  useEffect(() => {
    if (hangouts.length > 0) {
      getProfiles();
    }
  }, [hangouts]);

  return (
    <div className="available-hangouts-container">
      <div className="available-hangouts">
        <div className="top-section">
          <div className="avail-header">
            <h1>Available Social Hangouts</h1>
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
          {hangouts.length === 0 ? (
            <div className="empty-info">No Available Social Hangouts</div>
          ) : (
            hangouts.map((hangout) => {
              const profile = profiles[hangout.id];
              return (
                <div className="hangout-card">
                  <div className="hangout-info">
                    <div key={hangout.id}>
                      <div className="hangout-sub-info">
                        <div className="organiser-info">
                          <div className="card-labels">
                            <b>
                              <label htmlFor="name">Organiser's Name:</label>
                            </b>
                          </div>
                          <div>{profile && profile.name}</div>
                        </div>

                        <div className="hangout-other-info">
                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="sport">Sport:</label>
                              </b>
                            </div>
                            <div>{hangout.sport}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="region">Region:</label>
                              </b>
                            </div>
                            <div>{hangout.region}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="location">Location:</label>
                              </b>
                            </div>
                            <div>{hangout.location}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="date">Date:</label>
                              </b>
                            </div>
                            <div>{hangout.date}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="time">Time:</label>
                              </b>
                            </div>
                            <div>{hangout.time}</div>
                          </div>

                          <div className="card-contents">
                            <div className="card-labels">
                              <b>
                                <label htmlFor="exp-level">
                                  Experience Level:
                                </label>
                              </b>
                            </div>
                            <div>{hangout.expLevel}</div>
                          </div>
                        </div>
                      </div>

                      <div className="card-contents">
                        <div className="card-labels">
                          <b>
                            <label htmlFor="description">Description:</label>
                          </b>
                        </div>
                        <div>{hangout.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="register-button">
                    {hangout.registeredUsers.includes(auth.currentUser.uid) ? (
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
                            hangout.id
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

export default AvailableSocialHangouts;
