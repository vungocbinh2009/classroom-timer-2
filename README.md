# Classroom Timer 2

A cross-platform desktop application built with **Electron**, **React**, and **Material-UI** that allows you to manage multiple customizable countdown timers in a frameless window. The app is designed with a Swinburne-inspired color theme and supports features like draggable window areas, pinning, and customizable descriptions.

## ✨ Features

- **Multiple Timers**: Add, delete, and manage multiple independent countdown timers.
- **Custom Time Control**: Set countdown duration and start/pause timers using an intuitive interface.
- **Description Editor**: Add or update text descriptions for each timer.
- **Pin to Top**: Keep the window always on top for easy monitoring while working in other apps.
- **Corner Positioning**: Move the app window to any screen corner with a single click.
- **Responsive Window Bar**: Automatically hides excess controls when the window width is small, accessible via a “More” button.
- **Frameless Design**: Sleek, custom-styled window bar with drag support.
- **Cross-Platform Build**: Build for **Windows**, **Linux** (AppImage, DEB, Snap), and **macOS** from a single codebase.

## 🛠️ Technology Stack

- **[Electron](https://www.electronjs.org/)** – Cross-platform desktop app framework.
- **[React](https://react.dev/)** – Front-end UI library.
- **[Material-UI (MUI)](https://mui.com/)** – Modern UI components and styling.
- **[TypeScript](https://www.typescriptlang.org/)** – Strong typing for better maintainability.
- **[easyTimer.js](https://albert-gonzalez.github.io/easytimer.js/)** – Simple and lightweight timer management.
- **SCSS** – Custom styling with variables and nesting.
- **FontAwesome** – Icon set for buttons and features.

## 📦 Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vungocbinh2009/classroom-timer-2
   cd classroom-timer-2
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the app in development mode**:

   ```bash
   npm run dev
   ```

4. **Build the app for your platform**:

   ```bash
   npm run build
   ```

## 🖥️ Building for Multiple Platforms

This app uses **electron-builder** to create binaries:

* **Windows (x64)**: `.exe` installer
* **Linux (x64)**: `.AppImage`, `.deb`, and `.snap`
* **macOS (x64)**: `.dmg` installer

Build configuration is stored in `electron-builder.json`.

## 🎨 Theme

The app’s design is inspired by the Swinburne University logo colors:

* **Primary Red**: `#e60028`
* **Secondary Black**: `#000000`
* **Light Gray Background**: `#f5f5f5`
* **Accent White**: `#ffffff`

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 📌 About

This project was created to provide a clean, customizable, and visually appealing way to manage multiple timers in a lightweight desktop app, suitable for teaching, studying, or productivity purposes.
