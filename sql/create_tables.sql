CREATE TABLE PERSON (
    _id INT AUTO_INCREMENT,
    username varchar(100),
    _password varchar(160) NOT NULL,
    fullname varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    hint varchar(100) NOT NULL,
    _address varchar(100) NOT NULL, -- street, road, house no, block, cross, landmark
    _state varchar(20) NOT NULL,
    _pincode varchar(20) NOT NULL,
    PRIMARY KEY (_id)
);

CREATE TABLE CUSTOMER (
    _id INT NOT NULL,
    cust_id INT AUTO_INCREMENT,
    PRIMARY KEY (cust_id),
    FOREIGN KEY (_id) REFERENCES PERSON (_id)
);

CREATE TABLE TRADER (
    _id INT NOT NULL,
    trader_id INT AUTO_INCREMENT, 
    PRIMARY KEY (trader_id),
    FOREIGN KEY (_id) REFERENCES PERSON (_id)
);

CREATE TABLE PRODUCT (
    product_id INT AUTO_INCREMENT,
    trader_id INT,
    title varchar(30) NOT NULL,
    price float,
    ram INT NOT NULL,
    iStorage INT NOT NULL,
    display float NOT NULL,
    battery INT NOT NULL,
    os varchar(30) NOT NULL,
    camera INT NOT NULL,
    warranty INT NOT NULL,
    pimg varchar(8000) NOT NULL,
    brand varchar(30) NOT NULL,
    buys INT DEFAULT 0,
    PRIMARY KEY (product_id),
    FOREIGN KEY (trader_id) REFERENCES TRADER (trader_id)
);

-- user has to add products to cart if he wants to buy anything
-- once he places the order, items from cart is shifted to order table

CREATE TABLE CART (
    item_no INT AUTO_INCREMENT,
    cust_id INT,
    product_id INT,
    PRIMARY KEY(item_no),
    FOREIGN KEY (cust_id) REFERENCES CUSTOMER (cust_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES PRODUCT (product_id) ON DELETE CASCADE
);

CREATE TABLE ORDERS (
    order_id INT AUTO_INCREMENT,
    cust_id INT NOT NULL,
    trader_id INT NOT NULL,
    product_id INT NOT NULL,
    ordamt float NOT NULL,
    odate DATE DEFAULT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (cust_id) REFERENCES CUSTOMER (cust_id) ON DELETE CASCADE,
    FOREIGN KEY (trader_id) REFERENCES TRADER (trader_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES PRODUCT (product_id) ON DELETE CASCADE
);

-- keeps track of all users activity

CREATE TABLE LOGS (
    cust_id INT NOT NULL,
    trader_id INT NOT NULL,
    order_id INT NOT NULL,
    PRIMARY KEY (cust_id, trader_id, order_id),
    FOREIGN KEY (cust_id) REFERENCES CUSTOMER (cust_id) ON DELETE CASCADE,
    FOREIGN KEY (trader_id) REFERENCES TRADER (trader_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES ORDERS (order_id) ON DELETE CASCADE
);

-- seller will decide the wareshouse which will deliver it to the customers. 

CREATE TABLE WAREHOUSE (
    warehouse INT,
    city varchar(20) NOT NULL,
    PRIMARY KEY (warehouse)
);

CREATE TABLE SHIPMENT (
    order_id INT,
    warehouse INT NOT NULL,
    shipdate DATE DEFAULT NULL,
    shipped varchar(3) DEFAULT 'NO',
    PRIMARY KEY (order_id),
    FOREIGN KEY (order_id) REFERENCES ORDERS (order_id),
    FOREIGN KEY (warehouse) REFERENCES WAREHOUSE (warehouse)
);

DELETE FROM SHIPMENT;
DELETE FROM WAREHOSUE;
DELETE FROM LOGS;
DELETE FROM ORDERS;
DELETE FROM CART;
DELETE FROM PRODUCT;

DROP TABLE SHIPMENT;
DROP TABLE  WAREHOUSE;
DROP TABLE LOGS;
DROP TABLE ORDERS;
DROP TABLE CART;
DROP TABLE PRODUCT;