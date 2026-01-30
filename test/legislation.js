import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";

import collectionsFactory from '../db/collectionsFactory.js';
const { legislators, injectLegislators, injectLegislation } = await collectionsFactory(false);
import appFactory from '../appFactory.js';
const app = await appFactory({injectLegislators, injectLegislation});

const PORT = 60000 + Math.floor(Math.random() * 5565);
app.set('port', PORT);

describe("legislation create", () => {
  const url = `http://localhost:${PORT}/legislation/create`;
  let server;

  before( (_, done) => {
    legislators.insert({ firstName: "John", lastName: "Doe", hometown: "Centerville" });
    legislators.insert({ firstName: "Alexis", lastName: "Ballyrun", hometown: "Columbus" });

    server = http.createServer(app);
    server.listen(PORT, () => {
      console.debug(`HTTP server listening on port ${PORT}`);
      done();
    });
  });

  after( (_, done) => {
    server.close(() => {
      console.debug('HTTP server closed');
      done();
    });
  })

  it("GET should return form", async () => {
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    const text = await response.text();
    assert.match(text, /<title>Create Legislation \| Legislative Info Systems<\/title>/);
    assert.match(text, /<h1>Create Legislation<\/h1>/);

    const nav = /<nav>(.*)<\/nav>/.exec(text)?.[1];
    assert.ok(nav);
    assert.match(nav, /<a href="\/">Home<\/a>/);
    assert.match(nav, /<a href="\/legislator\/create">Create Legislator<\/a>/);
    assert.match(nav, /<a href="\/legislation\/create">Create Legislation<\/a>/);

    const form = /<form\b.*<\/form>/.exec(text)?.[0];
    assert.match(form, /<form action="\/legislation\/create" method="post">/);
    assert.match(form, /<label for="title">Title.*<\/label>/);
    assert.match(form, /<input type="text" name="title" id="title" required/);
    assert.match(form, /<label for="text">Text.*<\/label>/);
    assert.match(form, /<textarea name="text" id="text" required minLength="1" maxLength="100000">/);
    assert.match(form, /<label>Sponsors.*<\/label>/);

    const checkboxes = /<div class="grow">(.*)<\/div>/.exec(text)?.[1];
    assert.match(checkboxes, /<label for="1">John Doe<\/label><input type="checkbox" id="1" name="1">/);
    assert.match(checkboxes, /<label for="2">Alexis Ballyrun<\/label><input type="checkbox" id="2" name="2">/);

    assert.match(form, /<button type="submit">/);
  });
});
