import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

const API_EXC = new ExcursionsAPI('excursions');
const API_ORDERS = new ExcursionsAPI('orders');
const proto = document.querySelector('.excursions__item--prototype');
let cart = [];

const init = () => {
	load();
	addToCart();
};

const load = () => {
	API_EXC.loadData()
		.then((data) => {
			insertData(data);
		})
		.catch((err) => console.log(err));
};

const addToCart = () => {
	const ulElement = findRootElement();
	ulElement.addEventListener('submit', (e) => {
		e.preventDefault();
		const targetEl = e.target;
		const parentEl = targetEl.parentElement;
		const [title, , adultPrice, childPrice] = getLiItems(parentEl);
		const [adultQTY, childQTY] = targetEl.elements;

		if (
			adultQTY.value !== '' &&
			childQTY.value !== '' &&
			!isNaN(adultQTY.value) &&
			!isNaN(childQTY.value)
		) {
			const basketData = {
				title: title.textContent,
				adultNumber: adultQTY.value,
				adultPrice: adultPrice.textContent,
				childNumber: childQTY.value,
				childPrice: childPrice.textContent,
			};

			cart.push(basketData);
		} else {
			alert('Podaj ilość osób...');
		}
		targetEl.reset();
	});
};

const findRootElement = () => {
	return document.querySelector('.panel__excursions');
};

const insertData = (excArray) => {
	const ulElement = findRootElement();
	clearElement(ulElement);
	excArray.forEach((item) => {
		const newLiItem = createListEl(item);

		ulElement.appendChild(newLiItem);
	});
};

const createListEl = (itemData) => {
	const newLiItem = createElementFromProto();
	const [title, description, adultPrice, childPrice] = getLiItems(newLiItem);

	title.innerText = itemData.name;
	description.innerText = itemData.description;
	adultPrice.innerText = itemData.adultPrice;
	childPrice.innerText = itemData.childPrice;
	newLiItem.dataset.id = itemData.id;

	return newLiItem;
};

const createElementFromProto = () => {
	const newElement = proto.cloneNode(true);
	newElement.classList.remove('excursions__item--prototype');

	return newElement;
};

const getLiItems = (root) => {
	const title = root.querySelector('.excursions__title');
	const description = root.querySelector('.excursions__description');
	const adultPrice = root.querySelector('.excursions__price--adult');
	const childPrice = root.querySelector('.excursions__price--child');

	return [title, description, adultPrice, childPrice];
};

const clearElement = (element) => {
	element.innerHTML = '';
};

document.addEventListener('DOMContentLoaded', init);
