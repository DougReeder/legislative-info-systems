const NAME_REGEX = /[\p{L}\p{Mn}\p{Pd}\p{Zs}']{2,50}/v;

function badName(req, res, label, name) {
  res.status(400);
  res.render('error', {
    heading: "Invalid input",
    error: {status: `${label} “${name}” is invalid`}
  });
}

export {NAME_REGEX, badName};
