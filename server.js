const PORT = 8080;

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const pug = require('pug');
const db = require('./utils/db');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/'))); 
// setting reference directory for assets and static files

// setup connection to database
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Viggi@2000",
    database: "E_CART"
});

// handle session
app.use(session({
    secret: '@#$!&^$',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Database connected");    
});

app.listen(PORT, function () {
    console.log('Listening on ' + PORT);
});

app.get('/', function(req, res) {
    res.render('index', {error: null});
});

app.get('/sign-in', function(req, res) {
    res.render('sign-in', {error: null});
});

app.get('/sign-up', function(req, res) {
    res.render('sign-up', {error: null});
});

app.post('/register', function(req, res) {
    if(req.body.uname.length < 4 || req.body.pwd.length < 8 || req.body.pwd.fname < 2) {
        res.render('sign-up', {
            error: "Minimum length of username, fullname and password is 5, 2 and 9 respectively",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint
        });
    } else if(req.body.pwd.localeCompare(req.body.cpwd) != 0) {
        res.render('sign-up', {
            error: "Passowrd doesn't seem to match",
            uname: req.body.uname,
            fname: req.body.fname,
            email: req.body.email,
            hint: req.body.hint
        });        
    } else {
        con.query(db.CHECK_FOR_DUPLICATE_USERNAME, [req.body.uname],
            function (err, result, fields) {
                if (err)
                    console.log(err);
                if(Number(result[0].IS_PRESENT) == 1) {
                    res.render('sign-up', {
                        error: "User with same username already exists!",
                        uname: req.body.uname,
                        fname: req.body.fname,
                        email: req.body.email,
                        hint: req.body.hint
                    });                
                } else if(Number(result[0].IS_PRESENT) == 0) {
                    con.query(db.ADD_NEW_USER,
                        [   req.body.uname, 
                            req.body.pwd,
                            req.body.fname,
                            req.body.email,
                            req.body.hint],
                        function (err, result, fields) {
                            if (err) {
                                console.log(err);
                            }
                            res.render('index', {msg: "Account created successfully"});
                    });                                 
                }
        });        
    }     
});

app.post('/auth', function(req, res) {
    con.query(
        db.AUTHENTICATE_USER_ACCESS, 
        [req.body.uname, req.body.pwd],
        function (err, result, fields) {
            if (err)
                throw err;
            if(result[0] != undefined) {
                req.session.uname = req.body.uname;  
                res.render('home', {uname: result[0].username, name: result[0].fullname});
                console.log(req.session.uname + ' has signed in');
            } else {
                res.render('sign-in', {error: "Invalid username or password"});
                console.log('sign-in request failed');
            }    
    });      
});

app.get('/sign-out', function(req, res) {
    console.log(req.session.uname + ' signed out ');
    req.session = null;
    res.render('index', {msg: "Logged out"});
});