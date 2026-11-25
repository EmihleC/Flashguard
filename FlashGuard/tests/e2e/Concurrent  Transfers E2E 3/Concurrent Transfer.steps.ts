// Concurrent transfers: mobile (Appium UI) and web (separate API session) at the same moment.
// Same page objects, API client and helpers as concurrent_transfers.steps.ts.
// The feature has no Background, so the mobile login happens in the first Given step.
import { Before, Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import page from './primefin.page';
import transferPage, { MobileTransferResult } from './transfer.page';
import { normaliseStatus, round2 } from '../support/helpers';
import {
  authorize, getAccounts, getBalance, getHistory, getTransaction, loginAs, transfer,
  HistoryTx, Session, TransferResult,
} from '../support/transferApi';

interface ConcurrencyState {
  web: Session;
  recipientId?: number;
  originalBalance?: number;
  originalIds?: Set<number>;
  mobileAmount?: number;
  webAmount?: number;
  webResult?: TransferResult;
  mobileResult?: MobileTransferResult;
  newTxs?: HistoryTx[];
}

let state: ConcurrencyState | undefined;
const st = (): ConcurrencyState => {
  if (!state) throw new Error('State missing: the "account balance is R..." step must run first');
  return state;
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Before({ tags: '@concurrency' }, async () => {
  state = undefined;
});

/** Polls the history until at least `atLeast` transactions that did not exist before the test are visible. */
async function waitForNewTransactions(s: ConcurrencyState, atLeast: number): Promise<HistoryTx[]> {
  const deadline = Date.now() + 10000;
  let fresh: HistoryTx[] = [];
  do {
    const history = await getHistory(s.web);
    fresh = history.filter((t) => !(s.originalIds as Set<number>).has(t.id));
    if (fresh.length >= atLeast) break;
    await sleep(500);
  } while (Date.now() < deadline);
  return fresh;
}

// ---------- setup ----------
Given('the account balance is R{float}', async (expectedBalance: number) => {
  // mobile channel: log in to the app
  await page.login();
  await page.waitForBalanceLoaded();

  // web channel: a second, separate login session
  const s: ConcurrencyState = { web: await loginAs('web') };
  state = s;

  const accounts = await getAccounts(s.web);
  const recipient = accounts.find((a) => a.id !== s.web.userId); // same pick the app makes by default
  if (!recipient) throw new Error('The database needs a second account to act as the transfer recipient');
  s.recipientId = recipient.id;

  s.originalBalance = round2(await getBalance(s.web));
  s.originalIds = new Set((await getHistory(s.web)).map((t) => t.id));

  // the test cannot seed money, so the user must already hold exactly this balance
  if (s.originalBalance !== round2(expectedBalance)) {
    throw new Error(
      `Precondition failed: expected the account balance to be R${expectedBalance}, but the database has R${s.originalBalance}. Reseed the demo user first.`,
    );
  }
});

// ---------- the concurrent action ----------
When(
  'mobile transfers R{float} and web transfers R{float} simultaneously',
  async (mobileAmount: number, webAmount: number) => {
    const s = st();
    s.mobileAmount = mobileAmount;
    s.webAmount = webAmount;

    // both transfers must be affordable, otherwise "both succeed" cannot hold
    expect(s.originalBalance as number).toBeGreaterThanOrEqual(round2(mobileAmount + webAmount));

    // fill the mobile form, then bring the button into view WITHOUT tapping it
    await page.openTab('Transact');
    await transferPage.setAmount(mobileAmount);
    const button = await transferPage.reviewButton();

    const delayMs = Number(process.env.WEB_DELAY_MS ?? 0); // tune if the web call lands before the phone's request
    const fireAt = Date.now();

    const [, web] = await Promise.all([
      transferPage.tap(button),
      sleep(delayMs).then(() => transfer(s.web, s.recipientId as number, webAmount)),
    ]);
    s.webResult = web;
    s.mobileResult = await transferPage.waitForTransferResult();

    console.log(
      `[Concurrency] web call started +${web.startedAt - fireAt}ms after the tap command, took ${web.finishedAt - web.startedAt}ms`,
    );
  },
);

// ---------- verification ----------
Then('both transfers should succeed', async () => {
  const s = st();
  if (!s.webResult?.ok) {
    throw new Error(`Web transfer failed: HTTP ${s.webResult?.httpStatus} ${JSON.stringify(s.webResult?.body)}`);
  }
  if (!s.mobileResult?.ok) {
    throw new Error(`Mobile transfer failed: ${s.mobileResult?.message || '(no message)'}`);
  }
});

Then('both transactions should be saved in the database', async () => {
  const s = st();

  // transfers queued for approval are authorised so they count towards the balance
  const queued = await waitForNewTransactions(s, 2);
  for (const tx of queued) {
    const latest = await getTransaction(s.web, tx.id);
    if (normaliseStatus(latest.status) === 'pending') await authorize(s.web, tx.id);
  }
  s.newTxs = await waitForNewTransactions(s, 2); // re-read after approvals

  const amounts = s.newTxs.map((t) => round2(Math.abs(Number(t.amount)))).sort((x, y) => x - y);
  expect(amounts).toEqual(
    [round2(s.mobileAmount as number), round2(s.webAmount as number)].sort((x, y) => x - y),
  );
});

Then('the final balance should be R{float}', async (expectedBalance: number) => {
  const s = st();
  const expected = round2(expectedBalance);

  // short poll only to absorb commit lag; a wrong value that never converges is a real failure
  let actual = round2(await getBalance(s.web));
  const deadline = Date.now() + 10000;
  while (actual !== expected && Date.now() < deadline) {
    await sleep(500);
    actual = round2(await getBalance(s.web));
  }
  if (actual === expected) return;

  const original = s.originalBalance as number;
  let hint = 'balance does not match either single debit';
  if (actual === round2(original - (s.mobileAmount as number))) hint = 'the WEB debit was lost (lost update / double-spend)';
  if (actual === round2(original - (s.webAmount as number))) hint = 'the MOBILE debit was lost (lost update / double-spend)';
  throw new Error(`Balance mismatch: expected ${expected}, database has ${actual} (original ${original}): ${hint}`);
});

Then('no duplicate transactions should exist', async () => {
  const s = st();
  await sleep(3000); // give a stray duplicate time to show up before the final read

  const history = await getHistory(s.web);
  const fresh = history.filter((t) => !(s.originalIds as Set<number>).has(t.id));

  // both amounts can be identical (50 and 50), so duplicates are judged by id and by count, not by amount
  expect(new Set(fresh.map((t) => t.id)).size).toBe(fresh.length);
  expect(fresh.length).toBe(2);
});