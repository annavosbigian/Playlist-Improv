import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            term: ''
        };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.enterSearch = this.enterSearch.bind(this);
    }

    //Takes searched string
    handleTermChange(event){
        this.setState({term: event.target.value});
    }

    //Sends string to search
    search(){
        this.props.onSearch(this.state.term);
    }

    enterSearch(event) {
        if (event.key === "Enter") {
          this.search();
        }
      }

    render(){
        return (
            <div className="SearchBar">
            <input onChange={this.handleTermChange} onKeyPress={this.enterSearch} placeholder="Enter a song, album or artist" maxLength="25"/>
            <button onClick={this.search} className="SearchButton">SEARCH</button>
            </div>
        );
    }
}

