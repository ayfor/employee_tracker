DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

