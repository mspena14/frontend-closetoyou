import {useState} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Contact} from '../interfaces/IContact';
import {usePermissions} from './usePermissions';

export const useCamera = (existingContact: Contact | undefined) => {
  const {requestCameraPermission, requestGalleryPermission} = usePermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(
    existingContact?.photo || null,
  );
  const handlePermissionsAlert = async (message: string, permissionFunction: () => Promise<boolean> ) => {
    Alert.alert(`${message}`, 'Do you want to grant?', [
      {
        text: 'Yes',
        onPress: () => {
          permissionFunction();
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const handleOpenCamera = async () => {
    const hasCameraPermission = await requestCameraPermission();
    if (hasCameraPermission) {
      launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setPhotoUri(uri || null);
          AsyncStorage.setItem('savedImage', uri || '');
        }
      });
    } else {
      handlePermissionsAlert('Camera permission not granted', requestCameraPermission);
    }
  };

  const handleOpenGallery = async () => {
    const hasGalleryPermission = await requestGalleryPermission();
    if (hasGalleryPermission) {
      launchImageLibrary({mediaType: 'photo'}, response => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setPhotoUri(uri || null);
          AsyncStorage.setItem('savedImage', uri || '');
        }
      });
    } else {
      handlePermissionsAlert('Gallery permission not granted', requestGalleryPermission);
    }
  };

  const openCameraOrGallery = () => {
    Alert.alert('Select Photo', 'Where do you want to get the photo from?', [
      {
        text: 'Camara',
        onPress: () => {
          handleOpenCamera();
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          handleOpenGallery();
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return {photoUri, openCameraOrGallery};
};
