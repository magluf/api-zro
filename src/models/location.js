'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      // define association here
    }
  }
  Location.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
      country: {
        type: DataTypes.STRING,
      },
      countryCode: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      zipcode: {
        type: DataTypes.STRING,
      },
      streetName: {
        type: DataTypes.STRING,
      },
      streetNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Location',
    },
  );
  return Location;
};
