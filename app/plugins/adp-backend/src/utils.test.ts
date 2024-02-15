import { createName, createTransformerTitle, getCurrentUsername } from './utils';
import express from 'express';

describe('createName', () => {
  it('replaces spaces with dashes and converts to lowercase', () => {
    const input = 'Example Name';
    const expected = 'example-name';
    expect(createName(input)).toBe(expected);
  });

  it('handles strings longer than 64 characters', () => {
    const longName = 'a'.repeat(70);
    const expected = 'a'.repeat(64);
    expect(createName(longName)).toBe(expected);
  });

  it('removes extra spaces within the name', () => {
    const input = 'Example   Name With  Spaces';
    const expected = 'example-name-with-spaces';
    expect(createName(input)).toBe(expected);
  });
});

describe('createTransformerTitle', () => {
  it('returns the title as is if no alias is provided', () => {
    const title = 'Example Title';
    expect(createTransformerTitle(title)).toBe(title);
  });

  it('puts the alias in brackets if provided', () => {
    const title = 'Example Title';
    const shortName = 'ET';
    const expected = 'Example Title (ET)';
    expect(createTransformerTitle(title, shortName)).toBe(expected);
  });
});

describe('checkForDuplicateTitle', () => {
  it('returns the title as is if no alias is provided', () => {
    const title = 'Example Title';
    expect(createTransformerTitle(title)).toBe(title);
  });

  it('puts the alias in brackets if provided', () => {
    const title = 'Example Title';
    const shortName = 'ET';
    const expected = 'Example Title (ET)';
    expect(createTransformerTitle(title, shortName)).toBe(expected);
  });
});

describe('getCurrentUsername', () => {
  const mockIdentityApi = {
    getIdentity: jest.fn().mockResolvedValue({
      identity: { userEntityRef: 'user:default/johndoe' },
    }),
  };

  it('returns the username when identity is found', async () => {
    mockIdentityApi.getIdentity.mockResolvedValue({
      identity: { userEntityRef: 'user:default/johndoe' },
    });

    await expect(
      getCurrentUsername(mockIdentityApi, express.request),
    ).resolves.toBe('user:default/johndoe');
  });

  it('returns "unknown" when identity is not found', async () => {
    mockIdentityApi.getIdentity.mockResolvedValue(null);

    await expect(
      getCurrentUsername(mockIdentityApi, express.request),
    ).resolves.toBe('unknown');
  });
});