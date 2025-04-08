import Box from '@mui/material/Box';

export default function ResultStep(result) {
    return (
        <Box
            sx={{
                display: result ? "flex" : "none",
                width: "100%",
                height: "100%",
            }}
        >
            <video
                controls
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
                src={result?.url}
            />
        </Box>
    );
}