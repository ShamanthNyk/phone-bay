"use strict";

exports.ADD_NEW_USER =
    `CALL ADD_NEW_USER(?,?,?,?,?,?,?,?,?)`;    
    
exports.CHECK_FOR_DUPLICATE_USER =
    'SET @found = 0; CALL CHECK_FOR_DUPLICATE_USER(?,?,@found); SELECT @found as found';

exports.LOGIN_VERIFICATION =
    `SET @found = 0; CALL LOGIN_VERIFICATION(?,?,?,@found); SELECT @found as found`;    


    