import Helper from './Helper';

export default class AdminService extends Helper {
	constructor(API_SERVICE) {
		super(API_SERVICE);
	}

	remove() {
		const ulElement = super._findListRoot('.panel__excursions');
		ulElement.addEventListener('click', (e) => {
			e.preventDefault();
			const targetEl = e.target;
			if (super._hasFieldValueLike(targetEl, 'usuń')) {
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
		const ulElement = super._findListRoot('.panel__excursions');
		ulElement.addEventListener('click', (e) => {
			e.preventDefault();
			const targetEl = e.target;
			if (
				super._hasFieldValueLike(targetEl, 'edytuj') ||
				super._hasFieldValueLike(targetEl, 'zapisz')
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

	_findItemRoot(targetEl) {
		return targetEl.parentElement.parentElement.parentElement;
	}

	_getIdFromRoot(targetEl) {
		return this._findItemRoot(targetEl).dataset.id;
	}

	_areFieldsCorrect(targetEl) {
		const { name, description, adultPrice, childPrice } = targetEl.elements;

		return (
			!super._hasFieldValueLike(name, '') &&
			!super._hasFieldValueLike(description, '') &&
			!super._hasFieldValueLike(adultPrice, '') &&
			!super._hasFieldValueLike(childPrice, '')
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
