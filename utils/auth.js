const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('../utils/db');
const config = require('../public/global/config')

const con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Database connected");    
});

exports.register = function(req, res) {
    if(req.body.uname.length < 4) {
        res.render('sign-up', {
            error: "Minimum length of username is 4",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.pwd.length < 8) {
        res.render('sign-up', {
            error: "Minimum length of password is 8",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.fname.length < 2) {
        res.render('sign-up', {
            error: "Minimum length of fullname 2",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.hint.length < 1) {
        res.render('sign-up', {
            error: "Minimum length of hint 1",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.address.length < 15) {
        res.render('sign-up', {
            error: "Minimum length of address 15",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.pincode.length != 6 ) {
        res.render('sign-up', {
            error: "Length of pincode should be 6",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });
    } else if(req.body.pwd.localeCompare(req.body.cpwd) != 0) {
        res.render('sign-up', {
            error: "Passowrd doesn't seem to match",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint,
            pincode: req.body.pincode,
            address: req.body.address,
            state: req.body.state
        });        
    } else {
        con.query(db.CHECK_FOR_DUPLICATE_USER, [req.body.uname, req.body.acc_type],
            function (err, result, fields) {
                if (err)
                    console.log(err);    
                if(Number(result[2][0].found) == 1) {
                    res.render('sign-up', {
                        error: "User with same username already exists!",
                        uname: req.body.uname,
                        fname: req.body.fname,
                        email: req.body.email,
                        hint: req.body.hint,
                        pincode: req.body.pincode,
                        address: req.body.address,
                        state: req.body.state
                    });                
                } else if(Number(result[2][0].found) == 0) {
                    con.query(db.ADD_NEW_USER,
                        [   req.body.uname, 
                            req.body.pwd,
                            req.body.fname,
                            req.body.email,
                            req.body.hint,
                            req.body.pincode,
                            req.body.address,
                            req.body.state,
                            req.body.acc_type                            
                        ],
                        function (err, result, fields) {
                            if (err) {
                                console.log(err);
                            }
                            req.session.signed_up = true;
                            res.redirect('/sign-in');
                    });                                 
                }
        });        
    }     
}

exports.sign_in =  function(req, res) {
    if(req.session.signed_up == true)
        res.render('sign-in', {msg: "Account successfully created"});
    else if(req.session.authenticated == false)
        res.render('sign-in', {error: "Invalid username or password"});
    else        
        res.render('sign-in');
};

exports.sign_up = function(req, res) {
    res.render('sign-up', {error: null});
};

exports.sign_out = function(req, res, next) {
    console.log(req.session.uname + ' signed out ');
    req.session.authenticated = false;
    if (req.session) {
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
            res.redirect('/');
        }
      });
    }
};

exports.verify = function(req, res) {
    con.query(
        db.LOGIN_VERIFICATION, 
        [req.body.uname, req.body.pwd, req.body.acc_type],
        function (err, result, fields) {
            if (err)
                throw err;    
            if(Number(result[2][0].found) == 1) {
                req.session.uname = req.body.uname;
                req.session.acc_type = req.body.acc_type;
                req.session.authenticated = true;
                console.log(req.session.uname + ' has signed in');
                if(req.session.acc_type == 'customer')
                    res.redirect('/home-customer');
                else if(req.session.acc_type == 'trader')
                    res.redirect('/home-trader');
                else
                    res.redirect('/');    
            } else if(Number(result[2][0].found) == 0){
                req.session.authenticated = false;
                res.redirect('sign-in');
            } else {
                res.redirect('/');
            }           
    });      
};