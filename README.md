# phone-bay

Setup:

  1. Install MySQL and Nodejs
  
  2. Start MySQL shell in terminal and type the following commands
  
      2.1 CREATE DATABASE PHONE_BAY;
      
      2.2 Go to sql folder -> create_tables.sql, Copy paste the entire script
      
      2.3 Go to folder where this code(entire project) resides.
      
      2.4 Replace the password in utils/auth.js, utils/trader_routes.js, utils/cust_routes.js, if you didnt set the password
          remove the password field in creatConnection()
          
      2.4 Open terminal/command window in that folder. Type node server.js
      
      2.5 Go to web browser and type localhost:8080
      
      2.5 And play with it.
      
