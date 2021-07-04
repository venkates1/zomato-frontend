import React from "react";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";
import axios from "axios";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealtypes: [],
    };
  }

  componentDidMount() {
    sessionStorage.clear();
    // location API Call
    axios({
      method: "GET",
      url: "https://zomato-backend-app.herokuapp.com/locations",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => this.setState({ locations: response.data.locations }))
      .catch();

    // quicksearches API Call
    axios({
      method: "GET",
      url: "https://zomato-backend-app.herokuapp.com/mealtypes",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => this.setState({ mealtypes: response.data.mealTypes }))
      .catch();
  }

  render() {
    const { locations, mealtypes } = this.state;
    return (
      <div>
        <Wallpaper ddlocations={locations} />
        <QuickSearch quicksearch={mealtypes} />
      </div>
    );
  }
}

export default Home;
