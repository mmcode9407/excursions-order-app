import Helper from './Helper';

export default class ClientService extends Helper {
	constructor(API_SERVICE) {
		super(API_SERVICE);
		this.cart = [];
	}

	addToCart() {
		const ulElement = super._findListRoot('.panel__excursions');
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
		const summaryUlList = super._findListRoot('.panel__summary');
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

	submitOrder() {
		const orderForm = document.querySelector('.panel__order');
		orderForm.addEventListener('submit', (e) => this.handleSubmitOrder(e));
	}

	handleSubmitOrder(e) {
		e.preventDefault();
		const targetEl = e.target;
		const fields = this._createFieldsToCheck();

		if (this.cart.length !== 0) {
			const errors = this._checkDataInForm(fields, targetEl);
			if (errors.length === 0) {
				this._addOrder(targetEl, fields);
			} else {
				this._createErrorsList(errors);
			}
		} else {
			alert(
				'Koszyk jest pusty! Aby dokonać zamówienia prosimy o dodanie wycieczki do koszyka.'
			);
		}
	}

	_isInputNaN(input) {
		return isNaN(input.value);
	}

	_areFieldsCorrect(targetEl) {
		const [adultQTY, childQTY] = targetEl.elements;

		return (
			!super._hasFieldValueLike(adultQTY, '') &&
			!super._hasFieldValueLike(childQTY, '') &&
			!this._isInputNaN(adultQTY) &&
			!this._isInputNaN(childQTY)
		);
	}

	_getDataForCart(targetEl) {
		const parentEl = targetEl.parentElement;
		const [title, , adultPrice, childPrice] = super._getExcItems(parentEl);
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
		const summaryUlList = super._findListRoot('.panel__summary');
		super._clearListElements(summaryUlList);
		this.cart.forEach((item) => {
			const newSumLiItem = this._createSumListItem(item);
			summaryUlList.appendChild(newSumLiItem);
		});
		this._setTotalOrderPrice();
	}

	_createSumListItem(itemData) {
		const newSumLiItem = super._createElementFromProto(
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

	_getSummary() {
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

	_getElementToRemove(targetEl) {
		return targetEl.parentElement.parentElement;
	}

	_filterCartById(idToRemove) {
		this.cart = this.cart.filter((item) => item.id !== parseInt(idToRemove));
	}

	_createFieldsToCheck() {
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
	}

	_checkDataInForm(dataArray, targetEl) {
		let errors = [];
		dataArray.forEach(function (dataEl) {
			const { name, label, pattern = null, required = false } = dataEl;
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
	}

	_addOrder(targetEl, fields) {
		const data = this._createDataToAdd(targetEl);

		this.API_SERVICE.addData(data)
			.catch((err) => console.error(err))
			.finally(() => {
				const errorsList = super._findListRoot('.order__field-errors');
				super._clearListElements(errorsList);
				this._showInfo(targetEl);
				this._clearInputsValue(fields, targetEl);
				this.cart = [];
				this._renderCart();
			});
	}

	_createDataToAdd(targetEl) {
		const { name: participantName, email: participantEmail } =
			targetEl.elements;

		return {
			participantName: participantName.value,
			participantEmail: participantEmail.value,
			orderDetails: this._getCartDataForAPI(),
			orderDate: this._getOrderDate(),
			orderTotalPrice: this._getTotalOrderElementToUpdate().textContent,
		};
	}

	_clearInputsValue(arr, targetEl) {
		arr.forEach(function (el) {
			targetEl[el.name].value = '';
		});
	}

	_showInfo(targetEl) {
		const totalOrderPriceElement = this._getTotalOrderElementToUpdate();
		const { email } = targetEl.elements;
		alert(
			`Dziękujemy za złożenie zamówienia o wartości ${totalOrderPriceElement.textContent}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email.value}.`
		);
	}

	_getOrderDate() {
		const date = new Date();

		const orderDate = date
			.toLocaleString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour12: false,
				hour: '2-digit',
				minute: '2-digit',
			})
			.replace(',', '');

		return orderDate;
	}

	_getCartDataForAPI() {
		return this.cart.map((item) => {
			const { adultNumber, childNumber, title, adultPrice, childPrice } = item;

			return {
				title: title,
				adultNumber: adultNumber,
				adultPrice: `${adultPrice}PLN`,
				childNumber: childNumber,
				childPrice: `${childPrice}PLN`,
			};
		});
	}

	_createErrorsList(errorsBox) {
		const errorsList = super._findListRoot('.order__field-errors');
		super._clearListElements(errorsList);
		errorsBox.forEach(function (err) {
			const liEl = document.createElement('li');
			liEl.innerText = err;
			errorsList.appendChild(liEl);
		});
	}
}
