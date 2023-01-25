import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI('excursions');
const proto = document.querySelector('.excursions__item--prototype');

const init = () => {
	load();
	remove();
	add();
	update();
};

const load = () => {
	api
		.loadData()
		.then((data) => {
			insertData(data);
		})
		.catch((err) => console.log(err));
};

const remove = () => {
	const ulElement = findRootElement();
	ulElement.addEventListener('click', (e) => {
		e.preventDefault();
		const targetEl = e.target;
		if (isElementValue(targetEl, 'usuń')) {
			const id = getIdFromRoot(targetEl);
			api
				.removeData(id)
				.catch((err) => console.error(err))
				.finally(load);
		}
	});
};

const add = () => {
	const form = document.querySelector('.form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const { name, description, adultPrice, childPrice } = e.target.elements;

		if (
			!isElementValue(name, '') &&
			!isElementValue(description, '') &&
			!isElementValue(adultPrice, '') &&
			!isElementValue(childPrice, '')
		) {
			const data = {
				name: name.value,
				description: description.value,
				adultPrice: adultPrice.value,
				childPrice: childPrice.value,
			};
			api
				.addData(data)
				.catch((err) => console.error(err))
				.finally(() => {
					load();
					e.target.reset();
				});
		} else {
			alert('Pola nie mogą być puste...');
		}
	});
};

const update = () => {
	const ulElement = findRootElement();
	ulElement.addEventListener('click', (e) => {
		e.preventDefault();
		const targetEl = e.target;
		if (
			isElementValue(targetEl, 'edytuj') ||
			isElementValue(targetEl, 'zapisz')
		) {
			if (isItemEditable(targetEl)) {
				const id = getIdFromRoot(targetEl);
				const data = createDataToUpdate(targetEl);
				api
					.updateData(data, id)
					.catch((err) => console.error(err))
					.finally(() => {
						e.target.value = 'edytuj';
						setItemEditable(targetEl, false);
					});
			} else {
				e.target.value = 'zapisz';
				setItemEditable(targetEl, true);
			}
		}
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
	const adultPrice = root.querySelector('.excursions__field-price--adult');
	const childPrice = root.querySelector('.excursions__field-price--child');

	return [title, description, adultPrice, childPrice];
};

const findItemRoot = (targetEl) => {
	return targetEl.parentElement.parentElement.parentElement;
};

const getIdFromRoot = (targetEl) => {
	return findItemRoot(targetEl).dataset.id;
};

const isElementValue = (element, value) => {
	return element.value === value;
};

const clearElement = (element) => {
	element.innerHTML = '';
};

const isItemEditable = (targetEl) => {
	const rootItem = findItemRoot(targetEl);
	const elementsToUpdate = getLiItems(rootItem);
	const isEditable = elementsToUpdate.every((el) => el.isContentEditable);

	return isEditable;
};

const createDataToUpdate = (targetEl) => {
	const rootItem = findItemRoot(targetEl);
	const [name, description, adultPrice, childPrice] = getLiItems(rootItem);

	return {
		name: name.innerText,
		description: description.innerText,
		adultPrice: adultPrice.innerText,
		childPrice: childPrice.innerText,
	};
};

const setItemEditable = (targetEl, value) => {
	const rootItem = findItemRoot(targetEl);
	const elementsToUpdate = getLiItems(rootItem);

	elementsToUpdate.forEach((el) => {
		el.contentEditable = value;
		toggleEditableClass(el, 'editable');
	});
};

const toggleEditableClass = (element, value) => {
	element.classList.toggle(value);
};

document.addEventListener('DOMContentLoaded', init);
