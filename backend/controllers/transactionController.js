const Transaction = require("../models/Transaction");

// Add a new transaction
const addTransaction = async (req, res) => {
  const { name, amount, type } = req.body;


  
  try {
    const newTransaction = new Transaction({
      userId: req.user.id,
      name,
      amount,
      type,
    });

    await newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { addTransaction, getTransactions };