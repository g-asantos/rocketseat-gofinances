import React, {useState} from "react";
import { Modal } from 'react-native';
import { useForm } from 'react-hook-form';
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

interface FormData{
    name: string;
    amount: string;
}

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit, } = useForm();

    function handleTransactionTypeSelect(type: "up" | "down"){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    function handleRegister({name, amount}: FormData){
        const data ={
            name,
            amount,
            transactionType,
            category: category.key,
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
                    />
                    <InputForm 
                    name="amount"
                    control={control}
                    placeholder="Preço"
                    />

                    <TransactionsTypes>
                        <TransactionTypeButton 
                        onPress={() => handleTransactionTypeSelect('up')}
                        isActive={transactionType === 'up'}
                        type="up" 
                        title="Income"
                        />
                        <TransactionTypeButton 
                        onPress={() => handleTransactionTypeSelect('down')}
                        isActive={transactionType === 'down'}
                        type="down" 
                        title="Outcome"/>
                    </TransactionsTypes>

                    <CategorySelectButton 
                    title={category.name}
                    onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>
                
                <Button 
                    title="Enviar"
                    onPress={handleSubmit(handleRegister)}
                />
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