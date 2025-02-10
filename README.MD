# Givemetuna Backend

## Project Overview

`Givemetuna Backend` is a Node.js application that utilizes Express and MySQL for handling user and country data. The backend supports adding, updating, deleting, and retrieving user information, as well as filtering data based on country.

> **Side Note:** The name "Givemetuna" was chosen for fun. The project is actually designed for managing user information.

## Features

- Add, edit, and delete user data
- Store and reference country information
- RESTful API for data management
- MySQL database integration

## Technologies Used

- Node.js
- Express.js
- MySQL2
- CORS
- Body-Parser
- Nodemon (for development)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd givemetuna-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

## Project Structure

```
 givemetuna-backend/
 ├── node_modules/
 ├── text.js  # Main server file
 ├── package.json
 ├── README.md
```

## Dependencies

```json
"dependencies": {
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "express": "^4.21.2",
  "mysql2": "^3.12.0"
},
"devDependencies": {
  "nodemon": "^3.1.9"
}
```

## Database Schema

### User Data Table (`userdata`)

```sql
CREATE TABLE userdata (
    username VARCHAR (255),
    age INTEGER,
    country_id INTEGER REFERENCES countrydata (country_id),
    id INTEGER AUTO_INCREMENT PRIMARY KEY
);
```

### Country Data Table (`countrydata`)

```sql
CREATE TABLE countrydata (
    country_name VARCHAR(255) UNIQUE,
    country_id INTEGER PRIMARY KEY AUTO_INCREMENT
);
```

### Sample Country Data

```sql
INSERT INTO countrydata (country_name, country_id) VALUES
('Australia', 1),
('Brazil', 12),
('Canada', 5),
('China', 16),
('Croatia', 17),
('Denmark', 13),
('France', 6),
('Germany', 2),
('Greece', 18),
('Iceland', 19),
('India', 29),
('Ireland', 20),
('Italy', 7),
('Japan', 3),
('Korea', 30),
('Latvia', 36),
('Madagascar', 35),
('Malaysia', 28),
('Netherlands', 21),
('New Zealand', 8),
('Nigeria', 34),
('Portugal', 22),
('Saudi Arabia', 23),
('South Korea', 24),
('Spain', 9),
('Sweden', 15),
('Switzerland', 10),
('United Kingdom', 4),
('United States', 11);
```
