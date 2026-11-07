const { tokenize } = require('./textSimilarity');

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'with', 'and', 'or', 'of',
  'to', 'in', 'for', 'on', 'at', 'by', 'from', 'my', 'your', 'his', 'her',
  'its', 'it', 'this', 'that', 'these', 'those', 'has', 'have', 'had', 'been',
  'be', 'as', 'into', 'about', 'near', 'around', 'beside', 'left', 'found', 'lost'
]);

/**
 * Extract meaningful content keywords excluding stop-words.
 */
const extractKeywords = (text) => {
  const tokens = tokenize(text);
  return tokens.filter((word) => word.length >= 2 && !STOP_WORDS.has(word));
};

/**
 * Calculate keyword overlap ratio between 0 and 1.
 */
const calculateKeywordOverlap = (text1, text2) => {
  const keywords1 = Array.from(new Set(extractKeywords(text1)));
  const keywords2 = Array.from(new Set(extractKeywords(text2)));

  if (keywords1.length === 0 || keywords2.length === 0) return 0;

  let matches = 0;
  keywords1.forEach((kw) => {
    if (keywords2.includes(kw)) {
      matches++;
    }
  });

  const minLength = Math.min(keywords1.length, keywords2.length);
  return minLength > 0 ? matches / minLength : 0;
};

module.exports = {
  STOP_WORDS,
  extractKeywords,
  calculateKeywordOverlap,
};
