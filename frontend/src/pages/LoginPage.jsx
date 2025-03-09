import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Save token in local storage
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page" style={styles.loginPage}>
      <Header />
      <section className="hero-section" style={styles.heroSection}>
        <main className="login-container" style={styles.loginContainer}>
          <h2 style={styles.loginTitle}>Login</h2>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <form className="login-form" onSubmit={handleLogin} style={styles.loginForm}>
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
            <button type="submit" style={styles.loginButton}>
              Login
            </button>
          </form>
          <p style={styles.registerText}>
            Don't have an account? <a href="/register" style={styles.registerLink}>Register here</a>.
          </p>
        </main>
      </section>
      <Footer />
    </div>
  );
};

const styles = {
  loginPage: {
    backgroundColor: "#000000", // Black
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
    background: "linear-gradient(135deg, #000000, #1A1A1A)", // Black to Dark Gray gradient
  },
  loginContainer: {
    backgroundColor: "#1A1A1A", // Dark Gray
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  loginTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#FFFFFF", // White
  },
  errorMessage: {
    color: "#FF4D4D", // Red
    marginBottom: "20px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#FFFFFF", // White
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#3A3A3A", // Lighter Gray
    color: "#FFFFFF", // White
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  loginButton: {
    padding: "12px",
    backgroundColor: "#FFFFFF", // White
    color: "#000000", // Black
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  registerText: {
    marginTop: "20px",
    color: "#FFFFFF", // White
  },
  registerLink: {
    color: "#FFFFFF", // White
    textDecoration: "none",
    fontWeight: "bold",
    borderBottom: "2px solid #FFFFFF", // White underline
  },
};


export default LoginPage;