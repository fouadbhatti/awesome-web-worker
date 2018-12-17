import path from 'path';

const env = process.env;
export const nodeEnv = env.NODE_ENV || 'development';

const config =  {
  development: {
    port: env.PORT || 8080,
    root: path.normalize(__dirname + '/..'),
  },
  production: {}
};

export default config[nodeEnv];
