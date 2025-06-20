// --- Configuration ---
const rows = 21;
const cols = 21;
const cellSize = 34;
const container = document.getElementById("playground");
const positionFixed = [];
const grid = [];
const enemies = [];
let enemyCount = 0;

// --- Grille de jeu ---
for (let y = 0; y < rows; y++) {
  const row = [];
  for (let x = 0; x < cols; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (x % 3 === 1 && y % 3 === 1) {
      cell.classList.add("wall");
      positionFixed.push({ x, y });
    } else if (Math.random() < 0.3 && !(x <= 2 && y <= 2)) {
      cell.classList.add("soft-wall");
    }

    container.appendChild(cell);
    row.push(cell);
  }
  grid.push(row);
}

// --- Joueur ---
let x = 0;
let y = 0;
const player = document.getElementById("player");

function updatePlayerPosition() {
  player.style.left = `${x * (cellSize + 1)}px`;
  player.style.top = `${y * (cellSize + 1)}px`;
}

function isBlocked(x, y) {
  const cell = grid[y][x];
  return cell.classList.contains("wall") || cell.classList.contains("soft-wall");
}

updatePlayerPosition();

document.addEventListener("keydown", (e) => {
  let newX = x;
  let newY = y;

  if (e.key === "ArrowRight" && x < cols - 1) newX++;
  if (e.key === "ArrowLeft" && x > 0) newX--;
  if (e.key === "ArrowDown" && y < rows - 1) newY++;
  if (e.key === "ArrowUp" && y > 0) newY--;

  if (!isBlocked(newX, newY)) {
    x = newX;
    y = newY;
    updatePlayerPosition();
  }

  if (e.code === "Space") {
    placeBomb(x, y);
  }
});

// Changement de personnage
const buttons = document.querySelectorAll("#player_caracter_choice_list button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    const imgSrc = img.getAttribute("src");

    player.style.backgroundImage = `url(${imgSrc})`;
  });
});

// --- Bombes ---
let activeBombs = 0;
const maxBombs = 3;

function placeBomb(bombX, bombY) {
  if (activeBombs >= maxBombs) return;
  activeBombs++;

  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.style.left = `${bombX * (cellSize + 1)}px`;
  bomb.style.top = `${bombY * (cellSize + 1)}px`;
  container.appendChild(bomb);

  setTimeout(() => {
    bomb.remove();
    createExplosion(bombX, bombY);
    activeBombs--;
  }, 2000);
}

// --- Fonction modale ---

// Cacher la modale au chargement et ajouter listener bouton "Play Again"
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  if (modal) {
    modal.classList.add("hidden"); // Assure que la modale est cachée au départ
    const btn = document.getElementById("modalButton");
    btn.addEventListener("click", () => {
      location.reload();
    });
  }
});

function showGameModal(message) {
  const modal = document.getElementById("gameModal");
  modal.querySelector("#modalTitle").textContent = message;
  modal.classList.remove("hidden");
}

// --- Explosion ---
function createExplosion(centerX, centerY) {
  const directions = [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 }
  ];

  directions.forEach(({ dx, dy }) => {
    const targetX = centerX + dx;
    const targetY = centerY + dy;

    if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
      const targetCell = grid[targetY][targetX];

      if (targetCell.classList.contains("soft-wall")) {
        targetCell.classList.remove("soft-wall");
      }

      if (x === targetX && y === targetY) {
        showGameModal("You Lose!");
      }

      enemies.forEach((enemy, index) => {
        if (enemy.x === targetX && enemy.y === targetY) {
          container.removeChild(enemy.el);
          enemies.splice(index, 1);
          enemyCount--;
          if (enemyCount === 0) {
            showGameModal("You Win!");
          }
        }
      });

      const explosion = document.createElement("div");
      explosion.classList.add("explosion");
      explosion.style.left = `${targetX * (cellSize + 1)}px`;
      explosion.style.top = `${targetY * (cellSize + 1)}px`;
      container.appendChild(explosion);

      setTimeout(() => {
        explosion.remove();
      }, 500);
    }
  });
}

// --- Ennemis ---
function spawnEnemies(count) {
  while (enemies.length < count) {
    const ex = Math.floor(Math.random() * cols);
    const ey = Math.floor(Math.random() * rows);
    if (!isBlocked(ex, ey) && !(ex <= 2 && ey <= 2)) {
      const enemy = document.createElement("div");
      enemy.classList.add("enemy");
      enemy.style.left = `${ex * (cellSize + 1)}px`;
      enemy.style.top = `${ey * (cellSize + 1)}px`;
      container.appendChild(enemy);
      enemies.push({ x: ex, y: ey, el: enemy });
      enemyCount++;
    }
  }
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const newX = enemy.x + dir.dx;
    const newY = enemy.y + dir.dy;

    if (
      newX >= 0 && newX < cols && newY >= 0 && newY < rows &&
      !isBlocked(newX, newY) &&
      !(x === newX && y === newY)
    ) {
      enemy.x = newX;
      enemy.y = newY;
      enemy.el.style.left = `${newX * (cellSize + 1)}px`;
      enemy.el.style.top = `${newY * (cellSize + 1)}px`;
    }
  });
}

spawnEnemies(10);
setInterval(moveEnemies, 1000);
