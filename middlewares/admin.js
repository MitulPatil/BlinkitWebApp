const jwt = require("jsonwebtoken");

require("dotenv").config();
async function validateAdmin(req,res,next){
    try{
        let token = req.cookies.token;
        if (!token) return res.send("you need to login first");
        let data = await jwt.verify(token,process.env.JWT_KEY) // you will get user data(here you ger email)
        req.user = data; //req.user = data attaches this decoded data to the req object.
                         //This means in any route after this middleware, you can access the user info with req.user
        next();
    }catch(err){
        res.send(err.message);
    }
}

async function userIsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/users/login");
}

module.exports = {validateAdmin,userIsLoggedIn};