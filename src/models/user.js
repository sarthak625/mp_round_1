'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
      set: function(val) {
        if (val) {
          const salt = bcrypt.genSaltSync(10);
          const hashedValue = bcrypt.hashSync(val, salt);
          this.setDataValue('password', hashedValue);
        }
      },
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    userName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: DataTypes.DATE,
  }, {
    indexes: [
      {
        unique: true,
        fields: ['password'],
      },
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['userName'],
      },
    ],
  });


  User.associate = function(models) {
  };

  User.comparePassword = function(password, original) {
    if (password && original) {
      return bcrypt.compareSync(password, original);
    } else {
      return false;
    }
  };

  return User;
};
