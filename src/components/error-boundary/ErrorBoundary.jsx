import React from 'react';
import ErrorDisplay from '../error-display';
import { registerError } from '../../state/store/error';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  componentDidCatch(error, info){
    this.setState({
      hasError: true,
    })
    this.props.dispatch(registerError('FATAL'));
  }

  render() {
    return (
      this.state.hasError ? <ErrorDisplay /> : this.props.children
    )
  }
}

export default ErrorBoundary;