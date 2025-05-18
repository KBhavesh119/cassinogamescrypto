# cassinogamescrypto
added more functionality such as ethereum


 🎰 Web3 Casino Game Platform

A fun, beginner-friendly, Ethereum-integrated casino web app built with HTML, CSS, JavaScript, and Solidity. Play 12 mini casino games, manage your referral tree, and deposit or withdraw real ETH using MetaMask.

---

 🚀 Features

- ✅ Login & Registration system
- 🎮 12 playable casino games (e.g., Slots, Roulette, Blackjack, Dice, etc.)
- 🌳 Interactive referral tree visualization
- 💼 Wallet summary dashboard
- 💸 Web3 support for ETH deposit/withdraw using MetaMask
- 🎨 Clean dark UI with gold-accented casino theme

---

🧠 Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- Solidity Smart Contract (`Casino.sol`)
- Web3.js for Ethereum wallet interaction
- MetaMask for blockchain access
- LocalStorage for user data (can be replaced with backend)

---

 🛠️ Getting Started

 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2. Open in Browser
You can run the site locally by simply opening login.html in your browser (or use Live Server in VS Code).
🔐 Connect to MetaMask
Install MetaMask if you haven't already.
Switch to the Goerli or Sepolia testnet.
Click Connect Wallet or use the buttons on the wallet page to:
💰 Deposit ETH
⬅️ Withdraw ETH
📊 Check balance
All ETH actions interact with your deployed smart contract

📄 Smart Contract Overview
File: Casino.sol
Written in Solidity (v0.8)
Handles deposits, withdrawals, and balance tracking
Deployed to Ethereum-compatible testnet (e.g., Goerli or Sepolia)
Key Functions:
deposit() — Send ETH to the contract
withdraw(uint) — Withdraw ETH from your balance
getBalance(address) — View your on-chain balance

3.🎮 Available Games
Each game deducts credits and updates wins/losses:

🎰 Slots

🎯 Roulette

🃏 Blackjack

🎲 Dice

✊ Rock Paper Scissors

🎡 Spin Wheel

♠️ Poker

🂡 Baccarat

🎲 Craps

🔢 Keno

🧊 Sic Bo

📺 Video Poker


4.🌳 Referral Page
Displays your referral network as a connected tree

Click on nodes to add child referrals dynamically

Stored locally (can be upgraded to on-chain or backend)

5.📂 Project Structure

/project-root
├── login.html
├── register.html
├── games.html
├── wallet.html
├── referral.html
├── style.css
├── script.js
├── Casino.sol        # Smart contract (optional to include)




===============================================
🎰 Casino Smart Contract - Solidity (v0.8+)
===============================================

This contract allows users to:
- Deposit ETH to their casino balance
- Withdraw ETH from their balance
- Check their balance
- All actions emit relevant events

-----------------------------------------------
📄 How It Works:

1. deposit():
   - Payable function
   - Adds msg.value to sender's balance
   - Emits Deposited event

2. withdraw(amount):
   - Requires sender's balance >= amount
   - Transfers ETH back to sender
   - Emits Withdrawn event

3. getBalance(player):
   - View function
   - Returns balance of any address

-----------------------------------------------
🔐 Security Notes:
- Only users can withdraw their own balance
- Contract doesn't yet restrict owner functions

-----------------------------------------------
🛠️ Example (in JavaScript/Web3):

await contract.methods.deposit().send({ from: user, value: web3.utils.toWei('0.1', 'ether') });
await contract.methods.withdraw(web3.utils.toWei('0.05', 'ether')).send({ from: user });
const balance = await contract.methods.getBalance(user).call();

-----------------------------------------------
📜 License:
MIT — free to use, modify, and build upon.
