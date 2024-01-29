var express = require('express');
var db = require('../db');
const homePage = require('./controllers/homePage');
const activateTask = require('./controllers/activateTask');
const completeTask = require('./controllers/completeTask');
const deleteTask = require('./controllers/deleteTask'');
const fetchTodos = require('./utils/index')

var router = express.Router();



/* GET home page. */
router.get('/', homePage)
router.get('/active', fetchTodos, activateTask)
router.get('/completed', fetchTodos, completeTask)


router.post('/', function(req, res, next) {
  req.body.title = req.body.title.trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  return res.redirect('/' + (req.body.filter || ''));
}, function(req, res, next) {
  db.run('INSERT INTO todos (owner_id, title, completed) VALUES (?, ?, ?)', [
    req.user.id,
    req.body.title,
    req.body.completed == true ? 1 : null
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

// router.post('/:id(\\d+)', 

router.post('/:id(\\d+)/delete', deleteTask)

router.post('/toggle-all', 

router.post('/clear-completed', function(req, res, next) {
  db.run('DELETE FROM todos WHERE owner_id = ? AND completed = ?', [
    req.user.id,
    1
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

module.exports = router;
