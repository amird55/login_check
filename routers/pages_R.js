const express = require('express');
const router = express.Router();
module.exports = router;

const auth_mid=require("../middleware/auth_mid");

router.get("/:p",[auth_mid.isLogged],function (req,res,next){
    if(req.params.p == 1){
        res.render("p1",{});
    }
    else if(req.params.p == 2){
        res.render("p2",{});
    }
});