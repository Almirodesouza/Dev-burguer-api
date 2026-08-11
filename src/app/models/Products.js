import Sequelize, { Model } from 'sequelize';

class Products extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/products-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        modelName: 'Products',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.categories,{
      foreignKey: 'category_id',
      as: 'category'
    })
  }

}

export default Products;
