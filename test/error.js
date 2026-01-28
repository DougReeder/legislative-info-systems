import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import app from '../app.js';
import http from "http";

const PORT = 60000 + Math.floor(Math.random() * 5565);
app.set('port', PORT);

describe("error page", () => {
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

  it("should have a title", async () => {
    const response = await fetch(url);
    const text = await response.text();
    assert.ok(text.includes("<title>Sorry, we couldn't find that page | Legislative Info Systems</title>"));
  });

  it("should have a link to home", async () => {
    const response = await fetch(url);
    const text = await response.text();
    assert.ok(text.includes('<a href="/">Home</a>'));
  });
});
