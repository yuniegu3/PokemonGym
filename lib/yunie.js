
$( document ).ready(function() {
	console.log( "ready!" );

// my blueprint for pokemon
class Pokemon {
	constructor(pokname, hpstat, defstat, atkstat, abilities) {
		this.obj ={
		pokname : pokname,
		hpstat : hpstat,
		defstat : defstat,
		atkstat : atkstat,
		abilities : abilities,
		}
	}
	returnData() {return this.obj}
};
// blueprint for trainer
class MyTrainer {
	constructor(){
		this.pokemons = []
	}
  // this is adding my pokemon to my trainer
add(pokemon) {
  this.pokemons.push(pokemon)
}
// will display all of my pokemon added to my trainer
displayAll() {
  for(let i = 0; i < this.pokemons.length; ++i) {
	console.log(this.pokemons[i])
  }
}
}

//declared my trainer
let trainerHugo = new MyTrainer();

// ajax calls function for my 3 pokemon
let callGrowlithe = function(callback){
	let pic = $('#pic').attr('src', 'images/growlithe.png')
	//you can return ajax call
	 $.ajax({
	type:'GET',
	url:'https://pokeapi.co/api/v2/pokemon/58/',
	success:function(data){
		let pokname = (data.name);
		// $('#pokname').text(pokname);
		let hpstat = (data.stats[5].base_stat);
		// $('#hpstat').text(hpstat);
		let defstat = (data.stats[3].base_stat);
		// $('#defstat').text(defstat);
		let atkstat = (data.stats[4].base_stat);
		// $('#atkstat').text(atkstat);
		let abilities = (data.abilities);
		// let abili = (data.abilities[0].ability.name);
		// // $('#abili').text(abili);
		// let abili2 = (data.abilities[1].ability.name);
		// // $('#abili2').text(abili2);
		// let abili3 = (data.abilities[2].ability.name);
		// $('#ability').text(abili + ' ' +  abili2 + ' ' + abili3);
		let growlithe = new Pokemon(pokname, hpstat, defstat, atkstat, abilities);
		return callback(growlithe.returnData());
	}, 
	error:function(error){
		console.log('There seems to be an error')
	}
 	})
};
 let callEevee = function(callback){
 	let pic = $('#pic').attr('src', 'images/eevee.png')
 	$.ajax({
 	type:'GET',
 	url:'https://pokeapi.co/api/v2/pokemon/133/',
 	success:function(data){
 		let pokname = (data.name);
		let hpstat = (data.stats[5].base_stat);
		let defstat = (data.stats[3].base_stat);
		let atkstat = (data.stats[4].base_stat);
		let abilities = (data.abilities);
		let eevee = new Pokemon(pokname, hpstat, defstat, atkstat, abilities);
		return callback(eevee.returnData());
	}, 
 	error:function(error){
 		console.log('There seems to be an error')
 	}
 	})
 };
 let callAbsol = function(callback){
 	let pic = $('#pic').attr('src', 'images/absol.png')
 	$.ajax({
 	type:'GET',
 	url:'https://pokeapi.co/api/v2/pokemon/359/',
 	success:function(data){
		let pokname = (data.name);
		let hpstat = (data.stats[5].base_stat);
		let defstat = (data.stats[3].base_stat);
		let atkstat = (data.stats[4].base_stat);
		let abilities = (data.abilities);
		let absol = new Pokemon(pokname, hpstat, defstat, atkstat, abilities);
		return callback(absol.returnData());
		
	}, 
 	error:function(error){
 		console.log('There seems to be an error')
 	}
 	})
 }

$('#clickgrowlithe').click(function(){
	callGrowlithe(function(data){
		trainerHugo.add(data)
		$('#pokname').text(data.pokname);
		$('#hpstat').text(data.hpstat);
		$('#defstat').text(data.defstat);
		$('#atkstat').text(data.atkstat);
//think i could of gotten a function to go through the abilities since there might be pokemon that has more then 3 abilities
		let abili = (data.abilities[0].ability.name);
		let abili2 = (data.abilities[1].ability.name);
		let abili3 = (data.abilities[2].ability.name);
		$('#ability').text(abili + ' ' +  abili2 + ' ' + abili3);
	}); 
});

$('#clickeevee').click(function(){
	callEevee(function(data){
		trainerHugo.add(data)
		$('#pokname').text(data.pokname);
		$('#hpstat').text(data.hpstat);
		$('#defstat').text(data.defstat);
		$('#atkstat').text(data.atkstat);
		let abili = (data.abilities[0].ability.name);
		let abili2 = (data.abilities[1].ability.name);
		let abili3 = (data.abilities[2].ability.name);
		$('#ability').text(abili + ' ' +  abili2 + ' ' + abili3);

	});
});

$('#clickabsol').click(function(){
	callAbsol(function(data){
		trainerHugo.add(data)
		$('#pokname').text(data.pokname);
		$('#hpstat').text(data.hpstat);
		$('#defstat').text(data.defstat);
		$('#atkstat').text(data.atkstat);
		let abili = (data.abilities[0].ability.name);
		let abili2 = (data.abilities[1].ability.name);
		let abili3 = (data.abilities[2].ability.name);
		$('#ability').text(abili + ' ' +  abili2 + ' ' + abili3);

	});
});


});