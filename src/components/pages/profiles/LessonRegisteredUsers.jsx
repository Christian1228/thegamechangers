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

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function LessonRegisteredUsers() {
  const location = useLocation();
  const lessonId = new URLSearchParams(location.search).get("lessonId");

  const [lesson, setLesson] = useState({
    sport: "",
    region: "",
    coachExp: "",
    description: "",
    hourlyRate: "",
    registeredUsers: [],
  });

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

  useEffect(() => {
    const fetchData = async () => {
      await getLesson();
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
        lesson.registeredUsers.map((userId) => getProfile(userId))
      );
      setRegisteredUsersProfiles(profiles);
    };

    fetchProfiles();
  }, [lesson.registeredUsers]);

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
    <div className="lesson-registered-users">
      <h1>Coaching Lesson</h1>

      <div className="registered-lesson">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 1200, maxWidth: 1350 }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="center">{lesson.sport}</StyledTableCell>
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
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <h1>Registered Users</h1>

      <div className="users">
        {registeredUsersProfiles.map((profile) => {
          return (
            <div className="user-card">
              <div className="user-info">
                <div className="user-sub-info">
                  <div className="user-name">
                    <b>
                      <label for="name">Name</label>
                    </b>
                    <div>{profile.name}</div>
                  </div>

                  <div className="user-other-info">
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
                  </div>
                </div>

                <div className="user-experiences">
                  <b>
                    <label for="experiences">Experiences</label>
                  </b>
                  <div>{profile.experiences}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="return-button">
        <a href="/upcoming-events">
          <Button variant="contained">Return to your Upcoming Events</Button>
        </a>
      </div>
    </div>
  );
}

export default LessonRegisteredUsers;
