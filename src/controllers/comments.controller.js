const models = require('../models');
const Validator = require("fastest-validator");

function submitComments(req, res) {
    let commentData = {
        comment: req.body.comment,
        authorId: req.user.userId,
        postId: req.body.postId
    };

    const schema = {
        comment: { type: "string", optional: false },
        authorId: { type: "number", optional: false },
        postId: { type: "number", optional: false }
    };

    const v = new Validator();

    const validatorResponse = v.validate(commentData, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

    models.comments.create(commentData).then(result => {
        res.status(201).json({
            message: 'Comment created',
            comment: result
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

module.exports = {
    submitComments
}