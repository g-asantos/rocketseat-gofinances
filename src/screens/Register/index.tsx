import React, {useState} from "react";
import { Modal,Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button } from "../../components/Forms/Button/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import { 
    Container ,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
} from './styles';
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface FormData{
   [name: string]: any;
}

interface NavigationProps{
    navigate: (screen: string) => void;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('Valor é obrigatório')
});

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
            resolver: yupResolver(schema),
        });
    
    const navigation = useNavigation<NavigationProps>();

    function handleTransactionTypeSelect(type: "positive" | "negative"){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação');
        };

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria');
        };

        const newTransaction ={
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }

        try {
            const dataKey = '@gofinances:transactions';
            const dataAlreadySaved = await AsyncStorage.getItem(dataKey);
            const currentData = dataAlreadySaved ? JSON.parse(dataAlreadySaved): [];

            const dataFormatted = [
                ...currentData,
                newTransaction,
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            navigation.navigate('Listagem');

        } catch (err) {
            console.log(err, 'ERROR');
            Alert.alert('Não foi possível salvar');
        }
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <GestureHandlerRootView>
                                <TransactionTypeButton
                                    onPress={() => handleTransactionTypeSelect('positive')}
                                    isActive={transactionType === 'positive'}
                                    type="up"
                                    title="Income"
                                />
                            </GestureHandlerRootView>
                            <GestureHandlerRootView>
                                <TransactionTypeButton
                                    onPress={() => handleTransactionTypeSelect('negative')}
                                    isActive={transactionType === 'negative'}
                                    type="down"
                                    title="Outcome" />
                            </GestureHandlerRootView>
                        </TransactionsTypes>

                        <GestureHandlerRootView>
                            <CategorySelectButton
                                title={category.name}
                                onPress={handleOpenSelectCategoryModal}
                            />
                        </GestureHandlerRootView>
                    </Fields>

                    <GestureHandlerRootView>
                        <Button
                            title="Enviar"
                            onPress={handleSubmit(handleRegister)}
                        />
                    </GestureHandlerRootView>
                </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                  category={category}
                  setCategory={setCategory}
                  closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
    )
};