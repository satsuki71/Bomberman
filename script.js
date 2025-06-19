// script.js
const rows = 21;
const cols = 21;
const container = document.getElementById("playground");

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Murs fixes aux positions paires (x et y tous les deux pairs)
   if (x % 3 === 1 && y % 3 === 1) {
        cell.classList.add("wall");
    }

    container.appendChild(cell);
  }
}


// Déplacement perso : Si Appuie sur flèches de déplacement :
//- haut => grid-row -1
//- bas => grid-row +1
//- gauche => grid-column -1
//- droite => grid-column +1

let x = 1;
let y = 1;
const cellSize = 34
const player = document.getElementById("player");
const wall = document.getElementsByClassName("wall")
// Mettre à jour la position du joueur (pixels)
function updatePlayerPosition() {
    player.style.left = `${x * (cellSize + 1)}px`; // +1 à cause du gap
    player.style.top = `${y * (cellSize + 1)}px`;
  }
  
  updatePlayerPosition();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && x < cols - 1) x++;
    if (e.key === "ArrowLeft" && x > 0) x--;
    if (e.key === "ArrowDown" && y < rows - 1) y++;
    if (e.key === "ArrowUp" && y > 0) y--;
  
    updatePlayerPosition();
  });

