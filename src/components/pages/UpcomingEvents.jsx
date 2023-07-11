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

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div className="upcoming-events">
      <h1 className="header">Organized Classes</h1>

      {/* 
      <div className="row-headers">
        <b>
          <label htmlFor="sport">Sport</label>
        </b>
        <b>
          <label htmlFor="region">Region</label>
        </b>
        <b>
          <label htmlFor="coach-exp">Years of Coaching Exp.</label>
        </b>
        <b>
          <label htmlFor="hourly-rate">Hourly Rate</label>
        </b>
        <b>
          <label htmlFor="description">Description</label>
        </b>
      </div>

      <div>
        {lessons.map((lesson) => {
          return (
            <div className="lessons">
              <div className="lesson-info">
                <div className="lesson-info-items">{lesson.sport}</div>
                <div className="lesson-info-items">{lesson.region}</div>
                <div className="lesson-info-items">{lesson.coachExp}</div>
                <div className="lesson-info-items">{lesson.hourlyRate}</div>
                <div className="lesson-info-items">{lesson.description}</div>
              </div>

              <div className="lesson-buttons">
                <a href={`/lesson-registered-users?lessonId=${lesson.id}`}>
                  <button>View Registered Users</button>
                </a>

                <a href={`/update-lesson-form?lessonId=${lesson.id}`}>
                  <button>Update</button>
                </a>

                <button onClick={() => deleteLesson(lesson.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      */}

      <div className="organised-lessons">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 1100, maxWidth: 1250 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sport</StyledTableCell>
                <StyledTableCell align="center">Region</StyledTableCell>
                <StyledTableCell align="center">
                  Years of Coaching Exp.
                </StyledTableCell>
                <StyledTableCell align="center">
                  Hourly Rate&nbsp;($)
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((lesson) => (
                <StyledTableRow key={lesson.id}>
                  <StyledTableCell align="center">
                    {lesson.sport}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.region}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.coachExp}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.hourlyRate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <a href={`/lesson-registered-users?lessonId=${lesson.id}`}>
                      <Button variant="contained">View Registered Users</Button>
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <a href={`/update-lesson-form?lessonId=${lesson.id}`}>
                      <Button variant="outlined">Update</Button>
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      onClick={() => deleteLesson(lesson.id)}
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <h1 className="header">Registered Lessons</h1>

      <div className="registered-lessons">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 1100, maxWidth: 1250 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sport</StyledTableCell>
                <StyledTableCell align="center">Region</StyledTableCell>
                <StyledTableCell align="center">
                  Years of Coaching Exp.
                </StyledTableCell>
                <StyledTableCell align="center">
                  Hourly Rate&nbsp;($)
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredLessons.map((lesson) => (
                <StyledTableRow key={lesson.id}>
                  <StyledTableCell align="center">
                    {lesson.sport}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.region}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.coachExp}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.hourlyRate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {lesson.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      onClick={() => withdrawFromLesson(lesson.id)}
                      variant="outlined"
                      color="error"
                    >
                      Withdraw
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <h1 className="header">Organized Social Hangouts</h1>

      <div className="organised-hangouts">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 1200, maxWidth: 1350 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sport</StyledTableCell>
                <StyledTableCell align="center">Region</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Time</StyledTableCell>
                <StyledTableCell align="center">
                  Experience Level
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hangouts.map((hangout) => (
                <StyledTableRow key={hangout.id}>
                  <StyledTableCell align="center">
                    {hangout.sport}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.region}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.location}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.time}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.expLevel}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <a
                      href={`/hangout-registered-users?hangoutId=${hangout.id}`}
                    >
                      <Button variant="contained">View Registered Users</Button>
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <a
                      href={`/update-socialhangout-form?hangoutId=${hangout.id}`}
                    >
                      <Button variant="outlined">Update</Button>
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      onClick={() => deleteHangout(hangout.id)}
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <h1 className="header">Registered Social Hangouts</h1>

      <div className="registered-hangouts">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 1200, maxWidth: 1350 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sport</StyledTableCell>
                <StyledTableCell align="center">Region</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Time</StyledTableCell>
                <StyledTableCell align="center">
                  Experience Level
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredHangouts.map((hangout) => (
                <StyledTableRow key={hangout.id}>
                  <StyledTableCell align="center">
                    {hangout.sport}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.region}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.location}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.time}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.expLevel}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {hangout.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      onClick={() => withdrawFromHangout(hangout.id)}
                      variant="outlined"
                      color="error"
                    >
                      Withdraw
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
