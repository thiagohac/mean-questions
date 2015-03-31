'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    answer = require('./answer.server.model.js'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        trim: true,
        required: 'Título é obrigatório'
    },
    content: {
        type: String,
        trim: true,
        required: 'Conteúdo é obrigatório'
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    favoriteBy: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    upVotes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    downVotes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    answers: [answer.getSchema()]
});


mongoose.model('Question', QuestionSchema);