import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;

function signToken(payload){
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" ,});
}

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
}

export { signToken, verifyToken };