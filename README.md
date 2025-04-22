# Briscola Vision: Card Scoring App

This is a React Native application built with Expo that uses the device camera to detect and score Briscola playing cards in real-time using an ONNX model.

## Features

- **Real-time Card Detection:** Uses `react-native-vision-camera` to access the device camera.
- **Frame Processing:** Leverages Vision Camera Frame Processors and `react-native-reanimated` worklets for efficient image analysis.
- **ONNX Model Integration:** Utilizes `onnxruntime-react-native` to run a pre-trained ONNX model for card identification.
- **Score Calculation:** Automatically calculates the Briscola point value for detected cards.
- **Live Score Display:** Shows the detected cards, their confidence scores, individual points, and the total score on the camera view.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development/emulator)
- Xcode (for iOS development/simulator - currently requires setup)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd briscola-vision
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Model Setup

1.  Place your pre-trained ONNX model file named `briscola.onnx` in the `assets/models/` directory. If the directory doesn't exist, create it.

### Running the App

Since this project uses native modules (`react-native-vision-camera`, `onnxruntime-react-native`), you need to run it using a development build.

1.  **Generate Native Code (if not already done):**
    ```bash
    npx expo prebuild --platform android # Or --platform ios
    ```
    *(Note: iOS prebuild might require additional setup/troubleshooting based on current project status).* 

2.  **Run on Android:**
    ```bash
    npx expo run:android
    ```
3.  **Run on iOS:**
    ```bash
    npx expo run:ios 
    ```
    *(Requires Xcode and potentially further configuration)*

## Project Structure

-   `app/`: Contains the main application code using Expo Router.
    -   `components/`: Reusable UI components (e.g., `CameraView.tsx`).
    -   `utils/`: Utility functions (e.g., `cardDetection.ts` for ONNX logic).
    -   `index.tsx`: Main entry point screen, initializes the model.
-   `assets/`: Static assets like fonts, images, and models.
    -   `models/`: Location for the `briscola.onnx` file.
-   `android/`: Native Android project files.
-   `ios/`: Native iOS project files.

## Key Dependencies

-   `expo`: Core Expo framework.
-   `expo-router`: File-based routing.
-   `react-native-vision-camera`: Camera access and frame processing.
-   `@mrousavy/react-native-vision-camera-worklets`: Bridge for using frame processors with Reanimated worklets.
-   `onnxruntime-react-native`: ONNX model inference engine.
-   `react-native-reanimated`: For running JavaScript code on the UI thread (used by frame processors).
-   `expo-file-system`: Used to copy the ONNX model to a writable location.

## How it Works

1.  The `App` component in `app/index.tsx` initializes the `onnxruntime-react-native` session by copying the `briscola.onnx` model from assets to the app's document directory.
2.  The `CameraView` component requests camera permission and displays the camera feed.
3.  It uses a `useFrameProcessor` hook from `react-native-vision-camera`.
4.  Each frame captured by the camera is passed to the `processFrame` worklet.
5.  Inside the worklet (running via `runOnJS` for async operations), the frame data is converted into a tensor format suitable for the ONNX model (this part might need adjustment based on the specific model requirements in `cardDetection.ts`).
6.  The `processImageTensor` function in `cardDetection.ts` runs the ONNX model inference.
7.  The model output (detections) is processed to identify cards and their confidence scores.
8.  Briscola points are assigned based on the detected card ranks.
9.  The results are passed back to the `CameraView` component via state updates (`setDetectedCards`).
10. The UI displays the detected cards, scores, and total points overlayed on the camera view.
