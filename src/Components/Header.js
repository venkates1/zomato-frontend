import React from "react";
import "../Styles/header.css";
import Modal from "react-modal";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { Link, withRouter } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import axios from "axios";
import FacebookIcon from "@material-ui/icons/Facebook";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "whitesmoke",
  },
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      loginModalIsOpen: false,
      userName: undefined,
      isLoggedIn: false,
      signinModalIsOpen: false,
      signupModalIsOpen: false,
      user: [],
      firstname: undefined,
      lastname: undefined,
      email: undefined,
      password: undefined,
    };
  }

  handleLogin = () => {
    this.setState({ loginModalIsOpen: true });
  };
  handleSignin = () => {
    this.setState({
      signinModalIsOpen: true,
      loginModalIsOpen: false,
      signupModalIsOpen: false,
    });
  };
  handleSignup = () => {
    this.setState({
      signupModalIsOpen: true,
      loginModalIsOpen: false,
      signinModalIsOpen: false,
    });
  };
  handleClose = () => {
    this.setState({
      loginModalIsOpen: false,
      signinModalIsOpen: false,
      signupModalIsOpen: false,
    });
  };

  responseGoogle = (response) => {
    this.setState({
      userName: response.profileObj.name,
      isLoggedIn: true,
      loginModalIsOpen: false,
    });
  };

  responseFacebook = (response) => {
    this.setState({
      userName: response.name,
      isLoggedIn: true,
      loginModalIsOpen: false,
    });
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false, userName: undefined });
  };

  handleNavigate = () => {
    this.props.history.push("/");
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password } = this.state;

    const inputObj = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };

    axios({
      method: "POST",
      url: "https://zomato-backend-app.herokuapp.com/signup",
      headers: { "Content-Type": "application/json" },
      data: inputObj,
    })
      .then((response) => {
        this.setState({ signupModalIsOpen: false });
        alert("User Registration Successful !!!");
      })

      .catch((error) => {
        console.log("registration error", error);
        alert("User Already Registered!!");
      });
  };

  handleSigninSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const inputObj = {
      email: email,
      password: password,
    };

    axios({
      method: "POST",
      url: "https://zomato-backend-app.herokuapp.com/signin",
      headers: { "Content-Type": "application/json" },
      data: inputObj,
    })
      .then((response) => {
        console.log(response);

        this.setState({
          userName: `${response.data.user.firstname} ${response.data.user.lastname}`,
          isLoggedIn: true,
          signinModalIsOpen: false,
        });
        alert("You have successfully logged in !!!");
      })

      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  render() {
    const {
      loginModalIsOpen,
      isLoggedIn,
      userName,
      signinModalIsOpen,
      signupModalIsOpen,
    } = this.state;

    return (
      <div>
        <div className="filter__header">
          <div
            className="filter__headerLogo"
            onClick={() => this.handleNavigate()}
          >
            e!
          </div>
          {isLoggedIn ? (
            <div className="filter__headerRight">
              <div className="header__login">{userName}</div>
              <div className="header__signup" onClick={this.handleLogout}>
                Logout
              </div>
            </div>
          ) : (
            <div className="filter__headerRight">
              <div className="header__login" onClick={this.handleLogin}>
                Login
              </div>
              <div className="header__signup" onClick={this.handleSignup}>
                Create an account
              </div>
            </div>
          )}

          <Modal isOpen={loginModalIsOpen} style={customStyles}>
            <img
              src="./images/avatar.png"
              alt="avatar"
              className="avatar__logo"
            />
            <span style={{ float: "right" }} onClick={this.handleClose}>
              <CloseIcon />
            </span>
            <div>
              <GoogleLogin
                className="google__login"
                clientId="85948368577-iisr8g7tno008o05igfvvgh8g4md902d.apps.googleusercontent.com"
                buttonText="Signin With Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
            <div className="facebook__login">
              <FacebookIcon className="facebook__icon" />
              <FacebookLogin
                appId="146323044112147"
                fields="name,email,picture"
                textButton="Continue With Facebook"
                callback={this.responseFacebook}
              />
            </div>
            <div className="alternative__option">
              <hr style={{ width: "100px" }} />
              <span>OR</span>
              <hr style={{ width: "100px" }} />
            </div>

            <div className="credentials" onClick={this.handleSignin}>
              Continue with Credentials
            </div>
          </Modal>
          <Modal isOpen={signinModalIsOpen} style={customStyles}>
            <span style={{ float: "right" }} onClick={this.handleClose}>
              <CloseIcon />
            </span>
            <img
              src="./images/avatar.png"
              alt="avatar"
              className="login__avatar"
            />

            <h3 style={{ textAlign: "center" }}>Sign-In</h3>
            <form onSubmit={this.handleSigninSubmit} className="signin">
              <div className="form__input">
                <p className="header__label">Email</p>
                <p style={{ display: "flex" }}>
                  <PersonIcon className="user__password__icons" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email..."
                    value={this.state.email}
                    onChange={this.handleChange}
                    className="signin__input"
                    required
                  />
                </p>
                <p className="header__label">Password</p>
                <p style={{ display: "flex" }}>
                  {" "}
                  <LockIcon className="user__password__icons" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password..."
                    value={this.state.password}
                    onChange={this.handleChange}
                    className="signin__input"
                    required
                  />
                </p>
                <p style={{ textAlign: "center" }}>
                  <input
                    type="submit"
                    value="Sign-In"
                    className="submit__button"
                  />
                </p>
              </div>
              <p className="signup__link" onClick={this.handleSignup}>
                New User? Create an account
              </p>
            </form>
          </Modal>
          <Modal isOpen={signupModalIsOpen} style={customStyles}>
            <span style={{ float: "right" }} onClick={this.handleClose}>
              <CloseIcon />
            </span>
            <img
              src="./images/avatar.png"
              alt="avatar"
              className="login__avatar"
            />

            <h3 style={{ textAlign: "center" }}>Sign-Up</h3>
            <form onSubmit={this.handleSubmit} className="signup">
              <p className="header__label">Firstname</p>
              <p style={{ display: "flex" }}>
                <PersonIcon className="user__password__icons" />
                <input
                  type="text"
                  name="firstname"
                  placeholder="Enter Firstname..."
                  value={this.state.firstname}
                  onChange={this.handleChange}
                  className="signup__input"
                  required
                />
              </p>
              <p className="header__label">Lastname</p>
              <p style={{ display: "flex" }}>
                <PersonIcon className="user__password__icons" />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter Lastname..."
                  value={this.state.lastname}
                  onChange={this.handleChange}
                  className="signup__input"
                  required
                />
              </p>
              <p className="header__label">Email</p>
              <p style={{ display: "flex" }}>
                <PersonIcon className="user__password__icons" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email..."
                  value={this.state.email}
                  onChange={this.handleChange}
                  className="signup__input"
                  required
                />
              </p>
              <p className="header__label">Password</p>
              <p style={{ display: "flex" }}>
                <LockIcon className="user__password__icons" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password..."
                  value={this.state.password}
                  onChange={this.handleChange}
                  className="signup__input"
                  required
                />
              </p>
              <p style={{ textAlign: "center" }}>
                <input
                  type="submit"
                  value="Sign-Up"
                  className="submit__button"
                />
              </p>
              <p className="signin__link" onClick={this.handleSignin}>
                Have an account? Sign-In
              </p>
            </form>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withRouter(Header);
