import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Image } from "react-native";
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import ButtonSVG from "../assets/images/button.png"
import ButtonSVGPressed from "../assets/images/button_pressed.png"

// --- Types ---

export default function App() {
  const [userName, setUserName] = useState("Stelios");
  const [address, setAddress] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [lastCheckInAt, setLastCheckInAt] = useState(null);
  const [location, setLocation] = useState(null);
  const [frequencyHours, setFrequencyHours] = useState(24);
  const [alertDelayHours, setAlertDelayHours] = useState(24);
  const [buttonImage, setButtonImage] = useState("")

  // load state
  useEffect(() => {
    setButtonImage(ButtonSVG)
  }, []);

  // save state
  useEffect(() => {
    const s = { userName, address, medicalInfo, lastCheckInAt, location, frequencyHours, alertDelayHours };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, [userName, address, medicalInfo, lastCheckInAt, location, frequencyHours, alertDelayHours]);

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

  const nextDueAt = useMemo(() => (lastCheckInAt || Date.now()) + frequencyHours * 3600 * 1000, [lastCheckInAt, frequencyHours]);
  const overdueMs = useMemo(() => (lastCheckInAt ? Date.now() - (lastCheckInAt + alertDelayHours * 3600 * 1000) : -1), [lastCheckInAt, alertDelayHours]);
  const isOverdue = overdueMs >= 0 && lastCheckInAt;

  function buildAlertMessage() {
    const ts = new Date().toLocaleString();
    const loc = location ? `Last known location: https://maps.google.com/?q=${location.lat},${location.lng}` : "Location unavailable";
    return `${userName} hasn't checked in today (${ts}). Please check at ${address}. If no response, call 166 or 100. ${loc}\n${medicalInfo}`;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={{
        fontSize: 32,
        fontFamily: "Nunito_700Bold",
        fontWeight: "bold"
      }}>
        Hallo,
        Christina
      </Text>
      <Text>Last check-in: {lastCheckInAt ? new Date(lastCheckInAt).toLocaleString() : "—"}</Text>
      <Text>Next due: {new Date(nextDueAt).toLocaleString()}</Text>
      {isOverdue && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{buildAlertMessage()}</Text>
        </View>
      )}

        <TouchableOpacity activeOpacity={1} onPressIn={(e) => {setButtonImage(ButtonSVGPressed)}} onPressOut={(e) => {setButtonImage(ButtonSVG)}}><Image source={buttonImage}/>
</TouchableOpacity>
      <Text style={styles.section}>Settings</Text>
      <TextInput style={styles.input} placeholder="Name" value={userName} onChangeText={setUserName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Medical info" value={medicalInfo} onChangeText={setMedicalInfo} />
      <TextInput style={styles.input} placeholder="Frequency (hours)" keyboardType="numeric" value={String(frequencyHours)} onChangeText={(v) => setFrequencyHours(Number(v) || 0)} />
      <TextInput style={styles.input} placeholder="Alert Delay (hours)" keyboardType="numeric" value={String(alertDelayHours)} onChangeText={(v) => setAlertDelayHours(Number(v) || 0)} />

      {isOverdue && (
        <TouchableOpacity activeOpacity={1} style={styles.btn} onPress={() => alert(buildAlertMessage())}>
          <Text style={styles.btnText}>Compose Alert</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginTop: 8 },
  alertBox: { backgroundColor: "#fee2e2", padding: 12, marginVertical: 12, borderRadius: 6 },
  alertText: { color: "#b91c1c" },
  btn: { marginTop: 20, backgroundColor: "#ef4444", padding: 12, borderRadius: 6, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold" },
});
