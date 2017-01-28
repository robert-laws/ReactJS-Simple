function TodoList({todos, onSetTodoStatus}) { // Stateless Component - just rendering out content
    return (
        <ul>
            {todos.map(todo => 
                <li key={todo.id}>
                    <label>
                        <input type="checkbox" checked={todo.isCompleted} onChange={e => onSetTodoStatus(todo, e.target.checked)} />
                        {todo.isCompleted ? <del>{todo.text}</del> : todo.text}
                    </label>                    
                </li>
            )}
        </ul>
    );
}

class CalculationForm extends React.Component {
    constructor(props) {
        super(props);
        this._onCalcSubmit = this._onCalcSubmit.bind(this);
    }

    render() {
        return (
            <form onSubmit={this._onCalcSubmit}>
                <input type="text" ref={input => this._calcOneText = input} />
                <span> * </span>
                <input type="text" ref={input => this._calcTwoText = input} />
                <button>Make Calculation</button>
            </form>
        );
    }

    _onCalcSubmit(e) {
        e.preventDefault();
        const valOne = this._calcOneText.value.trim();
        const valTwo = this._calcTwoText.value.trim();
        this.props.onMakeCalculation(valOne, valTwo);
    }
}

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }

    render() {
        return (
            <form onSubmit={this._onSubmit}>
                <input type="text" ref={input => this._todoText = input} />
                <button>Add Todo</button>
            </form>
        );
    }

    focusInput() {
        this._todoText.focus();
    }

    _onSubmit(e) {
        e.preventDefault();
        const todoText = this._todoText.value.trim();
        if (todoText.length == 0)
            return;
        this._todoText.value = "";
        this.props.onAddTodo(todoText);
    }
}

TodoForm.propTypes = {
    onAddTodo: React.PropTypes.func.isRequired
};

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this._nextToDoId = 1;
        this.state = {
            calcValue: 0,
            filter: { showCompleted: true },
            todos: [
                {id: this._nextToDoId++, text: "Hey", isCompleted: true},
                {id: this._nextToDoId++, text: "Greetings", isCompleted: false},
                {id: this._nextToDoId++, text: "Yello", isCompleted: true},
                {id: this._nextToDoId++, text: "Howdy!", isCompleted: false}
            ]
        }
        this._onShowCompletedChanged = this._onShowCompletedChanged.bind(this);
        this._setTodoStatus = this._setTodoStatus.bind(this);
        this._onAddTodo = this._onAddTodo.bind(this);
        this._onMakeCalculation = this._onMakeCalculation.bind(this);
    }
    
    render() {
        const {filter, todos, calcValue} = this.state;
        const filteredTodos = filter.showCompleted ? todos : todos.filter(todo => !todo.isCompleted)
        return (
            <div>
                <h2>Todo List...</h2>
                <label>
                    Show Completed
                    <input type="checkbox" checked={filter.showCompleted} onChange={this._onShowCompletedChanged}/>
                </label>
                <TodoList todos={filteredTodos} onSetTodoStatus={this._setTodoStatus} />
                <TodoForm onAddTodo={this._onAddTodo} ref={form => this._todoForm = form} />
                <hr/>
                <CalculationForm onMakeCalculation={this._onMakeCalculation} ref={form => this._calcForm = form} />
                <h3>{calcValue}</h3>
            </div>
        );
    }

    componentDidMount() {
        this._todoForm.focusInput();
    }

    _onMakeCalculation(num1, num2) {
        this.setState({
        calcValue: this.state.calcValue = parseInt(num1) * parseInt(num2)
        });
    }

    _onAddTodo(text) {
        this.setState({
            todos: this.state.todos.concat({
                id: this._nextToDoId++,
                text,
                isCompleted: false
            })
        })
    }

    _onShowCompletedChanged(e) {
        this.setState({
            filter: {showCompleted: e.target.checked}
        });
    }

    _setTodoStatus(todo, isCompleted) {
        const {todos} = this.state;
        const newTodos = todos.map(oldTodo => {
            if (oldTodo.id !== todo.id)
                return oldTodo;
            return Object.assign({}, oldTodo, {isCompleted});
        });

        this.setState({ todos: newTodos });
    }
}

ReactDOM.render(<AppComponent />, document.getElementById("application"));