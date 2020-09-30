import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import UserService from '../services/user.service';
import Util from '../utils/utils';
import { encryptPassword } from '../utils/encrypt';

const util = new Util();

const correctPassword = (
  enteredPassword: string,
  salt: string,
  hashedPass: string,
) => {
  return encryptPassword(enteredPassword, salt) === hashedPass;
};

const jwtToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const protect = async (req: any, res: any, next: any) => {
  const authorization: string = req.headers.authorization;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    util.setError(401, 'Please, log in to get access.');
    return util.send(res);
  }

  try {
    const decoded: any = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET as string,
    );
    const user = await UserService.getUser(decoded.id);
    if (!user) {
      util.setError(401, 'Invalid credentials.');
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(401, error);
    return util.send(res);
  }
};

class AuthController {
  static async login(req: any, res: any) {
    const { email, password } = req.body;
    if (!email || !password) {
      util.setError(400, 'Incomplete info.');
      return util.send(res);
    }

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
        const token = jwtToken(user.dataValues.id);
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
