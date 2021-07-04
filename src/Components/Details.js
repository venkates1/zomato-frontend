import React from "react";
import queryString from "query-string";
import axios from "axios";
import "../Styles/details.css";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import CloseIcon from "@material-ui/icons/Close";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "wheat",
    height: "550px",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurant: {},
      resId: undefined,
      galleryModalIsOpen: false,
      menuItemsModalIsOpen: false,
      menuItems: [],
      subTotal: 0,
      formModalIsOpen: false,
      order: [],
      email: undefined,
      name: undefined,
      mobile: undefined,
      address: undefined,
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const resId = qs.restaurant;

    axios({
      method: "GET",
      url: `https://zomato-backend-app.herokuapp.com/restaurantdetailsbyid/${resId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ restaurant: response.data.restaurant, resId: resId });
      })
      .catch((err) => console.log(err));
  }

  handleModal = (state, value) => {
    const { resId, menuItems } = this.state;
    this.setState({ [state]: value });
    if (state == "menuItemsModalIsOpen" && value == true) {
      axios({
        method: "GET",
        url: `https://zomato-backend-app.herokuapp.com/menuitemsbyrestaurant/${resId}`,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          this.setState({ menuItems: response.data.items });
        })
        .catch((err) => console.log(err));
    }

    if (state == "formModalIsOpen" && value == true) {
      const order = menuItems.filter((item) => item.qty != 0);
      this.setState({ order: order });
    }
  };

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];
    if (operationType == "add") {
      item.qty++;
    } else {
      item.qty--;
    }

    items[index] = item;
    items.map((item) => {
      total += item.qty * item.price;
    });
    this.setState({ menuItems: items, subTotal: total });
  };

  handleInputChange = (event, state) => {
    this.setState({
      [state]: event.target.value,
    });
  };

  isDate(val) {
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  isObj = (val) => {
    return typeof val === "object";
  };

  stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };

  buildForm = ({ action, params }) => {
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", this.stringifyValue(params[key]));
      form.appendChild(input);
    });
    return form;
  };

  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  getData = (data) => {
    return fetch(`https://zomato-backend-app.herokuapp.com/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  payment = () => {
    const { email, subTotal, mobile } = this.state;

    var re = /\S+@\S+\.\S+/;
    var phoneno = /^([+]\d{2}[-])?\d{10}$/;
    if (re.test(email) && phoneno.test(mobile)) {
      //payment API call
      this.getData({ amount: subTotal, email: email }).then((response) => {
        var information = {
          action: "https://securegw-stage.paytm.in/order/process",
          params: response,
        };
        this.post(information);
      });
    } else {
      alert("Email and Phone is not valid");
      alert("Enter +91- in mobile no");
    }
  };
  //payment API call

  render() {
    const {
      restaurant,
      galleryModalIsOpen,
      menuItemsModalIsOpen,
      menuItems,
      subTotal,
      formModalIsOpen,
      order,
    } = this.state;
    return (
      <div>
        <div>
          <img
            src={restaurant.image}
            alt="No Image, Sorry for the Inconvinience"
            width="100%"
            height="400px"
          />
          <button
            className="button"
            onClick={() => this.handleModal("galleryModalIsOpen", true)}
          >
            Click to see Image Gallery
          </button>
        </div>
        <div className="heading">{restaurant.name}</div>
        <button
          className="btn-order"
          onClick={() => this.handleModal("menuItemsModalIsOpen", true)}
        >
          Place Order
        </button>

        <div className="tabs">
          <div className="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div className="content">
              <div className="about">About this place</div>
              <div className="head">Cuisine</div>
              <div className="value">
                {restaurant && restaurant.cuisine
                  ? restaurant.cuisine.map((item) => `${item}, `)
                  : null}
              </div>
              <div className="head">Average Cost</div>
              <div className="value">
                &#8377; {restaurant.min_price} for two people(approx)
              </div>
            </div>
          </div>

          <div className="tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
            <label for="tab-2">Contact</label>

            <div className="content">
              <div className="head">Phone Number</div>
              <div className="value">{restaurant.contact_number}</div>
              <div className="head">{restaurant.name}</div>
              <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
            </div>
          </div>
        </div>
        <Modal isOpen={galleryModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("galleryModalIsOpen", false)}
            >
              <CloseIcon />
            </div>
            <Carousel showThumbs={false}>
              {restaurant && restaurant.thumb
                ? restaurant.thumb.map((path) => {
                    return (
                      <div>
                        <img src={path} height="400px" width="400px" />
                      </div>
                    );
                  })
                : null}
            </Carousel>
          </div>
        </Modal>
        <Modal isOpen={menuItemsModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("menuItemsModalIsOpen", false)}
            >
              <CloseIcon />
            </div>
            <div>
              <h3 className="restaurant-name">{restaurant.name}</h3>
              {menuItems.map((item, index) => {
                return (
                  <div
                    style={{
                      width: "44rem",
                      marginTop: "10px",
                      marginBottom: "10px",
                      borderBottom: "1px solid black",
                      paddingBottom: "10px",
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "43rem", margin: "auto" }}
                    >
                      <div
                        className="row"
                        style={{ paddingLeft: "10px", paddingBottom: "10px" }}
                      >
                        <div
                          className="col-xs-9 col-sm-9 col-md-9 col-lg-9 "
                          style={{ paddingLeft: "10px", paddingBottom: "10px" }}
                        >
                          <span className="card-body">
                            <h5 className="item-name">{item.name}</h5>
                            <h5 className="item-price">&#8377;{item.price}</h5>
                            <p className="item-descp">{item.description}</p>
                          </span>
                        </div>
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                          {" "}
                          <img
                            className="card-img-center title-img"
                            src={`../${item.image}`}
                            style={{
                              height: "75px",
                              width: "75px",
                              "border-radius": "20px",
                              marginTop: "10px",
                            }}
                          />
                          {item.qty == 0 ? (
                            <div>
                              <button
                                className="add-button"
                                onClick={() => this.addItems(index, "add")}
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <div className="add-number">
                              <button
                                onClick={() => this.addItems(index, "subtract")}
                                className="minus__button"
                              >
                                -
                              </button>
                              <span
                                style={{
                                  backgroundColor: "white",
                                  padding: "3px 10px",
                                  position: "relative",
                                  left: "-5px",
                                }}
                              >
                                {item.qty}
                              </span>
                              <button
                                onClick={() => this.addItems(index, "add")}
                                className="plus__button"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                className="card"
                style={{
                  width: "44rem",
                  marginTop: "10px",
                  marginBottom: "10px",
                  margin: "auto",
                }}
              ></div>
              <div className="itemtotal__pay">
                <h3 className="item-total">SubTotal : {subTotal}</h3>

                <button
                  className="btn btn-danger pay"
                  onClick={() => {
                    this.handleModal("formModalIsOpen", true);
                    this.handleModal("menuItemsModalIsOpen", false);
                  }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal isOpen={formModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("formModalIsOpen", false)}
            >
              <CloseIcon />
            </div>
            <div>
              <h2 className="payment__restaurantName">{restaurant.name}</h2>
            </div>
            <h5>Name</h5>
            <input
              type="text"
              placeholder="Enter your name..."
              className="payment__input"
              onChange={(event) => this.handleInputChange(event, "name")}
            />
            <h5>Email</h5>
            <input
              type="text"
              placeholder="Enter your email..."
              className="payment__input"
              onChange={(event) => this.handleInputChange(event, "email")}
            />
            <h5>Mobile Number</h5>
            <input
              type="text"
              placeholder="Enter your mobile number..."
              className="payment__input"
              onChange={(event) => this.handleInputChange(event, "mobile")}
            />
            <h5>Address</h5>
            <textarea
              type="text"
              placeholder="Enter address..."
              className="payment__address"
              cols="62"
              rows="5"
              onChange={(event) => this.handleInputChange(event, "address")}
            />
            <h3 style={{ textAlign: "center" }}>Review Your Orders</h3>
            <div className="order__heading">
              <h4>Items</h4>
              <h4>Quantity</h4>
            </div>
            {order.map((item) => {
              return (
                <div className="ordered__items">
                  <div className="order__itemName">{item.name}</div>
                  <div className="order__itemQty">{item.qty}</div>
                </div>
              );
            })}
            <div className="proceed__payment">
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                <span>Amount: </span>
                <span>&#8377;{subTotal}</span>
              </div>
              <button
                className="btn btn-danger"
                style={{ float: "right" }}
                onClick={this.payment}
              >
                Proceed
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Details;
