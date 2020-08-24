const {
  ItemMaster,
  Order,
  OrderItem,
} = require('../models/index');

async function getItem(id) {
  return ItemMaster.findOne({
    where: {
      id,
    },
  });
}

async function getOrderInformation(id) {
  return Order.findOne({
    where: {
      id,
    },
    include: [
      {
        model: OrderItem, 
        include: [
          ItemMaster,
        ],
      },
    ]
  });
}

module.exports = {
  getItem,
  getOrderInformation,
};
