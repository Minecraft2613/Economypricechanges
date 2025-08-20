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
  },
  blocks: {
    currentPage: 0,
    tables: [],
    pageInfo: null,
    filePath: './data/blocks.html'
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
  title.textContent = `${shopId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}.yml Price Changes`;
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

  // --- Update YAMLs Logic ---
  const updateYamlsButton = document.getElementById('updateYamlsButton');
  const updateStatusDiv = document.getElementById('update-status');

  if (updateYamlsButton) {
    updateYamlsButton.addEventListener('click', async () => {
      updateStatusDiv.innerHTML = '<p>Updating YAML files... Please wait.</p>';
      updateYamlsButton.disabled = true; // Disable button during update

      try {
        const response = await fetch('http://localhost:3000/api/update-yamls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok) {
          updateStatusDiv.innerHTML = `<p class="success">${result.message}</p>`;
          // After successful update, re-run comparison to show latest state
          performAutomaticComparison();
        } else {
          updateStatusDiv.innerHTML = `<p class="error">Error: ${result.error || 'Unknown error'}</p>`;
        }
      } catch (error) {
        console.error('Error updating YAMLs:', error);
        updateStatusDiv.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
      } finally {
        updateYamlsButton.disabled = false; // Re-enable button
      }
    });
  }

  // --- Comparison Logic ---

  async function fetchYamlFile(filePath) {
    try {
      // Use the server's API to fetch YAML files
      const response = await fetch(`http://localhost:3000/api/get-yaml?path=${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching YAML file from ${filePath}:`, error);
      return null;
    }
  }

  function displayComparisonResults(resultsHtml) {
    const resultsDiv = document.getElementById('comparison-results');
    resultsDiv.innerHTML = resultsHtml;
  }

  const SHOPWEBAPP_YAML_FILES_RELATIVE_PATHS = [
      '../ShopWebApp/Blocks.yml.old.yml',
      '../ShopWebApp/Ores.yml',
      '../ShopWebApp/Decoration.yml',
      '../ShopWebApp/Dyes.yml',
      '../ShopWebApp/Enchanting.yml',
      '../ShopWebApp/Farming.yml',
      '../ShopWebApp/Food.yml',
      '../ShopWebApp/Miscellaneous.yml',
      '../ShopWebApp/Mobs.yml',
      '../ShopWebApp/Music.yml',
      '../ShopWebApp/Potions.yml',
      '../ShopWebApp/Redstone.yml',
      '../ShopWebApp/SpawnEggs.yml',
      '../ShopWebApp/Workstations.yml',
      '../ShopWebApp/Z_EverythingElse.yml'
  ];

  async function fetchShopWebAppLatestPrices() {
      let allItems = {}; // Use an object for easier lookup by material name
      const fetchPromises = SHOPWEBAPP_YAML_FILES_RELATIVE_PATHS.map(async file => {
          const text = await fetchYamlFile(file);
          if (text) {
              const data = jsyaml.load(text);
              if (data && data.pages) {
                  for (const pageKey in data.pages) {
                      if (data.pages.hasOwnProperty(pageKey)) {
                          const page = data.pages[pageKey];
                          if (page.items) {
                              for (const itemKey in page.items) {
                                  if (page.items.hasOwnProperty(itemKey)) {
                                      const item = page.items[itemKey];
                                      allItems[item.material] = {
                                          buy_price: item.buy || 0,
                                          sell_price: item.sell || 0
                                      };
                                  }
                              }
                          }
                      }
                  }
              }
          }
      });
      await Promise.all(fetchPromises);
      return allItems;
  }

  function compareYamlData(oldYaml, newYaml, latestPricesData) {
    let html = '';
    let allPricesMatch = true;

    // Function to recursively compare objects/arrays
    function recursiveCompare(oldObj, newObj, path = '') {
      let currentHtml = '';
      let sectionMismatch = false;

      for (const key in newObj) {
        const newPath = path ? `${path}.${key}` : key;

        if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
          // Nested object
          const nestedResult = recursiveCompare(oldObj ? oldObj[key] : undefined, newObj[key], newPath);
          if (nestedResult.html) {
            currentHtml += `<div class="yaml-section"><h4>${newPath}:</h4>${nestedResult.html}</div>`;
            if (nestedResult.mismatch) {
              sectionMismatch = true;
            }
          }
        } else if (Array.isArray(newObj[key])) {
          // Array - compare elements
          currentHtml += `<div class="yaml-section"><h4>${newPath}:</h4><ul>`;
          newObj[key].forEach((newItem, index) => {
            const oldItem = oldObj && oldObj[key] ? oldObj[key][index] : undefined;
            if (typeof newItem === 'object' && newItem !== null) {
              const nestedResult = recursiveCompare(oldItem, newItem, `${newPath}[${index}]`);
              if (nestedResult.html) {
                currentHtml += `<li>${nestedResult.html}</li>`;
                if (nestedResult.mismatch) {
                  sectionMismatch = true;
                }
              }
            } else {
              if (oldItem === undefined || newItem !== oldItem) {
                currentHtml += `<li class="mismatch">${newPath}[${index}]: <span class="old-value">${oldItem !== undefined ? oldItem : 'N/A'}</span> -> <span class="new-value">${newItem}</span></li>`;
                sectionMismatch = true;
              } else {
                currentHtml += `<li>${newPath}[${index}]: ${newItem}</li>`;
              }
            }
          });
          currentHtml += `</ul></div>`;
        } else {
          // Primitive value (potential price)
          const oldValue = oldObj ? oldObj[key] : undefined;
          const newValue = newObj[key];

          // Check if it's a price comparison against latestPricesData
          if (newPath.endsWith('.buy') || newPath.endsWith('.sell')) {
              const materialName = newPath.substring(0, newPath.lastIndexOf('.')).split('.').pop();
              const priceType = newPath.endsWith('.buy') ? 'buy_price' : 'sell_price';
              const latestPrice = latestPricesData[materialName] ? latestPricesData[materialName][priceType] : undefined;

              if (latestPrice !== undefined && parseFloat(newValue) !== latestPrice) {
                  currentHtml += `<p class="mismatch"><strong>${key}:</strong> <span class="old-value">${latestPrice} (Latest)</span> -> <span class="new-value">${newValue} (Current)</span></p>`;
                  sectionMismatch = true;
                  allPricesMatch = false;
              } else if (latestPrice === undefined) {
                  currentHtml += `<p class="new-entry"><strong>${key}:</strong> <span class="new-value">${newValue}</span> (No Latest Price Found)</p>`;
                  sectionMismatch = true;
                  allPricesMatch = false;
              } else {
                  currentHtml += `<p><strong>${key}:</strong> ${newValue}</p>`;
              }
          } else if (oldValue === undefined || newValue !== oldValue) {
            // General comparison for non-price values
            if (!isNaN(parseFloat(newValue)) && isFinite(newValue) && !isNaN(parseFloat(oldValue)) && isFinite(oldValue)) {
              currentHtml += `<p class="mismatch"><strong>${key}:</strong> <span class="old-value">${oldValue !== undefined ? oldValue : 'N/A'}</span> -> <span class="new-value">${newValue}</span></p>`;
              sectionMismatch = true;
              allPricesMatch = false;
            } else if (oldValue === undefined) {
              currentHtml += `<p class="new-entry"><strong>${key}:</strong> <span class="new-value">${newValue}</span> (New Entry)</p>`;
              sectionMismatch = true;
              allPricesMatch = false;
            } else {
              currentHtml += `<p class="mismatch"><strong>${key}:</strong> <span class="old-value">${oldValue}</span> -> <span class="new-value">${newValue}</span></p>`;
              sectionMismatch = true;
              allPricesMatch = false;
            }
          } else {
            currentHtml += `<p><strong>${key}:</strong> ${newValue}</p>`;
          }
        }
      }

      // Check for keys removed from newObj (only if oldObj exists)
      if (oldObj) {
        for (const key in oldObj) {
          if (!(key in newObj)) {
            currentHtml += `<p class="removed-entry"><strong>${key}:</strong> <span class="old-value">${oldObj[key]}</span> (Removed)</p>`;
            sectionMismatch = true;
            allPricesMatch = false;
          }
        }
      }

      return { html: currentHtml, mismatch: sectionMismatch };
    }

    const comparisonResult = recursiveCompare(oldYaml, newYaml);

    if (allPricesMatch) {
      html += '<p class="all-match">All prices match! No discrepancies found.</p>';
    } else {
      html += comparisonResult.html;
      html += '<p class="overall-mismatch">Discrepancies found. Please review the highlighted changes.</p>';
    }

    return html;
  }

  async function performAutomaticComparison() {
      displayComparisonResults('<p>Loading latest prices from ShopWebApp and comparing...</p>');

      const latestPricesData = await fetchShopWebAppLatestPrices();
      if (Object.keys(latestPricesData).length === 0) {
          displayComparisonResults('<p class="error">Could not load latest prices from ShopWebApp. Please ensure YAML files are correctly placed and accessible.</p>');
          return;
      }

      let overallResultsHtml = '';

      try {
        // Fetch list of YAML files from the server
        const response = await fetch('http://localhost:3000/api/list-yamls');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const currentYamlFiles = await response.json();

        if (currentYamlFiles.length === 0) {
          overallResultsHtml += '<p>No YAML files found in the 'current' directory to compare.</p>';
        } else {
          for (const currentYamlFile of currentYamlFiles) {
              overallResultsHtml += `<div class="shop-section"><h3>Comparing ${currentYamlFile}</h3>`;
              const currentYamlContent = await fetchYamlFile(`current/${currentYamlFile}`); // Use the API to fetch
              if (!currentYamlContent) {
                  overallResultsHtml += `<p class="error">Could not load ${currentYamlFile}.</p></div>`;
                  continue;
              }

              let currentYamlData;
              try {
                  currentYamlData = jsyaml.load(currentYamlContent);
              } catch (error) {
                  overallResultsHtml += `<p class="error">Error parsing ${currentYamlFile}: ${error.message}</p></div>`;
                  console.error(`Error parsing ${currentYamlFile}:`, error);
                  continue;
              }

              const comparisonHtml = compareYamlData({}, currentYamlData, latestPricesData);
              overallResultsHtml += comparisonHtml + '</div>';
          }
        }
      } catch (error) {
        console.error('Error during automatic comparison:', error);
        overallResultsHtml = `<p class="error">An error occurred during comparison: ${error.message}</p>`;
      } finally {
        displayComparisonResults(overallResultsHtml);
      }
  }

  // Trigger automatic comparison on page load
  performAutomaticComparison();
});
