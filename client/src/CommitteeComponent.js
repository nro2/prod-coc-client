import React, {Component} from "react";
import axios from 'axios';

class CommitteeComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            committees: [],
            text: ''
        }

        this.getCommittees = this.getCommittees.bind(this);
        this.createCommittee = this.createCommittee.bind(this);
    }

    getCommittees(){
        axios.get('http://127.0.0.1:8080/committees')
            .then((response)=>{
                let committeeArray = response.data.committees;
                this.setState({
                    committees: committeeArray
                })
            })
            .catch((err)=>{
                this.setState({
                    text: 'Could not retrieve committees'
                });
                console.log(err)
            })
    }

    createCommittee(item){
        return <li key={item.key}>{item.text}</li>
    }

    componentDidMount() {
        this.getCommittees();
    }

    render(){
        let items = this.state.committees;
        let listItems = items.map(this.createCommittee);
        return(
            <div className="Committees">
                <h1>List of Committees</h1>
                {listItems}
            </div>
        )
    }
}

export default CommitteeComponent;