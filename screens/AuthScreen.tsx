import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Input, Icon } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { Button, Text } from '@rneui/base';
import { supabase } from '../config/supabaseClient';
import { AuthContext } from '../AuthContext';

const AuthScreen = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [variant, setVariant] = useState('LOGIN');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    name: '',

    email: '',
    password: '',
    confirmPassword: '',
  });
  const { confirmPassword, name, password, email } = value;
  const onChangeValue = (value: string, key: string) => {
    setValue((val) => ({
      ...val,
      [key]: value,
    }));
  };
  const handleSignIn = async () => {
    if (password.trim() === '' || email.trim() === '') {
      ToastAndroid.showWithGravityAndOffset(
        'Please fill all fields!!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error);
    }

    if (data) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  };
  const handleSignUp = async () => {
    if (
      name.trim() === '' ||
      password.trim() === '' ||
      email.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      Alert.alert('Please all fields should be field!!');
      return;
    }
    if (value.password !== value.confirmPassword) {
      Alert.alert(
        'Password does not match',
        'Please enter matching passwords!'
      );
      return;
    }
    setLoading(true);
    let { data: user, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    setLoading(false);
    if (err) {
      Alert.alert('An Error has occurred', 'Please try again!!');
      return;
    }

    if (user) {
      setIsLoggedIn(true);
    }

    setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };
  const handleVariants = () => {
    if (variant === 'LOGIN') {
      return setVariant('REGISTER');
    } else {
      return setVariant('LOGIN');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { marginTop: variant === 'LOGIN' ? 100 : 20 }]}
    >
      <Text h1>{variant === 'LOGIN' ? 'Welcome Back!!' : 'Join The Hub'}</Text>
      <View style={{ rowGap: 20, marginVertical: 20 }}>
        {variant !== 'LOGIN' && (
          <>
            <Input
              value={name}
              onChangeText={(val) => onChangeValue(val, 'name')}
              label={'Name'}
            />
          </>
        )}
        <Input
          value={email}
          onChangeText={(val) => onChangeValue(val, 'email')}
          keyboardType="email-address"
          label={'Email'}
        />
        <Input
          value={password}
          onChangeText={(val) => onChangeValue(val, 'password')}
          secureTextEntry
          label={'Password'}
        />
        {variant !== 'LOGIN' && (
          <Input
            value={confirmPassword}
            onChangeText={(val) => onChangeValue(val, 'confirmPassword')}
            secureTextEntry
            label={'Confirm Password'}
          />
        )}
      </View>
      <Button
        containerStyle={{ marginBottom: 30 }}
        onPress={variant === 'LOGIN' ? handleSignIn : handleSignUp}
        loading={loading}
        disabled={loading}
      >
        {variant === 'LOGIN' ? 'Sign in' : 'Sign up'}
      </Button>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 20,
        }}
      >
        <Text>
          {variant === 'LOGIN'
            ? 'Do not have an account?'
            : 'Already have an account?'}
        </Text>
        <Button type="clear" onPress={handleVariants}>
          {variant === 'LOGIN' ? 'Sign up' : 'Sign in'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
});
