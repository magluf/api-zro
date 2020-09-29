import { Model } from 'sequelize';
import crypto from 'crypto';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('password');
        },
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

  const generateSalt = () => {
    return crypto.randomBytes(16).toString('base64');
  };

  const encryptPassword = (plainText, salt) => {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  };

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = generateSalt();
      user.password = encryptPassword(user.password(), user.salt());
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  return User;
};
