import React from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { assets } from '../assets/assets';


const ForgotPassword = ({navigation}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#A4C1C9", padding: 20, justifyContent: 'center', alignItems: 'center' }}>

      {/* title */}
        <Text style={{ fontSize: 30, color: "#002147", fontWeight: 'bold'  }}>
          Forgot Password?
        </Text>

      {/* container wrapping reset password methods */}
      <View style={{ width: '100%', marginTop: 50, backgroundColor: '#D9D9D9', padding: 20, borderRadius: 10 }}>

        {/* Send via email */}
        <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            borderRadius: 10, 
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
                    left: 10, 
                }}
            />
            
            {/* button: send via email */}
            <TouchableOpacity style={{ 
                flex: 1, 
                height: 60, 
                alignItems: 'center',
                justifyContent: 'center',
              }} //onPress={ /* TODO: send email to request reset password */}
              >
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Send via Email</Text>
              <Text style={{ color: "#002147" }}>Reset password via email</Text>

            </TouchableOpacity>
        </View>

        {/* Send via SMS */}
        <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            borderRadius: 10, 
            paddingHorizontal: 10, 
            marginBottom: 20, 
            borderWidth: 1, 
            borderColor: '#ccc' // Border color
        }}>
            
            <Image
                source={assets.SMS}
                style={{ 
                    width: 20, 
                    height: 20, 
                    left: 10, 
                }}
            />
            
            {/* button: send via SMS */}
            <TouchableOpacity style={{ 
                flex: 1, 
                height: 60, 
                alignItems: 'center',
                justifyContent: 'center',
              }} //onPress={/* TODO: send SMS to request reset password */}
              >
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Send via SMS</Text>
              <Text style={{ color: "#002147" }}>Reset password via SMS</Text>

            </TouchableOpacity>
        </View>

        {/* Send via Whatsapp */}
        <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            borderRadius: 10, 
            paddingHorizontal: 10, 
            marginBottom: 20, 
            borderWidth: 1, 
            borderColor: '#ccc' // Border color
        }}>
          
            <Image
                source={assets.SMS}
                style={{ 
                    width: 20, 
                    height: 20, 
                    left: 10, 
                }}
            />
            
            {/* button: send via whatsapp */}
            <TouchableOpacity style={{ 
                flex: 1, 
                height: 60, 
                alignItems: 'center',
                justifyContent: 'center',
              }} //onPress={/*TODO: send whatsapp to request reset password */}
              >
              <Text style={{ color: "#002147", fontWeight: 'bold' }}>Send via Whatsapp</Text>
              <Text style={{ color: "#002147" }}>Reset password via Whatsapp</Text>

            </TouchableOpacity>
        </View>

        {/* Back to sign in screen link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity 
          style={{
            width: '100%',
            backgroundColor: "#002147",
            padding: 10,
            borderRadius: 30,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('Sign In')}>
            <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

      </View>
      
    </View>
  )
}

export default ForgotPassword