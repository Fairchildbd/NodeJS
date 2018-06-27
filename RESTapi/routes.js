'use strict';

const express = require("express");
const router = express.Router();
const Question = require("./models").Question;

router.param("qID", (req, res, next, id) => {
  Question.findById(id, req.params.qID, (err, document) =>{
    if(err) return next(err);
    if(!doc){
      err = new Error("Not found");
      err.status = 404;
      return next(err);
    }
    res.question = doc;
    return next();
  });
});

router.param("aID", (req, res, next, id) => {
    req.answer = req.question.answers.id(id);
    if(!req.answer){
        err = new Error("Not Found!");
        err.status = 404;
        return next(err);
    }
    next();
});

//GET /questions
// Return all the questions
router.get('/', (req, res, next) => {
  Question.find({})
    .sort({createAt: -1}),
    .exec((err, questions) => {
      if(err) return next(err);
      res.json(questions);
    });
  res.json({response: "You sent me a GET request"});
});

//POST /questions
// Return all the questions
router.post('/', (req, res, next) => {
  let question = new Question(req.body);
  question.save((err, question) => {
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

//GET /questions/:id
// Route for specific questions
router.get('/:qid', (req, res, next) => {
    res.json(req.question);
});

//POST /questions/:id/answers
// Return all the questions
router.post('/:qID/answers', (req, res, next) => {
  req.question.answers.push(req.body);
  req.question.save((err, question) => {
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

//PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", (req, res) => {
  req.answer.update(req.body, (err, result) => {
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", (req, res, next) => {
  req.answer.remove((err) => {
    req.question.save((err, question) => {
      if(err) return next(err);
      res.json(question);
    });
  });
});

//POST /questions/:qID/answers/:aID/vote-up
//POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", (req, res, next) => {
    if(req.params.dir.search(/^(up|down)$/) === -1){
      let err = new Error("Not Found");
      err.status = 404;
      next(err);
    } else {
      req.vote = req.params.dir;
      next();
    }
  },
  (req, res, next) => {
    req.answer.vote(req.vote, (err, question) => {
      if (err) return next(err);
      res.json(question);
    });
});


module.exports = router;
