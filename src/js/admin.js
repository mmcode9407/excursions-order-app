import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const API_EXC = new ExcursionsAPI('excursions');
const excProto = document.querySelector('.excursions__item--prototype');

const init = () => {
	load();
	remove();
	add();
	update();
};

document.addEventListener('DOMContentLoaded', init);

const load = () => {
	API_EXC.loadData()
		.then((data) => {
			insertData(data);
		})
		.catch((err) => console.log(err));
};

const remove = () => {
	const ulElement = findListRoot();
	ulElement.addEventListener('click', (e) => {
		e.preventDefault();
		const targetEl = e.target;
		if (hasFieldValueLike(targetEl, 'usuń')) {
			const id = getIdFromRoot(targetEl);
			API_EXC.removeData(id)
				.catch((err) => console.error(err))
				.finally(load);
		}
	});
};

const add = () => {
	const form = document.querySelector('.form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const targetEl = e.target;

		if (areFieldsCorrect(targetEl)) {
			const { name, description, adultPrice, childPrice } = targetEl.elements;
			const data = {
				name: name.value,
				description: description.value,
				adultPrice: adultPrice.value,
				childPrice: childPrice.value,
			};
			API_EXC.addData(data)
				.catch((err) => console.error(err))
				.finally(() => {
					load();
					targetEl.reset();
				});
		} else {
			alert('Pola nie mogą być puste...');
		}
	});
};

const update = () => {
	const ulElement = findListRoot();
	ulElement.addEventListener('click', (e) => {
		e.preventDefault();
		const targetEl = e.target;
		if (
			hasFieldValueLike(targetEl, 'edytuj') ||
			hasFieldValueLike(targetEl, 'zapisz')
		) {
			if (isItemEditable(targetEl)) {
				const id = getIdFromRoot(targetEl);
				const data = createDataToUpdate(targetEl);
				API_EXC.updateData(data, id)
					.catch((err) => console.error(err))
					.finally(() => {
						targetEl.value = 'edytuj';
						setItemEditable(targetEl, false);
					});
			} else {
				targetEl.value = 'zapisz';
				setItemEditable(targetEl, true);
			}
		}
	});
};

const findListRoot = () => {
	return document.querySelector('.panel__excursions');
};

const insertData = (excArray) => {
	const ulElement = findListRoot();
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
	const newElement = excProto.cloneNode(true);
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

const hasFieldValueLike = (element, value) => {
	return element.value === value;
};

const areFieldsCorrect = (targetEl) => {
	const { name, description, adultPrice, childPrice } = targetEl.elements;

	return (
		!hasFieldValueLike(name, '') &&
		!hasFieldValueLike(description, '') &&
		!hasFieldValueLike(adultPrice, '') &&
		!hasFieldValueLike(childPrice, '')
	);
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
