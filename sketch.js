let video;
let poseNet;
let poses = [];
let skeletons = [];
let inMeeting = 0;
let handRaised = 0;

function setup() {
  //contains open sources body tracking starting code by dansakamoto
  createCanvas(windowWidth, windowHeight);
  frame = loadImage("Images/Zoom.png");
  logIn = loadSound("Sounds/LogIn.mp3");
  logOut = loadSound("Sounds/LogOut.mp3");
  handRaise = loadSound("Sounds/HandRaise.mp3");
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  background(180, 200, 255);
  image(video, 0, 0, 1000, 700);
  image(frame, 0, 0, 1000, 700);
  drawKeypoints();
}

function drawKeypoints() {
  if (inMeeting == 0 && poses.length > 0) {
    print("HERE");
    //image(hand,10,10,10,10)
    if (!logIn.isPlaying() && !logOut.isPlaying()) {
      logIn.play();
    }
    inMeeting = 1;
  }
  if (inMeeting == 1 && poses.length == 0) {
    print("GONE");
    if (!logOut.isPlaying() && !logIn.isPlaying()) {
      logOut.play();
    }
    inMeeting = 0;
  }
  for (let i = 0; i < poses.length; i++) {
    let rightWrist = poses[i].pose.keypoints[10];
    let rightElbow = poses[i].pose.keypoints[8];
    //ellipse(rightWrist.position.x, rightWrist.position.y, 10, 10);

    if (
      rightWrist.position.y < 300 &&
      rightWrist.score > 0.1 &&
      handRaised == 0
    ) {
      print("RAISE");
      if (!handRaise.isPlaying()) {
        handRaise.play();
      }
      handRaised = 1;
    }

    if (
      (rightWrist.position.y > 500 && rightWrist.score > 0.001) ||
      rightWrist.score < 0.001
    ) {
      handRaised = 0;
    }
    fill(255, 255, 255, 50);
    noStroke();
    print(rightWrist.score);
    print(rightWrist.position.y);
    //ellipse(rightWrist.position.x, rightWrist.position.y, 10, 10);
  }
}
