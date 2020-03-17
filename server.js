const PORT = 8080;

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));  // setting reference directory for assets and static files

app.listen(PORT, '127.0.0.1', function () {
    console.log('Listening on ' + PORT);
});

// handle session
app.use(session({
    secret: '@#$!&^$',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

const auth = require('./utils/auth');
const cust = require('./utils/cust_routes');
const trader = require('./utils/trader_routes');

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Authentication and Registration @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/sign-in', auth.sign_in);
app.get('/sign-up', auth.sign_up);
app.post('/register', auth.register);
app.get('/sign-out', auth.sign_out);
app.post('/verify', auth.verify);
app.get('/home-customer', cust.home);
app.get('/home-trader', trader.home);
app.post('/view-product', cust.view_product);
app.get('/add-to-cart', cust.add_to_cart);
app.post('/remove-from-cart', cust.remove_from_cart);
app.get('/place-order', cust.place_order);
app.post('/process-new-product', trader.process_new_product);
app.post('/remove-from-product', trader.remove_from_product);

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

// app.post('/process-new-product', function(req, res, next) {
//     con.query(
//         db.INSERT_NEW_PRODUCT, 
//         [req.body.pid, 
//         req.body.name,
//         req.body.price,
//         req.body.ram,
//         req.body.iStorage,
//         req.body.display,
//         req.body.battery,
//         req.body.OS,
//         req.body.camera,
//         req.body.warranty,
//         req.body.pimg
//         ],
//         function (err, result, fields) {
//             if (err) {
//                 res.render('add', {error: err});               
//                 console.log(err);
//             } else {
//                 res.render('add', {msg: "Success"});
//             }    
                
//     });     
// });

