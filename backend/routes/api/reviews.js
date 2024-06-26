const router = require("express").Router();
const { Spot, Review, SpotImage, User, ReviewImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req

    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage,
                    attributes: ["url"],
                    where: { preview: true },
                    required: false,
                    as: "previewImage",
                }
            },
            {
                model: ReviewImage,
                attributes: ["id", 'url']
            }
        ]
    });

    res.json( {
        Reviews: reviews
    })
})

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId)

    if (!review) {
        res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    })

    if (reviewImages.length >= 10) {
        res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    const newReviewImage = await ReviewImage.create({
        reviewId: parseInt(reviewId),
        url
    })

    const responseImage = await ReviewImage.findOne({
        where: {
            id: newReviewImage.id
        },
        attributes: ["id", "url"]
    })

    res.json(responseImage)
});

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars} = req.body

    const reviewToUpdate = await Review.findByPk(reviewId);

    if (!reviewToUpdate) {
        res.status(404).json({
            message: "Review couldn't be found"
        })
    }
    let errors = {};
    if (!review) errors.address = "Review text is required";
    if (stars > 5 || stars < 1) errors.stars = "Stars must be an integer from 1 to 5";

    if (Object.keys(errors).length > 0) {
        res.status(400);
        return res.json({
          "message": "Bad Request",
          errors
        });
    }

    reviewToUpdate.review = review || reviewToUpdate.review;
    reviewToUpdate.stars = stars || reviewToUpdate.stars;

    await reviewToUpdate.save();

    res.json(reviewToUpdate)
})

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params

    const reviewToDestroy = await Review.findByPk(reviewId);

    if (!reviewToDestroy) {
        res.status(404).json({
            message: "Review couldn't be found"
        })
    }
    await reviewToDestroy.destroy();

    res.json({
        message: "Successfully deleted"
    })
})
module.exports = router;
