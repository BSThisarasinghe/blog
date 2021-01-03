'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // setRelationShip(models){
    //   models.comments.belongsTo(models.posts);
    // }

    static associate(models) {
      // define association here
      models.comments.belongsTo(models.posts);
    }
  };
  comments.init({
    comment: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};