import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const heading = "Home";
  res.render('index', {
    heading: heading,
    legislators: req.legislatorsAll.data(),
    legislation: req.legislationAll.data()
  });
});

export default router;
