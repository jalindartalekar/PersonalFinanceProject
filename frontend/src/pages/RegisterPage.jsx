import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Save token in local storage
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      // Display server error message if available
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page" style={styles.registerPage}>
      <Header />
      <section className="hero-section" style={styles.heroSection}>
        <main className="register-container" style={styles.registerContainer}>
          <h2 style={styles.registerTitle}>Register</h2>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <form className="register-form" onSubmit={handleRegister} style={styles.registerForm}>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.registerButton}>
              Register
            </button>
          </form>
          <p style={styles.loginText}>
            Already have an account?{" "}
            <a href="/login" style={styles.loginLink}>
              Login here
            </a>
            .
          </p>
        </main>
      </section>
      <Footer />
    </div>
  );
};

const styles = {
  registerPage: {
    backgroundColor: "#0F0F0F", // Darker Black
    color: "#FFFFFF", // White text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  heroSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "40px 20px",
    background: "linear-gradient(135deg, #0F0F0F, #1A1A1A)", // Darker gradient
  },
  registerContainer: {
    backgroundColor: "#1E1E1E", // Dark Gray
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  registerTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#FFFFFF", // White
  },
  errorMessage: {
    color: "#FF4D4D", // Red
    marginBottom: "20px",
    fontSize: "14px",
  },
  registerForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#FFFFFF", // White
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#2E2E2E", // Lighter Gray
    color: "#FFFFFF", // White
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  registerButton: {
    padding: "12px",
    backgroundColor: "#4ECDC4", // Teal
    color: "#000000", // Black
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  loginText: {
    marginTop: "20px",
    color: "#FFFFFF", // White
    fontSize: "14px",
  },
  loginLink: {
    color: "#4ECDC4", // Teal
    textDecoration: "none",
    fontWeight: "bold",
    borderBottom: "2px solid #4ECDC4", // Teal underline
    transition: "color 0.3s ease",
  },
};


export default RegisterPage;