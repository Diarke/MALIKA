const cardsData = [
    { text: "Оттегі", category: "elements" },
    { text: "H₂O", category: "compounds" },
    { text: "Булану", category: "processes" },
    { text: "Көміртек", category: "elements" },
    { text: "CO₂", category: "compounds" }
];

let score = 0;
const totalCards = cardsData.length;
let placedCards = new Map();

function initializeGame() {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = '';
    cardsData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', 'true');
        cardElement.setAttribute('data-category', card.category);
        cardElement.setAttribute('data-id', `card-${index}`);
        cardElement.textContent = card.text;
        cardsContainer.appendChild(cardElement);
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
    });

    document.getElementById('check-btn').addEventListener('click', checkAnswers);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('hover');
    }
}

function dragLeave(e) {
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.remove('hover');
    }
}

function drop(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`.card[data-id="${cardId}"]`);
    const dropZone = e.target.closest('.drop-zone');

    if (!card || !dropZone) return;

    dropZone.classList.remove('hover');

    if (placedCards.has(cardId)) {
        const previousDropZone = placedCards.get(cardId);
        const cardClone = previousDropZone.querySelector(`.card[data-id="${cardId}"]`);
        if (cardClone) {
            previousDropZone.removeChild(cardClone);
        }
    }

    const cardClone = card.cloneNode(true);
    cardClone.setAttribute('draggable', 'true');
    cardClone.classList.remove('dragging');
    cardClone.addEventListener('dragstart', dragStart);
    dropZone.appendChild(cardClone);
    placedCards.set(cardId, dropZone);
}

function checkAnswers() {
    score = 0;
    placedCards.forEach((dropZone, cardId) => {
        const card = document.querySelector(`.card[data-id="${cardId}"]`);
        const cardClone = dropZone.querySelector(`.card[data-id="${cardId}"]`);
        const cardCategory = card.dataset.category;
        const zoneCategory = dropZone.dataset.category;

        if (cardCategory === zoneCategory) {
            score++;
            card.classList.add('correct');
            cardClone.classList.add('correct');
        } else {
            card.classList.add('incorrect');
            cardClone.classList.add('incorrect');
        }
    });

    showResult();
}

function showResult() {
    let level = '';
    if (score <= 1) {
        level = 'Бастауыш';
    } else if (score <= 3) {
        level = 'Орташа';
    } else if (score === 4) {
        level = 'Жоғары';
    } else {
        level = 'Сарапшы';
    }

    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('check-btn').classList.add('hidden');
}

function restartGame() {
    score = 0;
    placedCards.clear();
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('correct', 'incorrect');
    });
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
    });
    document.getElementById('result').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    initializeGame();
}

initializeGame();