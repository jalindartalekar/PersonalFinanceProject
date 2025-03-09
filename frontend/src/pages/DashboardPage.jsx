import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("income");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/transactions", {
          headers: {
            "x-auth-token": token,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Add a new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (parseFloat(transactionAmount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/transactions",
        {
          name: transactionName,
          amount: parseFloat(transactionAmount),
          type: transactionType,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setTransactions([...transactions, response.data]);
      setTransactionName("");
      setTransactionAmount("");
      setError(null);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    }
  };

  // Delete a transaction
  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      // Remove the transaction from the local state
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="dashboard-page" style={styles.dashboardPage}>
      <Header />
      <main className="dashboard-container" style={styles.dashboardContainer}>
        {/* Dashboard Header */}
        <div style={styles.dashboardHeader}>
          <h2 style={styles.dashboardTitle}>Dashboard</h2>
        </div>

        {/* Error Message */}
        {error && <p style={styles.errorMessage}>{error}</p>}

        {/* Summary Cards */}
        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardTitle}>Total Income</h3>
            <p style={styles.summaryCardAmount}>
              ₹{transactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardTitle}>Total Expenses</h3>
            <p style={styles.summaryCardAmount}>
              ₹{transactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardTitle}>Balance</h3>
            <p style={styles.summaryCardAmount}>
              ₹{(
                transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0) -
                transactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              ).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add Transaction Section */}
        <div style={styles.addTransactionSection}>
          <h3 style={styles.sectionTitle}>Add New Transaction</h3>
          <form onSubmit={handleAddTransaction} style={styles.transactionForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Transaction Name:</label>
              <input
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount:</label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={styles.select}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button type="submit" style={styles.addButton}>
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div style={styles.transactionsList}>
          <h3 style={styles.sectionTitle}>Transactions</h3>
          {loading ? (
            <p style={styles.loadingMessage}>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p style={styles.noTransactions}>No transactions added yet.</p>
          ) : (
            <ul style={styles.transactionsUl}>
              {transactions.map((transaction) => (
                <li key={transaction._id} style={styles.transactionItem}>
                  <span style={styles.transactionName}>{transaction.name}</span>
                  <span
                    style={
                      transaction.type === "income"
                        ? styles.incomeAmount
                        : styles.expenseAmount
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </span>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteTransaction(transaction._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  dashboardPage: {
    backgroundColor: "#0F0F0F", // Darker Black
    color: "#FFFFFF", // White text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  dashboardContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    flex: 1,
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  dashboardTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#FFFFFF", // White
  },
  summaryCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  summaryCard: {
    backgroundColor: "#1E1E1E", // Dark Gray
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    textAlign: "center",
  },
  summaryCardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#FFFFFF", // White
    marginBottom: "10px",
  },
  summaryCardAmount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4ECDC4", // Teal
  },
  addTransactionSection: {
    backgroundColor: "#1E1E1E", // Dark Gray
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#FFFFFF", // White
    marginBottom: "20px",
  },
  transactionForm: {
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
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#2E2E2E", // Lighter Gray
    color: "#FFFFFF", // White
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#2E2E2E", // Lighter Gray
    color: "#FFFFFF", // White
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  addButton: {
    padding: "12px",
    backgroundColor: "#4ECDC4", // Teal
    color: "#000000", // Black
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  transactionsList: {
    backgroundColor: "#1E1E1E", // Dark Gray
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  },
  noTransactions: {
    color: "#FFFFFF", // White
    textAlign: "center",
    fontSize: "16px",
  },
  loadingMessage: {
    color: "#FFFFFF", // White
    textAlign: "center",
    fontSize: "16px",
  },
  transactionsUl: {
    listStyle: "none",
    padding: 0,
  },
  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #444",
  },
  transactionName: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#FFFFFF", // White
  },
  incomeAmount: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#00FF00", // Green for income
  },
  expenseAmount: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FF0000", // Red for expense
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#FF4D4D", // Red
    color: "#FFFFFF", // White
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  errorMessage: {
    color: "#FF0000", // Red
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "16px",
  },
};


export default DashboardPage;