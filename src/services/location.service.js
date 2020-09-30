import database from '../models/index';

class LocationService {
  static async createLocation(newLocation) {
    try {
      return await database.Location.create(newLocation);
    } catch (error) {
      throw error;
    }
  }

  static async getAllLocations() {
    try {
      return await database.Location.findAll({
        order: [['name', 'ASC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getLocation(id) {
    try {
      const location = await database.Location.findOne({
        where: { id: Number(id) },
      });
      return location;
    } catch (error) {
      throw error;
    }
  }

  static async updateLocation(id, updatedLocation) {
    try {
      const locationToUpdate = await database.Location.findOne({
        where: { id: Number(id) },
      });

      if (locationToUpdate) {
        await database.Location.update(updatedLocation, {
          where: { id: Number(id) },
        });

        return updatedLocation;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteLocation(id) {
    try {
      const locationToDelete = await database.Location.findOne({
        where: { id: Number(id) },
      });

      if (locationToDelete) {
        const deletedLocation = await database.Location.destroy({
          where: { id: Number(id) },
        });
        return deletedLocation;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default LocationService;
