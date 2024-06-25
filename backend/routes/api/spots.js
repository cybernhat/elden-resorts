const router = require("express").Router();
const { Spot, Review, SpotImage, ReviewImage, User, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get("/", async (req, res, next) => {
    const spots = await Spot.findAll({
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
        ],
      },
      include: [
        {
          model: Review,
          attributes: [],
        },
        {
          model: SpotImage,
          attributes: ["url"],
          where: { preview: true },
          required: false,
          as: "previewImage",
        },
    ],
        group: ["Spot.id", "previewImage.id"],
    });

    const flatten = spots.map(spot => {
        return {
            ...spot.toJSON(),
            previewImage: spot.toJSON().previewImage[0]?.url
        }
    })

    res.json({ Spots: flatten });
  });

router.get("/current", requireAuth, async (req, res, next) => {
    const { user } = req

    const allSpots = await Spot.findAll({
        where: {
        ownerId: user.id
        },
        attributes: {
            include: [
                [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
              ],
        },
        include: [
            {
              model: Review,
              attributes: [],
            },
            {
                model: SpotImage,
                attributes: ["url"],
                where: { preview: true },
                required: false,
                as: "previewImage",
              },
        ]
    })

    res.json({Spots: allSpots});
});

router.get("/:spotId", async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Reviews"
                        WHERE "Reviews"."spotId" = "Spot"."id"
                    )`),
                    'numReviews'
                ],
                [
                    Sequelize.literal(`(
                        SELECT AVG("stars")
                        FROM "Reviews"
                        WHERE "Reviews"."spotId" = "Spot"."id"
                    )`),
                    'avgStarRating'
                ],
            ],
        },
        include: [
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"],
                as: "previewImage",
            },
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
                as: "Owner"
            }
        ],
    });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.json(spot);
})

router.post("/", requireAuth, async (req, res, next) => {

        const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = req.body;

    const { user } = req

    let errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is invalid";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is invalid";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price || isNaN(price) || price < 0) errors.price = "Price per day is required and must be a number equal to or greater than 0";

    if (Object.keys(errors).length > 0) {
        res.status(400);
        return res.json({
          "message": "Bad Request",
          errors
        });
    }

    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.status(201).json({...newSpot.dataValues})

});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    const { url, preview} = req.body;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const newImage = await SpotImage.create({
        url,
        preview,
        spotId: spot.id
    });

    const createdImage = await SpotImage.findByPk(newImage.id,{
        attributes: ["id", "url", "preview"]
    });

    res.json({createdImage})
});

router.put("/:spotId", requireAuth, async (req, res, next) => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = req.body;

    const { spotId } = req.params;

    const spotToUpdate = await Spot.findByPk(spotId);

    let errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is invalid";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is invalid";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price || isNaN(price) || price < 0) errors.price = "Price per day is required and must be a number equal to or greater than 0";

    if (Object.keys(errors).length > 0) {
        res.status(400);
        return res.json({
          "message": "Bad Request",
          errors
        });
    }

    if (!spotToUpdate) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    spotToUpdate.address = address || spotToUpdate.address;
    spotToUpdate.city = city || spotToUpdate.city;
    spotToUpdate.state = state || spotToUpdate.state;
    spotToUpdate.country = country || spotToUpdate.country;
    spotToUpdate.lat = lat || spotToUpdate.lat;
    spotToUpdate.lng = lng || spotToUpdate.lng;
    spotToUpdate.name = name || spotToUpdate.name;
    spotToUpdate.description = description || spotToUpdate.description;
    spotToUpdate.price = price || spotToUpdate.price;

    await spotToUpdate.save();

    res.json(spotToUpdate);
})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    const spotToDestroy = await Spot.findByPk(spotId);

    if (!spotToDestroy) {
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    await spotToDestroy.destroy()

    res.status(200).json({
        message: "Successfully deleted"
    });
});

router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    const review = await Review.findAll({
        where: {
            spotId: spot.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    res.json(review)
})

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars} = req.body;
    const { spotId } = req.params;
    const { user } = req;

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

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    const reviewUser = await User.findByPk(user.id, {
        attributes: ["id"]
    })

    const existingReview = await Review.findOne({
        where: {
            userId: reviewUser.id
        }
    })

    if (existingReview) {
        res.status(500).json({
            message: "User already has a review for this spot"
        })
    }
    
    const newReview = await Review.create({
        userId: reviewUser.id,
        spotId: parseInt(spotId),
        review,
        stars
    })

    res.json(newReview)
})
module.exports = router;
