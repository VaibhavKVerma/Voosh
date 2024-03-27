const Status = require("http-status");
const User = require("../models/UserSchema");
const { createJWT } = require("../utils/jsonWebTokenUtil");
const { ROLE } = require("../utils/User");

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(Status.BAD_REQUEST).json({ message: "Fields are missing" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(Status.CONFLICT).json({ message: "User Already Exists" });
        }
        const newUser = new User(req.body);
        await newUser.save();
        const token = await createJWT(newUser.id);
        if (!token) {
            return res.status(Status.BAD_REQUEST).json({ message: "JSON Token Error" });
        }
        res.status(Status.CREATED).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Failed to register user" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(Status.BAD_REQUEST).json({ message: "Fields are missing" });
        }
        const existingUser = await User.findOne({ email, password });
        if (!existingUser) {
            return res.status(Status.NOT_FOUND).json({ message: "No such user exists with this credential" });
        }
        const token = await createJWT(existingUser.id);
        if (!token) {
            return res.status(Status.BAD_REQUEST).json({ message: "JSON Token Error" });
        }
        res.status(Status.OK).json({ message: "User logged in successfully", token });
    } catch (error) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error logging in user" });
    }
}

const thirdPartyRegistration = async (req, res) => {
    try {
        const { email, photo_url, username } = req.user;
        const existingUser = await User.findOne({ email });
        let token;
        if (existingUser) {
            token = await createJWT(newUser.id);
        } else {
            const newUser = new User({ email, username, photo_url });
            await newUser.save();
            token = await createJWT(newUser.id);
        }
        if (!token) {
            return res.status(Status.BAD_REQUEST).json({ message: "JSON Token Error" });
        }
        res.status(Status.CREATED).json({ message: "User authenticated successfully", token });
    } catch (error) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Failed to register user" });
    }
}

const getProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(Status.BAD_REQUEST).json({ message: "Fields are missing" });
        }
        const existingUser = await User.findOne({ email, password });
        res.status(Status.OK).json({ user: existingUser });
    } catch (error) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error querying" });
    }
}

const getAllProfiles = async (req, res) => {
    try {
        const { role } = req.user;
        let data;
        if (role === ROLE.admin) {
            data = await User.find({ role: ROLE.normal });
        } else {
            data = await User.find({ is_public: true, role: ROLE.normal });
        }
        res.status(Status.OK).json({ data });
    } catch (error) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error querying" });
    }
}

const updateProfile = async (req, data) => {
    try {
        await User.updateOne({ _id: req.user._id }, data);
        return { statusCode: Status.OK, message: "Profile details updated successfully" };
    } catch (error) {
        return { statusCode: Status.INTERNAL_SERVER_ERROR, message: "Failed to update profile" };
    }
}

const updateDetails = async (req, res) => {
    try {
        const { photo_url, username, bio, phone, email, password } = req.body;
        const response = await updateProfile(req, { photo_url, username, bio, phone, email, password });
        res.status(response.statusCode).json({ message: response.message });
    } catch (error) {
        console.error("Error updating profile details:", error);
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error updating profile details" });
    }
}

const updatePhotoUrl = async (req, res) => {
    try {
        const { photo_url } = req.body;
        const response = await updateProfile(req, { photo_url });
        res.status(response.statusCode).json({ message: response.message });
    } catch (error) {
        console.error("Error updating profile details:", error);
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error updating profile details" });
    }
}

const updateProfileVisibilty = async (req, res) => {
    try {
        const { is_public } = req.body;
        const response = await updateProfile(req, { is_public });
        res.status(response.statusCode).json({ message: response.message });
    } catch (error) {
        console.error("Error updating profile details:", error);
        res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Error updating profile details" });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    getAllProfiles,
    updateDetails,
    updatePhotoUrl,
    updateProfileVisibilty,
    thirdPartyRegistration
};