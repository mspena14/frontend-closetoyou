import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

interface AddNewContactButtonProps {
  navigation: any;
  loadContacts: () => void;
  deleteContact: (id: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

const AddNewContactButton: React.FC<AddNewContactButtonProps> = ({
  navigation,
  loadContacts,
  deleteContact,
  setIsLoaded,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        navigation.navigate('AddEditContact', {
          onSave: loadContacts,
          onDelete: deleteContact,
          isLoadedSetter: setIsLoaded,
        })
      }>
      <Text style={styles.buttonText}>ADD NEW CONTACT</Text>
      <IonIcon
        name="arrow-forward"
        size={20}
        color="white"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: '#000',
  },
  icon: {
    marginLeft: 7,
  },
});

export default AddNewContactButton;
