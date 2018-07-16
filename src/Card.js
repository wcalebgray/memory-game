import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlipCard from '@kennethormandy/react-flipcard';
import logo from './logo.svg';
import './Card.css';

class Card extends Component {
  constructor(props){
    super(props);
    this.handleOnFlip = this.handleOnFlip.bind(this);
  }

  handleOnFlip() {
    this.props.handleOnFlip(this.props.index);
  }

  render() {
    return(
      <div className="col-xs-3">
        <FlipCard
          flipped={this.props.isFlipped}
          key={this.props.index}
          >
          <div className="table-wrapper" onClick={this.handleOnFlip}>
            <div className="table-item">
              <img src={logo} className="App-logo table-item" alt="logo" />
            </div>
          </div>
          <div className="table-wrapper">
            <div className="table-item">{this.props.value}</div>
          </div>
        </FlipCard>
      </div>
    )
  }
}

Card.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired
}

export default Card