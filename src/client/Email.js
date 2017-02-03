import React, { Component } from 'react';

class Email extends Component {
  render() {
    return (
      <div className='email_entry'>
        <span>Enter your email to stay up to date</span>
        <div className='email_input'>
          <input
            type='email'
            autoComplete='email'
            onChange={this.props.handleUserEmail}
          />
          <input
            type='button'
            value='Send'
            onClick={this.props.sendAppEmail}
          />
        </div>
        <span className='email_confirm'>{this.props.emailSent ? 'Email was successful' : ''}</span>
      </div>
    )
  }
}

module.exports = Email;
