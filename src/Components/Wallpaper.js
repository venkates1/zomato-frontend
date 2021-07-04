import React from "react";
import "../Styles/wallpaper.css";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { withRouter } from "react-router-dom";
class Wallpaper extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      suggestions: [],
      searchText: undefined,
    };
  }

  handleLocationChange = (event) => {
    const locationId = event.target.value;
    sessionStorage.setItem("locationId", locationId);

    axios({
      method: "GET",
      url: `https://zomato-backend-app.herokuapp.com/locations/getRestByLocation/${locationId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>
        this.setState({ restaurants: response.data.restaurants })
      )
      .catch();
  };

  handleSearch = (event) => {
    const { restaurants } = this.state;
    const searchText = event.target.value;
    let filteredRestaurants;
    if (searchText === "") {
      filteredRestaurants = [];
    } else {
      filteredRestaurants = restaurants.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    this.setState({ suggestions: filteredRestaurants, searchText: searchText });
  };

  handleItemClick = (item) => {
    this.props.history.push(`/details?restaurant=${item._id}`);
  };

  renderSuggestions = () => {
    let { suggestions, searchText } = this.state;
    if (suggestions.length === 0 && searchText) {
      return (
        <ul>
          <li>No Matches</li>
        </ul>
      );
    }
    return (
      <ul>
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => this.handleItemClick(item)}
          >{`${item.name}, ${item.city}`}</li>
        ))}
      </ul>
    );
  };
  render() {
    const { ddlocations } = this.props;

    return (
      <div>
        <img
          src="images/homepageimg.png"
          alt="img"
          className="wallpaper__image"
        />
        <div className="logo">e!</div>
        <div className="banner-text">
          Find the best restaurants, cafés and bars
        </div>
        <div className="location-search">
          <select
            style={{ color: "blue" }}
            onChange={this.handleLocationChange}
          >
            <option value="0">Select</option>
            {ddlocations.map((items) => {
              return (
                <option
                  value={items.location_id}
                >{`${items.name}, ${items.city}`}</option>
              );
            })}
          </select>
        </div>
        <div className="restaurant-search">
          <div>
            <input
              type="text"
              name="search-box"
              placeholder="search for restaurants"
              onChange={this.handleSearch}
            />
            {this.renderSuggestions()}
          </div>
          <div className="restaurant__search__icon">
            <SearchIcon className="search__icon" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
