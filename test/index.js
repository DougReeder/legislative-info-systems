import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import appFactory from '../appFactory.js';
import collectionsFactory from '../db/collectionsFactory.js';
const { injectLegislators } = await collectionsFactory(false);
const app = await appFactory({injectLegislators});

const PORT = 60000 + Math.floor(Math.random() * 5565);
app.set('port', PORT);

describe("index page", () => {
  let server;

  before( (_, done) => {
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

  it("should return HTML", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith('text/html'));
    assert.ok(response.headers.get('content-type').endsWith(
      '; charset=utf-8'));
  });

  it("should have a title", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.match(text, /<title>Home \| Legislative Info Systems<\/title>/);
  });

  it("should have a heading", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.ok(text.includes('<h1>Home</h1>'));
  });

  it("should have a nav bar with links to Home & legislator create", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();

    const nav = /<nav>(.*)<\/nav>/.exec(text)?.[1];
    assert.ok(nav);
    assert.match(nav, /<a href="\/">Home<\/a>/);
    assert.match(nav, /<a href="\/legislator\/create">Create Legislator<\/a>/);
  });

  it("should have empty drawer of legislators", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.match(text, /<details open><summary>Legislators<\/summary><ul><\/ul><\/details>/);
  });

  it("should have filled drawer of legislators", async () => {
    const url = `http://localhost:${PORT}/legislator/create`;
    const params = new URLSearchParams([["firstName", "Richard"], ["lastName", "Roe"], ["hometown", "Worthington"]]);
    const response1 = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    assert.equal(response1.status, 200);

    const response2 = await fetch(`http://localhost:${PORT}/`);
    assert.equal(response2.status, 200);
    const text = await response2.text();
    assert.match(text, /<details open><summary>Legislators<\/summary><ul><li>Richard Roe from Worthington<\/li><\/ul><\/details>/);
  });
});
