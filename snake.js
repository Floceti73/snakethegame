// fonction du snake 

window.onload = function () {

    // vairables utilisables

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var score = 0;
    var segSize = 10;
    var level = 1;
    var dir = 'right';
    var snake = new Array(4);
    var inPlay = true;
    var life = 5;
    var dm = 0;

    // création de la grille 

    var gameArea = new Array(33);
    for (i = 0; i < gameArea.length; i++) {
    gameArea[i] = new Array(33);
    }

    // taille du canvas 

    canvas.width = 300;
    canvas.height = 380;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    gameArea = createSnake(gameArea);
    gameArea = createFood(gameArea);
    gameArea = createLife(gameArea);
    gameArea = deathMode(gameArea);
    

    // lancement du jeu 
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.fillText('Press SPACE to start', ((canvas.width / 2) - (ctx.measureText('Press SPACE to start').width / 2)), 100);
    window.addEventListener('keydown', function (f) {
    if (f.keyCode == 32 && dir != 'space') {
    runGame();
    }
    });
    window.addEventListener('keydown', function (e) {
    if (e.keyCode == 37 && dir != 'right') {
    dir = 'left';
    } else if (e.keyCode == 38 && dir != 'down') {
    dir = 'up';
    } else if (e.keyCode == 39 && dir != 'left') {
    dir = 'right';
    } else if (e.keyCode == 40 && dir != 'up') {
    dir = 'down';
    }
    });
    function runGame() {

    // reset a chaque mouvement et direction au clavier

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = snake.length - 1; i >= 0; i--) {
    if (i == 0) {
    switch (dir) {
    case 'right':
    if (dir != 'left') {
    snake[0] = { x: snake[0].x + 1, y: snake[0].y }
    break;
    }
    case 'left':
    if (dir != 'right') {
    snake[0] = { x: snake[0].x - 1, y: snake[0].y }
    break;
    }
    case 'up':
    if (dir != 'down') {
    snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
    break;
    }
    case 'down':
    if (dir != 'up') {
    snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
    break;
    }
    }
    
    // si le serpent shoot un bord

    if(snake[0].x < 0 ||
    snake[0].x >=33 ||
    snake[0].y <0 ||
    snake[0].y >=33) {
    endGame(); // fin du game
    return;
    }

    if(gameArea[snake[0].x][snake[0].y] == 'L') {
        life -= 1; // life qui -
        gameArea=createLife(gameArea);
        if (life == 0) {
            endGame();
            return;
        }
        
    }

    if(gameArea[snake[0].x][snake[0].y] == 'D') {
        life = 1; // life qui -
        dm += 1;
        gameArea=deathMode(gameArea);
        if (dm == 2) {
            endGame();
            return;
        }
    }

    
    // si le serpent mange une pomme 

    if(gameArea[snake[0].x][snake[0].y] == 'F') {
    score++; // score qui +
    gameArea=createFood(gameArea);
    if (score === 10 || score === 20 || score === 30 || score === 40) {
        life += 1;
    }
    snake.push({
    x: snake[snake.length-1].x,
    y: snake[snake.length-1].y
    }); // snake qui grandit 

    gameArea[snake[snake.length-1].x][snake[snake.length-1].y] = 'S';

    if ((score % 10) == 0) {
    level++; // level qui augmente tous les 10%
    }
} 
    else if (gameArea[snake[0].x][snake[0].y] == 'S') {
    endGame();
    return;
    }
    gameArea[snake[0].x][snake[0].y] = 'S';
    } else {
    if(i==(snake.length-1)){
    gameArea[snake[i].x][snake[i].y]=null;
    }
    snake[i]={
    x: snake[i-1].x,
    y: snake[i-1].y
    };
    gameArea[snake[i].x][snake[i].y] = 'S';
    }
    }

    
    // items sur la grille

    paintCanvas();
    for (x = 0; x < gameArea.length; x++) {
    for (y = 0; y < gameArea[0].length; y++) {
    if (gameArea[x][y] == 'F') {
    ctx.fillStyle = 'green'; // item pomme
    ctx.fillRect(x * segSize, y * segSize + 80, segSize, segSize);
    }
    else if (gameArea[x][y] == 'S') {
    ctx.fillStyle = 'red';
    ctx.strokeSytle = 'black'; // item serpent 
    ctx.fillRect(x * segSize, y * segSize + 80, segSize, segSize);
    ctx.strokeRect(x * segSize, y * segSize + 80, segSize, segSize);
    } else if (gameArea[x][y] == 'L') { // creation de l'item perte de vie 
    ctx.fillStyle = 'blue';
    ctx.fillRect(x * segSize, y * segSize + 80, segSize, segSize);
    } else if (gameArea[x][y] == 'D') { // creation de l'item perte de vie 
    ctx.fillStyle = 'black';
    ctx.fillRect(x * segSize, y * segSize + 80, segSize, segSize);
}
    }
    }
    if(inPlay){
    setTimeout(runGame, 100-(level*20));
    }
    }
    function paintCanvas() {
    ctx.strokeSytle = "black";
    ctx.strokeRect(0, 80, canvas.width, canvas.height - 80);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText("Score: " + score, (canvas.width/2)-ctx.measureText("Score: "+score).width/2, 55);
    ctx.fillStyle = 'black';
    ctx.fillText("Vies: " + life, (canvas.width/2)-ctx.measureText("Vies: "+life).width/2, 75);
    }

    // fonction creation pomme 

    function createFood(gameArea) {
    var foodX = Math.round(Math.random() * 31);
    var foodY = Math.round(Math.random() * 31);
    while (gameArea[foodX][foodY] == 'S') {
    foodX = Math.round(Math.random() * 31);
    foodY = Math.round(Math.random() * 31);
    }
    gameArea[foodX][foodY] = 'F';
    return gameArea;
    }

    // fonction creation du serpent


    function createSnake(gameArea) {
    var snakeX = Math.round(Math.random() * 31);
    var snakeY = Math.round(Math.random() * 31);
    while ((snakeX - snake.length) < 0) {
    snakeX = Math.round(Math.random() * 31);
    }
    for (i = 0; i < snake.length; i++) {
    snake[i] = {
    x: snakeX - i,
    y: snakeY
    };
    gameArea[snakeX - i][snakeY] = "S";
    }
    return gameArea;
    }

    // fonction creation de la vie 

    function createLife(gameArea) {
        var foodX = Math.round(Math.random() * 31);
        var foodY = Math.round(Math.random() * 31);
        while (gameArea[foodX][foodY] == 'S') {
        foodX = Math.round(Math.random() * 31);
        foodY = Math.round(Math.random() * 31);
        }
        gameArea[foodX][foodY] = 'L';
        return gameArea;
        }

    function deathMode(gameArea) {
            var foodX = Math.round(Math.random() * 31);
            var foodY = Math.round(Math.random() * 31);
            while (gameArea[foodX][foodY] == 'S') {
            foodX = Math.round(Math.random() * 31);
            foodY = Math.round(Math.random() * 31);
            }
            gameArea[foodX][foodY] = 'D';
            return gameArea;
            }


   // fonction fin de partie 

    function endGame() {
    inPlay = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px sans-serif';
    ctx.fillText('Perdu !!!', ((canvas.width / 2) - (ctx.measureText('Perdu !!!').width / 2)), 100);
    ctx.font = '25px sans-serif';
    ctx.fillText('Ton score est de ' + score, ((canvas.width / 2) - (ctx.measureText('Ton score est de ' + score).width / 2)), 200);
    }
    };