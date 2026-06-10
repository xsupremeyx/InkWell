function requireAuthor(req, res, next){
    try{
        if(req.user.role !== "AUTHOR"){
            return res.status(403).json({
                errors: [
                    {
                        field: 'authorization',
                        message: 'Author role required'
                    }
                ]
            })
        }
        next();
    }
    catch(error){
        next(error);
    }
}

export { requireAuthor };