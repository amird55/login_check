const express = require('express');
const router = express.Router();
module.exports = router;

let tableName="users";
const auth_mid=require("../middleware/auth_mid");


router.post("/Add",(req,res)=>{
    let pass  = auth_mid.EncWithSalt(req.body.pass);
    let uname = addSlashes(req.body.uname);
    let name  = addSlashes(req.body.name);
    let Lvl   = Number(req.body.Lvl);
    const Query = `INSERT INTO ${tableName} (uname,pass,name,Lvl) VALUES('${uname}','${pass}','${name}','${Lvl}')`;
    db_pool.query(Query,function (err,rows,fields,){
        if (err){
            res.status(500).json({message:err});
        }else{
            res.status(200).json({message:"OK",Last_Id:rows.insertId});
        }
    })
});
router.patch("/Update/:id",(req ,res)=>{
    let id = Number(req.params.id);
    let uname = addSlashes(req.body.uname);
    let name  = addSlashes(req.body.name);
    let Lvl   = Number(req.body.Lvl);
    // console.log(uname);

    let Query = `UPDATE ${tableName} SET `;
    Query += `uname = '${uname}', `;
    Query += `name  = '${name}' , `;
    Query += `Lvl   = '${Lvl}'    `;
    Query += ` WHERE id=${id}` ;
    // console.log(Query);
    db_pool.query(Query,function (err,rows,fields){
        if (err){
            res.status(500).json({message:err});
        }else{
            res.status(200).json({message:"OK"});
        }
    })
});
router.patch("/SetPass/:id",(req ,res)=>{
    let id = Number(req.params.id);
    let pass  = auth_mid.EncWithSalt(req.body.pass);

    let Query = `UPDATE ${tableName} SET `;
    Query += `pass   = '${pass}'    `;
    Query += ` WHERE id=${id}` ;
    // console.log(Query);
    db_pool.query(Query,function (err,rows,fields){
        if (err){
            res.status(500).json({message:err});
        }else{
            res.status(200).json({message:"OK"});
        }
    })
});
router.delete("/Delete/:id",(req, res) => {
    let id = Number(req.params.id);
    let Query = `DELETE FROM ${tableName} `;
    Query += ` WHERE id=${id}` ;
    db_pool.query(Query,function (err,rows,fields){
        if (err){
            res.status(500).json({message:err});
        }else{
            res.status(200).json({message:"OK"});
        }
    })

});
router.get("/List",(req, res) => {
    let Lvl = Number(req.body.Lvl);
    let Query = `SELECT * FROM ${tableName} `;
    if ( Lvl > 0) Query += ` WHERE Lvl = ${Lvl}`;
    db_pool.query(Query,function (err,rows,fields){
        if (err) res.status(500).json({message: err});
        else {
            let sanitaized_rows=[];
            for(let rw of rows){
                let sr={};
                sr.id    =rw.id ;
                sr.Lvl   =rw.Lvl;
                sr.uname =htmlspecialchars(stripSlashes(rw.uname ));
                sr.name  =htmlspecialchars(stripSlashes(rw.name  ));

                sanitaized_rows[sr.id]=sr;
            }
            res.status(200).json(sanitaized_rows);
        }
    })
});