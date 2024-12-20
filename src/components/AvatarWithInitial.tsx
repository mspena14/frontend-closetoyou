import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ImageStyle, ViewStyle, TextStyle } from 'react-native';

interface AvatarWithInitialProps {
  name?: string;
  photoUri?: string | undefined | null;
  avatarStyle?: StyleProp<ImageStyle>;
  initialContainerStyle?: StyleProp<ViewStyle>;
  initialTextStyle?: StyleProp<TextStyle>;
}

const AvatarWithInitial: React.FC<AvatarWithInitialProps> = ({
  name,
  photoUri,
  avatarStyle,
  initialContainerStyle,
  initialTextStyle,
}) => {
  const initial = name?.charAt(0).toUpperCase();

  return photoUri ? (
    <Image source={{ uri: photoUri }} style={[styles.avatar, avatarStyle]} />
  ) : (
    <View style={[styles.initialContainer, initialContainerStyle]}>
      <Text style={[styles.initialText, initialTextStyle]}>{initial}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  initialContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AvatarWithInitial;
