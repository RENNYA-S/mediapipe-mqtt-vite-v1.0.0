import "./style.css";

import { func1, initCamHandGesture } from "./hand_gesture";
import { initMqttClient } from "./mqtt_lamp";

await initCamHandGesture();
await func1();

await initMqttClient();
