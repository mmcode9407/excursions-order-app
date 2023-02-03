import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
import AdminService from './AdminService';

const init = () => {
	const API_EXC = new ExcursionsAPI('excursions');
	const adminExc = new AdminService(API_EXC);

	adminExc.load();
	adminExc.remove();
	adminExc.add();
	adminExc.update();
};

document.addEventListener('DOMContentLoaded', init);
