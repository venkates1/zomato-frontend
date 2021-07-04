import React from "react";
import "../Styles/filter.css";
import queryString from "query-string";
import axios from "axios";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      location: undefined,
      mealtype: undefined,
      cuisine: [],
      hcost: undefined,
      lcost: undefined,
      sort: undefined,
      page: undefined,
      locations: [],
      mealname: undefined,
    };
  }

  componentDidMount() {
    // Capturing values from query-string
    const qs = queryString.parse(this.props.location.search); // mealtype=1&location=1
    const location = qs.location;
    const mealtype = qs.mealtype;
    const mealname = qs.mealname;

    // filter API Call

    const inputObj = {
      mealTypeId: mealtype,
      locationId: location,
    };

    axios({
      method: "POST",
      url: "https://zomato-backend-app.herokuapp.com/filter",
      headers: { "Content-Type": "application/json" },
      data: inputObj,
    })
      .then((response) =>
        this.setState({
          restaurants: response.data.restaurants,
          location: location,
          mealtype: mealtype,
          mealname: mealname,
        })
      )
      .catch();

    axios({
      method: "GET",
      url: "https://zomato-backend-app.herokuapp.com/locations",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => this.setState({ locations: response.data.locations }))
      .catch();
  }

  apiCall = (inputObj) => {
    axios({
      method: "POST",
      url: "https://zomato-backend-app.herokuapp.com/filter",
      headers: { "Content-Type": "application/json" },
      data: inputObj,
    })
      .then((response) =>
        this.setState({
          restaurants: response.data.restaurants,
          lcost: inputObj.lcost,
          hcost: inputObj.hcost,
          sort: inputObj.sort,
          page: inputObj.page,
        })
      )
      .catch();
  };

  handleCostChange = (lcost, hcost) => {
    const { location, mealtype, sort, page, cuisine } = this.state;
    const inputObj = {
      sort: sort,
      mealTypeId: mealtype,
      locationId: location,
      lcost: lcost,
      hcost: hcost,
      page: page,
      cuisine: cuisine.length == 0 ? undefined : cuisine,
    };
    this.apiCall(inputObj);
  };

  handleSortChange = (sort) => {
    const { location, mealtype, lcost, hcost, page, cuisine } = this.state;
    const inputObj = {
      sort: sort,
      mealTypeId: mealtype,
      locationId: location,
      lcost: lcost,
      hcost: hcost,
      page: page,
      cuisine: cuisine.length == 0 ? undefined : cuisine,
    };

    this.apiCall(inputObj);
  };

  handleLocationChange = (event) => {
    const location = event.target.value;
    const { mealtype, sort, hcost, lcost, page, cuisine } = this.state;

    const inputObj = {
      sort: sort,
      mealTypeId: mealtype,
      locationId: location,
      lcost: lcost,
      hcost: hcost,
      page: page,
      cuisine: cuisine.length == 0 ? undefined : cuisine,
    };
    this.apiCall(inputObj);
  };

  filterByCuisine = (cuisineId) => {
    const { mealtype, location, sort, hcost, lcost, page, cuisine } =
      this.state;

    if (cuisine.indexOf(cuisineId) == -1) {
      cuisine.push(cuisineId);
    } else {
      const index = cuisine.indexOf(cuisineId);
      cuisine.splice(index, 1);
    }

    const inputObj = {
      sort: sort,
      mealTypeId: mealtype,
      locationId: location,
      lcost: lcost,
      hcost: hcost,
      page: page,
      cuisine: cuisine.length == 0 ? undefined : cuisine,
    };
    this.apiCall(inputObj);
  };
  handlePagination = (page) => {
    const { mealtype, location, sort, hcost, lcost, cuisine } = this.state;
    const inputObj = {
      page: page,
      sort: sort,
      mealTypeId: mealtype,
      locationId: location,
      lcost: lcost,
      hcost: hcost,
      cuisine: cuisine.length == 0 ? undefined : cuisine,
    };
    this.apiCall(inputObj);
  };

  handleNavigate = (resId) => {
    this.props.history.push(`/details?restaurant=${resId}`);
  };

  render() {
    const { restaurants, locations, mealname } = this.state;

    return (
      <div className="filter">
        <div className="filter__heading">{mealname} Places in </div>
        <div className="container-fluid filter__container">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-3 left">
              <div className="filters">
                Filters
                <span
                  style={{ float: "right" }}
                  data-toggle="collapse"
                  data-target="#filters"
                >
                  <ExpandMoreIcon className="expand__more" />
                </span>
              </div>
              <div id="filters" className="collapse show">
                <div className="select-location">Select Location</div>
                <div className="dropdown">
                  <select onChange={this.handleLocationChange}>
                    <option value="0">Select Location</option>
                    {locations.map((item) => {
                      return (
                        <option
                          value={item.location_id}
                        >{`${item.name}, ${item.city}`}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="cuisine">Cuisine</div>
                <div className="items">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      onChange={() => this.filterByCuisine("North Indian")}
                    />
                    <span className="checkmark"></span>North Indian
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      onChange={() => this.filterByCuisine("South Indian")}
                    />
                    <span className="checkmark"></span>South Indian
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      onChange={() => this.filterByCuisine("Chinese")}
                    />
                    <span className="checkmark"></span>Chinese
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      onChange={() => this.filterByCuisine("Fast Food")}
                    />
                    <span className="checkmark"></span>Fast Food
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      onChange={() => this.filterByCuisine("Street Food")}
                    />
                    <span className="checkmark"></span>Street Food
                  </label>
                </div>
                <div className="costfortwo">Cost For Two</div>
                <div className="items2">
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="cft"
                      onChange={() => this.handleCostChange(1, 500)}
                    />
                    <span className="radio_text">Less than &#8377; 500</span>
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="cft"
                      onChange={() => this.handleCostChange(500, 1000)}
                    />

                    <span className="radio_text">
                      &#8377; 500 to &#8377; 1000
                    </span>
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="cft"
                      onChange={() => this.handleCostChange(1000, 1500)}
                    />

                    <span className="radio_text">
                      &#8377; 1000 to &#8377; 1500
                    </span>
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="cft"
                      onChange={() => this.handleCostChange(1500, 2000)}
                    />

                    <span className="radio_text">
                      &#8377; 1500 to &#8377; 2000
                    </span>
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="cft"
                      onChange={() => this.handleCostChange(2000, 5000)}
                    />

                    <span className="radio_text">&#8377; 2000+</span>
                  </label>
                </div>
                <div className="sort">Sort</div>
                <div className="items3">
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => this.handleSortChange(1)}
                    />

                    <span className="radio_text">Price low to high</span>
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => this.handleSortChange(-1)}
                    />

                    <span className="radio_text">Price high to low</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-9 right">
              {restaurants && restaurants.length > 0 ? (
                restaurants.map((item) => {
                  return (
                    <div
                      className="righttb"
                      onClick={() => this.handleNavigate(item._id)}
                    >
                      <div className="right__top">
                        <div className="fimage">
                          <img
                            src={item.image}
                            alt="image"
                            width="100px"
                            height="100px"
                            className="item__image"
                          />
                        </div>
                        <div className="side-text">
                          <div className="restaurant_name">{item.name}</div>
                          <div className="fort">{item.locality}</div>
                          <div className="address">{item.city}</div>
                        </div>
                      </div>
                      <hr />
                      <div className="right__topBottom">
                        <div
                          className="bottom-text"
                          style={{ display: "inline-block" }}
                        >
                          CUISINES:
                          <br />
                          COST FOR TWO:
                        </div>
                        <div
                          className="bts-text"
                          style={{ display: "inline-block" }}
                        >
                          {item.cuisine.map((cuis) => `${cuis}, `)}
                          <br /> &#8377;{item.min_price}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-records">No Records Found...</div>
              )}

              {/*pagination*/}

              <div className="pagination">
                <a href="#">&lsaquo;</a>
                <a
                  href="#"
                  className="active"
                  onClick={() => this.handlePagination(1)}
                >
                  1
                </a>
                <a href="#" onClick={() => this.handlePagination(2)}>
                  2
                </a>
                <a href="#" onClick={() => this.handlePagination(3)}>
                  3
                </a>
                <a href="#" onClick={() => this.handlePagination(4)}>
                  4
                </a>
                <a href="#" onClick={() => this.handlePagination(5)}>
                  5
                </a>
                <a href="#">&rsaquo;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
