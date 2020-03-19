echo "Enter name of database(PHONE_BAY? anything you like): "
read db
echo "Enter root password for MySQL server: "
read password
echo "Enter an unused port number(port>1024): "
read port

echo '"use strict";
exports.port='$port';
exports.password='\"$password\"';
exports.host="localhost";
exports.user="root";
exports.database='\"$db\"';' > ../public/global/config.js

echo "DROP DATABASE IF EXISTS $db; CREATE DATABASE $db;" > setup.sql

`mysql -u root -p$password < setup.sql`
`mysql -u root -p$password $db < create_tables.sql`
`mysql -u root -p$password $db < procs.sql`

echo "Sucess!"


