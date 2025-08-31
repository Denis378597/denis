// Скрипт игры на языке JavaScript

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var record = document.getElementById("record");
var btnUp = document.getElementById("button-up");
var btnParit = document.getElementById("button-parit");
var winTxt = document.getElementById("window-text");
var imgCont = document.getElementById("img-container");
var per = document.getElementById("pero");

var zharp = new Image();
var bg = new Image();
var fg = new Image();
var prep2 = new Image();
var prep1 = new Image();

// Изображения
zharp.src = "img/zharp.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
prep1.src = "img/prep1.png";
prep2.src = "img/prep2.png";

// Звуковые файлы
var fly = new Audio();
var scoreSound = new Audio();
var luckLvlSound = new Audio();
var luckLvl7Sound = new Audio();

fly.src = "audio/fly.mp3";
scoreSound.src = "audio/score.mp3";
luckLvlSound.src = "audio/luck-lvl.mp3";
luckLvl7Sound.src = "audio/luck-lvl7.mp3";

var gap = 120;
var flyUp = 0;
var flyDown = 0;
var razm = 0;
var moveUpTouch = 0;

// При нажатии на кнопки на клавиатуре
document.addEventListener("keydown", (e) => {
  if (e.code == 'Space') {
    parit();
  }
  else { 
    moveUp();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code == 'Space') {
    grav = 1.6;
  }
  else {    
    moveDown();
  }
});

// При нажатии на кнопки на телефоне
btnUp.addEventListener('touchstart', (event) => {
  btnUp.innerHTML = '';
  moveUp();
  moveUpTouch = setInterval(function(){
    moveUp();
  },120);
});

btnUp.addEventListener('touchend', (event) => {
  btnUp.innerHTML = 'Жми чтобы взлететь!';
  clearInterval(moveUpTouch);
  moveDown();
});

btnParit.addEventListener('touchstart', (event) => {
  btnParit.innerHTML = '';
  parit();
});

btnParit.addEventListener('touchend', (event) => {
  btnParit.innerHTML = 'Жми чтобы парить!';
  grav = 1.6;
});

function moveUp() {
  yPos -= 25;

  if (razm == 0) { 
    zharp.src = "img/zharp2.png" 
    razm = 1;

    clearInterval(flyDown);
    clearInterval(flyUp);

    flyDown = setInterval(() => {
      zharp.src = "img/zharp.png";
    }, 500);

    flyUp = setInterval(() => {
      zharp.src = "img/zharp2.png";
    }, 600);

  };

  fly.play();
}

function moveDown() {
  clearInterval(flyDown);
  clearInterval(flyUp);
  flyDown = setTimeout(() => {
    zharp.src = "img/zharp.png";
  }, 70);
  razm = 0;
}

function parit() {
  grav = 0.5;
}

// Создание блоков
var prep = [];

prep[0] = {
 x : cvs.width,
 y : 0
}

var score = 0;
var luckLvl = 1;
// Позиция Жар-птицы
var xPos = 12;
var yPos = 160;
var grav = 1.6;

if (!localStorage.getItem('maxScore')) {
  localStorage.setItem('maxScore', 0);
}

if (!localStorage.getItem('luckLvl')) {
  localStorage.setItem('luckLvl', 1);
}

if (!localStorage.getItem('pero')) {
  localStorage.setItem('pero', 1);
}

record.innerHTML = "<b><u>Твой рекорд</u></b> <br> Препятствий: " + localStorage.getItem('maxScore') + "<br> Уровень Счастья: " + localStorage.getItem('luckLvl');

function draw() {
  ctx.drawImage(bg, 0, 0);

  for(var i = 0; i < prep.length; i++) {
    ctx.drawImage(prep2, prep[i].x, prep[i].y);
    ctx.drawImage(prep1, prep[i].x, prep[i].y + prep2.height + gap);

    prep[i].x--;

    if(prep[i].x == 100) {
      prep.push({
      x : cvs.width,
      y : Math.floor(Math.random() * prep2.height) - prep2.height
      });
    }

    // Отслеживание прикосновений
    if(xPos + zharp.width >= prep[i].x
    && xPos <= prep[i].x + prep2.width
    && (yPos <= prep[i].y + prep2.height
    || yPos + zharp.height >= prep[i].y + prep2.height + gap) || yPos + zharp.height >= cvs.height - fg.height) {
      if (score > localStorage.getItem('maxScore')) {
        localStorage.setItem('maxScore', score);
        location.hash = "#window-container";
        if (score < 70) { winTxt.innerHTML = "Пройдено препятствий: <b>" + localStorage.getItem('maxScore') + "</b> <br> Уровень Счастья: <b>" + localStorage.getItem('luckLvl') + "</b> <br> <b>Счастье</b> требует терпение и жертв! <br><br> Жми долго <b><Взлететь></b> чтобы поднятся высоко, используй <b><Парить></b> чтобы плавно пройти препятствия и держи <b>Обе вместе</b> чтобы поднятся быстрее <br><br> Пройди все <b>7</b> уровней и найди <b>перо Жар-птицы!</b>"; }
        if (score >= 70 && localStorage.getItem('pero') == 2) { winTxt.innerHTML = "Пройдено препятствий: <b>" + localStorage.getItem('maxScore') + "</b> <br> Уровень Счастья: <b>" + localStorage.getItem('luckLvl') + "</b> <br><br> Ты уже нашёл <b>перо Жар-птицы!</b> <br> <b>Счастье</b> уже твоё!"; }
        if (score >= 70 && localStorage.getItem('pero') == 1) { 
          localStorage.setItem('pero', 2);
          winTxt.innerHTML = "Пройдено препятствий: <b>" + localStorage.getItem('maxScore') + "</b> <br> Уровень Счастья: <b>" + localStorage.getItem('luckLvl') + "</b> <br><br> Ты нашёл <b>перо Жар-птицы!</b> <b>Счастье</b> теперь твоё!"; 
          imgCont.innerHTML += '<img src="img/per2.png" class="pero" alt="">';
        }
        return; 
      }
      else {
        location.reload(); // Перезагрузка страницы
        return; 
      }
    }

    if(prep[i].x == 5) {
      score++;

      //  Уровни Счастья
      if (score == 10) {
          setTimeout(() => {
            gap = 110;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(255, 140, 0)";
         luckLvlSound.play();
      }

      if (score == 20) {
          setTimeout(() => {
            gap = 100;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(255, 230, 0)";
          luckLvlSound.play();
      }

      if (score == 30) {
          setTimeout(() => {
            gap = 90;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(30, 225, 0)";
          luckLvlSound.play();
      }

      if (score == 40) {
          setTimeout(() => {
            gap = 85;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(0, 204, 255)";
          luckLvlSound.play();
      }

      if (score == 50) {
          setTimeout(() => {
            gap = 80;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(0, 119, 255)";
          luckLvlSound.play();
      }

      if (score == 60) {
          setTimeout(() => {
            gap = 75;
          }, 700);
          luckLvl++;
          if (luckLvl > localStorage.getItem('luckLvl')) { localStorage.setItem('luckLvl', luckLvl); }
          cvs.style = "border-color: rgb(221, 0, 255)";
          luckLvlSound.play();
      }

      if (score == 70) {
          cvs.style = "border-color: rgb(255, 255, 255)";
          luckLvl7Sound.play();
      }

      if (score != 10 && score != 20 && score != 30 && score != 40 && score != 50 && score != 60 && score != 70) {
        scoreSound.play();
      }
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(zharp, xPos, yPos);

  yPos += grav;

  // Счёт
  ctx.fillStyle = "#000";
  ctx.font = "25px Arial";
  ctx.fillText("Счет: " + score, 101, cvs.height - 52);
  ctx.fillText("Ур. Счастья: " + luckLvl, 61, cvs.height - 16);

  requestAnimationFrame(draw);
}

prep1.onload = draw();

function reload() {
  location.hash = "#canvas";
  location.reload();
}