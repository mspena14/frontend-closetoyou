import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import AvatarWithInitial from '../../components/AvatarWithInitial';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'react-native';
import WeatherInfo from '../../components/WeatherInfo';
import { fetchContactById } from '../../services/api/contactsService';
import { Contact } from '../../interfaces/IContact';
import { useIsFocused } from '@react-navigation/native';

type ContactDetailScreenProps = StackScreenProps<
  RootStackParamList,
  'ContactDetail'
>;

const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { contact: initialContact, onDelete, onSave, isLoadedSetter } =
    route.params;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();


  useEffect(() => {
    const loadContact = async () => {
      try {
        if (isFocused) {
        setLoading(true);
        const fetchedContact = await fetchContactById(initialContact.id);
        setContact(fetchedContact);
      }
      } catch (error) {
        console.error('Error loading contact:', error);
        Alert.alert(
          'Error',
          'Contact information could not be loaded.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [initialContact.id, isFocused]);


  useEffect(() => {
    if (contact) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <Button
            title="Delete"
            onPress={() => {
              Alert.alert(
                'Confirm deletion',
                'Are you sure you want to delete this contact?',
                [
                  {
                    text: 'cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: async () => {
                      try {
                        await onDelete(contact.id);
                        navigation.goBack();
                      } catch (error) {
                        console.error('Error deleting contact:', error);
                        Alert.alert('Error', 'Could not delete contact.');
                      }
                    },
                  },
                ]
              );
            }}
            color="red"
          />
        ),
      });
    }
  }, [navigation, contact, onDelete]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading contact...</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Contact could not be loaded.</Text>
      </View>
    );
  }

  const contactLocation = contact.location;

  return (
    <View style={styles.container}>
      <AvatarWithInitial
        name={contact.name}
        photoUri={contact.photo}
        avatarStyle={styles.image}
        initialContainerStyle={styles.initialContainer}
        initialTextStyle={styles.initialText}
      />
      <Text style={[styles.contactText, { marginTop: 16 }]}>
        Name: {contact.name}
      </Text>
      <Text style={styles.contactText}>Phone: {contact.phone}</Text>
      <Text style={styles.contactText}>Email: {contact.email}</Text>
      <Text style={styles.contactText}>Role: {contact.role}</Text>
      {contactLocation ? (
        <WeatherInfo
          latitude={contactLocation.latitude}
          longitude={contactLocation.longitude}
          containerStyle={styles.weatherInfoContainer}
        />
      ) : null}
      {contactLocation ? (
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: contactLocation.latitude,
            longitude: contactLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          liteMode
        >
          <Marker
            coordinate={{
              latitude: contactLocation.latitude,
              longitude: contactLocation.longitude,
            }}
            title={contact.name}
            description="Contact location"
          >
            {contact.photo && contact.photo.length > 1 ? (
              <Image
                source={{ uri: contact.photo }}
                style={styles.markerImage}
              />
            ) : (
              <AvatarWithInitial name={contact.name} photoUri={contact.photo} />
            )}
          </Marker>
        </MapView>
      ) : (
        <Text style={styles.noLocationText}>Location not available</Text>
      )}

      <Button
        title="Edit Contact"
        onPress={() =>
          navigation.navigate('AddEditContact', {
            contact,
            onSave,
            onDelete,
            isLoadedSetter,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  contactText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
  },
  initialContainer: {
    width: 220,
    height: 220,
    borderRadius: 200,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 70,
    fontWeight: 'bold',
  },
  mapStyle: {
    width: Dimensions.get('window').width * 0.85,
    height: 180,
    marginTop: 16,
    marginBottom: 16,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  noLocationText: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 8,
  },
  weatherInfoContainer: {
    width: 200,
  },
});

export default ContactDetailScreen;
