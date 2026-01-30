# Legislative Info Systems Exercise

## Run in Production (natively)

Using a *nix-compatible shell:

1. Install Node.js v24 or later, including NPM (https://nodejs.org/en/download or https://github.com/nvm-sh/nvm)
2. Run `git clone https://github.com/DougReeder/legislative-info-systems.git`
3. Run `cd legislative-info-systems`
4. Run `npm ci`
5. Run `npm start`
6. In a web browser, navigate to `http://localhost:3000/`

This runs as an unprivileged user without HTTPS; a reverse proxy should be used to terminate SSH and map the port from 3000 to 80.
Multiple instances will not share data, so a load balancer cannot be used.

Logging is to stdout.

Every five seconds and upon shutdown, data will be persisted in the file `LegislativeInfoSystems.json`, in the directory `legislative-info-systems`.
To clear the data, delete this file.

## Development Setup

Using a *nix-compatible shell:

1. Install Node.js v24 or later, including NPM (https://nodejs.org/en/download or https://github.com/nvm-sh/nvm)
2. Run `git clone https://github.com/DougReeder/legislative-info-systems.git`
3. Run `cd legislative-info-systems`
4. Run `npm ci`
5. Run `npm run dev`
6. In a web browser, navigate to `http://localhost:3000/`

To run tests once, run `npm test`.
To run tests continuously, run `npm run test:watch`.

Development was done under MacOS Sequioa 15.7.3; please report any issues running under other operating systems.

## Design Rationale

The chief goal was to simplicity of setup and operation.
Thus an in-memory database was used.
This is fast and can handle surprisingly large datasets, but can't be shared with other application servers to increase capacity.

ETags are generated, and it should be possible to put a cacheing proxy in front of this, but that has not been tested.

Security hardening has not yet been done.
