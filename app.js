const factParagraph = document.querySelector('[data-fact-paragraph]');
const saveButton = document.querySelector('[data-save-button]');
const nextFactButton = document.querySelector('[data-next-button]');
const savedFactList = document.querySelector('[data-facts-ol]');
const deleteAllFacts = document.querySelector('[data-deleteAll]');
const breedContainer = document.querySelector('[data-breed-div]');
const breedsNav = document.querySelector('[data-breeds-nav]');
const factsNav = document.querySelector('[data-facts-nav]');
const pageButtons = document.querySelectorAll('[data-page-button]');
const factsSection = document.querySelector('.facts-section');
const savedSection = document.querySelector('.saved-facts-section');
const breedsSection = document.querySelector('.breeds-section');



//Show previously saved facts on the DOM
let getFacts;

if (localStorage.getItem('mySavedFacts') !== null) {
    getFacts = JSON.parse(localStorage.getItem('mySavedFacts'));
} else {
    getFacts = [];
}
for (const data of getFacts) {
    updateFact(data)
}

//Request fact from catfact api
const getFact = async () => {
    try {
        const res = await axios.get('https://catfact.ninja/fact');
        const nextFact = res.data.fact;
        return nextFact;
    } catch (e) {
        console.log("There was an error", e)
        return "There was an error :("
    }
}

//Send fact to the dom
const pushFact = async () => {
    const newFact = await getFact();
    factParagraph.innerText = newFact;
}

nextFactButton.addEventListener('click', pushFact);

let savedFacts;

function saveFactToLocalStorage() {
    let currentFact = factParagraph.innerText;
    saveDataLocalStorage(currentFact);
}

//Create new list for the cat fact on the dom
function updateFact(data) {
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const thrashIcon = document.createElement('i');
    thrashIcon.classList = "fa fa-trash"
    let spanIcon = newSpan.appendChild(thrashIcon);
    newLi.innerText = data
    newLi.append(spanIcon)
    savedFactList.append(newLi);
}

//Save the fact to the LocalStorage
function saveDataLocalStorage(newData) {
    updateFact(newData);
    if (localStorage.getItem('mySavedFacts') === null) {
        savedFacts = [];
    } else {
        savedFacts = JSON.parse(localStorage.getItem('mySavedFacts'));
    };

    savedFacts.push(newData);
    stringSavedFact = JSON.stringify(savedFacts);
    localStorage.setItem('mySavedFacts', stringSavedFact);
    alert("You saved a fact")
}

deleteAllFacts.addEventListener('click', () => {
    localStorage.clear();
    getFacts = [];
    savedFactList.innerHTML = "";
    alert("Facts Deleted")
})

saveButton.addEventListener('click', saveFactToLocalStorage);

//Delete facts from the DOM
savedFactList.addEventListener('click', (e) => {
    if (e.target.className === 'fa fa-trash'){
        e.target.parentElement.remove();
        binBtnTxt = e.target.parentElement.innerText
        getFromLS(binBtnTxt);
        alert("Fact Deleted")
    }   
})

//Delete single facts from the LocalStorage array
let retrieveFact;

function getFromLS(value) {
    if (localStorage.getItem('mySavedFacts') === null) {
        retrieveFact = [];
    } else {
        retrieveFact = JSON.parse(localStorage.getItem('mySavedFacts'));
    };

    if (retrieveFact.includes(value) === true) {
        let indexOfFact = retrieveFact.indexOf(value);
        retrieveFact.splice(indexOfFact, 1);
        retrieveFactNew = JSON.stringify(retrieveFact)
        localStorage.setItem('mySavedFacts', retrieveFactNew)
    }
}

//Send request for the breeds
const getTotalBreeds = async (fetchRequest) => {
    try {
        const getWholeBreeds = await axios.get(fetchRequest);
        const breedData = await getWholeBreeds.data;
        return breedData;
    } catch (e) {
        console.log("There has been an error :(", e)
        return "There has been an error :(, Reload the page to correct";
    }
}

//Retrieve the Data from the request
const sendData = async (inff) => {
    const allData = await getTotalBreeds(`https://catfact.ninja/breeds?page=${inff}`);
    const breedsData = allData.data;
    breedsData.forEach((breedsinfo) => {
        catBreedsPush(breedsinfo.breed, breedsinfo.coat, breedsinfo.country, breedsinfo.origin, breedsinfo.pattern);
    })
}

//Push the results of the request to the DOM
function catBreedsPush(breed, coat, country, origin, pattern) {
    const newDiv = document.createElement('div');
    newDiv.className = "breed-container";

    const breedParagraph = document.createElement('p');
    breedParagraph.innerText = `Breed: ${breed}`;

    const coatParagraph = document.createElement('p');
    coatParagraph.innerText = `Coat: ${coat}`;

    const countryParagraph = document.createElement('p');
    countryParagraph.innerText = `Country: ${country}`;

    const originParagraph = document.createElement('p');
    originParagraph.innerText = `Origin: ${origin}`;

    const patternParagraph = document.createElement('p');
    patternParagraph.innerText = `Pattern: ${pattern}`;

    newDiv.append(breedParagraph);
    newDiv.append(coatParagraph);
    newDiv.append(countryParagraph);
    newDiv.append(originParagraph);
    newDiv.append(patternParagraph);

    breedContainer.appendChild(newDiv);
}

//Page Buttons
pageButtons.forEach((buttn) => {
    buttn.addEventListener('click', () => {
        breedContainer.innerHTML = "";
        sendData(buttn.innerText);
    })
})

breedsNav.addEventListener('click', () => {
    if (breedsSection.classList.contains("hide")){
        factsSection.classList.toggle('hide');
        savedSection.classList.toggle('hide');
        breedsSection.classList.toggle('hide');
        sendData(1);
    }
})

factsNav.addEventListener('click', () => {
    if (factsSection.classList.contains("hide")){
        factsSection.classList.toggle('hide');
        savedSection.classList.toggle('hide');
        breedsSection.classList.toggle('hide');
    }
})