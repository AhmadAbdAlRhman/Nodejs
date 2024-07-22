const rahaf = require("../Models/rahaf");
const test = require("../Models/testRahaf");
module.exports.addTest = (req, res, _next) => {
  const name = req.body.name;
  test
    .create({ name })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};
module.exports.getTests = (req, res, next) => {
  test
    .findAll()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.getest = (req, res, _next) => {
  const tId = req.params.testId;
  rahaf
    .findAll({ where: { testId: tId } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports.deleteTest = (req, res, _next) => {
  const testId = req.params.testId;
  test
    .destroy({ where: { id: testId } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports.addQuestion = (req, res, next) => {
  console.log(req.params.testId);
  const QuestionData = {
    questions: req.body.question,
    option1: req.body.op1,
    option2: req.body.op2,
    option3: req.body.op3,
    option4: req.body.op4,
    option5: req.body.op5,
    answer: req.body.ans,
    testId: req.params.testId,
  };
  console.log(QuestionData);
  rahaf
    .create(QuestionData)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.questionById = (req, res, next) => {
  const qId = req.params.questionId;
  rahaf
    .findAll({ where: { id: qId } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};
