import React from 'react';
import { StyleSheet, View, Text,TextInput } from 'react-native';
import Register from './components/Register';
import Home from './components/Home';
import Error from './components/Error';
import Transfer from './components/Transfer';
import SearchRec from './components/SearchRec';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { StyleSheet } from 'react-native';
import Login from './components/Login';
import OTP  from './components/OTP'

// import RegisterScreen from './components/Register';
const Stack = createStackNavigator();
export default function App() {
  return (
    // <View style={styles.container}>
    //    <Register />
    // </View>

    // ...

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Register"
          component={Register}
          // options={{ title: 'Register' }}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{ title: 'Enter OTP', headerShown:true }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="SearchRec"
          component={SearchRec}
          options={{ title: 'Rudi' }}
        />
        <Stack.Screen
          name="Transfer"
          component={Transfer}
          options={{ title: 'Send Money..' }}
        />
       
        <Stack.Screen
          name="Error"
          component={Error}
          options={{ title: 'Opps..' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%', // Adjust card width as needed
    padding: 20 ,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
});
