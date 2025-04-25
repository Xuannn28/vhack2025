import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  Dimensions,
  Linking
} from 'react-native';
import { Video } from 'expo-av';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

const EmergencyMedicalApp = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Enhanced emergency topics with images and video links
  const emergencyTopics = [
    {
      id: 'cpr',
      title: 'CPR Instructions',
      icon: require('../assets/CPR.png'), 
      steps: [
        {
          title: 'Check for responsiveness',
          description: 'Tap the person\'s shoulder and shout "Are you OK?"',
          image: require('../assets/IMG_6569 2.jpg'), 
          videoLink: 'https://www.youtube.com/watch?v=XpEvQuOWME0'
        },
        {
          title: 'Call for help',
          description: 'If unresponsive, call emergency services (911) or ask someone else to call.',
          image: require('../assets/IMG_6569 3.jpg'), 
        },
        {
          title: 'Check for breathing',
          description: 'Look for chest movement, listen for breathing sounds, and feel for breath on your cheek for no more than 10 seconds.',
          image: require('../assets/IMG_6569.jpg'), 
        },
        {
          title: 'Begin chest compressions',
          description: '- Place the person on a firm, flat surface\n- Kneel beside them\n- Place the heel of one hand on the center of the chest (lower half of sternum)\n- Place your other hand on top and interlock fingers\n- Position shoulders directly above hands\n- Keep arms straight\n- Push hard and fast: at least 2 inches deep at a rate of 100-120 compressions per minute\n- Allow chest to fully recoil between compressions',
          image: require('../assets/IMG_6569 4.jpg'),
          videoLink: 'https://www.youtube.com/watch?v=cosVBV96E2g'
        },
        {
          title: 'Continue compressions',
          description: 'Continue compressions until:\n- Professional help arrives\n- The person shows signs of life\n- An AED becomes available\n- You\'re too exhausted to continue\n\nFor trained rescuers: Give 30 compressions followed by 2 rescue breaths.',
          image: require('../assets/IMG_6569 5.jpg'), 
        }
      ]
    },
    {
      id: 'aed',
      title: 'AED Usage',
      icon: require('../assets/AED.png'), 
      steps: [
        {
          title: 'Turn on the AED',
          description: 'Turn on the AED and follow the voice/visual prompts.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Expose the chest',
          description: 'Remove clothing, jewelry, and any patches.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Attach the pads',
          description: '- Place one pad on the upper right side of the chest\n- Place the other pad on the lower left side of the chest\n- Ensure pads are pressed firmly against dry, bare skin',
          image: require('../assets/icon.png'), // Replace with appropriate image
          videoLink: 'https://www.youtube.com/watch?v=UFvL7wTFzl0'
        },
        {
          title: 'Stand clear for analysis',
          description: 'Ensure no one is touching the person while the AED analyzes the heart rhythm.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Deliver shock if advised',
          description: '- Make sure no one is touching the person\n- Clearly state "CLEAR!" and visually check that everyone is clear\n- Press the shock button when prompted',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Resume CPR',
          description: 'Resume CPR immediately after the shock is delivered, starting with compressions.\n\nContinue to follow AED prompts until emergency services arrive.\n\nNote: If the person is wet, quickly dry the chest before applying pads. Do not use an AED in water.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        }
      ]
    },
    {
      id: 'stroke',
      title: 'Stroke Recognition & Action',
      icon: require('../assets/stroke.png'), 
      steps: [
        {
          title: 'F - Face',
          description: 'Ask the person to smile. Does one side of the face droop?',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'A - Arms',
          description: 'Ask the person to raise both arms. Does one arm drift downward?',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'S - Speech',
          description: 'Ask the person to repeat a simple phrase. Is their speech slurred or strange?',
          image: require('../assets/icon.png'), // Replace with appropriate image
          videoLink: 'https://www.youtube.com/watch?v=QjZG8YLllJI'
        },
        {
          title: 'T - Time',
          description: 'If you observe any of these signs, call emergency services (911) immediately.\n\nNote the time when symptoms first appeared.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Additional Care Steps',
          description: '- Do not give the person anything to eat or drink\n- Have them lie down with their head slightly elevated\n- If unconscious but breathing, place in recovery position',
          image: require('../assets/icon.png'), // Replace with appropriate image
        }
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      icon: require('../assets/severeBleeding.png'), 
      steps: [
        {
          title: 'Apply direct pressure',
          description: '- Use a clean cloth, gauze, or even your hand if nothing else is available\n- Press firmly on the wound\n- Maintain steady pressure for at least 15 minutes',
          image: require('../assets/icon.png'), // Replace with appropriate image
          videoLink: 'https://www.youtube.com/watch?v=NxO5LvgqZe0'
        },
        {
          title: 'Elevate the injured area',
          description: 'If possible, elevate the injured area above the level of the heart.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Add more dressing if needed',
          description: 'Add more gauze or cloth if blood soaks through - do not remove the original dressing.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Apply tourniquet if necessary',
          description: 'If bleeding continues and you have access to a tourniquet:\n- Place tourniquet 2-3 inches above the wound (closer to the heart)\n- Not over a joint\n- Tighten until bleeding stops\n- Note the time applied\n- Once applied, do not remove',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Call emergency services',
          description: 'Call or have someone call emergency services (911).',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Monitor for shock',
          description: 'Keep the person still and warm.\n\nWatch for signs of shock: pale skin, rapid breathing, weakness, confusion.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        }
      ]
    },
    {
      id: 'choking',
      title: 'Choking Response',
      icon: require('../assets/choking.png'), 
      steps: [
        {
          title: 'Identify choking',
          description: 'Ask "Are you choking?" If they can\'t speak, cough, or breathe, proceed with abdominal thrusts.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Position for Heimlich maneuver',
          description: 'Stand behind the person and wrap your arms around their waist.',
          image: require('../assets/icon.png'), // Replace with appropriate image
          videoLink: 'https://www.youtube.com/watch?v=2dn13zneEjo'
        },
        {
          title: 'Perform abdominal thrusts',
          description: '- Make a fist with one hand and place it just above the navel (belly button)\n- Grasp your fist with your other hand\n- Press into the abdomen with quick, upward thrusts',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Continue until successful',
          description: 'Repeat thrusts until the object is expelled or the person becomes unconscious.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'For unconscious person',
          description: '- Place the person on their back and call 911\n- Begin CPR, starting with chest compressions\n- Before giving rescue breaths, look in the mouth for visible obstructions (only remove if you can see it)\n- Continue CPR until emergency services arrive',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'For infants (under 1 year)',
          description: '- Place infant face down along your forearm with head lower than chest\n- Give 5 back blows between the shoulder blades\n- Turn infant face up and give 5 chest thrusts\n- Repeat until object is expelled or infant becomes unconscious',
          image: require('../assets/icon.png'), // Replace with appropriate image
        }
      ]
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      icon: require('../assets/burn.png'), 
      steps: [
        {
          title: 'For minor burns',
          description: 'Minor burns have redness and mild swelling.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Cool the burn',
          description: 'Cool the burn with cool (not cold) running water for 10-15 minutes.\n\nDo not use ice as it can damage tissue.',
          image: require('../assets/icon.png'), // Replace with appropriate image
          videoLink: 'https://www.youtube.com/watch?v=EaJmzB8YgS0'
        },
        {
          title: 'Apply aloe vera or moisturizer',
          description: 'Apply aloe vera gel or moisturizer to the affected area.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Cover with bandage',
          description: 'Cover with a sterile, non-stick bandage.\n\nTake over-the-counter pain relievers if needed.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'For severe burns',
          description: 'Severe burns have blistering, intense pain, white or charred skin.\n\nCall emergency services (911) immediately.',
          image: require('../assets/icon.png'), // Replace with appropriate image
        },
        {
          title: 'Severe burn care',
          description: '- Do not remove burnt clothing that is stuck to the skin\n- Cover the area with a clean, dry cloth or sheet\n- Elevate the burned area above heart level if possible\n- Watch for signs of shock\n\nDo NOT:\n- Break blisters\n- Apply butter, oil, or ointments\n- Immerse large severe burns in water\n- Remove clothing stuck to the burn',
          image: require('../assets/icon.png'), // Replace with appropriate image
        }
      ]
    }
  ];

  const handleWatchVideo = (videoLink) => {
    if (videoLink) {
      Linking.openURL(videoLink);
    }
  };

  const renderStepContent = (topic) => {
    const step = topic.steps[currentStep];
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        
        <Image 
          source={step.image} 
          style={styles.stepImage} 
          resizeMode="contain"
        />
        
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        {step.videoLink && (
          <TouchableOpacity
            style={styles.watchVideoButton}
            onPress={() => handleWatchVideo(step.videoLink)}
          >
            <Text style={styles.watchVideoText}>Watch Instructional Video</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
            onPress={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledButtonText]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>
              {currentStep + 1}/{topic.steps.length}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.navButton, currentStep === topic.steps.length - 1 && styles.disabledButton]}
            onPress={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === topic.steps.length - 1}
          >
            <Text style={[styles.navButtonText, currentStep === topic.steps.length - 1 && styles.disabledButtonText]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setSelectedTopic(null);
            setCurrentStep(0);
          }}
        >
          <Text style={styles.backButtonText}>Back to Topics</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopicContent = () => {
    if (!selectedTopic) return null;
    
    const topic = emergencyTopics.find(t => t.id === selectedTopic);
    
    return (
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentTitle}>{topic.title}</Text>
        {renderStepContent(topic)}
      </ScrollView>
    );
  };

  const renderTopicsList = () => {
    return (
      <ScrollView style={styles.topicsContainer}>
        <Text style={styles.headerText}>Emergency Medical Information</Text>
        <Text style={styles.subHeaderText}>
          Quick access to life-saving procedures and information
        </Text>
        
        <View style={styles.emergencyCallContainer}>
          <TouchableOpacity 
            style={styles.emergencyCallButton}
            onPress={() => Linking.openURL('tel:911')}
          >
            <Text style={styles.emergencyCallText}>CALL 911</Text>
          </TouchableOpacity>
          <Text style={styles.emergencyNote}>Always call emergency services first in a life-threatening situation</Text>
        </View>
        
        <Text style={styles.topicsHeader}>Select a Topic:</Text>
        
        <View style={styles.topicsGrid}>
          {emergencyTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicButton}
              onPress={() => setSelectedTopic(topic.id)}
            >
              <Image source={topic.icon} style={styles.topicIcon} />
              <Text style={styles.topicButtonText}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.disclaimer}>
          This app provides basic emergency information only. It is not a substitute for professional medical training or advice. In an emergency, always call 911 or your local emergency number.
        </Text>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedTopic ? renderTopicContent() : renderTopicsList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  topicsContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  emergencyCallContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  emergencyCallButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  emergencyCallText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyNote: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  topicsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicButton: {
    backgroundColor: '#5bc0de',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: (width - 50) / 2,
    alignItems: 'center',
  },
  topicIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  topicButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  stepImage: {
    width: width - 60,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  watchVideoButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  watchVideoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#5bc0de',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
  progressIndicator: {
    paddingHorizontal: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#5bc0de',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
});

export default EmergencyMedicalApp;