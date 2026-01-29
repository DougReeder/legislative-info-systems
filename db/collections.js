import Loki from 'lokijs';

const db = new Loki('Legislative_Info_Systems.json', {
  autoload: true,
  autoloadCallback : databaseInitialize,
  autosave: true,
  autosaveInterval: 4987   // less than 5 seconds to avoid traffic jams
});

let legislators, legislatorsAll;

function databaseInitialize() {
  legislators = db.getCollection("legislators");
  if (legislators) {
    console.debug("reusing existing collection “legislators”");
    legislatorsAll = legislators.getDynamicView('all');
  } else {
    console.debug("creating collection “legislators”");
    legislators = db.addCollection('legislators', { indices: ['lastName', 'firstName'] });
    legislatorsAll = legislators.addDynamicView('all');
    legislatorsAll.applySimpleSort( 'lastName');
  }

}


function legislatorsColl(req, _, next) {
  req.legislators = legislators;
  req.legislatorsAll = legislatorsAll;
  next();
}


async function closeDB() {
  console.debug(`saving database`);

  return new Promise((resolve, reject) => {
    db.saveDatabase(err => {
      if (err) {
        console.error(`Error saving database: ${err}`);
        reject(err);
      } else {
        console.debug(`Database saved`);
        resolve();
      }
    });
  });
}


export { legislatorsColl, closeDB };
