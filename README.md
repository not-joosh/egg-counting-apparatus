# 🥚 Egg Counting Apparatus

**An automated machine-vision system for counting and classifying white chicken eggs using YOLOv11 and real-time analytics.**

---

## 👥 Authors

**Josh B. Ratificar** • **Mohan Nuelle T. Francis** • **Rodjean E. Gere**

---

## 📋 Overview

The Egg Counting Apparatus is an intelligent system that automates the scanning and classification of egg trays. Using computer vision and machine learning, it detects eggs, estimates their weight, classifies them by size standards, and provides real-time analytics through a modern web dashboard.

This repository contains the **egg counting apparatus kiosk** user interface built with React, showcasing the project's capabilities.

---

## ✨ Key Features

- **Automated Detection** – YOLOv11 model identifies and segments eggs from camera images
- **Size Classification** – Estimates weight from pixel area and classifies by Philippine standard grades (S, M, L, XL, J)
- **Anomaly Detection** – Flags irregular eggs and non-egg objects with precise tray positioning
- **Real-Time Dashboard** – Live analytics, historical data, and tray-by-tray breakdowns
- **QR Code Traceability** – Each tray generates a unique QR code linking to its record

---

## 🛠️ Technology Stack

**Frontend**
- React + Vite
- TailwindCSS
- Redux (state management)
- Firebase (Firestore & Storage)

**System Architecture**
- Hardware: Raspberry Pi + Pi Camera with LED lighting
- ML Model: YOLOv11 (trained via Roboflow)
- Image Processing: OpenCV
- Backend: Flask API (not included in this repo)

---

## 🚀 Demo

This repository hosts the frontend dashboard only, deployed on **Vercel** for demonstration purposes.

> **Note:** The complete system includes hardware integration, backend API, and ML pipeline. For access to the full project or collaboration inquiries, please contact **ratificarjosh@gmail.com**

---

## 📸 How It Works

1. Egg tray is placed in the apparatus (6×5 grid, up to 30 eggs)
2. Camera captures top-down image under controlled lighting
3. YOLOv11 performs detection and segmentation
4. OpenCV processes images and calculates pixel area
5. System converts pixel area to estimated weight
6. Eggs are classified by size using standard weight ranges
7. Anomalies are flagged and mapped to specific tray positions
8. Results are uploaded to Firebase in real-time

---

## 📬 Contact

For more information about the complete system or potential collaboration:

**Email:** ratificarjosh@gmail.com

---

*Developed as an automated solution for egg grading and quality control*