'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemMaster = sequelize.define('ItemMaster', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  ItemMaster.associate = function(models) {
    this.hasMany(models.OrderItem, { foreignKey: 'itemId', onDelete: 'cascade' });
  };
  return ItemMaster;
};