import { Component, type PropsWithChildren } from "react";
import { Alert, Typography } from "@mui/material";

interface PdfRenderErrorBoundaryState {
  error: Error | null;
}

export default class PdfRenderErrorBoundary extends Component<PropsWithChildren, PdfRenderErrorBoundaryState> {
  state: PdfRenderErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PdfRenderErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    void window.electronAPI.notifyPdfReady(`PDF renderer failed: ${error.message}`).catch((notifyError: unknown) => {
      console.error("Failed to report PDF renderer error:", notifyError);
    });
  }

  render() {
    if (this.state.error) {
      return (
        <Alert severity='error'>
          <Typography>PDF renderer failed: {this.state.error.message}</Typography>
        </Alert>
      );
    }

    return this.props.children;
  }
}