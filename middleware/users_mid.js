const auth_mid = require("./auth_mid");

async function AddUser(req,res,next){
    let pass  = auth_mid.EncWithSalt(req.body.pass);
    let uname = addSlashes(req.body.uname);
    let name  = addSlashes(req.body.name);
    let Lvl   = Number(req.body.Lvl);
    const Query = `INSERT INTO users (uname,pass,name,Lvl) VALUES('${uname}','${pass}','${name}','${Lvl}')`;

    const promisePool = db_pool.promise();
    let rows=[];
    req.Last_Id=-1;
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        return res.status(500).json({message: err});
    }
    // console.log(rows);
    req.Last_Id=rows.insertId;

    next();
}


module.exports = {
    AddUser:AddUser,
}