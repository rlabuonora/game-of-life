import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {  t: 0,
		    on: false
                 };
  }
  render() {
    return (
      <div className="App">
	<div className="container">
	    <div className="row">
	      <Generation t={this.state.t} />
	    </div>
	    <div className="row">
                <Grid rows={30} cols={50} cellSize={15} />
	    </div>
	    <div className="row">
		<PlayButton />
		<StopButton />
		<ShuffleButton />
	    </div>
	</div>
      </div>
    );
  }
}

class Generation extends Component {
  render() {
      return (
        <p>Generation: {this.props.t}</p>
      );
  }
}

class Grid extends Component {

  constructor(props) {
    super(props);
    this.state = { data: this.createArray(this.props.cols, this.props.rows) };
  }

  createArray(width, height) {
    // create an array of false
    var a = new Array(height);
    for (var i = 0; i < height; i++) { 
      a[i] = new Array(width);
      for (var j = 0; j < width; j++) {
        a[i][j] = false;
      }
    }
    return a;
  }
  getDims() {
      var width = this.props.cellSize * this.props.cols;
      var height = this.props.cellSize * this.props.rows;
      return { width: width,
               height: height };
  }

  render() {
      var cells = [];
      this.state.data.forEach(function(row, i) {
	  row.forEach(function(cell, j) {
	    cells.push(<Cell live={cell} cellSize={this.props.cellSize} coords={ {x:i, y:j} } key={ i + ", " + j } />);
	  }.bind(this));
      }.bind(this));
      var dims = this.getDims();
      return (
        <svg width={dims.width} height={dims.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
	      { cells }
	</svg>
      );
  }
}

class Cell extends Component {
  getColor() {
      return this.props.live ? "black" : "white";
  }
  getSVGPos() { 
  // transform grid coordinates (same as boolean array) to SVG coordinates per
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions
      var svg_x_pos = this.props.coords.y * this.props.cellSize
      var svg_y_pos = this.props.coords.x * this.props.cellSize
      return { x: svg_x_pos, y: svg_y_pos }
  }
  render() {
      var svgPos = this.getSVGPos();
      return (
	      <rect x={ svgPos.x } 
                    y={ svgPos.y } 
	            width={ this.props.cellSize } 
                    height={ this.props.cellSize } 
	            fill={ this.getColor() } 
                    stroke="black" 
                    strokeWidth="1"/>
      );
  }
}

class PlayButton extends Component {
  render() {
      return (
        <button className="btn btn-primary">Play</button>
      );
  }
}

class StopButton extends Component {
  render() {
      return (
        <button className="btn btn-primary">Stop</button>
      );
  }
}

class ShuffleButton extends Component {
  render() {
      return (
        <button className="btn btn-primary">Shuffle</button>
      );
  }
}

export default App;
