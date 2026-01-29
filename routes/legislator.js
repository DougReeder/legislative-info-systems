import express from 'express';
const router = express.Router();

router.get('/create', function(req, res, next) {
  const heading = "Create Legislator";
  res.render('legislator/create', { kind: "Legislator", title: heading + " | " + req.app.locals.appTitle });
});

const NAME_REGEX = /[\p{L}\p{Mn}\p{Pd}\p{Zs}']{2,50}/v;

router.post('/create', express.urlencoded({limit: 1000, parameterLimit: 3}), function (req, res, next) {
  if (!req.body) {
    res.locals.title = "Our bad" + " | " + req.app.locals.appTitle;
    res.locals.message = "Our bad";
    res.locals.error = req.app.get('env') === 'development' ?
        {status: "No request body found"} :
        {status: "If this recurs, please contact the system administrator"};

    // render the error page
    res.status(400);
    res.render('error');

    return;
  }
  const firstName = req.body.firstName?.trim() ?? "";
  const lastName = req.body.lastName?.trim() ?? "";
  const hometown = req.body.hometown?.trim() ?? "";

  if (!NAME_REGEX.test(firstName)) {
    return badName(req, res, "First name", firstName);
  }
  if (!NAME_REGEX.test(lastName)) {
    return badName(req, res, "Last name", lastName);
  }
  if (!NAME_REGEX.test(hometown)) {
    return badName(req, res, "Hometown", hometown);
  }

  req.legislators.insert({ firstName, lastName, hometown });

  const heading = "All Legislators";
  res.render('legislator/table', {
    heading,
    title: heading + " | " + req.app.locals.appTitle,
    legislators: req.legislatorsAll.data()
  });
});

function badName(req, res, label, name) {
  res.locals.message = "Invalid input";
  res.locals.title = res.locals.message + " | " + req.app.locals.appTitle;
  res.locals.error = { status: `${label} “${name}” is invalid` };
  res.status(400);
  res.render('error');
}

export default router;
