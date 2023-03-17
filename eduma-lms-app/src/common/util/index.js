import {
  ConvertToDateTime,
  ConvertToDay,
  ConvertToHour,
  formatDateNow,
  ConvertToDate,
  secondsToHms,
} from './datetime';
import { ValidateEmail, isURL, isVideo } from './validate';

import {
  ifIphoneX,
  getStatusBarHeight,
  isIphoneX,
  getBottomSpace,
} from './deviceInfo';
import { tronLog } from './log';

import { deleteFCMToken, registerFCMToken } from './fcmToken';

export {
  // datetime
  ConvertToDateTime,
  ConvertToDay,
  ConvertToHour,
  formatDateNow,
  ConvertToDate,
  secondsToHms,
  //
  ValidateEmail,
  isURL,
  isVideo,
  ifIphoneX,
  getStatusBarHeight,
  isIphoneX,
  getBottomSpace,
  //
  tronLog,
  deleteFCMToken,
  registerFCMToken,
};
