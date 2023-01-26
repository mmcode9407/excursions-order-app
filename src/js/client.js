import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

const API_EXC = new ExcursionsAPI('excursions');
const API_ORDERS = new ExcursionsAPI('orders');
const excProto = document.querySelector('.excursions__item--prototype');
const sumProto = document.querySelector('.summary__item--prototype');
let cart = [];

const init = () => {
	load();
	addToCart();
};

const load = () => {
	API_EXC.loadData()
		.then((data) => {
			insertExcData(data);
		})
		.catch((err) => console.log(err));
};

const addToCart = () => {
	const ulElement = findListRoot('.panel__excursions');
	ulElement.addEventListener('submit', handleAddToCart);
};

const handleAddToCart = (e) => {
	e.preventDefault();
	const targetEl = e.target;
	const [adultQTY, childQTY] = targetEl.elements;

	if (
		!isEmptyInput(adultQTY) &&
		!isEmptyInput(childQTY) &&
		!isInputNaN(adultQTY) &&
		!isInputNaN(childQTY)
	) {
		const basketData = getDataForCart(targetEl);

		cart.push(basketData);

		renderCart(cart);
	} else {
		alert('Podaj ilość osób...');
	}
	targetEl.reset();
};

const findListRoot = (className) => {
	return document.querySelector(className);
};

const insertExcData = (excArray) => {
	const ulElement = findListRoot('.panel__excursions');
	clearElement(ulElement);
	excArray.forEach((item) => {
		const newLiItem = createExcListItem(item);

		ulElement.appendChild(newLiItem);
	});
};

const createExcListItem = (itemData) => {
	const newLiItem = createElementFromProto(
		excProto,
		'excursions__item--prototype'
	);
	const [title, description, adultPrice, childPrice] = getExcItems(newLiItem);

	title.innerText = itemData.name;
	description.innerText = itemData.description;
	adultPrice.innerText = itemData.adultPrice;
	childPrice.innerText = itemData.childPrice;
	newLiItem.dataset.id = itemData.id;

	return newLiItem;
};

const createElementFromProto = (prototype, prototypeClassName) => {
	const newElement = prototype.cloneNode(true);
	newElement.classList.remove(prototypeClassName);

	return newElement;
};

const getExcItems = (root) => {
	const title = root.querySelector('.excursions__title');
	const description = root.querySelector('.excursions__description');
	const adultPrice = root.querySelector('.excursions__price--adult');
	const childPrice = root.querySelector('.excursions__price--child');

	return [title, description, adultPrice, childPrice];
};

const clearElement = (element) => {
	element.innerHTML = '';
};

const isEmptyInput = (input) => {
	return input.value === '';
};

const isInputNaN = (input) => {
	return isNaN(input.value);
};

const getDataForCart = (targetEl) => {
	const parentEl = targetEl.parentElement;
	const [title, , adultPrice, childPrice] = getExcItems(parentEl);
	const [adultQTY, childQTY] = targetEl.elements;

	return {
		title: title.textContent,
		adultNumber: adultQTY.value,
		adultPrice: adultPrice.textContent,
		childNumber: childQTY.value,
		childPrice: childPrice.textContent,
		id: getMaxId(cart),
	};
};

const getMaxId = (array) => {
	array.reduce((acc, next) => {
		return acc < next.id ? next.id : acc;
	}, 0) + 1;
};

const renderCart = (cart) => {
	const summaryUlList = findListRoot('.panel__summary');
	clearElement(summaryUlList);
	cart.forEach((item) => {
		const newSumLiItem = createSumListItem(item);
		summaryUlList.appendChild(newSumLiItem);
	});
};

const createSumListItem = (itemData) => {
	const newSumLiItem = createElementFromProto(
		sumProto,
		'summary__item--prototype'
	);
	const [summaryName, summaryPrice, summaryDescription] =
		getSumItems(newSumLiItem);
	const summaryPriceValue =
		itemData.adultNumber * itemData.adultPrice +
		itemData.childNumber * itemData.childPrice;

	summaryName.innerText = itemData.title;
	summaryPrice.innerText = `${summaryPriceValue}PLN`;
	newSumLiItem.dataset.id = itemData.id;
	summaryDescription.innerText = `dorośli: ${itemData.adultNumber} x ${itemData.adultPrice}PLN, dzieci: ${itemData.childNumber} x ${itemData.childPrice}PLN`;

	getSummary(cart);

	return newSumLiItem;
};

const getSumItems = (root) => {
	const summaryName = root.querySelector('.summary__name');
	const summaryPrice = root.querySelector('.summary__total-price');
	const summaryDescription = root.querySelector('.summary__prices');

	return [summaryName, summaryPrice, summaryDescription];
};

const getSummary = (cart) => {
	const totalOrderPrice = getTotalOrderElementToUpdate();
	let summary = 0;
	cart.forEach((item) => {
		summary +=
			item.adultNumber * item.adultPrice + item.childNumber * item.childPrice;
	});
	totalOrderPrice.innerText = `${summary}PLN`;

	return summary;
};

const getTotalOrderElementToUpdate = () => {
	return document.querySelector('.order__total-price-value');
};
document.addEventListener('DOMContentLoaded', init);
