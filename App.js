import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  CameraRoll,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Camera, Permissions, Font } from "expo";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
      secondIntervals: '10',
      interval: null,
      recording: false,
      toggleIcon: 'play',
      endpoint: 'https://freestaff.herokuapp.com/',
      fontLoaded: false,
    };
    this.toggleRecording = this.toggleRecording.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    await Font.loadAsync({
      'proxima-nova': require('./assets/ProximaNovaReg.ttf'),
    });
    this.setState({ fontLoaded: true });
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
          CameraRoll.saveToCameraRoll(data.uri, "photo"); // remove later or allow option?
          this.uploadImageAsync(data.uri)
        }
      });
    }
  };

  uploadImageAsync = async (uri) => {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
  
    let formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
  
    return fetch(this.state.endpoint, options);
  }

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
        <ScrollView contentContainerStyle={{ display:'flex', flexDirection: 'column', height: '100%' }}>
          <View style={styles.title}>
            {
              this.state.fontLoaded ? (
                <View>
                  <Text style={{ fontFamily: 'proxima-nova', fontSize: 26, textAlign: 'center' }}>
                    TimeLapser
                  </Text>
                  <Text style={{ fontFamily: 'proxima-nova', fontSize: 16, textAlign: 'center' }}>
                    Click play to begin capturing
                  </Text>
                </View>
              ) : null
            }
          </View>
          <View style={{flexGrow:1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => this.toggleRecording()}
              style={styles.playButton}
            >
              <FontAwesomeIcon name={this.state.toggleIcon} size={55} style={{ color: '#ccc', textAlign: 'center' }} />
            </TouchableOpacity>

          </View>
          <TextInput
            keyboardType = 'numeric'
            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 50}}
            onChangeText={(secondIntervals) => this.setState({ secondIntervals })}
            value={this.state.secondIntervals}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 200}}
            onChangeText={(secondIntervals) => this.setState({ secondIntervals })}
            value={this.state.endpoint}
          />

          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ height: 200, width: 200 }}
            type={this.state.type}
          />
          <TouchableOpacity onPress={() => this.switchCamera()}>
            <Text>Switch camera</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: "red",
    height: '100%',
  },
  playButton: {
    textAlign: 'center'
  }, 
  title: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    textAlign: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },

});
