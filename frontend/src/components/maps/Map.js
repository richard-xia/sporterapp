import React, { Component } from 'react'
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Circle,
  InfoWindow,
  Marker,
} from 'react-google-maps'
import Geocode from 'react-geocode'
import Autocomplete from 'react-google-autocomplete'
import { Button } from 'react-bootstrap'

Geocode.setApiKey('AIzaSyBY-Mx2muSMsIf14UNilYTUo1MEkhpJPyY')
Geocode.enableDebug()

/***************************************************************************************
 * Map Component
 * Map component inside GameInfo and GroupInfo where the creator can change the location
 ***************************************************************************************/

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      city: '',
      area: '',
      state: '',
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      role: [],
      changeLocation: false,
    }
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    this.setState({ role: this.props.role })
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray)
        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   */

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.changeLocation !== nextState.changeLocation ||
      this.state.state !== nextState.state
    ) {
      return true
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   */
  getCity = (addressArray) => {
    let city = ''
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        'administrative_area_level_2' === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name
        return city
      }
    }
  }
  /**
   * Get the area and set the area input value to the one selected
   */
  getArea = (addressArray) => {
    let area = ''
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            'sublocality_level_1' === addressArray[i].types[j] ||
            'locality' === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name
            return area
          }
        }
      }
    }
  }
  /**
   * Get the address and set the address input value to the one selected
   */
  getState = (addressArray) => {
    let state = ''
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          'administrative_area_level_1' === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name
          return state
        }
      }
    }
  }
  /**
   * And function for city,state and address input
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  /**
   * This Event triggers when the marker window is closed
   */
  onInfoWindowClose = (event) => {}

  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   */
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng()

    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray)
        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          markerPosition: {
            lat: newLat,
            lng: newLng,
          },
          mapPosition: {
            lat: newLat,
            lng: newLng,
          },
        })
        this.props.onLocationChange(newLat, newLng)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  /**
   * When the user types an address in the search box
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng()
    // Set these values in the state.
    this.setState({
      address: address ? address : '',
      area: area ? area : '',
      city: city ? city : '',
      state: state ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    })
    this.props.onLocationChange(latValue, lngValue)
  }

  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
        >
          {this.props.type === 'groups' ? (
            <Circle
              google={this.props.google}
              draggable={
                this.state.role.includes('creator') && this.state.changeLocation
              }
              onDragEnd={this.onMarkerDragEnd}
              defaultCenter={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng,
              }}
              radius={500}
            />
          ) : (
            <div>
              <InfoWindow
                onClose={this.onInfoWindowClose}
                position={{
                  lat: this.state.markerPosition.lat + 0.0018,
                  lng: this.state.markerPosition.lng,
                }}
              >
                <div>
                  <span style={{ padding: 0, margin: 0 }}>
                    {this.state.address}
                  </span>
                </div>
              </InfoWindow>
              <Marker
                google={this.props.google}
                draggable={
                  this.state.role.includes('creator') &&
                  !this.props.winner &&
                  this.state.changeLocation
                }
                onDragEnd={this.onMarkerDragEnd}
                position={{
                  lat: this.state.markerPosition.lat,
                  lng: this.state.markerPosition.lng,
                }}
              />
            </div>
          )}
          {/* For Auto complete Search Box */}
          {this.state.changeLocation ? (
            <div>
              <Autocomplete
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '16px',
                  marginTop: '2px',
                }}
                onPlaceSelected={this.onPlaceSelected}
                types={'(street_address)'}
              />
              <Button
                onClick={() => this.setState({ changeLocation: false })}
                style={{ marginTop: '2px' }}
              >
                Finished Changing Location
              </Button>
            </div>
          ) : null}
          {!this.state.changeLocation && this.state.role.includes('creator') ? (
            <Button onClick={() => this.setState({ changeLocation: true })}>
              Change Location
            </Button>
          ) : null}
        </GoogleMap>
      ))
    )
    let map
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <AsyncMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBY-Mx2muSMsIf14UNilYTUo1MEkhpJPyY&libraries=places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      )
    } else {
      map = <div style={{ height: this.props.height }} />
    }
    return map
  }
}
export default Map
