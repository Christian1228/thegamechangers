import React, { useState, useEffect } from "react";
import "../../../App.css";
import "./Form.css";
import { db } from "../../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateSocialHangoutForm() {
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
  });

  const [updatedSport, setUpdatedSport] = useState("");
  const [updatedRegion, setUpdatedRegion] = useState("");
  const [updatedLocation, setUpdatedLocation] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");
  const [updatedExpLevel, setUpdatedExpLevel] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

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
  const expLevelData = ["Beginner", "Intermediate", "Advanced", "Professional"];

  const navigate = useNavigate();

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

  const updateHangout = async () => {
    await updateDoc(hangoutDocRef, {
      sport: updatedSport,
      region: updatedRegion,
      location: updatedLocation,
      date: updatedDate,
      time: updatedTime,
      expLevel: updatedExpLevel,
      description: updatedDescription,
    });
    navigate("/upcoming-events");
  };

  useEffect(() => {
    const fetchData = async () => {
      await getHangout();
    };

    fetchData();
  }, []);

  useEffect(() => {
    setUpdatedSport(hangout.sport);
    setUpdatedRegion(hangout.region);
    setUpdatedLocation(hangout.location);
    setUpdatedDate(hangout.date);
    setUpdatedTime(hangout.time);
    setUpdatedExpLevel(hangout.expLevel);
    setUpdatedDescription(hangout.description);
  }, [hangout]);

  return (
    <>
      <div className="form">
        <h1 className="new-form">Update Social Hangout Activity</h1>

        <div>
          <div className="row">
            <b>
              <label htmlFor="sport">Sport</label>
            </b>
            <input
              list="sportData"
              placeholder="Sport..."
              value={updatedSport}
              onChange={(e) => setUpdatedSport(e.target.value)}
            />
            <datalist id="sportData">
              {sportData.map((op) => (
                <option key={op}>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label htmlFor="region">Coaching Region</label>
            </b>
            <input
              list="regionData"
              placeholder="Coaching Region..."
              value={updatedRegion}
              onChange={(e) => setUpdatedRegion(e.target.value)}
            />
            <datalist id="regionData">
              {regionData.map((op) => (
                <option key={op}>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label htmlFor="location">Location</label>
            </b>
            <input
              placeholder="Location..."
              value={updatedLocation}
              onChange={(e) => setUpdatedLocation(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label htmlFor="date">Date</label>
            </b>
            <input
              type="date"
              placeholder="Date..."
              value={updatedDate}
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label htmlFor="time">Time</label>
            </b>
            <input
              type="time"
              placeholder="Time..."
              value={updatedTime}
              onChange={(e) => setUpdatedTime(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label htmlFor="exp-level">Experience Level</label>
            </b>
            <input
              list="expLevelData"
              placeholder="Experience Level..."
              value={updatedExpLevel}
              onChange={(e) => setUpdatedExpLevel(e.target.value)}
            />
            <datalist id="expLevelData">
              {expLevelData.map((op) => (
                <option key={op}>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label htmlFor="description">Description</label>
            </b>
            <input
              placeholder="Description..."
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </div>

          <div className="button">
            <button onClick={updateHangout}>Update Activity</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateSocialHangoutForm;
