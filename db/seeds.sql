INSERT INTO department (name) VALUES
('Accounting'),
('Engineering'),
('Human Resources'),
('Management'),
('Marketing'); 

INSERT INTO role (title, salary, department_id) VALUES
('Acountant', 60000, 1),
('Finance Manager', 90000, 1),
('Accounting Intern', 0, 1),
('Front-End Engineer', 80000, 2),
('Back-End Engineer', 85000, 2),
('Senior Developer', 100000, 2),
('Secretary', 60000, 3),
('HR Manager', 80000, 3),
('CEO', 200000, 4),
('CTO', 200000, 4),
('Advertising Executive', 80000, 5),
('Advertising Manager', 105000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Adam', 'Kruschwitz', 10, null),   -- CTO, 1
('Juliette', 'Delforge', 9, null),  -- CEO, 2
('Reed', 'Dunbar', 6, 1),           -- Senior Dev, 3
('Edwin', 'Ramos', 12, 2),          -- Advertising Manager, 4
('Eliana', 'Frank', 8, 2),          -- HR Manager, 5
('Parker', 'Elsey', 2, 2),          -- Finance Manager, 5
('Kevin', 'Alcaster', 1, 6),
('Peaches', 'McGee', 1, 6),
('Tara', 'Lovegood', 3, 3),
('Reginald', 'Hoffman', 3, 3),
('Daisy', 'Lovegood', 4, 3),
('Trevor', 'Mayweather', 4, 3),
('Apples', 'Catson', 7, 5),
('South', 'West', 11, 4),
('Lincoln', 'Townsman', 11, 4);