import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { assets } from '../assets/assets';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../translations/translations_language'; // Import the i18n instance

const Language = ({ navigation }) => {

    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [error, setError] = useState('');

    const [items, setItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Melayu', value: 'melayu' },
        { label: 'Chinese (Simplified)', value: 'chinese(simplified)' },
        { label: 'Japanese', value: 'japanese' },
        { label: 'Korean', value: 'korean' },
        { label: 'Spanish', value: 'spanish' },
        { label: 'French', value: 'french' },
        { label: 'German', value: 'german' },]);

    // Update language whenever user selects a language
    useEffect(() => {
        if (selectedLanguage) {
        i18n.locale= selectedLanguage;
        }
    }, [selectedLanguage]);

    return (
        <View style={{ flex: 1, backgroundColor: "#A4C1C9", padding: 20, justifyContent: 'center', alignItems: 'center' }}>
          
            {/* title */}
            <Text style={{ fontSize: 30, color: "#002147",  }}>
                {i18n.t('choose_language')}{' \n'}
            <Text style={{ fontWeight: 'bold' }}>{i18n.t('language_preference')}</Text>
            </Text>

            {/* language image */}
            <Image
                style={{ width: 200, height: 200, marginTop: 50, marginBottom: 50}}
                source={assets.language}/>

            {/* dropdown menu */}
            <DropDownPicker
                placeholder="Select Language"
                padding={10}
                open={open}
                value={selectedLanguage}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedLanguage}
                setItems={setItems}
                style={{ borderColor: error?'red':'#ccc'}}  // show red border if error exist
                onChangeValue={() => setError('')}  // remove error message when value is changed
                />

            {/* error message */}
            {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

            {/* Continue button */}
            <TouchableOpacity 
            style={{
                backgroundColor: "#002147",
                padding: 10,
                borderRadius: 30,
                width: 200,
                marginTop: 40,
                alignItems: 'center'
            }}
            onPress={() => {
                if (!selectedLanguage) {
                    setError(i18n.t('please_select_language'));
                } else {
                    setError('');
                    navigation.navigate('Sign In');
                }
            }}
            >
                
            <Text style={{ color: "#fff", fontWeight: 'bold' }}>{i18n.t('continue')}</Text>
            </TouchableOpacity>

        </View>
      );
}

export default Language