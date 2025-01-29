import * as userService from '../services/user.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body;
        const user = await userService.createUser({ username, password });
        const token = user.generateJWT();
        res.status(201).json({ username, id: user._id, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body;
        const user = await userService.authenticateUser({ username, password });
        const token = user.generateJWT();
        res.status(200).json({ username, id: user._id, token });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error.message });
    }
};


export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await userService.logoutUser(token, redisClient);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getUserByIdController = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await userService.findUserById({userId});
        const {_id, username} = user;
        res.status(200).json({_id, username});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};