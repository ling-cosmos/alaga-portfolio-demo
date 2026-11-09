import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AddressInfo } from 'node:net';
import { createAppServer } from '../src/app';
import { databasePool } from '../src/database';

test('portfolio visitors use original database workflows with isolated sample accounts', async () => {
  const previous = process.env.PORTFOLIO_DEMO;
  process.env.PORTFOLIO_DEMO = 'true';
  const app = createAppServer();
  await new Promise<void>(resolve => app.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
  const start = async () => {
    const response = await fetch(base + '/auth/portfolio-demo', { method:'POST' });
    assert.equal(response.status, 201);
    return await response.json() as { token:string; account:{ id:string; careSetup:string } };
  };
  try {
    const a = await start(), b = await start();
    assert.notEqual(a.account.id, b.account.id);
    assert.equal(a.account.careSetup, 'family');
    const auth = { Authorization:`Bearer ${a.token}` };
    const patients = await (await fetch(base + '/patients', { headers:auth })).json() as { patients:{ id:string; displayName:string }[] };
    assert.equal(patients.patients.length, 1);
    assert.match(patients.patients[0].displayName, /Synthetic/);
    const path = `/patients/${patients.patients[0].id}/medications`;
    const medicines = await (await fetch(base + path, { headers:auth })).json() as { medications:{ displayName:string }[] };
    assert.match(medicines.medications[0].displayName, /Synthetic/);
    assert.equal((await fetch(base + path, { headers:{ Authorization:`Bearer ${b.token}` } })).status, 403);
    assert.equal((await fetch(base + '/auth/register', { method:'POST', body:'{}' })).status, 403);
    delete process.env.PORTFOLIO_DEMO;
    assert.equal((await fetch(base + '/auth/portfolio-demo', { method:'POST' })).status, 404);
  } finally {
    if (previous === undefined) delete process.env.PORTFOLIO_DEMO; else process.env.PORTFOLIO_DEMO = previous;
    await new Promise<void>(resolve => app.close(() => resolve()));
    await databasePool.end();
  }
});
