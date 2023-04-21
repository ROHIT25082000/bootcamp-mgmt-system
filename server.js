/*
 *  Server.js is the server for managing the rest API  
 */

require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const jwt = require('jsonwebtoken');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fs = require('fs');
console.log(process.env.NODE_ENV);
console.log(typeof process.env.NODE_ENV);
const env = process.env.NODE_ENV || "development";
if(env === "test"){
    console.log("Came to test db");
  process.env.MONGODB_URI = process.env.DB_CONNECTION_TEST
} else {
    console.log("came to running db");
  process.env.MONGODB_URI = process.env.DB_CONNECTION
}



/* ALL AVAILABLE ROUTES */  
const authRoute = require('./routes/auth');
const userRoutes = require('./routes/user');
const assigmentRoutes = require('./routes/assignment');
const meetingRoutes = require('./routes/meeting');
const submissionRoutes = require('./routes/submission');
const teamRoutes = require('./routes/team');
const { checkUser, requireAuth } = require('./middleware/auth_middleware');


/* Swagger api docs */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/* MIDDLEWARE */
app.use(cookieParser());
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};
app.use(cors(corsOptions));
app.use(morgan('common', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
app.use(morgan('dev')); // adding the middleware for logging 
app.use(bodyParser.json()); // applying bodyparser


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); 
//     res.header("Access-Control-Allow-Header",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"); 
//     if (req.method === 'OPTIONS') {
//         res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
//         res.status(200).json({}); 
//     }
//     next();
// });

/*
 *   Below are all the rest API for your database access 
 *         
 */
app.use('*', checkUser);
app.use('/auth', authRoute);
app.use(requireAuth);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assigmentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/teams', teamRoutes); 

/* 
 *  These below are the Error handlers for the entire system 
 */


/* If None of the END POINTS worked in the DB then we come here */

app.use(function(req, res, next) {
    const error = new Error("Not found in the api");
    error.status = 404;
    next(error); 
}); 

/* For all other types of error we come here */

app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
}); 

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});  

app.listen('4000', function() {
    console.log("The database started"); 
});