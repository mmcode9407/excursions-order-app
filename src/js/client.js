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
	removeFromCart();
	submitOrder();
};

document.addEventListener('DOMContentLoaded', init);

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

const removeFromCart = () => {
	const summaryUlList = findListRoot('.panel__summary');
	summaryUlList.addEventListener('click', handleRemoveFromCart);
};

const handleRemoveFromCart = (e) => {
	e.preventDefault();
	const targetEl = e.target;
	if (targetEl.classList.contains('summary__btn-remove')) {
		const elToRemove = getElementToRemove(targetEl);
		const idRemovedEl = elToRemove.dataset.id;

		filterCartById(idRemovedEl);
		renderCart(cart);
	}
};

const submitOrder = () => {
	const orderForm = document.querySelector('.panel__order');
	orderForm.addEventListener('submit', handleSubmitOrder);
};

const handleSubmitOrder = (e) => {
	e.preventDefault();
	const targetEl = e.target;
	const fields = createFieldsToCheck();

	if (cart.length !== 0) {
		const errors = checkDataInForm(fields, targetEl);
		if (errors.length === 0) {
			addOrder(targetEl, fields);
		} else {
			createErrorsList(errors);
		}
	} else {
		alert(
			'Koszyk jest pusty! Aby dokonać zamówienia prosimy o dodanie wycieczki do koszyka.'
		);
	}
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
	return (
		array.reduce((acc, next) => {
			return acc < next.id ? next.id : acc;
		}, 0) + 1
	);
};

const renderCart = (cart) => {
	const summaryUlList = findListRoot('.panel__summary');
	clearElement(summaryUlList);
	cart.forEach((item) => {
		const newSumLiItem = createSumListItem(item);
		summaryUlList.appendChild(newSumLiItem);
	});
	setTotalOrderPrice();
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

	return newSumLiItem;
};

const getSumItems = (root) => {
	const summaryName = root.querySelector('.summary__name');
	const summaryPrice = root.querySelector('.summary__total-price');
	const summaryDescription = root.querySelector('.summary__prices');

	return [summaryName, summaryPrice, summaryDescription];
};

const setTotalOrderPrice = () => {
	const totalOrderPriceElement = getTotalOrderElementToUpdate();
	const totalOrderPrice = getSummary();
	totalOrderPriceElement.innerText = `${totalOrderPrice}PLN`;
};

const getSummary = () => {
	let summary = 0;
	cart.forEach((item) => {
		summary +=
			item.adultNumber * item.adultPrice + item.childNumber * item.childPrice;
	});

	return summary;
};

const getTotalOrderElementToUpdate = () => {
	return document.querySelector('.order__total-price-value');
};

const getElementToRemove = (targetEl) => {
	return targetEl.parentElement.parentElement;
};

const filterCartById = (idToRemove) => {
	cart = cart.filter((item) => item.id !== parseInt(idToRemove));
};

const checkDataInForm = (arr, targetEl) => {
	let errors = [];
	arr.forEach(function (arrEl) {
		const { name, label, pattern = null, required = false } = arrEl;
		const inputValue = targetEl.elements[name].value;

		if (required) {
			if (inputValue === '') {
				errors.push(`Dane w polu ${label} są wymagane!`);
			}
		}

		if (pattern) {
			const reg = new RegExp(pattern);
			if (!reg.test(inputValue)) {
				errors.push(`Dane w polu ${label} nie są w odpowiednim formacie!`);
			}
		}
	});

	return errors;
};

const createErrorsList = (errorsBox) => {
	const errorsList = findListRoot('.order__field-errors');
	clearElement(errorsList);
	errorsBox.forEach(function (err) {
		const liEl = document.createElement('li');
		liEl.innerText = err;
		errorsList.appendChild(liEl);
	});
};

const clearInputsValue = (arr, targetEl) => {
	arr.forEach(function (el) {
		targetEl[el.name].value = '';
	});
};

const createFieldsToCheck = () => {
	return [
		{
			name: 'name',
			label: 'Imię i Nazwisko',
			required: true,
			pattern: '[a-z]',
		},
		{
			name: 'email',
			label: 'Email',
			required: true,
			pattern: '[0-9a-z_.-]+@[0-9a-z.-]+.[a-z]{2,3}',
		},
	];
};

const showInfo = (targetEl) => {
	const totalOrderPriceElement = getTotalOrderElementToUpdate();
	const { email } = targetEl.elements;
	alert(
		`Dziękujemy za złożenie zamówienia o wartości ${totalOrderPriceElement.textContent}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email.value}.`
	);
};

const addOrder = (targetEl, fields) => {
	const data = createDataToAdd(targetEl);

	API_ORDERS.addData(data)
		.catch((err) => console.error(err))
		.finally(() => {
			showInfo(targetEl);
			clearInputsValue(fields, targetEl);
			cart = [];
			renderCart(cart);
		});
};

const createDataToAdd = (targetEl) => {
	const { name: participantName, email: participantEmail } = targetEl.elements;
	const orderDate = getOrderDate();
	const cartDataForAPI = cart.map((item) => {
		const { adultNumber, childNumber, title } = item;

		return {
			adultNumber: adultNumber,
			childNumber: childNumber,
			title: title,
		};
	});

	return {
		participantName: participantName.value,
		participantEmail: participantEmail.value,
		orderDetails: cartDataForAPI,
		orderDate: orderDate,
	};
};

const getOrderDate = () => {
	const date = new Date();

	const orderDate = date
		.toLocaleString('nu', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
		})
		.replace(',', '');

	return orderDate;
};
