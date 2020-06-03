const fs = require('fs');
const {shell} = require('electron');

let readerJS = null;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

const items = document.getElementById('items');

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

window.addEventListener('message', e => {
    if (e.data.action === 'delete-reader-item') {
        this.delete(e.data.itemIndex);

        e.source.close();
    }
});

exports.delete = itemIndex => {
    items.removeChild(items.childNodes[itemIndex]);

    this.storage.splice(itemIndex, 1);

    this.save();

    if (this.storage.length) {
        const newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1;

        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected');
    }
};

exports.getSelectedItem = () => {
    const currentItem = document.getElementsByClassName('read-item selected')[0];

    let itemIndex = 0, child = currentItem;
    while ((child = child.previousSibling) != null) {
        itemIndex++;
    }

    return {node: currentItem, index: itemIndex};
};

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

exports.select = e => {
    console.debug(e);

    this.getSelectedItem().node.classList.remove('selected');

    e.currentTarget.classList.add('selected');
};

exports.changeSelection = direction => {
    console.debug(direction);

    const currentDirection = document.getElementsByClassName('read-item selected')[0];

    if (direction === 'ArrowUp' && currentDirection.previousSibling) {
        currentDirection.classList.remove('selected');
        currentDirection.previousSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentDirection.nextSibling) {
        currentDirection.classList.remove('selected');
        currentDirection.nextSibling.classList.add('selected');
    }

};

exports.openNative = () => {
    if (this.storage.length) {
        const selectedItem = this.getSelectedItem();

        shell.openExternal(selectedItem.node.dataset.url);
    }
}

exports.open = () => {
    if (this.storage.length) {
        const selectedItem = this.getSelectedItem();

        const contentURL = selectedItem.node.dataset.url;

        const readerWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1,
        `);

        readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
    }
};

exports.addItem = (item, isNew = false) => {
    console.debug(item);

    const itemNode = document.createElement('div');

    itemNode.setAttribute('class', 'read-item');

    itemNode.setAttribute('data-url', item.url);

    itemNode.innerHTML = `<img src="${item.screenShot}"><h2>${item.title}</h2></img>`;

    items.appendChild(itemNode);

    itemNode.addEventListener('click', this.select);

    itemNode.addEventListener('dblclick', this.open);

    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    if (isNew) {
        this.storage.push(item);
        this.save();
    }
};

this.storage.forEach(item => {
    this.addItem(item);
})
