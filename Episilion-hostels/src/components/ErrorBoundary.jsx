import { Component } from "react";
import ErrorPage from "./ErrorPage";

/**
 * Catches render-time errors anywhere below it and swaps in a recovery screen
 * instead of letting the browser show a blank white page.
 *
 * React unmounts the whole tree when a render throws and no boundary is
 * present, so this sits at the root of the app to keep one bad page from
 * taking down the whole site.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the details in the console so a developer can diagnose it, while
    // the visitor only ever sees the friendly recovery screen.
    console.error("Uncaught error in the app tree:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) {
      return children;
    }

    return (
      <ErrorPage
        error={error}
        onRetry={this.handleReset}
        onReload={this.handleReload}
      />
    );
  }
}

export default ErrorBoundary;
