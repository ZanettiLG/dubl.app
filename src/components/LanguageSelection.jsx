import { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function LanguageSelection({ label, value, onChange, options = {} }) {
    const labelID = useMemo(() => `${label}-select-label`, [label]);
    const optionsLabels = useMemo(() => Object.entries(options).map(([optionValue, optionLabel]) => <MenuItem key={`${label}#${optionLabel}#${optionValue}`} value={optionValue}>{optionLabel}</MenuItem>), [label, options]);
    return (
        <Card
            variant="outlined"
            sx={{
                flexGrow: 0,
                width: "100%",
                display: "flex",
                padding: ".5rem",
                overflow: "hidden",
                alignItems: "center",
                position: "relative",
                boxSizing: "border-box",
                minHeight: "max-content",
                justifyContent: "center",
            }}
        >
            <FormControl fullWidth>
                <InputLabel id={labelID}>{label}</InputLabel>
                <Select
                    labelId={labelID}
                    value={value}
                    label={label}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                >
                    {optionsLabels}
                </Select>
            </FormControl>
        </Card>
    );
}

LanguageSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.object.isRequired,
};