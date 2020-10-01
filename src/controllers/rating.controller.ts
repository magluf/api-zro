import LocationService from '../services/location.service';
import RatingService from '../services/rating.service';
import Util from '../utils/utils';
import { decodeJwt } from './auth.controller';

const util = new Util();

class RatingController {
  static async createRating(req: any, res: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    const { locationId } = req.params;
    const userId = (await decodeJwt(token)).id;

    const location = await LocationService.getLocation(locationId);

    if (!location) {
      util.setError(400, 'Location not found.');
      return util.send(res);
    }

    if (req.body.rating === undefined) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }

    const newRating = {
      userId,
      locationId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    try {
      const createdRating = await RatingService.createRating(newRating);
      util.setSuccess(201, 'Rating Added!', createdRating);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getRatingsByLocation(req: any, res: any) {
    const { locationId } = req.params;

    const location = await LocationService.getLocation(locationId);

    if (!location) {
      util.setError(400, 'Location not found.');
      return util.send(res);
    }

    try {
      const allRatings = await RatingService.getRatingsByLocation(locationId);
      if (allRatings.length > 0) {
        util.setSuccess(200, 'Ratings retrieved.', allRatings);
      } else {
        util.setSuccess(200, 'No ratings found.');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default RatingController;
