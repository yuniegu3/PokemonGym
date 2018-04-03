let globalPokedex = {}
let trainer = undefined
let trainer2 = undefined

//pokemon constructor takes a hash full of poke-data
class Pokemon {
  constructor(args) {
    this.name = args.name
    this.image = args.image
    this.pokeNum = args.pokeNum
    this.types = args.types
    this.height = args.height
    this.weight = args.weight
    this.abilities = args.abilities
    this.stats = args.stats
  }
}

//trainer constructor take a name and an array of pokemon objects
class Trainer {
  constructor(name, minions){
    this.name = name
    this.minions = minions || []
  }

  //returns the array of pokemon
  all(){
    return this.minions
  }

  //takes a string (pokemon name) and returns the data about that dude
  get(pokemon){
    let collection = this.minions.filter(function(monster){return monster.name === pokemon})
    return collection.length === 1 ? collection[0] : collection
  }
}

//will be populated with the ajax response data then passed to pokemon constructor
let pokeHash = {
  name: "",
  image: "",
  pokeNum: 0,
  types: [],
  height: 0,
  weight: 0,
  abilities: [],
  stats: []
}

getStats = (response) => {
  //pass each statistic into the setStats function
  response.stats.map(function(statistic){pokeHash.stats.push(setStats(statistic))})
}

//create a key value pair for each stat and it's base value, then push into the stat array contained within the pokeHash
function setStats(statistic) {
  let obj = {}
  let name = statistic.stat.name
  let baseValue = statistic.base_stat
  obj[name] = baseValue
  return obj
}

getAbilities = (response) => {
  //map through the abilities array and create a hash out of each ability - contains its name and if it is hidden
  response.abilities.map(function(power){pokeHash.abilities.push({name: power.ability.name, isHidden: power.is_hidden})})
  
}

//takes a pokemon name or id number and uses that parameter as the tail of the api call
function catchPokemon(pokeNameOrIdNumber){
  //must return the result of the ajax call
  return $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/" + pokeNameOrIdNumber,
    success: function(response){
      //populate the pokeHash with the ajax response
      pokeHash.name = response.name
      pokeHash.image = response.sprites.front_default
      pokeHash.pokeNum = response.id
      pokeHash.types = response.types.map(function(type){return type.type.name})
      pokeHash.height = response.height
      pokeHash.weight = response.weight
      getAbilities(response)
      getStats(response)
      //create a new pokemon
      let pokemon = new Pokemon(pokeHash)
      //clear the array of stats so that it's specific to the pokemon (REFACTOR?)
      pokeHash.stats = []
      pokeHash.abilities = []
      //return the pokemon

      globalPokedex[pokemon.name] = pokemon
      console.log(pokemon)
    },
    error: function(error){
      console.log(error)
    }
  })
}

checkIfAbilityHidden = (ability, list) => {
  if (ability.isHidden) {
    $("<li/>").text(ability.name).addClass("hidden-ability ability").appendTo(list)
  } else {
    $("<li/>").text(ability.name).addClass("ability").appendTo(list)
  }
}

generateAbilities = (pokemon) => {
  let abilitiesList = $("<ul/>").addClass("ability-list")
  pokemon.abilities.forEach((ability) => {checkIfAbilityHidden(ability, abilitiesList)})
  return abilitiesList
}

generateElements = (pokemon) => {
  //add each element to a p tag, with a span to mark its type (for pokemon with > 1 type)
  let elementTag = $("<p/>")
  pokemon.types.forEach((type) => {
    let typeList = $(elementTag).html()
    typeList += `<span class=${type}>` + type + "</span>"
    $(elementTag).html(typeList)
  })
  return elementTag
}

generatePermanentStats = (pokemon, container) => {
  let name = pokemon.name
  //create a container div for permanent stats
  let permanentStats = $("<div/>").addClass(`permanent-stats ${name} hidden`)

  //put perm stats in respective html elements
  let nameEl = $("<h2/>").text(name).addClass("name")
  let idNum = $("<p/>").text("#" + pokemon.pokeNum.toString())
  idNum.addClass("poke-num")

  let elementType = generateElements(pokemon)

  let height = $("<p/>").text((pokemon.height * 10) + "cm.").addClass("height")
  let weight = $("<p/>").text(((pokemon.weight / 10).toFixed(2)) + "kg").addClass("weight")

  //create a list of abilities
  let abilityListTitle = $("<h4/>").text("Abilities")
  let abilitiesList = generateAbilities(pokemon)

  //append each of these elements to the permanent stats div and then perm stats to container
  let pokeInfo = [nameEl,idNum,elementType,height,weight,abilityListTitle,abilitiesList]
  pokeInfo.forEach((e) => {$(e[0]).appendTo(permanentStats)})
  $(permanentStats).appendTo(container)
}

generateImageDiv = (pokemon, container) => {
  //create separate div container for image and append it
  let imageCont = $("<div/>").addClass("pokemon-image-container")
  // image: "",
  let pic = $("<img/>").attr("src", pokemon.image).addClass(name)
  let thumbnail = $("<img/>").attr("src", pokemon.image).addClass(`thumbnail thumb ${name} hidden`)
  $(pic).appendTo(imageCont)
  $(thumbnail).appendTo("#pokeball-container")
  $(imageCont).appendTo(container) 
}

generateHealthStats = (pokemon, container) => {
  let name = pokemon.name
  //create a container div for current stats
  let currentStats = $("<div/>").addClass(`current-stats hidden ${name}`)
  let healthListTitle = $("<h2/>").text(name + "'s Stats")
  $(healthListTitle).appendTo(currentStats)
  let healthList = $("<ul/>").addClass("stat-list")
  pokemon.stats.forEach((stat) => {$("<li/>").html("<span class='stat-type'>" + Object.keys(stat)[0] + ":</span> <span class='stat-value'>" + Object.values(stat)[0] + "</span>").addClass("stat").appendTo(healthList)})
  $(healthList).appendTo(currentStats)
  $(currentStats).appendTo(container)
}

pokeContainer = (pokemon) => {
  let name = pokemon.name
  //create encompassing div for all individual pokemon data
  let pokeDivContainer = $("<div/>").addClass(`single-pokemon-div ${name} hidden`)

  generatePermanentStats(pokemon, pokeDivContainer)

  generateImageDiv(pokemon, pokeDivContainer)

  generateHealthStats(pokemon, pokeDivContainer)

  return pokeDivContainer
}

createContainer = (pokemon, playerNumber) => {
  let newDiv
  if (playerNumber == "1") {
    newDiv = pokeContainer(trainer.get(pokemon))  
  } else {
    newDiv = pokeContainer(trainer2.get(pokemon))
  }
  $(newDiv).appendTo("#window-screen" + playerNumber)
}

$.when($.when(catchPokemon("4"), catchPokemon("26"), catchPokemon("135"), catchPokemon("58"), catchPokemon("133"), catchPokemon("359")).done(function(result){
  //once you have all of your pokemon, you can initialize a new trainer with your pokemon array
  trainer = new Trainer("trainer", [globalPokedex.charmander, globalPokedex.raichu, globalPokedex.jolteon])
  trainer2 = new Trainer("trainer2", [globalPokedex.growlithe, globalPokedex.eevee, globalPokedex.absol])
  })).done(function(){
    createContainer("charmander", "1"),
    createContainer("raichu", "1"),
    createContainer("jolteon", "1"),
    signalLoad(),
    createContainer("growlithe", "2"),
    createContainer("eevee", "2"),
    createContainer("absol", "2"),
    signalLoad2()});



let pokemonDivName
let pokeballDiv = $("#pokeball-container1")
let pokeballDiv2 = $("#pokeball-container2")

$("#pokeball1").hover(function(){
  $(this).attr("src", trainer.minions[0].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer.minions[0].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})
//You can probably use a filter to find the right name.. later

$("#pokeball2").hover(function(){
  $(this).attr("src", trainer.minions[1].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer.minions[1].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

$("#pokeball3").hover(function(){
  $(this).attr("src", trainer.minions[2].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = $(".single-pokemon-div." + trainer.minions[2].name)
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

$("#pokeball4").hover(function(){
  $(this).attr("src", trainer2.minions[0].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv2).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer2.minions[0].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

$("#pokeball5").hover(function(){
  $(this).attr("src", trainer2.minions[1].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv2).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer2.minions[1].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

$("#pokeball6").hover(function(){
  $(this).attr("src", trainer2.minions[2].image)
}, function(){
  $(this).attr("src", "images/pokeball.png")
}).on("click", function(){
  $(pokeballDiv2).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer2.minions[2].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

//Buttons:
signalLoad = () => {
  $("#toggle-screen1").addClass("pulse");
}

$("#toggle-screen1").on("click", function() {
  $("#screen-container1").toggleClass("hidden")
})

//Make pokeinfo disappear
$("#middle1").on("click", function(){
  $(pokeballDiv).removeClass("hidden")
  $(pokemonDivName).addClass("hidden")
})

$("#left1").on("click", function(){
  let perm = $(pokemonDivName+" > .permanent-stats")
  let image = $(pokemonDivName+" > .pokemon-image-container")
  let current = $(pokemonDivName+" > .current-stats")
  // if current is shown, show image
  if (!$(current).hasClass("hidden") && $(image).hasClass("hidden")) {
    $(image).toggleClass("hidden")
    $(current).toggleClass("hidden")
  } else if (!$(image).hasClass("hidden") && $(current).hasClass("hidden")) {
  //if permanent stats are hidden and image is shown, show perm stats
    $(perm).toggleClass("hidden")
    $(image).toggleClass("hidden")
  }
})

$("#right1").on("click", function(){
  let perm = $(pokemonDivName+" > .permanent-stats")
  let image = $(pokemonDivName+" > .pokemon-image-container")
  let current = $(pokemonDivName+" > .current-stats")
  //if image is hidden and current stats are hidden
  if (!$(perm).hasClass("hidden") && $(image).hasClass("hidden")) {
    $(image).toggleClass("hidden")
    $(perm).toggleClass("hidden")
  } else if (!$(image).hasClass("hidden")) {
  //if current stats are hidden and image is shown, show current stats
    $(current).toggleClass("hidden")
    $(image).toggleClass("hidden")
  }
})


//Buttons:
signalLoad2 = () => {
  $("#toggle-screen2").addClass("pulse");
}

$("#toggle-screen2").on("click", function() {
  $("#screen-container2").toggleClass("hidden")
})

//Make pokeinfo disappear
$("#middle2").on("click", function(){
  $(pokeballDiv2).removeClass("hidden")
  $(pokemonDivName).addClass("hidden")
})

$("#left2").on("click", function(){
  let perm = $(pokemonDivName+" > .permanent-stats")
  let image = $(pokemonDivName+" > .pokemon-image-container")
  let current = $(pokemonDivName+" > .current-stats")
  // if current is shown, show image
  if (!$(current).hasClass("hidden") && $(image).hasClass("hidden")) {
    $(image).toggleClass("hidden")
    $(current).toggleClass("hidden")
  } else if (!$(image).hasClass("hidden") && $(current).hasClass("hidden")) {
  //if permanent stats are hidden and image is shown, show perm stats
    $(perm).toggleClass("hidden")
    $(image).toggleClass("hidden")
  }
})

$("#right2").on("click", function(){
  let perm = $(pokemonDivName+" > .permanent-stats")
  let image = $(pokemonDivName+" > .pokemon-image-container")
  let current = $(pokemonDivName+" > .current-stats")
  //if image is hidden and current stats are hidden
  if (!$(perm).hasClass("hidden") && $(image).hasClass("hidden")) {
    $(image).toggleClass("hidden")
    $(perm).toggleClass("hidden")
  } else if (!$(image).hasClass("hidden")) {
  //if current stats are hidden and image is shown, show current stats
    $(current).toggleClass("hidden")
    $(image).toggleClass("hidden")
  }
})
