const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Variables

// Vitesse sur X (horizontal)
vx = 10;
//Vitesse Y (vertical)
vy = 0;
// pommeX
let pommeX = 0
// pommeY
let pommeY = 0
// score
let score = 0
// Bug direction 
let bugDirection = false
// StopGame 
let stopGame = false

let snake = [   
            // tête du serpent  //
                {x: 140, y:150},
            // tête du serpent  //    
                {x: 130, y:150},
                {x: 120, y:150},
                {x: 110, y:150},
            ]

function animation() {

    if (stopGame === true) {
        return
    } else {
        setTimeout(function(){
            bugDirection = false
            nettoieCanvas()
            dessinePomme()
            faireAvancerSerpent()
    
            dessineLeSerpent()
            // recursion
            animation()
    
        }, 100)
    }
}

animation()
creerPomme()

function nettoieCanvas() {
    ctx.fillStyle = "white"
    ctx.strokeStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
}

function dessineLesMorceaux(morceau) {
    ctx.fillStyle = '#00fe14'
    ctx.strokeStyle = 'black'
    ctx.fillRect(morceau.x, morceau.y, 10, 10)
    ctx.strokeRect(morceau.x, morceau.y, 10, 10)
}

function dessineLeSerpent() {
    snake.forEach(morceau => {
        dessineLesMorceaux(morceau);
    })
}

function faireAvancerSerpent() {
    // Nouvelle tête
    const head = {x: snake[0].x + vx, y: snake[0].y + vy}
    snake.unshift(head)

    if(finDuJeu()){
        snake.shift(head);
        recommencer()
        stopGame = true
        return
    }

    // On vérifie que la tête du serpent est sur la pomme
    const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY
    // Si c'est le cas, on créé une nouvelle pomme et le serpent grossi d'un carré
    // Et sinon le serpent avance normalement
    if(serpentMangePomme) {
        score += 10
        document.getElementById('score').innerHTML = score;
        creerPomme()
    } else {
        snake.pop()
    }
}

dessineLeSerpent()

document.addEventListener('keydown', changerDirection)

function changerDirection(event) {
    // eviter le bug
    if (bugDirection) return
    bugDirection = true

    // TOUCHE = KEYCODE
    const FLECHE_GAUCHE = 37;
    const FLECHE_DROITE = 39;
    const FLECHE_ENHAUT = 38;
    const FLECHE_ENBAS  = 40;

    const direction = event.keyCode

    // On vérifie que le serpent ne peut pas aller dans un sens inverse
    const monter    = vy === -10;
    const descendre = vy ===  10;
    const adroite   = vx ===  10;
    const agauche   = vx === -10;

    // Si on part à droite, on interdit d'aller à gauche
    // Si on part à droite, alors vx = 10 donc inverse de adroite = false
    if (direction === FLECHE_GAUCHE && !adroite)   {vx = -10; vy =   0;}
    if (direction === FLECHE_ENHAUT && !descendre) {vx =   0; vy = -10;}
    if (direction === FLECHE_DROITE && !agauche)   {vx =  10; vy =   0;}
    if (direction === FLECHE_ENBAS  && !monter)    {vx =   0; vy =  10;}
}

function random() {
    // nombre entre 0 et 290 avec le dernier chiffre étant toujours 0
    return Math.round(Math.random() * 290 / 10) * 10;
}

function creerPomme(){

    pommeX = random();
    pommeY = random();
    // console.log(pommeX, pommeY);

    snake.forEach(function(part){

        const serpentSurPomme = part.x == pommeX && part.y == pommeY;

        if(serpentSurPomme) {
            creerPomme();
        }

    })
    
}

function dessinePomme() {
    ctx.fillStyle = 'red'
    ctx.stroleStyle = "darkred"
    ctx.beginPath()
    ctx.arc(pommeX +5, pommeY+5, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

function finDuJeu() {
    let snakeSansTete = snake.slice(1, -1)
    let mordu = false

    snakeSansTete.forEach(morceau => {
        if(morceau.x === snake[0].x && morceau.y === snake[0].y){
            mordu = true;
        }
    })

    // Si la tête est a -1 c'est qu'elle a dépassé le mur gauche
    const toucheMurGauche = snake[0].x < -1
    const toucheMurDroite = snake[0].x > canvas.width  -10
    const toucheMurTop    = snake[0].y < -1
    const toucheMurBottom = snake[0].y > canvas.height -10

    let gameOver = false 

    if (mordu || toucheMurGauche || toucheMurTop || toucheMurDroite || toucheMurBottom) {
        gameOver = true
    }

    return gameOver
}

function recommencer() {
    const restart = document.getElementById('recommencer')
    restart.style.display = "block"

    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 32) {
            document.location.reload(true)
        }
    })
}