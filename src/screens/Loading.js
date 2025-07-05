import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Appearance } from 'react-native';

const LoadingScreen = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const handleColorSchemeChange = useCallback((preferences) => {
    setColorScheme(preferences.colorScheme);
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(handleColorSchemeChange);
    return () => subscription.remove();
  }, [handleColorSchemeChange]);

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <ActivityIndicator size="large" color="#2ecc40" />
      <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightBackground: {
    backgroundColor: '#f8f9fa',
  },
  darkBackground: {
    backgroundColor: '#181c1f',
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  lightText: {
    color: '#222',
  },
  darkText: {
    color: '#fff',
  },
});

export default LoadingScreen;
