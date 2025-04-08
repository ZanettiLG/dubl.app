import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { labels } from "../constants";

export default function ErrorCard({ message, onRetry, retryLabel, imageSrc = null, }) {
    return (
        <Box
            sx={{
                gap: "2rem",
                width: "100%",
                height: "100%",
                padding: "1rem",
                position: "absolute",
                flexDirection: "column",
                boxSizing: "border-box",
                justifyContent: "center",
                display: message ? "flex" : "none",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "column-reverse",
                }}
            >
                <Typography
                    variant="h7"
                    color="error"
                >{labels.portuguese[message] || message}</Typography>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        style={{
                            display: "flex",
                            maxHeight: "100%",
                            objectFit: "contain",
                            height: "fit-content",
                            boxSizing: "border-box",
                            objectPosition: "center",
                        }}
                    />
                ) : null}
            </Box>
            <Button
                variant="contained"
                sx={{
                    ...(!onRetry && { display: "none" }),
                }}
                onClick={onRetry || null}
            >{labels.portuguese[retryLabel]}</Button>
        </Box>
    );
}

ErrorCard.propTypes = {
    message: PropTypes.string.isRequired,
    retryLabel: PropTypes.string,
    imageSrc: PropTypes.string,
    onRetry: PropTypes.func,
};