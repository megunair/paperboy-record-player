# PAPERBOY Record Player

An interactive web implementation of the PAPERBOY Record Player design, inspired by a Figma prototype.

<img src="preview.svg" alt="PAPERBOY Record Player Preview" width="100%">

## Features

- Interactive record player with spinning animation
- Draggable tonearm that moves into position when playing
- Functional audio controls (play, pause, next, previous)
- Volume control with visual knob rotation
- Equalizer sliders for bass, mid, and treble adjustment
- Responsive design for desktop and mobile devices
- Demo tracks using Creative Commons licensed audio

## How to Use

1. Clone this repository or download the files
2. Open `index.html` in your web browser
3. Click the play button to start the music and animation
4. Use the previous and next buttons to change tracks
5. Adjust the volume by dragging the blue knob
6. Modify the equalizer settings with the level sliders

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- JavaScript (ES6)
- Font Awesome icons
- SVG for the record character icon and favicon

## Testing

This project includes comprehensive unit tests focused on ease of use and user experience. The tests ensure that all interactive components work correctly and provide appropriate feedback to users.

### Running the Tests

1. Install dependencies with `npm install`
2. Run tests with `npm test`
3. For test coverage report, run `npm run test:coverage`

### Test Categories

- Core Playback: Tests for play, pause, next, and previous functionality
- Visual Feedback: Ensures animations and visual state changes work correctly
- Track Management: Tests track changing and cycling behavior
- User Controls: Tests volume knob, equalizer sliders, and other controls
- Accessibility: Ensures keyboard navigation and focus management
- Responsive Design: Tests UI adaptation for different screen sizes
- Error States: Tests graceful handling of errors and edge cases

## Design Credits

This implementation is based on the PAPERBOY Record Player Animation design, featuring a stylish blue and yellow color scheme with a branded vinyl record.

## License

The code in this repository is available under the MIT License. See the LICENSE file for more information.

Demo audio samples sourced from [Freesound.org](https://freesound.org/) under Creative Commons licenses.

## Live Demo

You can view a live demo of this project at: [https://megunair.github.io/paperboy-record-player/](https://megunair.github.io/paperboy-record-player/)

## GitHub Pages Setup

This project uses GitHub Actions to automatically deploy to GitHub Pages. The workflow is defined in `.github/workflows/deploy.yml` and will build and deploy the site whenever changes are pushed to the main branch.

---

Created based on Figma design analysis - PAPERBOY Record Player Animation

![GitHub](https://img.shields.io/github/license/megunair/paperboy-record-player)
![GitHub last commit](https://img.shields.io/github/last-commit/megunair/paperboy-record-player)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
