const jwt = require('jsonwebtoken')
const jwtSecret =require("../gen_params").jwtSecret;

async function check_login(req,res,next){
    await CheckUserInDb(req,res);
    if(res.loggedEn) {
        SetLoginToken(req, res);
    }
    next();
}
async function CheckUserInDb(req,res){
    let {uname,passwd}=req.body;
    res.loggedEn=false;
    // let user= {id: 2, name: "hello", LvL: 1};
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
    check_login:check_login,
    isLogged:isLogged
};
