'use strict'

const Model = require('../models/model')
const { sequelize, User } = require('../models/index.js')
const bcrypt = require('bcrypt');

module.exports = class AuthenController {

    static async renderLandingPage(req, res) {
        try {
            res.render("./auth/LandingPage")

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderLogin(req, res) {
        try {
            res.render("./auth/LogIn")

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleLogin(req, res) {
        try {
            const { username, password } = req.body

            const user = await User.findOne({ where: { username } })
            const errorMsg = 'Invalid username or password.'

            if (!user) return res.redirect(`/login?error=${errorMsg}`);

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) return res.redirect(`/login?error=${errorMsg}`)

            delete user.password
            req.session.user = user
            res.redirect('/dashboard')

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async renderSignup(req, res) {
        try {
            res.render("./auth/SignUp")

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleSignup(req, res) {
        try {
            const { username, password, rePassword, email } = req.body
            await Model.handleSignup(username, password, rePassword, email)
            res.redirect('/login')

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderHome(req, res) {
        try {
            let newsData = await Model.getNews()
            res.render("./pages/Home", { newsData })

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleLogout(req, res) {
        try {
            req.session.destroy()
            res.redirect('/')

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}