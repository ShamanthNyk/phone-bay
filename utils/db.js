"use strict";

exports.CREATE_USER_TABLE = 
    `CREATE TABLE USERS (
        username varchar(100) PRIMARY KEY,
        password varchar(160) NOT NULL,
        fullname varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        hint varchar(100) NOT NULL)`;

exports.ADD_NEW_USER =
    `INSERT INTO USERS VALUES(?,SHA1(?),?,?,?)`;
    
exports.CHECK_FOR_DUPLICATE_USERNAME = 
    `SELECT COUNT(*) AS IS_PRESENT
     FROM USERS 
     WHERE username=?`;

exports.AUTHENTICATE_USER_ACCESS = 
    `SELECT username, fullname
     FROM USERS 
     WHERE username=? AND password=SHA1(?)`;
    


    
    


