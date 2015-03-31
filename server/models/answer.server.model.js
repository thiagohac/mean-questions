'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var AnswerSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true,
        required: 'Conteúdo não pode ser vazio'
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    upVotes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    downVotes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
});

mongoose.model('Answer', AnswerSchema);


exports.getSchema = function() {
    return AnswerSchema;
};