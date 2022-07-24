USE human_resources;

INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 2, NULL),
('Mike', 'Chan', 4, NULL),
('Ashley', 'Rodriguez', 2, NULL),
('Kevin', 'Tupik', 3, NULL),
('Kunal', 'Singh', 5, NULL),
('Maila', 'Brown', 6, NULL),
('Sarah', 'Lourd', 8, NULL),
('Tom', 'Allen', 7, NULL),
('Sam', 'Kash', 5, NULL),
('Julian', 'Heaney', 1, NULL);