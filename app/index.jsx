import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonSVG from "../assets/images/button.png";
import ButtonSVGPressed from "../assets/images/button_pressed.png";
export default function App() {
  const router = useRouter();
  const [userName, setUserName] = useState("Stelios");
  const [address, setAddress] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [lastCheckInAt, setLastCheckInAt] = useState(null);
  const [location, setLocation] = useState(null);
  const [frequencyHours, setFrequencyHours] = useState(24);
  const [alertDelayHours, setAlertDelayHours] = useState(24);
  const [buttonImage, setButtonImage] = useState("");
  const insets = useSafeAreaInsets();
  // load state
  useEffect(() => {
    setButtonImage(ButtonSVG);
  }, []);

  // save state
  useEffect(() => {
    const s = {
      userName,
      address,
      medicalInfo,
      lastCheckInAt,
      location,
      frequencyHours,
      alertDelayHours,
    };
    AsyncStorage.setItem("STORAGE_KEY", JSON.stringify(s));
  }, [
    userName,
    address,
    medicalInfo,
    lastCheckInAt,
    location,
    frequencyHours,
    alertDelayHours,
  ]);

  async function handleCheckIn() {
    const now = Date.now();
    setLastCheckInAt(now);

    let loc = null;
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const l = await Location.getCurrentPositionAsync({});
      loc = { lat: l.coords.latitude, lng: l.coords.longitude };
    }
    setLocation(loc);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Check-in successful",
        body: `Last check-in: ${new Date(now).toLocaleString()}`,
      },
      trigger: null,
    });
  }

  const nextDueAt = useMemo(
    () => (lastCheckInAt || Date.now()) + frequencyHours * 3600 * 1000,
    [lastCheckInAt, frequencyHours]
  );
  const overdueMs = useMemo(
    () =>
      lastCheckInAt
        ? Date.now() - (lastCheckInAt + alertDelayHours * 3600 * 1000)
        : -1,
    [lastCheckInAt, alertDelayHours]
  );
  const isOverdue = overdueMs >= 0 && lastCheckInAt;

  function buildAlertMessage() {
    const ts = new Date().toLocaleString();
    const loc = location
      ? `Last known location: https://maps.google.com/?q=${location.lat},${location.lng}`
      : "Location unavailable";
    return `${userName} hasn't checked in today (${ts}). Please check at ${address}. If no response, call 166 or 100. ${loc}\n${medicalInfo}`;
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      
      <View style={{ flex: 1, padding: 40 }}>
        <View style={{ flex: 1,   }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "Nunito_700Bold",
              fontWeight: "bold",
            }}
          >
            Hallo,{"\n"}Christina 👋
          </Text>
          <Text>Du hast heute noch nicht eingecheckt.</Text>
        </View>

        <View style={{ flex: 2,  alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={(e) => {
              setButtonImage(ButtonSVGPressed);
            }}
            onPressOut={(e) => {
              setButtonImage(ButtonSVG);
            }}
          >
            <Image source={buttonImage} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2}}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "Nunito_400Regular",
              
            }}
          >
            Letzter Check-In:
          </Text>
          <View style={{borderRadius: 25,width: "100%", height: "60%", backgroundColor: "#ffeaeaff"}}></View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          position: "absolute",
          bottom: 0,
          width: "90%",
          height: 80,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingVertical: 20,
          backgroundColor: "#e5e5e5ff",
          borderRadius: 25,
        }}
      >
        <TouchableOpacity
          style={{
            width: "30%",
            alignItems: "center",
            alignSelf: "center",
          }}
          onPress={() => {router.navigate('/activity')}}
        >
          <AntDesign name="barschart" size={30} color="black" />
          <Text>Aktivität</Text>
        </TouchableOpacity>

        <View
          style={{
            justifyContent: "center",
            backgroundColor: "#fff",
            height: 120,
            width: 120,
            alignSelf: "center",
            alignItems: "center",
            borderRadius: 120,
          }}
        >
          <TouchableOpacity
            onPress={() => router.navigate("/")}
            style={{
              backgroundColor: "#e63946",
              height: 80,
              width: 80,
              borderRadius: 80,
              justifyContent: "center"
            }}
          >
            <AntDesign
              style={{ alignSelf: "center" }}
              name="checkcircleo"
              size={35}
              color="white"
            />
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          style={{
            width: "30%",
            alignItems: "center",
            alignSelf: "center",
          }}
                    onPress={() => router.navigate("/settings")}

        >
          <AntDesign name="setting" size={30} color="black" />
          <Text>Einstellungen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative", top: 0 }
});
