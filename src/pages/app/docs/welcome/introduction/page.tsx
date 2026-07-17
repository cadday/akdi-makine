import DocsMenu from "../../sections/docs-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Box, Breadcrumbs, Button, Card, CardContent, Drawer, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/material";

import { LINKS } from "@/constants";
import NiCatalog from "@/icons/nexture/ni-catalog";
import NiListCircle from "@/icons/nexture/ni-list-circle";
import NiSendUpRight from "@/icons/nexture/ni-send-up-right";
import { useThemeContext } from "@/theme/theme-provider";

const MenuContent = () => {
  return (
    <Box className="flex flex-col gap-4">
      <DocsMenu selectedID="docs-introduction" />
    </Box>
  );
};

export default function DocsWelcomeIntroduction() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };
  const { isDarkMode } = useThemeContext();

  return (
    <Grid container spacing={5} className="items-start">
      <Grid size={"auto"} className="hidden pe-8 lg:flex">
        <MenuContent />
      </Grid>
      <Grid size={"grow"} spacing={5} container>
        <Grid size={12} spacing={2.5} container>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant="h1" component="h1" className="mb-0">
              Introduction
            </Typography>
            <Breadcrumbs>
              <Link color="inherit" to="/dashboards/default">
                Home
              </Link>
              <Link color="inherit" to="/docs">
                Docs
              </Link>
              <Link color="inherit" to="/docs/welcome">
                Welcome
              </Link>
              <Typography variant="body2">Introduction</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }} className="lg:hidden">
            <Tooltip title="Table of Contents">
              <Button
                className="icon-only surface-standard"
                color="grey"
                variant="surface"
                onClick={toggleDrawer(true)}
              >
                <NiListCircle size={"medium"} />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h6" className="card-title">
                Gogo-Vite React MUI Tailwind Admin Template
              </Typography>
              <Box>
                <Typography variant="body1" component="p">
                  Components, plugins, blocks, and layouts built with MUI, styled with Tailwind, and routed with Vite in
                  a beautiful harmony.
                </Typography>
                <br />
                <Typography variant="body1" component="ul">
                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      Author
                    </Typography>
                    <Typography variant="body1" component="p">
                      ColoredStrategies
                    </Typography>
                  </Typography>
                  <br />
                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      8.3.1
                    </Typography>
                  </Typography>
                  <br />

                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      React Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      19.2.6
                    </Typography>
                  </Typography>
                  <br />

                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      MUI Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      9.0.1
                    </Typography>
                  </Typography>
                  <br />

                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      MUI X Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      9.3.0
                    </Typography>
                  </Typography>
                  <br />

                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      Tailwind Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      4.2.2
                    </Typography>
                  </Typography>
                  <br />

                  <Typography variant="body1" component="li">
                    <Typography variant="subtitle1" component="p">
                      Vite Version
                    </Typography>
                    <Typography variant="body1" component="p">
                      8.0.9
                    </Typography>
                  </Typography>
                  <br />
                </Typography>
                <br />

                <Box className="flex flex-row justify-start gap-2">
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    startIcon={<NiSendUpRight size={"medium"} />}
                    to="/"
                    target="_blank"
                    component={Link}
                  >
                    View Home
                  </Button>

                  <Button
                    size="medium"
                    color="primary"
                    variant="pastel"
                    startIcon={<NiCatalog size={"medium"} />}
                    to={LINKS.figma}
                    target="_blank"
                    component={Link}
                  >
                    Figma
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h6" className="card-title">
                Package Versions
              </Typography>
              <Typography variant="body1" component="p">
                Below is the full package.json file with all the project dependencies.
              </Typography>

              <Box className="bg-grey-20 syntax-highlighter mt-3 rounded-lg p-4">
                <SyntaxHighlighter
                  className="bg-transparent!"
                  language="json"
                  style={isDarkMode ? atomOneDark : atomOneLight}
                  codeTagProps={{ className: "border-none" }}
                  showLineNumbers
                >
                  {`{
  "name": "gogo-vite-mui-admin",
  "private": true,
  "version": "8.3.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "prepare": "husky",
    "pre-commit": "lint-staged"
  },
  "engines": {
    "node": ">=24.15.0",
    "npm": ">=11.12.0"
  },
  "dependencies": {
    "@base-ui/react": "1.4.1",
    "@fontsource/mulish": "5.2.6",
    "@fontsource/urbanist": "5.2.6",
    "@mui/icons-material": "9.0.1",
    "@mui/lab": "9.0.0-beta.2",
    "@mui/material": "9.0.1",
    "@mui/x-charts": "9.3.0",
    "@mui/x-charts-premium": "9.3.0",
    "@mui/x-charts-pro": "9.3.0",
    "@mui/x-data-grid": "9.3.0",
    "@mui/x-data-grid-generator": "9.3.0",
    "@mui/x-data-grid-premium": "9.3.0",
    "@mui/x-data-grid-pro": "9.3.0",
    "@mui/x-date-pickers": "9.3.0",
    "@mui/x-date-pickers-pro": "9.3.0",
    "@mui/x-tree-view": "9.1.0",
    "@mui/x-tree-view-pro": "9.1.0",
    "@react-spring/web": "10.0.1",
    "@tailwindcss/vite": "4.2.2",
    "@types/autosuggest-highlight": "3.2.3",
    "@types/react-big-calendar": "1.16.3",
    "@types/react-syntax-highlighter": "15.5.13",
    "@vidstack/react": "1.12.13",
    "autosuggest-highlight": "3.3.4",
    "dayjs": "1.11.13",
    "ds-markdown": "1.1.0",
    "emoji-picker-react": "4.18.0",
    "formik": "2.4.6",
    "i18next": "26.0.6",
    "js-cookie": "3.0.5",
    "material-ui-popup-state": "5.3.7",
    "mui-one-time-password-input": "5.0.0",
    "notistack": "3.0.2",
    "react": "19.2.6",
    "react-big-calendar": "1.19.4",
    "react-dom": "19.2.6",
    "react-draggable": "4.4.6",
    "react-dropzone": "14.3.8",
    "react-i18next": "17.0.4",
    "react-imask": "7.6.1",
    "react-in-viewport": "1.0.0-beta.8",
    "react-quill-new": "3.8.3",
    "react-router-dom": "7.13.0",
    "react-syntax-highlighter": "15.6.1",
    "react-to-print": "3.1.0",
    "react-use": "17.6.0",
    "swiper": "12.1.2",
    "tailwind-merge": "3.3.1",
    "tailwindcss": "4.2.2",
    "tw-screens": "1.1.0",
    "yet-another-react-lightbox": "3.23.3",
    "yup": "1.6.1"
  },
  "devDependencies": {
    "@eslint/js": "9.39.4",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.1",
    "eslint": "9.39.0",
    "eslint-config-prettier": "10.1.5",
    "eslint-plugin-prettier": "5.5.0",
    "eslint-plugin-react": "7.37.5",
    "eslint-plugin-react-hooks": "7.1.1",
    "eslint-plugin-react-refresh": "0.5.2",
    "eslint-plugin-simple-import-sort": "12.1.1",
    "globals": "17.5.0",
    "husky": "9.1.7",
    "jiti": "2.4.2",
    "lint-staged": "16.1.2",
    "prettier": "3.5.3",
    "prettier-plugin-tailwindcss": "0.6.13",
    "typescript": "5.8.3",
    "typescript-eslint": "8.58.2",
    "vite": "8.0.9"
  }
}`}
                </SyntaxHighlighter>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Drawer
          open={openDrawer}
          anchor="right"
          onClose={toggleDrawer(false)}
          slotProps={{ paper: { className: "MuiDrawer-paperAnchorRight" } }}
        >
          <Box className="min-w-80 p-7">
            <MenuContent />
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
}
