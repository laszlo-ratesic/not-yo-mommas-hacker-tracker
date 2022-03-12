INSERT INTO departments (name)
VALUES
    ('Administration/Operations'),
    ('Research & Development'),
    ('Marketing'),
    ('Sales'),
    ('Human Resources'),
    ('Customer Service'),
    ('Accounting & Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('CEO', 550000.00, 1),
    ('COO', 275000.00, 1),
    ('Marketing Manager', 180000.00, 3),
    ('CFO', 195000.00, 7),
    ('Director of Research', 205000.00, 2),
    ('Senior R&D Lead', 185000.00, 2),
    ('Product tester', 95000.00, 2),
    ('PR Manager', 85000.00, 3),
    ('Director of Sales', 75000.00, 4),
    ('Outbound Sales Coordinator', 65000.00, 4),
    ('B2B Sales Lead', 75000.00, 4),
    ('Director of Human Resources', 105000.00, 5),
    ('Benefits Specialist', 60000.00, 5),
    ('Customer Success Manager', 55000.00, 6),
    ('Helpdesk Support Specialist', 35000.00, 6),
    ('Accounts Manager', 85000.00, 7),
    ('Director of Purchasing', 95000.00, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Logan', 'Roy', 1, NULL),
    ('David', 'Wallace', 2, NULL),
    ('Larry', 'David', 3, 2),
    ('Jeff', 'Green', 4, NULL),
    ('Rick', 'Sanchez', 5, 2),
    ('Morty', 'Funkhauser', 6, 5),
    ('Guinea', 'Pig', 7, 5),
    ('Beltran', 'Kezar', 8, 3),
    ('Jackie', 'Pepineaux', 9, 4),
    ('Ari', 'Farrah', 10, 9),
    ('Deck', 'Pigney', 11, 9),
    ('Malchy', 'Trask', 12, 2),
    ('Nerita', 'Stranio', 13, 12),
    ('Jon', 'Snow', 14, NULL),
    ('Samwell', 'Tarly', 15, 14),
    ('Tyrion', 'Lannister', 16, 4),
    ('Helen', 'Peckham', 17, 16);