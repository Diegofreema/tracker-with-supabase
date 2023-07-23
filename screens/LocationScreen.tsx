import {
  StyleSheet,
  Alert,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@rneui/base';
import { Icon } from '@rneui/themed';

import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
  Accuracy,
} from 'expo-location';

import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../config/supabaseClient';
import { DataProps } from '../types';
import { AuthContext } from '../AuthContext';

const { width } = Dimensions.get('window');
const LocationTracker = () => {
  const { user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locationIsOn, setLocationIsOn] = useState(false);
  const [id, setId] = useState();

  const [mapRegion, setMapRegion] = useState({
    latitude: 5.47631,
    longitude: 7.025853,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const verifyPermission = async () => {
    if (
      locationPermissionInformation?.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (locationPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permission to use this app.'
      );

      return false;
    }

    return true;
  };

  const handleGetLocation = async () => {
    const hasPermission = await verifyPermission();

    if (!hasPermission) return;
    const location = await getCurrentPositionAsync({
      accuracy: Accuracy.BestForNavigation,
      distanceInterval: 10,
    });

    const { coords } = location;

    setLocationIsOn(true);
    setIsLoading(true);

    const { data, error } = await supabase
      .from('userData')
      .upsert(
        {
          // @ts-ignore

          user_id: user?.id,
          // @ts-ignore
          email: user?.email,
          // @ts-ignore
          name: user?.user_metadata?.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.log('86', error);
      setIsLoading(false);
      return;
    }

    if (data) {
      console.log('113', data);
      data.forEach((element) => {
        setId(element.id);
      });
      setIsLoading(false);
    }

    setMapRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    const getCurrentLocation = setInterval(async () => {
      const hasPermission = await verifyPermission();

      if (!hasPermission) return;
      const location = await getCurrentPositionAsync({
        accuracy: Accuracy.BestForNavigation,
        distanceInterval: 10,
      });

      const { coords } = location;
      const { data, error } = await supabase
        .from('userData')
        .upsert(
          {
            // @ts-ignore

            user_id: user?.id,
            // @ts-ignore
            email: user?.email,
            // @ts-ignore
            name: user?.user_metadata?.name,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          {
            ignoreDuplicates: false,
          }
        )
        .select();

      if (error) {
        console.log('86', error);

        return;
      }

      if (data) {
        console.log('113', data);
        data.forEach((element) => {
          setId(element.id);
        });
      }

      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      console.log('reading');
    }, 180000);
    if (locationIsOn === true) getCurrentLocation;
  }, [locationIsOn]);

  const turnOff = async () => {
    setLocationIsOn(false);
    setIsLoading(true);
    const { error } = await supabase.from('userData').delete().eq('id', id);

    if (error) console.log(error);
    setIsLoading(false);
  };
  const logOut = async () => {
    let { error } = await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
  };
  console.log('164', id);

  return (
    <View style={{ flex: 1 }}>
      {locationIsOn ? (
        <MapView style={styles.map} region={mapRegion}>
          <Marker coordinate={mapRegion} title={user?.user_metadata?.name} />
        </MapView>
      ) : (
        <MapView
          style={styles.map}
          region={{
            latitude: 5.47631,
            longitude: 7.025853,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={mapRegion} title={'marker'} />
        </MapView>
      )}
      <View
        style={{
          marginTop: 15,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
      >
        <Button
          icon={<Icon name="location-pin" color={'white'} />}
          iconPosition="left"
          containerStyle={{ borderRadius: 7 }}
          loading={isLoading}
          onPress={handleGetLocation}
        >
          Turn on
        </Button>
        <Button
          icon={<Icon name="location-pin" color={'white'} />}
          iconPosition="left"
          containerStyle={{ borderRadius: 7 }}
          onPress={turnOff}
        >
          Turn off
        </Button>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Button
          icon={<Icon name="logout" color={'white'} />}
          iconPosition="left"
          type="solid"
          containerStyle={{
            marginTop: 10,
            marginHorizontal: 'auto',

            borderRadius: 8,
          }}
          onPress={logOut}
        >
          Log out
        </Button>
      </View>
    </View>
  );
};

export default LocationTracker;

const styles = StyleSheet.create({
  map: {
    width: width,
    height: '80%',
  },
});
