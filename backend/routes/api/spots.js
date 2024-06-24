const router = require("express").Router();
const { Spot, Sequelize } = require('../../db/models');
const { Review } = require('../../db/models');

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
        // {
        //   model: SpotImage,
        //   attributes: ["url"],
        //   where: { preview: true },
        //   required: false,
        //   as: "previewImage",
        // },
      ],
      group: ["Spot.id", "previewImage.id"],
    });
    res.json({ ...spots });
  });
module.exports = router;
