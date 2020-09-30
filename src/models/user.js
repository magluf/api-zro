import { Model } from 'sequelize';
import { encryptPassword, generateSalt } from '../utils/encrypt';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue('password');
        },
      },
      passwordChangedAt: {
        type: DataTypes.BIGINT,
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('salt');
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = generateSalt();
      user.password = encryptPassword(user.password(), user.salt());
    }
  };

  const updateSaltAndPassword = (user) => {
    if (user.fields.includes('password')) {
      user.fields.push('salt');
      user.fields.push('passwordChangedAt');
      const newSalt = generateSalt();
      const now = Date.now();
      user.attributes = {
        ...user.attributes,
        salt: newSalt,
        passwordChangedAt: now,
      };
      user.attributes.password = encryptPassword(
        user.attributes.password,
        newSalt,
      );
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeBulkUpdate(updateSaltAndPassword);

  return User;
};
