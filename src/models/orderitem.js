'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    itemId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    orderId: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function(models) {
    this.belongsTo(models.Order, { foreignKey: 'orderId' });
    this.belongsTo(models.ItemMaster, { foreignKey: 'itemId' });
  };
  return OrderItem;
};