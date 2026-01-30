import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import appFactory from '../appFactory.js';
import collectionsFactory from '../db/collectionsFactory.js';
const { legislators, injectLegislators, legislation, injectLegislation } = await collectionsFactory(false);
const app = await appFactory({injectLegislators, injectLegislation});

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
    assert.match(nav, /<a href="\/legislation\/create">Create Legislation<\/a>/);
  });

  it("should have empty drawer of legislators", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.match(text, /<details open><summary>Legislators<\/summary><ul><\/ul><\/details>/);
  });

  it("should have filled drawer of legislators", async () => {
    legislators.insert({ firstName: "Richard", lastName: "Roe", hometown: "Worthington" });

    const response2 = await fetch(`http://localhost:${PORT}/`);
    assert.equal(response2.status, 200);
    const text = await response2.text();
    assert.match(text, /<details open><summary>Legislators<\/summary><ul><li>Richard Roe from Worthington<\/li><\/ul><\/details>/);
  });

  it("should have empty drawer of legislation", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.match(text, /<details open><summary>Legislation<\/summary><\/details>/);
  });

  it("should have filled drawer of legislation", async () => {
    legislation.insert({ title: "Some Bill", text: "Lorem Ipsum" /*, sponsors: */ });

    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.match(text, /<details open><summary>Legislation<\/summary><h2>Some Bill<\/h2><p>Lorem Ipsum<\/p><\/details>/);
  });
});
