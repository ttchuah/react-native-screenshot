import React, { Component } from "react";
import { Dimensions, Button, Image, StyleSheet, Text, View, ScrollView, PixelRatio, Alert } from "react-native";
import { takeSnapshotAsync, Print } from 'expo';
import ViewShot from 'react-native-view-shot';


const Link = props => (
    <Text
        {...props}
        accessibilityRole="link"
        style={StyleSheet.compose(
            styles.link,
            props.style
        )}
    />
);

class App extends Component {
    view;
    scrollView;
    state = {
        imageURL: '',
        pixels: 0
    }
    constructor(props) {
        super(props);
        this.view = React.createRef();
    }
    onScreenshot = async () => {
        // console.log('onScreenshot');
        // let snapshot;
        // try {
        //     snapshot = await takeSnapshotAsync(this.view, {
        //         format: "png",
        //         quality: 1.0,
        //         width: 300,
        //         result: 'base64',
        //         height: 300,
        //     })
        // } catch (e) {
        //     console.log('takeSnapshotAsync error', e);
        // }
        // console.log('snapshot', snapshot);

        this.refs.viewShot.capture().then(uri => {
            console.log('do something with ', uri)
            this.setState({
                imageURL: uri
            })
        })

        // this.setState({
        //     imageURL: snapshot
        // })
    }
    getPixels = () => {
        const targetPixelCount = 1080;
        const pixelRatio = PixelRatio.get()
        const pixels = targetPixelCount / pixelRatio;
        return pixels;
    }
    takeScreenshot = async () => {
        const pixels = this.getPixels()

        console.log('pixels', pixels)
        const snapshot = await takeSnapshotAsync(this.scrollView, {
            format: 'png',
            quality: 0.5,
            snapshotContentContainer: true,
            width: pixels,
            height: pixels
        })
        return snapshot
    }
    onScreenshotUsingTakeSnapshotAsync = async () => {
        const snapshot = await this.takeScreenshot();
        console.log('snapshot', snapshot)
        this.setState({
            imageURL: snapshot,
            pixels: this.getPixels()
        })
    }
    onReset = () => {
        this.setState({
            imageURL: ''
        })
    }
    onPrintScreenshot = async () => {
        try {
            const snapshot = await this.takeScreenshot();
            const pixels = this.getPixels()
            //console.log('snapshot', snapshot)

            let html = `<img src="${snapshot}" width="100%" style="border:2px solid black; height:150px; width:${pixels}px;" />`;
            html += '<p>Hello world</p>'
            //html += '<img src="https://www.super-som.com/static/media/super-cloud-rgb.a9a3896c.png"/>';
            html += snapshot

            const pdf = await Print.printToFileAsync({ html });

            console.log('the pdf i got back was ', pdf)

            return Print.printAsync({ html }).catch(error =>
                Alert.alert(error.message)
            );

            // return Print.printAsync({ uri: pdf.uri }).catch(error =>
            //     Alert.alert(error.message)
            // );
        } catch (e) {
            console.log('error', e)
        }

    }
    render() {
        const dimensions = Dimensions.get("window")

        return (
            <React.Fragment>

                <ScrollView style={styles.app} ref={component => this.scrollView = component}>
                    <View>
                        <Button onPress={this.onReset} title="Reset image" />
                    </View>
                    <View>
                        <Button onPress={this.onPrintScreenshot} title="Print screenshot" />
                    </View>
                    <View>
                        <Button onPress={this.onScreenshot} title="Take a screenshot using ViewShot" />
                    </View>
                    <View>
                        <Button onPress={this.onScreenshotUsingTakeSnapshotAsync} title="Take a screenshot using takeSnapshotAsync()" />
                    </View>

                    {
                        (this.state.imageURL.length > 0) && (<Image source={{ uri: this.state.imageURL }} style={{ borderColor: 'red', borderWidth: 2, width: this.state.pixels, height: this.state.pixels }} />)
                        //(this.state.imageURL.length > 0) && (<Text>Image captured</Text>)
                    }

                    {/* <ViewShot ref="viewShot" options={{ quality: 0.5 }} style={styles.header} >

                        <Text style={styles.title}>React Native for Web!</Text>

                    </ViewShot> */}
                    <View ref={component => this.view = component}>
                        <Text style={styles.title}>React Native for Web!</Text>
                    </View>


                </ScrollView>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    app: {
        marginHorizontal: "auto",
        maxWidth: 500,
        marginVertical: 30
    },
    logo: {
        height: 80
    },
    header: {
        padding: 20,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 3
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 10,
        textAlign: "center"
    },
    text: {
        lineHeight: 1.5,
        fontSize: 20,
        marginVertical: 10,
        textAlign: "center"
    },
    link: {
        color: "#1B95E0"
    },
    code: {

    }
});

export default App;
