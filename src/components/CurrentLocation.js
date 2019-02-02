import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '30em',
    height: '750px',
    borderRadius: '5px',
  }
}

export class CurrentLocation extends React.Component {
  constructor(props) {
    console.log(this.state);
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: { //these are connecting to the componentDidMount to grab currrent location and set them as state
        lat: lat,
        lng: lng
      }
    };
    // console.log(props);
    //props includes all default props listed at the bottom, a NewProps value that includes our bathroom array from firebase, and children array that includes 2 symbols and an array of symbols that include the bathroom array, and a maps object nested inside a google object
  }

    recenterMap() {
     const map = this.map;  //map is now map object
     const current = this.state.currentLocation;

     const google = this.props.google;
     const maps = google.maps;

     if (map) {
       let center = new maps.LatLng(current.lat, current.lng);
       map.panTo(center);
     }
    }

  //   componentDidMount() {
  //   if (this.props.centerAroundCurrentLocation) {
  //     if (navigator && navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(pos => {
  //         const coords = pos.coords;
  //         this.setState({
  //           currentLocation: {
  //             lat: coords.latitude,
  //             lng: coords.longitude
  //           }
  //         });
  //       });
  //     }
  //   }
  //   this.loadMap();
  // }

    loadMap() {
      if (this.props && this.props.google) {
        const { google } = this.props;
        const maps = google.maps;

        const mapRef = this.refs.map;


        // reference to the actual DOM element
        const node = ReactDOM.findDOMNode(mapRef);

        let { zoom } = this.props;
        const { lat, lng } = this.state.currentLocation;
        const center = new maps.LatLng(lat, lng);
        const mapConfig = Object.assign(
          {},
          {
            center: center,
            zoom: zoom
          }
        );

        // maps.Map() is constructor that instantiates the map
        this.map = new maps.Map(node, mapConfig);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.google !== this.props.google) {
        this.loadMap();
      }
      if (prevState.currentLocation !== this.state.currentLocation) {
        this.recenterMap();
      }
    }

    renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
        currentLocation: this.state.currentLocation
      });
    });
  }


  render() {
     const style = Object.assign({}, mapStyles.map);
    return (
      <div>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLocation: state.currentLocation,
  };
};

export default connect(mapStateToProps)(CurrentLocation);

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 45.5197,
    lng: -122.6671
  },
  centerAroundCurrentLocation: false,
  visible: true
};
