import express from 'express';
import legislationWSponsorNames from "../db/legislationWSponsorNames.js";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    heading: "Home",
    legislators: req.legislatorsAll.data(),
    legislation: legislationWSponsorNames(req.legislationAll, req.legislators)
  });
});

export default router;
