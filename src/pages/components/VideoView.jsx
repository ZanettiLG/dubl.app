import Box from "@mui/material/Box";
import PropTypes from "prop-types";

export default function VideoView({ src }) {
    return (
        <Box
            sx={{
                justifyContent: "center",
                alignItems: "end",
                display: "flex",
                /* height: "100%", */
                width: "100%",
                flexGrow: 1,
            }}
        >
            <video
                style={{
                    display: "flex",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    height: "max-content",
                }}
                src={src}
            />
        </Box>
    );
}

VideoView.propTypes = {
    src: PropTypes.string,
};