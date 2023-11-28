let shortlisted_items = [];
let shortlisted_btn = false;
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
    },
  })
    .then((response) => response.json())
    .then((data) => {
      render_data(data.data);
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function toggleShortlistedlist() {
  shortlisted_btn = !shortlisted_btn;
  var shortlistIcon = document.getElementById('shortlistIcon');
  if (shortlisted_btn) {
    shortlistIcon.src='./assets/svg/shortlisted_items.svg'
  } else {
    shortlistIcon.src='./assets/svg/shortlist_items.svg'
  }
  fetchData();
}

function render_data(data) {
  const mainlist_id = document.getElementById('main-list');
  mainlist_id.innerHTML = '';

  const items = data.length;

  for (let i = 0; i < items; i++) {
    if(shortlisted_btn && shortlisted_items.includes(i) === false) continue;
    const newItem = document.createElement('li');
    newItem.classList.add('item');

    const stars = Array.from({ length: 5 }, (_, j) => {
      const imgpath = `./assets/svg/${data[i].rating >= 1 ? 'star_fill.svg' : data[i].rating > 0 ? 'half_star.svg' : 'star.svg'}`;
      data[i].rating -= 1;
      return `<img src="${imgpath}">`;
    }).join('');

    const statItems = data[i].stats.map(stat => `
      <div class="stat-item">
        <p class="stat-item-head">${stat[1]}</p>
        <p>${stat[0]}</p>
      </div>
    `).join('');

    const contacts = `
      <div class="content-item">
        <ul>${data[i].contact.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    `;

    const rightChildren = `
      <div class="right-content action-button">
        ${buttons.map(button => `
          <button>
            <img src="${
              button.name === 'Shortlist' && shortlisted_items.includes(i)
                ? './assets/svg/shortlisted.svg'
                : button.imgsrc
            }" 
            id="${button.name === 'Shortlist' ? `slist-icon-${i}` : ''}"
            ${button.name === 'Shortlist' ? `onclick="toggleShortlist(${i})"` : ''}>
            <p>${button.name}</p>
          </button>
        `).join('')}
      </div>
    `;

    newItem.innerHTML = `
      <div class="content-container">
        <div class="left-content">
          <div class="content-item content-head">${data[i].name}</div>
          <div class="content-item">${stars}</div>
          <p class="content-item content-desc">${data[i].desc}</p>
          <div class="content-item stats">${statItems}</div>
          ${contacts}
        </div>
        ${rightChildren}
      </div>
    `;
    mainlist_id.appendChild(newItem);
  }
}
function toggleShortlist(index) {
  const slist_icon_id = document.getElementById(`slist-icon-${index}`);
  const indexToDelete = shortlisted_items.indexOf(index);
  if (indexToDelete === -1) {
    slist_icon_id.src = './assets/svg/shortlisted.svg';
    shortlisted_items.push(index);
  } else {
    slist_icon_id.src = './assets/svg/shortlist.svg';
    shortlisted_items.splice(indexToDelete, 1);
  }
  if(shortlisted_btn) fetchData();
}
