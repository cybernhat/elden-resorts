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

  router.put("/:bookingId", requireAuth, async (req, res) => {
    let currentUser = req.user;
    let bookingId = req.params.bookingId;

    let existingBooking = await Booking.findByPk(bookingId);
    if (!existingBooking) {
      res.status(404);
      return res.json({ "message": "Booking could not be found " });

    } else if (currentUser.id !== existingBooking.userId) {
      res.status(403);
      return res.json({ "message": "Forbidden" });

    } else {
      existingBooking = await Booking.findOne({
        where: {
          id: bookingId,
          userId: currentUser.id
        }
      });

      let allBookings = await Booking.findAll({
        where: { spotId: existingBooking.spotId }
      });

      let { startDate, endDate } = req.body;
      let currentDate = new Date();
      let errors = {};

      for (let booking of allBookings) {
        if (booking.id !== existingBooking.id) {
          if (new Date(booking.startDate) > new Date(startDate) &&
            new Date(booking.endDate) < new Date(endDate)) {
            errors.conflicts = "Start date and end date conflict with an existing booking";
          }

          if (new Date(booking.startDate) <= new Date(startDate) &&
            new Date(booking.endDate) >= new Date(endDate)) {
            errors.conflicts = "Start date and end date conflict with an existing booking";
          }

          if (new Date(startDate) >= new Date(booking.startDate) &&
            new Date(startDate) <= new Date(booking.endDate)) {
            errors.startDate = "Start date conflicts with an existing booking";

          } if (new Date(endDate) >= new Date(booking.startDate) &&
            new Date(endDate) <= new Date(booking.endDate)) {
            errors.endDate = "End date conflicts with an existing booking";
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        res.status(403);
        return res.json({
          "message": "Sorry, this spot is already booked for the specified dates",
          errors
        });
      }

      if (new Date(startDate) >= new Date(endDate)) {
        res.status(400);
        return res.json({ "message": "endDate cannot be on or before startDate" })
      }

      if (new Date(existingBooking.endDate) <= currentDate) {
        res.status(403);
        return res.json({ "message": "Past bookings can't be modified" });
      }


      if (new Date(startDate) <= currentDate || new Date(endDate) <= currentDate) {
        res.status(400);
        return res.json({ "message": "Cannot book past dates" });
      }

      existingBooking.startDate = startDate;
      existingBooking.endDate = endDate;

      await existingBooking.save();

      res.status(200);
      return res.json({
        id: existingBooking.id,
        spotId: existingBooking.spotId,
        userId: existingBooking.userId,
        startDate: dateTransformer(existingBooking.startDate),
        endDate: dateTransformer(existingBooking.endDate),
        createdAt: dateTransformer(existingBooking.createdAt),
        updatedAt: dateTransformer(existingBooking.updatedAt)
      });
    }
  });

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
