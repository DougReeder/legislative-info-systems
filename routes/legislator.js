import express from 'express';
const router = express.Router();

router.get('/create', function(req, res, next) {
  const heading = "Create Legislator";
  res.render('create', { kind: "Legislator", title: heading + " | " + req.app.locals.appTitle });
});

export default router;
