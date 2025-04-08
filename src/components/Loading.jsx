import PropTypes from "prop-types";
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from "@mui/material";

export default function LoadingBar({
    color = "primary",
    label = "Carregando...",
    hidden = false,
    imageSrc = null,
} = {}) {
    return (
        <Box
            sx={{
                gap: "1rem",
                width: "100%",
                height: "100%",
                padding: "1rem",
                flexDirection: "column",
                justifyContent: "center",
                display: hidden ? "none" : "flex",
            }}
        >
            <Box
                sx={{
                    gap: "2rem",
                    flexGrow: 1,
                    display: "flex",
                    overflow: "hidden",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        style={{
                            height: "50%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            objectPosition: "center",
                        }}
                    />
                ) : null}
                <Typography
                    variant="h7"
                    color={color}
                    sx={{ ...(!label && { display: "none" }) }}
                >{label}</Typography>
            </Box>
            <LinearProgress color={color} />
        </Box>
    );
}

LoadingBar.propTypes = {
    imageSrc: PropTypes.string,
    color: PropTypes.string,
    label: PropTypes.string,
    hidden: PropTypes.bool,
};