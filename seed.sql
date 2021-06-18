/* Seeds for SQL table*/
USE employees_db;

INSERT INTO department (name)
VALUES ("Engineering"), ("Human Resources"), ("Business Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 100000 , 1), ("Operations Manager", 120000, 2), ("Assistant Business Advisor", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Josh", "Stubb", 1 , null), ("Hunter", "Taylor", 3, 1), ("Jamie", "Hunt", 2, null);

