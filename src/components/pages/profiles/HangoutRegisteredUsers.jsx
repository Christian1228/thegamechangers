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

function HangoutRegisteredUsers() {
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
    registeredUsers: [],
  });

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

  useEffect(() => {
    const fetchData = async () => {
      await getHangout();
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
        hangout.registeredUsers.map((userId) => getProfile(userId))
      );
      setRegisteredUsersProfiles(profiles);
    };

    fetchProfiles();
  }, [hangout.registeredUsers]);

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
    <div className="hangout-registered-users-container">
      <div className="chosen-hangout">
        <div className="registered-users-headers">
          <h1>Social Hangout Activity</h1>
        </div>

        <div className="registered-hangout">
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
                <StyledTableRow>
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
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="hangout-registered-users">
        <div className="registered-users-headers">
          <h1>Registered Users</h1>
        </div>

        <div className="users">
          {registeredUsersProfiles.length === 0 ? (
            <div className="empty-info">No Available Social Hangouts</div>
          ) : (
            registeredUsersProfiles.map((profile) => {
              return (
                <div className="user-card">
                  <div className="user-info">
                    <div className="user-sub-info">
                      <div className="card-contents">
                        <div className="card-labels">
                          <b>
                            <label for="name">Name</label>
                          </b>
                        </div>
                        <div>{profile.name}</div>
                      </div>

                      <div className="user-other-info">
                        <div className="card-contents">
                          <div className="card-labels">
                            <b>
                              <label for="gender">Gender</label>
                            </b>
                          </div>
                          <div>{profile.gender}</div>
                        </div>

                        <div className="card-contents">
                          <div className="card-labels">
                            <b>
                              <label for="dob">Date of Birth</label>
                            </b>
                          </div>
                          <div>{profile.dateOfBirth}</div>
                        </div>

                        <div className="card-contents">
                          <div className="card-labels">
                            <b>
                              <label for="teleTag">Telegram Tag</label>
                            </b>
                          </div>
                          <div>{profile.teleTag}</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-contents">
                      <div className="card-labels">
                        <b>
                          <label for="experiences">Experiences</label>
                        </b>
                      </div>
                      <div>{profile.experiences}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="return-button">
          <a href="/upcoming-events">
            <Button variant="contained">Return to your Upcoming Events</Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HangoutRegisteredUsers;
