import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/navigation';
import {LogBox} from 'react-native';
import {AuthProvider} from './context/AuthContext';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ContactManagementApp: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default ContactManagementApp;
