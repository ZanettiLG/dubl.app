import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from '@mui/icons-material/UploadFileRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverRounded';
import { bufferToUrl, toArray } from "../utils";

export default function VideoUploader({
    value,
    onChange,
    hidden = false,
}) {
    const inputRef = useRef();
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoData, setVideoData] = useState();

    useEffect(() => {
        if (!videoData) {
            onChange?.(null);
            return;
        }
        if (videoData.done) {
            onChange?.({
                ...videoData,
                done: true,
            });
            const urlObj = bufferToUrl(
                videoData.buffers,
                videoData.type,
            );
            setVideoUrl(urlObj);
        }
    }, [videoData]);

    useEffect(() => {
        if (!value) return;
        if (value.done) {
            const urlObj = bufferToUrl(
                value.buffers,
                value.type,
            );
            setVideoUrl(urlObj);
        }
    }, [value]);

    async function loadFile(event) {
        const target = event.target;
        let files = target.files;
        if (!files) return;

        setLoading(true);

        const [file] = files;
        const mimeType = file.type;

        const reader = file.stream().getReader();
        setVideoData({
            buffers: [],
            type: mimeType,
        })

        while (true) {
            const { done, value: int8array } = await reader.read();
            if (done) break;
            const arrayBuffer = toArray(int8array.buffer);
            setVideoData((video) => ({
                ...video,
                buffers: [...video.buffers, arrayBuffer],
                done: false,
            }));
        }

        setVideoData((video) => ({
            ...video,
            done: true,
        }));

        setLoading(false);
        // Reset files
        target.value = "";
    }

    const videoPlayer = useMemo(() => {
        if (!videoUrl) return (
            <Box
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    overflow: "hidden",
                    alignItems: "center",
                    boxSizing: "border-box",
                    justifyContent: "center",
                }}
            >
                <Button
                    aria-label="delete"
                    type="button"
                    size="large"
                    sx={{
                        boxSizing: "border-box",
                        position: "absolute",
                        border: "2px solid",
                        height: "100%",
                        width: "100%",
                        ["&:hover"]: {
                            color: "#646cff"
                        },
                    }}
                    onClick={() => { !loading && inputRef.current.click() }}
                >
                    {<UploadFileIcon fontSize="large" />}
                </Button>
            </Box>
        );
        return (
            <Box
                sx={{
                    justifyContent: "center",
                    alignItems: "end",
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    flexGrow: 1,
                }}
            >
                <video
                    controls
                    style={{
                        display: "flex",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        height: "max-content",
                    }}
                    src={videoUrl}
                />
                <IconButton
                    color="primary"
                    type="button"
                    size="medium"
                    sx={{
                        position: "absolute",
                        padding: "1px",
                        right: ".2rem",
                        top: ".2rem",
                        ["&:focus-visible"]: {
                            outline: "unset",
                        },
                        ["&:focus"]: {
                            outline: "unset",
                        },
                        ["&:hover"]: {
                            color: "#646cff"
                        },
                    }}
                    onClick={() => {
                        setVideoData(null);
                        setVideoUrl(null);
                    }}
                >
                    <DeleteForeverIcon fontSize="medium" />
                </IconButton>
            </Box>
        );
    }, [videoUrl])

    return (
        <Card
            variant="outlined"
            sx={{
                flexGrow: 0,
                width: "100%",
                height: "100%",
                display: !hidden ? "flex" : "none",
                padding: ".5rem",
                overflow: "hidden",
                alignItems: "center",
                position: "relative",
                boxSizing: "border-box",
                justifyContent: "center",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                style={{
                    display: "none",
                }}
                onInput={loadFile}
            />
            {videoPlayer}

        </Card>
    )
}

VideoUploader.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    hidden: PropTypes.bool,
};