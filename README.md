soccer-sim-engine
=================

Simulates a soccer game.  

This engine listens for game-states on a queue and makes calculations based on the given game-state.

## Current State ##

**This engine is still early in development.**

In its current state it is basically a shell that calculations can be plugged into.


- All calculations are still based on random percentages and not on player ability.
- No support yet for goal kicks, discipline, free kicks, or offsides.
- No tracking of player movement.
- No logging or saving of plays/stats (other than console.logs)

## Roadmap ##

The current roadmap is to finish adding scenarios (goal kicks, discipline, injuries, free kicks, offsides, etc) using random, percentage based decisions.

Following that, the plan is to slowly replace the random logic with player-stat based logic (and start adding in a testing suite to test the new logic).

Player stat categories will follow that of the EA Sports player models as it is widely used.

## Usage ##

### Prereqs ###
RabbitMQ installed locally

### Installation ###
    npm install

### Running ###
The engine will connect to the queue and pull off the first available game-state to process. When processed, the engine will put the result back onto the queue (unless the game is over).

Any number of engines may be listening to the queue at any given time, and any number of games can have their states on the queue at any given time.

#### Start Listener ####
    node game-engine.js

#### Put New Game On Queue ####
In a different window:

    node put-game-on-queue.js 

### Game State ###
The game state object's current options are listed in the comments in game-state-doc.js

**state**

Object describing all aspects of the game. Attributes: "game" and "players".

**state.game**

Describes the current state of the game. Most attributes are self explanatory.  Enumerations are defined in game-state-doc.js.  

However, the following attributes might need a little more explanation...

**state.game.pitch.current**

The pitch is divided up into an 8x6 grid and described as a [x,y] coordinate.  X is the length of the pitch, or the long side (goal to goal). Y is the width of the pitch, or the short side (sideline to sideline)

## Contributing ##

I'm relatively new to Node, so if you feel compelled to correct something I've done or help further the project, please feel free to do so. PR's and forks are welcome!