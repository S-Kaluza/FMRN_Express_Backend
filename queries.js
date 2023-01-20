const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fmrn_express_db',
  password: 'postgres',
  port: 5432,
})

const loginUser = (request, response) => {
    const { user_email, user_password } = request.body;
    console.log(user_email);
    
    pool.query('SELECT * FROM users WHERE user_email = $1 AND user_password = $2', [user_email, user_password], (error, results) => {
        if (error) {
            response.status(404).json({massage: "error"})
        } else if(results.rows.length == 0) {
            response.status(404).json({email: user_email, pass: user_password, massage: "not found"})
        } else {
            response.status(200).json(results.rows)
        }
    })
}

const registerUser = (request, response) => {
    const { user_name, user_email, user_password } = request.body;
    const user_token = generateToken(255);
    console.log(user_token);

    pool.query('SELECT * FROM users WHERE user_email = $1 AND user_password = $2', [user_email, user_password], (error, results) => {
        if (error) {
            response.status(404).json({massage: "error"})
        } else if(results.rows.length > 0) {
            response.status(404).json({email: user_email, massage: "already exists"})
        }else{
    pool.query('INSERT INTO users (user_name, user_email, user_password, user_token) VALUES ($1, $2, $3, $4)', [user_name, user_email, user_password, user_token], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).send(`User added with ID: ${results.insertId}`)
    })}
    });
}

const getIncomes = (request, response) => {
  const user_token =request.headers['x-api-key'];
  console.log(user_token);
  pool.query('SELECT * FROM incomes WHERE token=$1 ORDER BY income_id ASC', [user_token], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getIncomeById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM incomes WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createIncome = (request, response) => {
  const { income_name, income_value, income_description, income_date } = request.body;
  const user_token =request.headers['x-api-key'];

  pool.query('INSERT INTO incomes (income_name, income_value, income_description, income_date, token) VALUES ($1, $2, $3, $4, $5)', [income_name, income_value, income_description, income_date, user_token], (error, results) => {
    if (error) {
      console.log(error);
    } else response.status(200).send(results.command)
  })
}

const getExpenses = (request, response) => {
    const user_token =request.headers['x-api-key'];
    console.log(user_token);
    pool.query('SELECT * FROM expenses WHERE token=$1 ORDER BY expense_id ASC', [user_token], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createExpense = (request, response) => {
    const { expense_name, expense_value, expense_description, expense_date } = request.body;
    const user_token = request.headers['x-api-key'];
    console.log('create_expense');
  
    pool.query('INSERT INTO expenses (expense_name, expense_value, expense_description, expense_date, token) VALUES ($1, $2, $3, $4, $5)', [expense_name, expense_value, expense_description, expense_date, user_token], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Add user expense`)
    })
  }

const updateIncome = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE income SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteIncome = (request, response) => {
    const income_id = parseInt(request.body.income_id)

  pool.query('DELETE FROM incomes WHERE income_id = $1', [income_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${income_id}`)
  })
}

const deleteExpense = (request, response) => {
    const expense_id = parseInt(request.body.expense_id)
  
    pool.query('DELETE FROM expenses WHERE expense_id = $1', [expense_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${expense_id}`)
    })
  }



module.exports = {
  getIncomes,
  getExpenses,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteExpense,
  deleteIncome,
  createExpense,
  loginUser,
  registerUser,
}

function generateToken(length){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}