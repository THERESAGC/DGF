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
    ('SPOC');
    
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
    ('DM (Delivery Manager)');
    
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
    ('Employee Talk driven', 9);

-- Create techstack table
CREATE TABLE techstack (
    stack_id INT AUTO_INCREMENT PRIMARY KEY,
    stack_name VARCHAR(255) NOT NULL
);
INSERT INTO techstack (stack_name) VALUES
('Scripting (RoR, JS, Vue..)'),
('QA (Manual, Automation, Performance, Security)'),
('Full Stack'),
('Mobile'),
('LCNC platform (Workato, Logi)'),
('UX-UI-HTML'),
('Project Management'),
('PHP (Core PHP, Drupal, IOMAD, Moodle)'),
('SME/BA'),
('DevOps'),
('Data (Database/DBA/DWH/Visualization)'),
('Misc (Reporting tool, PS/Support, Infrastructure)'),
('AI-ML / Data Science'),
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
('MERN', 3),
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
('Java', 3),
('Android', 4),
('Flutter', 4),
('iOS', 4),
('React Native', 4),
('Xamarin', 4),
('Logi', 5),
('Workato', 5),
('HTML+CSS', 6),
('UI Design', 6),
('UX', 6),
('Python', 3),
('Agile', 7),
('SAFe Agile', 7),
('Project Management Tools (JIRA, Basecamp…) ', 7),
('Scrum Master', 7),
('Basic Project Management (Project, People, Conflict, Customer, Planning…)', 7),
('Moodle', 8),
('IOMAD', 8),
('Content Management Systtems (WordPress, Drupal…) ', 8),
('PHP', 8),
('SME', 9),
('AWS', 10),
('Azure', 10),
('GCP', 10),
('SQL queries', 11),
('DBA', 11),
('Visualization (Power BI, Klera…)', 11),
('Data Warehouse / Data Lake', 11),
('Infrastructure', 12),
('Instructure', 12),
('Professional Services', 12),
('AI-ML', 13),
('Data Science', 13),
('ChatGPT', 13),
('NLP', 13),
('Business Communication', 14),
('Time Management', 14),
('Client Interaction', 14),
('Managing teams', 14);

    
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
    ('HS1111', 'Satyabaji Sahu', 'Satyabaji.Sahu@example.com',"1234", 4),
	('HS2222', 'Santosh Iyer', 'Santosh.Iyer@example.com' ,"1234", 4),
	('HS3333', 'Pawan Shekatkar', 'Pawan.Shekatkar@example.com',"1234", 8),
	('HS4444', 'Umesh Kanade', 'Umesh.Kanade@example.com',"1234", 5),
	('HS5555', 'Dhara Masani', 'Dhara.Masani@example.com',"1234", 10);

select * from logintable;

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
    (5, 8),
    (6, 5),
    (7, 6),
    (8, 2),
    (9, 4),
    (4, 1),
    (4, 2),
	(4, 3),
    (4, 4),
    (4, 5),
    (4, 6),
    (4, 7),
    (4, 8),
    (4, 9);
 
-- Create the employee table
CREATE TABLE employee (
    emp_id VARCHAR(100) PRIMARY KEY,
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
('HS9117', 'Sneha Sr', 'Sneha.sr@example.com'),
('HS2735', 'Swaroop bidkar', 'swaroop.bidkar@example.com'),
('HS2736', 'Shreyansh barve', 'shreyansh.barve@example.com'),
('HS2733', 'harsh jagtap', 'harsh.jagtap@example.com'),
('HS2731', 'sonia sahu', 'sonia.sahu@example.com'),
('HS2734', 'shruti rawat', 'shruti.rawat@example.com'),
('HS2732', 'sanket tidke', 'sanket.tikde@example.com'),
('HS2737', 'theresa chalis', 'theresa.chalis@example.com');


   
    
    
select * from employee;


CREATE TABLE manager (
    manager_id VARCHAR(100) PRIMARY KEY,  
    manager_name VARCHAR(100),  
    manager_email VARCHAR(100),  
    role_id INT,  
    FOREIGN KEY (role_id) REFERENCES role(role_id)  
);

INSERT INTO manager (manager_id, manager_name, manager_email, role_id) VALUES
('HS1111', 'Satyabaji Sahu', 'Satyabaji.Sahu@example.com', 4),
('HS2222', 'Santosh Iyer', 'Santosh.Iyer@example.com', 4),
('HS3333', 'Pawan Shekatkar', 'Pawan.Shekatkar@example.com', 8),
('HS4444', 'Umesh Kanade', 'Umesh.Kanade@example.com', 5),
('HS5555', 'Dhara Masani', 'Dhara.Masani@example.com', 10);

select * from manager;

CREATE TABLE manager_employee_relationship (
    manager_id VARCHAR(100),                         
    emp_id VARCHAR(100),
    PRIMARY KEY (manager_id, emp_id),
    FOREIGN KEY (manager_id) REFERENCES logintable(emp_id),  
    FOREIGN KEY (emp_id) REFERENCES employee(emp_id)        
);

INSERT INTO manager_employee_relationship VALUES
("HS1111", "HS2731"),
("HS1111", "HS2732"),
("HS1111", "HS2733"),
("HS2222", "HS2734"),
("HS2222", "HS2735"),
("HS2222", "HS2736"),
("HS3333", "HS2733"),
("HS3333", "HS2737"),
("HS3333", "HS9111"),
("HS4444", "HS2734"),
("HS4444", "HS9112"),
("HS4444", "HS9113"),
("HS5555", "HS9114"),
("HS5555", "HS9115"),
("HS5555", "HS9116"),
("HS5555", "HS9117");

select * from manager_employee_relationship;


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
  requesttype LONGTEXT,
  projectid INT,
  expecteddeadline DATE,
  techstack INT,
  otherskill LONGTEXT,
  suggestedcompletioncriteria LONGTEXT,
  comments LONGTEXT,
  numberofpeople BIGINT DEFAULT NULL,
  requestedby LONGTEXT,
  requestedbyid VARCHAR(100),
  createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modifiedby BIGINT,
  modifieddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  requeststatus VARCHAR(255) DEFAULT 'Approval Requested',
  approvedby varchar(255),
  service_division INT,
  newprospectname VARCHAR(255),
  request_category TINYINT,
  learningtype BIGINT,
  skilldevelopment BIGINT,
  AssignedTo VARCHAR(100),
  PRIMARY KEY (requestid),
  FOREIGN KEY (source) REFERENCES source(source_id),
  FOREIGN KEY (trainingobj) REFERENCES training_obj(training_id),
  FOREIGN KEY (projectid) REFERENCES projectname(ProjectID),  -- Modify foreign key to allow NULL
  FOREIGN KEY (techstack) REFERENCES techstack(stack_id),
  FOREIGN KEY (service_division) REFERENCES service_division(id),
  FOREIGN KEY (requestonbehalfof) REFERENCES logintable(emp_id),
  FOREIGN KEY (requestedbyid) REFERENCES logintable(emp_id),
  FOREIGN KEY (AssignedTo) REFERENCES logintable(emp_id)
);

select * from newtrainingrequest ;

CREATE TABLE `Mentor_Request_Assign` (
  `requestid` INT NOT NULL,
  `mentor_id` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`requestid`, `mentor_id`),
  FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest`(`requestid`),
  FOREIGN KEY (`mentor_id`) REFERENCES `employee`(`emp_id`)
);


CREATE TABLE `Request_Primary_Skills` (
  `requestid` INT NOT NULL,
  `primaryskill_id` INT NOT NULL,
  PRIMARY KEY (`requestid`, `primaryskill_id`),
  FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest`(`requestid`),
  FOREIGN KEY (`primaryskill_id`) REFERENCES `primaryskill`(`skill_id`)
);


select * from training_request_employee_level;

 
CREATE TABLE emp_newtrainingrequested (
    id BIGINT NOT NULL AUTO_INCREMENT,
    emp_id VARCHAR(100) NOT NULL,  -- Ensure matching charset and collation
    availablefrom DATE NOT NULL,
    dailyband VARCHAR(100) NOT NULL,
    availableonweekend BOOLEAN NOT NULL,
    requestid INT NOT NULL,
    emailsentstatus BIGINT DEFAULT '0',
    emailsentdate DATE,
    comment LONGTEXT,
    status VARCHAR(50) NOT NULL DEFAULT '0',
    createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Automatically set current timestamp
    PRIMARY KEY (id),
    CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES employee(emp_id),  -- Foreign key constraint
    FOREIGN KEY(requestid) REFERENCES newtrainingrequest(requestid) 
);


CREATE TABLE `training_request_employee_level` (
  `requestid` INT NOT NULL,
  `employee_level_id` INT NOT NULL,
  PRIMARY KEY (`requestid`, `employee_level_id`),
  FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest`(`requestid`),
  FOREIGN KEY (`employee_level_id`) REFERENCES `employee_level`(`id`)
);

select * from training_request_employee_level;
