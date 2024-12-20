import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/navigationTypes';
import {useContacts} from '../../hooks/useContacts';
import {useSearch} from '../../hooks/useSearch';
import AvatarWithInitial from '../../components/AvatarWithInitial';
import WeatherInfo from '../../components/WeatherInfo';
import {useIsFocused} from '@react-navigation/native';
import AddNewContactButton from '../../components/addNewContactButton';
import ActionButton from '../../components/ActionButton';
import {useAuth} from '../../context/AuthContext';

type ContactListScreenProps = StackScreenProps<
  RootStackParamList,
  'ContactList'
>;

const ContactListScreen: React.FC<ContactListScreenProps> = ({navigation}) => {
  const {
    contacts,
    loadContacts,
    deleteContact,
    setIsLoaded,
    syncPhoneContacts,
    isSyncing,
    hasSynced,
    deleteAllUserContacts,
    isDeleting,
  } = useContacts();
  const {logout} = useAuth();
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const {searchText, filteredContacts, handleSearch} =
    useSearch(sortedContacts);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadContacts();
    }
  }, [loadContacts, isFocused]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          title="Log out"
          onPress={() => {
            Alert.alert(
              'Confirm log out',
              'Are you sure you want to log out?',
              [
                {
                  text: 'cancel',
                  style: 'cancel',
                },
                {
                  text: 'Log out',
                  onPress: () => {
                    logout();
                  },
                },
              ],
            );
          }}
          color="red"
        />
      ),
    });
  }, [logout, navigation]);

  return (
    <View style={styles.container}>
      {(isSyncing || isDeleting) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            {isDeleting ? 'Deleting all contacts...' : 'Syncing contacts...'}
          </Text>
        </View>
      )}

      {!isDeleting && contacts.length === 0 && !isSyncing && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No contacts available. Sync or add new contacts!
          </Text>
        </View>
      )}
      {!isDeleting && contacts.length > 0 && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name or phone number"
          value={searchText}
          onChangeText={handleSearch}
        />
      )}
      <FlatList
        data={searchText ? filteredContacts : sortedContacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.contactContainer}
            onPress={() =>
              navigation.navigate('ContactDetail', {
                contact: item,
                onDelete: deleteContact,
                onSave: loadContacts,
                isLoadedSetter: setIsLoaded,
              })
            }>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            {item.location && typeof item.location !== 'string' ? (
              <WeatherInfo
                containerStyle={styles.weatherInfo}
                weatherTextStyle={styles.weatherText}
                latitude={item.location.latitude}
                longitude={item.location.longitude}
              />
            ) : (
              <></>
            )}
            <AvatarWithInitial name={item.name} photoUri={item.photo} />
          </TouchableOpacity>
        )}
      />

      <ActionButton
        syncPhoneContacts={syncPhoneContacts}
        deleteAllContacts={deleteAllUserContacts}
        isSyncing={isSyncing}
        hasSynced={hasSynced}
      />
      <AddNewContactButton
        navigation={navigation}
        loadContacts={loadContacts}
        deleteContact={deleteContact}
        setIsLoaded={setIsLoaded}
      />
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  contactInfo: {
    flex: 1,
    marginRight: 10,
  },
  contactText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
  },
  weatherInfo: {
    width: 125,
    height: 40,
    marginRight: 5,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  weatherText: {
    display: 'none',
  },
  locationNotFoundText: {
    marginRight: 10,
  },
  addPhoneContactsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 60,
    alignSelf: 'flex-end',
    height: 60,
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    objectFit: 'scale-down',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default ContactListScreen;
