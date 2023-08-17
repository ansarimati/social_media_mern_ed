import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

// register user

export const register = async (req, res) =>  {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // check if user exist or not

        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ message: "User already registered" }) 

        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHashed,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impression: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save(); 
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

    const user = await User.findOne({ email: email });

    if(!user)  return res.status(400).json({ message: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid Credentials." })

    const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: "1h"})
    delete user.password;
    res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}