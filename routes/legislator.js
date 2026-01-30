import express from 'express';
const router = express.Router();

router.get('/create', function(req, res, next) {
  res.render('legislator/create', {
    heading: "Create Legislator" });
});

const NAME_REGEX = /[\p{L}\p{Mn}\p{Pd}\p{Zs}']{2,50}/v;

router.post('/create', express.urlencoded({limit: 1000, parameterLimit: 3}), function (req, res, next) {
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
    legislators: req.legislatorsAll.data()
  });
});

function badName(req, res, label, name) {
  res.status(400);
  res.render('error', {
    heading: "Invalid input",
    error: { status: `${label} “${name}” is invalid` }
  });
}

export default router;
