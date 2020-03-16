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
    `SELECT product_id, title, price, pimg
    FROM PRODUCT
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

exports.PLACE_ORDER = 
    `SET @cust_id=MAP_USERNAME_TO_ID(?,?); CALL PLACE_ORDER(@cust_id)`;    