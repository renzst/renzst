// Create pokemon and do battles with them
// practicing function factories

// initializes an object and methods for storing species
const speciesProtos = (() => {
    list = [];
    const addSpecies = (species, types, stats) => {
        list.push({
            species: species,
            types: types,
            hp: stats[0],
            attack: stats[1],
            defense: stats[2],
            special: stats[3],
            speed: stats[4], 
    })
    };

    const getSpeciesCount = () => {return list.length};

    const getProto = (species) => {
        for (proto of list) {
            if (proto.species == species) {
                return proto;
            }
        }
        return undefined;
    }
    return {addSpecies, getSpeciesCount, getSpecies}
})();

speciesProtos.addSpecies("rattata",  [30, 56, 35, 25, 72]);
speciesProtos.addSpecies("pikachu", [35, 55, 30, 50, 90]);

const createPokemon = (species_, level) => {
    const proto = speciesProtos.getProto(species_);
    if (!proto) {
        return undefined;
    }
    else {
        const species = proto.species;
        let nickname = species;
        const types = proto.types;

        const IV = Math.floor(Math.random()*6);
        let maxhp = Math.floor( (IV + proto.hp + 50) * level / 50 + 10 );
        let curhp = maxhp;
        let attack = Math.floor( (IV + proto.attack + 50) * level / 50 + 5 );
        let defense = Math.floor( (IV + proto.defense + 50) * level / 50 + 5 );
        let special = Math.floor( (IV + proto.special + 50) * level / 50 + 5 );
        let speed = Math.floor( (IV + proto.speed + 50) * level / 50 + 5 );
        let status = 1;

        const moves = [];

        const getStat = (stat) => {
            switch (stat) {
                case "hp" : return curhp;
                case "attack" : return attack;
                case "defense" : return defense;
                case "special" : return special;
                case "speed" : return speed;
                default : return undefined;
            }
        }

        const getStatus = () => {return status};
        const rename = newName => {nickname = newName};
        const receiveDamage = (damage) => {
            if (curhp - damage <= 0) {
                curhp = 0;
                faint();
            }
            else {
                curhp -= damage;
            }
        }
        const faint = () => {
            status = 0;
            console.log(`${nickname} has fainted!`);
        }

        return({
            species,
            nickname,
            types,
            moves,
            getStat,
            getStatus,
            rename,
            receiveDamage
        })
    }
}

const pikapika = createPokemon("pikachu", 10);