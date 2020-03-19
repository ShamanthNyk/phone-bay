echo "Enter name new of database: "
read db
echo "Enter root password for MySQL server: "
read password

`mysql -u root -p$password $db < populate.sql`

echo 'Success!'