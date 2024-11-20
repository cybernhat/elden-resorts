const router = require("express").Router();
const { Spot, Review, SpotImage, ReviewImage, User, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize")
const dateTransformer = date => {
    let transformedDate = ``

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return transformedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

router.get("/", async (req, res, next) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;


    const errors = {};
    if (page !== undefined) {
        if (isNaN(page) || page < 1) {
            errors.page = "Page must be greater than or equal to 1";
        }
    }
    if (size !== undefined) {
        if (isNaN(size) || size < 1) {
            errors.size = "Size must be greater than or equal to 1";
        }
    }
    if (minLat !== undefined) {
        const minLatNum = parseFloat(minLat);
        if (isNaN(minLatNum) || minLatNum < -90 || minLatNum > 90) {
            errors.minLat = "Minimum latitude is invalid";
        }
    }
    if (maxLat !== undefined) {
        const maxLatNum = parseFloat(maxLat);
        if (isNaN(maxLatNum) || maxLatNum < -90 || maxLatNum > 90) {
            errors.maxLat = "Maximum latitude is invalid";
        }
    }
    if (minLng !== undefined) {
        const minLngNum = parseFloat(minLng);
        if (isNaN(minLngNum) || minLngNum < -180 || minLngNum > 180) {
            errors.minLng = "Minimum longitude is invalid";
        }
    }
    if (maxLng !== undefined) {
        const maxLngNum = parseFloat(maxLng);
        if (isNaN(maxLngNum) || maxLngNum < -180 || maxLngNum > 180) {
            errors.maxLng = "Maximum longitude is invalid";
        }
    }
    if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0)) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }


    const pageNum = page || 1;
    const pageSize = size || 20;

    const offset = (pageNum - 1) * pageSize;
    const limit = pageSize;

    const where = {};

    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

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
                duplicating: false,
                as: "previewImage"
            },
        ],
        group: ["Spot.id", "previewImage.id"],
        where,
        limit,
        offset
    });

    const flatten = spots.map(spot => {
        const jsonSpot = spot.toJSON();

        jsonSpot.createdAt = dateTransformer(jsonSpot.createdAt);
        jsonSpot.updatedAt = dateTransformer(jsonSpot.updatedAt);

        const hasImage = jsonSpot.previewImage[0]?.url;
        jsonSpot.previewImage = hasImage ? hasImage : "no images yet";

        delete jsonSpot.SpotImages;

        return jsonSpot;
    });

    res.json({
        Spots: flatten,
        page: pageNum,
        size: pageSize
    });
});

router.get("/current", requireAuth, async (req, res) => {
    const { user } = req;
    const Spots = await user.getSpots({
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

    const flatten = Spots.map((spot) => {
      const createdAt = dateTransformer(spot.createdAt);
      const updatedAt = dateTransformer(spot.updatedAt);

      let image

      if (spot.toJSON().previewImage[0]) {
        image = spot.toJSON().previewImage[0].url
      } else {
        image = 'no images yet'
      }
      return {
        ...spot.toJSON(),
        createdAt: createdAt,
        updatedAt: updatedAt,
        previewImage: image
      };
    });

    res.json({ Spots: flatten });
  });

router.get("/:spotId", async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
        ],
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

    const spotReviews = await Review.findAll({
        where: {
            spotId: spot.id
        }
    })
    const numReviews = Object.keys(spotReviews).length

    let total = 0;
    let num = 0;

    for (let review of spotReviews) {
        const star = review.dataValues.stars
        total += star;
        num += 1;
    }

    const avgRating = total / num;

    res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: dateTransformer(spot.createdAt),
        updatedAt: dateTransformer(spot.updatedAt),
        previewImages: spot.previewImage,
        Owner: spot.Owner,
        numReviews: numReviews || 'no reviews yet',
        avgRating: avgRating || 'no ratings yet'
    });
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
    if (parseInt(lat) < -90 || parseInt(lat) > 90) errors.lat = "Latitude must be within -90 and 90";
    if (parseInt(lng) < -180 || parseInt(lng) > 180) errors.lng = "Longitude must be within -180 and 180";
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

    res.status(201).json({
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: dateTransformer(newSpot.createdAt),
        updatedAt: dateTransformer(newSpot.updatedAt)
    })

});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    const { url, preview} = req.body;
    const { spotId } = req.params;
    const { user } = req

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found or does not exist" });
    }

    if (spot.ownerId !== user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }


    const newImage = await SpotImage.create({
        spotId: parseInt(spot.id),
        url,
        preview
    });

    res.json(newImage);
});

router.put("/:spotId", requireAuth, async (req, res, next) => {
    const { user } = req
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

    if (!spotToUpdate) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (spotToUpdate.ownerId !== user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    let errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is invalid";
    if (parseInt(lat) < -90 || parseInt(lat) > 90) errors.lat = "Latitude must be within -90 and 90";
    if (parseInt(lng) < -180 || parseInt(lng) > 180) errors.lng = "Longitude must be within -180 and 180";
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

    res.json({
        id: spotToUpdate.id,
        ownerId: spotToUpdate.ownerId,
        address: spotToUpdate.address,
        city: spotToUpdate.city,
        state: spotToUpdate.state,
        country: spotToUpdate.country,
        lat: spotToUpdate.lat,
        lng: spotToUpdate.lng,
        name: spotToUpdate.name,
        description: spotToUpdate.description,
        price: spotToUpdate.price,
        createdAt: dateTransformer(spotToUpdate.createdAt),
        updatedAt: dateTransformer(spotToUpdate.updatedAt)
    });
})


router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    const reviews = await Review.findAll({
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

    const updatedDate = reviews.map(review => {
        const jsonReview = review.toJSON();

        jsonReview.createdAt = dateTransformer(jsonReview.createdAt);
        jsonReview.updatedAt = dateTransformer(jsonReview.updatedAt);

        return {
            ...jsonReview
        }
    })
    res.json(updatedDate)
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

    res.status(201).json({
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: dateTransformer(newReview.createdAt),
        updatedAt: dateTransformer(newReview.updatedAt)
    })
})

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    let currentUser = req.user;
    let spotId = req.params.spotId;

    let spot = await Spot.findOne({
      where: { id: spotId }
    });

    if (!spot) {
      res.status(404);
      return res.json({ "message": "Spot could not be found" });
    }

    let bookings;
    if (spot.ownerId === currentUser.id) {
      bookings = await Booking.findAll({
        where: { spotId: spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"]
          }
        ]
      });
    } else {
      bookings = await Booking.findAll({
        where: { spotId: spotId },
        attributes: ["spotId", "startDate", "endDate"]
      });
    }

    bookings = bookings.map(booking => {
        const jsonBooking = booking.toJSON();
        jsonBooking.startDate = dateTransformer(jsonBooking.startDate)
        jsonBooking.endDate = dateTransformer(jsonBooking.endDate)
        return jsonBooking
    })

    res.status(200).json({ "Bookings": bookings})
  });

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
    let currentUser = req.user;
    let spotId = req.params.spotId;

    let spot = await Spot.findOne({
      where: { id: spotId }
    });

    let booking = await Booking.findAll({
      where: { spotId: spotId }
    });

    let { startDate, endDate } = req.body
    let currentDate = new Date();
    let errors = {};

    for (let key in booking) {
      if (new Date(booking[key].startDate) > new Date(startDate) &&
        new Date(booking[key].endDate) < new Date(endDate)) {
        errors.conflicts = "Start date and end date conflict with an existing booking"

      } else if (new Date(booking[key].startDate) <= new Date(startDate) &&
        new Date(booking[key].endDate) >= new Date(endDate)) {
        errors.conflicts = "Start date and end date conflict with an existing booking"

      } else if (new Date(startDate) >= new Date(booking[key].startDate) &&
        new Date(startDate) <= new Date(booking[key].endDate)) {
        errors.startDate = "Start date conflicts with an existing booking";

      } else if (new Date(endDate) >= new Date(booking[key].startDate) &&
        new Date(endDate) <= new Date(booking[key].endDate)) {
        errors.endDate = "End date conflicts with an existing booking";
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(403);
      return res.json({
        "message": "Sorry, this spot is already booked for the specified dates",
        errors
      });
    }

    if (!spot) {
      res.status(404);
      return res.json({ "message": "Spot could not be found" });

    } else if (spot.ownerId === currentUser.id) {
      res.status(403);
      return res.json({ "message": "You cannot book your own spot" });

    } else if (new Date(startDate) >= new Date(endDate)) {
      errors.endDate = "endDate cannot be on or before startDate";
      res.status(400);
      return res.json({
        "message": "Bad Request",
        errors
      });

    } else if (new Date(startDate) <= currentDate || new Date(endDate) <= currentDate) {
      errors.pastDates = "Cannot book past dates"
      res.status(400);
      return res.json({
        "message": "Bad Request",
        errors
      })

    } else {
      let createBooking = await Booking.create({
        spotId: +spotId, userId: currentUser.id, startDate, endDate
      });
      res.status(200);
      return res.json({
        id: createBooking.id,
        spotId: createBooking.spotId,
        userId: createBooking.userId,
        startDate: dateTransformer(createBooking.startDate),
        endDate: dateTransformer(createBooking.endDate),
        createdAt: dateTransformer(createBooking.createdAt),
        updatedAt: dateTransformer(createBooking.updatedAt)
      });
    }
  });

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req
    const { spotId } = req.params;

    const spotToDestroy = await Spot.findByPk(spotId);

    if (!spotToDestroy) {
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    if (spotToDestroy.ownerId !== user.id) {
        return res.status(403).json({ message: "Forbidden"});
    }


    await spotToDestroy.destroy()

    res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;
