// utils/asyncStorageWrapper.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistStorage, StorageValue } from "zustand/middleware";

export function createAsyncStorage<T>(): PersistStorage<T> {
    return {
        getItem: async (name: string) => {
            const value = await AsyncStorage.getItem(name);
            // Return null or parsed value
            return value ? JSON.parse(value) : null;
        },

        setItem: async (name: string, value: StorageValue<T>): Promise<void> => {
            if (value === null) {
                await AsyncStorage.removeItem(name);
            } else if (value instanceof Promise) {
                const resolved = await value;
                await AsyncStorage.setItem(name, JSON.stringify(resolved));
            } else {
                await AsyncStorage.setItem(name, JSON.stringify(value));
            }
        },

        removeItem: async (name: string): Promise<void> => {
            await AsyncStorage.removeItem(name);
        },
    };
}
