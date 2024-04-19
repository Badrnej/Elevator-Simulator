// main.js
let temps = 2;
let debut = 20;
let position = 0;
let current_floor = 0; // Assume the elevator starts at ground floor

// Mouvement d'ascenseur
let porte = document.querySelector(".porte");
let style = document.querySelector('style');
document.head.appendChild(style);

function Mouvement_ascenseur_top(fin) {
    porte.style.animation = `Mouvement ${temps}s ease-in-out forwards`;
    style.innerText += `@keyframes Mouvement { 0% { bottom: ${debut}%;} 100% { bottom: ${fin}%; } }`;
}

let portgauche = document.querySelector(".portgauche");
let portdroit = document.querySelector(".portdroit");

function Porte_ouverte() {
    portgauche.style.animation = "ouverte 2s ease-in-out forwards";
    portdroit.style.animation = "ouverte 2s ease-in-out forwards";
    style.innerText += "@keyframes ouverte { 0% { width: 50%; } 100% { width: 10%; } }";
}

function Porte_Fermer() {
    portgauche.style.animation = "Fermer 2s ease-in-out forwards";
    portdroit.style.animation = "Fermer 2s ease-in-out forwards";
    style.innerText += "@keyframes Fermer { 0% { width: 10%; } 100% { width: 50%; } }";
}

let openDoor = document.querySelector(".open-door");
let closeDoor = document.querySelector(".close-door");

openDoor.onclick = function () {
    Porte_ouverte();
}

closeDoor.onclick = function () {
    Porte_Fermer();
}

let les_tage = [];
let les_tage_bottom = [];
let nombre_tage = document.querySelector(".n_tage span");
let buttons = Array.from(document.querySelectorAll(".button_de_tage a"));

buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        if (index === position) {
            nombre_tage.textContent = "error";
            setTimeout(() => {
                nombre_tage.textContent = "";
                button.style.cssText = "none";
            }, 500);
            return;
        }

        button.style.cssText = "border: 1px solid rgb(0, 255, 21);";
        nombre_tage.textContent += " R" + (index);

        const targetArray = index > position ? les_tage : les_tage_bottom;
        const tempsArray = index > position ? [2, 3, 5, 6] : [6, 5, 3, 2];
        const positionArray = [0, 1, 2, 3];

        targetArray.push(20 * (index));
        temps = tempsArray[positionArray.indexOf(index)];
        position = index;

        console.log("Floor: " + (position));
    });
});

// Effacer les chiffres à l'écran
let reset = document.querySelector(".reset");
reset.onclick = function () {
    nombre_tage.textContent = "";
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.cssText = "border:none;";
    }

    les_tage.length = 0;
    les_tage_bottom.length = 0;
}

//Un programme a commencé à fonctionner
let Start = document.querySelector(".Start");
let mov_top = false;
let mov_botm = false;
let t = false;

function deplacement() {
    if (t) {
        if (nombre_tage.textContent == "") {
            nombre_tage.textContent = "error";
        }
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.cssText = "border:none;";
        }
        if ((les_tage[0] < les_tage_bottom[0] || les_tage_bottom.length == 0) && les_tage.length > 0) {
            moveElevator();
            mov_top = true;
        } else if ((les_tage[0] > les_tage_bottom[0] || les_tage.length == 0) && les_tage_bottom.length > 0) {
            moveElevator_buttom();
            mov_botm = true;
        }

        function moveElevator() {
            if (les_tage.length > 0 && mov_botm == false) {
                Porte_Fermer();
                setTimeout(() => {
                    Mouvement_ascenseur_top(les_tage[0]);
                    current_floor = les_tage[0]; // Update current floor
                }, 4000);
                setTimeout(() => {
                    Porte_ouverte();
                    setTimeout(() => {
                        porte.style.bottom = `${debut}%`;
                        console.log("Floor: " + (debut / 20));
                        style.innerText = "";
                        moveElevator();
                    }, 4000);
                    debut = les_tage[0];
                    les_tage.shift();
                }, 2000 + ((temps + 2) * 1000));
            } else {
                mov_top = false;
                if (les_tage_bottom.length > 0) {
                    moveElevator_buttom(); // Move to waiting floors at the bottom
                } else if (les_tage.includes(0)) {
                    mov_botm = true;
                    setTimeout(() => {
                        Porte_ouverte();
                        setTimeout(() => {
                            porte.style.bottom = `${debut}%`;
                            style.innerText = "";
                            moveElevator_buttom();
                        }, 4000);
                        debut = 0;
                        les_tage.splice(les_tage.indexOf(0), 1);
                    }, 2000 + ((temps + 2) * 1000));
                }
            }
        }

        function moveElevator_buttom() {
            if (les_tage_bottom.length > 0 && mov_top == false) {
                Porte_Fermer();
                setTimeout(() => {
                    Mouvement_ascenseur_top(les_tage_bottom[0]);
                    current_floor = les_tage_bottom[0]; // Update current floor
                    console.log("Floor: " + (current_floor / 20));
                }, 4000);
                setTimeout(() => {
                    Porte_ouverte();
                    setTimeout(() => {
                        porte.style.bottom = `${debut}%`;
                        style.innerText = "";
                        moveElevator_buttom();
                    }, 4000);
                    debut = les_tage_bottom[0];
                    les_tage_bottom.shift();
                }, 2000 + ((temps + 2) * 1000));
            } else {
                mov_botm = false;
                if (les_tage.length > 0) {
                    moveElevator(); // Move to waiting floors at the top
                } else if (les_tage_bottom.includes(0)) {
                    mov_top = true;
                    setTimeout(() => {
                        Porte_ouverte();
                        setTimeout(() => {
                            porte.style.bottom = `${debut}%`;
                            style.innerText = "";
                            moveElevator();
                        }, 4000);
                        debut = 0;
                        les_tage_bottom.splice(les_tage_bottom.indexOf(0), 1);
                    }, 1000 + ((temps + 2) * 5000));
                }
            }
        }
    }
}

Start.onclick = function () {
    t = true;
    deplacement();
}