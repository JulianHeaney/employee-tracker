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
('Chelazon', 'Leroux', 2, null),
('Gisele', 'Lullaby', 4, null),
('Halal', 'Bae', 2, null),
('Irma', 'Gerd', 3, null),
('Jada', 'Shada-Hudson', 5, null),
('Kimmy', 'Couture', 6, null),
('Vivian', 'Vanderpuss', 8, null),
('Brooke Lynn', 'Hytes', 7, null),
('Traci', 'Melchor', 5, null),
('Brad', 'Goreski', 1, null);