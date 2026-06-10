import { prisma } from '../lib/prisma.js';


async function createPost(req, res, next){
    try{
        const { title, content } = req.body;
        const userId = req.user.id;

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                published: false,
                authorId: userId
            }
        })
        return res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        })
    }
    catch(error){
        next(error);
    }
}

export { createPost };