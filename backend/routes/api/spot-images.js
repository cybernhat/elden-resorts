const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const { user } = req;

    const spotImage = await SpotImage.findByPk(imageId);
    // console.log(spotImage)

    if (!spotImage) {
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found"
        })
    }

    const userSpot = await Spot.findByPk(spotImage.spotId);
    console.log(userSpot.ownerId);
    console.log(user.id)

    if (userSpot.ownerId !== user.id) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    };

    await spotImage.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
