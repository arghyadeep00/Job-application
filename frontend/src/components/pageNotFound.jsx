import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>
        Sorry, the page you’re looking for doesn’t exist or was moved.
      </p>

      <Link to="/" style={styles.button}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    color: "black",
    textAlign: "center",
    padding: "20px",
  },
  code: {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: 0,
    color: "#38bdf8",
  },
  title: {
    fontSize: "2rem",
    margin: "10px 0",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "20px",
    color: "black",
  },
  button: {
    padding: "10px 20px",
    background: "#38bdf8",
    color: "black",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default PageNotFound;
