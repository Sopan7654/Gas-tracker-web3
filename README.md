# ⚡ Web3 Gas Tracker

A professional-grade **cross-chain blockchain gas analytics platform** built for **real-time monitoring**, **live simulations**, and **intelligent predictions**. This application provides users with deep insights into gas fees across **Ethereum (Layer 1)**, **Polygon (Layer 2)**, and **Arbitrum (Layer 2)** using a modern Web3 tech stack.


## 🧠 Overview

**Web3 Gas Tracker** is a full-stack web application that:
- Fetches real-time gas prices from Ethereum, Polygon, and Arbitrum.
- Displays the gas breakdown into base fee and priority fee.
- Calculates and compares total cost of a transaction on each network.
- Allows users to simulate wallet-based ETH transactions.
- Tracks pricing trends over time with candlestick OHLC charts.
- Updates gas prices every 6 seconds using WebSocket technology.

---

## 🚀 Key Features

### 🔴 Live Gas Metrics
- Displays **real-time gwei rates** across supported chains.
- Shows **USD cost per transaction** using live ETH prices.
- Breaks down **base fee** and **priority fee**.

### 📈 Price Analytics & Trends
- 15-minute **OHLC candlestick charts** for gas trends.
- Real-time updates and direction indicators (Price Up/Down).
- Built-in TradingView-like design system.

### 🧮 Smart Transaction Simulator
- Enter custom ETH transaction amount.
- View estimated **gas cost**, **transaction value**, and **total cost** per network.
- Includes **live/simulation mode toggle**.

### ⚙️ Real-Time Infrastructure
- Native **RPC** for each chain to ensure accuracy.
- **WebSocket streaming** with 6-second refresh intervals.
- Live **ETH to USD** conversion using **CoinGecko API**.
- Simulated wallet interface with dynamic gas estimation.

---

## 🧩 Tech Stack

| Category         | Technologies Used                              |
|------------------|-------------------------------------------------|
| Frontend         | React.js, Tailwind CSS, ShadCN UI               |
| Backend          | Node.js, Express.js                             |
| Web3 Integration | Ethers.js, JSON-RPC, WebSockets                 |
| APIs             | CoinGecko API, Ethereum/Polygon/Arbitrum RPC    |
| Charting         | Candlestick OHLC charts (custom styled)         |
| Hosting          | Vercel (Frontend), Render/Node server (Backend) |

---


## 📦 Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/web3-gas-tracker.git
cd web3-gas-tracker




