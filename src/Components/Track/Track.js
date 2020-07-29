import React from 'react';
import './Track.css';

export class Track extends React.Component{

    constructor(props){
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    //If in tracklist tab, lets user add to playlist with +
    //If in playlist tab, lets user remove with -
    renderAction(){
        if (this.props.isRemoval){
            return (<button onClick={this.removeTrack} className="Track-action">-</button>);
        }
        return (<button onClick={this.addTrack} className="Track-action">+</button>);
    };

    //Adds to playlist
    addTrack(){
        this.props.onAdd(this.props.track);
    }

    //Removes from playlist
    removeTrack(){
        this.props.onRemove(this.props.track);
    }

    render(){
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        );
    }
}

