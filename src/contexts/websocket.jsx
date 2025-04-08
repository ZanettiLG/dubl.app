/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import {
    useRef,
    useContext,
    createContext,
    useState,
    useMemo,
    useEffect,
} from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import websocket from "../clients/websocket";
import LoadingBar from "../components/Loading";
import ErrorCard from "../components/ErrorCard";
import useEffectOnce from "../hooks/useEffectOnce";
import ConnectingGIF from "../assets/rede-na-nuvem.gif";
import ServerFailedPNG from "../assets/errors.png";
import { waitTime } from "../utils";
import { labels } from "../constants";

const DEFAULT_VALUE = {
    on: (key) => { },
    send: (key, message) => { },
};

const WebSocketContext = createContext(DEFAULT_VALUE)

function WSContainer({ children }) {
    return (
        <Card
            sx={{
                width: "600px",
                height: "400px",
                display: "flex",
                padding: "2rem",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            {children}
        </Card>
    );
}

WSContainer.propTypes = {
    children: PropTypes.any,
};

export default function WebSocketProvider({ children }) {
    const websocketRef = useRef(null);
    const [error, setError] = useState("");
    const [waiting, setWaiting] = useState(false);

    async function createWebsocketClient() {
        setWaiting(true);
        try {
            const [ws] = await Promise.all([websocket(), waitTime(3000)]);
            websocketRef.current = ws;
            setWaiting(false);
            setError("");
        } catch (error) {
            setError(error.message);
            setWaiting(false);
        }
    }

    useEffectOnce(() => {
        if (!websocketRef.current) createWebsocketClient();
    });

    const started = useMemo(() => !!websocketRef.current, [websocketRef]);
    const content = useMemo(() => {
        if (waiting) {
            return (
                <WSContainer>
                    <LoadingBar
                        label={labels.portuguese["wait server"]}
                        imageSrc={ConnectingGIF}
                    />
                </WSContainer>
            )
        };
        if (error) {
            return (
                <WSContainer>
                    <ErrorCard
                        message={error}
                        retryLabel="try server"
                        imageSrc={ServerFailedPNG}
                        onRetry={createWebsocketClient}
                    />
                </WSContainer>
            )
        };
        return children;
    }, [error, children, waiting])

    return (
        <WebSocketContext.Provider value={{ client: websocketRef.current, error }}>
            {content}
        </WebSocketContext.Provider>
    );
}

WebSocketProvider.propTypes = {
    children: PropTypes.any.isRequired,
};

export function useWebSocket(path) {
    const { client, error } = useContext(WebSocketContext);

    async function send(event, data, event_id) {
        client?.send(
            path,
            event,
            data,
            event_id,
        );
    }

    async function on(event, callback) {
        return await client?.on(event, callback);
    }

    async function waitFor(query) {
        return await client?.waitFor(query);
    }

    return {
        waitFor,
        client,
        error,
        send,
        on,
    };
}