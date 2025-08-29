import { View, Text } from "react-native"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DATA_KEY } from "@/constants"

const Index = () => {
  const storeData = async () => {
    try {
      await AsyncStorage.setItem(DATA_KEY, "this is data")
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      await AsyncStorage.getItem(DATA_KEY)

      //   remove data
      //   await AsyncStorage.removeItem(DATA_KEY)
    } catch (e) {}
  }

  return (
    <View>
      <Text>Index</Text>
    </View>
  )
}

export default Index
