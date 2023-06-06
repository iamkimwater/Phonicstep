import {Pressable, Text} from 'react-native';
import React from 'react';

const LoginComponent = () => {
  const onPressFunction = () => {
    console.log('구글 로그인 눌렀어요');
  };
  return (
    <Pressable
      onPress={onPressFunction}
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      }}>
      <Text style={{color: 'white', fontSize: 20, fontWeight: 500}}>
        구글 로그인
      </Text>
    </Pressable>
  );
};

export default LoginComponent;
