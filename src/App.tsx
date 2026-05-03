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
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      results: [],
      loading: false,
      error: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchData('')
  }

  fetchData = (term: string) => {
    this.setState({ loading: true, error: null })
    
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        const filteredResults = data.results.filter((pokemon: Pokemon) =>
          pokemon.name.toLowerCase().includes(term.toLowerCase())
        )
        this.setState({ results: filteredResults, loading: false })
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
      <ErrorBoundary>
        <Header />
        <main>
          <Search onSearch={this.handleSearch} />
          <CardList results={results} loading={loading} error={error} />
        </main>
      </ErrorBoundary>
    )
  }
}

export default App