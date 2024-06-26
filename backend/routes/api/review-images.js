const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found"
        })
    }

    await reviewImage.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
