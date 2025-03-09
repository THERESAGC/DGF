-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dgf_dummy
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assigned_courses`
--

DROP TABLE IF EXISTS `assigned_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_courses` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `requestid` int NOT NULL,
  `employee_id` varchar(100) NOT NULL,
  `mentor_id` varchar(100) NOT NULL,
  `course_id` int NOT NULL,
  `coursetype_id` int NOT NULL,
  `completion_date` date DEFAULT NULL,
  `comments` text,
  `assigned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `learning_type` varchar(255) DEFAULT NULL,
  `progress` int DEFAULT '0',
  `status` varchar(50) DEFAULT 'Learning Initiated',
  PRIMARY KEY (`assignment_id`),
  KEY `requestid` (`requestid`),
  KEY `employee_id` (`employee_id`),
  KEY `mentor_id` (`mentor_id`),
  KEY `course_id` (`course_id`),
  KEY `coursetype_id` (`coursetype_id`),
  KEY `idx_course_status` (`employee_id`,`requestid`,`status`),
  CONSTRAINT `assigned_courses_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`) ON DELETE CASCADE,
  CONSTRAINT `assigned_courses_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`emp_id`),
  CONSTRAINT `assigned_courses_ibfk_3` FOREIGN KEY (`mentor_id`) REFERENCES `employee` (`emp_id`),
  CONSTRAINT `assigned_courses_ibfk_4` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `assigned_courses_ibfk_5` FOREIGN KEY (`coursetype_id`) REFERENCES `course_type` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `requestid` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `comment_text` longtext NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `requestid` (`requestid`),
  KEY `created_by` (`created_by`),
  KEY `modified_by` (`modified_by`),
  KEY `parent_comment_id` (`parent_comment_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`modified_by`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `course_description` text,
  `duration_hours` int DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  KEY `idx_course_name` (`course_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_type`
--

DROP TABLE IF EXISTS `course_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) NOT NULL,
  `type_description` text,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `emp_newtrainingrequested`
--

DROP TABLE IF EXISTS `emp_newtrainingrequested`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_newtrainingrequested` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `emp_id` varchar(100) NOT NULL,
  `availablefrom` date NOT NULL,
  `dailyband` varchar(100) NOT NULL,
  `availableonweekend` tinyint(1) NOT NULL,
  `requestid` int NOT NULL,
  `emailsentstatus` bigint DEFAULT '0',
  `emailsentdate` date DEFAULT NULL,
  `comment` longtext,
  `status` varchar(50) NOT NULL DEFAULT '0',
  `courses_assigned` int NOT NULL DEFAULT '0',
  `createddate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_emp_id` (`emp_id`),
  KEY `requestid` (`requestid`),
  KEY `idx_emp_request` (`emp_id`,`requestid`),
  CONSTRAINT `emp_newtrainingrequested_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`),
  CONSTRAINT `fk_emp_id` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` varchar(100) NOT NULL,
  `emp_name` varchar(100) DEFAULT NULL,
  `emp_email` varchar(100) DEFAULT NULL,
  `profile_image` longblob,
  `designation_id` int DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  KEY `fk_employee_level` (`designation_id`),
  CONSTRAINT `fk_employee_level` FOREIGN KEY (`designation_id`) REFERENCES `employee_level` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee_designation`
--

DROP TABLE IF EXISTS `employee_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_designation` (
  `emp_id` varchar(255) NOT NULL,
  `designation_id` int NOT NULL,
  PRIMARY KEY (`emp_id`,`designation_id`),
  KEY `designation_id` (`designation_id`),
  CONSTRAINT `employee_designation_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`),
  CONSTRAINT `employee_designation_ibfk_2` FOREIGN KEY (`designation_id`) REFERENCES `employee_level` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee_level`
--

DROP TABLE IF EXISTS `employee_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_title` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logintable`
--

DROP TABLE IF EXISTS `logintable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logintable` (
  `emp_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int DEFAULT NULL,
  `profile_image` longblob,
  `created_on` timestamp NULL DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `logintable_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `manager_id` varchar(100) NOT NULL,
  `manager_name` varchar(100) DEFAULT NULL,
  `manager_email` varchar(100) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `manager_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manager_employee_relationship`
--

DROP TABLE IF EXISTS `manager_employee_relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager_employee_relationship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `manager_id` varchar(100) DEFAULT NULL,
  `emp_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `manager_id` (`manager_id`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `manager_employee_relationship_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `manager_employee_relationship_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mentor_request_assign`
--

DROP TABLE IF EXISTS `mentor_request_assign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentor_request_assign` (
  `requestid` int NOT NULL,
  `mentor_id` varchar(100) NOT NULL,
  PRIMARY KEY (`requestid`,`mentor_id`),
  KEY `mentor_id` (`mentor_id`),
  CONSTRAINT `mentor_request_assign_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`),
  CONSTRAINT `mentor_request_assign_ibfk_2` FOREIGN KEY (`mentor_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `newtrainingrequest`
--

DROP TABLE IF EXISTS `newtrainingrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newtrainingrequest` (
  `requestid` int NOT NULL,
  `source` int NOT NULL,
  `trainingobj` int DEFAULT NULL,
  `requestonbehalfof` varchar(255) DEFAULT NULL,
  `requesttype` longtext,
  `projectid` int DEFAULT NULL,
  `expecteddeadline` date DEFAULT NULL,
  `techstack` int DEFAULT NULL,
  `otherskill` longtext,
  `suggestedcompletioncriteria` longtext,
  `comments` longtext,
  `numberofpeople` bigint DEFAULT NULL,
  `requestedby` longtext,
  `requestedbyid` varchar(100) DEFAULT NULL,
  `createddate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedby` bigint DEFAULT NULL,
  `modifieddate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `requeststatus` varchar(255) DEFAULT 'Approval Requested',
  `approvedby` varchar(255) DEFAULT NULL,
  `service_division` int DEFAULT NULL,
  `newprospectname` varchar(255) DEFAULT NULL,
  `request_category` tinyint DEFAULT NULL,
  `learningtype` bigint DEFAULT NULL,
  `skilldevelopment` bigint DEFAULT NULL,
  `AssignedTo` varchar(100) DEFAULT 'HS1111',
  `org_level` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`requestid`),
  KEY `source` (`source`),
  KEY `trainingobj` (`trainingobj`),
  KEY `projectid` (`projectid`),
  KEY `techstack` (`techstack`),
  KEY `service_division` (`service_division`),
  KEY `requestonbehalfof` (`requestonbehalfof`),
  KEY `requestedbyid` (`requestedbyid`),
  KEY `AssignedTo` (`AssignedTo`),
  KEY `idx_request_status` (`requestid`,`requeststatus`),
  CONSTRAINT `newtrainingrequest_ibfk_1` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`),
  CONSTRAINT `newtrainingrequest_ibfk_2` FOREIGN KEY (`trainingobj`) REFERENCES `training_obj` (`training_id`),
  CONSTRAINT `newtrainingrequest_ibfk_3` FOREIGN KEY (`projectid`) REFERENCES `projectname` (`ProjectID`),
  CONSTRAINT `newtrainingrequest_ibfk_4` FOREIGN KEY (`techstack`) REFERENCES `techstack` (`stack_id`),
  CONSTRAINT `newtrainingrequest_ibfk_5` FOREIGN KEY (`service_division`) REFERENCES `service_division` (`id`),
  CONSTRAINT `newtrainingrequest_ibfk_6` FOREIGN KEY (`requestonbehalfof`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `newtrainingrequest_ibfk_7` FOREIGN KEY (`requestedbyid`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `newtrainingrequest_ibfk_8` FOREIGN KEY (`AssignedTo`) REFERENCES `logintable` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requestid` int NOT NULL,
  `emp_id` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  KEY `requestid` (`requestid`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `logintable` (`emp_id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `primaryskill`
--

DROP TABLE IF EXISTS `primaryskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `primaryskill` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(255) NOT NULL,
  `stack_id` int DEFAULT NULL,
  PRIMARY KEY (`skill_id`),
  KEY `stack_id` (`stack_id`),
  CONSTRAINT `primaryskill_ibfk_1` FOREIGN KEY (`stack_id`) REFERENCES `techstack` (`stack_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projectname`
--

DROP TABLE IF EXISTS `projectname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectname` (
  `ProjectID` int NOT NULL,
  `ProjectName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `request_primary_skills`
--

DROP TABLE IF EXISTS `request_primary_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_primary_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requestid` int NOT NULL,
  `primaryskill_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `requestid` (`requestid`),
  KEY `primaryskill_id` (`primaryskill_id`),
  CONSTRAINT `request_primary_skills_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`),
  CONSTRAINT `request_primary_skills_ibfk_2` FOREIGN KEY (`primaryskill_id`) REFERENCES `primaryskill` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role_source_assign`
--

DROP TABLE IF EXISTS `role_source_assign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_source_assign` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `role_source_assign_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`),
  CONSTRAINT `role_source_assign_ibfk_2` FOREIGN KEY (`source_id`) REFERENCES `source` (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_division`
--

DROP TABLE IF EXISTS `service_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_division` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `source`
--

DROP TABLE IF EXISTS `source`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `source` (
  `source_id` int NOT NULL AUTO_INCREMENT,
  `source_name` varchar(255) NOT NULL,
  PRIMARY KEY (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `techstack`
--

DROP TABLE IF EXISTS `techstack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `techstack` (
  `stack_id` int NOT NULL AUTO_INCREMENT,
  `stack_name` varchar(255) NOT NULL,
  PRIMARY KEY (`stack_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `training_obj`
--

DROP TABLE IF EXISTS `training_obj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_obj` (
  `training_id` int NOT NULL AUTO_INCREMENT,
  `training_name` varchar(255) NOT NULL,
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`training_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `training_obj_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `source` (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `training_request_employee_level`
--

DROP TABLE IF EXISTS `training_request_employee_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_request_employee_level` (
  `requestid` int NOT NULL,
  `employee_level_id` int NOT NULL,
  PRIMARY KEY (`requestid`,`employee_level_id`),
  KEY `employee_level_id` (`employee_level_id`),
  CONSTRAINT `training_request_employee_level_ibfk_1` FOREIGN KEY (`requestid`) REFERENCES `newtrainingrequest` (`requestid`),
  CONSTRAINT `training_request_employee_level_ibfk_2` FOREIGN KEY (`employee_level_id`) REFERENCES `employee_level` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-07 10:18:00
