const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const { user } = req

    const reviewImage = await ReviewImage.findByPk(imageId);

    const review = await Review.findOne({
        where: {
            id: reviewImage.reviewId
        }
    })

    if (!reviewImage) {
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found"
        })
    }

    if (review.userId !== user.id) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    }


    await reviewImage.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
