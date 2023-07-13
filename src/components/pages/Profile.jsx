import React, { useState, useEffect } from "react";
import "../../App.css";
import "./Profile.css";
import { db } from "../../config/firebase";
import {
  getDocs,
  updateDoc,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Button from "@mui/material/Button";

export default function Profile() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [teleTag, setTeleTag] = useState("");
  const [experiences, setExperiences] = useState("");

  const genderData = ["Male", "Female"];

  const auth = getAuth();

  const profilesCollectionRef = query(
    collection(db, "users"),
    where("userId", "==", auth.currentUser.uid)
  );

  const updateProfile = async (id) => {
    const profileDoc = doc(db, "users", id);
    await updateDoc(profileDoc, {
      email: email,
      name: name,
      gender: gender,
      dateOfBirth: dob,
      teleTag: teleTag,
      experiences: experiences,
    });
  };

  const getProfiles = async () => {
    try {
      const data = await getDocs(profilesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfiles(filteredData);
      setSelectedProfile(filteredData[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      setEmail(selectedProfile.email);
      setName(selectedProfile.name);
      setGender(selectedProfile.gender);
      setDOB(selectedProfile.dateOfBirth);
      setTeleTag(selectedProfile.teleTag);
      setExperiences(selectedProfile.experiences);
    }
  }, [selectedProfile]);

  const handleProfileSelection = (profile) => {
    setSelectedProfile(profile);
  };

  return (
    <>
      <h1 className="profile">PROFILE</h1>

      <div className="user-details">
        {profiles.map((profile) => (
          <div key={profile.id} onClick={() => handleProfileSelection(profile)}>
            <div className="email-item">
              <label for="email">Email Address</label>
              <input type="email" value={email} />
            </div>

            <div className="name-item">
              <label for="name">Preferred Name</label>
              <input
                placeholder="Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="gender-item">
              <label for="gender">Gender</label>
              <input
                list="genderData"
                placeholder="Gender..."
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <datalist id="genderData">
                {genderData.map((op) => (
                  <option>{op}</option>
                ))}
              </datalist>
            </div>

            <div className="date-item">
              <label for="dob">Date of Birth</label>
              <input
                type="date"
                placeholder="Date of Birth..."
                value={dob}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>

            <div className="telegram-item">
              <label for="teleTag">Telegram Tag</label>
              <input
                placeholder="Telegram Tag..."
                value={teleTag}
                onChange={(e) => setTeleTag(e.target.value)}
              />
            </div>

            <div className="experience-item">
              <label for="experiences">Your Experiences</label>
              <input
                placeholder="Experiences..."
                value={experiences}
                onChange={(e) => setExperiences(e.target.value)}
              />
            </div>

            <div className="btn-save">
              <Button
                onClick={() => updateProfile(profile.id)}
                variant="contained"
                color="success"
                style={{ height: "40px", lineHeight: "40px", fontSize: "15px" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
