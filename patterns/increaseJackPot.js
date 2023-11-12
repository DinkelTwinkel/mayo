const Point = require("../models/points");

module.exports = async (amount) => {

  const mayoBotPoints = await Point.findOne({ userId: '1171936614965067866' });
  mayoBotPoints.points += Math.ceil(amount/2);
  await mayoBotPoints.save();

};