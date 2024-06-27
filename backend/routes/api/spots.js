const router = require("express").Router();
const { Spot, Review, SpotImage, ReviewImage, User, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get("/", async (req, res, next) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    const pageNum = parseInt(page);
    const pageSize = parseInt(size);

    const offset = (pageNum - 1) * pageSize;
    const limit = pageSize;

    const errors = {};
    if (isNaN(pageNum) || pageNum < 1) {
        errors.page = "Page must be greater than or equal to 1";
    }
    if (isNaN(pageSize) || pageSize < 1) {
        errors.size = "Size must be greater than or equal to 1";
    }
    if (minLat !== undefined && isNaN(parseInt(minLat))) {
        errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLat !== undefined && isNaN(parseInt(maxLat))) {
        errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLng !== undefined && isNaN(parseInt(minLng))) {
        errors.minLng = "Minimum longitude is invalid";
    }
    if (maxLng !== undefined && isNaN(parseInt(maxLng))) {
        errors.maxLng = "Maximum longitude is invalid";
    }
    if (minPrice !== undefined && (isNaN(parseInt(minPrice)) || parseInt(minPrice) < 0)) {
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (maxPrice !== undefined && (isNaN(parse(maxPrice)) || parseInt(maxPrice) < 0)) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    const where = {};

    if (minLat) where.lat = { [Op.gte]: parseInt(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseInt(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseInt(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseInt(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseInt(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseInt(maxPrice) };

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
          duplicating: false
        },
        {
          model: SpotImage,
          attributes: ["url"],
          where: { preview: true },
          required: false,
          as: "previewImage",
          duplicating: false
        },
    ],
        group: ["Spot.id", "previewImage.id"],
        where,
        limit,
        offset
    });


    const flatten = spots.map(spot => {
        return {
            ...spot.toJSON(),
            previewImage: spot.toJSON().previewImage[0]?.url
        }
    })

    res.json({
        Spots: flatten,
        page: page,
        size: size
     });
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

    res.status(201).json(newSpot)

});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    const { url, preview} = req.body;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const newImage = await SpotImage.create({
        spotId: parseInt(spot.id),
        url,
        preview
    });

    res.json(newImage);
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


router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({
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

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const existingReview = await Review.findOne({
        where: {
            userId: user.id,
            spotId
        }
    })

    if (existingReview) {
        return res.status(500).json({
            message: "User already has a review for this spot"
        })
    }

    const newReview = await Review.create({
        userId: parseInt(user.id),
        spotId: parseInt(spotId),
        review,
        stars
    })

    res.status(201).json(newReview)
})

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== user.id) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        res.json(bookings);
    } else if (spot.ownerId === user.id) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ],
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
        })

        res.json({
            Bookings: bookings
        })
    }
})

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const { user } = req;
    const currDate = new Date();

    const spot = await Spot.findAll({
        where: {
            id: spotId
        }
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    // error 400 date conflicts
    const booking = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    let bookingErrors = {};

    for (let key in booking) {
        if (new Date(startDate) >= new Date(booking[key].startDate) &&
            new Date(startDate) <= new Date(booking[key].endDate)) {
                bookingErrors.startDate = "Start date conflicts with an existing booking";

        }
        if (new Date(endDate) >= new Date(booking[key].startDate) &&
        new Date(endDate) <= new Date(booking[key].endDate)) {
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
    }

    if (Object.keys(bookingErrors).length > 0) {
        res.status(403);
        return res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            bookingErrors
        });
    }

    const dateErrors = {};
    if (new Date(startDate) < currDate) dateErrors.startDate = "startDate cannot be in the past"
    if (new Date(endDate) <= startDate) dateErrors.endDate = "endDate cannot be on or before startDate"

    if (Object.keys(dateErrors).length > 0) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            dateErrors
        })
    }

    // make new booking
    const newBooking = await Booking.create({
        spotId: spotId,
        userId: user.id,
        startDate,
        endDate

    });

    res.json(newBooking)
});

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

module.exports = router;