import React, { Component } from 'react';
import './App.css';
import AutoSuggest from 'react-autosuggest';
import debounce from 'debounce';
import Header from './Header';
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

  // Functions for Auto suggest
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
        <img
          src={suggestion.artworkUrl60}
          alt='app'
          className='app_img'
        />
        <span className='app_name'>
          {suggestion.trackName}
        </span>
      </span>
    )
  }

  getSuggestionValue(suggestion) {
    this.setState({currApp: suggestion, emailSent: false});
    return suggestion.trackName;
  }

  handleSearchTerm = (event, { newValue }) => (
    this.setState({searchTerm: newValue})
  )

  onSuggestionFetchRequested = ({ value }) => (
    this.debouncedGetAppInfo(value)
  )

  onSuggestionClearRequested = () => (
    this.setState({suggestions: []})
  )

  // Functions for email
  handleUserEmail(event) {
    this.setState({userEmail: event.target.value});
  }

  sendAppEmail(){
    const emailHeader = new Headers();
    emailHeader.append('user_email', this.state.userEmail);
    emailHeader.append('app_name', this.state.currApp.trackName);
    emailHeader.append('app_img', this.state.currApp.artworkUrl60);
    emailHeader.append('app_link', this.state.currApp.trackViewUrl);
    emailHeader.append('Content-Type', 'application/json');
    const emailOpt = {
      method: 'POST',
      headers: emailHeader,
      mode: 'cors',
      cache: 'default',
    };

    fetch('/email/', emailOpt)
    .then(res => res.json())
    .then(data => {
      console.log('options: ', data);
      const results = data.results.total_accepted_recipients;
      if(results >= 1){
        this.setState({emailSent: true});
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
        <Header />
        <div className="search_email">
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
            emailSent={this.state.emailSent}
          />
        </div>
      </div>
    );
  }
}

export default App;
