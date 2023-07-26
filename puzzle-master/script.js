const imgFile = document.getElementById("imgFile");
const imgPreview = document.getElementById("imgPreview");
const imgGrid = document.getElementById("imgGrid");

imgFile.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      imgPreview.src = reader.result;

      splitImage();
    };
    reader.readAsDataURL(file);
  }
});

function splitImage() {

  //bağlı liste

  class Node {
    constructor(value) {
      this.value = value;
      this.ID = value;
      this.placed = null;
      this.next = null;
      (this.north = null),
        (this.south = null),
        (this.east = null),
        (this.west = null),
        (this.northeast = null),
        (this.northwest = null),
        (this.southeast = null),
        (this.southwest = null);
    }
  }

  class LinkedList {
    constructor() {
      this.size = 0;
      this.grid = [];
    }

    addNode(value) {
      const node = new Node(value);

      // Yeni düğümü matrise ekle
      const row = Math.floor(this.size / 4);
      const col = this.size % 4;
      if (!this.grid[row]) {
        this.grid[row] = [];
      }
      this.grid[row][col] = node;

      // Komşu pointerları ayarla
      if (row > 0) {
        node.north = this.grid[row - 1][col];
        this.grid[row - 1][col].south = node;
      }
      if (col > 0) {
        node.west = this.grid[row][col - 1];
        this.grid[row][col - 1].east = node;
      }
      if (row > 0 && col > 0) {
        node.northwest = this.grid[row - 1][col - 1];
        this.grid[row - 1][col - 1].southeast = node;
      }
      if (row > 0 && col < 3) {
        node.northeast = this.grid[row - 1][col + 1];
        this.grid[row - 1][col + 1].southwest = node;
      }

      this.size++;
    }
  }
  const linkedList = new LinkedList();
  const linkedList2 = new LinkedList();
  for (let i = 1; i <= 16; i++) {
    linkedList.addNode(i);
    linkedList2.addNode(i);
  }
  // sıradaki düğüm pointerı : 1,2,3,4,5....16
  let currentNode = linkedList.grid[0][0];
  let currentNode2 = linkedList2.grid[0][0];
  for (let i = 0; i < linkedList.size - 1; i++) {
    currentNode.next = linkedList.grid[Math.floor((i + 1) / 4)][(i + 1) % 4];
    currentNode = currentNode.next;

    currentNode2.next = linkedList2.grid[Math.floor((i + 1) / 4)][(i + 1) % 4];
    currentNode2 = currentNode2.next;
  }

  var a = -1;
  var b = -1;
  let idNum = 1;
  const img = document.createElement("img");
  img.onload = function () {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const tileSizeW = Math.min(imgWidth, imgHeight) / 4;
    const tileSizeH = Math.min(imgWidth, imgHeight) / 4;
    const canvas = document.createElement("canvas");
    canvas.width = tileSizeW;
    canvas.height = tileSizeH;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < 4; y++) {
      b = -1;
      a++;
      for (let x = 0; x < 4; x++) {
        b++;

        ctx.drawImage(
          img,
          x * tileSizeW,
          y * tileSizeH,
          tileSizeW,
          tileSizeH,
          0,
          0,
          tileSizeW,
          tileSizeH
        );
        const node = linkedList.grid[a][b];
        const node2 = linkedList2.grid[a][b];
        node.value = '<img src="' + canvas.toDataURL() + '">';
        node2.value = '<img src="' + canvas.toDataURL() + '">';
        const tile = document.createElement("button");
        tile.className = "col";
        tile.id = idNum;
        idNum++;
        tile.innerHTML = node2.value;

        imgGrid.appendChild(tile);
      }
    }

    //tıklanan butonların yerlerini değiştir

    const buttons = document.querySelectorAll(".col");

    let firstbuttonID = null;
    let secondbuttonID = null;
    var firstNodeValue = null;
    var secondNodeValue = null;
    var firstNode = null;
    var secondNode = null;
    var firstNodeID = null;
    var secondNodeID = null;
    var tempFirstNodeValue = null;
    var tempFirstNodeID = null;

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        if (firstbuttonID == null) {
          firstbuttonID = button.id;

          firstNode = findNodesWithValue(linkedList2.grid[0][0], firstbuttonID);
          firstNodeValue = firstNode.value;
          tempFirstNodeValue = firstNodeValue;
          firstNodeID = firstNode.ID;
          tempFirstNodeID = firstNodeID;
        } else {
          secondbuttonID = button.id;
          secondNode = findNodesWithValue(
            linkedList2.grid[0][0],
            secondbuttonID
          );
          secondNodeValue = secondNode.value;
          secondNodeID = secondNode.ID;

          // tıklanan butonlarla aynı ID'ye sahip düğümlerin görsellerini değiştir
          const button_element = document.getElementById(firstbuttonID);
          button_element.innerHTML = secondNodeValue;
          //değeri düğümde değiştir
          firstNode.value = secondNodeValue;
          secondNode.value = tempFirstNodeValue;
          // daha sonra butonları bulmak için ID'leri değiştir
          // firstNode.ID = secondNodeID;
          // secondNode.ID = tempFirstNodeID;
          
          const button_element2 = document.getElementById(secondbuttonID);
          button_element2.innerHTML = firstNodeValue;
          countMove();
          firstNodeValue = null;
          secondNodeValue = null;
          firstbuttonID = null;
          secondbuttonID = null;
          var head1 = linkedList.grid[0][0];
          var head2 = linkedList2.grid[0][0];

          var score = compareLists(head1, head2);
          const scoreTab = document.getElementById("score");
          scoreTab.innerHTML = ("Skor: ", score);
          
          // moveCounter++; // hamle sayısını artır
          // document.getElementById("moves").innerHTML = "Hamle sayısı: " + moveCounter; // hamle sayısını güncelle
         
          // //tıklanan HTML elementlerinin ID'lerini değiştir

          // var tempHTMLid = firstbuttonID;
          // firstbuttonID = secondbuttonID;
          // secondbuttonID = tempHTMLid;
        }
      });
    });
  };
  img.src = imgPreview.src;
  const startbtn = document.getElementById("startbtn");
  startbtn.addEventListener("click", function () {
    let x = Math.floor(Math.random() * 4);
    let y = Math.floor(Math.random() * 4);
    shuffle(linkedList2.grid[0][0], linkedList2.grid[x][y].value);

    for (let m = 0; m < 4; m++) {
      for (let n = 0; n < 4; n++) {
        const node = linkedList2.grid[m][n];
        const element = document.getElementById(node.ID);
        element.innerHTML = node.value;
      }
    }
    linkedList2.grid[x][y].placed = true;
    var ilkButtonID = linkedList2.grid[x][y].ID;
    const ilkButton = document.getElementById(ilkButtonID);
    ilkButton.disabled = true;
    ilkButton.style.backgroundColor = "rgba(0,255,0,1)";
  });


}

function shuffle(head, randomGrid) {
  // Bağlı listenin image değerlerini bir diziye aktar
  var imageArray = [];
  var currentNode = head;

  while (currentNode !== null) {
    // Belirli bir elemanın image değerini değiştirmemek için kontrol sağla
    if (currentNode.value !== randomGrid) {
      imageArray.push(currentNode.value);
    }
    currentNode = currentNode.next;
  }

  // Diziyi karıştır
  imageArray.sort(function () {
    return 0.5 - Math.random();
  });


  // Bağlı listedeki elemanların image değerlerini karıştırılmış diziye göre güncelle
  currentNode = head;
  var i = 0;
  while (currentNode !== null) {
    // Belirli bir elemanın image değerini değiştirmemek için kontrol sağla
    if (currentNode.value !== randomGrid) {

      currentNode.value = imageArray[i];
      

      i++;
    }
    currentNode = currentNode.next;
  }
}

// ilgili düğümü bul
function findNodesWithValue(head, reqID) {
  let currentNode = head;

  while (currentNode != null) {
    if (currentNode.ID == reqID) {
      return currentNode;
    }
    currentNode = currentNode.next;
  }
}
let placedNodes = [];
function compareLists(head1, head2) {
  var score = 0;

  
  let currentNode = head2; // başlangıç düğümü
  while (currentNode !== null) {
    if (currentNode.placed === true) {
      placedNodes.push(currentNode);
      
    }
    currentNode = currentNode.next;
  }
  // node2 üzerinde işlem yaptığımız, karışık olan bağlı listenin düğümü.
  // node1 ise orijinal listede ona karşılık gelen düğüm.
  function findMatchingNode(node2, head1) {
    let node1 = head1;
    let result = [];

    while (node1 !== null) {
      if (node2.value === node1.value) {
        console.log(node2.ID);
        if (
          node1.north !== null &&
          node2.north !== null &&
          node2.north.value === node1.north.value
        ) {
          console.log(node2.north);
          result.push(node2.north);
        }
        if (
          node1.northeast !== null &&
          node2.northeast !== null &&
          node2.northeast.value === node1.northeast.value
        ) {
          console.log(node2.northeast);
          result.push(node2.northeast)
        }
        if (
          node1.east !== null &&
          node2.east !== null &&
          node2.east.value === node1.east.value
        ) {
          console.log(node2.east);
          result.push(node2.east)
        }
        if (
          node1.southeast !== null &&
          node2.southeast !== null &&
          node2.southeast.value === node1.southeast.value
        ) {
          console.log(node2.southeast);
          result.push(node2.southeast)
        }
        if (
          node1.south !== null &&
          node2.south !== null &&
          node2.south.value === node1.south.value
        ) {
          console.log(node2.south);
          result.push(node2.south)
        }
        if (
          node1.southwest !== null &&
          node2.southwest !== null &&
          node2.southwest.value === node1.southwest.value
        ) {
          console.log(node2.southwest);
          result.push(node2.southwest)
        }
        if (
          node1.west !== null &&
          node2.west !== null &&
          node2.west.value === node1.west.value
        ) {
          console.log(node2.west);
          result.push(node2.west)
        }
        if (
          node1.northwest !== null &&
          node2.northwest !== null &&
          node2.northwest.value === node1.northwest.value
        ) {
          console.log(node2.northwest);
          result.push(node2.northwest)
        }
      }
      node1 = node1.next;
    }
    console.log("result döndü: ", result.length, " ", result)
    return result;


  }

  for (let i = 0; i < placedNodes.length; i++) {
    let currentNode = placedNodes[i];
    let matchingNodes = findMatchingNode(currentNode, head1);
    for (let i = 0; i < matchingNodes.length; i++) {
      let matchingNode = matchingNodes[i];
      if (matchingNode !== null && matchingNode.placed !== true) {
        var tempLength = placedNodes.length;
        matchingNode.placed = true;
        if (matchingNode.placed == true) {
          placedNodes.push(matchingNode);
          
          

          var kilitlenecekID = matchingNode.ID;
          

          const kilitlenecek = document.getElementById(kilitlenecekID);
          kilitlenecek.disabled = true;
          kilitlenecek.style.backgroundColor = "rgba(0,255,0,1)";
          
        }
        //ilgili butonu kilitle
        // var kilitlenecekID = matchingNode.ID;


        
      } 
    }
  }
  endGame(); // oyun bitti mi diye kontrol et
  return score;
}
let timerInterval;
let seconds = 0;
function startTimer() {
  const timerElement = document.getElementById('timer');

  timerInterval = setInterval(() => {

  }, 1000);
  return seconds;
}

function stopTimer() {
  clearInterval(timerInterval);
  console.log('Süre:', document.getElementById('timer').innerText, 'saniye');
}

const startBtn = document.getElementById('startbtn');
startBtn.addEventListener('click', startTimer); // start butonuna tıklandığında startTimer fonksiyonu çağrılır

//hamle sayısını tutmak için 
let moveCount = 0;

function countMove() {
  moveCount++;
  const moveCountElement = document.getElementById('moveCount');
  moveCountElement.innerText = moveCount;
  return moveCount;
}




function endGame() {
  const buttonsCheck = document.querySelectorAll(".col");
  let truelist = [];
  buttonsCheck.forEach(function (col) {
    if(col.disabled === true){
      truelist.push(col);
    }
  });
  console.log("liste",truelist.length);
  if (truelist.length >= 15) {
    
    clearInterval(timerInterval); // zamanlayıcıyı durdur
     
    var popUp = document.getElementById("popUp");
    popUp.style.display = "block";
  }
}

function gamedata(playerName, score, moveCount, time) {
  const scoreboard = document.getElementById("scoreboard");
  const row = scoreboard.insertRow(1);

  const nameCell = row.insertCell(0);
  nameCell.innerText = playerName;

  const scoreCell = row.insertCell(1);
  scoreCell.innerText = score.toString();

  const moveCell = row.insertCell(2);
  moveCell.innerText = moveCount.toString();

  const timeCell = row.insertCell(3);
  timeCell.innerText = time.toString();

  // Tabloyu puanına göre sıralama kodu
  const rows = Array.from(scoreboard.rows).slice(1);
  rows.sort((row1, row2) => {
    const score1 = parseInt(row1.cells[1].innerText);
    const score2 = parseInt(row2.cells[1].innerText);
    return score2 - score1;
  });
  scoreboard.tBodies[0].append(...rows);
}












// function compareLists(head1, head2) {
//   let node1 = head1;
//   let node2 = head2;
//   while (node1 != null && node2 != null) {
//     if (node2.placed) { // sadece placed değeri true olanları karşılaştır

//       if (node2.north.value == node1.north.value) {
//         node2.north.placed = true;
//       }
//       if (node2.northeast.value == node1.northeast.value) {
//         node2.northeast.placed = true;
//       }
//       if (node2.east.value == node1.east.value) {
//         node2.east.placed = true;
//       }
//       if (node2.southeast.value == node1.southeast.value) {
//         node2.southeast.placed = true;
//       }
//       if (node2.south.value == node1.south.value) {
//         node2.south.placed = true;
//       }
//       if (node2.southwest.value == node1.southwest.value) {
//         node2.southwest.placed = true;
//       }
//       if (node2.west.value == node1.west.value) {
//         node2.west.placed = true;
//       }
//       if (node2.northwest.value == node1.northwest.value) {
//         node2.northwest.placed = true;
//       }

//     }
//     node1 = node1.next;
//     node2 = node2.next;
//   }
//   return true;
// }
