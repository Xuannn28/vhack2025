const express = require('express');
const cors = require('cors');
const speech = require('@google-cloud/speech');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { sourceMapsEnabled } = require('process');

const app = express();
const port = 3000;

// Enable CORS with preflight options
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable JSON parsing for larger payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Initialize Google Cloud Speech client
const client = new speech.SpeechClient({
  keyFilename: path.join(__dirname, '../config/vhack-457618-a010ddb67109.json')
});

// In-memory store for chunked uploads
const uploadSessions = {};

// Simple ping endpoint to verify connectivity
app.post('/ping', (req, res) => {
  console.log('Received ping request:', req.body);
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle chunked uploads
app.post('/upload-chunk', (req, res) => {
  console.log('Received chunk upload request');
  
  try {
    const { sessionId, chunkIndex, totalChunks, chunk } = req.body;
    
    if (!sessionId || chunkIndex === undefined || !totalChunks || !chunk) {
      return res.status(400).json({ error: 'Missing required chunk upload parameters' });
    }
    
    // Initialize session if it doesn't exist
    if (!uploadSessions[sessionId]) {
      uploadSessions[sessionId] = {
        chunks: new Array(totalChunks).fill(null),
        config: null,
        timestamp: Date.now()
      };
    }
    
    // Store this chunk
    uploadSessions[sessionId].chunks[chunkIndex] = chunk;
    console.log(`Stored chunk ${chunkIndex + 1}/${totalChunks} for session ${sessionId}`);
    
    // Check if we have all chunks
    const complete = uploadSessions[sessionId].chunks.every(chunk => chunk !== null);
    
    res.json({ 
      status: 'success', 
      sessionId, 
      chunkIndex, 
      received: true,
      complete
    });
  } catch (error) {
    console.error('Error processing chunk:', error);
    res.status(500).json({ 
      error: 'Failed to process chunk', 
      details: error.message 
    });
  }
});

// Transcribe from chunks
app.post('/transcribe-session', async (req, res) => {
  console.log('Received session transcription request');
  
  try {
    const { sessionId, config } = req.body;
    
    if (!sessionId || !config) {
      return res.status(400).json({ error: 'Missing sessionId or config' });
    }
    
    if (!uploadSessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Store the config
    uploadSessions[sessionId].config = config;
    
    // Combine all chunks
    const audioBase64 = uploadSessions[sessionId].chunks.join('');
    console.log(`Combined ${uploadSessions[sessionId].chunks.length} chunks, total length: ${audioBase64.length}`);
    
    if (!audioBase64 || audioBase64.length === 0) {
      return res.status(400).json({ error: 'No audio content in session' });
    }
    
    // Validate config
    const { encoding, sampleRateHertz, languageCode } = config;
    
    const validEncodings = ['LINEAR16', 'MP3', 'AMR'];
    if (!validEncodings.includes(encoding)) {
      return res.status(400).json({ error: 'Invalid encoding format' });
    }
    
    // Prepare request for Google Speech API
    const request = {
      audio: {
        content: audioBase64
      },
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode || 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true
        // Speaker diarization removed
      },
    };
    
    console.log('Starting transcription with encoding:', request.config.encoding);
    
    const [response] = await client.recognize(request);
    console.log('Transcription completed');
    
    if (!response.results || response.results.length === 0) {
      return res.status(400).json({ error: 'No transcription results' });
    }
    
    // Simple transcription without speaker tagging
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    // Clean up the session data to free memory
    delete uploadSessions[sessionId];
    
    console.log('Transcription successful, sending response');
    res.json({ transcription });
    
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Transcription failed', 
      details: error.message,
      code: error.code
    });
  }
});

// Original transcribe endpoint with improved debugging
app.post('/transcribe', async (req, res) => {
  console.log('Received transcription request');
  
  try {
    // Log request headers
    console.log('Request headers:', req.headers);
    
    // Check if the request body exists
    if (!req.body) {
      console.error('No request body received');
      return res.status(400).json({ error: 'No request body provided' });
    }
    
    // Log the keys in the request body to debug structure
    console.log('Request body keys:', Object.keys(req.body));
    
    // Check if the audio object exists
    if (!req.body.audio) {
      console.error('No audio object in request');
      return res.status(400).json({ error: 'No audio object provided' });
    }
    
    // Check if content exists in the audio object
    if (!req.body.audio.content) {
      console.error('No audio content in request');
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    
    // Log audio content type and length
    console.log('Audio content type:', typeof req.body.audio.content);
    console.log('Audio content length:', req.body.audio.content.length);
    
    // Validate base64 content
    if (typeof req.body.audio.content !== 'string') {
      console.error('Invalid audio content type:', typeof req.body.audio.content);
      return res.status(400).json({ error: 'Invalid audio content format - not a string' });
    }
    
    if (req.body.audio.content.length === 0) {
      console.error('Empty audio content');
      return res.status(400).json({ error: 'Empty audio content' });
    }
    
    // Check if the content looks like base64
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    const sampleContent = req.body.audio.content.substring(0, 100);
    if (!base64Regex.test(sampleContent)) {
      console.warn('Warning: Audio content may not be valid base64');
      console.log('Content sample:', sampleContent);
    } else {
      console.log('Content appears to be valid base64');
    }
    
    // Validate config
    if (!req.body.config) {
      console.error('No config in request');
      return res.status(400).json({ error: 'No configuration provided' });
    }
    
    console.log('Request config:', {
      encoding: req.body.config.encoding,
      sampleRateHertz: req.body.config.sampleRateHertz,
      languageCode: req.body.config.languageCode
    });
    
    // Validate encoding
    const validEncodings = ['LINEAR16', 'MP3', 'AMR'];
    if (!validEncodings.includes(req.body.config.encoding)) {
      console.error('Invalid encoding:', req.body.config.encoding);
      return res.status(400).json({ error: 'Invalid encoding format' });
    }
    
    // Determine default sample rate based on encoding
    let expectedSampleRate = 16000;
    if (req.body.config.encoding === 'MP3') {
      expectedSampleRate = 44100;
    }
    
    // Use the provided sample rate or fall back to the expected one
    const sampleRateHertz = req.body.config.sampleRateHertz || expectedSampleRate;
    
    // Prepare the request for Google Speech API
    const request = {
      audio: {
        content: req.body.audio.content
      },
      config: {
        encoding: req.body.config.encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: req.body.config.languageCode || 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true
        // Speaker diarization removed
      },
    };
    
    console.log('Starting transcription with encoding:', request.config.encoding);
    
    // Add additional logging for troubleshooting
    const contentSample = request.audio.content.substring(0, 100);
    console.log('First 100 chars of audio content:', contentSample);
    
    // Check for potential content corruption
    if (contentSample.includes('[object Object]')) {
      console.error('Error: Audio content appears to be corrupted (contains [object Object])');
      return res.status(400).json({ error: 'Audio content is corrupted' });
    }
    
    // Try to write the audio to a temporary file for debugging
    try {
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `audio_debug_${Date.now()}.txt`);
      fs.writeFileSync(tempFile, contentSample, 'utf8');
      console.log(`Wrote content sample to ${tempFile}`);
    } catch (err) {
      console.error('Failed to write debug file:', err);
    }
    
    // Call Google Speech API
    console.log('Calling Google Speech-to-Text API...');
    const [response] = await client.recognize(request);
    console.log('Google API call completed');
    
    if (!response.results || response.results.length === 0) {
      console.error('No transcription results. Response:', JSON.stringify(response));
      return res.status(400).json({ error: 'No transcription results' });
    }
    
    // Simple transcription without speaker tagging
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    console.log('Transcription successful, sending response');
    console.log('Transcription text:', transcription.substring(0, 200) + '...');
    res.json({ transcription });
    
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Handle specific Google Cloud API errors
    if (error.code) {
      console.error('Google Cloud API Error:', {
        code: error.code,
        details: error.details,
        metadata: error.metadata
      });
    }
    
    res.status(500).json({ 
      error: 'Transcription failed', 
      details: error.message,
      code: error.code
    });
  }
});

// Clean up old upload sessions every hour
setInterval(() => {
  const now = Date.now();
  let count = 0;
  
  for (const sessionId in uploadSessions) {
    if (now - uploadSessions[sessionId].timestamp > 3600000) { // 1 hour
      delete uploadSessions[sessionId];
      count++;
    }
  }
  
  if (count > 0) {
    console.log(`Cleaned up ${count} expired upload sessions`);
  }
}, 3600000);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message 
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Server machine IP addresses:`);
  const networkInterfaces = os.networkInterfaces();
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  ${interfaceName}: ${iface.address}`);
      }
    }
  }
});