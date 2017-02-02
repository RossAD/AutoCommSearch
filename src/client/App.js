import React, { Component } from 'react';
import './App.css';
import AutoSuggest from 'react-autosuggest';
import debounce from 'debounce';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      searchTerm: '',
      currApp: {},
      userEmail: '',
      }

      this.handleUserEmail = this.handleUserEmail.bind(this);
      this.getAppInfo = this.getAppInfo.bind(this);
      this.debouncedGetAppInfo = debounce(this.getAppInfo, 1000);
      this.renderSuggestion = this.renderSuggestion.bind(this);
      this.getSuggestionValue = this.getSuggestionValue.bind(this);
      this.sendAppEmail = this.sendAppEmail.bind(this);
  }

  getAppInfo() {
    const reqHeader = new Headers();
    reqHeader.append('SearchTerm', this.state.searchTerm)
    fetch('/appsuggest/', {headers: reqHeader})
    .then(res => res.json())
    .then(data => {
      console.log('Returned Data from server: ', data);
      this.setState({suggestions: data.results});
    })
  }
  
  renderSuggestion(suggestion) {
    return (
      <span>
        <img src={suggestion.artworkUrl60}
          alt='app'
        />
        {suggestion.trackName}
      </span>
    )
  }

  getSuggestionValue(suggestion) {
    this.setState({currApp: suggestion});
    return suggestion.trackName;
  }

  handleSearchTerm = (event, { newValue }) => (
    this.setState({searchTerm: newValue})
  )

  onSuggestionFetchRequested = ({ value }) => {
    this.debouncedGetAppInfo(value);
  }

  onSuggestionClearRequested = () => (
    this.setState({suggestions: []})
  )

  handleUserEmail(event) {
    this.setState({userEmail: event.target.value})
  }

  sendAppEmail(){
    console.log('Future API call to server')
  }

  render() {
    const inputProps = {
      placeholder: 'Type App to Search for',
      onChange: this.handleSearchTerm,
      value: this.state.searchTerm,
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Autocompletion Search Bar</h2>
        </div>
        <p className="App-intro">
          Search for a mobile app you would like more information on.
        </p>
        <AutoSuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default App;
