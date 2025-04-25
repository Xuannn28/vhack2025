import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image
} from 'react-native';

const EmergencyMedicalApp = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const emergencyTopics = [
    {
      id: 'cpr',
      title: 'CPR Instructions',
      content: `
        CPR (Cardiopulmonary Resuscitation) Steps:

        1. Check for responsiveness: Tap the person's shoulder and shout "Are you OK?"
        
        2. Call for help: If unresponsive, call emergency services (911) or ask someone else to call.
        
        3. Check for breathing: Look for chest movement, listen for breathing sounds, and feel for breath on your cheek for no more than 10 seconds.
        
        4. Begin chest compressions:
           - Place the person on a firm, flat surface
           - Kneel beside them
           - Place the heel of one hand on the center of the chest (lower half of sternum)
           - Place your other hand on top and interlock fingers
           - Position shoulders directly above hands
           - Keep arms straight
           - Push hard and fast: at least 2 inches deep at a rate of 100-120 compressions per minute
           - Allow chest to fully recoil between compressions
        
        5. Continue compressions until:
           - Professional help arrives
           - The person shows signs of life
           - An AED becomes available
           - You're too exhausted to continue
        
        For trained rescuers: Give 30 compressions followed by 2 rescue breaths.
      `
    },
    {
      id: 'aed',
      title: 'AED Usage',
      content: `
        AED (Automated External Defibrillator) Usage:

        1. Turn on the AED and follow the voice/visual prompts.
        
        2. Expose the person's chest - remove clothing, jewelry, and any patches.
        
        3. Attach the pads:
           - Place one pad on the upper right side of the chest
           - Place the other pad on the lower left side of the chest
           - Ensure pads are pressed firmly against dry, bare skin
        
        4. Ensure no one is touching the person while the AED analyzes the heart rhythm.
        
        5. If a shock is advised:
           - Make sure no one is touching the person
           - Clearly state "CLEAR!" and visually check that everyone is clear
           - Press the shock button when prompted
        
        6. Resume CPR immediately after the shock is delivered, starting with compressions.
        
        7. Continue to follow AED prompts until emergency services arrive.
        
        Note: If the person is wet, quickly dry the chest before applying pads. Do not use an AED in water.
      `
    },
    {
      id: 'stroke',
      title: 'Stroke Recognition & Action',
      content: `
        Stroke Recognition - Remember "FAST":

        F - Face: Ask the person to smile. Does one side of the face droop?
        
        A - Arms: Ask the person to raise both arms. Does one arm drift downward?
        
        S - Speech: Ask the person to repeat a simple phrase. Is their speech slurred or strange?
        
        T - Time: If you observe any of these signs, call emergency services (911) immediately.
        
        Additional stroke symptoms may include:
        - Sudden numbness or weakness in the face, arm, or leg, especially on one side
        - Sudden confusion or trouble understanding speech
        - Sudden trouble seeing in one or both eyes
        - Sudden severe headache with no known cause
        - Sudden trouble walking, dizziness, or loss of balance
        
        What to do:
        1. Note the time when symptoms first appeared
        2. Call emergency services immediately (911)
        3. Do not give the person anything to eat or drink
        4. Have them lie down with their head slightly elevated
        5. If unconscious but breathing, place in recovery position
      `
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      content: `
        Controlling Severe Bleeding:

        1. Apply direct pressure:
           - Use a clean cloth, gauze, or even your hand if nothing else is available
           - Press firmly on the wound
           - Maintain steady pressure for at least 15 minutes
        
        2. If possible, elevate the injured area above the level of the heart.
        
        3. Add more gauze or cloth if blood soaks through - do not remove the original dressing.
        
        4. If bleeding continues and you have access to a tourniquet:
           - Place tourniquet 2-3 inches above the wound (closer to the heart)
           - Not over a joint
           - Tighten until bleeding stops
           - Note the time applied
           - Once applied, do not remove
        
        5. Call or have someone call emergency services (911).
        
        6. Keep the person still and warm.
        
        7. Watch for signs of shock: pale skin, rapid breathing, weakness, confusion.
      `
    },
    {
      id: 'choking',
      title: 'Choking Response',
      content: `
        Responding to Choking:

        For a conscious adult or child:
        
        1. Ask "Are you choking?" If they can't speak, cough, or breathe, proceed with abdominal thrusts (Heimlich maneuver).
        
        2. Stand behind the person and wrap your arms around their waist.
        
        3. Make a fist with one hand and place it just above the navel (belly button).
        
        4. Grasp your fist with your other hand.
        
        5. Press into the abdomen with quick, upward thrusts.
        
        6. Repeat thrusts until the object is expelled or the person becomes unconscious.
        
        For an unconscious person:
        
        1. Place the person on their back and call 911.
        
        2. Begin CPR, starting with chest compressions.
        
        3. Before giving rescue breaths, look in the mouth for visible obstructions (only remove if you can see it).
        
        4. Continue CPR until emergency services arrive.
        
        For infants (under 1 year):
        
        1. Place infant face down along your forearm with head lower than chest.
        
        2. Give 5 back blows between the shoulder blades.
        
        3. Turn infant face up and give 5 chest thrusts.
        
        4. Repeat until object is expelled or infant becomes unconscious.
      `
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      content: `
        Burn Treatment:

        For minor burns (redness, mild swelling):
        
        1. Cool the burn with cool (not cold) running water for 10-15 minutes.
        
        2. Do not use ice as it can damage tissue.
        
        3. Apply aloe vera gel or moisturizer.
        
        4. Cover with a sterile, non-stick bandage.
        
        5. Take over-the-counter pain relievers if needed.
        
        For severe burns (blistering, intense pain, white or charred skin):
        
        1. Call emergency services (911).
        
        2. Do not remove burnt clothing that is stuck to the skin.
        
        3. Cover the area with a clean, dry cloth or sheet.
        
        4. Elevate the burned area above heart level if possible.
        
        5. Watch for signs of shock.
        
        Do NOT:
        - Break blisters
        - Apply butter, oil, or ointments
        - Immerse large severe burns in water
        - Remove clothing stuck to the burn
      `
    }
  ];

  const renderTopicContent = () => {
    if (!selectedTopic) return null;
    
    const topic = emergencyTopics.find(t => t.id === selectedTopic);
    
    return (
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentTitle}>{topic.title}</Text>
        <Text style={styles.contentText}>{topic.content}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedTopic(null)}
        >
          <Text style={styles.backButtonText}>Back to Topics</Text>
        </TouchableOpacity>
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
          <TouchableOpacity style={styles.emergencyCallButton}>
            <Text style={styles.emergencyCallText}>CALL 911</Text>
          </TouchableOpacity>
          <Text style={styles.emergencyNote}>Always call emergency services first in a life-threatening situation</Text>
        </View>
        
        <Text style={styles.topicsHeader}>Select a Topic:</Text>
        
        {emergencyTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicButton}
            onPress={() => setSelectedTopic(topic.id)}
          >
            <Text style={styles.topicButtonText}>{topic.title}</Text>
          </TouchableOpacity>
        ))}
        
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
  topicButton: {
    backgroundColor: '#5bc0de',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  topicButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#5bc0de',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
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