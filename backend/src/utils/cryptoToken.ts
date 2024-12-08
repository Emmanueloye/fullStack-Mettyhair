import crypto from 'crypto';

export const createCryptoToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashCryptoToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

type TokenOptions = 'plain' | 'hash';
type Token = {
  type?: TokenOptions;
  token?: string;
};

// To generate both plain and hashed token, call the function with empty object like this: generateToken({})
const generateToken = ({ type, token }: Token) => {
  if (type === 'plain') {
    return createCryptoToken();
  }
  if (type === 'hash' && token) {
    return hashCryptoToken(token);
  }

  const newToken: string = createCryptoToken();
  const newHashedToken: string = hashCryptoToken(newToken);
  return [newToken, newHashedToken];
};

export default generateToken;
