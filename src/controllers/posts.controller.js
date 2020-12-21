const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function submitPosts(req, res) {
    let postData = {
        title: req.body.title,
        discription: req.body.discription,
        status: req.body.status,
        keywords: req.body.keywords,
        categoryId: req.body.categoryId,
        userId: req.user.userId
    };

    const schema = {
        title: { type: "string", optional: false, min: 3, max: 300 },
        discription: { type: "string", optional: false },
        status: { type: "string", optional: false },
        keywords: { type: "string", optional: false },
        categoryId: { type: "number", optional: false },
        userId: { type: "number", optional: false }
    };

    const v = new Validator();

    const validatorResponse = v.validate(postData, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

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

function getMyPostsList(req, res) {
    return models.posts.findAll({ where: { userId: req.user.userId } }).then(post => {
        if (post) {
            res.status(200).json({
                message: 'Posts fetched succeesfully',
                postList: post
            })
        } else {
            res.status(200).json({
                message: 'No posts yet',
                postList: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getMyPost(req, res) {
    return models.posts.findOne({ where: { id: req.params.id, userId: req.user.userId } }).then(post => {
        if (post) {
            res.status(200).json({
                message: 'Post fetched succeesfully',
                post: post
            })
        } else {
            res.status(200).json({
                message: 'No data for the user',
                post: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function updateMyPost(req, res) {
    return models.posts.findOne({ where: { id: req.params.id, userId: req.user.userId }, limit: 1 }).then(post => {
        if (post) {

            let postData = {
                title: req.body.title,
                discription: req.body.discription,
                keywords: req.body.keywords
            };

            const schema = {
                title: { type: "string", optional: false, min: 3, max: 300 },
                discription: { type: "string", optional: false },
                keywords: { type: "string", optional: false }
            };
        
            const v = new Validator();
        
            const validatorResponse = v.validate(postData, schema);
        
            if (validatorResponse !== true) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: validatorResponse
                });
            }

            return post.update(postData).then(response => {
                res.status(200).json({
                    message: 'Update successful',
                    response: response
                });
            }).catch(err => {
                res.status(500).json({
                    message: 'Something went wrong',
                    err: err
                });
            });
        } else {
            res.status(200).json({
                message: 'No post',
                response: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function deleteMyPost(req, res) {
    return models.posts.destroy({ where: { id: req.params.id, userId: req.user.userId }, limit: 1 }).then(post => {
        if (post) {
            res.status(200).json({
                message: 'Update successful',
                response: post
            });
        } else {
            res.status(200).json({
                message: 'No post',
                response: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function getAllPostsList(req, res) {
    return models.posts.findAll().then(post => {
        if (post) {
            res.status(200).json({
                message: 'Posts fetched succeesfully',
                postList: post
            })
        } else {
            res.status(200).json({
                message: 'No post yet',
                postList: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getPost(req, res) {
    return models.posts.findOne({ where: { id: req.params.id } }).then(post => {
        if (post) {
            res.status(200).json({
                message: 'Post fetched succeesfully',
                post: post
            })
        } else {
            res.status(200).json({
                message: 'No data',
                post: post
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

module.exports = {
    submitPosts,
    getMyPostsList,
    getMyPost,
    updateMyPost,
    deleteMyPost,
    getAllPostsList,
    getPost
}