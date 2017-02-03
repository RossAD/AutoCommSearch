import React, { Component } from 'react';
import Load_img from './Loading_icon_with_fade.svg';

class Loader extends Component {
  render() {
    return(
      <div>
        <img
          className={this.props.loading ? 'loading' : 'not_loading'}
          src={Load_img}
          alt='loading'
        />
      </div>
    )
  }
}

module.exports = Loader;
