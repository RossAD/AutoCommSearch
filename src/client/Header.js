import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <div>
        <div className="App-header">
          Autocompletion Search Bar
        </div>
        <p className="App-intro">
          Search for a mobile app you would like more information on.
        </p>
      </div>
    )
  }
}

module.exports = Header;
