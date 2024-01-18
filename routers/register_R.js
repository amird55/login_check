const express = require('express');
const router = express.Router();
module.exports = router;

const users_mid=require("../middleware/users_mid");


router.get("/register", (req,res)=>{
    res.render("register",
        {}
    );
});
router.post('/register', [users_mid.AddUser], (req, res) => {
    if(req.Last_Id > 0)
        return res.redirect("/login");
    else
        return res.status(500).json({message: res.err});
});
