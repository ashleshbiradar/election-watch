function show(el) {
  el.style.display = 'block';
  el.setAttribute('aria-hidden', false);
}

function hide(el) {
  el.style.display = 'none';
  el.setAttribute('aria-hidden', true);
}

function hideUnchecked() {
  /* Uncheck the "all" box if one of the filter boxes is unchecked */
  var allBoxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  var checkedBoxes = document.querySelectorAll('input[type="checkbox"][name="filter"]:checked');
  if (checkedBoxes.length < allBoxes.length) {
    document.querySelector('input[type="checkbox"]#all').checked = false;
  } else {
    document.querySelector('input[type="checkbox"]#all').checked = true;
  }

  var activeFilters = [];
  checkedBoxes.forEach(function (filter) {
    activeFilters.push(filter.id);
  });

  var entries = document.getElementsByClassName('timeline-entry');
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var categories = [];
    try {
      categories = entry.dataset.category.split(',').filter((category) => category.length > 0);
    } catch {
      // Pass
    }
    if (categories.length && !isItemInCategories(categories, activeFilters)) {
      hide(entry);
    } else {
      show(entry);
    }
  }

  reflowEntries();
}

function checkAll() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  checkboxes.forEach(function (box) {
    box.checked = true;
  });
  var entries = document.getElementsByClassName('timeline-entry');
  for (var i = 0; i < entries.length; i++) {
    show(entries[i]);
  }
  reflowEntries();
}



function isItemInCategories(categories, visibleCategories) {
  return visibleCategories.some(function (id) {
    return categories.indexOf(id) >= 0;
  });
}

function reflowEntries() {
  // Define word mappings with correct case versions
  const wordMappings = {
    surveillance: 'ECI',
    disinformation: 'Disinformation',
    data_privacy: 'Data Privacy',
    aadhaar: 'Aadhaar',
    censorship: 'Censorship',
    ai: "AI",
    MeitY: 'MeitY',
    'Political Party': 'Political Party',
    "platforms": "Platforms",
    "surveillance":"Surveillance",
    eci: "ECI"
  };
  // Function to correct the case of specified words in text content
  function correctWordCase(element) {
    // Traverse through all child nodes of the element
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        let content = node.textContent;
        // Loop through each word mapping and replace
        Object.keys(wordMappings).forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi'); // \b ensures whole word match
          content = content.replace(regex, wordMappings[word]);
        });
        // Update the text content of the node
        node.textContent = content;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively process child nodes
        correctWordCase(node);
      }
    });
  }

  // Reflow timeline entries
  var entries = document.querySelectorAll('.timeline-entry[aria-hidden="false"]');
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    entry.classList.remove('odd', 'even', 'first');
    if (i === 0) {
      entry.classList.add('first');
    }
    if (i % 2 === 0) {
      entry.classList.add('even');
    } else {
      entry.classList.add('odd');
    }

    // Apply word corrections within the entry
    const descriptionElement = entry.querySelector('.timeline-description');
    const categoryElement = entry.querySelector('.category-text');

    if (descriptionElement) {
      correctWordCase(descriptionElement);
    }

    if (categoryElement) {
      correctWordCase(categoryElement);
    }
  }
}


function onload() {
  /* We have JS! */
  var root = document.documentElement;
  root.classList.remove('no-js');

  /* Listen for filter changes */
  document.querySelectorAll('input[type="checkbox"][name="filter"]').forEach(function (box) {
    box.addEventListener('click', hideUnchecked);
  });
  document.querySelector('input[type="checkbox"]#all').addEventListener('click', checkAll);

  /* Flow entries */
  reflowEntries();

  // Clean up
  document.removeEventListener('DOMContentLoaded', onload);
}

if (document.readyState != 'loading') {
  onload();
} else {
  document.addEventListener('DOMContentLoaded', onload);
}

function clearLeftFilters() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  checkboxes.forEach(function (box) {
    if (content.filters.filtersLeft.includes(box.id)) {
      box.checked = false;
    }
  });
  hideUnchecked(); // Trigger filter update after clearing
}

function clearRightFilters() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  checkboxes.forEach(function (box) {
    if (content.filters.filtersRight.includes(box.id)) {
      box.checked = false;
    }
  });
  hideUnchecked(); // Trigger filter update after clearing
}
function deselectAllFilters() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  checkboxes.forEach(function (box) {
    box.checked = false;
  });
  hideUnchecked(); // Trigger filter update after deselecting all
}

// Event listener for Deselect All button
document.getElementById('deselectAllFilters').addEventListener('click', deselectAllFilters);

// // Event listeners for Clear Filters buttons
// document.getElementById('clearLeftFilters').addEventListener('click', clearLeftFilters);
// document.getElementById('clearRightFilters').addEventListener('click', clearRightFilters);
