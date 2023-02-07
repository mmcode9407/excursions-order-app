export default class ClientService {
	constructor(API) {
		this.API_SERVICE = API;
		this.cart = [];
	}

	load() {
		this.API_SERVICE.loadData()
			.then((data) => {
				this.insertExcData(data);
			})
			.catch((err) => console.log(err));
	}

	insertExcData(excArray) {
		const ulElement = this._findListRoot('.panel__excursions');
		this._clearListElements(ulElement);
		excArray.forEach((item) => {
			const newLiItem = this._createExcListItem(item);

			ulElement.appendChild(newLiItem);
		});
	}

	addToCart() {
		const ulElement = this._findListRoot('.panel__excursions');
		ulElement.addEventListener('submit', (e) => this.handleAddToCart(e));
	}

	handleAddToCart(e) {
		e.preventDefault();
		const targetEl = e.target;

		if (this._areFieldsCorrect(targetEl)) {
			const basketData = this._getDataForCart(targetEl);

			this.cart.push(basketData);

			this._renderCart();
		} else {
			alert('Podaj ilość osób...');
		}
		targetEl.reset();
	}

	removeFromCart() {
		const summaryUlList = this._findListRoot('.panel__summary');
		summaryUlList.addEventListener('click', (e) =>
			this.handleRemoveFromCart(e)
		);
	}

	handleRemoveFromCart(e) {
		e.preventDefault();
		const targetEl = e.target;
		if (targetEl.classList.contains('summary__btn-remove')) {
			const elToRemove = this._getElementToRemove(targetEl);
			const idRemovedEl = elToRemove.dataset.id;

			this._filterCartById(idRemovedEl);
			this._renderCart();
		}
	}

	_getElementToRemove(targetEl) {
		return targetEl.parentElement.parentElement;
	}

	_filterCartById(idToRemove) {
		this.cart = this.cart.filter((item) => item.id !== parseInt(idToRemove));
	}

	_findListRoot(className) {
		return document.querySelector(className);
	}

	_createExcListItem(itemData) {
		const newLiItem = this._createElementFromProto(
			'excursions__item--prototype'
		);
		const [title, description, adultPrice, childPrice] =
			this._getExcItems(newLiItem);

		title.innerText = itemData.name;
		description.innerText = itemData.description;
		adultPrice.innerText = itemData.adultPrice;
		childPrice.innerText = itemData.childPrice;
		newLiItem.dataset.id = itemData.id;

		return newLiItem;
	}

	_isInputNaN(input) {
		return isNaN(input.value);
	}

	_hasFieldValueLike(element, value) {
		return element.value === value;
	}

	_areFieldsCorrect(targetEl) {
		const [adultQTY, childQTY] = targetEl.elements;

		return (
			!this._hasFieldValueLike(adultQTY, '') &&
			!this._hasFieldValueLike(childQTY, '') &&
			!this._isInputNaN(adultQTY) &&
			!this._isInputNaN(childQTY)
		);
	}

	_findPrototypeElementByClass(prototypeClassName) {
		return document.querySelector(`.${prototypeClassName}`);
	}

	_createElementFromProto(prototypeClassName) {
		const protoELement = this._findPrototypeElementByClass(prototypeClassName);
		const newElement = protoELement.cloneNode(true);
		newElement.classList.remove(prototypeClassName);

		return newElement;
	}

	_getExcItems(root) {
		const title = root.querySelector('.excursions__title');
		const description = root.querySelector('.excursions__description');
		const adultPrice = root.querySelector('.excursions__price--adult');
		const childPrice = root.querySelector('.excursions__price--child');

		return [title, description, adultPrice, childPrice];
	}

	_clearListElements(element) {
		const listElementsAsArray = Array.from(element.children);
		listElementsAsArray.forEach((item) => {
			if (!item.className.includes('--prototype')) {
				item.remove();
			}
		});
	}

	_getDataForCart(targetEl) {
		const parentEl = targetEl.parentElement;
		const [title, , adultPrice, childPrice] = this._getExcItems(parentEl);
		const [adultQTY, childQTY] = targetEl.elements;

		return {
			title: title.textContent,
			adultNumber: adultQTY.value,
			adultPrice: adultPrice.textContent,
			childNumber: childQTY.value,
			childPrice: childPrice.textContent,
			id: this._getMaxId(this.cart),
		};
	}

	_getMaxId(array) {
		return (
			array.reduce((acc, next) => {
				return acc < next.id ? next.id : acc;
			}, 0) + 1
		);
	}

	_renderCart() {
		const summaryUlList = this._findListRoot('.panel__summary');
		this._clearListElements(summaryUlList);
		this.cart.forEach((item) => {
			const newSumLiItem = this._createSumListItem(item);
			summaryUlList.appendChild(newSumLiItem);
		});
		this._setTotalOrderPrice();
	}

	_createSumListItem(itemData) {
		const newSumLiItem = this._createElementFromProto(
			'summary__item--prototype'
		);
		const [summaryName, summaryPrice, summaryDescription] =
			this._getSumItems(newSumLiItem);
		const summaryPriceValue =
			itemData.adultNumber * itemData.adultPrice +
			itemData.childNumber * itemData.childPrice;

		summaryName.innerText = itemData.title;
		summaryPrice.innerText = `${summaryPriceValue}PLN`;
		newSumLiItem.dataset.id = itemData.id;
		summaryDescription.innerText = `dorośli: ${itemData.adultNumber} x ${itemData.adultPrice}PLN, dzieci: ${itemData.childNumber} x ${itemData.childPrice}PLN`;

		return newSumLiItem;
	}

	_getSumItems(root) {
		const summaryName = root.querySelector('.summary__name');
		const summaryPrice = root.querySelector('.summary__total-price');
		const summaryDescription = root.querySelector('.summary__prices');

		return [summaryName, summaryPrice, summaryDescription];
	}

	_setTotalOrderPrice() {
		const totalOrderPriceElement = this._getTotalOrderElementToUpdate();
		const totalOrderPrice = this._getSummary();
		totalOrderPriceElement.innerText = `${totalOrderPrice}PLN`;
	}

	_getSummary(cart) {
		let summary = 0;
		this.cart.forEach((item) => {
			summary +=
				item.adultNumber * item.adultPrice + item.childNumber * item.childPrice;
		});

		return summary;
	}

	_getTotalOrderElementToUpdate() {
		return document.querySelector('.order__total-price-value');
	}
}
