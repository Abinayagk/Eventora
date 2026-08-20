import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import defaultEvents from "./defaultEvents";

async function preload() {
  for (const event of defaultEvents) {
    await addDoc(collection(db, "events"), event);
    console.log(`Added: ${event.name}`);
  }
}
preload();
