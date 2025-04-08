import { createTheme } from "@mui/material/styles";

import error from "./error";
import success from "./success";
import primary from "./primary";
import secondary from "./secondary";

const mainTheme = {
    palette: {
        error,
        success,
        primary,
        secondary,
    },
    /* components: {
        MuiTypography: {
            styleOverrides: {
                color: primary.main,
            },
        }
    }, */
};

console.log(mainTheme);

const themes = {
    main: createTheme(mainTheme),
};

export default themes;