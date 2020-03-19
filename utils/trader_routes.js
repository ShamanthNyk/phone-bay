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
    try {
        if(req.session.acc_type == 'trader') {
            var user_data = {uname: req.session.uname};
            var products = [];
            var logs = [];
            var orders = [];
            var warehouse = [];
            await con.query(db.GET_TRADER_PRODUCTS, [req.session.uname, req.session.acc_type], 
                function(err, result, fields) {
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
            await con.query(db.GET_AVAILABLE_WAREHOUSE,
                function(err, result, fields) {
                if (err)
                    throw err;           
                for (var i = 0;i < result.length; i++) {
                    warehouse.push({
                        id: result[i].warehouse,
                        city: result[i].city
                    });
                }
            });             
            await con.query(db.GET_ORDERS_FOR_TRADER, [req.session.uname,req.session.acc_type],
                function(err, result, fields) {
                if (err)
                    throw err;                 
                for (var i = 0;i < result.length; i++) {
                    orders.push({
                        idx: i+1,
                        id: result[i].id,
                        title: result[i].title,
                        cost: result[i].ordamt,
                        customer: result[i].name,
                        odate: result[i].odate,  
                        mode: result[i].mode,
                        address: result[i].address + "." + result[i].state + "." + result[i].pincode 
                    });
                }
            });                   
            await con.query(db.GET_LOGS_TRADER, [req.session.uname,req.session.acc_type,req.session.uname,req.session.acc_type],
                function(err, result, fields) {
                if (err)
                    throw err;                 
                for (var i = 0;i < result[0].length; i++) {
                    logs.push({
                        idx: i+1,
                        title: result[0][i].title,
                        cost: result[0][i].ordamt,
                        customer: result[0][i].name,
                        odate: result[0][i].odate,
                        mode: result[0][i].mode,                         
                        shipdate: result[1][i] == undefined ? '--Yet to be shipped--' : result[1][i].shipdate, // values of shipdate
                        city: result[1][i] == undefined ? '--Yet to be shipped--' : result[1][i].city // and city comes from second select stmt
                    });
                }
                let data =  {
                    user_data: user_data, 
                    products: products, 
                    logs: logs,
                    orders: orders,
                    warehouse: warehouse
                }
                if(req.session.alert_type)
                    data[req.session.alert_type] = req.session.alert_data;
                res.render('trader_home', data);                           
            });                       
        } else {
            res.redirect('/');
        }
    } catch(err) {
        console.log(err);
    } finally {

    }
};

exports.process_new_product = function(req, res, next) {
    con.query(
        db.INSERT_NEW_PRODUCT, 
        [req.body.title,
        req.body.price,
        req.body.ram,
        req.body.iStorage,
        req.body.display,
        req.body.battery,
        req.body.OS,
        req.body.camera,
        req.body.warranty,
        req.body.pimg,
        req.body.brand,
        req.session.uname
        ],
        function (err, result, fields) {
            if (err) {
                res.send(err);               
            } else {
                res.send("Sucess");
            }    
    });     
};

exports.remove_from_product =  function(req, res, next) {
    if(req.session.acc_type == 'trader') {
        con.query(
            db.REMOVE_FROM_PRODUCT, 
            [req.body.item],
            function (err, result, fields) {
                if (err) {
                    req.session.alert_type = "error"; 
                    req.session.alert_data = 'Something went wrong while removing product, try again later!';
                } else {
                    req.session.alert_type = "msg"; 
                    req.session.alert_data = 'Item removed successfully!';                    
                }
            res.redirect('/home-trader');    
        }); 
    } else {
        res.redirect('/');
    }                
};

exports.dispatch_item = function(req, res, next) {
    if(req.session.acc_type == 'trader') {
        let date = req.body.shipdate.replace('-', '');
        date = date.replace('-', '');
        con.query(
            db.DISPATCH_ITEM, 
            [req.body.order_id,
            req.body.w_id,
            date],
            function (err, result, fields) {
                if (err) {
                    req.session.alert_type = "error"; 
                    req.session.alert_data = 'Invalid shipping date!';
                } else {
                    req.session.alert_type = "msg";
                    req.session.alert_data = 'Shipped successfully!';
                }
                res.redirect('/home-trader');    
        }); 
    } else {
        res.redirect('/');
    }                
};