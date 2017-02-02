import React, { Component } from 'react';

class Email extends Component {
  render() {
    return (
      <div className='email-entry'>
        <span>Your Email</span>
        <input
          type='email'
          autoComplete='email'
          onChange={this.props.handleUserEmail}
        />
        <input type='button' value='Send' onClick={this.props.sendAppEmail} />
      </div>
    )
  }
}

module.exports = Email;
