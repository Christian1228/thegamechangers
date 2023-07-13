import React, { useState } from "react";
import "../../../App.css";
import "./Form.css";
import { db, auth } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function LessonForm() {
  const [newSport, setNewSport] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newCoachExp, setNewCoachExp] = useState(0);
  const [newHourlyRate, setNewHourlyRate] = useState(0);
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

  const navigate = useNavigate();

  const lessonsCollectionRef = collection(db, "lessons");

  const onSubmitLesson = async () => {
    try {
      await addDoc(lessonsCollectionRef, {
        userId: auth?.currentUser?.uid,
        sport: newSport,
        region: newRegion,
        coachExp: newCoachExp,
        description: newDescription,
        hourlyRate: newHourlyRate,
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
        <h1 className="new-form">Start a New Coaching Lesson</h1>

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
              <label for="coach-exp">Years of Coaching Experience</label>
            </b>
            <input
              type="number"
              placeholder="Years of Coaching Experience..."
              onChange={(e) => setNewCoachExp(e.target.value)}
            />
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

          <div className="row">
            <b>
              <label for="hourly-rate">Hourly Rate ($)</label>
            </b>
            <input
              type="number"
              placeholder="Hourly Rate..."
              onChange={(e) => setNewHourlyRate(e.target.value)}
            />
          </div>

          <div className="button">
            <Button
              onClick={onSubmitLesson}
              variant="contained"
              color="success"
              style={{ height: "40px", lineHeight: "40px", fontSize: "15px" }}
            >
              Submit Form
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
