// import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginView from './Login';
import RegisterView from './Register';
import { Image } from 'react-native';
import { Provider } from 'react-redux';
import store from './js/store/index';
import Home from './Home';
import Timeline from './Timeline';
import Categories from './Categories';
import Upload from './Upload';
import SinglePost from './SinglePost';
import ChangePassword from './ChangePassword';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: "#03fcec" },
            headerTintColor: "#f5882a",
            headerTitleStyle: {
              fontWeight: "bold"
            }
          }
          }>
          <Stack.Screen name="Login" component={LoginView} options={{ headerTitle: props => <Image source={require('./images/logo.png')} /> }} />
          <Stack.Screen name="Register" component={RegisterView} options={{ headerTitle: props => <Image source={require('./images/logo.png')} /> }} />
          <Stack.Screen name="Home" component={Home} options={{headerLeft: null}}/>
          <Stack.Screen name="Timeline" component={Timeline} options={{headerLeft: null}}/>
          <Stack.Screen name="Categories" component={Categories} options={{headerLeft: null}}/>
          <Stack.Screen name="Upload" component={Upload}/>
          <Stack.Screen name="Your_Post" component={SinglePost} />
          <Stack.Screen name="Change Password" component={ChangePassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App;