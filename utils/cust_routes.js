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

exports.home = function(req, res) {
    if(req.session.acc_type == 'customer') {
        var user_data = {uname: req.session.uname};
        var products = [];
        con.query(
            db.GET_TOP_PRODUCTS_BASIC_INFO, 
            function (err, result, fields) {
                if (err) {
                    throw err;
                }
                for (var i = 0;i < result.length; i++) {
                    products.push({
                        pid: result[i].product_id,
                        title: result[i].title,
                        price: result[i].price,
                        pimg: result[i].pimg
                    });
                    if(i == result.length - 1) {
                        res.render('cust_home', {user_data: user_data, products: products});
                    }
                }                            
        });        
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
                warranty: result[0].warranty
            });    
    });     
};
