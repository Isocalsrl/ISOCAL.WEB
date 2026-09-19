import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import * as categoriesApi from "../api/categories.api";
import type { Category } from "../types/category.types";

function sortCategories(categories: Category[]): Category[] {
    return [...categories].sort((firstCategory, secondCategory) =>
        firstCategory.name.localeCompare(secondCategory.name, "es"),
    );
}

function getLoadErrorMessage(error: unknown): string {
    return error instanceof ApiError
        ? error.message
        : "No se pudo cargar el listado de categorías.";
}

export function useCategoriesCollection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

    const loadCategories = useCallback(async (): Promise<void> => {
        setLoadErrorMessage(null);
        setIsLoading(true);

        try {
            setCategories(await categoriesApi.listCategories());
        } catch (error) {
            setLoadErrorMessage(getLoadErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        void categoriesApi
            .listCategories()
            .then((result) => {
                if (active) setCategories(result);
            })
            .catch((error) => {
                if (active) setLoadErrorMessage(getLoadErrorMessage(error));
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    function addCategory(category: Category): void {
        setCategories((currentCategories) => sortCategories([...currentCategories, category]));
    }

    function replaceCategory(category: Category, shouldSort = true): void {
        setCategories((currentCategories) => {
            const nextCategories = currentCategories.map((currentCategory) =>
                currentCategory.id === category.id ? category : currentCategory,
            );

            return shouldSort ? sortCategories(nextCategories) : nextCategories;
        });
    }

    function removeCategory(categoryId: number): void {
        setCategories((currentCategories) =>
            currentCategories.filter((category) => category.id !== categoryId),
        );
    }

    return {
        categories,
        isLoading,
        loadErrorMessage,
        loadCategories,
        addCategory,
        replaceCategory,
        removeCategory,
    };
}
