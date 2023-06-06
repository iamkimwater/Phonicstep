import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import LoginComponent from './app/components/auth/LoginComponent';

function App() {

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <Text>헤더</Text>
      </View>
      <View style={styles.body}>
        <LoginComponent />
      </View>
      <View style={styles.footer}>
        <Text>푸터</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#a03434',
  },
  body: {
    flex: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 30,
  },
  footer: {
    flex: 1,
    backgroundColor: '#3442a0',
  },
});

export default App;
