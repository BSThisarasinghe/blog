const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function submitPosts(req, res) {
    let postData = {
        title: req.body.title,
        discription: req.body.discription,
        status: req.body.status,
        keywords: req.body.keywords,
        categoryId: req.body.categoryId,
        userId: req.body.userId
    };
    models.posts.create(postData).then(result => {
        res.status(201).json({
            message: 'Post created',
            post: result
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

function getPostsList(req, res) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    var decoded = jwt.decode(accessToken);
    console.log("User id " + decoded);
    if (decoded !== null) {
        return models.posts.findAll({ where: { userId: decoded.userId } }).then(post => {
            if (post) {
                res.status(200).json({
                    message: 'Posts fetched succeesfully',
                    postList: post
                })
            } else {
                res.status(403).json({
                    message: 'Forbidden'
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Something Went Wrong',
                error: err
            });
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
}

module.exports = {
    submitPosts,
    getPostsList
}