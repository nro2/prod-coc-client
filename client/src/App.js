import React, {Component} from "react";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      text2: ""
    };

    this.getItem = this.getItem.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  getItem(e){
    axios.get('http://127.0.0.1:8080').then((response)=>{
      let newText = response.data.firstName;
      this.setState({
        text: newText
      });
    });

    this._aName.value = "";

    e.preventDefault()
  }

  addItem(e){
    axios.post('http://127.0.0.1:8080', {firstName: this._firstName.value, lastName: this._lastName.value, phoneNum:this._phoneNum.value}).then((response)=>{
      let newText = response.data;
      this.setState({
        text2: newText
      });
      this._firstName.value = "";
      this._lastName.value = "";
      this._phoneNum.value = "";
    });

    e.preventDefault()
  }



  render() {
    return (
        <div className="App">
          <div className="header">
            <form onSubmit={this.addItem}>
              <p>{this.state.text2}</p>
              <input ref = {(a) => this._firstName = a}
                     placeholder="First Name">
              </input>
              <input ref = {(a) => this._lastName = a}
                     placeholder="Last Name">
              </input>
              <input ref = {(a) => this._phoneNum = a}
                     placeholder="Phone Number">
              </input>
              <button type="submit">Post</button>
            </form>
            <form onSubmit={this.getItem}>
              <p>{this.state.text}</p>
              <input ref = {(a) => this._aName =a}
                         placeholder="Enter first name">
              </input>

              <button type="submit">Get</button>
            </form>
            </div>
        </div>
    );
  }
}

export default App;
