import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Language from './components/Language';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Chatbot from './components/Chatbot';
import ForgotPassword from './components/ForgotPassword';
import PersonalDetails from './components/PersonalDetails';
import WearableDevice from './components/WearableDevice';
import HomeScreen from './components/TranscriptionHomeScreen';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import AppointmentDetailScreen from './components/AppointmentDetails';
import Dashboard from './components/Dashboard';
import DoctorsSelection from './components/DoctorsSelection';
import DoctorDetail from './components/DoctorDetail';
import DoctorAppointment from './components/DoctorAppointment';
import PatientDetails from './components/PatientDetails';
import Contact from './components/Contact';
import Notifications from './components/Notifications';
import WearablePatientDetails from './components/WearablePatientDetails';
import HealthDetailsScreen from './components/HealthDetails';
import HealthRewardsScreen from './components/HealthRewards';
import RecordScreen from './components/RecordScreen';
import EmergencyMedicalApp from './components/Emergency';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Language Preference">
        <Stack.Screen name="Language Preference" component={Language} />
        <Stack.Screen name="Sign In" component={SignIn} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
        <Stack.Screen name="Personal Details" component={PersonalDetails} />
        <Stack.Screen name="Wearable Device" component={WearableDevice} />
        <Stack.Screen name="Wearable Patient Details" component={WearablePatientDetails}/>

        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Speech to Text' }}/>
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Record" component={RecordScreen} options={{ title: 'Record Appointment' }} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="AppointmentSummary" component={AppointmentDetailScreen} />
        <Stack.Screen name="Chatbot" component={Chatbot} options={{ headerShown: false }}/>
        <Stack.Screen name="Contact" component={Contact} options={{ title: 'Emergency Support' }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />

        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard', headerBackTitle: 'Back', }} />
        <Stack.Screen name="DoctorsSelection" component={DoctorsSelection} options={{ title: 'Book an Appointment', headerBackTitle: 'Back', }} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetail} options={{ title: 'Doctor Details', headerBackTitle: 'Back', }} />
        <Stack.Screen name="DoctorAppointment" component={DoctorAppointment} options={{ title: 'New Appointment' }} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />

        <Stack.Screen name="HealthDetails" component={HealthDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HealthRewards" component={HealthRewardsScreen} options={{ headerBackTitle: 'Challenges' }} />
        <Stack.Screen name="Emergency" component={EmergencyMedicalApp} options={{ headerBackTitle: 'Emergency' }} />
        
      </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});