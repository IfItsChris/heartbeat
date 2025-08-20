import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonSVG from "../assets/images/button.png";

// --- Types ---

export default function App() {
    const router = useRouter();
    const [buttonImage, setButtonImage] = useState("")

  // load state
  useEffect(() => {
    setButtonImage(ButtonSVG);
  }, []);

  

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, padding: 40 }}>
        <View style={{ flex: 1,   }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "Nunito_700Bold",
              fontWeight: "bold",
            }}
          >
            Check-In Verlauf
          </Text>
        </View>

        <View style={{ flex: 2,  alignItems: "center" }}>
          
        </View>
        <View style={{ flex: 2}}>
          
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
          backgroundColor: "#d1d1d1",
          borderRadius: 25,
        }}
      >
        <TouchableOpacity
          style={{
            width: "30%",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <AntDesign name="barschart" size={30} color="4a4a4a" />
          <Text style={{color: "#4a4a4a"}}>Aktivität</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  alertBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    marginVertical: 12,
    borderRadius: 6,
  },
  alertText: { color: "#b91c1c" },
  btn: {
    marginTop: 20,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
});
