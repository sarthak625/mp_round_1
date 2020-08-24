'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    date: DataTypes.DATE,
    description: DataTypes.STRING
  }, {});

  Order.associate = function(models) {
    this.hasMany(models.OrderItem, { foreignKey: 'orderId', onDelete: 'cascade' });
  };

  return Order;
};