import React, { Component } from 'react'
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Circle,
  Marker,
} from 'react-google-maps'
import Autocomplete from 'react-google-autocomplete'
import Geocode from 'react-geocode'
import { withRouter } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import { baseURL } from '../../axios'
import { Button, Card } from 'react-bootstrap'

import SportList from '../SportList'
import classes from './FindGroupMap.module.css'

Geocode.setApiKey('AIzaSyBY-Mx2muSMsIf14UNilYTUo1MEkhpJPyY')
Geocode.enableDebug()

/*************************************************************************************************
 * FindMap Component
 * Map component in Dashboard which displays a map of groups and games the user does not belong to
 *************************************************************************************************/

class FindMap extends Component {
  // Set the location and address of the map to the location provided
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
      filter: true,
      filterList: [],
    }
  }

  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   */

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.filterList !== nextProps.filterList ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state ||
      this.state.winner !== nextState.winner
    ) {
      return true
    } else {
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
   * Function for city,state and address input
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  /**
   * When the user types an address in the search box
   */
  onPlaceSelected = (place) => {
    console.log('plc', place)
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
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    })
  }

  handleClick = (id) => {
    this.props.history.push(`/api/v1/${this.props.type}/${id}`)
  }

  filterSports = (showFilter) => {
    this.setState({ filter: showFilter })
  }

  updateSports = (newFilterList) => {
    this.setState({ filterList: newFilterList })
    console.log(this.state.filterList)
  }

  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <div>
          <Card className={classes.filterCard}>
            <div className={classes.filterBar}>
              <p
                style={{
                  marginLeft: '15px',
                  marginTop: '10px',
                  fontSize: '20px',
                }}
              >
                Filter by sports
              </p>
              {this.state.filter ? (
                <Button
                  className={classes.showFilterButton}
                  variant={'secondary'}
                  onClick={() => this.filterSports(false)}
                >
                  - Hide
                </Button>
              ) : (
                <Button
                  className={classes.showFilterButton}
                  variant={'secondary'}
                  onClick={() => this.filterSports(true)}
                >
                  + Show
                </Button>
              )}
            </div>
            {this.state.filter ? (
              <SportList
                updateSports={this.updateSports}
                sports={this.state.filterList}
              />
            ) : null}
          </Card>
          <GoogleMap
            google={this.props.google}
            defaultZoom={this.props.zoom}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}
          >
            {/* InfoWindow on top of marker */}
            {this.props.type === 'groups' ? (
              <div>
                {this.props.findInfo.map((group) => (
                  <div>
                    {this.state.filterList.some((sport) =>
                      group.sports.includes(sport)
                    ) || this.state.filterList.length === 0 ? (
                      <div>
                        <InfoWindow
                          defaultOptions={{ disableAutoPan: true }}
                          position={{
                            lat: group.location.coordinates[0],
                            lng: group.location.coordinates[1],
                          }}
                        >
                          <div className={classes.infoWindow}>
                            <Image
                              src={`${baseURL}/uploads/${group.photo}`}
                              className={classes.icon}
                              onClick={() => this.handleClick(group._id)}
                            />
                            <p
                              className={classes.name}
                              onClick={() => this.handleClick(group._id)}
                            >
                              {group.name}
                            </p>
                            {group.sports.map((sport) => (
                              <Image
                                src={`${baseURL}/uploads/${sport}.png`}
                                className={classes.sport}
                              />
                            ))}
                          </div>
                        </InfoWindow>
                        <Circle
                          google={this.props.google}
                          draggable={false}
                          defaultCenter={{
                            lat: group.location.coordinates[0],
                            lng: group.location.coordinates[1],
                          }}
                          radius={500}
                        ></Circle>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {this.props.findInfo.map((game) => (
                  <div>
                    {this.state.filterList.includes(game.sport) ||
                    this.state.filterList.length === 0 ? (
                      <div>
                        <Marker
                          google={this.props.google}
                          draggable={false}
                          position={{
                            lat: game.location.coordinates[0],
                            lng: game.location.coordinates[1],
                          }}
                        >
                          <InfoWindow defaultOptions={{ disableAutoPan: true }}>
                            <div className={classes.infoWindow}>
                              <Image
                                src={`${baseURL}/uploads/${game.photo}`}
                                className={classes.icon}
                                onClick={() => this.handleClick(game._id)}
                              />
                              <p
                                className={classes.name}
                                onClick={() => this.handleClick(game._id)}
                              >
                                {game.title}
                              </p>
                              <Image
                                src={`${baseURL}/uploads/${game.sport}.png`}
                                className={classes.sport}
                              />
                            </div>
                          </InfoWindow>
                        </Marker>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
            {/* For Auto complete Search Box */}
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
            </div>
          </GoogleMap>
        </div>
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
export default withRouter(FindMap)
