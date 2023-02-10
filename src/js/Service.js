export default class Service {
	constructor(API) {
		this.API_SERVICE = API;
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
		const adultPrice = root.querySelector('.excursions__field-price--adult');
		const childPrice = root.querySelector('.excursions__field-price--child');

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

	_hasFieldValueLike(element, value) {
		return element.value === value;
	}
}
