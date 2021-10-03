'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class County extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  County.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    code: DataTypes.INTEGER,
    address: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    region: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'County',
  });
  return County;
};