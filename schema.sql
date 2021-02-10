-- DROP IF EXISTS
DROP DATABASE IF EXISTS Company_db;
-- CREATING IT OTHERWISE
CREATE DATABASE Company_db;
-- RUN TO CREATE TABLES
USE Company_db;
-- Creating tables necessary
CREATE TABLE Departments(
  id INT AUTO_INCREMENT,
  department_name VARCHAR(30),
  PRIMARY KEY (id)
);
CREATE TABLE roles(
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(7, 2),
  department_id INT NOT NULL,
  FOREIGN KEY(department_id) REFERENCES Departments(id),
  PRIMARY KEY (id)
);
CREATE TABLE employees(
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  roles_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY(roles_id) REFERENCES roles(id),
  PRIMARY KEY(id)
);