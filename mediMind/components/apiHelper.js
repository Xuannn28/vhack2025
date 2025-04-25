import axios from 'axios';

// Function to summarize text using Hugging Face API
export const summarizeText = async (text) => {
  try {
    const HUGGINGFACE_API_KEY = '';   // TODO: move to .env file
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: text,
        parameters: {
          max_length: 250,
          min_length: 50,
          do_sample: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    } else {
      throw new Error('Invalid response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to summarize text: ' + error.message);
  }
};

// Alternative: Simple extractive summarization that doesn't require an API
export const extractiveSummarize = (text, sentenceCount = 5) => {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length <= sentenceCount) {
    return text;
  }
  
  // Calculate word frequency
  const wordFrequency = {};
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  
  words.forEach(word => {
    // Ignore common stopwords
    const stopwords = ['the', 'a', 'an', 'and', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were'];
    if (!stopwords.includes(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Score each sentence based on word frequency
  const sentenceScores = sentences.map(sentence => {
    let score = 0;
    const sentenceWords = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];
    
    sentenceWords.forEach(word => {
      if (wordFrequency[word]) {
        score += wordFrequency[word];
      }
    });
    
    // Normalize by sentence length (with a min length to avoid division by zero)
    return {
      sentence,
      score: score / Math.max(sentenceWords.length, 1)
    };
  });
  
  // Sort sentences by score and pick the top ones
  const topSentences = [...sentenceScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => {
      // Re-sort by original position in text
      return sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence);
    })
    .map(item => item.sentence);
  
  return topSentences.join(' ');
};