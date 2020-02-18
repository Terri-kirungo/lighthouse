/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const {server} = require('./fixtures/static-server.js');

/**
 * @param {string} url
 */
function get(url) {
  return new Promise((resolve, reject) => {
    let data = '';
    http.get(url, function(resp) {
      resp.on('data', function(chunk) {
        data += chunk;
      });
      resp.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/* eslint-env jest */

describe('Server', () => {
  beforeAll(async () => {
    await server.listen(10200, 'localhost');
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(() => {
    server.setDataTransformer(undefined);
  });

  it('fetches fixture', async () => {
    const data = await get(`http://localhost:${server.getPort()}/dobetterweb/dbw_tester.html`);
    expect(data).toEqual(fs.readFileSync(`${__dirname}/fixtures/dobetterweb/dbw_tester.html`, 'utf-8'));
  });

  it('setDataTransformer', async () => {
    server.setDataTransformer(data => {
      return 'hello there';
    });

    const data = await get(`http://localhost:${server.getPort()}/dobetterweb/dbw_tester.html`);
    expect(data).toEqual('hello there');
  });
});
