import { useState } from "react";
import PropTypes from "prop-types";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { toArray } from "../../utils";
import LoadingBar from "../../components/Loading";
import ErrorCard from "../../components/ErrorCard";
import { useWebSocket } from "../../contexts/websocket";
import transcriberGIF from "../../assets/transcriber.gif";
import ServerFailedPNG from "../../assets/errors.png";
import { labels } from "../../constants";

import VideoUploader from '../../components/VideoUploader';
import LanguageSelection from "../../components/LanguageSelection";
import { LANGUAGES } from "../../constants/languages";


export default function TranscribeStep({ hidden = false, onSubmit, onChange, value }) {
    const websocket = useWebSocket("transcribe");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(value) {
        const {
            type,
            buffers,
        } = value.video;

        setLoading(true);

        websocket.send("metadata", {
            type,
            total: buffers.length,
            language: value.language,
        });

        const { event_id } = await websocket.waitFor({ event: "metadata" });

        const sendBuffers = async (event_id, buffers) => {
            for (const bufferIndex in buffers) {
                const buffer = buffers[bufferIndex];
                await websocket.send("buffer", {
                    order: bufferIndex,
                    buffer: toArray(buffer),
                }, event_id);
            }

            return
        };

        const waitFinish = async (event_id) => {
            return new Promise((resolve, reject) => {
                websocket.waitFor({ event: "transcription", event_id }).then((res) => resolve(res));
                websocket.waitFor({ event: "error", event_id }).then((res) => reject(res));
            }).catch((res) => setError(res.error));
        };

        const [, transcription] = await Promise.all([sendBuffers(event_id, buffers), waitFinish(event_id)]);

        onSubmit?.(transcription.data);
        setLoading(false);
    }

    function handleChange(v) {
        onChange?.({ ...value, ...v });
    }

    return (
        <Card
            sx={{
                flexGrow: 1,
                flexShrink: 0,
                width: "100%",
                height: "500px",
                padding: "2rem",
                overflow: "hidden",
                position: "relative",
                alignItems: "center",
                boxSizing: "border-box",
                flexDirection: "column",
                justifyContent: "center",
                display: hidden ? "none" : "flex",
            }}
        >
            <ErrorCard
                message={error ? "server error" : ""}
                retryLabel="retry"
                imageSrc={ServerFailedPNG}
                onRetry={() => {
                    setLoading(false);
                    setError("");
                }}
            />
            <LoadingBar
                hidden={!loading || !!error}
                label={labels.portuguese["wait transcribe"]}
                imageSrc={transcriberGIF}
            />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(value);
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    flexDirection: "column",
                    display: !!loading || !!error ? "none" : "flex",
                }}
            >
                <VideoUploader
                    onChange={(v) => handleChange?.({ video: v })}
                    video={value.video}
                />
                <LanguageSelection
                    onChange={(v) => handleChange?.({ language: v })}
                    options={LANGUAGES}
                    value={value.language}
                    label={labels.portuguese["input language"]}
                />
                <Button
                    variant="contained"
                    type="submit">
                    {labels.portuguese["send transcribe"]}
                </Button>
            </form>
        </Card>
    );
}

TranscribeStep.propTypes = {
    hidden: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};