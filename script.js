const shopPages = {
  ores: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/ores.html' },
  farming: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/farming.html' },
  food: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/food.html' },
  blocks: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/blocks/html' },
  decoration: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/decoration.html' },
  dyes: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/dyes.html' },
  enchanting: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/enchanting.html' },
  miscellaneous: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/miscellaneous.html' },
  mobs: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/mobs.html' },
  music: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/music.html' },
  potions: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/potions.html' },
  redstone: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/redstone.html' },
  spawneggs: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/spawneggs.html' },
  spawners: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/spawners.html' },
  workstations: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/workstations.html' },
  z_everythingelse: { currentPage: 0, tables: [], pageInfo: null, filePath: './data/z_everythingelse.html' }
};

let currentShopId = 'ores';

async function loadShopData(shopId) {
  const shop = shopPages[shopId];
  const container = document.getElementById('shop-content');

  container.innerHTML = '';
  const shopSection = document.createElement('div');
  shopSection.id = `${shopId}-shop-section`;
  shopSection.classList.add('shop-section');

  const title = document.createElement('h2');
  title.textContent = `${shopId.charAt(0).toUpperCase() + shopId.slice(1).replace(/_/g, ' ')}`;
  shopSection.appendChild(title);

  const tablesContainer = document.createElement('div');
  tablesContainer.id = `${shopId}-tables-container`;
  shopSection.appendChild(tablesContainer);

  const paginationControls = document.createElement('div');
  paginationControls.classList.add('pagination-controls');
  paginationControls.innerHTML = `
    <button onclick="prevPage('${shopId}')">← Previous</button>
    <span id="${shopId}-page-info" class="page-info"></span>
    <button onclick="nextPage('${shopId}')">Next →</button>
  `;
  shopSection.appendChild(paginationControls);
  container.appendChild(shopSection);

  try {
    const response = await fetch(shop.filePath);
    const text = await response.text();
    tablesContainer.innerHTML = text;
    shop.tables = Array.from(tablesContainer.querySelectorAll('table'));
    shop.pageInfo = document.getElementById(`${shopId}-page-info`);
    showPage(shopId, shop.currentPage);
  } catch (error) {
    console.error(`Error loading ${shopId} data:`, error);
    tablesContainer.innerHTML = `<p>Error loading data for ${shopId}.</p>`;
  }
}

function showPage(shopId, pageIndex) {
  const shop = shopPages[shopId];
  shop.tables.forEach((table, index) => {
    table.classList.toggle('hidden', index !== pageIndex);
  });

  if (shop.pageInfo) {
    shop.pageInfo.textContent = `Page ${pageIndex + 1} of ${shop.tables.length}`;
  }

  const pagination = document.querySelector(`#${shopId}-shop-section .pagination-controls`);
  if (pagination) {
    pagination.querySelector('button:first-child').disabled = (pageIndex === 0);
    pagination.querySelector('button:last-child').disabled = (pageIndex === shop.tables.length - 1);
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

  document.querySelectorAll('.nav-buttons button').forEach(button => {
    button.classList.toggle('active', button.onclick.toString().includes(shopIdToShow));
  });
}

function filterTable() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const activeTable = shopPages[currentShopId].tables[shopPages[currentShopId].currentPage];

  if (!activeTable) return;

  const rows = activeTable.getElementsByTagName('tr');
  for (let i = 1; i < rows.length; i++) {
    const material = rows[i].getElementsByTagName('td')[0];
    if (material) {
      const text = material.textContent || material.innerText;
      rows[i].style.display = text.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    }
  }
}

function toggleSettings() {
  document.getElementById('settingsPanel').classList.toggle('active');
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function initPdfCategories() {
  const picker = document.getElementById('pdfCategoryPicker');
  if (!picker) return;

  Object.keys(shopPages).forEach(cat => {
    const label = document.createElement('label');
    const display = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ');
    label.innerHTML = `<input type="checkbox" value="${cat}" class="pdf-category-checkbox"> ${display}`;
    picker.appendChild(label);
  });
}

async function downloadSelectedPDF() {
  const selected = Array.from(document.querySelectorAll('.pdf-category-checkbox:checked')).map(cb => cb.value);
  if (selected.length === 0) {
    alert("Please select at least one category to download.");
    return;
  }
  await generatePDF(selected, "selected_price_changes.pdf");
}

async function downloadAllPDF() {
  await generatePDF(Object.keys(shopPages), "all_price_changes.pdf");
}

async function generatePDF(categories, filename) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const categoryPageTracker = [];
  let firstCategory = true;

  for (const cat of categories) {
    if (!firstCategory) doc.addPage();

    const startPage = doc.internal.getNumberOfPages();
    const display = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ');

    // Add Category Title
    doc.setFontSize(18);
    doc.text(`${display} Price Changes`, 14, 22);

    try {
      const resp = await fetch(shopPages[cat].filePath);
      const htmlText = await resp.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlText, 'text/html');
      const table = htmlDoc.querySelector('table');

      if (table) {
        doc.autoTable({
          html: table,
          startY: 30,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [56, 189, 248] },
          margin: { bottom: 20 } // Space for footer
        });
      } else {
        doc.text("No data available for this category.", 14, 40);
      }
    } catch (e) {
      console.error(e);
      doc.text("Error loading data.", 14, 40);
    }

    const endPage = doc.internal.getNumberOfPages();
    categoryPageTracker.push({ name: display, start: startPage, end: endPage });
    firstCategory = false;
  }

  // Second Pass: Add Footers with "Page X of Y" for each category
  const totalDocPages = doc.internal.getNumberOfPages();
  categoryPageTracker.forEach(info => {
    const categoryTotalPages = info.end - info.start + 1;
    for (let i = info.start; i <= info.end; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const footerText = `${info.name} Page ${i - info.start + 1} of ${categoryTotalPages}`;
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      // Center the footer text
      const textWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
    }
  });

  doc.save(filename);
}

function togglePdfSection() {
  const section = document.getElementById('pdfExportSection');
  section.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
  initPdfCategories();
  showShop(currentShopId);
});
