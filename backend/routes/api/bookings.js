const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize } = require('../../db/models');
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

router.get("/current", requireAuth, async (req, res, next) => {
    const { user } = req;
    const Bookings = await Booking.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
          include: [
            {
              model: SpotImage,
              attributes: ["url"],
              where: { preview: true },
              required: false,
              as: "previewImage",
            },
          ],
        },
      ],
    });
    if (!Booking) {
      return res
        .status(404)
        .json({ message: "You don't have any upcoming bookings." });
    }
    const formattedBookings = Bookings.map((booking) => {
      const bookingJson = booking.toJSON();
      if (bookingJson.Spot) {
        const spotJson = bookingJson.Spot;
        let previewImage = null;
        if (spotJson.SpotImages && spotJson.SpotImages.length > 0) {
          previewImage = spotJson.SpotImages[0].url;
        }
        bookingJson.Spot = { ...spotJson, previewImage: previewImage };
        delete bookingJson.Spot.SpotImages;
      }

      bookingJson.startDate = dateTransformer(bookingJson.startDate);
      bookingJson.endDate = dateTransformer(bookingJson.endDate);
      bookingJson.createdAt = dateTransformer(bookingJson.createdAt);
      bookingJson.updatedAt = dateTransformer(bookingJson.updatedAt)

      return bookingJson;
    });

    res.status(200).json(formattedBookings);
  });

router.put('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req

  const booking = await Booking.findByPk(bookingId)

  if (!booking) {
    res.status(404)
    return res.json({
      message: "Booking couldn't be found"
    })
  };

  if (booking.userId !== user.id) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  const currDate = new Date();
  let reqStartDate = new Date(startDate);
  let reqEndDate = new Date(endDate);

  if (booking.startDate <= currDate || booking.endDate <= currDate) {
    res.status(403)
    res.json({
      message: "Forbidden"
    })
  }

  if (reqStartDate < currDate) {
    res.status(400)
    res.json({
      message: "startDate cannot be in the past"
    })
  }

  if (reqStartDate > reqEndDate) {
    res.status(400)
    res.json({
      message: "endDate cannot be earlier than startDate"
    })
  }

  const conflict = await Booking.findAll({
    where: {
      spotId: booking.spotId, // limit to booking.SpotId
      id: {
        [Op.ne]: bookingId // exclude current booking
      },
        [Op.or]: [
        {
          startDate: {
            [Op.between]: [reqStartDate, reqEndDate]
          }
        },
        {
          endDate: {
            [Op.between]: [reqStartDate, reqEndDate]
          }
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lte]: [reqStartDate]
              }
            },
            {
              endDate: {
                [Op.gte]: [reqEndDate]
              }
            }
          ]
        },
        {
          endDate: {
            [Op.eq]: [reqStartDate]
          }
        }]
    }
  })

  if (conflict.length > 0) {
    res.status(403)
    res.json({
      message: "Forbidden"
    })
  }


  // if (booking.userId !== user.id) {
  //   if (new Date(startDate) >= new Date(booking.startDate) &&
  //       new Date(startDate) <= new Date(booking.endDate)) {
  //         bookingErrors.startDate = "Start date conflicts with an existing booking";
  //   }
  //   if (new Date(endDate) >= new Date(booking.startDate) &&
  //       new Date(endDate) <= new Date(booking.endDate)) {
  //         bookingErrors.endDate = "End date conflicts with an existing booking";
  //     }
  //   }
  // if (new Date() > new Date(booking.endDate)) {
  //     res.status(403);
  //     return res.json({
  //         message: "Past bookings can't be modified"
  //       })
  // }

  // if (Object.keys(bookingErrors).length > 0) {
  //    res.status(403);
  //    return res.json({
  //      "message": "Sorry, this spot is already booked for the specified dates",
  //      bookingErrors
  //     });
  //   }

    // booking.startDate = startDate || booking.startDate;
    // booking.endDate = endDate || booking.endDate;

    // await booking.save();

    // const dateErrors = {};
    // if (new Date(startDate) < currDate) dateErrors.startDate = "startDate cannot be in the past"
    // if (new Date(endDate) <= new Date(startDate)) dateErrors.endDate = "endDate cannot be on or before startDate"

    //   if (Object.keys(dateErrors).length > 0) {
    //       res.status(400);
    //       return res.json({
    //           message: "Bad Request",
    //           dateErrors
    //       })
    //    }
  const updatedBooking = await booking.update({
    startDate,
    endDate
  })
  res.json({
    updatedBooking
    // id: booking.id,
    // spotId: booking.spotId,
    // userId: booking.userId,
    // startDate: dateTransformer(booking.startDate),
    // endDate: dateTransformer(booking.endDate),
    // createdAt: dateTransformer(booking.createdAt),
    // updatedAt: dateTransformer(booking.updatedAt)
  });
})


router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { currDate } = new Date();
  const { user } = req
  const booking = await Booking.findByPk(bookingId)

  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }

  if (booking.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  };


  if (new Date(booking.startDate) >= currDate && new Date(booking.endDate) < currDate) {
    res.status(403);
    return res.json({
      message: "Bookings that have been started can't be deleted"
    })
  }

  await booking.destroy();

  res.json({
    message: "Successfully deleted"
  })
})



module.exports = router;
