const items = document.getElementById('items');

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

exports.select = e => {
    console.debug(e);

    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

    e.currentTarget.classList.add('selected');
};

exports.changeSelection = direction => {
    console.debug(direction);

    const currentDirection = document.getElementsByClassName('read-item selected')[0];

    if (direction === 'ArrowUp' && currentDirection.previousSibling) {
        currentDirection.classList.remove('selected');
        currentDirection.previousSibling.classList.add('selected');
    } else if(direction === 'ArrowDown' && currentDirection.nextSibling) {
        currentDirection.classList.remove('selected');
        currentDirection.nextSibling.classList.add('selected');
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

    if(document.getElementsByClassName('read-item').length === 1) {
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
