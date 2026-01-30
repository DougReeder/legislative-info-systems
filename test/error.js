import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import appFactory from '../appFactory.js';
const mockInjectLegislators = (_req, _res, next) => { next() };
const mockInjectLegislation = (_req, _res, next) => { next() };
const app = await appFactory({injectLegislators: mockInjectLegislators, injectLegislation: mockInjectLegislation});

const PORT = 60000 + Math.floor(Math.random() * 5565);
app.set('port', PORT);

describe("404 Not Found error page", () => {
  const url = `http://localhost:${PORT}/foo`;
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
    const response = await fetch(url);
    assert.equal(response.status, 404);
    assert.ok(response.headers.get('content-type').startsWith('text/html'));
    assert.ok(response.headers.get('content-type').endsWith(
        '; charset=utf-8'));
  });

  it("should have a title & header", async () => {
    const response = await fetch(url);
    const text = await response.text();
    assert.match(text, /<title>Sorry, we couldn't find that page \| Legislative Info Systems<\/title>/);
    assert.match(text, /<h1>Sorry, we couldn't find that page<\/h1>/);
  });

  it("should have a nav bar with links to Home & Create Legislator", async () => {
    const response = await fetch(url);
    const text = await response.text();

    const nav = /<nav>(.*)<\/nav>/.exec(text)?.[1];
    assert.ok(nav);
    assert.match(nav, /<a href="\/">Home<\/a>/);
    assert.match(nav, /<a href="\/legislator\/create">Create Legislator<\/a>/);
    assert.match(nav, /<a href="\/legislation\/create">Create Legislation<\/a>/);
  });
});
