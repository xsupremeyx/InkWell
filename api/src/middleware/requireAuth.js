import { verifyToken} from "../utils/jwt.js";

const requireAuth = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                errors: [
                    {
                        field: 'authorization',
                        message: 'Authentication required'
                    }
                ]
            })
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            errors: [
                {
                    field: 'authorization',
                    message: 'Invalid or expired token'
                }
            ]
        })  
    }
}

export { requireAuth };