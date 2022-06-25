USE company_db;
-- to insert information into the data tables. 
INSERT INTO departments (department_name)
VALUES ("Finace"),
("Marketing"),
("Research/Development"),
("Engineering"),
("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES ("Finance Manager", 100.69, 1),
        ("Marketing Manager", 100.69, 2),
        ("Research Manager", 100.69, 3),
        ("Engineering Manager", 100.69, 4),
        ("HR Manager", 100.69, 5),
        ("Accountant", 15.01, 1),
        ("Commercial Writer", 13.99, 2),
        ("Designer", 25.23, 3),
        ("Engineer", 27.12, 4),
        ("Hiring Coordinator", 26.51, 5);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Tyler", "Keuler", 3, NULL),
("Ragnar","Lothbrok", 1, NULL),
("Bjorn", "Lothbrok",2, NULL ),
("Floki", "TheMad", 4, NULL),
("Althelstan", "TheWise",5, NULL ),
("Lagatha", "SheildMaiden", 8, 1);