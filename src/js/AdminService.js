export default class AdminService {
	constructor(API) {
		this.API_SERVICE = API;
	}

	load() {
		this.API_SERVICE.loadData()
			.then((data) => {
				this.insertData(data);
			})
			.catch((err) => console.log(err));
	}

	insertData(excArray) {
		const ulElement = this._findListRoot('.panel__excursions');
		this._clearListElements(ulElement);

		excArray.forEach((item) => {
			const newLiItem = this._createListItem(item);
			ulElement.appendChild(newLiItem);
		});
	}

	remove() {
		const ulElement = this._findListRoot();
		ulElement.addEventListener('click', (e) => {
			e.preventDefault();
			const targetEl = e.target;
			if (this._hasFieldValueLike(targetEl, 'usuń')) {
				const id = this._getIdFromRoot(targetEl);
				this.API_SERVICE.removeData(id)
					.catch((err) => console.error(err))
					.finally(() => this.load());
			}
		});
	}

	add() {
		const form = document.querySelector('.form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const targetEl = e.target;

			if (this._areFieldsCorrect(targetEl)) {
				const { name, description, adultPrice, childPrice } = targetEl.elements;
				const data = {
					name: name.value,
					description: description.value,
					adultPrice: adultPrice.value,
					childPrice: childPrice.value,
				};
				this.API_SERVICE.addData(data)
					.catch((err) => console.error(err))
					.finally(() => {
						this.load();
						targetEl.reset();
					});
			} else {
				alert('Pola nie mogą być puste...');
			}
		});
	}

	update() {
		const ulElement = this._findListRoot();
		ulElement.addEventListener('click', (e) => {
			e.preventDefault();
			const targetEl = e.target;
			if (
				this._hasFieldValueLike(targetEl, 'edytuj') ||
				this._hasFieldValueLike(targetEl, 'zapisz')
			) {
				if (this._isItemEditable(targetEl)) {
					const id = this._getIdFromRoot(targetEl);
					const data = this._createDataToUpdate(targetEl);
					this.API_SERVICE.updateData(data, id)
						.catch((err) => console.error(err))
						.finally(() => {
							targetEl.value = 'edytuj';
							this._setItemEditable(targetEl, false);
						});
				} else {
					targetEl.value = 'zapisz';
					this._setItemEditable(targetEl, true);
				}
			}
		});
	}

	_findListRoot() {
		return document.querySelector('.panel__excursions');
	}

	_createListItem(itemData) {
		const newLiItem = this._createElementFromProto(
			'excursions__item--prototype'
		);
		const [title, description, adultPrice, childPrice] =
			this._getLiItems(newLiItem);

		title.innerText = itemData.name;
		description.innerText = itemData.description;
		adultPrice.innerText = itemData.adultPrice;
		childPrice.innerText = itemData.childPrice;
		newLiItem.dataset.id = itemData.id;

		return newLiItem;
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

	_getLiItems(root) {
		const title = root.querySelector('.excursions__title');
		const description = root.querySelector('.excursions__description');
		const adultPrice = root.querySelector('.excursions__field-price--adult');
		const childPrice = root.querySelector('.excursions__field-price--child');

		return [title, description, adultPrice, childPrice];
	}

	_clearListElements(element) {
		for (const el of element.children) {
			if (!el.className.includes('--prototype')) {
				el.remove();
			}
		}
	}

	_findItemRoot(targetEl) {
		return targetEl.parentElement.parentElement.parentElement;
	}

	_getIdFromRoot(targetEl) {
		return this._findItemRoot(targetEl).dataset.id;
	}

	_hasFieldValueLike(element, value) {
		return element.value === value;
	}

	_areFieldsCorrect(targetEl) {
		const { name, description, adultPrice, childPrice } = targetEl.elements;

		return (
			!this._hasFieldValueLike(name, '') &&
			!this._hasFieldValueLike(description, '') &&
			!this._hasFieldValueLike(adultPrice, '') &&
			!this._hasFieldValueLike(childPrice, '')
		);
	}

	_isItemEditable(targetEl) {
		const rootItem = this._findItemRoot(targetEl);
		const elementsToUpdate = this._getExcItems(rootItem);
		const isEditable = elementsToUpdate.every((el) => el.isContentEditable);

		return isEditable;
	}

	_createDataToUpdate(targetEl) {
		const rootItem = this._findItemRoot(targetEl);
		const [name, description, adultPrice, childPrice] =
			this._getExcItems(rootItem);

		return {
			name: name.innerText,
			description: description.innerText,
			adultPrice: adultPrice.innerText,
			childPrice: childPrice.innerText,
		};
	}

	_setItemEditable(targetEl, value) {
		const rootItem = this._findItemRoot(targetEl);
		const elementsToUpdate = this._getExcItems(rootItem);

		elementsToUpdate.forEach((el) => {
			el.contentEditable = value;
			this._toggleEditableClass(el, 'editable');
		});
	}

	_toggleEditableClass(element, value) {
		element.classList.toggle(value);
	}
}
