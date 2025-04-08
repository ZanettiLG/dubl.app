import { useEffect, useRef, useState } from "react";

const Storage = (name, defaults = {}) => {
    const get = (key) => {
        const storedValue = localStorage.getItem(`${name}_${key}`);
        return storedValue ? JSON.parse(storedValue) : defaults[key];
    }

    const set = (key, value) => {
        return localStorage.setItem(`${name}_${key}`, JSON.stringify(value));
    }

    const del = (key) => {
        return localStorage.removeItem(`${name}_${key}`);
    }

    const reset = (key = undefined) => {
        if (key === undefined) return localStorage.setItem(`${name}_${key}`, defaults[key]);
        for (let index = 0; index < localStorage.length; index++) {
            localStorage.removeItem(localStorage.key(index));
        }
    }

    const clear = () => {
        return localStorage.clear();
    }

    const toObject = () => {
        const obj = {};
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);
            obj[key] = localStorage.get(key) || defaults[key];
        }
        return obj;
    }

    return {
        get,
        set,
        del,
        reset,
        clear,
        toObject,
    };
}

export default function useStorage(name, defaults) {
    const started = useRef(false);
    const [store, setStore] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        if (started.current && name) {
            const storage = Storage(name, defaults);
            setStore(storage);
        }
        return () => {
            started.current = true;
        };
    }, []);

    useEffect(() => { if (store) setValue(store.toObject()); }, [store])

    function set(key, value) {
        store.set(key, value);

        if (value === null) {
            setValue((p) => {
                return {
                    ...p,
                    [key]: null,
                }
            });
        }

        if (value === undefined) {
            setValue((p) => {
                return {
                    ...p,
                    [key]: undefined,
                }
            });
        }

        if (typeof value === "object" && !Array.isArray(value)) {
            setValue((p) => {
                return {
                    ...p,
                    [key]: { ...p[key], ...value }
                }
            });
            return;
        }

        setValue((p) => {
            return {
                ...p,
                [key]: value
            }
        });

        return;
    }

    function reset(key) {
        store.reset(key);
        setValue(store.toObject());
        return;
    }

    function clear() {
        return store.clear();
    }

    return {
        set,
        reset,
        clear,
        storage: value,
    }
}