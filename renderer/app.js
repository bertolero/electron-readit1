// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron');
const items = require('./items');

const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');

const toggleModalButtons = () => {

    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
};

showModal.addEventListener('click', e => {
    console.debug(e);
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    console.debug(e);
    modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
    console.debug(e);
    if (itemUrl.value) {
        ipcRenderer.send('new-item', itemUrl.value);

        toggleModalButtons();
    }
});

ipcRenderer.on('new-item-success', (e, newItem) => {
    console.debug(e);

    items.addItem(newItem, true);

    toggleModalButtons();

    modal.style.display = 'none';
    itemUrl.value = '';
});

itemUrl.addEventListener('keyup', e => {
    console.debug(e);
    if (e.key === 'Enter') {
        addItem.click();
    }
});

