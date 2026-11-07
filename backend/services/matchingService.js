const Item = require('../models/Item');
const { calculateTextSimilarity, normalizeText } = require('../utils/textSimilarity');
const { calculateKeywordOverlap } = require('../utils/keywordMatcher');

/**
 * Calculate match score between a target item and candidate item (0 - 100)
 */
const calculateMatchScore = (targetItem, candidateItem) => {
  let categoryScore = 0;
  let titleScore = 0;
  let descriptionScore = 0;
  let locationScore = 0;
  let dateScore = 0;
  let additionalScore = 0;

  const matchedFields = [];

  // 1. Category Matching (Weight: 30%)
  if (targetItem.category && candidateItem.category) {
    if (targetItem.category.toLowerCase() === candidateItem.category.toLowerCase()) {
      categoryScore = 30;
      matchedFields.push('Category');
    }
  }

  // 2. Title Matching (Weight: 20%)
  if (targetItem.title && candidateItem.title) {
    const textSim = calculateTextSimilarity(targetItem.title, candidateItem.title);
    const kwSim = calculateKeywordOverlap(targetItem.title, candidateItem.title);
    const combinedSim = textSim * 0.4 + kwSim * 0.6;
    titleScore = Math.min(20, Math.round(combinedSim * 20));
    if (titleScore >= 7) {
      matchedFields.push('Item Name');
    }
  }

  // 3. Description Matching (Weight: 20%)
  if (targetItem.description && candidateItem.description) {
    const textSim = calculateTextSimilarity(targetItem.description, candidateItem.description);
    const kwSim = calculateKeywordOverlap(targetItem.description, candidateItem.description);
    const combinedSim = textSim * 0.4 + kwSim * 0.6;
    descriptionScore = Math.min(20, Math.round(combinedSim * 20));
    if (descriptionScore >= 7) {
      matchedFields.push('Description');
    }
  }

  // 4. Location Matching (Weight: 15%)
  if (targetItem.location && candidateItem.location) {
    const loc1 = normalizeText(targetItem.location);
    const loc2 = normalizeText(candidateItem.location);

    if (loc1 === loc2) {
      locationScore = 15;
    } else if (loc1.includes(loc2) || loc2.includes(loc1)) {
      locationScore = 12;
    } else {
      const kwSim = calculateKeywordOverlap(targetItem.location, candidateItem.location);
      locationScore = Math.min(15, Math.round(kwSim * 15));
    }

    if (locationScore >= 6) {
      matchedFields.push('Location');
    }
  }

  // 5. Date Matching (Weight: 10%)
  if (targetItem.date && candidateItem.date) {
    try {
      const d1 = new Date(targetItem.date).getTime();
      const d2 = new Date(candidateItem.date).getTime();

      if (!isNaN(d1) && !isNaN(d2)) {
        const diffDays = Math.abs(d1 - d2) / (1000 * 3600 * 24);
        if (diffDays < 1) dateScore = 10;
        else if (diffDays < 2) dateScore = 8;
        else if (diffDays < 3) dateScore = 6;
        else if (diffDays < 4) dateScore = 4;
        else if (diffDays < 5) dateScore = 2;
        else dateScore = 0;
      }
    } catch (e) {
      dateScore = 0;
    }

    if (dateScore >= 6) {
      matchedFields.push('Date');
    }
  }

  // 6. Additional Details Matching (Weight: 5%)
  if (targetItem.additionalDetails && candidateItem.additionalDetails) {
    const textSim = calculateTextSimilarity(targetItem.additionalDetails, candidateItem.additionalDetails);
    const kwSim = calculateKeywordOverlap(targetItem.additionalDetails, candidateItem.additionalDetails);
    const combinedSim = textSim * 0.4 + kwSim * 0.6;
    additionalScore = Math.min(5, Math.round(combinedSim * 5));
    if (additionalScore >= 2) {
      matchedFields.push('Additional Details');
    }
  }

  const matchScore = Math.min(100, Math.round(categoryScore + titleScore + descriptionScore + locationScore + dateScore + additionalScore));

  let matchLevel = 'Low Match';
  if (matchScore >= 80) matchLevel = 'Very High Match';
  else if (matchScore >= 60) matchLevel = 'High Match';
  else if (matchScore >= 40) matchLevel = 'Possible Match';

  return {
    matchScore,
    matchLevel,
    matchedFields,
    breakdown: {
      categoryScore,
      titleScore,
      descriptionScore,
      locationScore,
      dateScore,
      additionalScore,
    },
  };
};

/**
 * Find candidate matches for a specified item ID
 */
const findMatchesForItem = async (itemId) => {
  let targetItem = null;

  try {
    targetItem = await Item.findById(itemId).populate('owner', 'name email phone profileImage');
  } catch (e) {
    // Ignore invalid ObjectId error
  }

  if (!targetItem) {
    const err = new Error('Target item not found');
    err.statusCode = 404;
    throw err;
  }

  const oppositeStatus = targetItem.status === 'lost' ? 'found' : 'lost';

  // Query opposite status candidate items from database
  const candidateItems = await Item.find({ status: oppositeStatus }).populate('owner', 'name email phone profileImage');

  const matches = [];

  candidateItems.forEach((candidate) => {
    // Avoid comparing item with itself if IDs match
    if (candidate._id.toString() === targetItem._id.toString()) return;

    const { matchScore, matchLevel, matchedFields, breakdown } = calculateMatchScore(targetItem, candidate);

    // Only include matches with score >= 40%
    if (matchScore >= 40) {
      matches.push({
        item: candidate,
        matchScore,
        matchLevel,
        matchedFields,
        breakdown,
      });
    }
  });

  // Sort by highest score first
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return {
    success: true,
    item: targetItem,
    oppositeStatus,
    matches,
  };
};

module.exports = {
  calculateMatchScore,
  findMatchesForItem,
};
