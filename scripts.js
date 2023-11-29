fetchData();
let shortlisted_items = [];
let hidden_items = [];
let shortlisted_btn = false;
let all_data = []
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
    imgsrc_on: './assets/svg/shortlisted.svg',
  },
  {
    name: 'Report',
    imgsrc: './assets/svg/report.svg',
  },
];
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
function render_data(data) {
  const mainlist_id = document.getElementById('main-list');
  mainlist_id.innerHTML = '';

  all_data=data;
  var items = data.length;

  for (let i = 0; i < items; i++) {
    if(hidden_items.includes(i) || (shortlisted_btn && shortlisted_items.includes(i) === false)) continue;
    const newItem = document.createElement('li');
    newItem.classList.add('item');
    var rating = data[i].rating
    const stars = Array.from({ length: 5 }, () => {
      const imgpath = `./assets/svg/${rating >= 1 ? 'star_fill.svg' : rating > 0 ? 'half_star.svg' : 'star.svg'}`;
      rating -= 1;
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
        ${buttons.map(button =>`
          <button>
            <img src="${button.name === 'Shortlist' ? shortlisted_items.includes(i) ? button.imgsrc_on : button.imgsrc : button.imgsrc}"
            id="btn-${button.name+i}"
            onclick="${'handle'+button.name + '(' + i + ')'}">
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

function toggleShortlistedlist() {
  shortlisted_btn = !shortlisted_btn;
  var shortlistIcon = document.getElementById('shortlistIcon');
  if (shortlisted_btn) {
    shortlistIcon.src='./assets/svg/shortlisted_items.svg'
  } else {
    shortlistIcon.src='./assets/svg/shortlist_items.svg'
  }
  render_data(all_data);
}

function handleContacts() {
  hidden_items.length=0;
  fetchData();
}
function handleDetails(index) {
  console.log(`Handling details for item ${index}`);
}

function handleHide(index) {
  // console.log(`Handling hide for item ${index}`);
  console.log('here')
  hidden_items.push(index)
  render_data(all_data);
}

function handleShortlist(index) {
  const slist_icon_id = document.getElementById(`btn-${buttons[2].name+index}`);
  const indexToDelete = shortlisted_items.indexOf(index);
  if (indexToDelete === -1) {
    slist_icon_id.src = './assets/svg/shortlisted.svg';
    shortlisted_items.push(index);
  } else {
    slist_icon_id.src = './assets/svg/shortlist.svg';
    shortlisted_items.splice(indexToDelete, 1);
  }
  if(shortlisted_btn) render_data(all_data);
}

function handleReport(index) {
  console.log(`Handling report for item ${index}`);
}