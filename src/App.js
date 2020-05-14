import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";

import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    console.log("sadsadsa");
    super();
    // const params = this.getHashParams();
    // const token = params.access_token;

    let parsed = queryString.parse(window.location.search);
    let token = parsed.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
      console.log("logged in");
    } else {
      console.log("epic fail");
    }

    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
      // savedAlbumstemp: { album1: "", album2: "" },
      savedAlbumArts: [],
      savedAlbumNames: [],
    };
  }

  // getHashParams() {
  //   var hashParams = {};
  //   var e,
  //     r = /([^&;=]+)=?([^&;]*)/g,
  //     q = window.location.hash.substring(1);
  //   e = r.exec(q);
  //   while (e) {
  //     hashParams[e[1]] = decodeURIComponent(e[2]);
  //     e = r.exec(q);
  //   }
  //   return hashParams;
  // }

  // getNowPlaying() {
  //   spotifyApi.getMyCurrentPlaybackState().then((response) => {
  //     this.setState({
  //       nowPlaying: {
  //         name: response.item.name,
  //         albumArt: response.item.album.images[0].url,
  //       },
  //     });
  //   });
  // }

  getSaved = () => {
    spotifyApi.getMySavedAlbums({ limit: 50 }).then((response) => {
      const savedAlbumArts = [];
      const savedAlbumNames = [];
      console.log(response.items.length);
      for (var i = 0; i < response.items.length; i++) {
        savedAlbumArts.push(response.items[i].album.images[0].url);
        savedAlbumNames.push(
          response.items[i].album.artists[0].name +
            " - " +
            response.items[i].album.name
        );
      }
      this.setState({
        savedAlbumArts,
        savedAlbumNames,
      });
    });
  };

  renderAlbums = () => {
    let albumList = [];
    for (var i = 0; i < this.state.savedAlbumArts.length; i++) {
      albumList.push(
        <div style={{ height: 300 }}>
          <img
            src={this.state.savedAlbumArts[i]}
            style={{ height: 200, float: "left" }}
          />
          <select id="rating">
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <textarea id="w3mission" rows="4" cols="50"></textarea>
          {/* <input type="text" id="comments" name="comments" /> */}
          <body style={{ width: 200 }}>{this.state.savedAlbumNames[i]}</body>
        </div>
      );
    }
    return albumList;
  };

  render() {
    return (
      <div className="App">
        <body>{this.renderAlbums()}</body>
        {this.state.loggedIn && (
          <button onClick={() => this.getSaved()}>Check Saved Albums</button>
        )}
        <a href="http://localhost:8888/login" style={{ marginLeft: 500 }}>
          {" "}
          Login to Spotify{" "}
        </a>
      </div>
    );
  }
}

export default App;
