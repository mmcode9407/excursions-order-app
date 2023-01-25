import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI('excursions');
const ul = document.querySelector('.panel__excursions');
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
	ul.addEventListener('click', (e) => {
		e.preventDefault();
		if (e.target.value === 'usuń') {
			const id = e.target.parentElement.parentElement.parentElement.dataset.id;
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
			name.value !== '' &&
			description.value !== '' &&
			adultPrice.value !== '' &&
			childPrice.value !== ''
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
			alert('Pola nie mogą być puste');
		}
	});
};

const update = () => {
	ul.addEventListener('click', (e) => {
		e.preventDefault();
		if (e.target.value === 'edytuj' || e.target.value === 'zapisz') {
			const parentElement = e.target.parentElement.parentElement.parentElement;
			const excTitle = parentElement.querySelector('.excursions__title');
			const excDescription = parentElement.querySelector(
				'.excursions__description'
			);
			const adultPrice = parentElement.querySelector(
				'.excursions__field-price--adult'
			);
			const childPrice = parentElement.querySelector(
				'.excursions__field-price--child'
			);
			const elementsToUpdate = [
				excTitle,
				excDescription,
				adultPrice,
				childPrice,
			];
			const isEditable = elementsToUpdate.every((el) => el.isContentEditable);

			if (isEditable) {
				const id = parentElement.dataset.id;
				const data = {
					name: elementsToUpdate[0].innerText,
					description: elementsToUpdate[1].innerText,
					adultPrice: elementsToUpdate[2].innerText,
					childPrice: elementsToUpdate[3].innerText,
				};
				api
					.updateData(data, id)
					.catch((err) => console.error(err))
					.finally(() => {
						e.target.value = 'edytuj';
						elementsToUpdate.forEach((el) => {
							el.contentEditable = false;
							el.classList.remove('editable');
						});
					});
			} else {
				e.target.value = 'zapisz';
				elementsToUpdate.forEach((el) => {
					el.contentEditable = true;
					el.classList.add('editable');
				});
			}
		}
	});
};

const insertData = (excArray) => {
	ul.innerHTML = '';
	excArray.forEach((item) => {
		const newLiItem = createListEl(item);

		ul.appendChild(newLiItem);
	});
};

const createListEl = (itemData) => {
	const newLiItem = proto.cloneNode(true);
	newLiItem.classList.remove('excursions__item--prototype');
	const h2 = newLiItem.firstElementChild.firstElementChild;
	const p = newLiItem.firstElementChild.lastElementChild;
	const adultPrice = newLiItem.querySelector('.excursions__field-price--adult');
	const childPrice = newLiItem.querySelector('.excursions__field-price--child');

	h2.innerText = itemData.name;
	p.innerText = itemData.description;
	adultPrice.innerText = itemData.adultPrice;
	childPrice.innerText = itemData.childPrice;
	newLiItem.dataset.id = itemData.id;

	return newLiItem;
};

document.addEventListener('DOMContentLoaded', init);
