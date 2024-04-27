const serverURL = `${window.location.protocol}//${window.location.host.replace(/:\d+$/, '')}`;
let API_URL = `${serverURL}:5000/`;

export {API_URL};