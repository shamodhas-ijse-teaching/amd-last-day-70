import { View, Text, TouchableOpacity, Alert, Image } from "react-native"
import React, { useRef, useState } from "react"
import "./../global.css"
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult
} from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import * as ImagePicker from "expo-image-picker"

const App = () => {
  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [isSacan, setIsScan] = useState<boolean>(true)
  const cameraRef = useRef<CameraView>(null)
  const [photo, setPhoto] = useState<any>(null)

  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  if (!permission || mediaPermission) <View />
  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-center mb-3 text-lg text-gray-700">
          We need permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="items-center bg-black/50 rounded-xl py-3 px-3"
        >
          <Text className="text-white text-xl font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!mediaPermission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-center mb-3 text-lg text-gray-700">
          We need permision to save photo to your gallery
        </Text>
        <TouchableOpacity
          onPress={requestMediaPermission}
          className="items-center bg-black/50 rounded-xl py-3 px-3"
        >
          <Text className="text-white text-xl font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBarcodeSacanned = (result: BarcodeScanningResult) => {
    if (result?.data && isSacan) {
      setIsScan(false)
      console.log(result.data)
      Alert.alert("Scanned", result.data, [
        { text: "Scann Again", onPress: () => setIsScan(true) }
      ])
    }
  }

  const handleTakePhoto = async () => {
    if (cameraRef?.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync()
        setPhoto(photo.uri)

        const asset = await MediaLibrary.createAssetAsync(photo.uri)
        await MediaLibrary.createAlbumAsync("gdse70", asset)

        Alert.alert("Saved", "your photo ha been saved to gallery!")
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handlePickImage = async () => {
    const permisionRes = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permisionRes.granted) {
      Alert.alert("Permission", "Permission to access gallery is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // only image
      allowsEditing: true, // crop
      quality: 1
    })

    if (!result.canceled) {
      // result.assets -> []
      setPhoto(result.assets[0].uri)
    }
  }

  return (
    <View className="flex-1">
      <Image source={{ uri: photo }} className="w-full h-96" />
      <CameraView
        ref={cameraRef}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"]
        }}
        onBarcodeScanned={handleBarcodeSacanned}
        style={{ flex: 1 }}
        facing={facing}
      />
      <View className="absolute bottom-16 w-full justify-between flex-row px-10">
        <TouchableOpacity
          className="bg-black p-4 border border-gray-200"
          onPress={handleTakePhoto}
        >
          <Text className="text-center text-2xl text-white">📸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black p-4 border border-gray-200"
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        >
          <Text className="text-center text-2xl text-white">Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black p-4 border border-gray-200"
          onPress={handlePickImage}
        >
          <Text className="text-center text-2xl text-white">Pick an image</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default App
