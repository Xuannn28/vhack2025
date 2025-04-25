import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Constants from 'expo-constants';

const SymptomChecker = () => {
  const [inputText, setInputText] = useState('');
  const [symptomsList, setSymptomsList] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
  const BACKEND_URL_PREDICT = `${BACKEND_URL}/predict`;

  useEffect(() => {
    console.log("Raw BACKEND_URL:", Constants.expoConfig.extra.BACKEND_URL);
    console.log("Calling:", BACKEND_URL_PREDICT);
  }, []);

  const handleAddSymptom = () => {
    if (inputText.trim() === '') return;
    const formattedSymptom = inputText.trim().toLowerCase().replace(/ /g, '_');
    if (!symptomsList.includes(formattedSymptom)) {
      setSymptomsList(prev => [...prev, formattedSymptom]);
    }
    setInputText('');
  };

  const handleClearSymptoms = () => {
    setSymptomsList([]);
    setResult([]);
  };

  const handleAnalyze = async () => {
    if (symptomsList.length === 0) return;
    setLoading(true);
    setResult([]);
    try {
      const response = await fetch(BACKEND_URL_PREDICT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(symptomsList)
      });
      const data = await response.json();
      console.log("Parsed result:", data);
      setResult(data);
    } catch (err) {
      console.error('Error from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Symptom Analyzer</Text>

        <TextInput
          style={styles.input}
          placeholder="Type a symptom..."
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddSymptom}>
          <Text style={styles.buttonText}>Add Symptom</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Predict Disease</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleClearSymptoms}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#002147" style={{ marginTop: 20 }} />}

        <View style={styles.symptomList}>
          {symptomsList.map((symptom, index) => (
            <Text key={index} style={styles.symptomItem}>• {symptom}</Text>
          ))}
        </View>

        {result.map((item, index) => (
          <View key={index} style={styles.resultCard}>
            <Text style={styles.resultTitle}>{item.disease}</Text>
            <Text style={styles.resultProb}>Probability: {(item.probability * 100).toFixed(2)}%</Text>
            <Text style={styles.resultDesc}>{item.description}</Text>
            <Text style={styles.resultPrecautionsTitle}>Precautions:</Text>
            {item.precautions.map((precaution, i) => (
              <Text key={i} style={styles.resultPrecaution}>- {precaution}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f0f3',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#002147',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  symptomList: {
    marginVertical: 20,
  },
  symptomItem: {
    fontSize: 16,
    color: '#2c3e50',
  },
  resultCard: {
    backgroundColor: '#d6e6f0',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002147',
  },
  resultProb: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  resultDesc: {
    fontSize: 14,
    marginVertical: 5,
    color: '#555',
  },
  resultPrecautionsTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#002147',
  },
  resultPrecaution: {
    fontSize: 14,
    marginLeft: 10,
    color: '#2c3e50',
  },
});

export default SymptomChecker;