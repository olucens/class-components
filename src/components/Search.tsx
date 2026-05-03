import { Component, type ChangeEvent, type KeyboardEvent } from 'react'

interface SearchProps {
  onSearch: (term: string) => void
}

interface SearchState {
  inputValue: string
}

class Search extends Component<SearchProps, SearchState> {
    constructor(props: SearchProps) {
        super(props)
        
        const saved = localStorage.getItem('searchTerm') ?? '';
        this.state = {
            inputValue: saved,
        }
    }

    componentDidMount() {
        const { inputValue } = this.state;
        if (inputValue) {
            this.props.onSearch(inputValue);
        }
    }

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: e.target.value })
    }

    handleSearch = () => {
        const trimmed = this.state.inputValue.trim();

        const saved = localStorage.getItem('searchTerm') ?? '';
        if (trimmed && trimmed === saved) {
            return;
        }
        
        localStorage.setItem('searchTerm', trimmed);
        this.props.onSearch(trimmed);
    }

    handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    }

    render() {
        return (
            <div className="search">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={this.state.inputValue}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
                <button onClick={this.handleSearch}>Search</button>
            </div>
        )
    }
}

export default Search;