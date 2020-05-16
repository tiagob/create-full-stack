#!/bin/bash

# Create database for dev
mysql -u root -e "CREATE DATABASE todo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -u root -e "CREATE USER 'todo'@'localhost' IDENTIFIED WITH mysql_native_password BY 'todo';"
mysql -u root -e "GRANT ALL PRIVILEGES ON todo.* TO 'todo'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
