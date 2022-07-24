DROP DATABASE IF EXISTS human_resources;
CREATE DATABASE human_resources;

USE human_resources;

CREATE TABLE department (
   id INTEGER PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
   id INTEGER NOT NULL AUTO_INCREMENT,
   title VARCHAR(30),
   salary DECIMAL(8,2),
   department_id INTEGER,
   PRIMARY KEY (id)
);

CREATE TABLE employee (
   id INTEGER NOT NULL AUTO_INCREMENT,
   first_name VARCHAR(30),
   last_name VARCHAR(30),
   role_id INTEGER,
   manager_id INTEGER,
   PRIMARY KEY (id)
);