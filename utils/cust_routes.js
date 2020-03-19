const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../'))); 
const db = require('./db');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Viggi@2000",
    database: "PHONE_BAY",
    multipleStatements: true
});

con.connect(function (err) {
    if (err)
        throw err;    
});

exports.home = async function(req, res) {
    if(req.session.acc_type == 'customer') {
        var user_data = {uname: req.session.uname};
        var products = [];
        var cart = [];
        var logs = [];
        var cart_sum = 0;
        try {
            await con.query(db.GET_TOP_PRODUCTS_BASIC_INFO, function(err, result, fields) {
                if (err)
                    throw err;
                for (var i = 0;i < result.length; i++) {
                    products.push({
                        pid: result[i].product_id,
                        title: result[i].title,
                        price: result[i].price,
                        pimg: result[i].pimg,
                        buys: result[i].buys
                    });
                }
            });
            await con.query(db.GET_CART_ITEMS, [req.session.uname], function(err, result, fields) {
                if (err)
                    throw err;               
                for (var i = 0;i < result[0].length; i++) {
                    cart.push({
                        pid: result[0][i].item_no,
                        brand: result[0][i].brand,
                        name: result[0][i].title,
                        price: result[0][i].price,
                        pimg: result[0][i].pimg,
                        ram: result[0][i].ram,
                        iStorage: result[0][i].iStorage,
                        display: result[0][i].display,
                        battery: result[0][i].battery,
                        os: result[0][i].os,
                        camera: result[0][i].camera,
                        warranty: result[0][i].warranty,
                        buys: result[0][i].buys
                    });
                    cart_sum = cart_sum + result[0][i].price;
                    
                }                           
            });
            await con.query(db.GET_LOGS_CUSTOMER, [req.session.uname,req.session.acc_type,req.session.uname,req.session.acc_type],
                function(err, result, fields) {
                if (err)
                    throw err;                 
                for (var i = 0;i < result[0].length; i++) {
                    logs.push({
                        idx: i+1,
                        title: result[0][i].title,
                        cost: result[0][i].ordamt,
                        trader: result[0][i].name,
                        odate: result[0][i].odate,
                        mode: result[0][i].mode,
                        shipdate: '--Yet to be shipped--',
                        city: '--Yet to be shipped--'
                    });
                }
                for(var i = 0;i < result[1].length; i++) {
                    for(var j=0;j < result[0].length; j++) {
                        if(result[0][j].order_id == result[1][i].order_id) {
                            logs[j]["shipdate"] = result[1][i].shipdate;
                            logs[j]["city"] = result[1][i].city;
                        }
                    }
                }
                let data = {user_data: user_data, 
                    products: products, 
                    cart: cart, 
                    cart_sum: cart_sum,
                    logs: logs
                };
                if(req.session.alert_type)
                    data[req.session.alert_type] = req.session.alert_data;                
                res.render('cust_home', data);                           
            });                                    
        } catch (err) {
            console.log(err);
        } finally {

        }
    } else {
        res.redirect('/');
    }      
};

exports.view_product = function(req, res, next) {
    req.session.product_id = req.body.item;
    con.query(
        db.GET_FULL_PRODUCT_INFO, 
        [req.body.item],
        function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.render('view-product', {
                brand: result[0].brand,
                name: result[0].title,
                price: result[0].price,
                pimg: result[0].pimg,
                ram: result[0].ram,
                iStorage: result[0].iStorage,
                display: result[0].display,
                battery: result[0].battery,
                os: result[0].os,
                camera: result[0].camera,
                warranty: result[0].warranty,
                buys: result[0].buys
            });    
    });     
};

exports.add_to_cart =  function(req, res, next) {
    if(req.body.action === "buy now") {
        con.query(
            db.BUY_NOW, 
            [req.session.uname, req.session.acc_type, req.session.product_id, req.body.payment],
            function (err, result, fields) {
                if (err) {
                    req.session.alert_type = "error"; 
                    req.session.alert_data = 'Something went wrong while buying, try again later!';
                } else {
                    req.session.alert_type = "msg"; 
                    req.session.alert_data = 'Order placed successfully!';                
                }
                res.redirect('/home-customer');    
        });
    } else {
        con.query(
            db.ADD_TO_CART, 
            [req.session.uname, req.session.product_id],
            function (err, result, fields) {
                if (err) {
                    req.session.alert_type = "error"; 
                    req.session.alert_data = 'Something went wrong while adding to cart, try again later!';
                } else {
                    req.session.alert_type = "msg"; 
                    req.session.alert_data = 'Item added to cart';                
                }
                res.redirect('/home-customer');    
        }); 
    }                
};

exports.remove_from_cart =  function(req, res, next) {
    con.query(
        db.REMOVE_FROM_CART, 
        [req.body.item],
        function (err, result, fields) {
            if (err) {
                req.session.alert_type = "error"; 
                req.session.alert_data = 'Something went wrong while removing from cart, try again later!';
            } else {
                req.session.alert_type = "msg"; 
                req.session.alert_data = 'Item removed from cart!';                   
            }
            res.redirect('/home-customer');    
    });                 
};

exports.place_order = function(req, res, next) {
    if(req.session.acc_type == 'customer') { // if - for bit of security
        con.query(
            db.PLACE_ORDER, 
            [req.session.uname, req.session.acc_type, req.body.payment],
            function (err, result, fields) {
                if (err) {
                    req.session.alert_type = "error"; 
                    req.session.alert_data = 'Something went wrong while placing order, try again later!';
                } else {
                    req.session.alert_type = "msg"; 
                    req.session.alert_data = 'Order placed successfully!';                    
                }
                res.redirect('/home-customer');    
        }); 
    }                
};