import get from '../util/http-client.js'

class Service {
    getForecast = (endpoint) => get(endpoint)
    getPlaces = () => get('/api/seven_day_forecast')
}

export default new Service();