var gameConfig = {};

gameConfig.cities = [{
    name: 'Reykjavik',
    initialDiseaseColouring: "blue"
}, {
    name: 'Paris',
    initialDiseaseColouring: "blue"
}, {
    name: "St. John's",
    initialDiseaseColouring: "blue"
}, {
    name: 'Washington D.C.',
    initialDiseaseColouring: "blue"
}, {
    name: 'Lisbon',
    initialDiseaseColouring: "blue"
}, {
    name: 'Oslo',
    initialDiseaseColouring: "blue"
}, {
    name: 'Athens',
    initialDiseaseColouring: "blue"
}, {
    name: 'Kiev',
    initialDiseaseColouring: "blue"
}, {
    name: 'St. Petersburg',
    initialDiseaseColouring: "blue"
}, {
    name: 'Regina',
    initialDiseaseColouring: "blue"
}, {
    name: 'Vancouver',
    initialDiseaseColouring: "blue"
}, {
    name: 'Los Angeles',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Mexico City',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Havana',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Panama',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Antananarivo',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Cape Town',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Belem',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Lima',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Bueno Aires',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Punta Arenas',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Kinshasa',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Mombasa',
    initialDiseaseColouring: "yellow"
}, {
    name: 'Monrovia',
    initialDiseaseColouring: "black"
}, {
    name: 'NouakChott',
    initialDiseaseColouring: "black"
}, {
    name: 'Tripoli',
    initialDiseaseColouring: "black"
}, {
    name: 'Khartoum',
    initialDiseaseColouring: "black"
}, {
    name: 'Medina',
    initialDiseaseColouring: "black"
}, {
    name: 'Dubai',
    initialDiseaseColouring: "black"
}, {
    name: 'Tehran',
    initialDiseaseColouring: "black"
}, {
    name: 'Astana',
    initialDiseaseColouring: "black"
}, {
    name: 'Delhi',
    initialDiseaseColouring: "black"
}, {
    name: 'Chennai',
    initialDiseaseColouring: "black"
}, {
    name: 'Lhasa',
    initialDiseaseColouring: "black"
}, {
    name: 'Urumqi',
    initialDiseaseColouring: "black"
}]

gameConfig.gameDiseases = {
    red: 0,
    yellow: 0,
    blue: 0,
    black: 0
}

gameConfig.gameCures = {
    red: false,
    yellow: false,
    blue: false,
    black: false
}

gameConfig.playerConfig = {
    currentCity: null,
    cards: [],
    playerName: null,
    actionsLeft: 4
}

module.exports = gameConfig;