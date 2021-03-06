import database from '../models/index';

class UserService {
  static async createUser(newUser) {
    try {
      return await database.User.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return await database.User.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getUser(id) {
    try {
      const user = await database.User.findOne({
        where: { id: Number(id) },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await database.User.findOne({
        where: { email: String(email) },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      const userToUpdate = await database.User.findOne({
        where: { id: Number(id) },
      });

      if (userToUpdate) {
        await database.User.update(updatedUser, { where: { id: Number(id) } });

        return updatedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const userToDelete = await database.User.findOne({
        where: { id: Number(id) },
      });

      if (userToDelete) {
        const deletedUser = await database.User.destroy({
          where: { id: Number(id) },
        });
        return deletedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
