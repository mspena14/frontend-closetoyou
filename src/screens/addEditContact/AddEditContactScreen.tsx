import React from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { useCamera } from '../../hooks/useCamera';
import { useContactForm } from '../../hooks/useContactForm';
import AvatarWithInitial from '../../components/AvatarWithInitial';
import { usePermissions } from '../../hooks/usePermissions';
import { useContacts } from '../../hooks/useContacts'; // Hook para cargar contactos

type AddEditContactScreenProps = StackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen: React.FC<AddEditContactScreenProps> = ({ route, navigation }) => {
  const existingContact = route.params?.contact;
  const setIsLoaded = route.params.isLoadedSetter;
  const { requestLocationPermission } = usePermissions();
  const { loadContacts } = useContacts();

  const {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    role,
    setRole,
    saveContact,
    location,
    setLocation,
    isSaving,
    setIsSaving,
  } = useContactForm(setIsLoaded, loadContacts, existingContact);

  const { photoUri, openCameraOrGallery } = useCamera(existingContact);

  return (
    <View style={styles.container}>
      {isSaving ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Saving contact...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.imageContainer} onPress={openCameraOrGallery}>
            {photoUri ? (
              <AvatarWithInitial
                name={existingContact?.name}
                photoUri={photoUri}
                avatarStyle={styles.contactImage}
                initialContainerStyle={styles.iconContainer}
                initialTextStyle={{ fontSize: 50 }}
              />
            ) : (
              <View style={styles.iconContainer}>
                <IonIcon name="camera-outline" size={50} color="#888" />
              </View>
            )}
            <MCIcon name="image-edit" size={40} color="#888" style={styles.addIcon} />
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Picker selectedValue={role} onValueChange={(roleSelected) => setRole(roleSelected)} style={styles.input}>
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Employee" value="employee" />
          </Picker>
          <Button
            title="Select location"
            onPress={async () => {
              await requestLocationPermission();
              navigation.navigate('MapScreen', {
                onSelectLocation: setLocation,
                initialLocation: location || null,
              });
            }}
          />
          <Button
            title="Save Contact"
            onPress={async () => {
              setIsSaving(true);
              await saveContact(photoUri, location || null);
              setIsSaving(false);
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  contactImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  addIcon: {
    position: 'absolute',
    bottom: 80,
    right: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
});

export default AddEditContactScreen;
