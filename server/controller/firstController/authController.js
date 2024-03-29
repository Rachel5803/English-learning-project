const User = require("../../models/firstModels/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ username }).lean()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const userInfo = {
        _id: foundUser._id, name: foundUser.name, roles: foundUser.roles,
        username: foundUser.username, email: foundUser.email, active: foundUser.active
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken })
}
const register = async (req, res) => {
    const { username, name, password, email, phone, roles, active } = req.body
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const checkduplicate = await User.findOne({ username: username }).lean()
    if (checkduplicate) {
        return res.status(409).json({ massage: 'The username exists in the system, press a unique username' })
    }
    const hashPwd = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hashPwd, name, email, phone, roles, active })
    if (user) {
        return res.status(201).json({ massage: 'New user created' })
    }
    else {
        return res.status(400).json({ massage: 'Invalid user' })
    }
}
module.exports = { login, register }