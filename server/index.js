const express = require('express');
var cors = require('cors')
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.use(cors());
// const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tasktest',
  connectionLimit: 10

});

connection.connect();

// app.use(bodyParser.json());

app.get('/sectors', (req, res) => {
  connection.query('SELECT * FROM sectors', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(results);
      // console.log("results")
    }
  });
});
app.get('/workers', (req, res) => {
  connection.query('SELECT * FROM workers', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(results);
      
    }
  });
});

app.post("/workers", (req, res) => {
  const data = req.body;
  console.log(data);
  const sql = `INSERT INTO workers (name, sector, terms) VALUES (?, ?, ?)`;
  const values = [data.name, data.sector, data.terms];
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error saving data to database");
    } else {
      res.send("Data saved successfully");
    }
  });  
});
// app.put('/update/:id', (req, res) => {
//   const data = req.body;
//   console.log(data)
//    const sql = `UPDATE workers SET (name, sector, terms) VALUES (?, ?, ?) WHERE id = ${req.params.id}`;
//   connection.query(sql, (error, results) => {
//     if (error) {
//       return res.status(500).json({ error });
//     }
//     return res.json({ message: 'Data updated successfully' });
//   });
// });
app.get('/workers/:id', (req, res) => {
  const {id} = req.params
  const sql = 'SELECT * FROM workers where id = ?'
  connection.query(sql, id,  (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(results);
    }
  });
});

app.get('/update/:id', (req, res) => {
  const id = req.params.id;
  // const { name, sector, terms } = req.body;
  console.log("All data", req.body)
   
   console.log("this is" , id)
  //  const sql = 'UPDATE workers SET name = ?, sector = ?, terms = ?, WHERE id = ?';
  //  const values = [name, sector, terms,id];
  const sql = `UPDATE workers SET name= '${req.body.name}'  sector = '${req.body.sector}', terms = ${req.body.terms} WHERE id = ${req.params.id}`;
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      console.log('Result',results)
      res.send(results);
    }
  //   }
  // connection.query(sql, [...values, id], (error, results) => {
  //   if (error) throw error;
  //   res.status(200).json({ message: 'Data updated successfully' });
  // });
   
  
})   
});
app.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, sector, terms } = req.body;

  try {
    // const conn = await connection.getConnection();
    const query = `UPDATE workers SET name = ?, sector = ?, terms = ? WHERE id = ?`;
    connection.query(query, [name, sector, terms, id]);

    res.send('Record updated successfully');
    // connection.release();
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating record');
  }
});
app.listen(8000, () => {
  console.log('API running on port 8000');
});
