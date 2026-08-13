import {
  Component,
  Fragment,
  type ErrorInfo,
  type PropsWithChildren,
} from "react";
import RootErrorFallback from "./RootErrorFallback";
import { isLazyChunkError } from "../errors/error.utils";

interface RootErrorBoundaryProps extends PropsWithChildren {
  reloadPage?: () => void;
}

interface RootErrorBoundaryState {
  error: Error | null;
  retryKey: number;
}

export class RootErrorBoundary extends Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  state: RootErrorBoundaryState = {
    error: null,
    retryKey: 0,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("Unhandled React error", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState((prev) => ({
      error: null,
      retryKey: prev.retryKey + 1,
    }));
  };

  handleReload = () => {
    if (this.props.reloadPage) {
      this.props.reloadPage();
      return;
    }

    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <RootErrorFallback
          isChunkError={isLazyChunkError(this.state.error)}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
