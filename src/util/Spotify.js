let token;
const client_id = "6e7ff685b81e464aa3f1dd4cc8f8452e";
const redirect_uri =  "https://annavosbigian.github.io/playlist-improv/";

const Spotify = {
    //logs the user into Spotify and gets their approval to edit the app
    getAccessToken(){
        if (token){
            return token;
        }
        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiration = window.location.href.match(/expires_in=([^&]*)/);
        if (accessToken && expiration){
            token = accessToken[1];
            const expire = Number(expiration[1]);
            window.setTimeout(() => token = '', expire * 1000);
            window.history.pushState('Access Token', null, '/');
            return token;
        }
        else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
        }
        },
    //contacts the spotify api and returns results matching the search term
    search(searchTerm){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
          }).then(response => {
                  return response.json();}
            ).then(response => {
                if (!response.tracks){
                    return [];
                }
                return response.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri}));
              
          });
    },
    //creates and saves a new playlist to the user's account
    savePlaylist(playlistName, trackURIs){
        if (!playlistName || !trackURIs){
            console.log("name is " + playlistName);
            return;
        }
        console.log("in save playlist");
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let user_id;
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers})
            .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(response => {
            user_id = response.id;
            return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
        }).then(response => {console.log("I am here"); return response.json()})
            .then(response => {
                console.log("hi there!");
                const playlist_id = response.id;
                console.log("track uris are " + trackURIs);
                return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                });
            });
        });
    }, 
    //contacts the spotify api with the chosen song and returns 10 similar songs
    recommendSimilarSongs(track){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_tracks=${track.id}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
          }).then(response => {
                  return response.json();}
            ).then(response => {
                if (!response.tracks){
                    return [];
                }
                return response.tracks.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    uri: track.uri}));            
          });
    }
};

export default Spotify;
