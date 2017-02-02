import React, { Component } from 'react';
import './App.css';
import AutoSuggest from 'react-autosuggest';
import debounce from 'debounce';
import Email from './Email';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      searchTerm: '',
      currApp: {},
      userEmail: '',
      emailSent: false,
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
      this.setState({suggestions: data});
    })
    .catch((error) => {throw error})
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
    const emailHeader = new Headers();
    emailHeader.append('user_email', this.state.userEmail);
    fetch('/email/', {headers: emailHeader})
    .then(res => res.json())
    .then(data => {
      if(data === 'Success'){
        this.setState({emailSent: true})
      }    
    })
    .catch((error) => {throw error})
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
        <Email 
          handleUserEmail={this.handleUserEmail}
          sendAppEmail={this.sendAppEmail} 
        />
      </div>
    );
  }
}

export default App;
