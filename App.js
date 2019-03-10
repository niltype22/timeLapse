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
  state = {
    hasCameraPermission: false,
    type: Camera.Constants.Type.back,
    photoTaken: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  switchCamera = async () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  takePhoto = async () => {
    console.log(this.camera);
    if (this.camera) {
      await this.camera.takePictureAsync({
        onPictureSaved: data => {
          CameraRoll.saveToCameraRoll(data.uri, "photo");
          alert("snap");
        }
      });
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
            onPress={() => this.takePhoto()}
            style={styles.playButton}
          >
            <Text>Play</Text>
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
