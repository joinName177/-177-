import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


//父组件
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
  render() {
    const status = 'Next player: X';
    return (
      <div>
        <div className='status'>{status}</div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// //子组件 生成可点击的棋盘按钮
class Square extends React.Component {
  // 在 JavaScript class 中，每次你定义其子类的构造函数时，都需要调用 super 方法。
  constructor(props) {
    super(props)//在所有含有构造函数的的 React 组件中，构造函数必须以 super(props) 开头。
    this.state = {
      value: null
    }
  }
  render() {
    return (
      <button
        className='square'
        onClick={() => { this.setState({ value: 'X' }) }}
      >
        {/* {this.props.value} */this.state.value}
      </button>
    );
  }
}


//井字琪练习
class Game extends React.Component {
  render() {
    return (
      <div className='game'>
        <div className='game-board'>
          <Board />
        </div>
        <div className='game-info'>
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  // <React.StrictMode>
  // <App />
  // </React.StrictMode>,
  <Game />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
