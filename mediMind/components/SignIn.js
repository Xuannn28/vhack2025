import React, {useState}  from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { assets } from '../assets/assets';
import i18n from '../translations/translations_language';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    return (
        <View style={{ flex: 1, backgroundColor: "#A4C1C9", padding: 20, justifyContent: 'center', alignItems: 'center' }}>
          
          {/* title */}
          <Text style={{ fontSize: 30, color: "#002147", fontWeight: 'bold'  }}>
          {i18n.t('sign_in')}
          </Text>

          {/* container wrapping input fields */}
          <View style={{ width: '100%', marginTop: 50, backgroundColor: '#D9D9D9', padding: 20, borderRadius: 10 }}>

            {/* email */}
            <Text style={{ color: "#002147", fontWeight: 'bold' }}>{i18n.t('email')}</Text>

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
                    placeholder={i18n.t('email_placeholder')}
                    keyboardType="email-address"
                />
            </View>

            {/* password */}
            <Text style={{ color: "#002147", fontWeight: 'bold' }}>{i18n.t('password')}</Text>

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
                    placeholder={i18n.t('password_placeholder')}
                    secureTextEntry={true}
                />
            </View>

            {/* error message */}
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

            {/* Sign In button */}
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
                  setError(i18n.t('fill_all_fields'));
                } else {
                  setError('');
                  navigation.navigate('Personal Details');
                }
              }}
            >
                <Text style={{ color: "#fff", fontWeight: 'bold'}}>{i18n.t('sign_in')}</Text>
              </TouchableOpacity>
            </View>
            
            {/* horizontal devider with "or" */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ccc'}} />
              <Text style={{ width: 50, textAlign: 'center', color: '#002147' }}>{i18n.t('or')}</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ccc'}} />
            </View>

            {/* Facebook, Instagram, Google icon */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
              <Image
                source={assets.socialMediaIcons}
                style={{ width: 175, height: 50, marginTop: 10 }}
                resizeMode="contain"
              />
            </View>

            {/* Sign Up */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: '#002147' }}>{i18n.t('dont_have_account')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                <Text style={{ color: '#002147', fontWeight: 'bold', marginLeft: 5 }}>{i18n.t('sign_up')}</Text>
              </TouchableOpacity>
            </View>

            {/* forgot password */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
                <Text style={{ color: '#002147', fontWeight: 'bold' }}>{i18n.t('forgot_password')}</Text>
              </TouchableOpacity>
            </View>
            
          </View>

        </View>
      );
}

export default SignIn