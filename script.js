// ==================== CUSTOMER DATA ====================
const CUSTOMERS = [
  {
    id: 0,
    name: 'Overworked Office Worker',
    emoji: '💼',
    intro: "A tired man in a suit walks up to your stand. He says: \"It's been a long day... maybe food will help me breathe again.\"",
    reactions: {
      communication: {
        warm: "Thanks... feels nice to be noticed after a long day.",
        respectful: "I appreciate the quiet. No small talk for once.",
        humor: "Haha, didn't expect to laugh tonight."
      },
      ingredients: {
        traditional: "This is comfort. Like home after overtime.",
        spicy: "Whoa! That actually woke me up.",
        experimental: "Pineapple? That's... surprisingly good."
      },
      presentation: {
        handmade: "You even plated it nicely. That's care.",
        paper: "Perfect. I'll eat this while heading back.",
        garnish: "Didn't expect street food to look this cheerful."
      }
    }
  },
  {
    id: 1,
    name: 'Immigrant Woman',
    emoji: '🧳',
    intro: "A woman carrying a small suitcase stops by. She says: \"Your food smells familiar... but the city feels so new.\"",
    reactions: {
      communication: {
        warm: "You make me feel like I belong here.",
        respectful: "Polite and kind - like a safe harbor.",
        humor: "Haha, maybe laughter sounds the same in every language."
      },
      ingredients: {
        traditional: "This taste... it brings back memories of home.",
        spicy: "Strong and fiery - like starting a new life.",
        experimental: "It's like two places meeting in one bite."
      },
      presentation: {
        handmade: "It feels personal - like something made for me.",
        paper: "I'll take it on my walk - my journey continues.",
        garnish: "So vibrant... like the markets I miss."
      }
    }
  },
  {
    id: 2,
    name: 'Art Student',
    emoji: '🎨',
    intro: "A quiet young artist with paint on her hands appears. She says: \"I'm searching for inspiration... maybe flavor can spark it.\"",
    reactions: {
      communication: {
        warm: "Your energy feels... like a sunrise after an all-nighter.",
        respectful: "I like how you give space. Inspiration needs silence.",
        humor: "Haha, you're playful - that's rare in serious artists."
      },
      ingredients: {
        traditional: "Simple. Honest. Like a clean canvas.",
        spicy: "Bold! That's passion in edible form.",
        experimental: "Fusion... chaos... I love it."
      },
      presentation: {
        handmade: "It's like edible art.",
        paper: "Casual, fleeting - like street sketches.",
        garnish: "Color! You understand aesthetics!"
      }
    }
  }
];

// ==================== ROUND DEFINITIONS ====================
const ROUNDS = [
  {
    name: 'Communication Style',
    type: 'communication',
    choices: [
      { label: 'Warm welcome', key: 'warm', tone: 'comm-warm' },
      { label: 'Respectful distance', key: 'respectful', tone: 'comm-distance' },
      { label: 'Light humor', key: 'humor', tone: 'comm-humor' }
    ]
  },
  {
    name: 'Ingredients',
    type: 'ingredients',
    choices: [
      { label: 'Traditional taco (soft beef & onion)', key: 'traditional', tone: 'ingr-traditional' },
      { label: 'Spicy taco (extra chili)', key: 'spicy', tone: 'ingr-spicy' },
      { label: 'Experimental taco (fusion with pineapple)', key: 'experimental', tone: 'ingr-experimental' }
    ]
  },
  {
    name: 'Presentation',
    type: 'presentation',
    choices: [
      { label: 'Handmade plate', key: 'handmade', tone: 'pres-handmade' },
      { label: 'Paper wrap', key: 'paper', tone: 'pres-paper' },
      { label: 'Bright colored garnish', key: 'garnish', tone: 'pres-garnish' }
    ]
  }
];

// ==================== GAME STATE ====================
let gameState = {
  scene: 'intro',
  customerIndex: 0,
  roundIndex: 0,
  choicesLog: [], // Array of { customerId, customerName, roundType, choiceKey, choiceLabel, reaction }
  isTyping: false
};

// ==================== AUDIO ====================
let ambientAudio = null;
let selectAudio = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Get audio elements
  ambientAudio = document.getElementById('ambient-audio');
  selectAudio = document.getElementById('select-audio');

  // Bind event listeners
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('next-btn').addEventListener('click', handleNext);
  document.getElementById('restart-btn').addEventListener('click', restartGame);

  // Bind choice buttons
  const choiceBtns = document.querySelectorAll('.choice-btn');
  choiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => handleChoice(e.target.dataset.choice));
  });
});

// ==================== SCENE MANAGEMENT ====================
function switchScene(sceneName) {
  // Hide all scenes
  const scenes = document.querySelectorAll('.scene');
  scenes.forEach(scene => {
    scene.classList.remove('active');
  });

  // Show target scene
  setTimeout(() => {
    const targetScene = document.getElementById(sceneName);
    if (targetScene) {
      targetScene.classList.add('active');
    }
  }, 100);
}

// ==================== TONE MANAGEMENT ====================
function setTone(toneName) {
  document.body.setAttribute('data-tone', toneName);
}

// ==================== TYPING EFFECT ====================
function typeText(element, text, speed = 30) {
  return new Promise((resolve) => {
    element.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

// ==================== AUDIO HELPERS ====================
function playAmbient() {
  if (ambientAudio && ambientAudio.src) {
    ambientAudio.play().catch(err => {
      console.log('Ambient audio blocked or unavailable:', err);
    });
  }
}

function playSelect() {
  if (selectAudio && selectAudio.src) {
    selectAudio.currentTime = 0;
    selectAudio.play().catch(err => {
      console.log('Select audio blocked or unavailable:', err);
    });
  }
}

// ==================== GAME FLOW ====================
function startGame() {
  // Start ambient audio
  playAmbient();

  // Initialize state
  gameState = {
    scene: 'customers',
    customerIndex: 0,
    roundIndex: 0,
    choicesLog: [],
    isTyping: false
  };

  // Switch to customers scene
  switchScene('customers');
  setTone('night-base');

  // Load first customer
  setTimeout(() => {
    loadCustomer();
  }, 500);
}

function loadCustomer() {
  const customer = CUSTOMERS[gameState.customerIndex];
  const round = ROUNDS[gameState.roundIndex];

  // Update customer info
  document.getElementById('customer-num').textContent = gameState.customerIndex + 1;
  document.getElementById('customer-emoji').textContent = customer.emoji;
  document.getElementById('customer-name').textContent = customer.name;

  // Update round info
  document.getElementById('round-num').textContent = gameState.roundIndex + 1;
  document.getElementById('round-name').textContent = round.name;

  // Type intro or prompt for next round
  const dialogText = document.getElementById('dialog-text');
  const text = gameState.roundIndex === 0 ? customer.intro : `What will you serve?`;

  gameState.isTyping = true;
  typeText(dialogText, text, 25).then(() => {
    gameState.isTyping = false;
    showChoices();
  });

  // Hide next button
  document.getElementById('next-btn').classList.add('hidden');
}

function showChoices() {
  const round = ROUNDS[gameState.roundIndex];
  const choiceBtns = document.querySelectorAll('.choice-btn');

  choiceBtns.forEach((btn, index) => {
    if (index < round.choices.length) {
      btn.textContent = round.choices[index].label;
      btn.classList.remove('hidden');
      btn.disabled = false;
    } else {
      btn.classList.add('hidden');
    }
  });
}

function hideChoices() {
  const choiceBtns = document.querySelectorAll('.choice-btn');
  choiceBtns.forEach(btn => {
    btn.disabled = true;
  });
}

async function handleChoice(choiceIndex) {
  if (gameState.isTyping) return;

  playSelect();

  const customer = CUSTOMERS[gameState.customerIndex];
  const round = ROUNDS[gameState.roundIndex];
  const choice = round.choices[choiceIndex];

  // Hide choices
  hideChoices();

  // Apply tone
  setTone(choice.tone);

  // Log the choice
  const reaction = customer.reactions[round.type][choice.key];
  gameState.choicesLog.push({
    customerId: customer.id,
    customerName: customer.name,
    customerEmoji: customer.emoji,
    roundType: round.type,
    roundName: round.name,
    choiceKey: choice.key,
    choiceLabel: choice.label,
    reaction: reaction
  });

  // Show reaction
  const dialogText = document.getElementById('dialog-text');
  gameState.isTyping = true;
  await typeText(dialogText, reaction, 25);
  gameState.isTyping = false;

  // Show next button
  document.getElementById('next-btn').classList.remove('hidden');
}

function handleNext() {
  // Move to next round
  gameState.roundIndex++;

  if (gameState.roundIndex < ROUNDS.length) {
    // Continue with next round for same customer
    loadCustomer();
  } else {
    // Move to next customer
    gameState.roundIndex = 0;
    gameState.customerIndex++;

    if (gameState.customerIndex < CUSTOMERS.length) {
      // Load next customer
      setTone('night-base');
      setTimeout(() => {
        loadCustomer();
      }, 400);
    } else {
      // All customers done, show outcome
      showOutcome();
    }
  }
}

function showOutcome() {
  switchScene('outcome');
  setTone('night-base');

  // Build summary
  const summaryContainer = document.getElementById('outcome-summary');
  summaryContainer.innerHTML = '';

  // Group choices by customer
  const customerGroups = {};
  gameState.choicesLog.forEach(log => {
    if (!customerGroups[log.customerId]) {
      customerGroups[log.customerId] = {
        name: log.customerName,
        emoji: log.customerEmoji,
        choices: []
      };
    }
    customerGroups[log.customerId].choices.push(log);
  });

  // Render each customer's summary
  Object.values(customerGroups).forEach(group => {
    const customerDiv = document.createElement('div');
    customerDiv.className = 'outcome-customer';

    const header = document.createElement('h3');
    header.textContent = `${group.emoji} ${group.name}`;
    customerDiv.appendChild(header);

    group.choices.forEach(choice => {
      const choicePara = document.createElement('p');
      choicePara.innerHTML = `<strong>${choice.roundName}:</strong> ${choice.choiceLabel}`;
      customerDiv.appendChild(choicePara);

      const reactionPara = document.createElement('p');
      reactionPara.innerHTML = `<em>"${choice.reaction}"</em>`;
      customerDiv.appendChild(reactionPara);
    });

    summaryContainer.appendChild(customerDiv);
  });
}

function restartGame() {
  gameState = {
    scene: 'intro',
    customerIndex: 0,
    roundIndex: 0,
    choicesLog: [],
    isTyping: false
  };

  switchScene('intro');
  setTone('night-base');

  // Reset audio
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
}
