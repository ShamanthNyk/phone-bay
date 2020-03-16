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
        res.render('cust_home', {user_data: user_data, products: products});
    } else {
        res.redirect('/');
    }      
};