import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    console.log("sadsadsa");
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    console.log(token);
    if (token) {
      spotifyApi.setAccessToken(token);
      console.log("logged in");
    }

    // if (token) {
    //   spotifyApi.setAccessToken(token);
    //   this.getSaved();
    //   console.log("logged in");
    //   console.log(token);
    // } else {
    //   console.log("epic fail");
    // }

    this.state = {
      loggedIn: token ? true : false,
      albumArts: [],
      albumNames: [],
      searchResultsArts: [],
      searchResultsNames: [],
    };
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  searchForAlbums = (query) => {
    query.replace(" ", "%20");
    spotifyApi.searchAlbums(query).then((response) => {
      const searchResultsArts = [];
      const searchResultsNames = [];
      for (var i = 0; i < response.albums.items.length; i++) {
        searchResultsArts.push(response.albums.items[i].images[0].url);
        searchResultsNames.push(
          response.albums.items[i].artists[0].name +
            " - " +
            response.albums.items[i].name
        );
      }
      this.setState({
        searchResultsArts,
        searchResultsNames,
      });
    });
  };

  getSaved = () => {
    spotifyApi.getMySavedAlbums({ limit: 50 }).then((response) => {
      const albumArts = this.state.albumArts;
      const albumNames = this.state.albumNames;

      for (var i = 0; i < response.items.length; i++) {
        const art = response.items[i].album.images[0].url;
        const name =
          response.items[i].album.artists[0].name +
          " - " +
          response.items[i].album.name;
        if (
          this.state.albumArts.includes(art) === false &&
          this.state.albumNames.includes(name) === false
        ) {
          albumArts.push(response.items[i].album.images[0].url);
          albumNames.push(
            response.items[i].album.artists[0].name +
              " - " +
              response.items[i].album.name
          );
        }
      }
      this.setState({
        albumArts,
        albumNames,
      });
    });
  };

  renderAlbums = () => {
    let albumList = [];
    for (var i = 0; i < this.state.albumArts.length; i++) {
      albumList.push(
        <div style={{ height: 300 }}>
          <hr></hr>
          <p>{this.state.albumNames[i]}</p>
          <img
            src={this.state.albumArts[i]}
            style={{
              height: 200,
              position: "absolute",
              left: 10,
            }}
          />
          <select>
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
          <textarea rows="4" cols="40" spellCheck="false"></textarea>
          {this.renderDeleteButton(i)}
        </div>
      );
    }
    return albumList;
  };

  renderSearchResults = () => {
    let albumList = [];
    for (var i = 0; i < this.state.searchResultsArts.length; i++) {
      albumList.push(
        <div style={{ height: 120 }}>
          <p>{this.state.searchResultsNames[i]}</p>
          <img
            src={this.state.searchResultsArts[i]}
            style={{
              height: 50,
              position: "absolute",
              left: 10,
              float: "left",
            }}
          />
          {this.renderAddButton(i)}
        </div>
      );
    }
    return albumList;
  };

  renderAddButton = (i) => {
    return (
      <button className="addbutton" onClick={() => this.handleAdd(i)}>
        Add To List
      </button>
    );
  };

  renderDeleteButton = (i) => {
    return (
      <button className="deletebutton" onClick={() => this.handleDelete(i)}>
        Remove From List
      </button>
    );
  };

  handleAdd = (i) => {
    const albumNames = this.state.albumNames;
    const albumArts = this.state.albumArts;
    const art = this.state.searchResultsArts[i];
    const name = this.state.searchResultsNames[i];
    if (
      this.state.albumArts.includes(art) === false &&
      this.state.albumNames.includes(name) === false
    ) {
      console.log("unique entry");
      albumNames.push(name);
      albumArts.push(art);
    }
    this.setState({
      albumArts,
      albumNames,
    });
  };

  handleDelete = (i) => {
    const albumNames = this.state.albumNames;
    const albumArts = this.state.albumArts;
    const art = this.state.albumArts[i];
    const name = this.state.albumNames[i];
    albumArts.splice(i, 1);
    albumNames.splice(i, 1);
    this.setState({
      albumArts,
      albumNames,
    });
  };

  openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
  }

  // href="http://spotlist-backend.herokuapp.com"

  render() {
    return (
      <div className="App">
        <h1 className="mainheader">my spotify list</h1>

        {this.state.loggedIn && (
          <div>
            <button className="tabbutton" onClick={() => this.openTab("List")}>
              My List
            </button>
            <button
              className="tabbutton"
              onClick={() => this.openTab("Search")}
            >
              Search
            </button>
          </div>
        )}
        <div id="List" className="tab">
          {this.state.loggedIn && this.state.albumArts.length > 0 && (
            <div>
              <h1 style={{ float: "left" }}>Album</h1>
              <h1 style={{ float: "left" }}>Rating</h1>
              <h1 style={{ float: "left" }}>Comments</h1>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </div>
          )}
          {this.state.loggedIn && this.state.albumArts.length === 0 && (
            <h1>
              You currently have no albums in your list! Add your saved albums
              or search for albums to add.
            </h1>
          )}
          {this.renderAlbums()}
          {this.state.loggedIn && (
            <div>
              <button onClick={() => this.getSaved()}>
                Add My Saved Albums To List
              </button>
            </div>
          )}
        </div>
        <div id="Search" className="tab" style={{ display: "none" }}>
          {this.state.loggedIn && (
            <div className="topnav">
              <input
                type="text"
                id="SEARCHBAR"
                placeholder="Search for albums.."
              />
              <button
                className="searchbutton2"
                onClick={() =>
                  this.searchForAlbums(
                    document.getElementById("SEARCHBAR").value
                  )
                }
              >
                Search
              </button>
            </div>
          )}
          {this.renderSearchResults()}
        </div>
        {this.state.loggedIn === false && (
          <a href="http://spotlist-backend.herokuapp.com"> Login to Spotify </a>
        )}
      </div>
    );
  }
}

export default App;
