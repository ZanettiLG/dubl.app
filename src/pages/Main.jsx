import Box from '@mui/material/Box';
import { Provider } from 'react-redux';
import { ThemeProvider } from "@mui/material/styles";
import themes from '../styles';
import TranscribeStep from "./Steps/TranscribeStep";
import WebSocketProvider from '../contexts/websocket';
import { useEffect, useMemo, useState } from 'react';
import TranslateStep from './Steps/TranslateStep';
//import SynthesizeStep from './Steps/SynthesizeStep';
import { store } from '../store';
import { LANGUAGE } from '../constants/languages';

const Storage = () => ({
    clear: () => localStorage.clear(),
    delete: (key) => localStorage.removeItem(key),
    get: (key) => JSON.parse(localStorage.getItem(key)),
    set: (key, value) => {
        if (!value) return localStorage.removeItem(key);
        return localStorage.setItem(key, JSON.stringify(value));
    },
});

const storage = Storage();

const transcriptionInitial = storage.get("transcription") || {
    form: {
        language: LANGUAGE.english,
        video: null,
    },
    result: null,
};

const translationInitial = storage.get("translation") || {
    form: {
        chunks: null,
        translate: LANGUAGE.english,
        language: LANGUAGE.portuguese,
    },
    result: null,
};

export default function Main() {
    const [step, setStep] = useState();
    const [transcription, setTranscription] = useState(transcriptionInitial);
    const [translation, setTranslation] = useState(translationInitial);

    useEffect(() => {
        storage.set("translation", translation)
    }, [translation]);
    useEffect(() => {
        storage.set("transcription", transcription)
    }, [transcription]);

    useEffect(() => {
        if (transcription.result) {
            setStep("translation");
            return;
        }
        if (translation.result) {

            setStep("synthesization");
            return;
        }
        setStep("transcription");
    }, [
        transcription,
        translation,
    ]);

    function handleTranscription(key, data) {
        setTranscription((t) => ({ ...t, [key]: data }));
    }

    function handleTranslation(key, data) {
        setTranslation((t) => ({ ...t, [key]: data }));
    }

    const stepComponent = useMemo(() => {
        switch (step) {
            case "transcription":
                return (
                    <TranscribeStep
                        value={transcription.form}
                        onChange={(data) => handleTranscription("form", data)}
                        onSubmit={(data) => {
                            handleTranscription("result", data);
                            handleTranslation("form", {
                                ...translation.form,
                                language: transcription.form.language,
                                chunks: data,
                            });
                        }}
                    />
                );
            case "translation":
                return (
                    <TranslateStep
                        value={translation.form}
                        video={transcription.form.video}
                        onChange={(data) => handleTranslation("form", data)}
                        onSubmit={(data) => {
                            handleTranslation("result", data);
                        }}
                    />
                );
            default:
                return;
        }
    }, [
        step,
        translation,
        transcription,
    ]);

    return (
        <Provider store={store}>
            <ThemeProvider theme={themes.main}>
                <WebSocketProvider>
                    <Box sx={{ width: "600px" }}> {stepComponent} </Box>
                </WebSocketProvider>
            </ThemeProvider>
        </Provider>
    );
}