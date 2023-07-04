import React, { useState } from "react";
import "../../../App.css";
import "./Form.css";
import { db, auth } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function NewSocialHangout() {
  const [newSport, setNewSport] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newExpLevel, setNewExpLevel] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const hangoutsCollectionRef = collection(db, "hangouts");

  const onSubmitHangout = async () => {
    try {
      await addDoc(hangoutsCollectionRef, {
        userId: auth?.currentUser?.uid,
        sport: newSport,
        region: newRegion,
        location: newLocation,
        date: newDate,
        time: newTime,
        expLevel: newExpLevel,
        description: newDescription,
        registeredUsers: [],
      });
      navigate("/upcoming-events");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="form">
        <h1 className="new-form">Start a New Social Hangout Activity</h1>

        <div>
          <div className="row">
            <b>
              <label for="sport">Sport</label>
            </b>
            <input
              list="sportData"
              placeholder="Sport..."
              onChange={(e) => setNewSport(e.target.value)}
            />
            <datalist id="sportData">
              {sportData.map((op) => (
                <option>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label for="region">Coaching Region</label>
            </b>
            <input
              list="regionData"
              placeholder="Coaching Region..."
              onChange={(e) => setNewRegion(e.target.value)}
            />
            <datalist id="regionData">
              {regionData.map((op) => (
                <option>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label for="location">Location</label>
            </b>
            <input
              placeholder="Location..."
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label for="date">Date</label>
            </b>
            <input
              type="date"
              placeholder="Date..."
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label for="time">Time</label>
            </b>
            <input
              type="time"
              placeholder="Time..."
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>

          <div className="row">
            <b>
              <label for="exp-level">Experience Level</label>
            </b>
            <input
              list="expLevelData"
              placeholder="Experience Level..."
              onChange={(e) => setNewExpLevel(e.target.value)}
            />
            <datalist id="expLevelData">
              {expLevelData.map((op) => (
                <option>{op}</option>
              ))}
            </datalist>
          </div>

          <div className="row">
            <b>
              <label for="description">Description</label>
            </b>
            <input
              placeholder="Description..."
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <div className="button">
            <button onClick={onSubmitHangout}>Submit Form</button>
          </div>
        </div>
      </div>
    </>
  );
}
