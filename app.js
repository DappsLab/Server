import {Master} from "./models";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const {ApolloServer, gql, ApolloError} = require('apollo-server-express');
import { v4 } from "uuid";
import { GraphQLError } from "graphql";
const typeDefs = require('./schema/typeDefs.js')
const resolvers = require('./schema/resolver.js')
const mongoose = require('mongoose');
import * as AppModels from './models';
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {MNEMONIC} =require('./config');
const {walletObject}= require('./helpers/Walletfunctions.js');
import AuthMiddleware from './middleware/auth.js';
import {join} from "path";
import './helpers/Web3Wrapper'
let cors=require('cors');

var app = express();

const uri = "mongodb+srv://qasim:qasim1234@abdulla.eftvp.mongodb.net/dappsLabDB?retryWrites=true&w=majority";
mongoose.connect(uri);
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {
    console.log(' 🍃 connected to mongoDB mLab');
    app.listen(4000, () => {
        console.log('🚀 now listening for requests on port 4000');
    });
})


console.log("walletObject",walletObject);
app.use(cors());



// connect to DB mongo



// view engine setup
app.use(express.static(join(__dirname, './uploads')));
app.use(express.static(join(__dirname, './dapps')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(AuthMiddleware)
app.use('/', indexRouter);
app.use('/users', usersRouter);


const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({req}) => {
        let {
            user,
            isAuth,
        } = req;
        return {
            req,
            user,
            isAuth,
            ...AppModels,
        };
    },
    formatError:(err)=> {
        if (err.message.startsWith("Authentication Must Be Provided")) {
            return new Error('Authentication Must Be Provided');
        }else if (err.message.startsWith("Database Error")) {
            return new Error('Database Error');
        }else if (err.originalError instanceof ApolloError) {
            return err;
        } else{
            const errId = v4();
            console.log("errId: ", errId);
            console.log(err);
            return new Error('Internal Server Error: '+errId);
            // return err
        }
    },
});
server.applyMiddleware({app});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});





 (async () => {
    try {
        let response = await Master.findOne({});
        if(response===null){
            let master = Master({
                mnemonic:MNEMONIC,
                hdwallet:walletObject,
                walletCount:"1",
                orderCount:"1",
                testCount:"1",
                testOrderCount:"1"
            });
            console.log("master",master)
            response = await master.save();
            // console.log("response", response)
        }else if(isNaN(response.walletCount)||response.walletCount===null){
            console.log("counts:",isNaN(parseInt(response.walletCount)))
            let master = {
                mnemonic:MNEMONIC,
                hdwallet:walletObject,
                walletCount:"1",
                orderCount:"1",
                testCount:"1",
                testOrderCount:"1"
            }
            console.log("master",master)
            response = await Master.findByIdAndUpdate(response.id,master,{new:true});
            console.log("response", response)
        }else{
            console.log("Master Loaded:", response)
        }
    }catch(e) {
        console.log('error:',e);
    }

})()

module.exports = app;
