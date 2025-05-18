// === Blockchain Setup ===
let web3;
let casinoContract;
const contractAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // TODO: Replace with actual
const contractABI = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      casinoContract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Connected:", accounts[0]);
      return accounts[0];
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    }
  } else {
    alert("Please install MetaMask.");
  }
}




// ====== USER & AUTH MANAGEMENT =======
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Save users to localStorage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

// Save current user to localStorage
function saveCurrentUser() {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Register new user
function registerUser(id, name, password, walletAddress) {
  if (!id || !name || !password || !walletAddress) {
    alert('Please fill all fields');
    return;
  }
  if (users.find(u => u.id === id)) {
    alert('User ID already exists');
    return;
  }
  const newUser = {
    id,
    name,
    password,
    walletAddress,
    credits: 1000,
    deposit: 0,
    tier: 'Bronze',
    referrals: [],
    weeklyPayout: 0,
    maxWeeklyPayout: 50000,
    lastPayoutReset: Date.now(),
    totalWins: 0,
    totalBets: 0
  };
  users.push(newUser);
  saveUsers();
  alert('Registration successful! Please login.');
  window.location.href = 'login.html';
}

// Login user
function loginUser(id, password, walletAddress) {
  const user = users.find(u => u.id === id && u.password === password && u.walletAddress === walletAddress);
  if (!user) {
    alert('Invalid credentials!');
    return;
  }
  currentUser = user;
  saveCurrentUser();
  window.location.href = 'games.html';
}

// Check if user is logged in, else redirect to login
function checkAuth() {
  if (!currentUser) {
    window.location.href = 'login.html';
  }
}

// Logout
function logoutUser() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// ====== GAME LOGIC =======

function updateUserData() {
  if (!currentUser) return;
  // update in users list
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx > -1) {
    users[idx] = currentUser;
    saveUsers();
    saveCurrentUser();
  }
}

function displayResult(message) {
  const output = document.getElementById("game-output");
  if (output) output.textContent = message;
}

// Main play game dispatcher
function playGame(gameName) {
  if (!currentUser) {
    alert('Please login!');
    window.location.href = 'login.html';
    return;
  }
  switch(gameName) {
    case 'slots': playSlots(); break;
    case 'roulette': playRoulette(); break;
    case 'blackjack': playBlackjack(); break;
    case 'dice': playDice(); break;
    case 'rps': playRps(); break;
    case 'spinWheel': playSpinWheel(); break;
    case 'poker': playPoker(); break;
    case 'baccarat': playBaccarat(); break;
    case 'craps': playCraps(); break;
    case 'keno': playKeno(); break;
    case 'sicBo': playSicBo(); break;
    case 'videoPoker': playVideoPoker(); break;
    default: alert('Unknown game'); break;
  }
}

// Game functions (all deduct bet & update credits, wins, bets)

function playSlots() {
  const bet = 10;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const symbols = ["🍒", "🍋", "🍊"];
  const spin = Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  const win = spin.every(s => s === spin[0]);
  currentUser.credits += win ? bet * 5 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Slots: ${spin.join(" | ")} - ${win ? "You Win!" : "You Lose."}`);
}

function playRoulette() {
  const bet = 15;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const num = Math.floor(Math.random() * 37);
  const color = num === 0 ? "Green" : num % 2 === 0 ? "Red" : "Black";
  const win = color === "Red";
  currentUser.credits += win ? bet * 2 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Roulette: ${num} (${color}) - ${win ? "Win!" : "Lose!"}`);
}

function playBlackjack() {
  const bet = 20;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const player = Math.floor(Math.random() * 11) + 11;
  const dealer = Math.floor(Math.random() * 11) + 11;
  const win = player <= 21 && (player > dealer || dealer > 21);
  currentUser.credits += win ? bet * 2 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Blackjack: You ${player}, Dealer ${dealer} - ${win ? "Win!" : "Lose!"}`);
}

function playDice() {
  const bet = 10;
  const lucky = 6;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const roll = Math.floor(Math.random() * 6) + 1;
  const win = roll === lucky;
  currentUser.credits += win ? bet * 5 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Dice rolled: ${roll} - ${win ? "You Win!" : "You Lose."}`);
}

function playRps() {
  const bet = 10;
  const userChoice = "Rock";
  const choices = ["Rock", "Paper", "Scissors"];
  const cpu = choices[Math.floor(Math.random() * 3)];
  const win =
    (userChoice === "Rock" && cpu === "Scissors") ||
    (userChoice === "Paper" && cpu === "Rock") ||
    (userChoice === "Scissors" && cpu === "Paper");
  const draw = userChoice === cpu;
  const payout = draw ? 0 : win ? bet : -bet;
  currentUser.credits += payout;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`RPS: You chose ${userChoice}, CPU chose ${cpu} - ${draw ? "Draw!" : win ? "Win!" : "Lose!"}`);
}

function playSpinWheel() {
  const bet = 15;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const outcomes = ["10", "Lose", "50", "Lose", "100", "Jackpot"];
  const result = outcomes[Math.floor(Math.random() * outcomes.length)];
  let gain = 0;
  if (result === "10") gain = 10;
  if (result === "50") gain = 50;
  if (result === "100") gain = 100;
  if (result === "Jackpot") gain = 500;
  currentUser.credits += gain - bet;
  currentUser.totalBets++;
  if (gain > 0) currentUser.totalWins++;
  updateUserData();
  displayResult(`Spin Wheel: ${result} - ${gain > 0 ? "You Win!" : "You Lose."}`);
}

function playPoker() {
  const bet = 25;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const hands = ["High Card", "Pair", "Two Pair", "Three of a Kind", "Flush", "Full House"];
  const hand = hands[Math.floor(Math.random() * hands.length)];
  const multiplier = hands.indexOf(hand) + 1;
  const win = hand !== "High Card";
  const gain = win ? bet * multiplier : 0;
  currentUser.credits += gain - bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Poker Hand: ${hand} - ${win ? `Win ${gain} credits!` : "You Lose."}`);
}

function playBaccarat() {
  const bet = 20;
  const userChoice = "Player";
  const playerScore = Math.floor(Math.random() * 10);
  const bankerScore = Math.floor(Math.random() * 10);
  const winner = playerScore > bankerScore ? "Player" : bankerScore > playerScore ? "Banker" : "Tie";
  const win = userChoice === winner;
  currentUser.credits += win ? bet * 2 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Baccarat: Player ${playerScore}, Banker ${bankerScore} - ${winner} wins - ${win ? "You Win!" : "You Lose."}`);
}

function playCraps() {
  const bet = 15;
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const sum = die1 + die2;
  const win = sum === 7 || sum === 11;
  currentUser.credits += win ? bet * 2 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Craps: Rolled ${die1} + ${die2} = ${sum} - ${win ? "You Win!" : "You Lose."}`);
}

function playKeno() {
  const bet = 10;
  if (currentUser.credits < bet) return alert("Not enough credits!");
  const picks = [5, 12, 23, 37];
  const draws = Array.from({length: 10}, () => Math.floor(Math.random() * 40) + 1);
  const matches = picks.filter(n => draws.includes(n)).length;
  const gain = matches * bet;
  currentUser.credits += gain - bet;
  currentUser.totalBets++;
  if (matches > 0) currentUser.totalWins++;
  updateUserData();
  displayResult(`Keno: Matched ${matches} numbers - ${gain > 0 ? `Win ${gain}!` : "You Lose."}`);
}

function playSicBo() {
  const bet = 15;
  const dice = Array.from({length: 3}, () => Math.floor(Math.random() * 6) + 1);
  const sum = dice.reduce((a,b) => a+b, 0);
  const betType = "Big"; // Big (11-17) or Small (4-10)
  const win = (betType === "Big" && sum >= 11) || (betType === "Small" && sum <= 10);
  currentUser.credits += win ? bet * 2 : -bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Sic Bo: Dice ${dice.join(", ")} = ${sum} - ${win ? "You Win!" : "You Lose."}`);
}

function playVideoPoker() {
  const bet = 20;
  const hands = ["Jacks or Better", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House"];
  const hand = hands[Math.floor(Math.random() * hands.length)];
  const win = hand !== "Jacks or Better";
  const multiplier = hands.indexOf(hand) + 1;
  const gain = win ? bet * multiplier : 0;
  currentUser.credits += gain - bet;
  currentUser.totalBets++;
  if (win) currentUser.totalWins++;
  updateUserData();
  displayResult(`Video Poker: ${hand} - ${win ? `Win ${gain} credits!` : "You Lose."}`);
}

// ====== WALLET & REFERRAL =======

function loadWalletSummary() {
  if (!currentUser) return;
  const container = document.getElementById('wallet-summary');
  if (!container) return;

  container.innerHTML = `
    <table>
      <tr><th>Name</th><td>${currentUser.name}</td></tr>
      <tr><th>User ID</th><td>${currentUser.id}</td></tr>
      <tr><th>Credits</th><td>${currentUser.credits}</td></tr>
      <tr><th>Deposit</th><td>$${currentUser.deposit}</td></tr>
      <tr><th>Tier</th><td>${currentUser.tier}</td></tr>
      <tr><th>Total Wins</th><td>${currentUser.totalWins}</td></tr>
      <tr><th>Total Bets</th><td>${currentUser.totalBets}</td></tr>
    </table>
  `;
}

function loadReferralTree() {
  if (!currentUser) return;
  const container = document.getElementById('referral-tree');
  if (!container) return;

  if (!currentUser.referrals || currentUser.referrals.length === 0) {
    container.textContent = "No referrals yet.";
    return;
  }

  function renderNode(node) {
    const div = document.createElement('div');
    div.className = 'tree-node';
    div.textContent = node.id;
    if (node.referrals && node.referrals.length > 0) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'tree-children';
      node.referrals.forEach(child => childrenDiv.appendChild(renderNode(child)));
      div.appendChild(childrenDiv);
    }
    return div;
  }

  container.innerHTML = '';
  currentUser.referrals.forEach(r => container.appendChild(renderNode(r)));
}

function addReferral() {
  if (!currentUser) return alert('Login required');
  const newId = `user${Math.random().toString(36).substring(2,7)}`;
  const newReferral = { id: newId, referrals: [] };
  if (!currentUser.referrals) currentUser.referrals = [];
  currentUser.referrals.push(newReferral);
  updateUserData();
  loadReferralTree();
  alert(`Added referral: ${newId}`);
}


async function depositToCasino(amountEth) {
  const user = await connectWallet();
  const amountWei = web3.utils.toWei(amountEth, 'ether');
  await casinoContract.methods.deposit().send({
    from: user,
    value: amountWei
  });
  alert(`Deposited ${amountEth} ETH to casino`);
}


async function withdrawFromCasino(amountEth) {
  const user = await connectWallet();
  const amountWei = web3.utils.toWei(amountEth, 'ether');
  await casinoContract.methods.withdraw(amountWei).send({
    from: user
  });
  alert(`Withdrew ${amountEth} ETH`);
}



async function checkCasinoBalance() {
  const user = await connectWallet();
  const balance = await casinoContract.methods.getBalance(user).call();
  alert("On-chain casino balance: " + web3.utils.fromWei(balance, 'ether') + " ETH");
}


