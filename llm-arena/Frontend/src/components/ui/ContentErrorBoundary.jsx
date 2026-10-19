import { Component } from 'react'

/**
 * Narrow error boundary for rich content rendering. A failure inside (e.g.
 * unexpected markdown input) degrades to a readable notice instead of
 * unmounting the entire application.
 */
export default class ContentErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('[ContentErrorBoundary]', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
          This content could not be rendered.
        </p>
      )
    }
    return this.props.children
  }
}
