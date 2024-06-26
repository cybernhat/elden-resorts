const router = require("express").Router();
const { Booking, Spot, User, Review, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
      return bookingJson;
    });

    res.status(200).json(formattedBookings);
  });
module.exports = router;
