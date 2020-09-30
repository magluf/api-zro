import NodeGeocoder from 'node-geocoder';
import geoip from 'geoip-lite';
import LocationService from '../services/location.service';
import Util from '../utils/utils';
import { decodeJwt } from './auth.controller';

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GCP_API_KEY,
});

const util = new Util();

const findLocation = async (
  body: { name: string; address: string },
  userId: number,
) => {
  const geoLocation = await geocoder.geocode(`${body.name} ${body.address}`);
  let foundLocation;
  let location;
  if (geoLocation.length > 1) {
    if (geoLocation.length > 5) {
      return undefined;
    }
    const maxConfidenceLocation = Math.max.apply(
      Math,
      geoLocation.map(function (el) {
        return el.extra?.confidence as number;
      }),
    );

    foundLocation = geoLocation.find(
      (el) => el.extra?.confidence === maxConfidenceLocation,
    );
  } else {
    foundLocation = geoLocation[0];
  }

  if (foundLocation) {
    location = {
      userId,
      name: body.name,
      latitude: foundLocation.latitude,
      longitude: foundLocation.longitude,
      country: foundLocation.country,
      countryCode: foundLocation.countryCode,
      city: foundLocation.city
        ? foundLocation.city
        : foundLocation.administrativeLevels?.level2long,
      zipcode: foundLocation.zipcode,
      streetName: foundLocation.streetName,
      streetNumber: foundLocation.streetNumber,
    };
  }

  return location;
};

const getLocationByIp = (req: any) => {
  const env = process.env.NODE_ENV || 'development';

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const location = geoip.lookup(env === 'development' ? '187.115.154.78' : ip);

  return { latitude: location?.ll[0], longitude: location?.ll[1] };
};

const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 1.609344;

    return dist;
  }
};

const sortByDistance = (
  locations: any,
  userLocation: { latitude: number; longitude: number },
) => {
  const arrayToSort = [...locations];
  arrayToSort.sort((locationA: any, locationB: any) => {
    return distance(
      locationA.dataValues.latitude,
      locationA.dataValues.longitude,
      userLocation.latitude as number,
      userLocation.longitude as number,
    ) <
      distance(
        locationB.dataValues.latitude,
        locationB.dataValues.longitude,
        userLocation.latitude as number,
        userLocation.longitude as number,
      )
      ? 1
      : -1;
  });
};

class LocationController {
  static async createLocation(req: any, res: any) {
    const token: string = req.headers.authorization.split(' ')[1];

    const userId = (await decodeJwt(token)).id;
    if (!req.body.address || !req.body.name) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }

    const newLocation = await findLocation(req.body, userId);

    if (!newLocation) {
      util.setError(
        400,
        'Please, add more specificity to the submitted address.',
      );
      return util.send(res);
    }

    try {
      const createdLocation = await LocationService.createLocation(newLocation);
      util.setSuccess(201, 'Location Added!', createdLocation);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getLocation(req: any, res: any) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value for the id.');
      return util.send(res);
    }

    try {
      const location = await LocationService.getLocation(id);

      if (!location) {
        util.setError(404, `Cannot find location with id ${id}.`);
      } else {
        util.setSuccess(200, 'Location found.', location);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getAllLocations(req: any, res: any) {
    const { type } = req.params;

    const allLocations = await LocationService.getAllLocations();
    try {
      if (type === 'map') {
        const reqLocation = getLocationByIp(req);

        if (!reqLocation.latitude || !reqLocation.longitude) {
          util.setSuccess(
            200,
            'Could not pinpoint user location. Returning list ordered alphabetically',
            allLocations,
          );
          return util.send(res);
        }

        allLocations.sort((locationA: any, locationB: any) => {
          return distance(
            locationA.dataValues.latitude,
            locationA.dataValues.longitude,
            reqLocation.latitude as number,
            reqLocation.longitude as number,
          ) <
            distance(
              locationB.dataValues.latitude,
              locationB.dataValues.longitude,
              reqLocation.latitude as number,
              reqLocation.longitude as number,
            )
            ? -1
            : 1;
        });
      }

      if (allLocations.length > 0) {
        util.setSuccess(200, 'Locations retrieved.', allLocations);
      } else {
        util.setSuccess(200, 'No locations found.');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updatedLocation(req: any, res: any) {
    const newLocation = req.body;
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value for the id.');
      return util.send(res);
    }
    try {
      const updateLocation = await LocationService.updateLocation(
        id,
        newLocation,
      );
      if (!updateLocation) {
        util.setError(404, `Cannot find location with the id: ${id}`);
      } else {
        delete updateLocation.password;
        util.setSuccess(200, 'Location updated', updateLocation);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteLocation(req: any, res: any) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value.');
      return util.send(res);
    }

    try {
      const locationToDelete = await LocationService.deleteLocation(id);

      if (locationToDelete) {
        util.setSuccess(200, 'Location deleted.');
      } else {
        util.setError(404, `Location with id ${id} cannot be found.`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default LocationController;
