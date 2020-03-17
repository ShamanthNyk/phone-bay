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

-- insert new product
DELIMITER $$
CREATE PROCEDURE INSERT_NEW_PRODUCT(
    IN title varchar(100), 
    IN price float,
    IN ram INT,
    IN iStorage INT,
    IN display float,
    IN battery INT,
    IN OS varchar(100),
    IN camera INT,
    IN warranty INT,
    IN pimg varchar(8000),
    IN brand varchar(100),
    IN uname varchar(100) 
    )
BEGIN
    DECLARE _trader_id INT DEFAULT 0;
    SELECT T.trader_id INTO _trader_id
    FROM PERSON P, TRADER T
    WHERE P._id=T._id AND P.username=uname;
    IF _trader_id <> 0 THEN
        INSERT INTO PRODUCT(trader_id,title,price,ram,iStorage,display,battery,OS,camera,warranty,pimg,brand)
        VALUES(_trader_id,title,price,ram,iStorage,display,battery,OS,camera,warranty,pimg,brand);
    END IF;    
END $$ 
DELIMITER ;

-- add to cart
DELIMITER $$
CREATE PROCEDURE ADD_TO_CART(
    IN uname varchar(100), 
    IN _product_id INT
    )
BEGIN
    DECLARE _cust_id INT DEFAULT 0;
    SELECT C.cust_id INTO _cust_id
    FROM PERSON P, CUSTOMER C
    WHERE P._id=C._id AND P.username=uname;
    IF _cust_id <> 0 THEN
        INSERT INTO CART(cust_id, product_id) VALUES(_cust_id, _product_id);
    END IF;
END $$ 
DELIMITER ;

-- retrieve cart items for one customer
DELIMITER $$
CREATE PROCEDURE GET_CART(
    IN uname varchar(100)
    )
BEGIN
    DECLARE _cust_id INT DEFAULT 0;
    SELECT C.cust_id INTO _cust_id
    FROM PERSON P, CUSTOMER C
    WHERE P._id=C._id AND P.username=uname;
    IF _cust_id <> 0 THEN
        SELECT *
        FROM CART C, PRODUCT P
        WHERE P.product_id=C.product_id AND C.cust_id=_cust_id;
    END IF;
END $$ 
DELIMITER ;

-- util which matches username to trader/customer id
DELIMITER $$
 
CREATE FUNCTION MAP_USERNAME_TO_ID(
    uname varchar(100),
    acc_type varchar(10)
) 
RETURNS INTEGER
DETERMINISTIC
BEGIN
    DECLARE _cust_id INTEGER;
    IF acc_type = 'customer' THEN
        SELECT C.cust_id INTO _cust_id
        FROM PERSON P, CUSTOMER C
        WHERE P._id=C._id AND P.username=uname;
    ELSE 
        SELECT T.trader_id INTO _cust_id
        FROM PERSON P, TRADER T
        WHERE P._id=T._id AND P.username=uname;    
    END IF;        
    RETURN (_cust_id);
END $$
DELIMITER ;

-- place orders for items in cart
DELIMITER $$
CREATE PROCEDURE PLACE_ORDER(
    IN _cust_id INT
    )
BEGIN
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE _trader_id INTEGER;
    DECLARE _product_id INTEGER;
    DECLARE _price FLOAT;
    DECLARE _item_no INTEGER;
    DECLARE items CURSOR FOR (
        SELECT item_no, product_id
        FROM CART C
        WHERE C.cust_id=_cust_id
    );
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1; -- declare NOT FOUND handler

    OPEN items;
    shift: LOOP
        FETCH items INTO _item_no, _product_id;
        IF finished = 1 THEN 
            LEAVE shift;
        END IF;
        SELECT trader_id, price INTO _trader_id, _price 
        FROM PRODUCT P
        WHERE P.product_id=_product_id;
        DELETE FROM CART WHERE item_no=_item_no;
        INSERT INTO ORDERS(cust_id, trader_id, product_id, ordamt, odate)
        VALUES(_cust_id, _trader_id, _product_id, _price, SYSDATE());
    END LOOP shift;
    CLOSE items;

END $$ 
DELIMITER ;

-- insert transactions into logs of customer
--DELIMITER $$
 
--CREATE TRIGGER LOG_AFTER_PLACING_ORDER
--AFTER INSERT ON ORDERS
--FOR EACH ROW
--BEGIN
--    INSERT INTO LOGS
--    VALUES(new.cust_id, new.trader_id, new.order_id);
--END $$
--DELIMITER ;

-- update buys after placing order
DROP TRIGGER UPDATE_BUYS_ORDER;
DELIMITER $$
 
CREATE TRIGGER UPDATE_BUYS_ORDER
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    UPDATE PRODUCT
    SET buys = buys + 1
    WHERE product_id=new.product_id;
END $$
 
DELIMITER ;

-- make sure shipdate is valid
DROP TRIGGER CHECK_SHIPDATE;
DELIMITER $$
 
CREATE TRIGGER CHECK_SHIPDATE
BEFORE INSERT ON SHIPMENT
FOR EACH ROW
BEGIN
    DECLARE _odate DATE;
    SELECT O.odate INTO _odate
    FROM ORDERS O
    WHERE O.order_id=new.order_id;
    IF DATEDIFF(new.shipdate, _odate) <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid shipping date';    
    END IF;    
END $$
 
DELIMITER ;

