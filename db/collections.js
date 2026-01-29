import loki from 'lokijs';

const db = new loki('Legislative Info Systems', { /*autosave: true, autosaveInterval: 4000 */});

const legislators = db.addCollection('legislators', { indices: ['lastName', 'firstName'] });
const legislatorsAll = legislators.addDynamicView('all');
legislatorsAll.applySimpleSort( 'lastName');
function legislatorsColl(req, _, next) {
  req.legislators = legislators;
  req.legislatorsAll = legislatorsAll;
  next();
}

export { legislatorsColl };
