import React, { Component } from 'react';
import ReactDOM from 'react-dom'


export default class MapForecast extends Component {

    constructor(props) {
        super(props)
        this.loadMap = this.loadMap.bind(this)
        this.state = {
            map: null
        }
    }

    componentDidMount(prevProps, prevState) {
        this.loadMap();
    }

    loadMap() {
        if (this.props.google) {
            const { google } = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const searchRef = this.refs.search;

            const searchNode = ReactDOM.findDOMNode(searchRef);
            const mapNode = ReactDOM.findDOMNode(mapRef);


            const _map = new maps.Map(mapNode, {
                center: { lat: 12.879721, lng: 121.774017 },
                zoom: 6,
                mapTypeId: 'roadmap'
            });

            const searchBox = new google.maps.places.SearchBox(searchNode);

            let markers = [];
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                // limpyo
                markers.forEach(marker => {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                const bounds = new google.maps.LatLngBounds();
                places.forEach(place => {
                    if (!place.geometry) return

                    const icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    markers.push(new google.maps.Marker({
                        map: _map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));

                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                _map.fitBounds(bounds);
            });
        }
    }

    render() {
        const style = {
            width: '85vw',
            height: '75vh'
        }

        return (
            <div>
                <input ref="search" value={this.props.currentLocation} />
                <div ref="map" style={style}>loading map...</div>
            </div>
        )
    }
}