import { Alert, Platform } from 'react-native';
import { openSettings, Permission, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const requestPermission = async (permission: Permission, permissionType: string) => {
  const result = await request(permission);
  console.log(result);

  if (result === RESULTS.GRANTED) {
    return true;
  } else if (result === RESULTS.BLOCKED) {
    Alert.alert(
      `Permission required to access ${permissionType}`,
      'To use this feature, enable the permission in your device settings.',
      [
        {
          text: 'Ir a configuración',
          onPress: () => {openSettings();},
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }
  return false;
};


export const usePermissions = () => {
  const requestCameraPermission = () => requestPermission(PERMISSIONS.ANDROID.CAMERA, 'the camera.');
  const requestLocationPermission = () => requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 'the location.');
  const requestContactsPermission = () => requestPermission(PERMISSIONS.ANDROID.READ_CONTACTS, 'the contacts.');
  const requestGalleryPermission = async () => {
    let permisionResult = false;
    const version = typeof (Platform.Version) === 'string' ? parseFloat(Platform.Version) : Platform.Version;
    if ( version >= 33) {
    permisionResult = await requestPermission(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, 'the gallery.');
  } else {
    permisionResult = await requestPermission(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, 'the gallery.');
  }
  return permisionResult;
};

  return {
    requestCameraPermission,
    requestGalleryPermission,
    requestLocationPermission,
    requestContactsPermission,
  };
};
