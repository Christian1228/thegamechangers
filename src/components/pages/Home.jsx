import React from "react";
import "../../App.css";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <h1>Any Sports &#x2022; All Communities &#x2022; One Platform</h1>
      <div className="cards-container">
        <div className="card-item">
          <h2>
            <i class="fas fa-chalkboard-teacher"></i>COACHING
          </h2>
          <div className="card-description">
            <h3>Looking to become a coach?</h3>
            <h3>Looking for prospective students?</h3>
          </div>
          <div className="card-buttons">
            <a href="/new-lesson-form" class="hero-btn">
              <button
                style={{
                  backgroundColor: "#6F8FAF",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Create a new lesson
              </button>
            </a>
          </div>
        </div>

        <div className="card-item">
          <h2>
            <i class="fas fa-dumbbell"></i>CLASSES
          </h2>
          <div className="card-description">
            <h3>Want to pick up a new sport?</h3>
            <h3>Not sure how?</h3>
          </div>
          <div className="card-buttons">
            <a href="/available-lessons" class="next-btn">
              <button
                style={{
                  backgroundColor: "#6F8FAF",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                View available classes
              </button>
            </a>
          </div>
        </div>

        <div className="card-item">
          <h2>
            <i class="fas fa-users"></i>SOCIAL HANGOUTS
          </h2>
          <div className="card-description">
            <h3>Looking for similar-interest friends?</h3>
          </div>
          <div className="card-buttons">
            <a href="/new-socialhangout-form" class="final-btn">
              <button
                style={{
                  backgroundColor: "#6F8FAF",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Create a new social hangout
              </button>
            </a>
            <a href="/available-socialhangouts" class="final-btn">
              <button
                style={{
                  backgroundColor: "#6F8FAF",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                View available social hangouts
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
