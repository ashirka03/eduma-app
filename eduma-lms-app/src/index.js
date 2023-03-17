import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { Root } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import codePush from 'react-native-code-push';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import './config/translations';
import RootScreen from './screens/root';
import { configStore } from './store/index';
import { reset } from './actions/navigation';
import { setToken } from './api/config';
import { saveStatusNetwork } from './actions/network';
import { CODE_PUSH } from './config';
import { registerFCMToken } from './common/util/fcmToken';

const { store, persistor } = configStore();

export { store };
class MyApp extends Component {
  async componentDidMount() {
    try {
      const deploymentKey =
        Platform.OS === 'ios' ? CODE_PUSH.ios : CODE_PUSH.android;
      await codePush.sync({
        deploymentKey,
        installMode: codePush.InstallMode.IMMEDIATE,
      });
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    } catch (e) {
      console.log(e);
    }

    this.onNotification();
  }

  async onNotification() {
    // Request permissions (required for iOS)
    notifee.requestPermission();

    await registerFCMToken();

    // Background Event Listener
    notifee.onBackgroundEvent(async ({ detail }) => {
      const { notification } = detail;

      // TODO: Handle notification tap events
      await notifee.cancelNotification(notification.id);
    });

    messaging().onMessage((remoteMessage) => {
      this.onDisplayNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    messaging().setBackgroundMessageHandler((remoteMessage) => {
      this.onDisplayNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });
  }

  async onDisplayNotification(title, body) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
      },
    });
  }

  checkInternetConnection = async (state) => {
    try {
      await store.dispatch(saveStatusNetwork(state.isConnected));
    } catch (e) {
      console.log(e);
    }
  };

  onBeforeLift = async () => {
    NetInfo.addEventListener(this.checkInternetConnection);

    const { user } = store.getState();

    if (user?.token) {
      setToken(user?.token);
      store.dispatch(reset(['HomeTabScreen']));
    }
  };

  render() {
    return (
      <Root>
        <Provider store={store}>
          <PersistGate
            onBeforeLift={this.onBeforeLift}
            loading={null}
            persistor={persistor}
          >
            <StatusBar
              translucent
              backgroundColor="rgba(255,255,255,0.1)"
              barStyle="dark-content"
            />
            <RootScreen />
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}

const App = codePush(MyApp);
export default App;
