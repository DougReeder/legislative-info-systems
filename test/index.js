import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import appFactory from '../appFactory.js';
const mockInjectLegislators = (_req, _res, next) => { next() };
const app = await appFactory({injectLegislators: mockInjectLegislators});

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
});
