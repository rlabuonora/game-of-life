import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    var initialGrid = this.emptyGrid(this.props.cols, this.props.rows);
    this.state = {
	  t: 0,
	  on: false,
	  data: initialGrid
    };
  }
    
  neighbors(i,j) { // devuelve un array con los vecinos de la cell(i, j)
    var result = [];
    for (var offset_1 = -1; offset_1 <= 1; offset_1++) {
      for (var offset_2 = -1; offset_2 <= 1; offset_2 ++) {
	  if (!(offset_1 === 0 && offset_2 === 0) &&
	      this.indexInBounds(i+offset_1, j+offset_2))
	    result.push({x: i+offset_1, y: j+offset_2});
      }
    }
    return result;
  }

  liveNeighbors(i, j) { // devuelve cuantos vecinos vivos tiene la cell(i, j)
      var neighs = this.neighbors(i,j);
      var live = neighs
	  .map(function(coords) {
	      return this.state.data[coords.x][coords.y]
	  }
	  .bind(this))
	  .reduce(function(acc, elt) {return elt ? acc+1 : acc}, 0);

    return live;
  }
    indexInBounds(i, j) { // Helper para calcular los neighbors,
	                 //  devuelve true si cell(i, j) esta dentro de la grid
      return (i >= 0 && i < this.props.rows-1) &&
	  (j>=0 && j<this.props.cols-1);
  }

    step(oldGrid) { // calcula la grid(t+1) en base a grid(t)
	            // iterando por todas las cells y contando cuantas estan vivas
    var newGrid = this.emptyGrid();
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        var live = this.liveNeighbors(i, j);
	// si cell(i, j) esta viva
          if (oldGrid[i][j]) {
	  // si tiene 3 o 2 vecinas vivas queda prendida
	  newGrid[i][j] = (live === 3 || live === 2);
        }
        // si tiene tres vecinas vivas se prende
        else {
	  newGrid[i][j] = (live === 3);
        }
      }
    }
    return newGrid;
  }

  toggleCell(nested_arr, i, j) {
    return nested_arr.map(function(arr, idx) {
      if (idx !== i) return arr;
        else return arr.map(function(cell, idx) {
          if (idx !== j) return cell;
          else return !cell;
      });
    })
  }

  emptyGrid() { 
    var width = this.props.cols;
    var height = this.props.rows;
    var a = new Array(height);
      
    for (var i = 0; i < height; i++) { 
      a[i] = new Array(width);
      for (var j = 0; j < width; j++) {
        a[i][j] = false;
      }
    }
    return a;
  }

  handleClick(x, y) {
    var new_data = this.toggleCell(this.state.data, x, y);
    this.setState({ data: new_data });

  }
  handlePlay() {
    if (this.state.on) {
      this.pause();
    } else {
      this.start();
    }
  }
  stop() {
    var initialGrid = this.emptyGrid(this.props.cols, this.props.rows);
    clearInterval(this.state.intervalId);
    this.setState({ 
        on: false,
	t: 0,
	data: initialGrid,
    });
  }
  start() {
      var intervalId = setInterval(this.tick.bind(this),
				   this.props.speed);
    this.setState({ on: true, 
	            intervalId: intervalId });
  }

  pause() {
    clearInterval(this.state.intervalId);
    this.setState({ on: false });
  }

  tick() {
    var t = this.state.t + 1;
    var grid = this.state.data;
    var newGrid = this.step(grid);

      this.setState({
	  t : t,
          data: newGrid
      });
  }

  render() {
    return (
      <div className="App">

	    <div className="row">
  	      <Generation t={this.state.t} />
	      <PlayButton onClick={this.handlePlay.bind(this)}
                          on={this.state.on}
	                  className="play" />
              <StopButton className="stop" stop={this.stop.bind(this)} />
	    </div>
	    <div className="row">
	    
            <Grid handleClick={this.handleClick.bind(this)}
	          data={this.state.data}
                  rows={this.props.rows}
     	          cols={this.props.cols}
               	  cellSize={25}
	    />

	    <div className="row">
	      
	    </div>
	</div>
      </div>
    );
  }
}

class Generation extends Component {
  render() {
      return (
        <h3>Generación: {this.props.t}</h3>
      );
  }
}

class Grid extends Component {
  getDims() {
      var width = this.props.cellSize * this.props.cols;
      var height = this.props.cellSize * this.props.rows;
      return { width: width,
               height: height };
  }

  render() {
      var cells = [];
      this.props.data.forEach(function(row, i) {
	  row.forEach(function(cell, j) {
	    cells.push(<Cell 
		         handleClick={this.props.handleClick.bind(this)}
		         live={cell}
		         cellSize={this.props.cellSize}
		         coords={ {x:i, y:j} }
		         key={ i + ", " + j }
		       />);
	  }.bind(this));
      }.bind(this));
      var dims = this.getDims();
      return (
              <svg width={dims.width}
	           height={dims.height}
      	           version="1.1"
	           xmlns="http://www.w3.org/2000/svg">
	      { cells }
	      </svg>);
  }
}

class Cell extends Component {
  getColor() {
      return this.props.live ? "black" : "white";
  }
  getSVGPos() { 
  // Transforma las coordenadas de la grilla a coordenadas del SVG
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions
      var svg_x_pos = this.props.coords.y * this.props.cellSize
      var svg_y_pos = this.props.coords.x * this.props.cellSize
      return { x: svg_x_pos, y: svg_y_pos }
  }
  onRectClick(event) {
    event.preventDefault();
    this.props.handleClick(this.props.coords.x, 
			   this.props.coords.y);
  }
  render() {
      var svgPos = this.getSVGPos();
      return (
	      <rect 
	            onClick={this.onRectClick.bind(this)}
	            x={ svgPos.x } 
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

  icon() {
      return this.props.on ? 
	  <i className="fa fa-pause" aria-hidden="true"></i> :
	  <i className="fa fa-play" aria-hidden="true"></i>
  }
  render() {
      return (
              <button onClick={this.props.onClick.bind(this)}
	              className="btn btn-primary"> {this.icon() }
	      </button>
      );
  }
}

class StopButton extends Component {
  render() {
      return (
              <button onClick={this.props.stop}
	              className="btn btn-primary"> 
	        <i className="fa fa-stop" aria-hidden="true"></i>
	      </button>
      );
  }
}

export default App;
