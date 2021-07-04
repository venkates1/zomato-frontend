import React from 'react';
import '../Styles/quicksearch.css';
import { withRouter } from 'react-router-dom';

class QuickSearch extends React.Component {
    handleClick = (mealtypeId, name) => {
        const locationId = sessionStorage.getItem('locationId');
        
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&mealname=${name}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&mealname=${name}`);
        }
    }

   render(){
    const { quicksearch } = this.props;
    return (
      <div>
        <div className="quick-search">Quick Searches</div>
        <p className="quicksearch__paragraph">Discover restaurants by type of meal</p>
  
        <div className="container-fluid quick-container">
          <div className="row">
            {quicksearch.map((item) => {
              return (
                <div className="col-sm-12 col-md-6 col-lg-4 quicksearch__item" onClick={() => this.handleClick(item.meal_type, item.name)}>
                  <div className="quick-search-items">
                    <a href="#">
                      <img className="quicksearch__image" src={item.image} alt="image2" />
                    </a>
                    <div
                      className="quicksearch__sidetext"
                      style={{ display: "inline-block" }}
                    >
                      <div className="side-text1">{item.name}</div>
                      <div className="side-text2">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
}

export default withRouter(QuickSearch);