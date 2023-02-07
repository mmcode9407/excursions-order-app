import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import ClientService from './ClientService';

const init = () => {
	const API_EXC = new ExcursionsAPI('excursions');
	const API_ORDERS = new ExcursionsAPI('orders');
	const clientExc = new ClientService(API_EXC);
	const clientOrders = new ClientService(API_ORDERS);

	clientExc.load();
	clientOrders.addToCart();
	clientOrders.removeFromCart();
	clientOrders.submitOrder();
};

document.addEventListener('DOMContentLoaded', init);
