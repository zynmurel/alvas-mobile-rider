// screens/LoginScreen.tsx
import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import tw from 'twrnc';
import { RootStackParamList } from '../helpers/@types/router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image'
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../helpers/endpoint';
import { useUserStore } from '../helpers/zustand/user';
import Fontisto from '@expo/vector-icons/Fontisto';



type LoginScreenProps = {
    navigation: NavigationProp<RootStackParamList, 'Login'>;
};
export default function LoginScreen({ navigation }: LoginScreenProps) {
    const { setUser } = useUserStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const validateForm = () => {
        let valid = true;
        const newErrors: { username?: string; password?: string } = {};

        if (!username) {
            newErrors.username = 'Username is required';
            valid = false;
        }
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            setLoading(true)
            try {
                const data: any = await axios.post(baseUrl + '/api/mobile/rider/login', {
                    username,
                    password,
                })
                if (data.data.status === 401) {
                    if (data.data.message === "user_not_found") {
                        setErrors({ username: "User not found" })
                    } else {
                        setErrors({ password: "Wrong password" })
                    }
                } else {
                    await AsyncStorage.setItem('user-rider', JSON.stringify(data.data.user)).then(() => {
                        setUser(data.data.user)
                    })
                }
            } catch (e: any) {
                setErrors({ password: "Error logging in" })
                setErrors({ password: "" })
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <View style={tw`relative justify-center px-4 overflow-scroll`}>
            <View style={tw`absolute left-0 top-10 w-28`}>
                <Image
                    style={{
                        height: 40
                    }}
                    source={require('../assets/images/logo.png')}
                    contentFit="contain"
                    transition={1000}
                /></View>
            <View style={tw`mt-32 flex items-center justify-center gap-2 flex-row`}>
                <Fontisto name="motorcycle" size={40} color="#1a843e" />
                <Text style={tw` text-4xl font-black text-center text-green-700`}>RIDER LOGIN</Text>
            </View>
            <Text style={tw`px-2 mb-6 text-sm text-center text-green-700 `}>Log in to the Alvas app for easy access to delivery management and order tracking.</Text>

            <Text style={tw`text-base font-bold text-green-700 `}>Username</Text>
            <TextInput
                style={tw`border rounded-lg p-4 mb-1 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Input username"
                value={username}
                onChangeText={setUsername}
                secureTextEntry={false}
            />
            {errors.username && <Text style={tw`mb-1 text-red-500`}>{errors.username}</Text>}

            <Text style={tw`mt-2 text-base font-bold text-green-700 `}>Password</Text>
            <View style={tw`relative`}>
                <TextInput
                    style={tw`border rounded-lg p-4 mb-1 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Input password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                {/* <TouchableOpacity  style={tw`absolute bg-red-100 right-4 bottom-5 z-2`} onPress={()=>navigation.navigate('Register')}>
            <Feather name="eye" size={22} color="gray" />
            </TouchableOpacity> */}
            </View>
            {errors.password && <Text style={tw`mb-1 text-red-500`}>{errors.password}</Text>}

            <TouchableOpacity onPress={handleLogin} disabled={loading} style={tw`flex items-center justify-center p-3 mt-5 bg-green-700 rounded-lg `}>
                <Text style={tw`text-lg font-bold text-white`}>{loading ? "Loading..." : "Login"} </Text>
            </TouchableOpacity>
        </View>
    );
}
