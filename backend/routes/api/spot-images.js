const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found"
        })
    }

    await spotImage.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
