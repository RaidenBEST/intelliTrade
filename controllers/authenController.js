'use strict'

const { sequelize, User } = require('../models/index.js')
const News = require('../utils/newsClass.js')
const bcrypt = require('bcrypt');
const { ValidationError, instantiateValidationError,
    origin_login, origin_signup } = require('../utils/errorClass.js')

module.exports = class AuthenController {

    static async renderLandingPage(req, res, next) {
        try {
            res.render("./auth/LandingPage")

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async renderLogin(req, res, next) {
        try {
            res.render("./auth/LogIn")

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async handleLogin(req, res, next) {
        try {
            const { username, password } = req.body

            const user = await User.findOne({ where: { username } })

            if (!user) {
                const error = new ValidationError(origin_login)
                error.errors.username = 'Account not found.'
            }

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                const error = new ValidationError(origin_login)
                error.errors.password = 'Invalid password.'
            }

            delete user.password
            req.session.user = user
            res.redirect('/dashboard')

        } catch (error) {
            instantiateValidationError(error, origin_login, next)
            next(error)
        }
    }

    static async renderSignup(req, res, next) {
        try {
            res.render("./auth/SignUp")

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async handleSignup(req, res, next) {
        try {
            const { username, password, rePassword, email } = req.body
            if (password !== rePassword) {
                const error = new ValidationError(origin_signup)
                error.errors.password = 'Retyped password is incorrect.'
                throw error
            }

            await User.create({ username, password, email })
            res.redirect('/login')

        } catch (error) {
            instantiateValidationError(error, origin_signup, next)
            next(error)
        }
    }

    static async renderHome(req, res) {
        try {
            let newsData = await News.getNews()
            res.render("./pages/Home", { newsData })

        } catch (error) {
            console.log(error);
        }
    }

    static async handleLogout(req, res, next) {
        try {
            req.session.destroy()
            res.redirect('/')

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
