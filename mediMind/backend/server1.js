import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const serviceAccountPath = path.resolve("vhack2025-4bd40-firebase-adminsdk-fbsvc-fdf33c69a7.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

app.use(cors());
app.use(express.json());

app.get('/notifications', async (req, res) => {
  try {
    const snapshot = await db.collection('notifications').get();
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notifications);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}
);

// Add a POST request to handle reminder creation
app.post('/notifications', async (req, res) => {
  let {
    title = "Reminder",
    message = "This is your default reminder message.",
    time = new Date().toLocaleString(),
    type = "general"
  } = req.body;

  time = new Date(time).toLocaleString(); 
  
  try {
    const reminder = {
      title,
      message,
      time,
      read: false,
      type
    };

    const docRef = await db.collection('notifications').add(reminder);

    res.status(201).json({ message: 'Reminder set successfully!', id: docRef.id, reminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});


app.post('/chat', async (req, res) => {
  console.log('Full request body:', req.body); // log the entire body

  const userMessage = req.body.message;
  console.log('User message:', userMessage); 

  if (!userMessage) {
    return res.status(400).json({ reply: "Missing message in request body" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: userMessage }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    res.json({ reply });

  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }

});

app.get('/mock-device-data', async (req, res) => {
  try {
    const snapshot = await db.collection('mockWearableData').orderBy('timestamp', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    console.error('Error fetching mock device data:', error);
    res.status(500).json({ error: 'Failed to fetch mock device data' });
  }
});


app.listen(PORT, () => {
  console.log(`Gemini backend running on http://${process.env.NETWORK_IP}:5000`);
});

