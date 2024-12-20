import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from 'react-native-maps';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, Button, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/navigationTypes';
import {Location} from '../../interfaces/ILocation';
import { usePermissions } from '../../hooks/usePermissions';

type MapScreenProps = StackScreenProps<RootStackParamList, 'MapScreen'>;

const MapScreen: React.FC<MapScreenProps> = ({route, navigation}) => {
  const { requestLocationPermission } = usePermissions();
  const {onSelectLocation, initialLocation} = route.params;
  console.log('Moviendo a la ubicación actual:', initialLocation);
  const validateInitialLocation = typeof (initialLocation) !== 'string' ? initialLocation : null;
  const [selectedLocation, setSelectedLocation] = useState<Location | null | undefined >(validateInitialLocation);

  useEffect(() => {
    const checkLocationPermission = async () => {
      const hasLocationPermission = await requestLocationPermission();
      if (!hasLocationPermission) {
        Alert.alert('Location permission not granted');
      }
    };

    checkLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords);

        const {latitude, longitude} = position.coords;
        setSelectedLocation({
          latitude: validateInitialLocation ? validateInitialLocation.latitude : latitude,
          longitude: validateInitialLocation ? validateInitialLocation.longitude : longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        });
      },
      error => Alert.alert('Error', 'Could not get location.' + error),
      {enableHighAccuracy: true, timeout: 150000},
    );
  }, [validateInitialLocation]);

  const selectLocationHandler = (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({
      latitude,
      longitude,
    });
  };

  const saveLocationHandler = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please select a location on the map.');
    }
  };

  const handlePositionFocused = () => {
    if (typeof (selectedLocation) !== 'string') {
    return {
      latitude: selectedLocation
        ? selectedLocation.latitude
        :  6.2192387352785286,
      longitude: selectedLocation
        ? selectedLocation.longitude
        : -75.58322584660817,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };
  }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        region= {handlePositionFocused()}
        onPress={selectLocationHandler}>
        {selectedLocation && typeof (selectedLocation) !== 'string' && (
          <Marker
            coordinate={selectedLocation}
            title="Selected location"
            description="This is the contact location"
          />
        )}
      </MapView>
      <Button title="Save Location" onPress={saveLocationHandler} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
});

export default MapScreen;
