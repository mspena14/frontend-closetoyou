import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigationTypes';
import ContactListScreen from '../screens/contactList/ContactListScreen';
import AddEditContactScreen from '../screens/addEditContact/AddEditContactScreen';
import ContactDetailScreen from '../screens/contactDetails/ContactDetailsScreen';
import MapScreen from '../screens/mapScreen/MapScreen';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import RegisterScreen from '../screens/registerScreen/RegisterScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen
            name="ContactList"
            component={ContactListScreen}
            options={{ title: 'Contact list' }}
          />
          <Stack.Screen
            name="AddEditContact"
            component={AddEditContactScreen}
            options={{ title: 'Add or edit contact' }}
          />
          <Stack.Screen
            name="ContactDetail"
            component={ContactDetailScreen}
            options={{ title: 'Contact details'} }

          />
          <Stack.Screen name="MapScreen" component={MapScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Log in' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Sign up ' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
