import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import cors from "cors";
import promise from "mysql2/promise";

const app = express();
app.use(cors());

const database = mysql.createPool({
  host: "localhost",
  user: "test",
  password: "test",
  database: "backend",
});

app.use(bodyParser.json());
app.get("/api/users", (req, res) => {
  const sql = `
    SELECT u.username, u.age, c.country_name,u.id
    FROM userdata u
    INNER JOIN countrydata c ON u.country_id = c.country_id
  `;

  database.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Send data as Json
  });
});

//this function checks the if the country name is already in the country data table
//if yes, it will return the country id associated with it
//if no(even for new cases), it will return 1 and proceed with putting the countryname into the table
function check_countrydata(user) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM countrydata WHERE country_name LIKE ?";
    const values = [`${user.country_name}`];
    database.query(query, values, (err, result) => {
      if (err) return reject(err); // Reject the promise with the error
      if (result.length === 0) {
        resolve(1); // Resolve with 1 when no country data exists
        console.log("resolve with 1");
      } else {
        const country_id = result[0].country_id;
        resolve(country_id); // Resolve with country_id if found
        console.log("resolve with country_id");
      }
    });
  });
}

async function input_countrydata(user) {
  try {
    const checkcountrydata = await check_countrydata(user); // Wait for country data check

    // Get the current count of rows in the countrydata table
    const query = "SELECT COUNT(*) AS count FROM countrydata";
    const result = await new Promise((resolve, reject) => {
      database.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count); // Get the count value
      });
    });

    // If no such country exists in the table
    if (checkcountrydata == 1) {
      console.log("checkcountrydata is 1");

      const newCountryId = result + 2;

      // Insert data into countrydata table
      await new Promise((resolve, reject) => {
        const query = `INSERT INTO countrydata (country_name, country_id) VALUES (?, ?)`;
        const values = [user.country_name, newCountryId];
        database.query(query, values, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      // Insert data into userdata table
      await new Promise((resolve, reject) => {
        const query = `INSERT INTO userdata (username, age, country_id) VALUES (?, ?, ?)`;
        const values = [user.username, user.age, newCountryId];
        database.query(query, values, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      console.log("New country and user data inserted.");
    }
    // If the country already exists in the table
    else {
      console.log("checkcountrydata is not 1:", checkcountrydata);

      // Insert user data into userdata table
      await new Promise((resolve, reject) => {
        const query = `INSERT INTO userdata (username, age, country_id) VALUES (?, ?, ?)`;
        const values = [user.username, user.age, checkcountrydata];
        database.query(query, values, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      console.log("User data inserted for existing country.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

app.post("/", (req, res) => {
  input_countrydata(req.body);

  return res
    .status(200)
    .send({ message: "Your user information has been added." });
});

app.post("/addNewCountry", (req, res) => {
  input_countrydata(req.body);

  return res
    .status(200)
    .send({ message: "Your user information has been added." });
});

app.get("/api/countrydata", async (req, res) => {
  const sql = "SELECT country_name FROM countrydata"; // Select only country_name

  database.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const formattedResults = results.map(
      (row, index) => `${index}. ${row.country_name}`
    );

    res.json(formattedResults);
  });
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id; // Extract user ID from request

  try {
    const result = await confirm_deletion(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function confirm_deletion(userId) {
  return new Promise((resolve, reject) => {
    // Check if user exists before deleting
    const checkQuery = "SELECT * FROM userdata WHERE id = ?";
    database.query(checkQuery, [userId], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return reject(new Error("User not found"));
      }

      // If user exists, proceed with deletion
      const deleteQuery = "DELETE FROM userdata WHERE id = ?";
      database.query(deleteQuery, [userId], (deleteErr, deleteResults) => {
        if (deleteErr) return reject(deleteErr);
        resolve({ message: "User successfully deleted" });
      });
    });
  });
}

app.get("/api/checkcountry", async (req, res) => {
  const countryName = req.query.name;

  const sql = "SELECT * FROM countrydata WHERE country_name = ?";
  database.query(sql, [countryName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

app.post("/api/addcountry", async (req, res) => {
  const { country_name } = req.body;

  const sql = "INSERT INTO countrydata (country_name) VALUES (?)";
  database.query(sql, [country_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: "Country added successfully" });
  });
});

app.listen(8000, () => {
  console.log("App is listening at port 8000");
});
