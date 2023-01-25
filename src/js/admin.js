import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI('excursions');
const ul = document.querySelector('.panel__excursions');
const proto = document.querySelector('.excursions__item--prototype');

const init = () => {
	load();
};

const load = () => {
	api
		.loadData()
		.then((data) => {
			insertData(data);
		})
		.catch((err) => console.log(err));
};

const insertData = (excArray) => {
	ul.innerHTML = '';
	excArray.forEach((item) => {
		const newLiItem = createListEl(item);

		ul.appendChild(newLiItem);
	});
};

const createListEl = (itemData) => {
	const newLiItem = proto.cloneNode(true);
	newLiItem.classList.remove('excursions__item--prototype');
	const h2 = newLiItem.firstElementChild.firstElementChild;
	const p = newLiItem.firstElementChild.lastElementChild;
	const adultPrice = newLiItem.querySelector('.excursions__field-price--adult');
	const childPrice = newLiItem.querySelector('.excursions__field-price--child');

	h2.innerText = itemData.name;
	p.innerText = itemData.description;
	adultPrice.innerText = itemData.adultPrice;
	childPrice.innerText = itemData.childPrice;
	newLiItem.dataset.id = itemData.id;

	return newLiItem;
};

document.addEventListener('DOMContentLoaded', init);
