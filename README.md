# 🕒 Real-Time Clock Partition Simulator

A dynamic web-based simulation of real-time clock (RTC) management and synchronization across OS partitions, built for Linux class (10 marks component).

---

## 🚀 Overview

This project demonstrates **master-slave RTC synchronization** in a multi-partition system.  
- **Linux** acts as the **Master Partition**, reading time from the hardware clock.
- **Windows OS** and **Ubuntu** are **Slave Partitions** whose clocks can drift and become out of sync.
- You can simulate clock drift, observe out-of-sync states, and manually synchronize all partitions—just like using `timedatectl set-local-rtc 1` in Linux.

---

## ✨ Features

- **Live RTC Simulation:** Visualize how clocks drift and sync in real time.
- **Master-Slave Architecture:** Linux (master) always stays in sync; others can drift.
- **Manual & Bulk Sync:** Instantly synchronize all slave partitions with a single click.
- **Visual Feedback:** Out-of-sync states are clearly highlighted.
- **Modern UI:** Responsive, attractive interface using React and Next.js.

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/linux-proj.git
cd linux-proj
```

### 2. Start the RTC Master Server

```bash
cd rtc-sim
npm install
node index.js
```

### 3. Start the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
linux-proj/
├── rtc-sim/         # Node.js backend (master clock)
│   └── index.js
├── frontend/        # Next.js frontend (UI & simulation)
│   └── components/
│       └── PartitionClock.js
│   └── app/
│       └── page.js
└── README.md
```

---

## ⚙️ How It Works

- **Master Clock:** The backend (`rtc-sim/index.js`) broadcasts the current time to all partitions.
- **Partitions:** Each partition (component) simulates its own clock, which may drift.
- **Synchronization:** Slave partitions periodically sync to the master, or can be manually synced via UI buttons.

---

## 📸 Screenshots

<!-- Add screenshots/gifs here to showcase the UI and features -->

---

## 📚 References

- [Linux Kernel RTC Subsystem](https://www.kernel.org/doc/html/latest/driver-api/rtc.html)
- [timedatectl Documentation](https://www.freedesktop.org/software/systemd/man/latest/timedatectl.html)
- [Socket.io](https://socket.io/)
- [Next.js](https://nextjs.org/)

---

## 👨‍💻 Author

- **Harsh V M**
- **Karthik Hegde**

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
