import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from '@mui/material/Card';
import Paper from "@mui/material/Paper";
import LoadingBar from "../../components/Loading";
import { useWebSocket } from "../../contexts/websocket";
import { bufferToUrl, fixAudio, toArray } from "../../utils";

export default function SynthesizeStep({ hidden = false }) {
    const websocket = useWebSocket();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [result]);

    useEffect(() => {
        if (websocket) websocket.on("synthesization", playResponse);
    }, [websocket]);

    async function handleSendVideo(video) {
        const {
            type,
            buffers,
            inputLanguage,
            outputLanguage,
        } = video;

        websocket.send("metadata", {
            type,
            total: buffers.length,
            language: inputLanguage,
            translate: outputLanguage,
        });

        /* waitFor({ event: "error" }).catch((reason) => { throw new Error(reason) }); */
        const { event_id } = await websocket.waitFor({ event: "metadata" });

        buffers.forEach((buffer, index) => {
            websocket.send("buffer", {
                order: index,
                buffer: toArray(buffer),
            }, event_id);
        });
        setLoading(true);
    }

    async function playResponse(response) {
        console.log("atualizando", response);
        const videoData = fixAudio(response.data.buffer);
        const urlObj = bufferToUrl([videoData], response.data.type);
        setResult({ url: urlObj });
    }

    return (
        <Paper
            sx={{
                width: "100%",
                ...(hidden && { display: "none" }),
            }}
        >
            <Card width="100%"><LoadingBar hidden={!loading} /></Card>
        </Paper>
    );
}

SynthesizeStep.propTypes = {
    hidden: PropTypes.bool,
};