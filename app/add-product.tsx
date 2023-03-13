import * as React from 'react';
import {
  Box,
  FormControl,
  ScrollView,
  TextArea,
  VStack,
  Image,
  Input,
} from 'native-base';

import { ScreenProps } from '../types';

import { useState } from 'react';
import useAxios from '../hooks/usesAxios';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { useRouter } from 'expo-router';
import { MButton, MInput, MTextArea } from '../components/ui';

import { NumberFormatBase, NumericFormat } from 'react-number-format';
import CurrencyInput, { formatNumber } from 'react-native-currency-input';

import * as ImagePicker from 'expo-image-picker';

import StackScreen from '../components/StackScreen';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export interface IHomeProps extends ScreenProps {}

export default function CreateTransaction({}: IHomeProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const { authAxios } = useAxios();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    product: yup
      .string()
      .required('Product name is required')
      .min(3, 'Name too short'),
    description: yup
      .string()
      .required('Please give detailed description of the product')
      .min(3, 'Description too short'),
    price: yup
      .number()
      .required('Please enter a price')
      .moreThan(5, 'value too small')
      .typeError(''),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      product: '',
      description: '',
      price: null,
    },
    resolver: yupResolver(schema),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    //setUser(null);
    router.replace('/sign-in');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(data);

    const { data: user } = await supabase.auth.getUser();

    //console.log(JSON.parse(session ?? '').user.id);
    const { error, status } = await supabase.from('products').insert({
      pictures: { 0: 'getewtwerw' },
      name: data.name,
      description: data.description,
      user_id: user.user?.id,
    });
    //   .eq('id', JSON.parse(session ?? '').user.id);

    setLoading(false);

    if (status == 204) {
      Alert.alert('Success', 'Profile updated');
    }
    if (error) {
      console.log(error);
      Alert.alert('Error', error?.message ?? '');
    }
  };

  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      allowsMultipleSelection: true,

      quality: 1,
    });

    /*     let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],

      quality: 1,
    });
 */
    //console.log(a);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  //if (!user) return <SplashScreen />;

  return (
    <Box flex={1} px='3' py='3' bg='white'>
      <StackScreen title='Create Transactions' headerShown={true} />
      <ScrollView>
        <ScrollView>
          <VStack space='3' px='3'>
            <Controller
              name='product'
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { invalid, error },
              }) => (
                <FormControl isInvalid={invalid}>
                  <FormControl.Label>Product name</FormControl.Label>
                  <MInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Enter product name'
                    type='text'
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {error?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name='description'
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { invalid, error },
              }) => (
                <FormControl isInvalid={invalid}>
                  <FormControl.Label>Description</FormControl.Label>
                  <MTextArea
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder='Enter your product description'
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {error?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name='price'
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { invalid, error },
              }) => (
                <FormControl isInvalid={invalid}>
                  <FormControl.Label>Price</FormControl.Label>
                  <CurrencyInput
                    value={value}
                    onChangeValue={(e: any) => setValue('price', e ?? '')}
                    onChange={onChange}
                    onBlur={onBlur}
                    delimiter=','
                    prefix='#'
                    precision={0}
                    minValue={0}
                    placeholder='Enter price'
                    style={{
                      padding: 16,
                      borderColor: '#e7e5e4',
                      borderWidth: 1,
                      borderRadius: 12,
                      backgroundColor: '#ffffff',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                  />
                  <FormControl.ErrorMessage fontSize='xl'>
                    {error?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <MButton
              isLoading={loading}
              isDisabled={!isValid}
              onPress={handleSubmit(onSubmit)}
              _text={{ fontSize: 18 }}
              mt='24'
            >
              Add product
            </MButton>

            <MButton onPress={pickImage}>
              Pick an image from camera roll
            </MButton>

            {image && (
              <Image
                alt='prop'
                source={{ uri: image }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </VStack>
        </ScrollView>
      </ScrollView>
    </Box>
  );
}
