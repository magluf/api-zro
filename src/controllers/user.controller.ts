import UserService from '../services/user.service';
import Util from '../utils/utils';

const util = new Util();

class UserController {
  static async createUser(req: any, res: any) {
    if (!req.body.email || !req.body.password) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }
    const newUser = {
      email: req.body.email,
      password: req.body.password,
    };
    try {
      const createdUser = await UserService.createUser(newUser);
      util.setSuccess(201, 'User Added!', createdUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getUser(req: any, res: any) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value for the id.');
      return util.send(res);
    }

    try {
      const user = await UserService.getUser(id);

      if (!user) {
        util.setError(404, `Cannot find user with id ${id}.`);
      } else {
        util.setSuccess(200, 'User found.', user);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getAllUsers(req: any, res: any) {
    try {
      const allUsers = await UserService.getAllUsers();
      if (allUsers.length > 0) {
        util.setSuccess(200, 'Users retrieved.', allUsers);
      } else {
        util.setSuccess(200, 'No users found.');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updatedUser(req: any, res: any) {
    const newUser = req.body;
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value for the id.');
      return util.send(res);
    }
    try {
      const updateUser = await UserService.updateUser(id, newUser);
      if (!updateUser) {
        util.setError(404, `Cannot find user with the id: ${id}`);
      } else {
        delete updateUser.password;
        util.setSuccess(200, 'User updated', updateUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteUser(req: any, res: any) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value.');
      return util.send(res);
    }

    try {
      const userToDelete = await UserService.deleteUser(id);

      if (userToDelete) {
        util.setSuccess(200, 'User deleted.');
      } else {
        util.setError(404, `User with id ${id} cannot be found.`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default UserController;
