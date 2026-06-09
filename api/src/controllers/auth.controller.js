import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../utils/jwt.js';

async function registerUser(req, res, next){
    try{
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if(existingUser){
            return res.status(409).json({
                errors: [
                    {
                        field: 'username',
                        message: 'Username already exists'
                    }
                ]
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username
            }
        })
    }
    catch(error){
        next(error);
    }
}

async function loginUser(req, res, next){
    try{
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if(!user){
            return res.status(401).json({
                errors: [
                    {
                        field: 'credentials',
                        message: 'Invalid username or password'
                    }
                ]
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                errors: [
                    {
                        field: 'credentials',
                        message: 'Invalid username or password'
                    }
                ]
            })
        }

        const token = signToken({
            id: user.id,
            role: user.role,
        })

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        })
    }
    catch(error){
        next(error);
    }
}
async function getCurrentUser(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
        });

        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        field: "user",
                        message: "User not found",
                    },
                ],
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

export { registerUser, loginUser, getCurrentUser };