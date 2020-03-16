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
    if(req.session.acc_type == 'trader') {
        var user_data = {uname: req.session.uname};
        var products = [];
        res.render('trader_home', {user_data: user_data, products: products});      
    } else {
        res.redirect('/');
    }
};

exports.add =function(req, res, next) {
    res.render('add');
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
                res.render('add', {error: err});               
            } else {
                res.render('add', {msg: "Success"});
            }    
    });     
};