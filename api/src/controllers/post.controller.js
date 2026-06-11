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

async function getPosts(req,res, next){
    try{
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        return res.status(200).json({
            message: 'Posts retrieved successfully',
            posts
        })
    }
    catch(error){
        next(error);
    }
}

async function getPostById(req, res, next){
    try{
        const { id } = req.params;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                published: true
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
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
        return res.status(200).json({
            message: 'Post retrieved successfully',
            post
        })
    }
    catch(error){
        next(error);
    }
}


async function togglePublish(req, res, next){
    try{
        const { id } = req.params;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                authorId: req.user.id
            }
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

        const updatedPost = await prisma.post.update({
            where: {
                id: parseInt(id)
            },
            data: {
                published: !post.published
            }
        })
        return res.status(200).json({
            message: `Post ${updatedPost.published ? 'published' : 'unpublished'} successfully`,
            post: updatedPost
        })
    }
    catch(error){
        next(error);
    }
}


async function updatePost(req, res, next){
    try{

        const { title, content } = req.body;
        const { id } = req.params;
        const userId = req.user.id;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                authorId: userId
            }
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

        const updatedPost = await prisma.post.update({
            where: {
                id: post.id
            },
            data: {
                title,
                content,
            }
        })

        return res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        })
    }
    catch(error){
        next(error);
    }
}

async function deletePost(req, res, next){
    try{
        const { id } = req.params;
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                authorId: req.user.id
            }
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

        await prisma.post.delete({
            where: {
                id: post.id
            }
        })

        return res.status(200).json({
            message: 'Post deleted successfully'
        })
    }
    catch(error){
        next(error);
    }
}


export { createPost, getPosts, getPostById, togglePublish, updatePost, deletePost };