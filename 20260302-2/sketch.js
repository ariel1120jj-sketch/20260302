let shapes = [];
let bubbles = [];
let song;
let amplitude;
// 外部定義的二維陣列，做為多邊形頂點的基礎座標
let points = [[-3, 5], [3, 7], [1, 5], [2, 4], [4, 3], [5, 2], [6, 2], [8, 4], [8, -1], [6, 0], [0, -3], [2, -6], [-2, -3], [-4, -2], [-5, -1], [-6, 1], [-6, 2]];

function preload() {
  // 在程式開始前預載入外部音樂資源
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 初始化畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化振幅物件
  amplitude = new p5.Amplitude();
  
  // 嘗試播放音樂 (瀏覽器可能會阻擋自動播放，通常需要使用者互動)

  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    // 透過 map() 讀取全域陣列 points，將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率來產生變形
    let s = random(10, 20); // 統一縮放比例，保持形狀
    let shapePoints = points.map(pt => {
      return {
        x: pt[0] * s,
        y: pt[1] * s
      };
    });

    let shape = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(1, 10),
      color: color(random(255), random(255), random(255)),
      points: shapePoints
    };
    shapes.push(shape);
  }

  // 產生 50 個泡泡物件
  for (let i = 0; i < 50; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speed: random(1, 3)
    });
  }
}

function draw() {
  // 設定背景顏色
  background('#ffcdb2');

  // 繪製白色透明泡泡
  noStroke();
  fill(255, 150); 
  for (let b of bubbles) {
    b.y -= b.speed; // 往上漂浮
    if (b.y < -b.size) { // 超出畫面重置
      b.y = height + b.size;
      b.x = random(width);
    }
    ellipse(b.x, b.y, b.size);
  }

  strokeWeight(2);

  // 取得當前音量大小並映射為縮放倍率
  let level = amplitude.getLevel();
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 更新與繪製每個形狀
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    
    if (shape.dx > 0) {
      scale(-sizeFactor, sizeFactor); // 圖片往右移動時，請將圖片左右翻轉
    } else {
      scale(sizeFactor, sizeFactor); // 往左移動請維持原狀
    }

    // 繪製多邊形
    beginShape();
    for (let pt of shape.points) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    // 使用 line 指令依照陣列順序繪製邊框
    stroke(shape.color);
    strokeWeight(2);
    for (let i = 0; i < shape.points.length; i++) {
      let p1 = shape.points[i];
      let p2 = shape.points[(i + 1) % shape.points.length]; // 連接回起點
      line(p1.x, p1.y, p2.x, p2.y);
    }
    
    // 狀態還原
    pop();
  }

  // 如果音樂沒有在播放，顯示提示文字
  if (!song.isPlaying()) {
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Click to Play', width / 2, height / 2);
  }
}

// 輔助函式：點擊滑鼠以確保音樂播放（解決瀏覽器自動播放限制）
function mousePressed() {
  userStartAudio(); // 明確啟動 AudioContext
  if (song.isLoaded() && !song.isPlaying()) {
    song.loop();
  }
}

// 當視窗大小改變時，調整畫布大小以符合視窗
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
