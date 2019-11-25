import React, {Component} from "react";
import axios from 'axios';
import "./stylesheets/Get.css";

class GetComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            text: '',
            firstName: '',
            lastName: '',
            phoneNum: ''
        };

        this.getItem = this.getItem.bind(this);
    }
    getItem(e){
        axios.get('http://127.0.0.1:8080',{params: {firstName: this._aName.value}})
            .then((response)=>{
                this.setState({
                    text: "Success",
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNum: response.data.phoneNum
                });
            })
            .catch((err)=>{
                this.setState({
                    text: "Bad Request",
                    firstName: '',
                    lastName: '',
                    phoneNum: ''
                });
                console.log(err)
            });

        this._aName.value = "";

        e.preventDefault()
    }

    render(){
        return(
            <div className="Get">
                <h1>Get staff info here</h1>
                <p>Message:{this.state.text}</p>
                <form onSubmit={this.getItem}>
                    <input ref = {(a)=> this._aName = a}
                           placeholder="Enter first name here">
                    </input>
                    <button type="submit">Submit</button>
                </form>
                <p>First Name: {this.state.firstName}</p>
                <p>Last Name:{this.state.lastName}</p>
                <p>Phone Number: {this.state.phoneNum}</p>
            </div>
        )
    }
}

export default GetComponent;