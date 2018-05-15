import React, { Component } from 'react';
import Service from '../logic/service';
import MapForecast from './MapForecast'
import { GoogleApiWrapper } from 'google-maps-react'

class App extends Component {

    constructor(props) {
        super(props)
        this.changedPlace = this.changedPlace.bind(this);
        this.showRawData = this.showRawData.bind(this)
        this.state = {
            places: [],
            forecast: [],
            placeData: null,
            loading: false,
            showRaw: false,
            currentLocation: null
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        Service.getPlaces().then(data => {
            const places = JSON.parse(data).sort((a, b) => {
                if (a.verbose_name < b.verbose_name) return -1;
                if (a.verbose_name > b.verbose_name) return 1;
                return 0;
            })

            const arrTen = places.map(place => {
                return (<option key={place.url} value={JSON.stringify(place)}> {place.verbose_name.replace(/_/g, ' ')} </option>)
            })

            this.setState({
                places: arrTen,
                loading: false
            });
        })

    }

    changedPlace(event) {
        const k = JSON.parse(event.target.value)
        this.setState({
            loading: true,
            currentLocation: k.verbose_name.replace(/_/g, ', ') + ', Philippines'
        })

        const got = this.state.forecast.filter(data => data.key === k.url)
        if (got.length > 0) {
            this.setState({
                placeData: got[0].data,
                loading: false
            })
        } else {
            Service.getForecast(k.url).then(data => {
                const fresh = {
                    key: k.url,
                    data: JSON.parse(data)
                }
                this.setState({
                    forecast: [...this.state.forecast, fresh],
                    placeData: JSON.parse(data),
                    loading: false
                })
            })
        }
    }

    showRawData() {
        this.setState({
            showRaw: !this.state.showRaw
        })
    }

    render() {
        const placeData = this.state.placeData

        let tables;
        if (placeData) {
            tables = placeData.data.map(data => {
                const date = data.date

                const temperatures = data.readings.map(data => data.temperature)
                const sumTemp = temperatures.reduce((a, b) => a + b)
                const avgTemp = isNaN(sumTemp) ? 'not available' : sumTemp / temperatures.length

                const heatindexes = data.readings.map(data => data.heat_index)
                const sumHeatIndexes = heatindexes.reduce((a, b) => a + b)
                const avgHeatIndex = isNaN(sumHeatIndexes) ? 'not available' : sumHeatIndexes / heatindexes.length

                const rainFalls = data.readings.map(data => data.rainfall)
                const sumRainFalls = rainFalls.reduce((a, b) => a + b)
                const avgRainFalls = isNaN(sumRainFalls) ? 'not available' : sumRainFalls / rainFalls.length

                return (
                    <tr key={JSON.stringify(data)} bgcolor='ffffff'>
                        <td>{date}</td>
                        <td>{avgTemp}</td>
                        <td>{avgHeatIndex}</td>
                        <td>{avgRainFalls}</td>
                    </tr>
                )
            })
        }


        const disabled = this.state.loading ? { 'disabled': 'disabled' } : {};

        return (
            <div>
                <select onChange={this.changedPlace} {...disabled} >
                    {this.state.places}
                </select>
                <br />
                <br />

                {
                    tables && (
                        <div>
                            <table cellPadding='5' bgcolor='lightgrey'>
                                <tbody>
                                    <tr bgcolor='lightblue'>
                                        <td>Date</td>
                                        <td>Temperature</td>
                                        <td>Heat Index</td>
                                        <td>Rainfall</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    {tables}
                                </tbody>
                            </table>
                            <br />
                            <button onClick={this.showRawData}>show/hide Raw Data</button>
                        </div>
                    )
                }

                {this.state.showRaw && JSON.stringify(this.state.placeData.data)}

                <MapForecast currentLocation={this.state.currentLocation} google={this.props.google} />

            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: '',
    libraries: ['places']
})(App)