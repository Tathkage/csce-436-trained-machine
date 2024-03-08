// Classifier Variable
let classifier;
// Model URL
let imageModelURL = './image_model/';

// Video
let video;
let flippedVideo;
// Image
let img;
// To store the classification
let label = "";
// Mode toggle
let useVideo = false; // Start with image mode by default

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 240).parent('media-box'); // Parent the canvas to a specific div

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide().parent('media-box'); // Parent the video to the same div

  // Since we're styling via CSS, you don't need to position elements with p5.js
  const input = createFileInput(handleFile).style('display', 'none');
  let customFileBtn = createButton('Choose File').class('button');
  customFileBtn.mousePressed(() => input.elt.click());

  let toggleBtn = createButton('Toggle Camera').class('button');
  toggleBtn.mousePressed(toggleInputMode);

  selectAll('.button').forEach(btn => btn.parent('button-container'));
}

function draw() {
  background(0);
  
  if (useVideo) {
    flippedVideo = ml5.flipImage(video);
    image(flippedVideo, 0, 0);
    flippedVideo.remove();
  } else if (img) {
    image(img, 0, 0, width, height - 20);
  }

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

function classifyInput() {
  if (useVideo) {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
  } else if (img) {
    classifier.classify(img, gotResult);
  }
}

function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '').hide();
    label = "";
    if (!useVideo) classifyInput();
  } else {
    img = null;
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  if (useVideo || img) classifyInput();
}

function toggleInputMode() {
  useVideo = !useVideo;
  label = "";
  if (useVideo) {
    video.loop();
    if (img) {
      img.remove();
      img = null;
    }
    classifyInput();
  } else {
    video.pause();
  }
}
