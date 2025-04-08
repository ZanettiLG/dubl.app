import storage from 'redux-persist/lib/storage'; // Padrão: localStorage
import sessionStorage from 'redux-persist/lib/storage/session'; // Alternativa

export const local = storage;
export const session = sessionStorage;