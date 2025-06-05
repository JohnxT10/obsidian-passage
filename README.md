# Obsidian Passage 

<img src="assets/images/readme/obsidian-logo.jpeg" alt="Logo" width="200" height="200">

A mysterious, atmospheric maze game for the web.

### **Live Website**
🔗 **Play the Game Here:** [Obsidian Passage](https://johnxt10.github.io/obsidian-passage/)  



---
## **Introduction**

Obsidian Passage is a one-page browser-based maze game with a dark, mysterious theme. Each playthrough generates a unique maze for you to solve before time runs out. Enter your name, explore the passage, and race against the clock—playable on both desktop and mobile, no installation required.

![Obsidian Passage multiview image](readme/wireframes/multiview-wireframe.png)

## 📖 Table of Contents

- [📌 Project Overview](#project-overview)
- [🖥️ UX/UI Design](#uxui-design)
- [🧑‍🚶‍♂️ User Stories](#️user-stories)
- [⚜️ Design choices](#design-choices)
  - [🎨 Colours](#colours)
  - [🔠 Fonts](#fonts)
  - [Structure](#structure)
- [🗺️ Wireframes](#wireframes)
- [🖼️ Imagery](#imagery)
- [✨ Features](#features)
- [🛠️ Built With](#️built-with)
- [✅ Testing](#testing)
- [🌐 Deployment](#deployment)
- [🔮 Future Features](#future-features)
- [🐛 Known Bugs](#known-bugs)
- [📚 Citation](#citation)

---

## **Project Overview**
**Key Objectives:**  

- Create an engaging, interactive maze game that runs entirely in the browser using **HTML, CSS, and JavaScript**. .
- Deliver a seamless experience across devices with a focus on accessibility and modern design.
- Maintain clean, standards-compliant code validated by industry tools such as **W3C Validator**, .
- Make the game easily accessible online through version control and web hosting - deployed using **Github pages**.

---

## **UX/UI Design**

- Dark, atmospheric interface inspired by mysterious passages and ancient ruins.
- Responsive layout for desktop and mobile.
- Intuitive controls and clear feedback for player actions.

---

### User Stories
**As a player, I want to...**  
- Enter my name and see it in-game.
- Navigate the maze using keyboard or touch controls.
- See a timer and my score.
- Try again after winning or losing.
- See button controls for smaller devices.
- Use on-screen buttons for movement on mobile without affecting other page elements.

---

## **Design Choices**

### Colours

A great deal of thought went into selecting each colour for Obsidian Passage. The palette was chosen to create a mysterious, immersive atmosphere while ensuring **accessibility** and **clarity**. Each colour serves a specific purpose, from guiding the player’s focus to providing clear feedback for actions and states.

| Colour Name   | Value                                 | Usage                        |
|---------------|---------------------------------------|------------------------------|
| ⚫️ **Obsidian Black**| `#1a1a1a`                             | Background, modal overlays   |
| ⚪️ **Light Grey**    | `(var--primary-text-color), var(--secondary-text-color)`                             | Text, borders, highlights    |
| 🔴 **Dark Red**      | `#dc143c`                             | Error messages, timer warning|
| 🟢 **Green**         | `#4caf50`                             | Success, completion feedback |
| **Button Gradient** | `var(--bg-color)` | Button backgrounds           |
| 🟢🟣 **Opposite BG**   | `var(--opposite-bg-color)`            | Button active/pressed state  |

*(See `assets/css/styles.css` for the full palette and implementation details.)*

---

### Fonts

This website uses **Cinzel** and EB **Garamond**. These typefaces were chosen to evoke an eerie, ancient atmosphere, enhancing the game’s mysterious and unsettling mood while maintaining readability across all devices.feeling

---

### Structure

The website will follow a **mobile-first** strategy, the main target is to create a visually appealing design for smaller screens. Also making sure that it's responsive on all devices.

---

## **Wireframes**

The wireframes are provided below:

### [Desktop Wireframe](readme/wireframes/desktop.png "Desktop wireframe")

### [Tablet Wireframe](readme/wireframes/tablet.png "Tablet wireframe")

### [Phone Wireframe](readme/wireframes/phone.png "Phone wireframe")

---

## **Imagery**

- Custom favicon and icon set located in `assets/images/favicon/` for a polished, branded experience.
- Themed backgrounds and UI elements designed to immerse players in a mysterious, ancient atmosphere.
- All imagery and visual assets are optimized for both desktop and mobile displays.
- Game sprites (player and goal) were produced using AI Copilot to match the eerie aesthetic of the passage.

---

## Features

### Core Gameplay
- Procedural maze generation for unique playthroughs every time
- Customizable difficulty levels (Easy, Medium, Hard, Extreme)
- Timer and scoreboard to track performance
- Themed victory and failure messages for immersive feedback
- Keyboard and touch controls for cross-device play

### UI & Experience
- Responsive design for seamless play on desktop and mobile
- On-screen arrow controls for mobile users
- Light/Dark mode toggle for accessibility and mood
- Enter your name for a personalized experience
- Themed backgrounds, icons, and custom sprites for atmosphere
- Animated transitions and feedback for player actions

---

## Built With
### 🖥️ **Technology & Languages**  
- HTML, CSS, JavaScript (Vanilla)
- [Google Fonts](https://fonts.google.com/)
- [favicon-converter](https://favicon.io/favicon-converter/) for icons

### Libraries & Frameworks
- Google Fonts (**Cinzel** and **EB Garamond**)

### 🛠️ **Tools Used**  
- **GitHub** – Version control & deployment  
- **VS Code** – Code editor  
- **Chrome DevTools** – Debugging & testing  

---

## Testing
- **HTML Validation** - Used **W3C Validator**.

- **CSS Validation** - Used **Autoprefixers** so that the styles work across different browsers. Then used **Jigsaw Validator**.  

- **JavaScript Debugging** - JShint, Console log & error fixing

- ✅ **Lighthouse Performance Testing** – Checked for **performance**, **speed** and **accessibility**.  

---

## Deployment

- Static site: open `index.html` in your browser
- (Optional: add deployment link if hosted online)

---

## Future Features

- Maze themes/skins
- Sound effects and music
- Leaderboard and persistent scores
- Accessibility improvements

---

## Known Bugs

- (List any known issues here)

---

## Citation

- Maze generation inspired by [source, if any].
- Fonts by Google Fonts.
- Icons generated via [RealFaviconGenerator](https://realfavicongenerator.net/).

---

*Feel free to expand each section as your project evolves!*


- [Cinzel](https://fonts.google.com/specimen/Cinzel) for headings
- [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) for body text