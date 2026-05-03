import { Component } from 'react'
import Header from './components/Header'
import Search from './components/Search'
import CardList from './components/CardList'
import ErrorBoundary from './components/ErrorBoundary'

interface Pokemon {
  name: string
  url: string
}

interface AppState {
  results: Pokemon[]
  loading: boolean
  error: string | null
  searchTerm: string
  throwError: boolean

}

interface AppViewProps {
  results: Pokemon[]
  loading: boolean
  error: string | null
  throwError: boolean
  onSearch: (term: string) => void
  onTriggerError: () => void
}

class AppView extends Component<AppViewProps> {
  render() {
    const { results, loading, error, throwError, onSearch, onTriggerError } = this.props

    if (throwError) {
      throw new Error('Test error triggered!')
    }

    return (
      <>
        <Header />
        <main>
          <Search onSearch={onSearch} />
          <CardList results={results} loading={loading} error={error} />
        </main>
        <button className="error-trigger" onClick={onTriggerError}>
          Trigger Error
        </button>
      </>
    )
  }
}

class App extends Component<{}, AppState> {
  declare setState: Component<{}, AppState>['setState']

  state: AppState = {
    results: [],
    loading: false,
    error: null,
    searchTerm: '',
    throwError: false,
  }

  triggerError = () => {
    this.setState({ throwError: true })
  }

  handleBoundaryReset = () => {
    this.setState({ throwError: false })
  }

  componentDidMount() {
    this.fetchData('')
  }

  fetchData = (term: string) => {
  this.setState({ loading: true, error: null })

  fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      const filtered = term
        ? data.results.filter((p: Pokemon) =>
            p.name.toLowerCase().includes(term.toLowerCase())
          )
        : data.results
      this.setState({ results: filtered, loading: false })
    })
    .catch(error => {
      this.setState({ error: error.message, loading: false })
    })
}

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term })
    this.fetchData(term)
  }

  render() {
    const { results, loading, error } = this.state

    return (
      <ErrorBoundary onReset={this.handleBoundaryReset}>
        <AppView
          results={results}
          loading={loading}
          error={error}
          throwError={this.state.throwError}
          onSearch={this.handleSearch}
          onTriggerError={this.triggerError}
        />
      </ErrorBoundary>
    )
  }
}

export default App