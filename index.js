const dificult = prompt("Введите сложность (easy/hard/insane)", 'easy');
const mapSizeX = prompt("Введите размер карты по оси X (от 10 до 50)", '40');
const mapSizeY = prompt("Введите размер карты по оси Y (от 10 до 50)", '20');


// Матрица карты
function createMatrix(x, y) {
    let arr = new Array();

    for(let i = 0; i < x; i++) {
        arr[i] = new Array();

        for(let j = 0; j < y; j++){
            arr[i][j] = {
                type: 'tileW',
                x: j, 
                y: i,
            
            };
        }
    }

    return arr;
}
let map = createMatrix(mapSizeY,mapSizeX);


//Генератор 
function generateMap() {
    let field = document.querySelector('.field');
    field.innerHTML = '';
    field.style.width= `${mapSizeX * 30}px`;
    field.style.height= `${mapSizeY * 30}px`;
    let healthPointValue;
    

    for (let y = 0; y < map.length; y++) {  
        
        for (let x = 0; x < map[0].length; x++) {
        let tile = document.createElement('div');
        
        let currecntX = x * 30;
        let currecntY = y * 30;

        tile.className = map[y][x].type;

        tile.style.left = `${currecntX}px`;
        tile.style.top = `${currecntY}px`;
        
        field.append(tile);

        let healthPosition = document.querySelector('.field').lastChild;
        let healthPoint = document.createElement('div');

        healthPoint.className = 'health';
        healthPointValue = map[y][x].hp;
        healthPoint.style.width = `${healthPointValue}%`;

        healthPosition.append(healthPoint);
        };
    };
};

// генератор проходов. 
function getRandomBetween(min, max) {
    max++;

    return Math.floor(Math.random() * (max - min) + min);
};
  
function createWayX() {
    let rowQuantity = getRandomBetween(3, 5);

    for (let i = 0; i < rowQuantity; i++) {

        let y = Math.floor(Math.random() * mapSizeY);

        
        for (let j = 0; j < map[0].length; j++) {
            if (map[y][j].edge != 'not') {
                map[y][j].type = 'tile';

                map[y][j].edge = 'not';
                if (map[y - 1]) {
                    map[y - 1][j].edge = 'not';
                };  
                if (map[y + 1]) {
                    map[y + 1][j].edge = 'not';
                };  
            } else  {
                j--;
                y = Math.floor(Math.random() * mapSizeY);
            };
        };
    };
        
    generateMap();
};

function createWayY() {
    let columnQuantity = getRandomBetween(3, 5);

    for (let i = 0; i < columnQuantity; i++) {

        let x = Math.floor(Math.random() * mapSizeX);

        
        for (let j = 0; j < map.length; j++) {
            if (map[j][x].edge2 != 'not') {
                map[j][x].type = 'tile';

                map[j][x].edge2 = 'not';
                if (map[j][x - 1]) {
                    map[j][x - 1].edge2 = 'not';
                };  
                if (map[j][x + 1]) {
                    map[j][x + 1].edge2 = 'not';
                };  
            } else  {
                j--;
                x = Math.floor(Math.random() * mapSizeX);
            };
        };
    };
        
    generateMap();
};

function createWays() {
    createWayY();
    createWayX();
}

// Генератор случайных комнат 
function createRooms() {
    let roomsQuantity = getRandomBetween(5, 10);
    for (let i = 0; i < roomsQuantity; i++) {
        createOneRoom();
    };
    generateMap();

};

function createOneRoom() {
    let height = getRandomBetween(3, 8);
    let width = getRandomBetween(3, 8);

    let position = getRandomPosition(); 
    let x = position[0]; 
    let y = position[1];

    for (let i = 0; i < height; i++) {
        if (y + i < map.length) {
            for (let j = 0; j < width; j++) {
                if (x + j < map[0].length) {
                map[y][x + j].type = 'tile';
                };
            };
        y++;
        };
    };
};

function getRandomPosition() {
    let position = [0, 0]; 
    
    position[1] = Math.floor(Math.random() * map.length);
    if (position[1] > 17) {   
        position[1] -= 4;
    } 
    position[0] = Math.floor(Math.random() * map[0].length);
    if (position[0] > 37) {   
        position[0] -= 4;
    } 


    return position; 
};

// мечи и зелья
function getFreeTiles() {
    let freeTiles = new Array(); 
    let numberInArray = 0; 

    for(let i = 0; i < map.length; i++) {
        
            for(let j = 0; j < map[0].length; j++){
                
                if (map[i][j].type == 'tile') {
                    numberInArray += 1;
                    freeTiles.push({
                        x: j, 
                        y: i,
                    });
                };
            };
        
      };
    return freeTiles; 
};

function createOneSword() {
    let freeTiles = getFreeTiles(); 

    let randomFreeTile = Math.floor(Math.random() * freeTiles.length); 

    let x = freeTiles[randomFreeTile].x; 
    let y = freeTiles[randomFreeTile].y;  
    
    map[y][x].type = 'tileSW';
    
};

function createOneHealth() {
    let freeTiles = getFreeTiles(); 

    let randomFreeTile = Math.floor(Math.random() * freeTiles.length); 

    let x = freeTiles[randomFreeTile].x; 
    let y = freeTiles[randomFreeTile].y;  
    
    map[y][x].type = 'tileHP';
    
};

function createSwordsHealth() {
    createOneSword();
    createOneSword();
    for (let i = 0; i < 10; i++) {
        createOneHealth()
    };
};

function createPerson() {
    let freeTiles = getFreeTiles(); 

    let randomFreeTile = Math.floor(Math.random() * freeTiles.length); 

    let x = freeTiles[randomFreeTile].x; 
    let y = freeTiles[randomFreeTile].y;  
    
    map[y][x].type = 'tileP';
    map[y][x].hp = 100;
    map[y][x].dmg = 50;
    
};

function createEnemies() {
    for (let i = 0; i < 10; i++) {
        let freeTiles = getFreeTiles(); 

        let randomFreeTile = Math.floor(Math.random() * freeTiles.length); 

        let x = freeTiles[randomFreeTile].x; 
        let y = freeTiles[randomFreeTile].y;  
        
        map[y][x].type = 'tileE';
        map[y][x].hp = 100;
    };
};

// передвижение героя
document.addEventListener('keydown', function(event) {
    console.log(event.code);
    if (event.code == 'KeyW') {
        changePos(1, 'tileP', 0);
    };
    if (event.code == 'KeyA') {
        changePos(2, 'tileP', 0);
    };
    if (event.code == 'KeyS') {
        changePos(3, 'tileP', 0);
    };
    if (event.code == 'KeyD') {
        changePos(4, 'tileP', 0);
    };
});

function changePos(key, type, i) {
    let pos = getCurrentPos(type)[i]; 
    let y = pos[0];
    let x = pos[1]; 

        if (key == 1) {
            if (map[y - 1][x].type != 'tileW' && map[y - 1][x].type != 'tileE' && map[y - 1][x].type != 'tileP') {

                if (isHeal(y - 1, x) && type == 'tileP') {
                    heal(y, x);
                }; 

                if (isSword(y - 1, x) && type == 'tileP') {
                    uppDmg(y, x);
                }; 

                map[y - 1][x].type = type;
                map[y][x].type = 'tile';

                map[y - 1][x].hp = map[y][x].hp;
                map[y][x].hp = '';

                if (type == 'tileP') {
                    map[y - 1][x].dmg = map[y][x].dmg;
                    map[y][x].dmg = '';
                };

            };
        };
        if (key == 2) {
            if (map[y][x - 1].type != 'tileW' && map[y][x - 1].type != 'tileE' && map[y][x - 1].type != 'tileP') {

                if (isHeal(y, x - 1) && type == 'tileP') {
                    heal(y, x);
                }; 

                if (isSword(y, x - 1) && type == 'tileP') {
                    uppDmg(y, x);
                }; 

                map[y][x - 1].type = type;
                map[y][x].type = 'tile';

                map[y][x - 1].hp = map[y][x].hp;
                map[y][x].hp = '';

                if (type == 'tileP') {
                    map[y][x - 1].dmg = map[y][x].dmg;
                    map[y][x].dmg = '';
                };
            };
        };
        if (key == 3) {
            if (map[y + 1][x].type != 'tileW' && map[y + 1][x].type != 'tileE' && map[y + 1][x].type != 'tileP') {

                if (isHeal(y + 1, x) && type == 'tileP') {
                    heal(y, x);
                }; 

                if (isSword(y + 1, x) && type == 'tileP') {
                    uppDmg(y, x);
                };  

                map[y + 1][x].type = type;
                map[y][x].type = 'tile';

                map[y + 1][x].hp = map[y][x].hp;
                map[y][x].hp = '';

                if (type == 'tileP') {
                    map[y + 1][x].dmg = map[y][x].dmg;
                    map[y][x].dmg = '';
                };
            };
        };
        if (key == 4) {
            if (map[y][x + 1].type != 'tileW' && map[y][x + 1].type != 'tileE' && map[y][x + 1].type != 'tileP') {
                
                if (isHeal(y, x + 1) && type == 'tileP') {
                    heal(y, x);
                }; 

                if (isSword(y, x + 1) && type == 'tileP') {
                    uppDmg(y, x);
                }; 

                map[y][x + 1].type = type;
                map[y][x].type = 'tile';

                map[y][x + 1].hp = map[y][x].hp;
                map[y][x].hp = '';

                if (type == 'tileP') {
                    map[y][x + 1].dmg = map[y][x].dmg;
                    map[y][x].dmg = '';
                };
            };
        };
    generateMap();

};

function getCurrentPos(unitType){
    let pos = new Array();

    let unitQuantity = 0;

    for(let i = 0; i < map.length; i++) {
        
        for(let j = 0; j < map[0].length; j++){
            
            if (map[i][j].type == unitType) {
                    pos[unitQuantity] = [i, j];
                    unitQuantity++;
            };
        };
    
    };
    return pos;
};

//удар 
document.addEventListener('keydown', function(event) {
    if (event.code == 'Space') {
        hitSoundPerson(); 
        changeEnemyHp();
        
    };
});

function changeEnemyHp() {
    let pos = getCurrentPos('tileP')[0];

    let y = pos[0];
    let x = pos[1]; 

    let heroDmg = getHeroDmg(y ,x);

    if (x < mapSizeX - 1) {
        if (map[y][x + 1].hp) {
            map[y][x + 1].hp -= heroDmg;
            map[y][x].dmg = 50; 

            if (map[y][x + 1].hp <= 0) {

                map[y][x + 1].type = 'tile';
            };
        };
    };
    if (x > 0) {
        if (map[y][x - 1].hp) {
            map[y][x - 1].hp -= heroDmg;
            map[y][x].dmg = 50; 

            if (map[y][x - 1].hp <= 0) {

                map[y][x - 1].type = 'tile';
            };
        };    
    };
    if (y < mapSizeY - 1) {
        if (map[y + 1][x].hp) {
            map[y + 1][x].hp -= heroDmg;
            map[y][x].dmg = 50; 

            if (map[y + 1][x].hp <= 0) {

                map[y + 1][x].type = 'tile';
            };
        };    
    };
    if (y > 0) {
        if (map[y - 1][x].hp) {
            map[y - 1][x].hp -= heroDmg;
            map[y][x].dmg = 50; 

            if (map[y - 1][x].hp <= 0) {

                map[y - 1][x].type = 'tile';
            };
        };
    };
    generateMap();


};

function getHeroDmg(y ,x) {
    return map[y][x].dmg;
};


// интервал действия врагов
function enemyMove(period) {
    if (period == 'easy') {
        period = 1000;
    } else if (period == 'hard') {
        period = 500;
    } else if (period == 'Dara') {
        period = 100;
    } else {
        period = 250;
    };

    let timer = setInterval(function() {
        randomEnemyAction(); 
        let enemyQuantity = getCurrentPos('tileE').length; 

        if (enemyQuantity == 0) {
            clearInterval(timer);
            location.reload();
        };
    }, period);

}; 



// атака по герою
function changePersonHp(enemyNumber) {
    let pos = getCurrentPos('tileE')[enemyNumber];

    let y = pos[0];
    let x = pos[1]; 


    if (x < mapSizeX - 1) {
        if (map[y][x + 1].hp) {
                map[y][x + 1].hp -= 30;

                if (map[y][x + 1].hp <= 0) {

                    map[y][x + 1].type = 'tile';
                };
            };
    };
    if (x > 0) {
        if (map[y][x - 1].hp) {
            map[y][x - 1].hp -= 30;

            if (map[y][x - 1].hp <= 0) {

                map[y][x - 1].type = 'tile';
            };
        };    
    };
    if (y < mapSizeY - 1) {
        if (map[y + 1][x].hp) {
            map[y + 1][x].hp -= 30;

            if (map[y + 1][x].hp <= 0) {
                map[y + 1][x].type = 'tile';
            };
        };    
    };
    if (y > 0) {
        if (map[y - 1][x].hp) {
            map[y - 1][x].hp -= 30;

            if (map[y - 1][x].hp <= 0) {
                map[y - 1][x].type = 'tile';
            };
        };
    };
    generateMap();


};

// передвижение врага
function randomEnemyMove(enemyNumber) {
    let random = Math.floor(Math.random() * 4) + 1;
    changePos(random, 'tileE', enemyNumber);

};

//выбор действия


function randomEnemyAction(){
    let enemyQuantity = getCurrentPos('tileE').length; 

    for (let i = 0; i < enemyQuantity; i ++) {
        let pos = getCurrentPos('tileE')[i];

        let y = pos[0];
        let x = pos[1]; 

        let hit = 0;
            if (x < mapSizeX - 1) {
                if (map[y][x + 1].type == 'tileP') { 
                    changePersonHp(i);
                    hitSoundEnemy();
                } else {
                    hit++;
                };
            };
            if (x > 0) {
                if (map[y][x - 1].type == 'tileP') { 
                    changePersonHp(i);
                    hitSoundEnemy();
                } else {
                    hit++;
                };
                
            };
            if (y < mapSizeY - 1) {
                if (map[y + 1][x].type == 'tileP') { 
                    changePersonHp(i);
                    hitSoundEnemy();
                } else {
                    hit++;
                };
                
                
            };
            if (y > 0) {
                if (map[y - 1][x].type == 'tileP') { 
                    changePersonHp(i);
                    hitSoundEnemy();
                } else {
                    hit++;
                };
        if (hit > 0) {
            randomEnemyMove(i);
            
        };
            
        };
    };
};

// Хилки

function isHeal(y, x) {
    if (map[y][x].type == 'tileHP') {
        return true;
    };
};

function heal(y, x) {
    if (map[y][x].hp <= 40) {
        map[y][x].hp += 60; 
    } else { 
        map[y][x].hp = 100; 
    };
};

// Мечи

function isSword(y, x) {
    if (map[y][x].type == 'tileSW') {
        return true;
    };
};
function uppDmg(y, x) {
    if (map[y][x].dmg != 100) {
        map[y][x].dmg = 100; 
    };    
};

function hitSoundPerson() {
    var audio = new Audio(); 
    audio.src = 'korotkiy-gluhoy-metallicheskiy-stuk.mp3';
    audio.autoplay = true;
}; 

function hitSoundEnemy() {
    var audio = new Audio(); 
    audio.src = 'zvon-jeleznogo-mecha.mp3';
    audio.autoplay = true;
}; 




window.onload = function () {
    

    createWays();   
    createRooms();
    createSwordsHealth();
    createPerson();
    createEnemies();
    enemyMove(dificult);

    generateMap();

};