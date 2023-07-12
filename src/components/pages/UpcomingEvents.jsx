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
import Button from "@mui/material/Button";

import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

export default function UpcomingEvents() {
  const [lessons, setLessons] = useState([]);
  const [hangouts, setHangouts] = useState([]);

  const [registeredLessons, setRegisteredLessons] = useState([]);
  const [registeredHangouts, setRegisteredHangouts] = useState([]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

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
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const lessonDoc = doc(db, "lessons", id);
    await deleteDoc(lessonDoc);
    getLessons();
    setNotify({
      isOpen: true,
      message: "Successfully Deleted",
      type: "success",
    });
  };

  const deleteHangout = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const hangoutDoc = doc(db, "hangouts", id);
    await deleteDoc(hangoutDoc);
    getHangouts();
    setNotify({
      isOpen: true,
      message: "Successfully Deleted",
      type: "success",
    });
  };

  const withdrawFromLesson = async (lessonId) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const lessonRef = doc(db, "lessons", lessonId);
    await updateDoc(lessonRef, {
      registeredUsers: arrayRemove(auth.currentUser.uid),
    });
    getRegisteredLessons();
    setNotify({
      isOpen: true,
      message: "Successfully Withdrawn",
      type: "success",
    });
  };

  const withdrawFromHangout = async (hangoutId) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const hangoutRef = doc(db, "hangouts", hangoutId);
    await updateDoc(hangoutRef, {
      registeredUsers: arrayRemove(auth.currentUser.uid),
    });
    getRegisteredHangouts();
    setNotify({
      isOpen: true,
      message: "Successfully Withdrawn",
      type: "success",
    });
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
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this Lesson?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            deleteLesson(lesson.id);
                          },
                        })
                      }
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
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to withdraw from this Lesson?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            withdrawFromLesson(lesson.id);
                          },
                        })
                      }
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
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title:
                            "Are you sure to delete this Social Hangout Activity?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            deleteHangout(hangout.id);
                          },
                        })
                      }
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
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title:
                            "Are you sure to withdraw from this Social Hangout Activity?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            withdrawFromHangout(hangout.id);
                          },
                        })
                      }
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

      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}
