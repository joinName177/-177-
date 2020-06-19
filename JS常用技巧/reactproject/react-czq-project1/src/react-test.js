import React, { useState, useEffect } from 'react';

//时钟组件
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timerID)
    }
    tick() {
        this.setState({
            date: new Date()
        })
    }
    render() {
        return (
            <div>
                <h1>WOLF的小时钟!</h1>
                <h2>当前时间:{this.state.date.toLocaleTimeString()}.</h2>
            </div>
        )
    }
}

//开关组件
class Toggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isToggleOn: true
        }
        this.handleClick = this.handleClick.bind(this);// 为了在回调中使用 `this`，这个绑定是必不可少的
    }
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }
    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        )
    }
}

//模拟用户登录
function UserGreeting(props) {
    return <h1>{props.name}</h1>;
}
function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreeting name="欢迎光临" />;
    }
    return <UserGreeting name="请登录..." />;
}

function LogButton(props) {
    return (
        <button onClick={props.onClick}>
            {props.name}
        </button>
    );
}

function LogingTips(props) {
    if (props.isLoggedIn) {
        return null //组件的 render 方法中返回 null 并不会影响组件的生命周期,componentDidUpdate 依然会被调用
    }
    return (
        <div>
            <h1>登录提示：XXXXXXXXXXXXXXXXXXXXXXXXXXXXX</h1>
        </div>
    )
}


class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = { isLoggedIn: false };
    }

    handleLoginClick() {
        this.setState({ isLoggedIn: true });
    }

    handleLogoutClick() {
        this.setState({ isLoggedIn: false });
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
            <div>
                <LogingTips isLoggedIn={isLoggedIn} />
                <Greeting isLoggedIn={isLoggedIn} />
                {isLoggedIn
                    ? <LogButton name="退出" onClick={this.handleLogoutClick} />
                    : <LogButton name="登录" onClick={this.handleLoginClick} />}
            </div>
        );
    }
}
//封装一个列表组件
function ListItem(props) {
    return <li>{props.value}</li>
}
function NumberList(props) {
    const arr = props.numbers;
    return (
        <ul>{arr.map((item) => <ListItem key={item} value={item} />)}</ul>
    )
}

//-------
class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '1'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('提交的名字: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>{this.state.value}</h2>
                <label>
                    名字:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="提交" />
            </form>
        );
    }
}

//状态提升 练习
//多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去
function BoilingVerdict(props) {
    return props.celsius >= 100 ? <p>热水.</p> : <p>凉水.</p>;
}
class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { temperature: '', scale: 'c' };
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    }
    handleCelsiusChange(temperature) {
        this.setState({ scale: 'c', temperature });
    }

    handleFahrenheitChange(temperature) {
        this.setState({ scale: 'f', temperature });
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
        return (
            <div>
                <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
                <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
                <BoilingVerdict celsius={parseFloat(celsius)} />
            </div>
        )
    }
}

function toCelsius(fahrenheit) {//摄氏度与华氏度之间相互转换的函数
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {//摄氏度与华氏度之间相互转换的函数
    return (celsius * 9 / 5) + 32;
}
function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // this.state = { temperature: '' };
    }

    handleChange(e) {
        // this.setState({ temperature: e.target.value });
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature} onChange={this.handleChange} />
            </fieldset>
        );
    }
}


//=====================
class OuterClickExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false }
        this.toggleContainer = React.createRef();
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);

    }

    componentDidMount() {
        window.addEventListener('click', this.onClickOutsideHandler);
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.onClickOutsideHandler);
    }

    onClickHandler() {
        this.setState(currentState => ({
            isOpen: !currentState.isOpen
        }));
    }
    onClickOutsideHandler(event) {
        if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    }
    render() {
        return (
            <div ref={this.toggleContainer}>
                <button onClick={this.onClickHandler}>Select an option</button>
                {this.state.isOpen && (
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                )}
            </div>
        )
    }
}
class BlurExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false };
        this.timeOutId = null;

        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    onClickHandler() {
        this.setState(currentState => ({
            isOpen: !currentState.isOpen
        }));
    }

    // 我们在下一个时间点使用 setTimeout 关闭弹窗。
    // 这是必要的，因为失去焦点事件会在新的焦点事件前被触发，
    // 我们需要通过这个步骤确认这个元素的一个子节点
    // 是否得到了焦点。
    onBlurHandler() {
        this.timeOutId = setTimeout(() => {
            this.setState({
                isOpen: false
            });
        });
    }

    // 如果一个子节点获得了焦点，不要关闭弹窗。
    onFocusHandler() {
        clearTimeout(this.timeOutId);
    }

    render() {
        // React 通过把失去焦点和获得焦点事件传输给父节点
        // 来帮助我们。
        return (
            <div onBlur={this.onBlurHandler}
                onFocus={this.onFocusHandler}>
                <button onClick={this.onClickHandler}
                    aria-haspopup="true"
                    aria-expanded={this.state.isOpen}>
                    Select an option
          </button>
                {this.state.isOpen && (
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                )}
            </div>
        );
    }
}
//HOOK
function Example() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    )
}

function Counter({ initialCount }) {
    const [count, setCount] = useState(initialCount);
    return (
        <div>
            Count: {count}
            <button onClick={() => setCount(initialCount)}>Reset</button>
            <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
            <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
        </div>
    );
}

function Entrance(props) {
    const numbers = [1, 2, 3, 4, 5]
    return (
        <div>
            <Clock />
            <Toggle />
            <LoginControl />
            <NumberList numbers={numbers} />
            <NameForm />
            <Calculator />
            <OuterClickExample />
            <BlurExample />
            <BlurExample />
            <BlurExample />
            <Example />
            <Counter/>
        </div>
    )
}


export default Entrance
