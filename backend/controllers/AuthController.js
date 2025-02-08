const bcrypt= require("bcrypt")
const {v4: uuidv4} = require("uuid")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.handleLogin = (req,res)=>{
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
}

module.exports.attemptLogin= async(req,res)=>{
    if(req.body.type===0){
        const potentialLogin = await prisma.doctor_table.findUnique({
            where:{username:req.body.username}
        });
        if(!potentialLogin){
            console.log("not good")
            res.json({loggedIn: false, status: "Wrong username or password!"});
        }
        const isSameHash = bcrypt.compare(
            req.body.password,potentialLogin.password
        );
        if(isSameHash){
            req.session.user = {
                username:req.body.username,
                id : potentialLogin.doctor_id,
                userid : potentialLogin.userid,
                type:0,
            }
            res.json({loggedIn: true, username:req.body.username});
        }
        else{
            console.log("not good")
            res.json({loggedIn: false, status: "Wrong username or password!"});
        }
    }
    else{
        const potentialLogin = await prisma.patient_table.findUnique({
            where:{username:req.body.username}
        });
        if(!potentialLogin){
            console.log("not good")
            res.json({loggedIn: false, status: "Wrong username or password!"});
        }
        const isSameHash = bcrypt.compare(
            req.body.password,potentialLogin.password
        );
        if(isSameHash){
            req.session.user = {
                username:req.body.username,
                id : potentialLogin.patient_id,
                userid : potentialLogin.userid,
                type:1
            }
            res.json({loggedIn: true, username:req.body.username});
        }
        else{
            console.log("not good")
            res.json({loggedIn: false, status: "Wrong username or password!"});
        }
    }
    // const potentialLogin= await pool.query(
    //     "SELECT id,username,passhash,userid from users u WHERE u.username=$1",
    //     [req.body.username]
    // );
    // if(potentialLogin.rowCount>0){
    //     const isSameHash = bcrypt.compare(
    //         req.body.password,potentialLogin.rows[0].passhash
    //     );
    //     if(isSameHash){
    //         req.session.user = {
    //             username:req.body.username,
    //             id : potentialLogin.rows[0].id,
    //             userid : potentialLogin.rows[0].userid
    //         }
    //         res.json({loggedIn: true, username:req.body.username});
    //     }else{
    //         console.log("not good")
    //         res.json({loggedIn: false, status: "Wrong username or password!"});
    //     }
    // }else{
    //     console.log("not good")
    //     res.json({loggedIn: false, status: "Wrong username or password!"});
    // }
        
}

module.exports.attemptRegister = async(req,res)=>{
    
    const usertype = req.body.type;
    let existingUser;
    if(usertype===0){
        existingUser = await prisma.doctor_table.findUnique({
            where:{
                username:req.body.username
            }
        });
        if(existingUser)res.json({loggedIn:false, status:"Username taken"})
        const hashedPass= await bcrypt.hash(req.body.password, 10);
        const newuser = await prisma.doctor_table.create({
            data:{
                username:req.body.username,
                password:hashedPass,
                name:req.body.name,
                userid:uuidv4(),
            }
        })
        req.session.user = {
            username: req.body.username,
            id : newuser.doctor_id,
            userid: newuser.userid,
            type : 0
        }
        res.json({loggedIn: true, username:req.body.username})
    }
    else{
        existingUser = await prisma.patient_table.findUnique({
            where:{
                username:req.body.username
            }
        });
        if(existingUser)res.json({loggedIn:false, status:"Username taken"})
        const hashedPass= await bcrypt.hash(req.body.password, 10);
        const newuser = await prisma.patient_table.create({
            data:{
                username:req.body.username,
                password:hashedPass,
                name:req.body.name,
                userid:uuidv4(),
            }
        })
        req.session.user = {
            username: req.body.username,
            id : newuser.patient_id,
            userid: newuser.userid,
            type : 1
        }
        res.json({loggedIn: true, username:req.body.username});
    }
    // if(existingUser.rowCount === 0){
    //     const hashedPass= await bcrypt.hash(req.body.password, 10);
    //     const newUserQuery = await pool.query(
    //         "INSERT INTO users(username, passhash, userid) values($1,$2,$3) RETURNING id, username, userid", 
    //         [req.body.username,hashedPass,uuidv4()]
    //     );
    //     req.session.user = {
    //         username: req.body.username,
    //         id : newUserQuery.rows[0].id,
    //         userid: newUserQuery.rows[0].userid,

    //     }
    //     res.json({loggedIn: true, username:req.body.username})
    // }else{
    //     res.json({loggedIn:false, status:"Username taken"})
    // }
}