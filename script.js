const shopPages = {
  ores: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/ores.html'
  },
  farming: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/farming.html'
  },
  food: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/food.html'
  },
  decoration: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/decoration.html'
  },
  dyes: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/dyes.html'
  },
  enchanting: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/enchanting.html'
  },
  miscellaneous: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/miscellaneous.html'
  },
  mobs: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/mobs.html'
  },
  music: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/music.html'
  },
  potions: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/potions.html'
  },
  redstone: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/redstone.html'
  },
  spawneggs: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/spawneggs.html'
  },
  spawners: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/spawners.html'
  },
  workstations: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/workstations.html'
  },
  z_everythingelse: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/z_everythingelse.html'
  }
};

let currentShopId = 'ores'; // Default shop to display

async function loadShopData(shopId) {
  const shop = shopPages[shopId];
  const container = document.getElementById('shop-content');

  // Clear previous content and create a new section for the shop
  container.innerHTML = '';
  const shopSection = document.createElement('div');
  shopSection.id = `${shopId}-shop-section`;
  shopSection.classList.add('shop-section');
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = `${shopId.replace(/_/g, ' ').replace(/bw/g, l => l.toUpperCase())}.yml Price Changes`;
  shopSection.appendChild(title);

  // Add pagination controls
  const paginationControls = document.createElement('div');
  paginationControls.classList.add('pagination-controls');
  paginationControls.innerHTML = `
    <button onclick="prevPage('${shopId}')">Previous</button>
    <span id="${shopId}-page-info" class="page-info"></span>
    <button onclick="nextPage('${shopId}')">Next</button>
  `;
  shopSection.appendChild(paginationControls);

  const tablesContainer = document.createElement('div');
  tablesContainer.id = `${shopId}-tables-container`;
  shopSection.appendChild(tablesContainer);
  container.appendChild(shopSection);

  try {
    const response = await fetch(shop.filePath);
    const text = await response.text();
    tablesContainer.innerHTML = text;

    shop.tables = Array.from(tablesContainer.querySelectorAll('table'));
    shop.pageInfo = document.getElementById(`${shopId}-page-info`);

    // Apply glowing effect based on current setting
    if (localStorage.getItem('glowingEnabled') === 'true') {
      applyGlowingEffect(shopId);
    }
    
    showPage(shopId, shop.currentPage);
  } catch (error) {
    console.error(`Error loading ${shopId} data:`, error);
    tablesContainer.innerHTML = `<p>Error loading data for ${shopId}.</p>`;
  }
}

function showPage(shopId, pageIndex) {
  const shop = shopPages[shopId];
  const tables = shop.tables;
  const pageInfoSpan = shop.pageInfo;

  tables.forEach((table, index) => {
    if (index === pageIndex) {
      table.classList.remove('hidden');
    } else {
      table.classList.add('hidden');
    }
  });

  if (pageInfoSpan) {
    pageInfoSpan.textContent = `Page ${pageIndex + 1} of ${tables.length}`;
  }

  const paginationControls = document.querySelector(`#${shopId}-shop-section .pagination-controls`);
  if (paginationControls) {
    const prevButton = paginationControls.querySelector('button:first-child');
    const nextButton = paginationControls.querySelector('button:last-child');

    if (prevButton) {
      prevButton.disabled = pageIndex === 0;
    }
    if (nextButton) {
      nextButton.disabled = pageIndex === tables.length - 1;
    }
  }
}

function nextPage(shopId) {
  const shop = shopPages[shopId];
  if (shop.currentPage < shop.tables.length - 1) {
    shop.currentPage++;
    showPage(shopId, shop.currentPage);
  }
}

function prevPage(shopId) {
  const shop = shopPages[shopId];
  if (shop.currentPage > 0) {
    shop.currentPage--;
    showPage(shopId, shop.currentPage);
  }
}

async function showShop(shopIdToShow) {
  currentShopId = shopIdToShow;
  await loadShopData(shopIdToShow);

  // Update active button styling
  const navButtons = document.querySelectorAll('.nav-buttons button');
  navButtons.forEach(button => {
    if (button.onclick.toString().includes(shopIdToShow)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  settingsPanel.classList.toggle('active');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  document.getElementById('themeToggleButton').textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}

function applyGlowingEffect(shopId) {
    const shop = shopPages[shopId];
    if (shop && shop.tables) {
        shop.tables.forEach(table => {
            table.classList.add('glowing-effect');
        });
    }
}

function removeGlowingEffect(shopId) {
    const shop = shopPages[shopId];
    if (shop && shop.tables) {
        shop.tables.forEach(table => {
            table.classList.remove('glowing-effect');
        });
    }
}

function toggleGlowing() {
  const isGlowingEnabled = localStorage.getItem('glowingEnabled') === 'true';
  const newGlowingState = !isGlowingEnabled;
  localStorage.setItem('glowingEnabled', newGlowingState);

  const glowingToggleButton = document.getElementById('glowingToggleButton');
  glowingToggleButton.textContent = newGlowingState ? 'Disable Glowing Effects' : 'Enable Glowing Effects';

  const currentShopTables = shopPages[currentShopId].tables;
  currentShopTables.forEach(table => {
    if (newGlowingState) {
        table.classList.add('glowing-effect');
    } else {
        table.classList.remove('glowing-effect');
    }
  });
}

function updateGlowingColor(value) {
    document.documentElement.style.setProperty('--glowing-color', value);
    localStorage.setItem('glowingColor', value);
}

function updateGlowingBrightness(value) {
    document.documentElement.style.setProperty('--glowing-brightness', value);
    localStorage.setItem('glowingBrightness', value);
}

function updateGlowingIntensity(value) {
    const currentShopTables = shopPages[currentShopId].tables;
    currentShopTables.forEach(table => {
        table.setAttribute('data-intensity', value);
    });
    localStorage.setItem('glowingIntensity', value);
}

function updateBoxColor(value) {
    document.documentElement.style.setProperty('--section-bg', value);
    document.documentElement.style.setProperty('--table-bg', value);
    localStorage.setItem('boxColor', value);
}

function updateBgColor(value) {
    document.documentElement.style.setProperty('--bg-color', value);
    localStorage.setItem('bgColor', value);
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggleButton').textContent = 'Toggle Light Mode';
  } else {
    document.getElementById('themeToggleButton').textContent = 'Toggle Dark Mode';
  }

  // Load glowing effect preferences
  const glowingEnabled = localStorage.getItem('glowingEnabled') !== 'false';
  document.getElementById('glowingToggleButton').textContent = glowingEnabled ? 'Disable Glowing Effects' : 'Enable Glowing Effects';
  
  const glowingColor = localStorage.getItem('glowingColor') || '#00FFFF';
  updateGlowingColor(glowingColor);
  document.getElementById('glowingColorPicker').value = glowingColor;

  const glowingBrightness = localStorage.getItem('glowingBrightness') || '0.7';
  updateGlowingBrightness(glowingBrightness);
  document.getElementById('glowingBrightnessSlider').value = glowingBrightness;

  const glowingIntensity = localStorage.getItem('glowingIntensity') || '5';
  updateGlowingIntensity(glowingIntensity);
  document.getElementById('glowingIntensitySlider').value = glowingIntensity;

  // Load box and background color preferences
  const boxColor = localStorage.getItem('boxColor') || '#FFFFFF';
  updateBoxColor(boxColor);
  document.getElementById('boxColorPicker').value = boxColor;

  const bgColor = localStorage.getItem('bgColor') || '#E8EAF6';
  updateBgColor(bgColor);
  document.getElementById('bgColorPicker').value = bgColor;

  // Show the default shop on load
  showShop(currentShopId);
});

async function triggerUpdate() {
  const workerUrl = 'https://economychange.mk2899833.workers.dev/update'; // Your Cloudflare Worker URL
  alert('Initiating price update... This may take a moment.');

  fetch(workerUrl)
    .then(response => {
      // Check if the response is successful (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Check the Content-Type of the response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // If it's JSON, parse it as JSON
        return response.json();
      } else {
        // Otherwise, assume it's plain text and read it as text
        return response.text();
      }
    })
    .then(data => {
      // Now handle the data based on its type
      if (typeof data === 'string') {
        console.log('Received a plain text response:', data);
        // Display the text message to the user
        alert(data);
      } else {
        console.log('Received a JSON object:', data);
        // Handle the JSON data (e.g., list mismatches)
        let message = 'Price update completed!\n\nResults:\n';
        data.results.forEach(res => message += `- ${res}\n`);
        if (data.errors.length > 0) {
          message += '\nErrors:\n';
          data.errors.forEach(err => message += `- ${err}\n`);
        }
        alert(message);
      }
    })
    .catch(error => {
      console.error('Failed to connect to update service:', error);
      alert(`Failed to connect to update service: ${error.message}`);
    });
}

async function comparePrices() {
  const workerUrl = 'https://economychange.mk2899833.workers.dev/compare'; // Your Cloudflare Worker URL with compare action
  alert('Comparing prices... This may take a moment.');

  // Clear previous highlights
  clearMismatchHighlights();

  fetch(workerUrl)
    .then(response => {
      // Check if the response is successful (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Check the Content-Type of the response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // If it's JSON, parse it as JSON
        return response.json();
      }
      // Otherwise, assume it's plain text and read it as text
      return response.text();
    })
    .then(data => {
      // Now handle the data based on its type
      if (typeof data === 'string') {
        console.log('Received a plain text response:', data);
        // Display the text message to the user
        alert(data);
      } else {
        console.log('Received a JSON object:', data);
        // Handle the JSON data (e.g., list mismatches)
        if (data.mismatches.length > 0) {
          let message = 'Mismatches found!\n\n';
          data.mismatches.forEach(mismatch => {
            message += `Category: ${mismatch.category}, Material: ${mismatch.material}\n`;
            if (mismatch.htmlBuyPrice !== mismatch.yamlBuyPrice) {
              message += `  Buy Price: HTML=${mismatch.htmlBuyPrice}, YAML=${mismatch.yamlBuyPrice}\n`;
            }
            if (mismatch.htmlSellPrice !== mismatch.yamlSellPrice) {
              message += `  Sell Price: HTML=${mismatch.htmlSellPrice}, YAML=${mismatch.yamlSellPrice}\n`;
            }
            // Highlight the corresponding row in the currently displayed table
            highlightMismatch(mismatch.material);
          });
          alert(message);
        } else {
          alert('No mismatches found. Prices are in sync!');
        }

        if (data.errors.length > 0) {
          let errorMessage = 'Errors during comparison:\n';
          data.errors.forEach(err => errorMessage += `- ${err}\n`);
          alert(errorMessage);
        }
      }
    })
    .catch(error => {
      console.error('Failed to connect to comparison service:', error);
      alert(`Failed to connect to comparison service: ${error.message}`);
    });
}

function highlightMismatch(material) {
  const currentTable = shopPages[currentShopId].tables[shopPages[currentShopId].currentPage];
  if (currentTable) {
    const rows = currentTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const materialCell = row.querySelector('td:first-child');
      if (materialCell && materialCell.textContent.trim() === material) {
        row.classList.add('mismatch-highlight');
      }
    });
  }
}

function clearMismatchHighlights() {
  const allTables = document.querySelectorAll('table');
  allTables.forEach(table => {
    const highlightedRows = table.querySelectorAll('tr.mismatch-highlight');
    highlightedRows.forEach(row => {
      row.classList.remove('mismatch-highlight');
    });
  });
}
