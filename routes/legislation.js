import express from 'express';
import {NAME_REGEX, badName} from "../util/name.js";

const router = express.Router();

router.get('/create', function(req, res, _next) {
  res.render('legislation/create', {
    heading: "Create Legislation" });
});

router.post('/create', express.urlencoded({limit: 100_000, parameterLimit: 3}), function (req, res, _next) {
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
  // const sponsors = req.body.sponsors?.trim() ?? "";

  if (!NAME_REGEX.test(title)) {
    return badName(req, res, "Title", title);
  }
  if (text?.length < 1) {
    return badName(req, res, "Text", text);
  }
  // if (!NAME_REGEX.test(sponsors)) {
  //   return badName(req, res, "Sponsors", sponsors);
  // }

  req.legislation.insert({ title, text /*, sponsors*/ });

  res.render('legislation/table', {
    heading: "All Legislation",
    legislation: req.legislationAll.data()
  });
});

export default router;
