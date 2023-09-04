const jwt = require('jsonwebtoken');
const secret = "$Lara@9044";

function createJwtToken(user){
    const payload ={
        
        _id : user._id,
        name:user.fullName,
        email : user.email,
        role : user.role,
        profileImage : user.profileImage,
    };
    const token = jwt.sign(payload,secret);
    
    return token;

}

function validateToken(token){
    const payload = jwt.verify(token , secret);
    return payload;
}

module.exports={
    createJwtToken,
    validateToken,
}