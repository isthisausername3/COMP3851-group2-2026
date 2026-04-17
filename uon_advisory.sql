CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password) VALUES
('Akshit Sharma', 'Akshit@example.com', 'abc@123'),
('Naved Khan', 'Naved@example.com', 'admin@123');

SELECT * From users;
S

CREATE TABLE activity_report (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    week VARCHAR(20),
    activity_name VARCHAR(200),
    description TEXT,
    time_spent DECIMAL(4,2) 
);

INSERT INTO activity_report 
(user_id, week, activity_name, description, time_spent)
VALUES
(2, 'Week 3-4', 'HTML, CSS and JavaScript',
 'Reviewed course materials for project preparation', 8),

(2, 'Week 3-4', 'ReactJS',
 'Watched tutorial and created a Hello World application', 2),

(2, 'Week 3-4', 'SQL',
 'Reviewed SQL concepts and practiced queries', 2),

(1, 'Week 3-4', 'Database Design',
 'Designed tables and relationships', 2),

(1, 'Week 3-4', 'Testing',
 'Validated data and tested queries', 1.5);

 CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(150) NOT NULL
);

INSERT INTO programs (program_name) VALUES
('Bachelor of Computer Science'),
('Bachelor of Information Technology');

