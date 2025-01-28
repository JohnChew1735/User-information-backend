CREATE TABLE userdata (
    username VARCHAR (255),
    age integer
    );


INSERT INTO userdata(username, age)
VALUES ("Sophie", 13);

INSERT INTO countrydata(country_name)
VALUES ("Sophie");

CREATE TABLE countrydata(
    country_name VARCHAR(255) UNIQUE,
    country_id integer PRIMARY KEY AUTO_INCREMENT
);



ALTER TABLE userdata
ADD country_id integer;

ALTER TABLE userdata
ADD PRIMARY KEY (country_id);

ALTER TABLE userdata
DROP PRIMARY KEY;

ALTER TABLE countrydata
ADD country_id integer;

ALTER TABLE countrydata
ADD PRIMARY KEY (country_id);

ALTER TABLE userdata
DROP COLUMN country_id;

ALTER TABLE countrydata
DROP COLUMN country_id;

ALTER TABLE countrydata
ADD country_id integer;

ALTER TABLE userdata
ADD FOREIGN KEY (country_id) REFERENCES countrydata(country_id); 

ALTER TABLE countrydata
ALTER country_id SET DEFAULT 1; 

ALTER TABLE userdata
MODIFY COLUMN username VARCHAR(255) NOT NULL; 

ALTER TABLE userdata
MODIFY COLUMN age integer NOT NULL; 

ALTER TABLE countrydata AUTO_INCREMENT = 1;ALTER TABLE countrydata AUTO_INCREMENT = 1;

INSERT INTO countrydata(country_name, country_id)
VALUES ("Sophie", 2);

ALTER TABLE countrydata 
MODIFY column country_id AUTO_INCREMENT=1;


ALTER TABLE countrydata
ALTER COLUMN country_id DROP DEFAULT; 

ALTER TABLE countrydata AUTO_INCREMENT=1; 

SELECT * FROM countrydata
WHERE country_name LIKE "BANGLA";

ALTER TABLE countrydata
ADD UNIQUE (country_name); 