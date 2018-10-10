const assert = require('assert');
const app = require('../../src/app');

describe('\'bots\' service', () => {
  it('registered the service', () => {
    const service = app.service('bots');

    assert.ok(service, 'Registered the service');
  });
});
