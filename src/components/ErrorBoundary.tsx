import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service if needed
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-8">
          <h1 className="text-2xl font-bold mb-2">Une erreur est survenue</h1>
          <p className="mb-4">Désolé, une erreur inattendue a été détectée dans cette section de l'application.</p>
          <pre className="bg-red-100 rounded p-2 text-xs overflow-x-auto max-w-xl mb-4">{this.state.error?.message}</pre>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Recharger la page</button>
        </div>
      );
    }
    return this.props.children;
  }
}
