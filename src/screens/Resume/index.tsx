import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";

import { useTheme } from 'styled-components';

import { HistoryCard } from "../../components/HistoryCard";
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
} from './styles';
import { DataListProps } from "../Dashboard";
import { categories } from "../../utils/categories";

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {

    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expenses = responseFormatted.filter((expense: DataListProps) => expense.type === 'negative');

        const expensesTotal = expenses.reduce((acc: number, expense: DataListProps) => {
            return acc += Number(expense.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense: DataListProps) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {

                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                });

                const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;

                totalByCategory.push({
                    name: category.name,
                    color: category.color,
                    key: category.key,
                    total: categorySum,
                    totalFormatted,
                    percent,
                });
            }
        })

        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            <Content>

                <MonthSelect>
                    <MonthSelectButton>
                        <MonthSelectIcon name="chevron-left"/>
                    </MonthSelectButton>

                    <Month>Maio</Month>

                    <MonthSelectButton>
                        <MonthSelectIcon name="chevron-right"/>
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"

                    />
                </ChartContainer>

                {
                    totalByCategories.map((item: CategoryData) => (
                        <HistoryCard
                            title={item.name}
                            amount={item.totalFormatted}
                            color={item.color}
                            key={item.key}
                        />
                    ))
                }
            </Content>
        </Container>
    );
}