import React from "react";
import {
  StyleSheet,
  Text,
  View,
  CameraRoll,
  TouchableOpacity
} from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
      secondIntervals: 10,
      interval: null,
      recording: false,
      toggleIcon: 'play',
    };
    this.toggleRecording = this.toggleRecording.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  switchCamera() {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  takePhoto = async () => {
    if (this.camera) {
      await this.camera.takePictureAsync({
        onPictureSaved: data => {
          CameraRoll.saveToCameraRoll(data.uri, "photo");
          // replace with upload.
        }
      });
    }
  };

  toggleRecording() {
    if (this.state.recording) {
      clearInterval(this.state.interval);
      this.setState({toggleIcon: 'play', recording: !this.state.recording });
    } else {
      let interval = setInterval(() => {
        this.takePhoto()
      }, this.state.secondIntervals * 1000);
      this.setState({ interval, recording: !this.state.recording, toggleIcon: 'stop' });
    }
  };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ height: 100, width: 100 }}
            type={this.state.type}
          />
          <Text>Open up App.js to start working on your app! Test 1</Text>
          <TouchableOpacity
            onPress={() => this.toggleRecording()}
            style={styles.playButton}
          >
            <Text>{this.state.toggleIcon}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.switchCamera()}>
            <Text>Switch camera</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.1)"
  }
});
