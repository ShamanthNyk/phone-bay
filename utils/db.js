"use strict";

exports.ADD_NEW_USER =
    `CALL ADD_NEW_USER(?,?,?,?,?,?,?,?,?)`;    
    
exports.CHECK_FOR_DUPLICATE_USER =
    `SET @found = 0; CALL CHECK_FOR_DUPLICATE_USER(?,?,@found); SELECT @found as found`;

exports.LOGIN_VERIFICATION =
    `SET @found = 0; CALL LOGIN_VERIFICATION(?,?,?,@found); SELECT @found as found`;    

exports.INSERT_NEW_PRODUCT = 
    `CALL INSERT_NEW_PRODUCT(?,?,?,?,?,?,?,?,?,?,?,?)`;

exports.GET_TOP_PRODUCTS_BASIC_INFO =
    `SELECT product_id, title, price, pimg, buys
    FROM PRODUCT
    ORDER BY buys DESC
    LIMIT 8`;
    
exports.GET_FULL_PRODUCT_INFO =
    `SELECT *
    FROM PRODUCT
    WHERE product_id=?`;

exports.ADD_TO_CART =
    `CALL ADD_TO_CART(?,?)`;    

exports.GET_CART_ITEMS =
    `CALL GET_CART(?)`;

exports.REMOVE_FROM_CART =
    `DELETE FROM CART
    WHERE item_no=?`;    

exports.BUY_NOW = 
    `SET @cust_id=MAP_USERNAME_TO_ID(?,?); CALL BUY_NOW(@cust_id,?,?)`;    


exports.PLACE_ORDER = 
    `SET @cust_id=MAP_USERNAME_TO_ID(?,?); CALL PLACE_ORDER(@cust_id,?)`;
    
exports.GET_LOGS_CUSTOMER =
    `SELECT 
        PR.title AS title, 
        O.ordamt AS ordamt, 
        P.fullname AS name, 
        O.odate AS odate, 
        O.order_id AS order_id,
        O.mode AS mode
    FROM ORDERS O, PERSON P, PRODUCT PR, TRADER T
    WHERE O.product_id=PR.product_id AND
    O.trader_id=T.trader_id AND 
    T._id=P._id AND 
    O.cust_id=MAP_USERNAME_TO_ID(?,?)
    ORDER BY O.order_id DESC;
    SELECT S.shipdate, W.city, O.order_id AS order_id
    FROM SHIPMENT S, WAREHOUSE W, ORDERS O
    WHERE O.order_id=S.order_id AND W.warehouse=S.warehouse AND O.cust_id=MAP_USERNAME_TO_ID(?,?)
    ORDER BY O.order_id DESC`;    

exports.GET_LOGS_TRADER =
    `SELECT
        PR.title AS title,
        O.ordamt AS ordamt,
        P.fullname AS name,
        O.odate AS odate,
        O.mode AS mode
    FROM ORDERS O, PERSON P, PRODUCT PR, CUSTOMER C
    WHERE O.product_id=PR.product_id AND
    O.cust_id=C.cust_id AND 
    C._id=P._id AND 
    O.trader_id=MAP_USERNAME_TO_ID(?,?)
    ORDER BY O.order_id DESC;
    SELECT S.shipdate, W.city
    FROM SHIPMENT S, WAREHOUSE W, ORDERS O
    WHERE O.order_id=S.order_id AND W.warehouse=S.warehouse AND O.trader_id=MAP_USERNAME_TO_ID(?,?)
    ORDER BY O.order_id DESC`;  

exports.GET_TRADER_PRODUCTS = 
    `SELECT *
    FROM PRODUCT
    WHERE trader_id=MAP_USERNAME_TO_ID(?,?)`;    

exports.REMOVE_FROM_PRODUCT =
    `DELETE FROM PRODUCT
    WHERE product_id=?`;
    
exports.GET_ORDERS_FOR_TRADER =
    `SELECT
        PR.title AS title,
        O.ordamt AS ordamt,
        P.fullname AS name,
        O.odate AS odate,
        O.order_id AS id,
        P._address AS address,
        P._state AS state,
        P._pincode AS pincode,
        O.mode AS mode
    FROM ORDERS O, PERSON P, PRODUCT PR, CUSTOMER C
    WHERE O.product_id=PR.product_id AND
    O.cust_id=C.cust_id AND 
    C._id=P._id AND 
    O.trader_id=MAP_USERNAME_TO_ID(?,?) AND NOT EXISTS (
        SELECT *
        FROM SHIPMENT S
        WHERE S.order_id=O.order_id
    )
    ORDER BY O.order_id DESC`;

exports.GET_AVAILABLE_WAREHOUSE = 
    `SELECT * FROM WAREHOUSE`; 
    
exports.DISPATCH_ITEM =
    `INSERT INTO SHIPMENT VALUES(?,?,STR_TO_DATE(?,'%Y%m%d'))`;    