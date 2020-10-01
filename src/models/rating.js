import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // define association here
    }
  }
  Rating.init(
    {
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: DataTypes.STRING,
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Rating',
    },
  );
  return Rating;
};
