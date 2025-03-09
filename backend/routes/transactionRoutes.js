const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addTransaction, getTransactions } = require("../controllers/transactionController");

const router = express.Router();

// Add a new transaction
router.post("/", authMiddleware, addTransaction);

// Get all transactions for a user
router.get("/", authMiddleware, getTransactions);

module.exports = router;

