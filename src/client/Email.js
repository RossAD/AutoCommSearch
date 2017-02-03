import React, { Component } from 'react';

class Email extends Component {
  render() {
    return (
      <div className='email_entry'>
        <div className='email_send'>
          <input
            className='email_input'
            type='email'
            autoComplete='email'
            placeholder='Enter Email Address'
            onChange={this.props.handleUserEmail}
          />
          <input
            className='email_button'
            type='button'
            value='Send'
            onClick={this.props.sendAppEmail}
          />
        </div>
      </div>
    )
  }
}

module.exports = Email;
