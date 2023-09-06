const express = require('express');
const router = express.Router();
module.exports = router;


router.get("/:p",function (req,res,next){
    if(req.params.p == 1){
        res.render("p1",{});
    }
    else if(req.params.p == 2){
        res.render("p2",{});
    }
});