-- Create database and use it
create database dgf_dummy;
use dgf_dummy;



-- Create role table
CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);
INSERT INTO role (role_name) VALUES 
    ('Delivery Manager (DM) Role'),
    ('Account Growth Function (AGF) + DH'),
    ('Delivery Head (DH) Role'),
    ('CapDev Role'),
    ('COE Role'),
    ('DSU Role'),
    ('Function Owner Role'),
    ('RM Role'),
    ('Tech Function Role'),
    ('SPOC Role');
    
-- Create source table
CREATE TABLE source (
    source_id INT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL
);
INSERT INTO source (source_name) VALUES 
    ('Account Growth Function (AGF)'),
    ('Resource Manager (RM)'),
    ('Delivery Head (DH)'),
    ('Tech Function'),
    ('DSU'),
    ('Function Owners'),
    ('CapDev'),
    ('COE'),
    ('DM (Delivery Manager)'),
    ('Self driven (DM/Employee)');
    
-- Create training_obj table
CREATE TABLE training_obj (
    training_id INT AUTO_INCREMENT PRIMARY KEY,
    training_name VARCHAR(255) NOT NULL,
    source_id INT,
    FOREIGN KEY (source_id) REFERENCES source(source_id)
);
INSERT INTO training_obj (training_name, source_id) VALUES 
    ('Offering', 1), 
    ('Consulting mindset', 1), 
    ('Future leadership development (ELW, FutureFit, FastTrack…)', 2), 
    ('Certifications', 2),
    ('Specialized trainings (Train the trainer…)', 2),
    ('Critical skillgap or skill upgrade at org level', 2),
    ('Salesforce pipeline readiness (Upskill, Cross-skill)', 2),
    ('Upsell offering', 3),
    ('Leadership development', 3),
    ('Key people development', 3),
    ('Specialized skills development', 3),
    ('Competency development', 3),
    ('Specialized compliances', 3),
    ('Platforms specific', 3),
    ('Certifications', 3),
    ('Dev (mainstream to high-tech)', 4),
    ('Test (functional & Non-functional)', 4),
    ('DevOps', 4),
    ('Cloud', 4),
    ('Data', 4),
    ('AI', 4),
    ('UI-UX', 4),
    ('Architecture/Design', 4),
    ('Advanced Learning / Specialization (Prompt engineering..)', 4),
    ('Across org', 5),
    ('Cloud', 6),
    ('Data', 6),
    ('DevOps', 6),
    ('UI-UX', 6),
    ('ATG', 6),
    ('Cultural shift programs across org', 7),
    ('Offering based', 8),
    ('Upskill', 9),
    ('Skillgap', 9),
    ('Softskills', 9),
    ('O3 based (suggested learning, aspirations…)', 9),
    ('Employee Talk driven', 9),
    ('DM driven', 10),
    ('Employee driven', 10);

-- Create techstack table
CREATE TABLE techstack (
    stack_id INT AUTO_INCREMENT PRIMARY KEY,
    stack_name VARCHAR(255) NOT NULL
);
INSERT INTO techstack (stack_name) VALUES 
    ('Scripting (MEAN, MERN, RoR, JS, Vue..)'),
    ('QA (Manual, Automation, Performance, Security)'),
    ('Microsoft .Net'),
    ('Java'),
    ('Mobile'),
    ('LCNC platform (Workato, Logi)'),
    ('UX-UI-HTML'),
    ('Python'),
    ('Project Management'),
    ('PHP (Core PHP, Drupal, IOMAD, Moodle)'),
    ('SME/BA'),
    ('DevOps'),
    ('Data (Database/DBA/DWH/Visualization)'),
    ('Misc (Reporting tool, PS/Support, Infrastructure)'),
    ('Scrum Master'),
    ('AI-ML / Data Science'),
    ('Infrastructure'),
    ('Softskills');
    
-- Create primaryskill table
CREATE TABLE primaryskill (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL,
    stack_id INT,
    FOREIGN KEY (stack_id) REFERENCES techstack(stack_id)
);
INSERT INTO primaryskill (skill_name, stack_id) VALUES 
    ('AngularJs', 1),
    ('MERN', 1),
    ('NodeJs', 1),
    ('ReactJs', 1),
    ('ROR', 1),
    ('TypeScript', 1),
    ('Vue.Js', 1),
    ('Performance', 2),
    ('Security', 2),
    ('Automation', 2),
    ('Functional', 2),
    ('SDET', 2),
    ('Microsoft .Net', 3),
    ('Microsoft .Net + Angular', 3),
    ('Java', 4),
    ('Android', 5),
    ('Flutter', 5),
    ('iOS', 5),
    ('React Native', 5),
    ('Xamarine', 5),
    ('Logi', 6),
    ('Workato', 6),
    ('HTML+CSS', 7),
    ('UI Design', 7),
    ('UX', 7),
    ('Python', 8),
    ('Agile', 9),
    ('SAFe Agile', 9),
    ('Project Management Tools (JIRA, Basecamp…)', 9),
    ('Scrum Master', 9),
    ('Basic Project Management (Project, People, Conflict, Customer, Planning…)', 9),
    ('Moodle', 10),
    ('IOMAD', 10),
    ('Content Management Systems (WordPress, Drupal…)', 10),
    ('PHP', 10),
    ('SME', 11),
    ('AWS', 12),
    ('Azure', 12),
    ('GCP', 12),
    ('SQL queries', 13),
    ('DBA', 13),
    ('Visualization (Power BI, Klera…)', 13),
    ('Data Warehouse / Data Lake', 13),
    ('Infrastructure', 14),
    ('Professional Services', 14),
    ('Scrum Master', 15),
    ('AI-ML', 16),
    ('Data Science', 16),
    ('ChatGPT', 16),
    ('NLP', 16),
    ('Business Communication', 18),
    ('Time Management', 18),
    ('Client Interaction', 18),
    ('Managing teams', 18);
    
-- Create projectname table
CREATE TABLE projectname (
    ProjectID INT PRIMARY KEY,
    ProjectName VARCHAR(255)
);
INSERT INTO projectname (ProjectID, ProjectName) VALUES 
	(999, 'none'),
    (1, 'AI Chatbot'),
    (2, 'E-commerce Platform'),
    (3, 'Social Media Analytics'),
    (4, 'IoT Home Automation'),
    (5, 'Mobile Health App'),
    (6, 'Blockchain Voting System'),
    (7, 'Augmented Reality App'),
    (8, 'Data Visualization Dashboard'),
    (9, 'Online Learning Platform'),
    (10, 'Cybersecurity Monitoring Tool');
    
-- Create logintable
CREATE TABLE logintable (
    emp_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);
INSERT INTO logintable (emp_id, name, email, password, role_id) VALUES
    ('HS2735', 'Swaroop bidkar', 'swaroop.bidkar@example.com', '1234',  8),
    ('HS2736', 'Shreyansh barve', 'shreyansh.barve@example.com', '1234',  9),
    ('HS2733', 'harsh jagtap', 'harsh.jagtap@example.com', '1234',  3),
    ('HS2731', 'sonia sahu', 'sonia.sahu@example.com', '1234',  2),
    ('HS2734', 'shruti rawat', 'shruti.rawat@example.com', '1234',  10),
    ('HS2732', 'sanket tikde', 'sanket.tikde@example.com', '1234',  9),
    ('HS2737', 'theresa chalis', 'theresa.chalis@example.com', '1234',  8),
    ('HS1111', 'satyabaji sahu', 'satyabaji.sahu@example.com', '1234',  4),
    ('HS2222', 'santosh iyer', 'santosh.iyer@example.com', '1234',  4);


 -- Create role_source_assign table
CREATE TABLE role_source_assign (
    role_id INT,
    source_id INT,
    PRIMARY KEY (role_id, source_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (source_id) REFERENCES source(source_id)
);
INSERT INTO role_source_assign (role_id, source_id) VALUES 
    (1, 9),
    (2, 3),
    (2, 1),
    (3, 3),
    (3, 6),
    (4, 7),
    (5, 8),
    (6, 5),
    (7, 6),
    (8, 2),
    (9, 4),
    (10, 1),
    (10, 2),
	(10, 3),
    (10, 4),
    (10, 5),
    (10, 6),
    (10, 7),
    (10, 8),
    (10, 9),
    (10, 10);
 
-- Create the employee table
CREATE TABLE employee (
    emp_id VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
    emp_name VARCHAR(100),
    emp_email VARCHAR(100)
);
 
INSERT INTO employee (emp_id, emp_name, emp_email) VALUES
('HS9111', 'Aniket Verma', 'Aniket.Verma@example.com'),
('HS9112', 'Anish Deokar', 'Anish.Deokar@example.com'),
('HS9113', 'Sidhharth Mourya', 'Sidhharth.Mourya@example.com'),
('HS9114', 'Suraj Sahu', 'Suraj.Sahu@example.com'),
('HS9115', 'Shreya Dalal', 'Shreya.Goshal@example.com'),
('HS9116', 'Effy Joe', 'Effy.Joe@example.com'),
('HS9117', 'Sneha Sr', 'Sneha.sr@example.com');

-- UPDATE employee

-- SET emp_id = CASE emp_id
--     WHEN 'HS1111' THEN 'HS9111'
--     WHEN 'HS1112' THEN 'HS9112'
--     WHEN 'HS1113' THEN 'HS9113'
--     WHEN 'HS1114' THEN 'HS9114'
--     WHEN 'HS1115' THEN 'HS9115'
--     WHEN 'HS1116' THEN 'HS9116'
--     WHEN 'HS1117' THEN 'HS9117'
--     ELSE emp_id
-- END
-- WHERE emp_id IN ('HS1111', 'HS1112', 'HS1113', 'HS1114', 'HS1115', 'HS1116', 'HS1117');

INSERT INTO employee (emp_id, emp_name, emp_email) VALUES
    ('HS2735', 'Swaroop bidkar', 'swaroop.bidkar@example.com'),
    ('HS2736', 'Shreyansh barve', 'shreyansh.barve@example.com'),
    ('HS2733', 'harsh jagtap', 'harsh.jagtap@example.com'),
    ('HS2731', 'sonia sahu', 'sonia.sahu@example.com'),
    ('HS2734', 'shruti rawat', 'shruti.rawat@example.com'),
    ('HS2732', 'sanket tidke', 'sanket.tikde@example.com'),
    ('HS2737', 'theresa chalis', 'theresa.chalis@example.com'),
    ('HS1111', 'satyabaji sahu', 'satyabaji.sahu@example.com'),
    ('HS2222', 'santosh iyer', 'santosh.iyer@example.com');
    
    
select * from employee;

    CREATE TABLE employee_level (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(100)
);
INSERT INTO employee_level (job_title) VALUES
('QA Lead'),
('Scrum Master'),
('Senior Engineer'),
('Tech Lead'),
('Tech Specialist'),
('UI/UX Lead'),
('UI/UX Specialist');
 
 select * from employee_level;
 

CREATE TABLE service_division(
	id INT PRIMARY KEY auto_increment,
    service_name VARCHAR(255)
);
 
INSERT INTO service_division(service_name) values('Content Services'),('Tech Services');



-- New Training Request Table
CREATE TABLE newtrainingrequest (
  requestid INT NOT NULL,
  source INT NOT NULL,
  trainingobj INT,
  requestonbehalfof VARCHAR(255),
  requesttype LONGTEXT COLLATE utf8mb4_unicode_ci,
  projectid INT,
  expecteddeadline DATE,
  techstack INT,
  primaryskill INT,
  otherskill LONGTEXT COLLATE utf8mb4_unicode_ci,
  suggestedcompletioncriteria LONGTEXT COLLATE utf8mb4_unicode_ci,
  comments LONGTEXT COLLATE utf8mb4_unicode_ci,
  numberofpeople BIGINT DEFAULT NULL,
  requestedby LONGTEXT COLLATE utf8mb4_unicode_ci,
  requestedbyid VARCHAR(100),
  createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modifiedby BIGINT,
  modifieddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  requeststatus VARCHAR(255) DEFAULT 'Approval Requested' COLLATE utf8mb4_unicode_ci,
  approvedby BIGINT,
  service_division INT,
  newprospectname VARCHAR(255),
  request_category TINYINT,
  learningtype BIGINT,
  skilldevelopment BIGINT,
  PRIMARY KEY (requestid),
  FOREIGN KEY (source) REFERENCES source(source_id),
  FOREIGN KEY (trainingobj) REFERENCES training_obj(training_id),
  FOREIGN KEY (projectid) REFERENCES projectname(ProjectID),  -- Modify foreign key to allow NULL
  FOREIGN KEY (techstack) REFERENCES techstack(stack_id),
  FOREIGN KEY (primaryskill) REFERENCES primaryskill(skill_id),
  FOREIGN KEY (service_division) REFERENCES service_division(id),
  FOREIGN KEY (requestonbehalfof) REFERENCES employee(emp_id),
  FOREIGN KEY (requestedbyid) REFERENCES employee(emp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='All training Request Data';

select * from newtrainingrequest ;



 
CREATE TABLE emp_newtrainingrequested (
    id BIGINT NOT NULL AUTO_INCREMENT,
    emp_id VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,  -- Ensure matching charset and collation
    availablefrom DATE NOT NULL,
    dailyband VARCHAR(100) NOT NULL,
    availableonweekend BOOLEAN NOT NULL,
    requestid INT NOT NULL,
    emailsentstatus BIGINT DEFAULT '0',
    emailsentdate DATE,
    comment LONGTEXT COLLATE utf8mb4_unicode_ci,
    status VARCHAR(50) NOT NULL DEFAULT '0',
    createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Automatically set current timestamp
    PRIMARY KEY (id),
    CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES employee(emp_id),  -- Foreign key constraint
    FOREIGN KEY(requestid) REFERENCES newtrainingrequest(requestid) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='new_training_requested_employee';



CREATE TABLE `training_request_employee_level` (
  `requestid` INT NOT NULL,
  `employee_level_id` INT NOT NULL,
  PRIMARY KEY (`requestid`, `employee_level_id`),
  FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest`(`requestid`),
  FOREIGN KEY (`employee_level_id`) REFERENCES `employee_level`(`id`)
);

select * from training_request_employee_level;



SHOW CREATE TABLE newtrainingrequest;
