import icon from './icon.png';
import brainImage from './brain.png';
import CPR from './CPR.jpg';
import AED from './AED.jpg';
import Bleeding from './severeBleeding.jpg';
import Choking from './choking.jpg';
import Burns from './burn.png';
import Stroke from './stroke.jpg';

// Emergency icons
export const emergencyIcons = {
  cpr: brainImage, 
  aed: AED, 
  stroke: Stroke,
  bleeding: Bleeding, 
  choking: Choking, 
  burns: Burns,
};

// Video links for emergency procedures
export const emergencyVideos = {
  cprCheck: 'https://www.youtube.com/watch?v=XpEvQuOWME0',
  cprCompressions: 'https://www.youtube.com/watch?v=cosVBV96E2g',
  aedUsage: 'https://www.youtube.com/watch?v=UFvL7wTFzl0',
  strokeRecognition: 'https://www.youtube.com/watch?v=QjZG8YLllJI',
  bleedingControl: 'https://www.youtube.com/watch?v=NxO5LvgqZe0',
  heimlichManeuver: 'https://www.youtube.com/watch?v=2dn13zneEjo',
  burnTreatment: 'https://www.youtube.com/watch?v=EaJmzB8YgS0',
};

// Step images for each procedure 
// Note: Using icon as placeholder, replace with appropriate images when available
export const stepImages = {
  // CPR images
  cprResponsiveness: CPR,
  cprCallHelp: CPR,
  cprCheckBreathing: CPR,
  cprCompressions: CPR,
  cprContinue: CPR,
  
  // AED images
  aedTurnOn: AED,
  aedExposeChest: AED,
  aedAttachPads: AED,
  aedStandClear: AED,
  aedDeliverShock: AED,
  aedResumeCPR: AED,
  
  // Stroke images
  strokeFace: Stroke,
  strokeArms: Stroke,
  strokeSpeech: Stroke,
  strokeTime: Stroke,
  strokeCare: Stroke,
  
  // Bleeding images
  bleedingPressure: Bleeding,
  bleedingElevate: Bleeding,
  bleedingDressing: Bleeding,
  bleedingTourniquet: Bleeding,
  bleedingEmergencyServices: Bleeding,
  bleedingShock: Bleeding,
  
  // Choking images
  chokingIdentify: Choking,
  chokingPosition: Choking,
  chokingThrusts: Choking,
  chokingContinue: Choking,
  chokingUnconsciousPerson: Choking,
  chokingInfants: Choking,
  
  // Burns images
  burnsMinor: Burns,
  burnsCool: Burns,
  burnsAloe: Burns,
  burnsBandage: Burns,
  burnsSevere: Burns,
  burnsSevereCare: Burns,
}; 