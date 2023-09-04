const { validateToken } = require("../service/authentication");

function checkforAuthentication(cookieName){
    
    return(req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) return next();
        try{
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad;           
        }
        catch(e){}     
        return next();
    }
}

module.exports = checkforAuthentication;