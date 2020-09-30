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

  const updateSaltAndPassword = (user) => {
    if (user.fields.includes('password')) {
      user.fields.push('salt');
      const newSalt = generateSalt();
      user.attributes = {
        ...user.attributes,
        salt: newSalt,
      };
      user.attributes.password = encryptPassword(
        user.attributes.password,
        newSalt,
      );
    }
  };

  const correctPassword = (enteredPassword) => {
    return (
      encryptPassword(enteredPassword, 'NYEEuXjXLXyC2JHCUuoIJg==') ===
      '509de533d24447c67c2dfe421813ac4e39504ee98add94ee189c385a6be28ef7'
    );
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeBulkUpdate(updateSaltAndPassword);

  return User;
};
