let shortlisted_items = [];
let shortlisted_btn = false;



function toggleShortlistedlist() {
  console.log('button pressed')

  shortlisted_btn = !shortlisted_btn;
  var shortlistIcon = document.getElementById('shortlistIcon');
  var paths = shortlistIcon.getElementsByTagName('path');
  if (shortlisted_btn) {
    for (var i = 0; i < paths.length; i++) {
      paths[i].style.fill = '#E0A64E';
    }
  } else {
    for (var i = 0; i < paths.length; i++) {
      paths[i].style.fill = '#3A312E';
    }
  }
  fetchData();
}

const buttons = [
  {
    name: 'Details',
    imgsrc: './assets/svg/details.svg',
  },
  {
    name: 'Hide',
    imgsrc: './assets/svg/hide.svg',
  },
  {
    name: 'Shortlist',
    imgsrc: './assets/svg/shortlist.svg',
  },
  {
    name: 'Report',
    imgsrc: './assets/svg/report.svg',
  },
];

fetchData();
function fetchData() {
  fetch('https://empty-cup-backend.vercel.app/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers as needed
    },
  })
    .then((response) => response.json())
    .then((data) => {
      render_data(data.data);
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function getStat(data) {
  return `
    <div class="stat-item">
      <p class="stat-item-head">${data[1]}</p>
      <p>${data[0]}</p>
    </div>
  `;
}

function getContacts(data) {
  return `
    <div class="content-item">
      <ul>${data.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

function getLeftChildren(data) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const imgpath = `./assets/svg/${data.rating >= 1 ? 'star_fill.svg' : data.rating > 0 ? 'half_star.svg' : 'star.svg'}`;
    data.rating -= 1;
    return `<img src="${imgpath}">`;
  }).join('');

  return `
    <div class="left-content">
    <div class="content-item content-head">${data.name}</div>
    <div class="content-item">${stars}</div>
    <p class="content-item content-desc">${data.desc}</p>
    <div class="content-item stats">${data.stats.map(getStat).join('')}</div>
    ${getContacts(data.contact)}
    </div>
  `;
}

function getRightChildren(index) {
  return `
    <div class="right-content action-button">
      ${buttons.map(
        (button) => `
        <button>
          <img src="${
            button.name === 'Shortlist' && shortlisted_items.includes(index)
              ? './assets/svg/shortlisted.svg'
              : button.imgsrc
          }" 
               id="${button.name === 'Shortlist' ? `slist-icon-${index}` : ''}"
               ${button.name === 'Shortlist' ? `onclick="toggleShortlist(${index})"` : ''}>
          <p>${button.name}</p>
        </button>
      `
      ).join('')}
    </div>
  `;
}

function render_data(data) {
    const mainlist_id = document.getElementById('main-list');
    mainlist_id.innerHTML = '';
  
    const items = data.length;
    for (let i = 0; i < items; i++) {
      const newItem = document.createElement('li');
      newItem.classList.add('item');
      
      // Check if shortlisted_btn is true and the item is in shortlisted_items
      if (shortlisted_btn && shortlisted_items.includes(i)) {
        newItem.innerHTML = `
          <div class="content-container">
            ${getLeftChildren(data[i])}
            ${getRightChildren(i)}
          </div>
        `;
        mainlist_id.appendChild(newItem);
      } 
      // If shortlisted_btn is false, render all items
      else if (!shortlisted_btn) {
        newItem.innerHTML = `
          <div class="content-container">
            ${getLeftChildren(data[i])}
            ${getRightChildren(i)}
          </div>
        `;
        mainlist_id.appendChild(newItem);
      }
    }
  }
  

function toggleShortlist(index) {
  toggle_btn(index);
  fetchData();
}

function toggle_btn(index) {
  const slist_icon_id = document.getElementById(`slist-icon-${index}`);
  const indexToDelete = shortlisted_items.indexOf(index);
  if (indexToDelete === -1) {
    slist_icon_id.src = './assets/svg/shortlisted.svg';
    shortlisted_items.push(index);
  } else {
    slist_icon_id.src = './assets/svg/shortlist.svg';
    shortlisted_items.splice(indexToDelete, 1);
  }
}

