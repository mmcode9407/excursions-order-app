import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI('excursions');
const ul = document.querySelector('.panel__excursions');
const proto = document.querySelector('.excursions__item--prototype');

const init = () => {
	load();
};

const load = () => {
	api.loadData().then((data) => {
		insertData(data);
	});
};

const insertData = (excArray) => {
	ul.innerHTML = '';
	excArray.forEach((el) => {
		const newLiItem = proto.cloneNode(true);
		newLiItem.classList.remove('excursions__item--prototype');
		const h2 = newLiItem.firstElementChild.firstElementChild;
		const p = newLiItem.firstElementChild.lastElementChild;
		const adultPrice = newLiItem.querySelector(
			'.excursions__field-price--adult'
		);
		const childPrice = newLiItem.querySelector(
			'.excursions__field-price--child'
		);

		h2.innerText = el.name;
		p.innerText = el.description;
		adultPrice.innerText = el.adultPrice;
		childPrice.innerText = el.childPrice;
		newLiItem.dataset.id = el.id;

		ul.appendChild(newLiItem);
	});
};

document.addEventListener('DOMContentLoaded', init);
