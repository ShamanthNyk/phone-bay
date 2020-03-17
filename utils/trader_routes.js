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
            await con.query(db.GET_TRADER_PRODUCTS, [req.session.uname, req.session.acc_type], 
                function(err, result, fields) {
                if (err)
                    throw err; 
                for (var i = 0;i < result.length; i++) {
                    products.push({
                        pid: result[i].product_id,
                        title: result[i].title,
                        price: result[i].price,
                        pimg: result[i].pimg
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
                        shipdate: result[1][i] == undefined ? '--Yet to be shipped--' : result[1][i].shipdate, // values of shipdate
                        city: result[1][i] == undefined ? '--Yet to be shipped--' : result[1][i].city // and city comes from second select stmt
                    });
                }
                res.render('trader_home', {user_data: user_data, 
                    products: products, 
                    logs: logs
                });                           
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