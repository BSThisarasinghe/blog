const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function postUsers(req, res) {

    models.users.findOne({ where: { email: req.body.email }, limit: 1 }).then(user => {
        if (user) {
            return res.status(409).json({
                message: "The email already exists"
            });
        } else {
            bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, (err, hash) => {
                console.log(err)
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        status: 0
                    };

                    models.users.create(user).then(result => {
                        res.status(201).json({
                            message: 'User created',
                            user: {
                                id: result.id,
                                name: result.name,
                                email: result.email,
                                status: result.status,
                                createdAt: result.createdAt,
                                updatedAt: result.updatedAt
                            }
                        })
                    }).catch(error => {
                        res.status(500).json({
                            message: 'Something Went Wrong',
                            error: error
                        });
                    });
                }
            });
        }
    });
}

function siginIn(req, res) {
    models.users.findOne({ where: { email: req.body.email }, limit: 1 }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log(err, result);
                if (result) {
                    const userObj = {
                        email: user.email,
                        userId: user.id,
                        name: user.name
                    };

                    const accessToken = generateAccessToken(userObj);

                    const refreshToken = jwt.sign(
                        userObj,
                        process.env.REFRESH_KEY
                    );
                    saveRefreshToken(req.body.email, refreshToken).then(response => {
                        return res.status(200).json({
                            message: 'Authentication successful',
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            response: response
                        });
                    }).catch(err => {
                        return res.status(500).json({
                            message: 'Something went wrong',
                        });
                    });

                } else {
                    return res.status(401).json({
                        message: 'Authentication failed',
                    });
                }
            });
        } else {
            res.status(401).json({
                message: 'Authentication failed',
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function generateAccessToken(userObj) {
    return jwt.sign(
        userObj,
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }
    );
}

function saveRefreshToken(email, refreshToken) {
    // console.log("refreshToken: "+refreshToken);
    return models.users.findOne({ where: { email: email }, limit: 1 }).then(user => {
        if (user) {
            return user.update({
                refreshToken: refreshToken
            })
            // .then(response => {
            //     // console.log("response");
            //     // console.log(response);
            //     // console.log("response");

            //     return response;
            // }).catch(err => {
            //     // console.log("err");
            //     // console.log(err);
            //     // console.log("err");

            //     return err;
            // });
        } else {
            return 'Invalid email';
        }
    }).catch(err => {
        return err;
    });
}

function getToken(req, res) {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
        res.status(401).json({
            message: 'Forbidden'
        });
    } else {
        models.users.findOne({ where: { refreshToken: refreshToken }, limit: 1 }).then(user => {
            if (user) {
                jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
                    if (err) {
                        return res.status(403).json({
                            message: 'Forbidden'
                        });
                    }

                    const userObj = {
                        email: user.email,
                        userId: user.id,
                        name: user.name
                    };

                    const accessToken = generateAccessToken(userObj);

                    return res.json({
                        accessToken: accessToken
                    });
                });
            } else {
                return res.status(403).json({
                    message: 'Forbidden',
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Something Went Wrong',
                error: err
            });
        });
    }
}

function signOut(req, res) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    var decoded = jwt.decode(accessToken);
    // console.log(decoded.email);
    saveRefreshToken(decoded.email, null).then(response => {
        return res.status(200).json({
            message: 'Successfully signed out',
            response: response
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Something went wrong',
        });
    })
}

module.exports = {
    postUsers,
    siginIn,
    getToken,
    signOut
}