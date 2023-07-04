import React, { useState, useEffect } from "react";
import "../../App.css";
import "./UpcomingEvents.css";
import { db } from "../../config/firebase";
import {
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function UpcomingEvents() {
  const [lessons, setLessons] = useState([]);
  const [hangouts, setHangouts] = useState([]);

  const [registeredLessons, setRegisteredLessons] = useState([]);
  const [registeredHangouts, setRegisteredHangouts] = useState([]);

  const auth = getAuth();

  const lessonsCollectionRef = query(
    collection(db, "lessons"),
    where("userId", "==", auth.currentUser.uid)
  );

  const hangoutsCollectionRef = query(
    collection(db, "hangouts"),
    where("userId", "==", auth.currentUser.uid)
  );

  const getLessons = async () => {
    try {
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

  const getRegisteredLessons = async () => {
    try {
      const lessonsCollectionRef = collection(db, "lessons");
      const queryRef = query(
        lessonsCollectionRef,
        where("registeredUsers", "array-contains", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(queryRef);
      const registeredLessonsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRegisteredLessons(registeredLessonsData);
    } catch (err) {
      console.error(err);
    }
  };

  const getHangouts = async () => {
    try {
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

  const getRegisteredHangouts = async () => {
    try {
      const hangoutsCollectionRef = collection(db, "hangouts");
      const queryRef = query(
        hangoutsCollectionRef,
        where("registeredUsers", "array-contains", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(queryRef);
      const registeredHangoutsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRegisteredHangouts(registeredHangoutsData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLesson = async (id) => {
    const lessonDoc = doc(db, "lessons", id);
    await deleteDoc(lessonDoc);
    getLessons();
  };

  const deleteHangout = async (id) => {
    const lessonDoc = doc(db, "lessons", id);
    await deleteDoc(lessonDoc);
    getLessons();
  };

  const withdrawFromLesson = async (lessonId) => {
    const lessonRef = doc(db, "lessons", lessonId);
    await updateDoc(lessonRef, {
      registeredUsers: arrayRemove(auth.currentUser.uid),
    });
    getRegisteredLessons();
  };

  const withdrawFromHangout = async (hangoutId) => {
    const hangoutRef = doc(db, "hangouts", hangoutId);
    await updateDoc(hangoutRef, {
      registeredUsers: arrayRemove(auth.currentUser.uid),
    });
    getRegisteredHangouts();
  };

  useEffect(() => {
    getLessons();
    getRegisteredLessons();
    getHangouts();
    getRegisteredHangouts();
  }, []);

  return (
    <>
      <h1 className="header">Organized Classes</h1>

      <div>
        {lessons.map((lesson) => {
          return (
            <div className="lessons">
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

              <a href={`/lesson-registered-users?lessonId=${lesson.id}`}>
                <button>View Registered Users</button>
              </a>

              <a href={`/update-lesson-form?lessonId=${lesson.id}`}>
                <button>Update</button>
              </a>

              <button onClick={() => deleteLesson(lesson.id)}>Delete</button>
            </div>
          );
        })}
      </div>

      <h1 className="header">Registered Lessons</h1>
      <div>
        {registeredLessons.map((lesson) => {
          return (
            <div className="lessons">
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

              <button onClick={() => withdrawFromLesson(lesson.id)}>
                Withdraw
              </button>
            </div>
          );
        })}
      </div>

      <h1 className="header">Organized Social Hangouts</h1>

      <div>
        {hangouts.map((hangout) => {
          return (
            <div className="hangouts">
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

              <a href={`/hangout-registered-users?hangoutId=${hangout.id}`}>
                <button>View Registered Users</button>
              </a>

              <a href={`/update-socialhangout-form?hangoutId=${hangout.id}`}>
                <button>Update</button>
              </a>

              <button onClick={() => deleteHangout(hangout.id)}>Delete</button>
            </div>
          );
        })}
      </div>

      <h1 className="header">Registered Social Hangouts</h1>

      <div>
        {registeredHangouts.map((hangout) => {
          return (
            <div className="hangouts">
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

              <button onClick={() => withdrawFromHangout(hangout.id)}>
                Withdraw
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
