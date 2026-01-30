import express from 'express';
import {NAME_REGEX, badName} from "../util/name.js";

const router = express.Router();

router.get('/create', function(req, res, _next) {
  res.render('legislation/create', {
    heading: "Create Legislation",
    legislators: req.legislatorsAll.data(),
  });
});

router.post('/create', express.urlencoded({limit: 100_000}), function (req, res, _next) {
  if (!req.body) {
    // renders the error page
    res.status(400);
    res.render('error', {
      heading: "Our bad",
      error: req.app.get('env') === 'development' ?
          {status: "No request body found"} :
          {status: "If this recurs, please contact the system administrator"}
    });

    return;
  }
  const title = req.body.title?.trim() ?? "";
  const text = req.body.text?.trim() ?? "";
  const sponsors = [];
  for (const key of Object.keys(req.body)) {
    const ind = parseInt(key);
    if (isFinite(ind)) {
      sponsors.push(ind);
    }
  }

  if (title.length < 1) {
    return badName(req, res, "Title", title);
  }
  if (text?.length < 1) {
    return badName(req, res, "Text", text);
  }

  req.legislation.insert({ title, text, sponsors });

  res.render('legislation/table', {
    heading: "All Legislation",
    legislators: req.legislatorsAll.data(),
    legislation: req.legislationAll.data()
  });
});

export default router;
