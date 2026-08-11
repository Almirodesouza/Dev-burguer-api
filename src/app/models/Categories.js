import Sequelize, { Model } from 'sequelize';

class Categories extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/categories-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        modelName: 'categories',
      },
    );

    return this;
  }
}

export default Categories;
