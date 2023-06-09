import { reducer as formReducer } from 'redux-form';
import { debug } from './debug';
import { navState } from './navigation';
import user from './user';
import common from './common';
import network from './network';
import course from './course';
import wishlist from './wishlist';
import productIAP from './product-iap';

const rootReducer = {
  form: formReducer,
  user,
  debug,
  navState,
  common,
  network,
  course,
  wishlist,
  productIAP,
};

export default rootReducer;
