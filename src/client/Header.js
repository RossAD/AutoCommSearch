import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <div className='App_header'>
        <div className="App_title">
          Autocompletion Search Bar
        </div>
        <p className="App_intro">
          Search for a mobile app you would like more information on.
        </p>
        <p>Enter your email to stay up to date</p>
        <p className='email_confirm'>{this.props.emailSent ? 'Email was sent successfully' : ''}</p>
      </div>
    )
  }
}

module.exports = Header;
