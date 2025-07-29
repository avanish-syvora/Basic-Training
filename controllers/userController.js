import User from "../models/user.js";

export const getAllUsers = async (req,res) => {
    try {
        const users = await User.findAll();
        res.render('users', {users});
    } catch (error) {
        console.error("Internal fetching error:",error);
        res.status(500).send("Internal Server error");
    }
};