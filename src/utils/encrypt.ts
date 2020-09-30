import crypto from 'crypto';

export const generateSalt = () => {
  return crypto.randomBytes(16).toString('base64');
};

export const encryptPassword = (plainText: string, salt: string) => {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};
