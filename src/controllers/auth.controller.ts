import jwt from 'jsonwebtoken';
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
    const { email, password } = req.body;
    if (!email || !password) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }

    const token = 'asfasf';
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        util.setError(404, 'User not found');
        return util.send(res);
      }

      if (
        correctPassword(
          password,
          user.dataValues.salt,
          user.dataValues.password,
        )
      ) {
        util.setSuccess(201, 'User logged in!', { token });
        return util.send(res);
      } else {
        util.setError(401, 'Credentials invalid.');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default AuthController;
