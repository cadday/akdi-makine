import NumberFieldFilled from "./examples/number-field-filled";
import NumberFieldFilledSpinner from "./examples/number-field-filled-spinner";
import NumberFieldOutlined from "./examples/number-field-outlined";
import NumberFieldOutlinedSpinner from "./examples/number-field-outlined-spinner";
import NumberFieldStandard from "./examples/number-field-standard";
import NumberFieldStandardOutlined from "./examples/number-field-standard-outlined";
import NumberFieldStandardOutlinedSpinner from "./examples/number-field-standard-outlined-spinner";
import NumberFieldStandardSpinner from "./examples/number-field-standard-spinner";
import { Link } from "react-router-dom";

import { Breadcrumbs, Typography } from "@mui/material";
import { Grid } from "@mui/material";

export default function TextFieldPage() {
  return (
    <Grid container spacing={5}>
      <Grid size={12} className="mb-2">
        <Typography variant="h1" component="h1" className="mb-0">
          Number Field
        </Typography>
        <Breadcrumbs>
          <Link color="inherit" to="/dashboards/default">
            Home
          </Link>
          <Link color="inherit" to="/ui">
            UI Elements
          </Link>
          <Link color="inherit" to="/ui/inputs">
            Inputs
          </Link>
          <Typography variant="body2">Number Field</Typography>
        </Breadcrumbs>
      </Grid>
      <NumberFieldStandard />
      <NumberFieldStandardSpinner />
      <NumberFieldStandardOutlined />
      <NumberFieldStandardOutlinedSpinner />
      <NumberFieldFilled />
      <NumberFieldFilledSpinner />
      <NumberFieldOutlined />
      <NumberFieldOutlinedSpinner />
    </Grid>
  );
}
