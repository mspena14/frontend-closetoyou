import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { register } from '../../services/api/authService'; // Ajusta el import según tu estructura

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await register(formData);
      Alert.alert('Successful registration', 'Now log in.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration could not be completed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>registering account, this may take a few seconds...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full name:</Text>
      <TextInput
        style={styles.input}
        value={formData.fullName}
        onChangeText={(value) => handleInputChange('fullName', value)}
        placeholder="Juan Pérez"
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="example@email.com"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        placeholder="******"
        secureTextEntry
      />
      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        placeholder="1234567890"
        keyboardType="phone-pad"
      />
      <Button title="Sign up" onPress={handleRegister} />
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

export default RegisterScreen;
