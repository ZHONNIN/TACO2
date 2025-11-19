// ==================== CUSTOMER DATA ====================
const CUSTOMERS = [
  {
    id: 0,
    name: 'Overworked Office Worker',
    emoji: '💼',
    useImage: true,
    imageSrc: 'WorkerNormal.png',
    imageClass: 'portrait-image',
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
    useImage: true,
    imageSrc: 'WomenNormal.png',
    imageClass: 'portrait-image-woman',
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
    useImage: true,
    imageSrc: 'StudentNormal.png',
    imageClass: 'portrait-image-student',
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
    name: 'Flavor & Presentation',
    type: 'flavorPresentation',
    flavorChoices: [
      { label: 'Traditional taco (soft beef & onion)', key: 'traditional', tone: 'ingr-traditional', category: 'flavor' },
      { label: 'Spicy taco (extra chili)', key: 'spicy', tone: 'ingr-spicy', category: 'flavor' },
      { label: 'Experimental taco (fusion with pineapple)', key: 'experimental', tone: 'ingr-experimental', category: 'flavor' }
    ],
    plateChoices: [
      { label: 'Handmade plate', key: 'handmade', tone: 'pres-handmade', category: 'plate' },
      { label: 'Paper wrap', key: 'paper', tone: 'pres-paper', category: 'plate' },
      { label: 'Bright colored garnish', key: 'garnish', tone: 'pres-garnish', category: 'plate' }
    ]
  }
];

// ==================== GAME STATE ====================
let gameState = {
  scene: 'intro',
  customerIndex: 0,
  roundIndex: 0,
  choicesLog: [],
  isTyping: false,
  selectedFlavor: null,
  selectedPlate: null
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

  // Bind choice buttons (Round 1)
  const choiceBtns = document.querySelectorAll('.choice-btn');
  choiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => handleChoice(e.target.dataset.choice));
  });

  // Bind flavor buttons (Round 2)
  const flavorBtns = document.querySelectorAll('.flavor-btn');
  flavorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => handleFlavorSelection(e.target.dataset.flavor));
  });

  // Bind plate buttons (Round 2)
  const plateBtns = document.querySelectorAll('.plate-btn');
  plateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => handlePlateSelection(e.target.dataset.plate));
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
    isTyping: false,
    selectedFlavor: null,
    selectedPlate: null
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

  // Handle emoji or image for customer portrait
  const emojiContainer = document.getElementById('customer-emoji');
  const portraitContainer = emojiContainer.parentElement;

  if (customer.useImage && customer.imageSrc) {
    const imgClass = customer.imageClass || 'portrait-image';
    emojiContainer.innerHTML = `<img src="${customer.imageSrc}" alt="${customer.name}" class="${imgClass}">`;
    portraitContainer.classList.add('has-image');
  } else {
    emojiContainer.textContent = customer.emoji;
    portraitContainer.classList.remove('has-image');
  }

  document.getElementById('customer-name').textContent = customer.name;

  // Update round info
  document.getElementById('round-num').textContent = gameState.roundIndex + 1;
  document.getElementById('round-name').textContent = round.name;

  // Show dialog, hide choices BEFORE typing starts
  showDialog();
  hideChoices();

  // Hide next button
  document.getElementById('next-btn').classList.add('hidden');

  // Type intro or prompt for next round
  const dialogText = document.getElementById('dialog-text');
  const text = gameState.roundIndex === 0 ? customer.intro : `What will you serve?`;

  gameState.isTyping = true;
  typeText(dialogText, text, 25).then(() => {
    gameState.isTyping = false;
    // After typing finishes, wait a bit, then hide dialog and show choices
    setTimeout(() => {
      hideDialog();
      setTimeout(() => {
        showChoices();
      }, 300);
    }, 500);
  });
}

function showDialog() {
  const dialogBox = document.querySelector('.dialog-box');
  if (dialogBox) {
    dialogBox.classList.remove('hidden');
  }
}

function hideDialog() {
  const dialogBox = document.querySelector('.dialog-box');
  if (dialogBox) {
    dialogBox.classList.add('hidden');
  }
}

function showChoices() {
  const round = ROUNDS[gameState.roundIndex];

  // Reset selections for Round 2
  gameState.selectedFlavor = null;
  gameState.selectedPlate = null;

  if (round.type === 'flavorPresentation') {
    // Show combined flavor & plate choices for Round 2
    showCombinedChoices(round);
  } else {
    // Show single choices for Round 1
    showSingleChoices(round);
  }
}

function showSingleChoices(round) {
  const choicesContainer = document.getElementById('choices-container');
  const combinedContainer = document.getElementById('combined-choices-container');

  choicesContainer.classList.remove('hidden');
  combinedContainer.classList.add('hidden');

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

function showCombinedChoices(round) {
  const choicesContainer = document.getElementById('choices-container');
  const combinedContainer = document.getElementById('combined-choices-container');

  choicesContainer.classList.add('hidden');
  combinedContainer.classList.remove('hidden');

  // Setup flavor buttons
  const flavorBtns = document.querySelectorAll('.flavor-btn');
  flavorBtns.forEach((btn, index) => {
    if (index < round.flavorChoices.length) {
      btn.textContent = round.flavorChoices[index].label;
      btn.classList.remove('hidden', 'selected');
      btn.disabled = false;
    } else {
      btn.classList.add('hidden');
    }
  });

  // Setup plate buttons
  const plateBtns = document.querySelectorAll('.plate-btn');
  plateBtns.forEach((btn, index) => {
    if (index < round.plateChoices.length) {
      btn.textContent = round.plateChoices[index].label;
      btn.classList.remove('hidden', 'selected');
      btn.disabled = false;
    } else {
      btn.classList.add('hidden');
    }
  });
}

function hideChoices() {
  // Hide single choices
  const choiceBtns = document.querySelectorAll('.choice-btn');
  choiceBtns.forEach(btn => {
    btn.classList.add('hidden');
    btn.disabled = true;
  });

  // Hide combined choices
  const combinedContainer = document.getElementById('combined-choices-container');
  if (combinedContainer) {
    combinedContainer.classList.add('hidden');
  }
}

function handleFlavorSelection(flavorIndex) {
  playSelect();

  const round = ROUNDS[gameState.roundIndex];
  const flavor = round.flavorChoices[flavorIndex];

  // Mark this flavor as selected
  gameState.selectedFlavor = flavor;

  // Update UI - highlight selected flavor
  const flavorBtns = document.querySelectorAll('.flavor-btn');
  flavorBtns.forEach((btn, index) => {
    if (index === parseInt(flavorIndex)) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Check if both flavor and plate are selected
  checkCombinedSelection();
}

function handlePlateSelection(plateIndex) {
  playSelect();

  const round = ROUNDS[gameState.roundIndex];
  const plate = round.plateChoices[plateIndex];

  // Mark this plate as selected
  gameState.selectedPlate = plate;

  // Update UI - highlight selected plate
  const plateBtns = document.querySelectorAll('.plate-btn');
  plateBtns.forEach((btn, index) => {
    if (index === parseInt(plateIndex)) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Check if both flavor and plate are selected
  checkCombinedSelection();
}

async function checkCombinedSelection() {
  if (gameState.selectedFlavor && gameState.selectedPlate) {
    // Both selected - proceed with combined reaction
    await handleCombinedChoice();
  }
}

async function handleCombinedChoice() {
  if (gameState.isTyping) return;

  const customer = CUSTOMERS[gameState.customerIndex];
  const round = ROUNDS[gameState.roundIndex];

  // Hide choices immediately
  hideChoices();

  // Get both reactions
  const flavorReaction = customer.reactions.ingredients[gameState.selectedFlavor.key];
  const plateReaction = customer.reactions.presentation[gameState.selectedPlate.key];

  // Combine reactions
  const combinedReaction = `${flavorReaction} ${plateReaction}`;

  // Log the combined choice
  gameState.choicesLog.push({
    customerId: customer.id,
    customerName: customer.name,
    customerEmoji: customer.emoji,
    customerUseImage: customer.useImage,
    customerImageSrc: customer.imageSrc,
    customerImageClass: customer.imageClass,
    roundType: round.type,
    roundName: round.name,
    flavorKey: gameState.selectedFlavor.key,
    flavorLabel: gameState.selectedFlavor.label,
    plateKey: gameState.selectedPlate.key,
    plateLabel: gameState.selectedPlate.label,
    reaction: combinedReaction
  });

  // Check if combination has a taco preview image
  let tacoImageSrc = null;

  if (gameState.selectedFlavor.key === 'traditional') {
    if (gameState.selectedPlate.key === 'handmade') {
      tacoImageSrc = 'Taco1-1.png';
    } else if (gameState.selectedPlate.key === 'paper') {
      tacoImageSrc = 'Taco1-2.png';
    } else if (gameState.selectedPlate.key === 'garnish') {
      tacoImageSrc = 'Taco1-3.png';
    }
  } else if (gameState.selectedFlavor.key === 'spicy') {
    if (gameState.selectedPlate.key === 'handmade') {
      tacoImageSrc = 'Taco2-1.png';
    } else if (gameState.selectedPlate.key === 'paper') {
      tacoImageSrc = 'Taco2-2.png';
    } else if (gameState.selectedPlate.key === 'garnish') {
      tacoImageSrc = 'Taco2-3.png';
    }
  }

  // If we have a taco image to show, display the preview animation
  if (tacoImageSrc) {
    await showTacoPreview(tacoImageSrc);
  }

  // Wait a moment, then show dialog for reaction
  await new Promise(resolve => setTimeout(resolve, 300));
  showDialog();

  // Show combined reaction with typing effect
  const dialogText = document.getElementById('dialog-text');
  gameState.isTyping = true;
  await typeText(dialogText, combinedReaction, 25);
  gameState.isTyping = false;

  // After reaction finishes, wait before showing Next button
  setTimeout(() => {
    document.getElementById('next-btn').classList.remove('hidden');
  }, 600);
}

async function showTacoPreview(imageSrc) {
  const tacoPreview = document.getElementById('taco-preview');
  const tacoImage = tacoPreview.querySelector('img');

  // Set the image source to the appropriate taco image
  tacoImage.src = imageSrc;

  // Remove hidden class and add show class to trigger animation
  tacoPreview.classList.remove('hidden');

  // Small delay to ensure DOM updates before adding show class
  await new Promise(resolve => setTimeout(resolve, 50));
  tacoPreview.classList.add('show');

  // Wait 2 seconds while taco is visible
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Fade out by removing show class
  tacoPreview.classList.remove('show');

  // Wait for fade-out transition to complete
  await new Promise(resolve => setTimeout(resolve, 500));

  // Hide completely
  tacoPreview.classList.add('hidden');
}

async function handleChoice(choiceIndex) {
  if (gameState.isTyping) return;

  playSelect();

  const customer = CUSTOMERS[gameState.customerIndex];
  const round = ROUNDS[gameState.roundIndex];
  const choice = round.choices[choiceIndex];

  // Hide choices immediately
  hideChoices();

  // Apply tone (disabled - background stays constant)
  // setTone(choice.tone);

  // Log the choice
  const reaction = customer.reactions[round.type][choice.key];
  gameState.choicesLog.push({
    customerId: customer.id,
    customerName: customer.name,
    customerEmoji: customer.emoji,
    customerUseImage: customer.useImage,
    customerImageSrc: customer.imageSrc,
    customerImageClass: customer.imageClass,
    roundType: round.type,
    roundName: round.name,
    choiceKey: choice.key,
    choiceLabel: choice.label,
    reaction: reaction
  });

  // Wait a moment, then show dialog for reaction
  await new Promise(resolve => setTimeout(resolve, 300));
  showDialog();

  // Show reaction with typing effect
  const dialogText = document.getElementById('dialog-text');
  gameState.isTyping = true;
  await typeText(dialogText, reaction, 25);
  gameState.isTyping = false;

  // After reaction finishes, wait before showing Next button
  setTimeout(() => {
    document.getElementById('next-btn').classList.remove('hidden');
  }, 600);
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
      // setTone('night-base'); // Disabled - background stays constant
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
  // setTone('night-base'); // Disabled - background stays constant

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
        useImage: log.customerUseImage,
        imageSrc: log.customerImageSrc,
        imageClass: log.customerImageClass,
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
    if (group.useImage && group.imageSrc) {
      header.innerHTML = `<img src="${group.imageSrc}" alt="${group.name}" class="outcome-portrait-image"> ${group.name}`;
    } else {
      header.textContent = `${group.emoji} ${group.name}`;
    }
    customerDiv.appendChild(header);

    group.choices.forEach(choice => {
      // Handle different round types
      if (choice.roundType === 'flavorPresentation') {
        // Combined round - show both flavor and plate
        const choicePara = document.createElement('p');
        choicePara.innerHTML = `<strong>${choice.roundName}:</strong><br>Flavor: ${choice.flavorLabel}<br>Plate: ${choice.plateLabel}`;
        customerDiv.appendChild(choicePara);
      } else {
        // Single choice round
        const choicePara = document.createElement('p');
        choicePara.innerHTML = `<strong>${choice.roundName}:</strong> ${choice.choiceLabel}`;
        customerDiv.appendChild(choicePara);
      }

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
    isTyping: false,
    selectedFlavor: null,
    selectedPlate: null
  };

  switchScene('intro');
  setTone('night-base');

  // Reset audio
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
}
