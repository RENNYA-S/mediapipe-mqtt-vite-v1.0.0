import MQTT from "paho-mqtt";

const { VITE_MQTT_USERNAME, VITE_MQTT_PASSWORD } = import.meta.env;

let connected = false;
let client1_gesture = ""
let client2_gesture = ""

export const mqttClient = new MQTT.Client("mqtt.jtektrdmc.io", 443, "/", "rennya");

mqttClient.onMessageArrived = onMessageArrived;

function onMessageArrived(message){
    const topic = message.destinationName;

    const payload = JSON.parse(message.payloadString);
    const state = payload.state

    if (topic === "client1") {
        document.getElementById('edit_area').innerHTML = state
        client1_gesture = state
        console.log(client1_gesture);
    } else if(topic === "client2") {
        document.getElementById('edit_area2').innerHTML = state
        client2_gesture = state
        console.log(client2_gesture);
    };

    // 勝敗判定
    let result;

    if (client1_gesture === client2_gesture) {
        result = "It's a tie!";
    } else if (
        (client1_gesture === "Victory" && client2_gesture === "Open_Palm") ||
        (client1_gesture === "Closed_Fist" && client2_gesture === "Victory") ||
        (client1_gesture === "Open_Palm" && client2_gesture === "Closed_Fist")
    ) {
        result = "client1 win!";
    } else {
        result = "client2 win!";
    }
    
    console.log(result);
    document.getElementById('edit_area3').innerHTML = result

}

const onFailure = () => {
    console.error("MQTT connection failed");
};

const onSuccess = () => {
    console.log("MQTT connected");
    connected = true;

    mqttClient.subscribe("client1");
    mqttClient.subscribe("client2");
};

export const initMqttClient = async () => {
    mqttClient.onConnectionLost = () => {
        console.log("MQTT connection lost");
        connected = false;
    };

    mqttClient.connect({
        onSuccess,
        onFailure,
        userName: VITE_MQTT_USERNAME,
        password: VITE_MQTT_PASSWORD,
        useSSL: true,
        keepAliveInterval: 30,
        reconnect: true,
    });
};

export const mqttPublish = (state) => {
    if (!connected) return;
    const message = new MQTT.Message(JSON.stringify({ state }));
    message.destinationName = "rennya";
    mqttClient.send(message);
    console.log(`[MQTT] Sent ${state}`);
};

