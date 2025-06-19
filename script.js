// script.js
const rows = 21;
const cols = 21;
const container = document.getElementById("playground");
const positionFixed = []

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Murs fixes aux positions paires (x et y tous les deux pairs)
    if (x % 3 === 1 && y % 3 === 1) {
        cell.classList.add("wall");
        positionFixed.push({ x, y }); // ← Ajout ici
      }      

    container.appendChild(cell);
  }
}

//Changement de personnage
// Sélectionne tous les boutons des personnages
const buttons = document.querySelectorAll("#player_caracter_choice_list button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    const imgSrc = img.getAttribute("src");

    // Applique l'image comme background du joueur
    player.style.backgroundImage = `url(${imgSrc})`;
  });
});



// Déplacement perso : Si Appuie sur flèches de déplacement :
//- haut => grid-row -1
//- bas => grid-row +1
//- gauche => grid-column -1
//- droite => grid-column +1

let x = 0;
let y = 0;
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
    let newX = x;
    let newY = y;
  
    if (e.key === "ArrowRight" && x < cols - 1) newX++;
    if (e.key === "ArrowLeft" && x > 0) newX--;
    if (e.key === "ArrowDown" && y < rows - 1) newY++;
    if (e.key === "ArrowUp" && y > 0) newY--;
  
    // Vérifie s'il y a un mur à la nouvelle position
    const isWall = positionFixed.some(pos => pos.x === newX && pos.y === newY);
    if (!isWall) {
      x = newX;
      y = newY;
      updatePlayerPosition();
    }
  });

//Poser des bombes quand appuie sur espace :
// Si appuie sur espace => image bombe puis après 1s exlose et cube revient à état cell sauf si wall

