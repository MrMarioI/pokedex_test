//pokemons = "https://pokeapi.co/api/v2/pokemon?limit=1060";


// const list = document.querySelector(".right-container__screen");

// var get = function (url, success, error) {
//     var xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             success(xhr.responseText);
//         }
//     }
//     xhr.open("GET", url, true);
//     xhr.send()
// }

// var getPosts = function () {
//     get('https://pokeapi.co/api/v2/pokemon?limit=1060', function (response) {
//         var pokemons = JSON.parse(response)
//         console.log(pokemons)
//     }, function (error) {
//         console.log(error)
//     })
// }

// console.log(getPosts());

// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFront = document.querySelector('.poke-front-image');
const pokeBack = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeList = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// console.log(pokeList);
// Constants and variables

const TYPES = ['normal',
    'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
    'fire', 'water', 'grass', 'electric', 'ice', 'psychic', 'dragon', 'dark', 'fairy'
]
let prevUrl = null;
let nextUrl = null;


// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);
const resetScreens = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}

const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const {
            results, previous, next
        } = data;
        prevUrl = previous;
        nextUrl = next;
        for (let i = 0; i < pokeList.length; i++) {
            const pokeListItems = pokeList[i];
            const resultData = results[i];

            if (resultData){
                const {name, url} = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
               pokeListItems.textContent = id + '. ' + capitalize(name); 
            } else {
                pokeListItems.textContent = '';

            }
        }
    });

}

const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res =>
        res.json()
    )
    .then(data => {

        resetScreens();


        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
        if (dataSecondType) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
        } else {
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
        }
        mainScreen.classList.add(dataFirstType['type']['name']);


        pokeName.textContent = capitalize(data['name']);
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];
        pokeFront.src = data['sprites']['front_default'] || '';
        pokeBack.src = data['sprites']['back_default'] || '';
    });
}

const handleLeftButton = () => {
    if (prevUrl){
        fetchPokeList(prevUrl);
    }
}

const handleRightButton = () => {
if (nextUrl) {
    fetchPokeList(nextUrl);
}
}

const handleListItemClick = (e) => {
    if (!e.target)return;
    
    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);


}


    // event listeners

    leftButton.addEventListener('click', handleLeftButton);
    rightButton.addEventListener('click', handleRightButton);

    for (const pokeListItems of pokeList) {
        pokeListItems.addEventListener('click', handleListItemClick)
    }


    // Initialize

    fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')