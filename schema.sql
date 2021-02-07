-- DROP IF EXISTS
DROP DATABASE IF EXISTS Company_db;
-- CREATING IT OTHERWISE
CREATE DATABASE Company_db;
-- RUN TO CREATE TABLES
USE Company_db;
-- Creating tables necessary
CREATE TABLE Department(
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
CREATE TABLE roles(
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(7, 2),
  department_id INT NOT NULL,
  FOREIGN KEY(department_id) REFERENCES Department(id),
  PRIMARY KEY (id)
);
CREATE TABLE employee(
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  roles_id INT NOT NULL,
  FOREIGN KEY(roles_id) REFERENCES roles(id),
  PRIMARY KEY(id)
);
INSERT INTO
  Department (name)
VALUES
  ("Warehouse");
INSERT INTO
  Department(name)
VALUES
  ("Retail");