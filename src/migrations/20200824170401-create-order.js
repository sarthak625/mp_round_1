'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};

// this.hasMany(models.UserPermissions, { foreignKey: 'userId', onDelete: 'cascade' });
    // this.hasMany(models.UserGroups, { foreignKey: 'userId', onDelete: 'cascade' });
    // this.hasMany(models.Attachment, { foreignKey: 'userId', onDelete: 'cascade' });
    // this.hasMany(models.UserTypes, { foreignKey: 'userId', onDelete: 'cascade' });