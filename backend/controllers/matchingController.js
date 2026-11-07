const { findMatchesForItem } = require('../services/matchingService');
const Notification = require('../models/Notification');
const { NOTIFICATION_TYPES } = require('../models/Notification');

/**
 * @desc    Get potential matches for a target item
 * @route   GET /api/matches/:itemId
 * @access  Private
 */
const getMatches = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const result = await findMatchesForItem(itemId);

    // Create match notifications asynchronously with duplicate prevention
    if (result.matches && result.matches.length > 0) {
      const targetItem = result.item;
      for (const matchEntry of result.matches) {
        const candidateItem = matchEntry.item;
        const matchScore = matchEntry.matchScore;

        if (matchScore >= 40 && targetItem.owner) {
          const matchKey = `${targetItem._id}_${candidateItem._id}_${targetItem.owner}`;
          const existingNotif = await Notification.findOne({ matchKey });
          if (!existingNotif) {
            await Notification.create({
              recipient: targetItem.owner,
              type: NOTIFICATION_TYPES.MATCH_FOUND,
              title: 'Potential Match Found',
              message: `A ${candidateItem.status} item "${candidateItem.title}" matches your ${targetItem.status} item "${targetItem.title}" with a ${matchScore}% match score.`,
              relatedItem: candidateItem._id,
              matchKey,
            });
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      item: result.item,
      oppositeStatus: result.oppositeStatus,
      totalMatches: result.matches.length,
      matches: result.matches,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }
    next(error);
  }
};

module.exports = {
  getMatches,
};
