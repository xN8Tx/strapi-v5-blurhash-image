/**
 * Application methods
 */
import bootstrap from './bootstrap';
import config from './config';
import middlewares from './middlewares';
import register from './register';

/**
 * Plugin server methods
 */
import services from './services';

export default {
  middlewares,
  register,
  bootstrap,
  services,
  config,
};
