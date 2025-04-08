import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LoadingBar from "../../components/Loading";
import { useWebSocket } from "../../contexts/websocket";
import { bufferToUrl, fixAudio } from "../../utils";
import { Box } from "@mui/material";
import LanguageSelection from "../../components/LanguageSelection";
import { LANGUAGES } from "../../constants/languages";
import ErrorCard from "../../components/ErrorCard";
import ServerFailedPNG from "../../assets/errors.png";
import { labels } from "../../constants";
import VideoView from "../components/VideoView";

export default function TranslateStep({ hidden = false, video, value, onSubmit, onChange }) {
    const websocket = useWebSocket("translate");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (websocket) websocket.on("translation", playResponse);
    }, [websocket]);

    async function handleSubmit(value) {
        const {
            translate,
            language,
            chunks,
        } = value;

        setLoading(true);

        websocket.send("metadata", {
            total: chunks.length,
            chunks,
            language,
            translate,
        });

        const { event_id } = await websocket.waitFor({ event: "metadata" });

        const transcription = await new Promise((resolve, reject) => {
            websocket.waitFor({ event: "transcription", event_id }).then((res) => resolve(res));
            websocket.waitFor({ event: "error", event_id }).then((res) => reject(res));

            /* chunks.forEach((chunk, index) => {
                websocket.send("chunk", {
                    order: index,
                    chunk: chunk,
                }, event_id);
            }); */
        }).catch((res) => setError(res.error));

        onSubmit?.(transcription.data);
        setLoading(false);
    }

    async function playResponse(response) {
        setLoading(false);
        console.log("atualizando", response);
        const videoData = fixAudio(response.data.buffer);
        const urlObj = bufferToUrl([videoData], response.data.type);
        onSubmit({ url: urlObj });
    }

    const videoPlayer = useMemo(() => {
        if (!video) return null;
        /* const fixedVideo = fixAudio(video.buffers);
        console.log(fixedVideo); */
        const urlObj = bufferToUrl(video.buffers, video.type)
        return (<VideoView src={urlObj} />);
    }, [video]);

    function handleChange(v) {
        onChange?.({ ...value, ...v });
    }
    console.log(value);

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
            {videoPlayer}
            <Box width="100%"><LoadingBar hidden={!loading} /></Box>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(value);
                }}
                style={{
                    width: "100%",
                    /* height: "100%", */
                    boxSizing: "border-box",
                    flexDirection: "column",
                    display: !!loading || !!error ? "none" : "flex",
                }}
            >
                <LanguageSelection
                    onChange={(v) => handleChange?.({ language: v })}
                    options={LANGUAGES}
                    value={value.language}
                    label={labels.portuguese["input language"]}
                />
                <LanguageSelection
                    onChange={(v) => handleChange?.({ translate: v })}
                    options={LANGUAGES}
                    value={value.translate}
                    label={labels.portuguese["output language"]}
                />
                <Button
                    variant="contained"
                    type="submit">
                    {labels.portuguese["send translate"]}
                </Button>
            </form>
        </Card>
    );
}

TranslateStep.propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    hidden: PropTypes.bool,
    value: PropTypes.object,
    video: PropTypes.object,
};