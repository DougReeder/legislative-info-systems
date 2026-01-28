import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const heading = "Home";
  res.render('index', { heading: heading, title: heading + " | " + req.app.locals.appTitle });
});

export default router;
