import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { login } from '../../services/api/authService';
import { useAuth } from '../../context/AuthContext';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const { login: saveToken } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const data = await login(credentials);
      saveToken(data.token, data.userId);
      Alert.alert('Successful login', 'Welcome back');
      navigation.navigate('ContactList');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Logging in, this may take a few seconds...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={credentials.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="example@email.com"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={credentials.password}
        onChangeText={(value) => handleInputChange('password', value)}
        placeholder="******"
        secureTextEntry
      />
      <Button title="Log in" onPress={handleLogin} />
      <Button
        title="Don't have an account? Sign up"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#007bff',
  },
});

export default LoginScreen;
