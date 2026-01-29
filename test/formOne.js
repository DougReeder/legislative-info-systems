import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import app from '../app.js';
import http from "http";

const PORT = 60000 + Math.floor(Math.random() * 5565);
app.set('port', PORT);

describe("legislator create", () => {
  const url = `http://localhost:${PORT}/legislator/create`;
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

  it("GET should return form", async () => {
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    const text = await response.text();
    assert.match(text, /<title>Create Legislator \| Legislative Info Systems<\/title>/);
    assert.match(text, /<h1>Create Legislator<\/h1>/);
    assert.match(text, /<form action="\/legislator\/create" method="post">/);
    assert.match(text, /<input type="text" name="firstName" id="firstName" required/);
    assert.match(text, /<input type="text" name="lastName" id="lastName" required/);
    assert.match(text, /<input type="text" name="hometown" id="hometown" required/);
    assert.match(text, /<button type="submit">/);
  });

  it("should reject a POST without form data", async() => {
    const response = await fetch(url, { method: 'POST' });
    assert.equal(response.status, 400);
    const text = await response.text();
    assert.match(text, /<h2>No request body found<\/h2>/);
  });

  for (const name of ['firstName', 'lastName', 'hometown']) {
    it(`should reject a POST with invalid ${name}`, async() => {
      const params = new URLSearchParams([["firstName", "first"], ["lastName", "last"], ["hometown", "home"]]);
      params.set(name, '123');
      const response = await fetch(url, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      assert.equal(response.status, 400);
      const text = await response.text();
      assert.match(text, /<h2>.* “123” is invalid<\/h2>/);
    });
  }

  it(`should accept a valid POST & display all`, async() => {
    const params = new URLSearchParams([["firstName", "John"], ["lastName", "Doe"], ["hometown", "Centerville"]]);
    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.match(text, /<ul><li>John Doe from Centerville<\/li><\/ul>/);

    const params2 = new URLSearchParams([["firstName", "Alexis"], ["lastName", "Ballyrun"], ["hometown", "Columbus"]]);
    const response2 = await fetch(url, {
      method: 'POST',
      body: params2,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    assert.equal(response2.status, 200);
    const text2 = await response2.text();
    assert.match(text2, /<ul><li>Alexis Ballyrun from Columbus<\/li><li>John Doe from Centerville<\/li><\/ul>/);
  });
 });
