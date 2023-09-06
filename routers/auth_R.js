const express = require('express');
const router = express.Router();
module.exports = router;

const auth_mid=require("../middleware/auth_mid");
router.post("/login",[auth_mid.check_login],function (req,res,next){
        return res.send(res.loggedEn);
});