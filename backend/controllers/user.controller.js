import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';

export const createUserController = async (req, res) => {

    const errors = validationResult(req);
    
    // Check if there are validation errors
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();

        delete user._doc.password;

        res.status(201).json({user, token});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const LoginController = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try { 
        const {email, password} = req.body;

        const user = await userModel.findOne({email}).select("+password");
        if(!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if(!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateJWT();

        delete user._doc.password;

        res.status(200).json({user, token});

    } catch (error) {
        res.status(400).send(error.message);
    }
}
 
export const profileController = async (req, res) => {
    console.log(req.user);

    res.status(200).json({
        user: req.user
    })
}
    
export const LogoutController = async (req, res) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: "Logged out successfully"
        })


    }catch(error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        // Check if the user is authenticated
        const loggedInUser = await userModel.findOne({
            email: req.user.email 
        })

        const allusers = await userService.getAllusers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allusers
        });
        
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}