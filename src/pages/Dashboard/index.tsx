import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
}

export interface AddFood {
    image: string;
    name: string;
    price: string;
    description: string;
}

export const Dashboard = () => {
    const [foods, setFoods] = useState<IFood[]>([]);
    const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const response = await api.get<IFood[]>('/foods');
            setFoods(response.data);
        };

        loadData();
    }, []);

    const handleAddFood = async (food: IFood) => {
        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });

            setFoods([...foods, response.data]);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdateFood = async (food: AddFood) => {
        try {
            const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
                ...editingFood,
                ...food,
            });

            const foodsUpdated = foods.map((f) =>
                f.id !== foodUpdated.data.id ? f : foodUpdated.data
            );

            setFoods(foodsUpdated);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteFood = async (id: number) => {
        await api.delete(`/foods/${id}`);
        const foodsFiltered = foods.filter((food) => food.id !== id);
        setFoods(foodsFiltered);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleEditModal = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    const handleEditFood = (food: IFood) => {
        setIsEditModalOpen(true);
        setEditingFood(food);
    };

    return (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={isModalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            />
            <ModalEditFood
                isOpen={isEditModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />

            <FoodsContainer data-testid="foods-list">
                {foods &&
                    foods.map((food) => (
                        <Food
                            key={food.id}
                            food={food}
                            handleDelete={handleDeleteFood}
                            handleEditFood={handleEditFood}
                        />
                    ))}
            </FoodsContainer>
        </>
    );
};
