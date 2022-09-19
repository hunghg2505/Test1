import merge from "lodash/merge";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { lightShadows } from "./shadows";
import { Theme } from "@mui/material";

declare module "@mui/material/styles/createTypography" {
  interface Typography {
    descTitle: React.CSSProperties;
  }

  interface TypographyOptions {
    descTitle: React.CSSProperties;
  }
}

declare module "@mui/material/Typography/Typography" {
  interface TypographyPropsVariantOverrides {
    descTitle: true;
  }
}

export const THEMES = {
  LIGHT: "LIGHT",
};

const baseOptions = (language: string) => {
  return {
    components: {
      MuiAvatar: {
        styleOverrides: {
          fallback: {
            height: "75%",
            width: "75%",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiCssBaseline: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          height: "100%",
          width: "100%",
        },
        body: {
          height: "100%",
        },
        "#root": {
          height: "100%",
        },
        "#nprogress .bar": {
          zIndex: "2000 !important",
        },
      },
      MuiCardHeader: {
        defaultProps: {
          titleTypographyProps: {
            variant: "h6",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "auto",
            marginRight: "16px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
    typography: {
      fontFamily: "Helvetica Neue",
      h1: {
        fontWeight: 600,
        fontSize: "6rem",
      },
      h2: {
        fontWeight: 400,
        fontSize: "4rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "3rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "2rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h6: {
        fontWeight: 500,
        fontSize: "1.250rem",
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: "1.000rem",
      },
      body1: {
        fontWeight: 400,
        fontSize: "1.000rem",
      },
      body2: {
        fontWeight: 400,
        fontSize: "0.875rem",
      },
      lead: {
        fontWeight: 400,
        fontSize: "0.875rem",
      },
      button: {
        fontWeight: 500,
        fontSize: "0.875rem",
        letterSpacing: "normal",
      },
      descTitle: {
        fontWeight: 400,
        fontSize: "1.000rem",
      },
    },
  };
};

export const paletteLight = {
  action: {
    active: "#6b778c",
  },
  background: {
    default: "#FFFFFF",
    paper: "#FFFFFF",
    drawer: "#FBF9FA",
  },
  error: {
    contrastText: "#ffffff",
    main: "#DD2803",
  },
  mode: "light" as any,
  primary: {
    contrastText: "#FFFFFF",
    main: "#141312",
    accent1: "#B30C14",
    accent2: "#E50914",
    accent3: "#FF6C57",
    accent4: "#FF9A84",
  },
  secondary: {
    main: "#FDAC49",
  },
  success: {
    contrastText: "#ffffff",
    main: "#2ACEAA",
  },
  text: {
    primary: "#000000",
    secondary: "#6b778c",
  },
  warning: {
    contrastText: "#ffffff",
    main: "#FCC644",
  },
  customColor: {
    orange: {
      contrastText: "#ffffff",
      main: "#FDAC49",
      accent1: "#FC8E09",
      accent2: "#FDAC49",
      accent3: "#FED194",
      accent4: "#FFEDD7",
    },
    yellow: {
      contrastText: "#ffffff",
      main: "#FFCA4B",
      accent1: "#F4AD01",
      accent2: "#FFCA4B",
      accent3: "#FDDE86",
      accent4: "#FFF0C6",
    },
    pink: {
      contrastText: "#ffffff",
      main: "#FB7D74",
      accent1: "#E14D42",
      accent2: "#FB7D74",
      accent3: "#FDB5AF",
      accent4: "#FEDAD7",
    },
    blue: {
      contrastText: "#ffffff",
      main: "#1976D2",
      accent1: "#0072D4",
      accent2: "#51A9F6",
      accent3: "#81C3FC",
      accent4: "#D9EDFF",
    },
    green: {
      contrastText: "#ffffff",
      main: "#2E7D32",
      accent1: "#09A381",
      accent2: "#2ACEAA",
      accent3: "#51A9F6",
      accent4: "#DDF8F2",
    },
    grey: {
      main: "#E0E0E0",
      accent1: "#E0E0E0",
      accent2: "#8C8C8A",
      accent3: "#E1E1E1",
      accent4: "#F5F5F4",
      accent5: "#FFFFFF",
    },
    red: {
      main: "#D32F2F",
    },
  },
};

const themesOptions = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              opacity: 0.86,
              color: "#42526e",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#FFFFFF",
          },
        },
      },
    },
    palette: paletteLight,
    shadows: lightShadows,
  },
};

export const CreateCustomTheme = (config: any): Theme => {
  let themeOptions = themesOptions[THEMES.LIGHT];
  let language = localStorage.getItem("i18nextLng") || "";

  let theme = createTheme(merge({}, baseOptions(language), themeOptions));
  theme = responsiveFontSizes(theme);

  return theme;
};
