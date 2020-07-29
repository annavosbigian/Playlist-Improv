import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Newly Improvised",
      playlistTracks: []
  }
    this.improviseTracks = this.improviseTracks.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //Automatically sends the user to the Spotify login the first time they open
  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }

  //Adds the chosen track and calls the song improv function and adds those to playlist
  improviseTracks(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(playlistTrack => playlistTrack.id === track.id)){
      return;
    }
    Spotify.recommendSimilarSongs(track).then(results => {
      const combinedTracks = tracks.concat(results);
      this.setState({playlistTracks: combinedTracks});
    });
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  //Delete track from playlist array
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  //Changes playlist name
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  //Sends name and uris (uniform resource indicators) and clears the playlist
  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    console.log("finished trackuris");
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>{
      this.setState({
        playlistName: 'Newly Improvised',
        playlistTracks: []
      });
    });

  }

  //Sends search term request to Spotify & adds response to search results column
  search(searchTerm){
    Spotify.search(searchTerm).then(results => {
      this.setState({searchResults: results});
    });
  }

  render(){
    return (
      <div >
        <h1>Playlist Improv</h1>
        <p>Give a tune, generate a playlist of similar songs</p>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.improviseTracks} />
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
  );
}
}

