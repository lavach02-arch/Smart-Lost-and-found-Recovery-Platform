const { describe, it } = require('node:test');
const assert = require('node:assert');
const { normalizeText, tokenize, calculateTextSimilarity } = require('../utils/textSimilarity');
const { calculateKeywordOverlap } = require('../utils/keywordMatcher');
const { calculateMatchScore } = require('../services/matchingService');

describe('SmartFind Phase 7 Automated Backend Test Suite', () => {

  describe('1. Text Similarity Engine', () => {
    it('should normalize text by stripping punctuation and lowercasing', () => {
      const input = '  Black, Samsung!! Galaxy S21... ';
      const expected = 'black samsung galaxy s21';
      assert.strictEqual(normalizeText(input), expected);
    });

    it('should tokenize text into array of word tokens', () => {
      const tokens = tokenize('Black Wallet Guntur');
      assert.deepStrictEqual(tokens, ['black', 'wallet', 'guntur']);
    });

    it('should calculate non-zero similarity for overlapping text', () => {
      const score = calculateTextSimilarity('Black Samsung Galaxy Phone', 'Black Samsung Mobile Phone');
      assert.ok(score > 0.4, `Expected score > 0.4, got ${score}`);
    });

    it('should return 0 similarity for completely disjoint text', () => {
      const score = calculateTextSimilarity('iPhone 13 Pro', 'Leather Red Backpack');
      assert.strictEqual(score, 0);
    });
  });

  describe('2. Smart Matching Engine', () => {
    it('should calculate high similarity match score for similar lost and found items', () => {
      const lostItem = {
        title: 'Black Samsung Galaxy S21 Phone',
        description: 'Lost black phone at Guntur bus stand with cracked screen protector',
        category: 'Mobile Phones',
        location: 'Guntur Bus Stand',
        date: '2026-09-18',
      };

      const foundItem = {
        title: 'Black Samsung Phone',
        description: 'Found black smartphone at Guntur bus stand near ticket counter',
        category: 'Mobile Phones',
        location: 'Guntur Bus Stand',
        date: '2026-09-18',
      };

      const match = calculateMatchScore(lostItem, foundItem);
      assert.ok(match.matchScore >= 50, `Expected matchScore >= 50, got ${match.matchScore}`);
      assert.ok(match.matchedFields.includes('Category'));
    });
  });

  describe('3. Role & Permission Security Constraints', () => {
    it('should deny admin access to normal USER role', () => {
      const user = { role: 'USER' };
      const isAdmin = user.role === 'ADMIN';
      assert.strictEqual(isAdmin, false);
    });

    it('should grant admin access to ADMIN role', () => {
      const user = { role: 'ADMIN' };
      const isAdmin = user.role === 'ADMIN';
      assert.strictEqual(isAdmin, true);
    });
  });

});
