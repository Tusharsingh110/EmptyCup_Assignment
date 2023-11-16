
let shortlisted_items = []
let shortlisted_btn = false;

function toggleShortlistedlist() {
    shortlisted_btn = !shortlisted_btn; 
    var shortlistIcon = document.getElementById('shortlistIcon');   
    var paths = shortlistIcon.getElementsByTagName('path')
    if(shortlisted_btn) {
        for (var i = 0; i < paths.length; i++) {
            paths[i].style.fill = '#E0A64E'
        }
    }else {
        for (var i = 0; i < paths.length; i++) {
            paths[i].style.fill = '#3A312E'

        }
    }
    fetchData();
}

const buttons = [
    {
        "name": "Details",
        "imgsrc": "./assets/svg/details.svg"
    },
    {
        "name": "Hide",
        "imgsrc": "./assets/svg/hide.svg"
    },
    {
        "name": "Shortlist",
        "imgsrc": "./assets/svg/shortlist.svg"
    },
    {
        "name": "Report",
        "imgsrc": "./assets/svg/report.svg"
    }
]

fetchData(); 
function fetchData() {
fetch('data.json')
    .then(response => response.json())
    .then(data => {
    render_data(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function getStat(data) {
const statElement = document.createElement("div")
const wrapper =  document.createElement("div")
wrapper.classList.add("stats")
for(let i=0;i<data.length;i++) {
    const item = document.createElement("div")
    item.classList.add("stat-item")
    const itemVal = document.createElement("p") 
    itemVal.classList.add("stat-item-head")
    itemVal.innerHTML = data[i][1]
    const itemTitle = document.createElement("p") 
    itemTitle.innerHTML = data[i][0]
    item.appendChild(itemVal)
    item.appendChild(itemTitle)
    wrapper.appendChild(item);
}
statElement.appendChild(wrapper);
return statElement;
}

function getContacts(data) {
const contacts = document.createElement("div")
contacts.classList.add("content-item")
const contactlist = document.createElement("ul") 
for(let i = 0;i<data.length;i++) {
    const item = document.createElement("li")
    item.innerHTML=data[i]
    contactlist.appendChild(item)
}
contacts.appendChild(contactlist)
return contacts
}

function getLeftChildren(data) {
const firstchild = document.createElement("div")
firstchild.classList.add("content-item")
firstchild.classList.add("content-head")
firstchild.innerHTML = data.name  
const secondchild = document.createElement("div")
secondchild.classList.add("content-item")
let rating = data.rating;
for(let i=1;i<=5;i++) {
    let imgpath = './assets/svg/';
    const newStar = document.createElement('img');
    if(rating >= 1) {
        imgpath += 'star_fill.svg';
    }else if (rating>0 && rating <1){
        imgpath += 'half_star.svg';
    } else {
        imgpath += 'star.svg';
    }
    --rating;
    newStar.src += imgpath;
    secondchild.appendChild(newStar)
}

const thirdchild = document.createElement("p")
thirdchild.classList.add("content-item")
thirdchild.classList.add("content-desc")
thirdchild.innerHTML = data.desc;
const fourthchild = getStat(data.stats)
fourthchild.classList.add("content-item")

const fifthchild = getContacts(data.contact);

const leftchildren = document.createElement("div");
leftchildren.classList.add("left-content")
leftchildren.appendChild(firstchild)
leftchildren.appendChild(secondchild)
leftchildren.appendChild(thirdchild)
leftchildren.appendChild(fourthchild)
leftchildren.appendChild(fifthchild)
return leftchildren;
}


function getRightChildren(index) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("right-content");
    wrapper.classList.add("action-button");

    for (let i = 0; i < buttons.length; i++) {
        const newbutton = document.createElement("button");
        const buttonicon = document.createElement("img");
        buttonicon.src = buttons[i].imgsrc;
        const buttontitle = document.createElement("p");

        if (buttons[i].name === "Shortlist") {
            if (shortlisted_items.includes(index)) {
                buttonicon.src = './assets/svg/shortlisted.svg';
            } else {
                buttonicon.src = buttons[i].imgsrc;
            }
            buttonicon.id = `slist-icon-${index}`;
            newbutton.addEventListener("click", () => toggleShortlist(index));
        }

        buttontitle.innerHTML = buttons[i].name;
        newbutton.appendChild(buttonicon);
        newbutton.appendChild(buttontitle);
        wrapper.append(newbutton);
    }

    return wrapper;
}


function render_data(data) {
    let items = data.length
    const mainlist_id = document.getElementById('main-list')
    mainlist_id.innerHTML = ''; 
    if(shortlisted_btn) {
        for (let i = 0; i < data.length; i++) {
            if (shortlisted_items.includes(i)) {
                const newItem = document.createElement("li");
                newItem.classList.add("item");
                const wrapper = document.createElement("div");
                wrapper.classList.add("content-container");
    
                const leftchildren = getLeftChildren(data[i]);
                const rightchildren = getRightChildren(i);
    
                newItem.appendChild(wrapper);
                wrapper.appendChild(leftchildren);
                wrapper.appendChild(rightchildren);
                mainlist_id.appendChild(newItem);
            }
        }
    } 
    else {
        for(let i=0;i<items;i++) {
    
            const newItem = document.createElement("li")
            newItem.classList.add("item")
            const wrapper = document.createElement("div")
            wrapper.classList.add("content-container")
            
        
            const leftchildren = getLeftChildren(data[i]);
            const rightchildren = getRightChildren(i);
        
            newItem.appendChild(wrapper);
            wrapper.appendChild(leftchildren)
            wrapper.appendChild(rightchildren)
            mainlist_id.appendChild(newItem)
            } 
    }
    
}


function toggleShortlist (index) {
    toggle_btn(index)
    fetchData()

    console.log(shortlisted_items)
}

function toggle_btn(index) {
    const slist_icon_id = document.getElementById(`slist-icon-${index}`)
    const indexToDelete = shortlisted_items.indexOf(index);
    if(indexToDelete === -1) {
        shortlisted_items.push(index)
        slist_icon_id.src = './assets/svg/shortlisted.svg';
    } else {
        shortlisted_items.splice(indexToDelete,1);
        slist_icon_id.src = './assets/svg/shortlist.svg';
    }
}


 
