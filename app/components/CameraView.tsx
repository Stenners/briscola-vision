import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import type { Frame } from 'react-native-vision-camera';
import { CardDetection, processImageTensor } from '../utils/cardDetection';

export function CameraView() {
  const [hasPermission, setHasPermission] = useState(false);
  const [detectedCards, setDetectedCards] = useState<CardDetection[]>([]);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    
    async function processFrame() {
      try {
        // Convert frame to tensor format your ONNX model expects
        // This is a placeholder - you'll need to implement the actual conversion
        const tensor = {
          data: frame.toArrayBuffer(),
          dims: [1, 3, frame.height, frame.width], // Adjust based on your model's input requirements
          type: 'float32',
        };
        
        const detections = await processImageTensor(tensor);
        setDetectedCards(detections);
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    }

    runOnJS(processFrame)();
  }, []);

  const totalScore = detectedCards.reduce((sum, card) => sum + card.score, 0);

  if (!hasPermission) {
    return <Text style={styles.message}>No camera permission</Text>;
  }

  if (!device) {
    return <Text style={styles.message}>No camera device found</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <Text style={styles.scoreText}>
          Total Score: {totalScore}
        </Text>
        <Text style={styles.scoreText}>
          Detected Cards: {detectedCards.length}
        </Text>
        {detectedCards.map((card, index) => (
          <Text key={index} style={styles.cardText}>
            {card.card} ({card.confidence.toFixed(2)}): {card.score} points
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  message: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
}); 