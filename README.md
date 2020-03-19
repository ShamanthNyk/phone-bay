# phone-bay

<strong>Setup mysql server, set root password and create database.</strong>
```console
user@machine:~$ sudo apt-get install mysql-server
user@machine:~$ sudo mysql_secure_installation
user@machine:~$ mysql -u root -p
user@machine:~$ CREATE DATABASE PHONE_BAY;
```

<strong>Clone this repository in a local drive and in config.js change password and other variables if necessary.</strong>
```console
user@machine:~$ git clone https://github.com/vi88i/phone-bay.git
user@machine:~$ cd phone-bay/public/global/config.js
```

<strong>Run setup_SQL.sh in sql folder, this will setup all tables, TSQL & PL/SQL</strong>
```console
user@machine:~$ cd phone-bay/sql
user@machine:~$ chmod +x setup_SQL.sh 
user@machine:~$ ./setup_SQL.sh
```

<strong>Create minimum of 1 customer and 3 traders</strong>
```console
user@machine:~$ cd phone-bay
user@machine:~$ node server.js 
```
<strong>In web browser url search type ' localhost:8080', use sign-up option to create accounts.</strong>

<strong>Run populate.sh in sql folder, this will populate product table with 20 rows for product and 5 rows for warehouse</strong>
```console
user@machine:~$ cd phone-bay/sql
user@machine:~$ chmod +x populate.sh 
user@machine:~$ ./populate.sh
```

<strong>Done!</strong>

You can start playing with it
```console
user@machine:~$ cd phone-bay
user@machine:~$ node server.js 
```

















