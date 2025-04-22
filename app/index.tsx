import { StyleSheet, View } from 'react-native';
import { CameraView } from './components/CameraView';
import { useEffect } from 'react';
import { initializeONNX } from './utils/cardDetection';
import * as FileSystem from 'expo-file-system';

export default function App() {
  useEffect(() => {
    async function setupModel() {
      try {
        // The model file needs to be in a writable location for ONNX runtime
        const modelDestination = `${FileSystem.documentDirectory}briscola.onnx`;
        
        // Copy model from assets to document directory if it doesn't exist
        const modelExists = await FileSystem.getInfoAsync(modelDestination);
        if (!modelExists.exists) {
          await FileSystem.copyAsync({
            from: require('../assets/models/briscola.onnx'),
            to: modelDestination
          });
        }
        
        // Initialize ONNX with the model
        const initialized = await initializeONNX(modelDestination);
        if (!initialized) {
          console.error('Failed to initialize ONNX model');
        }
      } catch (error) {
        console.error('Error setting up model:', error);
      }
    }

    setupModel();
  }, []);

  return (
    <View style={styles.container}>
      <CameraView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
