import UserService from '../services/user.service';
import Util from '../utils/utils';
import { encryptPassword } from '../utils/encrypt';

const util = new Util();

export const correctPassword = (
  enteredPassword: string,
  salt: string,
  hashedPass: string,
) => {
  return encryptPassword(enteredPassword, salt) === hashedPass;
};

class AuthController {
  static async login(req: any, res: any) {
    if (!req.body.email || !req.body.password) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }
    const newUser = req.body;
    try {
      const createdUser = await UserService.createUser(newUser);
      util.setSuccess(201, 'User Added!', createdUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default AuthController;
