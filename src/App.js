import React, {Component} from 'react';
import Card from './Card';
import _ from 'lodash';
import Radium, {StyleRoot} from 'radium';
import { bounce, headShake, flash } from 'react-animations';
import shuffle from 'shuffle-array';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.handleOnFlip = this.handleOnFlip.bind(this);
    this.reset = this.reset.bind(this);
    this.numberOfCards = 24
    this.state = {
      cards: this.generateCards(),
      isLocked: false,
      buttonText: 'Reset',
      gameOver: false
    }
  }

  reset() {
    this.setState({
      cards: this.generateCards(),
      isLocked: false,
      buttonText: 'Reset',
      gameOver: false
    })
  }

  generateCards(){
    let cards = [];
    for(let i=0; i<this.numberOfCards; i++) {
      cards.push({
        value: Math.floor(i/2) + 1,
        isFlipped: false,
        isNotAMatch: false,
        isMatched: false
      })
    }
    return shuffle(cards);
  }

  checkIfGameOver() {
    // find any card that is not matched
    let notMatchedIndex = _.findIndex(this.state.cards, (card) => {
      return !card.isMatched;
    })

    if (notMatchedIndex === -1) {
      // Game is over, prompt user to reset
      this.setState({
        buttonText: 'Play Again?',
        gameOver: true
      })
    }
  }

  handleOnFlip(index) {
    let cards = this.state.cards;

    // if state is locked or the clicked card is already matched, perform no operation
    if (this.state.isLocked || cards[index].isMatched) {
      return;
    }

    // flip card
    cards[index].isFlipped = true;
    this.setState({cards, isLocked: true});

    // determine if any other cards are flipped to compare; if not, unlock and return
    let firstFlippedCardIndex = _.findIndex(this.state.cards, (card, cardIndex) => {
      return cardIndex !== index && card.isFlipped && !card.isMatched;
    })
    if (firstFlippedCardIndex < 0) {
      this.setState({isLocked: false});
      return;
    }

    if(cards[index].value !== cards[firstFlippedCardIndex].value){
      // set isNotAMatch for animation
      setTimeout(()=>{
        cards[index].isNotAMatch = true;
        cards[firstFlippedCardIndex].isNotAMatch = true;
        this.setState({cards});
      },500)
      
      // no match, flip both back over after pausing for user feedback
      setTimeout(()=>{
        cards[index].isFlipped = false;
        cards[firstFlippedCardIndex].isFlipped = false;
        cards[index].isNotAMatch = false;
        cards[firstFlippedCardIndex].isNotAMatch = false;
        this.setState({cards, isLocked: false});
      },1000);
    } else {
      // match! set isMatched and check to see if game is over
      // pause for animation
      setTimeout(()=>{
        cards[index].isMatched = true;
        cards[firstFlippedCardIndex].isMatched = true;
        this.setState({cards, isLocked: false});
        this.checkIfGameOver();
      },500)
    }
  }

  renderCards(){
    const styles = {
      headShake: {
        animation: 'x 1s',
        animationName: Radium.keyframes(headShake, 'headShake')
      },
      bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(bounce, 'bounce')
      }
    }
    
    return this.state.cards.map((card, index)=>{
      const isMatched = card.isMatched ? styles.bounce : null;
      const isFlippedAndNotMatched = card.isNotAMatch ? styles.headShake : null;
       return(
        <div key={index} style={[isMatched, isFlippedAndNotMatched]}>
          <Card 
            index={index}
            value={card.value}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            handleOnFlip={this.handleOnFlip}
            />
        </div>
      )
    })
  }  

  render() {
    const styles = {
      bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(bounce, 'bounce')
      },
      flash: {
        animation: 'x 2s infinite',
        animationName: Radium.keyframes(flash, 'flash')
      }
    }
    const bounceIfGameOver = this.state.gameOver ? styles.bounce : null;
    const flashIfGameOver = this.state.gameOver ? styles.flash : null;

    return(
      <StyleRoot>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Test Your Memory!</h1>
          </header>
          <div className="row container" style={bounceIfGameOver}>
            {this.renderCards()}
          </div>
          <button className="App-reset" style={flashIfGameOver} onClick={this.reset}>{this.state.buttonText}</button>
        </div>
      </StyleRoot>
    )
  }
}

export default App;