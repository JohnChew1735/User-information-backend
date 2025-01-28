import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();

const database = mysql.createPool({
  host: "localhost",
  user: "test",
  password: "test",
  database: "backend",
});

app.use(bodyParser.json());

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

      const newCountryId = result + 1;

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
  if (req.body["username"] == "") {
    return res.status(400).send({ error: "Please provide a username" });
  }
  if (req.body["age"] <= 0) {
    return res.status(400).send({ error: "Please provide an age" });
  }
  if (req.body["country_name"] == "") {
    return res.status(400).send({ error: "Please provide a country" });
  } else {
    input_countrydata(req.body);
    return res
      .status(200)
      .send({ message: "Your user information has been added." });
  }
});

app.listen(3000, () => {
  console.log("App is listening at port 3000");
});
