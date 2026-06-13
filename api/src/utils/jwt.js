import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

function signToken(payload){
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" ,});
}

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
}

export { signToken, verifyToken };