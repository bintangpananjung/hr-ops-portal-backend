-- Grant all privileges to hr_user for creating shadow databases
GRANT ALL PRIVILEGES ON *.* TO 'hr_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
