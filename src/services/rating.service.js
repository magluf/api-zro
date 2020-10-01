import database from '../models/index';

class RatingService {
  static async createRating(newRating) {
    try {
      return await database.Rating.create(newRating);
    } catch (error) {
      throw error;
    }
  }

  static async getRatingsByLocation(locationId) {
    try {
      return await database.Rating.findAll({
        where: { locationId: Number(locationId) },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default RatingService;
