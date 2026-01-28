import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import app from '../app.js';
import http from "http";

const PORT = 36569;   // We assume nobody uses this.
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
    assert.ok(text.includes('<title>Home | Legislative Info Systems</title>'));
  });

  it("should have a heading", async () => {
    const response = await fetch(`http://localhost:${PORT}/`);
    const text = await response.text();
    assert.ok(text.includes('<h1>Home</h1>'));
  });
});
