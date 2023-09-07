const express = require('express');
const router = express.Router();
module.exports = router;

const auth_mid=require("../middleware/auth_mid");
router.get("/login",function (req,res,next){
        res.render("login",{logAgainMssg:false,loginPageUrl:loginPageUrl});
});
router.get("/login2",function (req,res,next){
        res.render("login",{logAgainMssg:true,loginPageUrl:loginPageUrl});
});
router.post("/login",[auth_mid.check_login],function (req,res,next){
        // return res.send(res.loggedEn);
        if(res.loggedEn) {
                return res.redirect("/p/1");
        } else {
                return res.redirect(loginPageUrlErr);
        }
});