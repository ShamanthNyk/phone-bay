-- check if duplicate user exists while sign up
DELIMITER $$
CREATE PROCEDURE CHECK_FOR_DUPLICATE_USER(IN uname varchar(100), IN acc_type varchar(10), OUT found INT)
BEGIN
    IF acc_type = 'customer' THEN
        SELECT COUNT(*) INTO found
        FROM PERSON P, CUSTOMER C
        WHERE P._id=C._id AND P.username=uname;
    ELSE
        SELECT COUNT(*) INTO found
        FROM PERSON P, TRADER T
        WHERE P._id=T._id AND P.username=uname;
    END IF;            
END $$ 
DELIMITER ;

-- add new user depending on user type
DELIMITER $$
CREATE PROCEDURE ADD_NEW_USER (
    IN uname varchar(100),
    IN pwd varchar(160),
    IN fname varchar(100),
    IN email varchar(100),
    IN hint varchar(100),
    IN _pincode varchar(20),
    IN _address varchar(100),
    IN _state varchar(20),
    IN acc_type varchar(20)
)
BEGIN
    DECLARE _new_id INT DEFAULT 0;
    INSERT INTO PERSON(username, _password, fullname, email, hint, _address, _state, _pincode)
    VALUES(uname, SHA1(pwd), fname, email, hint, _address, _state, _pincode);
    SELECT COUNT(*) INTO _new_id
    FROM PERSON;        
    IF acc_type = 'customer' THEN
        INSERT INTO CUSTOMER(_id) VALUES (_new_id);          
    ELSE
        INSERT INTO TRADER(_id) VALUES (_new_id);
    END IF;            
END $$ 
DELIMITER ;

-- login verification
DELIMITER $$
CREATE PROCEDURE LOGIN_VERIFICATION(
    IN uname varchar(100), 
    IN pwd varchar(100), 
    IN acc_type varchar(10),
    OUT found INT
    )
BEGIN
    IF acc_type = 'customer' THEN
        SELECT COUNT(*) INTO found
        FROM PERSON P, CUSTOMER C
        WHERE P._id=C._id AND P.username=uname AND P._password=SHA1(pwd);
    ELSE
        SELECT COUNT(*) INTO found
        FROM PERSON P, TRADER T
        WHERE P._id=T._id AND P.username=uname AND P._password=SHA1(pwd);
    END IF;            
END $$ 
DELIMITER ;
