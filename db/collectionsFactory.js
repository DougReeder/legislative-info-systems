import Loki from 'lokijs';

async function collectionsFactory(isPersistent) {
  return new Promise((resolve, _) => {
    const config = isPersistent ?
        {
          autoload: true,
          autoloadCallback : intializeDatabase,
          autosave: true,
          autosaveInterval: 4987   // less than 5 seconds to avoid traffic jams
        } : {};

    const db = new Loki('Legislative_Info_Systems.json', config);
    if (isPersistent) {
      db.on('loaded', () => {
        console.debug(`Database loaded`);
        resolve({legislators, injectLegislators, legislation, injectLegislation, closeDB});
      });
    } else {
      setImmediate(() => {
        intializeDatabase();
        resolve({legislators, injectLegislators, legislation, injectLegislation, closeDB});
      });
    }

    let legislators, legislatorsAll, legislation, legislationAll;

    function intializeDatabase() {
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

      legislation = db.getCollection("legislation");
      if (legislation) {
        console.debug("reusing existing collection “legislation”");
        legislationAll = legislation.getDynamicView('all');
      } else {
        console.debug("creating collection “legislation”");
        legislation = db.addCollection('legislation', { indices: ['title'] });
        legislationAll = legislation.addDynamicView('all');
        legislationAll.applySimpleSort( 'title');
      }
    }

    function injectLegislators(req, _, next) {
      req.legislators = legislators;
      req.legislatorsAll = legislatorsAll;
      next();
    }

    function injectLegislation(req, _, next) {
      req.legislation = legislation;
      req.legislationAll = legislationAll;
      next();
    }

    async function closeDB() {
      if (!isPersistent) { return; }

      return new Promise((resolve, reject) => {
        console.debug(`saving database`);
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
  });
}

export default collectionsFactory;
