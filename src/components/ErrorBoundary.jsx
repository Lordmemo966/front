import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4" dir="rtl">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-wood-dark mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-wood-warm/70 text-sm mb-6 leading-relaxed">
              {this.state.error?.message || 'خطأ غير معروف'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gold">
              🔄 إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
