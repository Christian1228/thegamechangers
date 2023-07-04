import React, { useState, useEffect } from "react";
import "../../../App.css";
import "./Form.css";
import { db } from "../../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateLessonForm() {
  const location = useLocation();
  const lessonId = new URLSearchParams(location.search).get("lessonId");

  const [lesson, setLesson] = useState({
    sport: "",
    region: "",
    coachExp: "",
    description: "",
    hourlyRate: "",
  });

  const [updatedSport, setUpdatedSport] = useState("");
  const [updatedRegion, setUpdatedRegion] = useState("");
  const [updatedCoachExp, setUpdatedCoachExp] = useState(0);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedHourlyRate, setUpdatedHourlyRate] = useState(0);

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

  const updateLesson = async () => {
    await updateDoc(lessonDocRef, {
      sport: updatedSport,
      region: updatedRegion,
      coachExp: updatedCoachExp,
      description: updatedDescription,
      hourlyRate: updatedHourlyRate,
    });
    navigate("/upcoming-events");
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLesson();
    };

    fetchData();
  }, []);

  useEffect(() => {
    setUpdatedSport(lesson.sport);
    setUpdatedRegion(lesson.region);
    setUpdatedCoachExp(lesson.coachExp);
    setUpdatedDescription(lesson.description);
    setUpdatedHourlyRate(lesson.hourlyRate);
  }, [lesson]);

  return (
    <>
      <div className="form">
        <h1 className="new-form">Update Coaching Lesson</h1>

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
              <label htmlFor="coach-exp">Years of Coaching Experience</label>
            </b>
            <input
              type="number"
              placeholder="Location..."
              value={updatedCoachExp}
              onChange={(e) => setUpdatedCoachExp(e.target.value)}
            />
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

          <div className="row">
            <b>
              <label htmlFor="hourly-rate">Hourly Rate ($)</label>
            </b>
            <input
              type="number"
              placeholder="Hourly Rate..."
              value={updatedHourlyRate}
              onChange={(e) => setUpdatedHourlyRate(e.target.value)}
            />
          </div>

          <div className="button">
            <button onClick={updateLesson}>Update Lesson</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateLessonForm;
