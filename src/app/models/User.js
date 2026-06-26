import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    // biome-ignore lint/complexity/noThisInStatic: Sequelize pattern
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'User',
      },
    );
  }
}

export default User;