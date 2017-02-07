import React, { Component } from 'react';
import { connect } from 'react-redux';

class SpinnerBox extends Component {
  render() {
    return (
      <div className="w3-modal w3-show w3-center">
        <div className="w3-modal-content w3-round">
          <div className="w3-card-8 w3-round">
            <div className="w3-container w3-padding-12 w3-light-black w3-text-white w3-round" >
              <span>
                <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
              </span>
            </div>
          </div>
        </div>
			</div>
    )
  }
}

export default connect((state)=>{return {data: state}})(SpinnerBox);