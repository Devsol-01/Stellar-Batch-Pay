/**
 * Test suite for validation functions
 * Run with: npx jest tests/
 */

import {
  validatePaymentInstruction,
  validateBatchConfig,
  validatePaymentInstructions,
} from '../lib/stellar/validator';

describe('Payment Instruction Validation', () => {
  test('validates correct XLM payment', () => {
    const result = validatePaymentInstruction({
      address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
      amount: '100.50',
      asset: 'XLM',
    });
    expect(result.valid).toBe(true);
  });

  test('validates correct issued asset payment', () => {
    const result = validatePaymentInstruction({
      address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
      amount: '50.25',
      asset: 'USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM',
    });
    expect(result.valid).toBe(true);
  });

  test('rejects invalid address', () => {
    const result = validatePaymentInstruction({
      address: 'INVALID_ADDRESS',
      amount: '100',
      asset: 'XLM',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('address');
  });

  test('rejects negative amount', () => {
    const result = validatePaymentInstruction({
      address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
      amount: '-100',
      asset: 'XLM',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('amount');
  });

  test('rejects zero amount', () => {
    const result = validatePaymentInstruction({
      address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
      amount: '0',
      asset: 'XLM',
    });
    expect(result.valid).toBe(false);
  });

  test('rejects invalid asset format', () => {
    const result = validatePaymentInstruction({
      address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
      amount: '100',
      asset: 'INVALID',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('asset');
  });
});

describe('Batch Configuration Validation', () => {
  test('validates correct config', () => {
    const result = validateBatchConfig({
      secretKey: 'SBXK32Y4DVZZRNYRDP3CXHZZ6NVYVVQCYYGZJ26GXXZ3CJHZZRFLJ56',
      network: 'testnet',
      maxOperationsPerTransaction: 50,
    });
    expect(result.valid).toBe(true);
  });

  test('rejects invalid secret key', () => {
    const result = validateBatchConfig({
      secretKey: 'INVALID_SECRET',
      network: 'testnet',
      maxOperationsPerTransaction: 50,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('secret key');
  });

  test('rejects invalid network', () => {
    const result = validateBatchConfig({
      secretKey: 'SBXK32Y4DVZZRNYRDP3CXHZZ6NVYVVQCYYGZJ26GXXZ3CJHZZRFLJ56',
      network: 'invalid' as any,
      maxOperationsPerTransaction: 50,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('network');
  });

  test('rejects excessive operations per transaction', () => {
    const result = validateBatchConfig({
      secretKey: 'SBXK32Y4DVZZRNYRDP3CXHZZ6NVYVVQCYYGZJ26GXXZ3CJHZZRFLJ56',
      network: 'testnet',
      maxOperationsPerTransaction: 200,
    });
    expect(result.valid).toBe(false);
  });
});

describe('Batch Validation', () => {
  test('validates batch of correct payments', () => {
    const result = validatePaymentInstructions([
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
    ]);
    expect(result.valid).toBe(true);
    expect(result.errors.size).toBe(0);
  });

  test('detects errors in batch', () => {
    const result = validatePaymentInstructions([
      {
        address: 'GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER',
        amount: '100',
        asset: 'XLM',
      },
      {
        address: 'INVALID',
        amount: '50',
        asset: 'XLM',
      },
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
    expect(result.errors.has(1)).toBe(true);
  });
});
