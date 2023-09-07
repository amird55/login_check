const jwt = require('jsonwebtoken')
const jwtSecret =require("../gen_params").jwtSecret;

const { RateLimiterMemory } = require("rate-limiter-flexible"); //brute force protection
const opts = {
    points: 6, // 5 errors
    duration: 3*60, // Per 3 minutes
};
const rateLimiter = new RateLimiterMemory(opts);


const md5 = require('md5');
const Salt=require("../gen_params").Salt;
function EncWithSalt(str){
    return md5(Salt+str);
}
async function check_login(req,res,next){
    let points=-3;
    await rateLimiter.consume(req.connection.remoteAddress, 1)
        .then((rateLimiterRes) => {
            // 1 points consumed
            points=rateLimiterRes.remainingPoints;
            // console.log("point taken ",points," to go");
        })
        .catch((rateLimiterRes) => {
            // Not enough points to consume
            points=0;
            // console.log("no points left");
        });
    if(points > 0) {
        await CheckUserInDb(req, res);
        if (res.loggedEn) {
            SetLoginToken(req, res);
        }
    } else {
        res.loggedEn=false;
    }
    next();
}
async function CheckUserInDb(req,res){
    // let {uname,passwd}=req.body;
    let uname = addSlashes(req.body.uname);
    let passwd = EncWithSalt(req.body.passwd);

    res.loggedEn=false;
    req.user={}

    let Query = `SELECT * FROM \`users\` WHERE uname='${uname}' AND pass='${passwd}' `;
    // console.log(Query);
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        return res.status(500).json({message: err});
    }
    // console.log(rows);
    if (rows.length > 0) {
        res.loggedEn = true;
        req.user = rows[0];
    }
}
function SetLoginToken(req,res){
    let user=req.user;
    // console.log("SetLoginToken",user);
    // console.log(jwtSecret);
    const maxAge = 3 * 60 * 60;
    res.token = jwt.sign(
        {id: user.id, name: user.name, role: user.Lvl},
        jwtSecret,
        {
            expiresIn: maxAge, // 3hrs in sec
        }
    );
    res.cookie("jwt", res.token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
    });
}
function isLogged(req,res,next){
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.redirect(loginPageUrl)
            } else {
                next()
            }
        })
    } else {
        return res.redirect(loginPageUrl)
    }
}
module.exports = {
    EncWithSalt:EncWithSalt,
    check_login:check_login,
    isLogged:isLogged
};
