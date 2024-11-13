import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router

const SignIn = () => {
  const styles = {
    body: {
      backgroundColor: '#f8e7f2',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      padding: '20px',
    },
    container: {
      backgroundColor: '#ffffff',
      border: '2px solid #e8c1e1',
      borderRadius: '15px',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
      width: '400px',
      padding: '40px',
      textAlign: 'center',
    },
    h1: {
      color: '#d16a99',
      fontSize: '30px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '16px',
      color: '#5c375d',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid #e8c1e1',
      borderRadius: '8px',
      boxSizing: 'border-box',
      backgroundColor: '#f2d3e4',
    },
    button: {
      backgroundColor: '#f4a4b8',
      border: 'none',
      color: 'white',
      padding: '15px 20px',
      textAlign: 'center',
      display: 'inline-block',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '8px',
      width: '100%',
    },
    buttonHover: {
      '&:hover': {
        backgroundColor: '#d16a99',
      },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-in logic here
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Luminary</h1>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="username">
            Username:
          </label>
          <input
            style={styles.input}
            type="text"
            id="username"
            required
          />
          <label style={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            required
          />
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/sign-up">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn; 