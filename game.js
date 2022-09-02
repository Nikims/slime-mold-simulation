const sensorAngle = Math.PI / 4;
const sensorDistance = 5;
const gridSizelol = 400;
let agentCount = 2500;
const displaySize = Math.round(600 / gridSizelol);
dodraw = false;
grid = [];
diffSpeed = 0.1;
for (let i = 0; i < gridSizelol; i++) {
  grid[i] = [];
  for (let j = 0; j < gridSizelol; j++) {
    grid[i][j] = 0;
  }
}

class agent {
  x = 0;
  y = 0;
  angle = Math.random() * 3.14 * 2;
  sensors = [];
  constructor(x, y) {
    for (let i = 0; i < 3; i++) {
      this.sensors[i] = {};
    }
    this.x = x;
    this.y = y;
  }
}
isMousePressed = false;
agents = [];

for (let i = 0; i < agentCount; i++) {
  radius = Math.random() * 100;
  angle = Math.random() * 7.28;

  agents.push(
    new agent(
      Math.cos(angle) * radius + gridSizelol / 2 - 40,
      Math.sin(angle) * radius + gridSizelol / 2 - 40
    )
  );
  // agents[agents.length - 1].angle = Math.atan2(
  //   gridSizelol / 2 - agents[agents.length - 1].y,
  //   gridSizelol / 2 - agents[agents.length - 1].x
  // );
  agents[agents.length - 1].angle =
    Math.atan2(
      gridSizelol / 2 - agents[agents.length - 1].y,
      gridSizelol / 2 - agents[agents.length - 1].x
    ) + Math.PI;
}
function updateAgents() {}

function drawAgents() {
  for (let i = 0; i < agentCount; i++) {
    if (agents[i].x > gridSizelol * displaySize - 20) {
      agents[i].x = 20;
    }
    if (agents[i].x < 0) {
      agents[i].x = gridSizelol * displaySize - 20;
    }
    if (agents[i].y > gridSizelol * displaySize - 20) {
      agents[i].y = 0 + 20;
    }
    if (agents[i].y < 0) {
      agents[i].y = gridSizelol * displaySize - 20;
    }

    if (
      agents[i].x < grid.length - 1 &&
      agents[i].x > 1 &&
      agents[i].y < grid[0].length - 1 &&
      agents[i].y > 1
    ) {
      if (grid[Math.round(agents[i].x)][Math.round(agents[i].y)] < 50) {
        grid[Math.round(agents[i].x)][Math.round(agents[i].y)] = 1;
      }
    }
    let runssofar = 0;
    for (let j = -Math.PI / 4; j <= sensorAngle; j += sensorAngle) {
      agents[i].sensors[runssofar].x =
        agents[i].x + Math.cos(agents[i].angle + j) * sensorDistance;
      agents[i].sensors[runssofar].y =
        agents[i].y + Math.sin(agents[i].angle + j) * sensorDistance;
      if (dodraw) {
        context.fillStyle = "green";
        context.fillRect(
          agents[i].sensors[runssofar].x * displaySize,
          agents[i].sensors[runssofar].y * displaySize,
          displaySize,
          displaySize
        );
      }
      runssofar++;
    }
    try {
      if (
        grid[Math.round(agents[i].sensors[1].x)][
          Math.round(agents[i].sensors[1].y)
        ] >
          grid[Math.round(agents[i].sensors[0].x)][
            Math.round(agents[i].sensors[0].y)
          ] &&
        grid[Math.round(agents[i].sensors[1].x)][
          Math.round(agents[i].sensors[1].y)
        ] >
          grid[Math.round(agents[i].sensors[2].x)][
            Math.round(agents[i].sensors[2].y)
          ]
      ) {
      } else if (
        grid[Math.round(agents[i].sensors[1].x)][
          Math.round(agents[i].sensors[1].y)
        ] <
          grid[Math.round(agents[i].sensors[0].x)][
            Math.round(agents[i].sensors[0].y)
          ] &&
        grid[Math.round(agents[i].sensors[1].x)][
          Math.round(agents[i].sensors[1].y)
        ] <
          grid[Math.round(agents[i].sensors[2].x)][
            Math.round(agents[i].sensors[2].y)
          ]
      ) {
        agents[i].angle += (Math.round(Math.random() * 2 - 1) * Math.PI) / 4;
      } else if (
        grid[Math.round(agents[i].sensors[2].x)][
          Math.round(agents[i].sensors[2].y)
        ] <
        grid[Math.round(agents[i].sensors[0].x)][
          Math.round(agents[i].sensors[0].y)
        ]
      ) {
        agents[i].angle -= sensorAngle;
      } else {
        agents[i].angle += sensorAngle;
      }
    } catch (e) {}
    agents[i].x += Math.cos(agents[i].angle) * 1;
    agents[i].y += Math.sin(agents[i].angle) * 1;
  }
  for (let i = 0; i < agents.length; i++) {
    if (dodraw) {
      context.fillStyle = "red";
      context.fillRect(
        agents[i].x * displaySize,
        agents[i].y * displaySize,
        displaySize,
        displaySize
      );
    }
  }
}
lmao = context.createImageData(gridSizelol, gridSizelol);
function lerp(n, a, b) {
  return (1 - n) * a + n * b;
}
function boxBlurGrid() {
  for (let i = 2; i < gridSizelol - 2; i++) {
    for (let j = 2; j < gridSizelol - 2; j++) {
      let runssofar = 0;
      let total = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          total += grid[i + k][j + l];
          runssofar++;
        }
      }
      let og = grid[i][j];
      grid[i][j] = total / runssofar;
      grid[i][j] = lerp(diffSpeed, og, grid[i][j]) - 0.05;
    }
  }
}
// setInterval(boxBlurGrid, 10);
//write a function that traverses a binary graph until it finds a value of 1000

function draw() {
  if (isMousePressed) {
    agents.push(new agent(mouseX / displaySize, mouseY / displaySize));
    agentCount++;
  }
  boxBlurGrid();
  context.fillStyle = "black";
  context.fillRect(0, 0, 600, 600);

  for (let i = 0; i < grid.length; i++) {
    context.fillStyle = `hsl(${i}, 100%, 50%)`;

    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] * 255 > 10) {
        context.globalAlpha = grid[i][j];
        // context.fillStyle = `rgb(${grid[i][j] * 255},${grid[i][j] * 255},${
        //   grid[i][j] * 255
        // })`;

        context.fillRect(
          i * displaySize,
          j * displaySize,
          displaySize,
          displaySize
        );
      }
    }
  }
  drawAgents();
}
function mouseup() {
  isMousePressed = false;
}
function mousedown() {
  isMousePressed = true;
}
