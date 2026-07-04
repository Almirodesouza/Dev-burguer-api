import Sequelize, { Model } from 'sequelize';

class Categories extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'categories',
      },
    );
  }
}

export default Categories;