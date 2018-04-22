import React, { Component } from 'react';
import Service from '../logic/service';

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
            showRaw: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        Service.getPlaces().then(data => {

            const places = JSON.parse(data).sort(function(a, b){
                if(a.verbose_name < b.verbose_name) return -1;
                if(a.verbose_name > b.verbose_name) return 1;
                return 0;
            })

            const arrTen = [];
            for (var k = 0; k < places.length; k++) {
                arrTen.push(<option key={places[k].url} value={places[k].url}> {places[k].verbose_name.replace(/_/g, ' ')} </option>);
            }
            this.setState({
                places: arrTen,
                loading: false
            });
        })

    }

    changedPlace(event) {
        this.setState({
            loading: true
        })
        const k = event.target.value
        let got = this.state.forecast.filter(data => data.key === k)
        if (got.length > 0) {
            console.log(JSON.stringify(got[0]))
            console.log("\n\ncached data\n")
            this.setState({
                placeData: got[0].data,
                loading: false
            })
        } else {
            Service.getForecast(k).then(data => {
                const fresh = {
                    key: k,
                    data: JSON.parse(data)
                }
                this.setState({
                    forecast: [...this.state.forecast, fresh],
                    placeData: JSON.parse(data),
                    loading: false
                })
                console.log(JSON.stringify(JSON.parse(data)))
                console.log("\n\nfresh data\n")
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
        const tables = [];
        if (placeData) {
            for (var k = 0; k < placeData.data.length; k++) {

                const data = placeData.data[k]
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

                tables.push(
                    <tr key={date} bgcolor='ffffff'>
                        <td>{date}</td>
                        <td>{avgTemp}</td>
                        <td>{avgHeatIndex}</td>
                        <td>{avgRainFalls}</td>
                    </tr>
                );
            }

        }

        let disabled = this.state.loading ? { 'disabled': 'disabled' } : {};

        return (
            <div>
                <select onChange={this.changedPlace} {...disabled} >
                    {this.state.places}
                </select>
                <br />
                <br />

                {
                    tables.length > 0 && (
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
                            <button onClick ={this.showRawData}>show/hide Raw Data</button>
                        </div>
                    )
                }

                {this.state.showRaw && JSON.stringify(this.state.placeData.data)}

            </div>
        );
    }
}

export default App;