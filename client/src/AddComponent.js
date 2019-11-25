import React, {Component} from "react";
import axios from 'axios';

class AddComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            text: ''
        };

        this.getItem = this.getItem.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    getItem(e){
        axios.get('http://127.0.0.1:8080',{params: {firstName: this._aName.value}})
            .then((response)=>{
                let user = {
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNum: response.data.phoneNum
                };
                this.setState({
                    text: user.lastName
                });
            })
            .catch((err)=>{
                this.setState({
                    text: "Bad Request"
                });
                console.log(err)
            });

        this._aName.value = "";

        e.preventDefault()
    }

    addItem(e){
        axios.post('http://127.0.0.1:8080', {firstName: this._firstName.value, lastName: this._lastName.value, phoneNum:this._phoneNum.value})
            .then((response)=>{
                let newText = response.data;
                this.setState({
                    text2: newText
                });
                this._firstName.value = "";
                this._lastName.value = "";
                this._phoneNum.value = "";
            })
            .catch((err)=>{
                this.setState({
                    text2: "Insert was not successful"
                });
                console.log(err)
            });

        e.preventDefault()
    }
    render(){
        return(
            <div className="Add">
                <h1>Add staff here</h1>
                <form onSubmit={this.addItem}>
                    <input ref = {(a) => this._firstName = a}
                           placeholder="First Name">
                    </input>
                    <input ref = {(a) => this._lastName = a}
                           placeholder="Last Name">
                    </input>
                    <input ref = {(a) => this._phoneNum = a}
                           placeholder="Phone Number">
                    </input>
                    <button type="submit">Add</button>
                </form>
            </div>
        )
    }
}

export default AddComponent;