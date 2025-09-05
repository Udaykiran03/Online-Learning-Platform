import React from "react";
import ErrorPage from "../pages/Error";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught!");
    console.error(error);
    console.info(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    } else {
      return this.props.children;
    }
  }
}
