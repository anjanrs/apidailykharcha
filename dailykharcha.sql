-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: dailykharcha
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_per_user`
--

DROP TABLE IF EXISTS `access_per_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_per_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `access_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_access_per_user_user_idx` (`user_id`),
  KEY `fk_access_per_user_access_type_idx` (`access_type_id`),
  CONSTRAINT `fk_access_per_user_access_type` FOREIGN KEY (`access_type_id`) REFERENCES `access_types` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_access_per_user_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_per_user`
--

LOCK TABLES `access_per_user` WRITE;
/*!40000 ALTER TABLE `access_per_user` DISABLE KEYS */;
INSERT INTO `access_per_user` VALUES (32,1,2);
/*!40000 ALTER TABLE `access_per_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `access_per_usergroup`
--

DROP TABLE IF EXISTS `access_per_usergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_per_usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_type_id` int(11) NOT NULL,
  `usergroup_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_access_per_usergroup_access_idx` (`access_type_id`),
  KEY `fk_access_per_usergroup_usergroup_idx` (`usergroup_id`),
  CONSTRAINT `fk_access_per_usergroup_access` FOREIGN KEY (`access_type_id`) REFERENCES `access_types` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_access_per_usergroup_usergroup` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroups` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_per_usergroup`
--

LOCK TABLES `access_per_usergroup` WRITE;
/*!40000 ALTER TABLE `access_per_usergroup` DISABLE KEYS */;
INSERT INTO `access_per_usergroup` VALUES (45,2,2),(46,1,2),(47,3,2),(52,3,1),(53,2,1),(54,1,1),(55,4,1);
/*!40000 ALTER TABLE `access_per_usergroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `access_types`
--

DROP TABLE IF EXISTS `access_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_types`
--

LOCK TABLES `access_types` WRITE;
/*!40000 ALTER TABLE `access_types` DISABLE KEYS */;
INSERT INTO `access_types` VALUES (1,'READ'),(2,'EDIT'),(3,'DELETE'),(4,'ADD');
/*!40000 ALTER TABLE `access_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_types`
--

DROP TABLE IF EXISTS `expense_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expense_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `desc` varchar(500) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_parent_expense_type_idx` (`parent_id`),
  CONSTRAINT `fk_parent_expense_type` FOREIGN KEY (`parent_id`) REFERENCES `expense_types` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_types`
--

LOCK TABLES `expense_types` WRITE;
/*!40000 ALTER TABLE `expense_types` DISABLE KEYS */;
INSERT INTO `expense_types` VALUES (2,'Electricity',NULL,92),(90,'Beauty Products',NULL,NULL),(92,'Accomodation','Expenses realated to accomodation',92),(93,'Sub Expense',NULL,2),(94,'Transportation',NULL,NULL);
/*!40000 ALTER TABLE `expense_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `expense_date` int(11) NOT NULL,
  `expense_type_id` int(11) DEFAULT NULL,
  `sub_expense_type_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,5) DEFAULT NULL,
  `unit_price` decimal(10,5) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `amount` decimal(10,5) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_expenses_1_idx` (`sub_expense_type_id`),
  KEY `fk_expense_type_idx` (`expense_type_id`),
  KEY `fk_expenses_1_idx1` (`store_id`),
  KEY `fk_user_idx` (`user_id`),
  KEY `fk_unit_idx` (`unit_id`),
  CONSTRAINT `fk_expense_type` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_types` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_sub_expense_type` FOREIGN KEY (`sub_expense_type_id`) REFERENCES `expense_types` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (130,'222',1548334800,90,93,3222.00000,2.00000,5,22.00000,16,'222',1),(133,'test',1546347600,2,93,23.00000,12.00000,6,1212.00000,16,'test',1),(135,'testtestdd',1546952400,90,93,33.00000,33.00000,7,33.00000,15,'test',1),(136,'new item',1547557200,90,93,33.00000,33.00000,5,33.00000,16,'testwtest',1),(140,'test',1548766800,2,2,33.00000,33.00000,7,33.00000,18,NULL,1),(141,'test',1548680400,90,2,2.00000,33.00000,5,333.00000,16,'',1),(142,'test',1547730000,94,92,333.00000,343.00000,5,33.00000,18,'test',1),(144,'testtest',1546952400,90,92,3.00000,33.00000,5,33.00000,15,'222ddd',1);
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems`
--

DROP TABLE IF EXISTS `menuitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menuitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(500) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `path` varchar(250) DEFAULT NULL,
  `seq` int(11) NOT NULL,
  PRIMARY KEY (`id`,`label`,`seq`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_parent_menuitem_idx` (`parent_id`),
  CONSTRAINT `fk_parent_menuitem` FOREIGN KEY (`parent_id`) REFERENCES `menuitems` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems`
--

LOCK TABLES `menuitems` WRITE;
/*!40000 ALTER TABLE `menuitems` DISABLE KEYS */;
INSERT INTO `menuitems` VALUES (1,'Add Expenses',NULL,'/add-detail/expense',1),(2,'Daily Expenses',NULL,'/list/daily-expenses',2),(6,'Daily Expenses By Sub Type',28,'/list/daily-expenses-by-sub-type',4),(7,'Daily Expenses By Type',28,'/list/daily-expenses-by-type',3),(8,'Daily Expenses List To Detail',NULL,'/list/daily-expense-detail',5),(12,'Stores',20,'/list/stores',2),(13,'Units',20,'/list/units',3),(14,'Menu Items',20,'/list/menuitems',4),(15,'Users',20,'/list/users',5),(20,'Admin',NULL,'###',7),(24,'User Groups',20,'/list/usergroups',7),(26,'Expense Types',20,'/list/expense-types',10),(27,'Log Out',NULL,'/logout',1000),(28,'Reports',NULL,'###',6),(29,'Dashboard',NULL,'/dashboard',0);
/*!40000 ALTER TABLE `menuitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems_per_user`
--

DROP TABLE IF EXISTS `menuitems_per_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menuitems_per_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_useraccess_per_menuitem_menu_idx` (`menu_id`),
  KEY `menuitems_per_user_user_idx` (`user_id`),
  CONSTRAINT `fk_menuitems_per_user_menu` FOREIGN KEY (`menu_id`) REFERENCES `menuitems` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_menuitems_per_user_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems_per_user`
--

LOCK TABLES `menuitems_per_user` WRITE;
/*!40000 ALTER TABLE `menuitems_per_user` DISABLE KEYS */;
INSERT INTO `menuitems_per_user` VALUES (113,1,26);
/*!40000 ALTER TABLE `menuitems_per_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems_per_usergroup`
--

DROP TABLE IF EXISTS `menuitems_per_usergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menuitems_per_usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usergroup_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_usergroupaccess_per_menuitem_menuitem_idx` (`menu_id`),
  KEY `fk_menuitems_per_usergroup_usergroup_idx` (`usergroup_id`),
  CONSTRAINT `fk_menuitems_per_usergroup_menuitem` FOREIGN KEY (`menu_id`) REFERENCES `menuitems` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_menuitems_per_usergroup_usergroup` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroups` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems_per_usergroup`
--

LOCK TABLES `menuitems_per_usergroup` WRITE;
/*!40000 ALTER TABLE `menuitems_per_usergroup` DISABLE KEYS */;
INSERT INTO `menuitems_per_usergroup` VALUES (85,2,1),(86,2,8),(87,2,27),(88,2,28),(89,2,2),(90,2,6),(91,2,7),(92,2,29),(108,1,1),(109,1,13),(110,1,12),(111,1,2),(112,1,6),(113,1,15),(114,1,20),(115,1,14),(116,1,7),(117,1,8),(118,1,24),(119,1,27),(120,1,28),(121,1,26),(122,1,29);
/*!40000 ALTER TABLE `menuitems_per_usergroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `desc` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (15,'Woolworths',NULL),(16,'Big W',''),(17,'Coles',NULL),(18,'Target',NULL),(19,'Alid',NULL),(20,'BWS',NULL),(21,'Auburn Bazar',NULL),(22,'Chinese shop',NULL);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (5,'lt','liter'),(6,'kg','kilograms'),(7,'gm','grams');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergroups`
--

DROP TABLE IF EXISTS `usergroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `desc` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergroups`
--

LOCK TABLES `usergroups` WRITE;
/*!40000 ALTER TABLE `usergroups` DISABLE KEYS */;
INSERT INTO `usergroups` VALUES (1,'Admin',NULL),(2,'Data Entry',NULL);
/*!40000 ALTER TABLE `usergroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergroups_per_user`
--

DROP TABLE IF EXISTS `usergroups_per_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergroups_per_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `usergroup_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_usergroups_per_users_user_idx` (`user_id`),
  KEY `fk_usergroups_per_users_usergroup_idx` (`usergroup_id`),
  CONSTRAINT `fk_usergroups_per_users_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_usergroups_per_users_usergroup` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroups` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergroups_per_user`
--

LOCK TABLES `usergroups_per_user` WRITE;
/*!40000 ALTER TABLE `usergroups_per_user` DISABLE KEYS */;
INSERT INTO `usergroups_per_user` VALUES (36,1,2),(37,1,1);
/*!40000 ALTER TABLE `usergroups_per_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'anjan@gmail.com','$2a$10$nYKb/uwIFYcwzzY9uEHxy.Cq7JTpdPw9Q4zcpfC04.iGcGe19EMgm','anjan','shakya','anjan'),(3,'ruby@gmail.com','$2a$10$VbtyhSNieLK3p2QoFc.8TO3ifziZbvtHfhFwwEcg01Z/kJlJKLiM6','ruby','shakya','ruby');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-16  0:41:07
