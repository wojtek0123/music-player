import { Component, ErrorInfo, ReactNode } from "react";
import styles from "../styles/NotFound.module.css";
import ErrorImage from "../assets/warning.svg";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // logErrorToMyService(error, info.componentStack);
    console.error(`Uncaught error: ${error} ${info}`);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.container}>
          <img className={styles.image} src={ErrorImage} alt="Error. A man is thinking was gone wrong!" />
          <h1>Sorry... There was an error!</h1>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
