import React, { useEffect, useState } from 'react';
import { StyleSheet, LayoutAnimation, Dimensions, View, TouchableOpacity, Text, Linking, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'

export default App = () => {

  useEffect(() => {
    requestCameraPermission()
  })

  const [hasCameraPermission, setCameraPermission] = useState()
  const [lastScannedUrl, setScannedUrl] = useState()

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCameraPermission({ hasCameraPermission: status === 'granted' })
  };

  const handleBarCodeRead = result => {
    console.log('result: ', result)
    if (result.data !== lastScannedUrl) {
      LayoutAnimation.spring();
      setScannedUrl({ lastScannedUrl: result.data })
    }
  };

  const handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(lastScannedUrl),
        },
        { text: 'No', onPress: () => { } },
      ],
      { cancellable: false }
    );
  };

  const handlePressCancel = () => {
    setScannedUrl({ lastScannedUrl: null })
  };

  const maybeRenderUrl = () => {
    if (lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {hasCameraPermission === null
        ? <Text>Requesting for camera permission</Text>
        : hasCameraPermission === false
          ? <Text style={{ color: '#fff' }}>
            Camera permission is not granted
        </Text>
          : <BarCodeScanner
            onBarCodeRead={handleBarCodeRead}
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            }}
          />}

      {maybeRenderUrl()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
