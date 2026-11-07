/**
 * Text Similarity Utilities for SmartFind Matching Engine
 */

/**
 * Normalize text by lowercasing, removing punctuation, and collapsing whitespace.
 */
const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Tokenize text into array of clean word tokens.
 */
const tokenize = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
};

/**
 * Calculate Jaccard text similarity ratio between 0 and 1.
 */
const calculateTextSimilarity = (text1, text2) => {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersectionCount = 0;
  tokens1.forEach((token) => {
    if (tokens2.has(token)) {
      intersectionCount++;
    }
  });

  const unionSize = new Set([...tokens1, ...tokens2]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
};

module.exports = {
  normalizeText,
  tokenize,
  calculateTextSimilarity,
};
