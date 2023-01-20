// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/user/income', db.getIncomes);
app.get('/api/user/expense', db.getExpenses);
app.delete('/api/user/income', db.deleteIncome);
app.delete('/api/user/expense', db.deleteExpense);
app.post('/api/user/income', db.createIncome);
app.post('/api/user/expense', db.createExpense);
app.post('/api/user/login', db.loginUser);
app.post('/api/user/register', db.registerUser);


app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});
