import React , {useState} from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { assets } from '../assets/assets';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignUp = ({navigation}) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');  // must be the same as password

    const [showPassword, setShowPassword] = React.useState(false);  // track password visibility
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [error, setError] = React.useState('');

    // function to toggle password visibility
    const togglePassword = () => {
        setShowPassword(!showPassword); }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword); }

      return (
          <View style={{ flex: 1, backgroundColor: "#A4C1C9", padding: 20, justifyContent: 'center', alignItems: 'center' }}>
            
            {/* title */}
            <Text style={{ fontSize: 30, color: "#002147", fontWeight: 'bold'  }}>
              Sign Up
            </Text>
  
            {/* container wrapping input fields */}
            <View style={{ width: '100%', marginTop: 50, backgroundColor: '#D9D9D9', padding: 20, borderRadius: 10 }}>
  
              {/* email */}
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Email</Text>
  
              {/* Email Text Field */}
              <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: '#fff', 
                  borderRadius: 5, 
                  paddingHorizontal: 10, 
                  marginBottom: 20, 
                  marginTop: 10, 
                  borderWidth: 1, 
                  borderColor: '#ccc' // Border color
              }}>
                  {/* Email Icon Inside Text Field */}
                  <Image
                      source={assets.email}
                      style={{ 
                          width: 20, 
                          height: 20, 
                          position: 'absolute',
                          left: 10, // Position inside the text field
                          zIndex: 1
                      }}
                  />
                  
                  {/* Text Input */}
                  <TextInput
                      style={{ 
                          flex: 1, 
                          height: 40, 
                          paddingLeft: 40 // Push text right so it doesn't overlap icon
                      }}
                      onChangeText={text => setEmail(text)}
                      value={email}
                      autoCorrect={false}
                      placeholder="email@address.com"
                      keyboardType="email-address"
                  />
              </View>
  
              {/* password */}
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Password</Text>
              
              {/* password text field */}
              <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: '#fff', 
                  borderRadius: 5, 
                  paddingHorizontal: 10, 
                  marginBottom: 20, 
                  marginTop: 10, 
                  borderWidth: 1, 
                  borderColor: '#ccc' 
              }}>
                  {/* Password Icon Inside Text Field */}
                  <Image
                      source={assets.password}
                      style={{ 
                          width: 20, 
                          height: 20, 
                          position: 'absolute',
                          left: 10, // Position inside the text field
                          zIndex: 1
                      }}
                  />
                  
                  {/* Text Input */}
                  <TextInput
                      style={{ 
                          flex: 1, 
                          height: 40, 
                          paddingLeft: 40 // Push text right so it doesn't overlap icon
                      }}
                      onChangeText={text => setPassword(text)}
                      value={password}
                      placeholder="Enter password"
                      autoCorrect={false}
                      secureTextEntry={!showPassword}  // hide password when show password is false
                  />
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#aaa"
                    style={{marginLeft: 10}}
                    onPress={togglePassword}
                />
              </View>

              {/* confirm password */}
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Confirm Password</Text>
              
              {/* confirm password text field */}
              <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: '#fff', 
                  borderRadius: 5, 
                  paddingHorizontal: 10, 
                  marginBottom: 20, 
                  marginTop: 10, 
                  borderWidth: 1, 
                  borderColor: '#ccc' 
              }}>
                  {/* Password Icon Inside Text Field */}
                  <Image
                      source={assets.password}
                      style={{ 
                          width: 20, 
                          height: 20, 
                          position: 'absolute',
                          left: 10, // Position inside the text field
                          zIndex: 1
                      }}
                  />
                  
                  {/* Text Input */}
                  <TextInput
                      style={{ 
                          flex: 1, 
                          height: 40, 
                          paddingLeft: 40 // Push text right so it doesn't overlap icon
                      }}
                      onChangeText={text => setConfirmPassword(text)}
                      value={confirmPassword}
                      placeholder="Enter confirm password"
                      secureTextEntry={!showConfirmPassword} 
                      autoCorrect={false}
                  />
                   <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#aaa"
                    style={{marginLeft: 10}}
                    onPress={toggleConfirmPassword}
                />
              </View>
  
              {/* error message */}
              {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
  
              {/* Sign up button */}
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity 
                style={{
                  width: '100%',
                  backgroundColor: "#002147",
                  padding: 10,
                  borderRadius: 30,
                  marginTop: 10,
                  alignItems: 'center'
                }}
                onPress={() => {
                  if (!email || !password) {
                    setError('Please fill in all fields.');
                  } else if (password !== confirmPassword) {
                    setError('Passwords do not match. Please try again.');
                  }
                  else {
                    setError('');
                    navigation.navigate('Sign In');
                  }
                }}
              >
                  <Text style={{ color: "#fff", fontWeight: 'bold'}}>Sign Up</Text>
                </TouchableOpacity>
              </View>
  
              {/* Sign In */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ color: '#002147' }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
                  <Text style={{ color: '#002147', fontWeight: 'bold', marginLeft: 5 }}>Sign In</Text>
                </TouchableOpacity>
              </View>
              
            </View>
  
          </View>
        );
}

export default SignUp