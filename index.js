//npm i express ejs mysql2 jsonwebtoken body-parser cookie-parser md5 slashes@2.0.0 htmlspecialchars rate-limiter-flexible
const express = require('express');
const port = 5325;
const app = express();
app.use(express.json());


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

let db_M = require('./database');
global.db_pool = db_M.pool;

global.htmlspecialchars = require("htmlspecialchars");
const { addSlashes, stripSlashes } = require('slashes');
global.addSlashes=addSlashes;
global.stripSlashes=stripSlashes;

const path = require('path');
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "js")));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "/views"));

global.loginPageUrl   ="/login";
global.loginPageUrlErr="/login2";
const auth_mid=require("./middleware/auth_mid");

const pg_rtr = require('./routers/pages_R');
app.use('/p',[auth_mid.isLogged],pg_rtr);
const user_rtr = require('./routers/user_crud_R');
app.use('/u',user_rtr);
const auth_rtr = require('./routers/auth_R');
app.use('/',auth_rtr);

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port http://localhost:${port}`);
});