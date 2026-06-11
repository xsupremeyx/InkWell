import { prisma } from '../lib/prisma.js';


async function getCommentsByPostId(req, res, next){
    try{
        const { id } = req.params;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                published: true
             },
        })
        if(!post){
            return res.status(404).json({
                errors: [
                    {
                        field: 'id',
                        message: 'Post not found'
                    }
                ]
            })
        }
        const comments = await prisma.comment.findMany({
            where: {
                postId: parseInt(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        })
        return res.status(200).json({
            message: 'Comments retrieved successfully',
            comments
        })
    }
    catch(error){
        next(error);
    }
}

async function createComment(req, res, next){
    try{
        const { id } = req.params;
        const { content } = req.body;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                published: true
             },
        })
        if(!post){
            return res.status(404).json({
                errors: [
                    {
                        field: 'id',
                        message: 'Post not found'
                    }
                ]
            })
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(id),
                userId: req.user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        return res.status(201).json({
            message: 'Comment created successfully',
            comment
        })
    }
    catch(error){
        next(error);
    }
}


async function updateComment(req, res, next){
    try{
        const { id } = req.params;
        const { content } = req.body;
        const comment = await prisma.comment.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            },
        })
        if(!comment){
            return res.status(404).json({
                errors: [
                    {
                        field: 'id',
                        message: 'Comment not found'
                    }
                ]
            })
        }
        const updatedComment = await prisma.comment.update({
            where: {
                id: parseInt(id)
            },
            data: {
                content
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })

        return res.status(200).json({
            message: 'Comment updated successfully',
            comment: updatedComment
        })
    }
    catch(error){
        next(error);
    }
}

async function deleteComment(req, res, next){
    try{
        const { id } = req.params;
        const comment = await prisma.comment.findFirst({
            where: {
                id: parseInt(id),
            },
        })
        if(!comment){
            return res.status(404).json({
                errors: [
                    {
                        field: 'id',
                        message: 'Comment not found'
                    }
                ]
            })
        }
        if(!((comment.userId === req.user.id) || (req.user.role === 'AUTHOR'))){
            return res.status(404).json({
                errors: [
                    {
                        field: 'id',
                        message: 'Comment not found'
                    }
                ]
            })
        }
        await prisma.comment.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: 'Comment deleted successfully',
        })
    }
    catch(error){
        next(error);
    }
}

export { getCommentsByPostId, createComment, updateComment, deleteComment };