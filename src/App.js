import React, { Component } from "react";
import axios from "axios";
import ListItem from "./ListItem";
import loading from "./loading.gif";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: "wash the dishes",
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };
    this.apiUrl = "https://5d24c58fd924540014930f90.mockapi.io";

    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/todos`);
    this.setState({
      todos: response.data,
      loading: false
    });
  }

  handleChange = event => {
    this.setState({
      newTodo: event.target.value
    });
  };

  async addTodo() {
    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos.push(response.data);

    this.setState({
      todos: todos,
      newTodo: ""
    });
    this.alert("Todo added Successfully");
  }

  editTodo = index => {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  };

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];

    const res = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;

    todos[this.state.editingIndex] = res.data;

    this.setState({ todos, editing: false, editingIndex: null, newTodo: "" });

    this.alert("Todo updated Successfully");
  }

  alert = notification => {
    this.setState({
      notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  };

  async deleteTodo(index) {
    const todos = this.state.todos;
    const todo = todos[index];
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    delete todos[index];

    this.setState({
      todos: todos
    });
    this.alert("Todo deleted Successfully");
  }

  render() {
    return (
      <div className="container">
        {this.state.notification && (
          <div className="alert mt-3 alert-success">
            <p className="text-center">{this.state.notification}.</p>
          </div>
        )}
        <input
          type="text"
          className=" my-4 form-control"
          placeholder="Add a new todo"
          onChange={this.handleChange}
          name="todo"
          value={this.state.newTodo}
        />

        <button
          onClick={this.state.editing ? this.updateTodo : this.addTodo}
          className="btn-success mb-3 form-control"
          disabled={this.state.newTodo.length < 5}
        >
          {this.state.editing ? "Update todo" : "Add todo"}
        </button>
        {this.state.loading && <img src={loading} alt="load" />}

        {(!this.state.editing || this.state.loading) && (
          <ul className="list-group">
            {this.state.todos.map((item, index) => {
              return (
                <ListItem
                  key={item.id}
                  item={item}
                  editTodo={() => {
                    this.editTodo(index);
                  }}
                  deleteTodo={() => {
                    this.deleteTodo(index);
                  }}
                />
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
