CREATE TABLE IF NOT EXISTS `Notifications` (
	`idNotification` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`status` enum('read', 'not read', 'pending') NOT NULL,
	`dataCreazione` date,
	`oraCreazione` time,
	`idUser` int UNSIGNED NOT NULL
);

ALTER TABLE `Notifications`
ADD CONSTRAINT fk_idNotifications
FOREIGN KEY (idUser) REFERENCES Users(idUser)
ON UPDATE CASCADE
ON DELETE CASCADE;