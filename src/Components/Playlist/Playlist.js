import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    //Reads new playlist name 
    handleNameChange(event){
        this.props.onNameChange(event.target.value);
    }

    render(){
        return (
            <div className="Playlist">
            <input onChange={this.handleNameChange} defaultValue={'New Playlist'} maxLength="20"/>
            <button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
            <br/>
            <TrackList class="boxin" onRemove={this.props.onRemove} isRemoval={true} tracks={this.props.playlistTracks}/> 
            </div>
        );
    }
}

