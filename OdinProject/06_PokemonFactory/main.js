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
    return {addSpecies, getSpeciesCount, getProto}
})();

const moveProtos = (() => {
    list = [];
    const addMoves = (name, type_, power, accuracy, effect) => {
        list.push({
            name, 
            type_, 
            power, 
            accuracy,
            effect: effect ? effect : (self, enemy) => {
                return Math.floor(((2 * self.getStat("level") / 5 + 2) * power * self.getStat("attack") / enemy.getStat("defense") / 50) + 2)
            },
        })
    };
    
    const getMove = move_ => {
        for (move of list) {
            if (move.name == move_) {
                return move;
            }
        }
        return undefined;
    };

    return({addMoves, getMove})
})();

moveProtos.addMoves("scratch", "normal", 100, 40, undefined);
moveProtos.addMoves("sonicboom", "normal", 100, undefined, (self, enemy) => {return 20});

speciesProtos.addSpecies("rattata",  ["normal"], [30, 56, 35, 25, 72]);
speciesProtos.addSpecies("pikachu", ["electric"], [35, 55, 30, 50, 90]);

const calcStat = function(IV, stat, level, hpFlag) {
    stat = Math.floor( (IV + stat + 50) * level / 50 + 5 );
    if (hpFlag) {stat += 5};
    return stat;

}

const createPokemon = (species_, level_) => {
    const proto = speciesProtos.getProto(species_);
    if (!proto) {
        return undefined;
    }
    else {
        const species = proto.species;
        let nickname = species;
        const types = proto.types;
        let level = level_;

        const IV = Math.floor(Math.random()*6);
        let maxhp = calcStat(IV, proto.hp, level);
        let curhp = maxhp;
        let attack = calcStat(IV, proto.attack, level);
        let defense = calcStat(IV, proto.defense, level);
        let special = calcStat(IV, proto.special, level);
        let speed = calcStat(IV, proto.speed, level);
        let status = 1; // 1 = alive, 0 = fainted

        const moves = [];

        const addMoves = (...moves_) => {
            for (let move of moves_) {
                if (moves.length == 4) {
                    break;
                }
                moves.push(move);
            }
        }

        const getMove = move_ => {
            for (let move of moves) {
                if (move.name == move_) {
                    return move;
                }
            }
            return undefined;
        };

        const getStat = (stat) => {
            switch (stat) {
                case "hp" : return curhp;
                case "level" : return level;
                case "attack" : return attack;
                case "defense" : return defense;
                case "special" : return special;
                case "speed" : return speed;
                default : return undefined;
            }
        };

        const levelUp = () => {
            level += 1;
            curhp = curhp/maxhp;
            maxhp = calcStat(IV, proto.hp, level);
            curhp *= maxhp;
            attack = calcStat(IV, proto.attack, level);
            defense = calcStat(IV, proto.defense, level);
            special = calcStat(IV, proto.special, level);
            speed = calcStat(IV, proto.speed, level);
        }

        const getStats = () => {
            return({curhp, maxhp, attack, defense, special, speed});
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
            addMoves,
            getMove,
            getStat,
            getStats,
            getStatus,
            levelUp, // should be made private soon
            rename,
            receiveDamage
        })
    }
}

const pikapika = createPokemon("pikachu");
pikapika.rename("Pikapika");
pikapika.addMoves(moveProtos.getMove("scratch"), moveProtos.getMove("sonicboom"));
const ratataaa = createPokemon("rattata", 10);
ratataaa.addMoves(moveProtos.getMove("scratch"));

/*
ideal battle flow: 
speed checks
  - check flags
  - check modifiers
  - check base speeds
whoever is first
  - get damage
  - get effects
  - apply to opposition
  - reset temporary flags
  - if enemy faints, end battle
do the same with the next
damage from poison/burns
 */


const generateBattle = function(self, enemy) {
    console.log(`${self.nickname} and ${enemy.nickname} want to battle!`);
    console.log(self.getStat("hp"), enemy.getStat("hp"));

    while (self.getStatus() && enemy.getStatus()) {
        let damageToEnemy = self.getMove("scratch").effect(self, enemy);
        let damageToSelf = enemy.getMove("scratch").effect(enemy, self);
        if (self.getStat("speed") >= enemy.getStat("speed")) {
            console.log(`${enemy.nickname} took ${damageToEnemy} damage!`);
            enemy.receiveDamage(damageToEnemy);
            if (!enemy.getStatus()) {break};
            console.log(`${self.nickname} took ${damageToSelf} damage!`);
            self.receiveDamage(damageToSelf);
            
        }
        else {
            self.receiveDamage(damageToSelf);
            console.log(`${self.nickname} took ${damageToSelf} damage!`);
            if (!self.getStatus()) {break};
            console.log(`${enemy.nickname} took ${damageToEnemy} damage!`);
            enemy.receiveDamage(damageToEnemy);        }
        console.log(self.getStat("hp"), enemy.getStat("hp"));
    }
    console.log("Battle ended");
}

generateBattle(pikapika, ratataaa);