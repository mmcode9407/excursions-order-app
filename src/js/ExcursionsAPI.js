class ExcursionsAPI {
	constructor(resource) {
		this.API_LINK = `http://localhost:3000/${resource}`;
	}

	loadData() {
		return this._fetch();
	}

	removeData(id) {
		const options = { method: 'DELETE' };
		return this._fetch(options, `/${id}`);
	}

	_fetch(options, additionalPath = '') {
		const API_URL = `${this.API_LINK}${additionalPath}`;
		return fetch(API_URL, options).then((resp) => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		});
	}
}

export default ExcursionsAPI;
