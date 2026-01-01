/**
 * Test suite for batching functions
 */

import { createBatches, parseAsset, getBatchSummary } from '../lib/stellar/batcher';

const samplePayments = [
  {
    address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
    amount: '100',
    asset: 'XLM',
  },
  {
    address: 'GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3AEYZ7R37ZJNHYQM7MDEBC67',
    amount: '50',
    asset: 'XLM',
  },
  {
    address: 'GCNY5OXYSY4FKHOPT2SPOQZAOEIGKKAOMWCUT5LPYYCVYHI災OW7MFTD',
    amount: '75',
    asset: 'XLM',
  },
];

describe('Batch Creation', () => {
  test('creates single batch when below max operations', () => {
    const batches = createBatches(samplePayments, 100);
    expect(batches).toHaveLength(1);
    expect(batches[0].payments).toHaveLength(3);
  });

  test('creates multiple batches when exceeding max operations', () => {
    const batches = createBatches(samplePayments, 2);
    expect(batches).toHaveLength(2);
    expect(batches[0].payments).toHaveLength(2);
    expect(batches[1].payments).toHaveLength(1);
  });

  test('assigns correct transaction indices', () => {
    const batches = createBatches(samplePayments, 1);
    expect(batches[0].transactionIndex).toBe(0);
    expect(batches[1].transactionIndex).toBe(1);
    expect(batches[2].transactionIndex).toBe(2);
  });

  test('preserves payment data in batches', () => {
    const batches = createBatches(samplePayments, 10);
    expect(batches[0].payments[0]).toEqual(samplePayments[0]);
  });

  test('handles single payment', () => {
    const payments = [samplePayments[0]];
    const batches = createBatches(payments, 1);
    expect(batches).toHaveLength(1);
    expect(batches[0].payments).toHaveLength(1);
  });

  test('handles large batch size', () => {
    const batches = createBatches(samplePayments, 1000);
    expect(batches).toHaveLength(1);
    expect(batches[0].payments).toHaveLength(3);
  });
});

describe('Asset Parsing', () => {
  test('parses native XLM', () => {
    const asset = parseAsset('XLM');
    expect(asset.code).toBe('XLM');
    expect(asset.issuer).toBeNull();
  });

  test('parses issued asset', () => {
    const asset = parseAsset('USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM');
    expect(asset.code).toBe('USDC');
    expect(asset.issuer).toBe('GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM');
  });

  test('parses asset with long code', () => {
    const asset = parseAsset('LONGCODE123:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM');
    expect(asset.code).toBe('LONGCODE123');
    expect(asset.issuer).toBe('GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM');
  });
});

describe('Batch Summary', () => {
  test('calculates total amount', () => {
    const summary = getBatchSummary(samplePayments);
    expect(summary.totalAmount).toBe('225');
  });

  test('counts recipients', () => {
    const summary = getBatchSummary(samplePayments);
    expect(summary.recipientCount).toBe(3);
  });

  test('groups by asset', () => {
    const summary = getBatchSummary(samplePayments);
    expect(summary.assetBreakdown['XLM']).toBe(3);
  });

  test('handles multiple assets', () => {
    const payments = [
      {
        address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
        amount: '100',
        asset: 'XLM',
      },
      {
        address: 'GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3AEYZ7R37ZJNHYQM7MDEBC67',
        amount: '50',
        asset: 'USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM',
      },
    ];
    const summary = getBatchSummary(payments);
    expect(summary.assetBreakdown['XLM']).toBe(1);
    expect(summary.assetBreakdown['USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM']).toBe(1);
  });

  test('calculates correct total with decimal amounts', () => {
    const payments = [
      {
        address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
        amount: '10.5',
        asset: 'XLM',
      },
      {
        address: 'GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3AEYZ7R37ZJNHYQM7MDEBC67',
        amount: '20.25',
        asset: 'XLM',
      },
    ];
    const summary = getBatchSummary(payments);
    expect(summary.totalAmount).toBe('30.75');
  });
});
