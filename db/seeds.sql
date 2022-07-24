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
('Chelazon', 'Leroux', 2, NULL),
('Gisele', 'Lullaby', 4, NULL),
('Halal', 'Bae', 2, NULL),
('Irma', 'Gerd', 3, NULL),
('Jada', 'Shada-Hudson', 5, NULL),
('Kimmy', 'Couture', 6, NULL),
('Vivian', 'Vanderpuss', 8, NULL),
('Brooke Lynn', 'Hytes', 7, NULL),
('Traci', 'Melchor', 5, NULL),
('Brad', 'Goreski', 1, NULL);