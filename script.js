const players = [
    "David Clifford (Kerry)",
    "Con O'Callaghan (Dublin)",
    "Sean O'Shea (Kerry)",
    "Paul Mannion (Dublin)",
    "Shane Walsh (Galway)",
    "Darren McCurry (Tyrone)",
    "Cormac Costello (Dublin)",
    "Ciaran Kilkenny (Dublin)",
    "Brian Fenton (Dublin)",
    "David Moran (Kerry)",
    "Conor Glass (Derry)",
    "Matthew Ruane (Mayo)",
    "Lee Keegan (Mayo)",
    "James McCarthy (Dublin)",
    "Paddy Durcan (Mayo)",
    "Chrissy McKaigue (Derry)",
    "Gavin White (Kerry)",
    "Tom O'Sullivan (Kerry)",
    "Stephen Cluxton (Dublin)",
    "Shane Ryan (Kerry)"
];

let selectedPlayers = new Set();
let swapMode = false;
let playerToSwap = null;
const pitch = document.querySelector('.pitch');

function getCountyColor(playerName) {
    if (playerName.includes("Kerry")) return "#00B140";
    if (playerName.includes("Dublin")) return "#005490";
    if (playerName.includes("Mayo")) return "#C80000";
    if (playerName.includes("Galway")) return "#8C1515";
    if (playerName.includes("Tyrone")) return "#FFFFFF";
    if (playerName.includes("Derry")) return "#FFFFFF";
    return "#ff4444";
}

function togglePlayer(playerName, listItem) {
    if (swapMode) {
        if (selectedPlayers.has(playerName)) {
            alert("Player is already on the pitch!");
            return;
        }
        addPlayerToPitch(playerName);
        listItem.classList.add('selected');
        return;
    }

    if (selectedPlayers.has(playerName)) {
        removePlayer(new Event('click'), playerName);
        listItem.classList.remove('selected');
    } else {
        const teamSize = parseInt(document.getElementById('teamSize').value);
        if (selectedPlayers.size >= teamSize) {
            alert(`Maximum ${teamSize} players allowed`);
            return;
        }
        addPlayerToPitch(playerName);
        listItem.classList.add('selected');
    }
}

function addPlayerToPitch(playerName) {
    if (swapMode && playerToSwap) {
        const existingPlayer = document.querySelector(`[data-player="${playerToSwap}"]`);
        if (existingPlayer) {
            existingPlayer.setAttribute('data-player', playerName);
            existingPlayer.querySelector('.player-name').textContent = playerName.split('(')[0].trim();
            existingPlayer.style.backgroundColor = getCountyColor(playerName);
            existingPlayer.setAttribute('title', playerName);
        }

        selectedPlayers.delete(playerToSwap);
        selectedPlayers.add(playerName);

        swapMode = false;
        playerToSwap = null;
        document.querySelectorAll('#playersList li').forEach(li => li.classList.remove('swap-mode'));
        return;
    }

    const player = document.createElement('div');
    player.className = 'player';
    player.setAttribute('data-player', playerName);

    const displayName = playerName.split('(')[0].trim();

    player.innerHTML = `
        <span class="player-name">${displayName}</span>
        <div class="remove-player" onclick="removePlayer(event, '${playerName}')">×</div>
    `;

    player.setAttribute('title', playerName);
    player.style.backgroundColor = getCountyColor(playerName);

    const rect = pitch.getBoundingClientRect();
    const x = Math.random() * (rect.width - 50);
    const y = Math.random() * (rect.height - 50);

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    player.addEventListener('dblclick', () => {
        swapMode = true;
        playerToSwap = playerName;
        document.querySelectorAll('#playersList li').forEach(li => {
            if (li.textContent === playerName) {
                li.classList.add('swap-mode');
            }
        });
    });

    pitch.appendChild(player);
    selectedPlayers.add(playerName);
}

function removePlayer(event, playerName) {
    event.stopPropagation();
    const playerElement = document.querySelector(`[data-player="${playerName}"]`);
    if (playerElement) {
        playerElement.remove();
        selectedPlayers.delete(playerName);

        document.querySelectorAll('#playersList li').forEach(li => {
            if (li.textContent === playerName) {
                li.classList.remove('selected');
            }
        });
    }
}

function initializePlayers() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';

    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        li.onclick = () => togglePlayer(player, li);
        const countyColor = getCountyColor(player);
        li.style.borderLeft = `4px solid ${countyColor}`;
        playersList.appendChild(li);
    });
}

function clearPitch() {
    const players = document.querySelectorAll('.player');
    players.forEach(player => player.remove());
    selectedPlayers.clear();

    const playersList = document.getElementById('playersList');
    Array.from(playersList.children).forEach(li => li.classList.remove('selected'));
}

interact('.player').draggable({
    inertia: true,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
        })
    ],
    autoScroll: true,
    listeners: {
        move: dragMoveListener,
    }
});

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

initializePlayers();
document.getElementById('teamSize').addEventListener('change', initializePlayers);