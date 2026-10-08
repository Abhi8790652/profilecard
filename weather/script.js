const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=Seattle');
xhr.setRequestHeader('x-rapidapi-key', 'dffa71a89bmsh07e00693f7fa251p1d14e4jsn4b23c8586ea5');
xhr.setRequestHeader('x-rapidapi-host', 'weather-by-api-ninjas.p.rapidapi.com');

xhr.send(data);