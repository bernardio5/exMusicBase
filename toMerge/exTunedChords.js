
/////////////////  exTunedHand: a hand on a tuned guitar.  
/////////////////  exTunedHand: a hand on a tuned guitar.  

// this object encapsulates the fact that a guitar 
// is played by putting fingers on a fretboard, 
// and the fingers are on a hand that goes somewhere. 
// so there are notes that you can reach easily, 
// and many that you have to move your hand to get to, 
// and you don't want to move your hand if you don't have to. 

function exTunedHand() { 
    this.setToTuning(0); 
    this.hand = 0; 
    this.across = 0;  // finger across all strings-- or only some? to do. 

    this.knownChords = [];

    // the notes one can reach with this tuning and this hand. 
    this.reachable = []; 
    // notes in both reachable and a list of notes
    this.filters = []; 
    // len=strCount, -1=x, ow frets used. 
    this.fingers = []; 

    /* guitar chords, based on standard tuning. there are 168 on the chart I've got. I should automate. 
        Kinda have. Still. */
    this.keyNames = [ ['C', 'c', '0'], ['C#','c#','Db','db', '1'], ['D','d'], ['D#','d#','Eb','eb'], 
        ['E','e'], ['F','f'], ['F#','f#','Gb','gb'], ['G','g'], ['G#','g#','Ab','ab'],
        ['A','a'], ['A#','a#','Bb','bb'], ['B','b'] ];


    this.knownChords = [
[ ['C',-1,2,1,0,1,0],     ['C',3,3,2,0,1,0],      ['Cm',-1,3,5,5,4,3],    ['C6',-1,0,2,2,1,3], 
['C7',0,3,2,3,1,0],     ['C9',-1,3,2,3,3,3],    ['Cm6',-1,-1,1,2,1,3],  ['Cm7',-1,-1,1,3,1,3], 
['CM7',-1,3,2,0,0,0],   ['Co',-1,-1,1,2,1,2],   ['C+',-1,-1,2,1,1,0],   ['Csus',-1,-1,3,0,1,3], 
], [
['C#b',-1,-1,3,1,2,1],   ['C#m',-1,-1,2,1,2,0],  ['C#6',-1,-1,3,3,2,4],  ['C#7',-1,-1,3,4,2,4],
['C#9',-1,4,3,4,4,4],   ['C#m6',-1,-1,2,3,2,4], ['C#m7',-1,-1,2,4,2,4], ['C#M7',-1,4,3,1,1,1],
['C#o',-1,-1,2,3,2,3],  ['C#+',-1,-1,3,2,2,1],  ['C#sus',-1,-1,3,3,4,1],
], [
['D',-1,-1,0,2,3,2], ['Dm',-1,-1,0,2,3,1], ['D6',-1,0,0,2,0,2], ['D7',-1,-1,0,2,1,2], 
['D9',2,0,0,2,1,0], ['Dm6',-1,-1,0,2,0,1], ['Dm7',-1,-1,0,2,1,1], ['DM7',-1,-1,0,2,2,2], 
['Do',-1,-1,0,1,0,1], ['D+',-1,-1,0,3,3,2], ['Dsus',-1,-1,0,2,3,3],  
], [
['D#',-1,-1,3,1,2,1], ['D#m',-1,-1,4,3,4,2], ['D#6',-1,-1,1,3,1,3], ['D#7',-1,-1,1,3,2,3], 
['D#9',1,1,1,3,2,1], ['D#m6',-1,-1,1,3,1,2], ['D#m7',-1,-1,1,3,2,2], ['D#M7',-1,-1,1,3,3,3], 
['D#o',-1,-1,1,2,1,2], ['D#+',-1,-1,1,0,0,3], ['D#sus',-1,-1,1,3,4,4], 
], [
['E',0,2,2,1,0,0], ['Em',0,2,2,0,0,0], ['E6',0,2,2,1,2,0], ['E7',0,2,2,1,3,0], 
['E9',0,2,0,1,0,2], ['Em6',0,2,2,0,2,0], ['Em7',0,2,0,0,0,0], ['EM7',0,2,1,1,0,-1], 
['Eo',-1,-1,2,3,2,3], ['E+',-1,-1,2,1,1,0], ['Esus',0,2,2,2,0,0],
], [
['F',1,3,3,2,1,1], ['Fm',1,3,3,1,1,1], ['F6',-1,-1,0,2,1,1], ['F7',1,3,1,2,1,1], 
['F9',-1,-1,3,2,4,3], ['Fm6',-1,-1,0,1,1,1], ['Fm7',1,3,1,1,1,1], ['FM7',-1,-1,3,2,1,0], 
['Fo',-1,-1,0,1,0,1], ['F+',-1,-1,3,2,2,1], ['Fsus',-1,-1,3,3,1,1],  
], [
['F#',2,4,4,3,2,2], ['F#m',2,4,4,2,2,2], ['F#6',-1,4,4,3,4,-1], ['F#7',-1,-1,4,3,2,0], 
['F#9',-1,-1,2,1,4,3], ['F#m6',-1,-1,1,2,2,2], ['F#m7',-1,-1,2,2,2,2], ['F#M7',-1,-1,4,3,2,1], 
['F#o',-1,-1,1,2,1,2], ['F#+',-1,-1,4,3,3,2], ['F#sus',-1,-1,4,4,2,2],  
], [
['G',3,2,0,0,0,3], ['Gm',3,5,5,3,3,3], ['G6',3,2,0,0,0,0], ['G7',3,2,0,0,0,1],
['G9',3,0,0,2,0,1], ['Gm6',-1,-1,2,3,3,3], ['Gm7',3,5,3,3,3,3], ['GM7',-1,-1,5,4,3,2],
['Go',-1,-1,2,3,2,3], ['G+',-1,-1,1,0,0,3], ['Gsus',-1,-1,0,0,1,3], 
], [
['G#',4,6,6,5,4,4], ['G#m',4,6,6,4,4,4], ['G#6',4,3,1,1,1,1], ['G#7',-1,-1,1,1,1,2],
['G#9',-1,-1,1,3,1,2], ['G#m6',-1,-1,3,4,4,4], ['G#m7',-1,-1,1,1,0,2], ['G#M7',-1,-1,1,1,1,3],
['G#o',-1,-1,0,1,0,1], ['G#+',-1,-1,2,1,1,0], ['G#sus',-1,-1,1,1,2,4], 
], [
['A',-1,0,2,2,2,0], ['Am',-1,0,2,2,1,0], ['A6',-1,0,2,2,2,2], ['A7',-1,0,2,2,2,3], 
['A9',-1,0,2,4,2,3], ['Am6',0,0,2,2,1,2], ['Am7',-1,0,2,1,2,0], ['AM7',-1,0,2,1,2,0], 
['Ao',-1,-1,1,2,1,2], ['A+',-1,0,3,2,2,1], ['Asus',-1,-1,2,2,3,0], 
], [
['A#',-1,1,3,3,3,1], ['A#m',-1,1,3,3,2,1], ['A#6',1,1,3,3,3,3], ['A#7',-1,-1,3,3,3,4], 
['A#9',1,1,3,1,1,1], ['A#m6',-1,-1,3,3,2,3], ['A#m7',-1,-1,3,3,2,4], ['A#M7',-1,1,3,2,3,-1], 
['A#o',-1,-1,2,3,2,3], ['A#+',-1,-1,0,3,3,2], ['A#sus',-1,-1,3,3,4,1], 
], [
['B',-1,2,4,4,4,2], ['Bm',-1,2,4,4,3,2], ['B6',2,2,4,4,4,4], ['B7',0,2,1,2,0,2], 
['B9',-1,2,1,2,2,2], ['Bm6',-1,-1,5,5,4,5], ['Bm7',-1,2,4,2,3,2], ['BM7',-1,2,4,3,4,-1], 
['Bo',-1,-1,0,1,0,1], ['B+',-1,-1,5,4,4,3], ['Bsus',-1,-1,4,4,5,2], 
] ]; // gasp. and with no errors...

    // sure, that was useful. but a) tunings, b) a lot of those shapes are the same, 
    // c) addition is easy, d) better to know chord shapes than specific chords. 
    // look at how Gm, G#m, and Am are similar. 
    //    another format: [fundamental, strings, importance]
    // based on standard tuning. default all strings played. -'s for strings indicate 
    //       out-of-reach for std tuning, but others could work. no concessions for reachability
    // order og this array is chord type: M,m,6,7,9,m6,m7,M7,0,+,sus   INVERSIONS?
    //       importance: 0 if the note is an octave off the fundamental
    this.shapes = [
[ [4, 0,2,2,1,0,0, 1,0,0,0,0,1 ], [7, 3,2,0,0,0,3, 0,0,0,0,1,3 ], ],
[ [0, 3,3,2,0,1,0, 0,0,0,0,0,0 ], [4, 0,2,2,0,2,0, 0,0,0,0,0,0 ], ],
[ [4, 0,2,2,1,2,0, 0,0,0,0,0,0 ], ],
[ ],
[ ],
[ ],
[ ],
    ];

}

exTunedHand.prototype.copy = function(it) { }


exTunedHand.prototype.setToTuning = function(which) { 
    if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
    if (which==1) { this.strings = [38,45,50,54,57,62]; } // open D    d2 a2 d3 f#3 a3 d4
    if (which==2) { this.strings = [48,52,55,60,64,67]; } // open C    c3 e3 g3 c4 e4 g4
    if (which==3) { this.strings = [40,45,50,54,59,64]; } // open C    c3 e3 g3 c4 e4 g4
    // the one for el noy, the one for passemezze
    if (which==10) { this.strings = [67,60,64,69]; } // uke!    g4 c4 e4 a4
    // if (which==0) { this.strings = []; } // open G    g g d g b d??
    // if (which==0) { this.strings = []; } // open G    g g d g b d??
    // violin? base? banjo? base banjo? Bazooki? Udtz? Samisan? Sitar? I don't own any!

    this.strCount = this.strings.length; 
}


exTunedHand.prototype.setHandPlace = function(place) { 
    this.hand = place; 
    this.across = 0; 
}

exTunedHand.prototype.setBarre = function(place) { 
    this.hand = place; 
    this.across = place; 
}


// returns an array: [string, fret]
// can fail if you can't reach the note without moving your hand
// fails if
exTunedHand.prototype.stillFretForNote = function(midi) {
    var result = [-1,-1]; 
    var i, j, n; 
    // try to return open string first
    for (i=0; i<this.strCount; i=i+1) { 
        n = this.strings[i] + this.across; 
        if (n==midi) { 
            result = [i, this.across];
            return result; 
        }
    }
    for (j=0; j<4; j=j+1) { 
        for (i=0; i<this.strCount; i=i+1) { 
            n = this.strings[i] + this.hand + j;
            if (n==midi) { 
                result = [i, this.hand+j];
                return result; 
            }
        }
    }
    return result; 
}



exTunedHand.prototype.getFretForNote = function(midi) {
    // first, try to get it without moving. 
    var result = this.stillFretForNote(midi);

    // if it fails, move place to 0, then forward
    if (result[0]==-1) {
        for (i=0; i<13; i=i+1) { 
            this.setHandPlace(i); 
            result = this.stillFretForNote(midi);
            if (result[0]!=-1) { return result; }
        }
    }
    return result; 
}



exTunedHand.prototype.setReachable = function() { 
    this.reachable = []; 
    
    var i, j, n; 
    for (i=0; i<this.strCount; i=i+1) { 
        this.reachable.push(this.strings[i]); 
    }
    for (j=0; j<4; j=j+1) { 
        for (i=0; i<this.strCount; i=i+1) { 
            this.reachable.push(this.strings[i]+j+this.place);
        }
    }
}


// if you can reach it, keep it. 
exTunedHand.prototype.setFilters = function(notesIn) { 
    this.setReachable(); 
    this.filters = [];
    var i, j, n;
    for (i=0; i<notesIn.length; i=i+1) {
        n = notesIn[i]; 
        for (j=0; j<this.reachable.length; j=j+1) { 
            if (n==this.reachable[j]) {
                this.filters.push[n];
            }
        }
    }
}



// given a string and a note, return the fret needed 
// to play the note, or -1.
exTunedHand.prototype.noteOnStringP = function(n,st) {
    var nt, res = -1; 
    nt = this.strings[st]+this.across; 
    for (j=0; j<4; j=j+1) { 
        if (nt+j==n) { res = this.across+j; }
    }
    return res; 
}


// for each string, find any note in 'filters' you can play on it 
exTunedHand.prototype.randomizeFingers = function(maxFingers) { 
    // call setFilters first! 
    this.fingers = []; 
    var i, n, st, rn; 

    for (i=0; i<this.strCount; i=i+1) { 
        this.fingers[i] = -1; // X 
    }

    for (i=0; i<maxFingers; i=i+1) { 
        // pick a string
        st = Math.floor(Math.random()*this.strCount);
        for (j=0; j<10; j=j+1) { // try 10 times
            rp = Math.floor(Math.random()*this.filters.length); 
            n = this.filters[rp]; // pick a random note in filters
            fr = this.noteOnStringP(n, st); // can on this string?
            if (fr!=-1) { 
                this.fingers[st] = fr;
            }
        }
    }

    // see if any unfingered, open strings are in filtered
    for (i=0; i<this.strCount; i=i+1) {
        if (this.fingers[i]==-1) {
            n = this.strings[i] + this.across; 
            for (j=0; j<this.filters.length; j=j+1) {
                if (n==this.filters[j]) {
                    this.fingers[i] = this.across; 
                }
            }
        }
    }
}



// generate a shapes array from a list of chords like "knownChords"
shapeMakers.prototype.fromKnown = function(it) { 
    var keyCounter, chordCounter, i, j, k, fund; 
    var strings = [40,45,50,55,59,64]; // standard guitar e2 a2 d3 g3 b3 e4
    var notes = [];  // notes played on frets

    // output by chord type: M,m,+,o, etc
    for (chordCounter=0; chordCounter<12
    for (keyCounter=0; keyCounter<12; keyCounter = keycounter+1) {
        fund = 48+keyCounter;
        th
        // output for a mode
        for (j=0; j<6; j=j+1) {
            thisChords = this.knownChords[i][]
            notes[j] = strings[j] +
        }

    }


exTunedHand.prototype.setToKnownChord = function(name) { 
// M major  m minor    + augmented  o diminished   0 half-diminished
// The chords I have are for standard tuning. If you're in something else, try to adjust frets slightly. 
// If you can't, return X (any <0) for that string. Which means, maybe the wrong chord! 
    
//if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4

    this.setToTuning(0);  // just no fucking around yet. 

    // find the chord by name
    // names can look like 'Cm': key and chord
    // no keys are flat. I don't care about convention. 



    this.hand = 0; 
    this.across = 0;  // finger across all strings-- or only some? to do. 

    this.knownChords = [];

    // the notes one can reach with this tuning and this hand. 
    this.reachable = []; 
    // notes in both reachable and a list of notes
    this.filters = []; 
    // len=strCount, -1=x, ow frets used. 
    this.fingers = []; 

}




/*

chord shapes let me make chords everywhere on the neck. 
they contian a chord name, its fundamental, a fret pattern, and an importance ranking.
add a df to move up and down on the neck, and be aware when this fails by
seeing that important notes are not preserved

the notation in which the shapes are stored should allow comparison (for duplicate removal), 
show which chords fail, 

fine. what's the goal anyway? long-term, being able to make lots of chords, 
and knowing what properties they convey-- making chords with particular properties. 

also, be able to find chords with particular strings or notes in them
be able to determine when a shape produces one chord instead of another. 

do this independently of exTunedHand, which is sprawling too much
*/
function exShape = {
    this.fundamental = 48; 

    this.namedIndex = 0; // index into namedChords
    this.steps = [0, 4, 7]; // copied out of namedChords
    this.chName = 'M'; // let's keep this all integers, mmmkay?  
    this.nameIndex = 0;  // mmkay!

    this.frets =  [-1, 2, 1, 0, 1, 0]; // given from knownChords
    this.tuning = [40,45,50,55,59,64]; // standard guitar e2 a2 d3 g3 b3 e4
    this.strMidi =[-1,47,51,55,60,64]; // what the frets do to the tuning
    // why not?   [43,48,52,55,60,64]
    //       frets[ 3, 3, 2, 0, 1, 0]  // 
    //       wts  [ 5, 8, 7, 6, 7, 6] 

    this.gennotes =[48,60,36, 52,64,40, 55,67,43]; // steps, inverted up and down
    this.weights = [ 8, 7, 7,  7, 6, 6,  6, 5, 5];
    this.fretWeights = [ 0,0,0, 6, 7, 6]; // that chord is crap! and my algorithm shows why. 
    this.totalFretWeights = 19;

}
// init from theoretical: take fundamental and chName=index into named chords,
// generate a list of notes that could be played, find hand position that maximizes reachables? 
exShape.prototype.initFromFunName(fun, chName, tuning) { } 

// init from knownChords array, then analyze chord to fill weights. 
exShape.prototype.initFromKnown(fun, chName, tuning) { }

exShape.prototype.copy = function(it) { } 
exShape.prototype.weight = function() { } // 
exShape.prototype.stepMatch = function(it) { } // steps are identical
exShape.prototype.midiMatch = function(it) { } // notes are identical
exShape
exShape.prototype.moveToPosition = function(place) { } // set lowest fret value to place
exShape.prototype.shapeMatch = function(it) { } // seting frets[0] to 0 for both makes all frets match
exShape.prototype.compare = function() { }


/* why bother? use midi values. this is a display problem
  this.keyNames = [ ['C', 'c', '0'], ['C#','c#','Db','db', '1'], ['D','d'], ['D#','d#','Eb','eb'], 
        ['E','e'], ['F','f'], ['F#','f#','Gb','gb'], ['G','g'], ['G#','g#','Ab','ab'],
        ['A','a'], ['A#','a#','Bb','bb'], ['B','b'] ];
*/
// chord names are only meaningful if their names evoke their sounds for you. 
    this.namedChords = [
['',4,7],['M',4,7],['m',3,7],['+',4,8],['o',3,6],['M6',4,7,9],['m6',3,7,9],
['7',4,7,10],['M7',4,7,11],['m7',3,7,10],['+7',4,8,10],['o7',3,6,9],['0',3,6,10],['07',3,6,10],
['mM7',3,7,11],['+M7',4,8,11],['7+5',4,6,10],['M9',4,7,11,14],['9',4,7,10,14],['mM9',3,7,11,14],
['-M9',3,7,11,14],['m9',3,7,10,14],['-9',3,7,10,14],['+M9',4,8,11,14],['+9',4,8,10,14],
['09',3,6,10,14],['0f9',3,6,10,13],['o9',3,6,9,14],['of9',3,6,9,13],['11',4,7,10,14,17],
['M11',4,7,11,14,17],['mM11',3,7,11,14,17],['-M11',3,7,11,14,17],['m11',3,7,10,14,17],
['-11',3,7,10,14,17],['+M11',4,8,11,14,17],['+11',4,8,10,14,17],['011',3,6,10,13,17],['o11',3,6,9,13,16],
['M13',4,7,11,14,17,21],['13',4,7,10,14,17,21],['mM13',3,7,11,14,17,21],['-M13',3,7,11,14,17,21],
['m13',3,7,11,14,17,21],['-13',3,7,10,14,17,21],['+M13',4,8,11,14,17,21],['013',3,6,10,14,17,21],
    ];

    this.chordConst = [
 ['M', 0,4,7], ['m', 0,3,7], ['6', 0,4,7,9], ['7', 0,4,7,11],  
 ['9', 0,4,7,11,14], ['m6', 0,3,7,9], ['m7', 0,3,7,10], ['M7', 0,3,7,11],
 ['o',0,3,6], ['+',0,4,8]
    ];

    this.knownChords = [
[ ['C',-1,2,1,0,1,0],   ['Cm',-1,3,5,5,4,3],    ['C6',-1,0,2,2,1,3], 
['C7',0,3,2,3,1,0],     ['C9',-1,3,2,3,3,3],    ['Cm6',-1,-1,1,2,1,3],  ['Cm7',-1,-1,1,3,1,3], 
['CM7',-1,3,2,0,0,0],   ['Co',-1,-1,1,2,1,2],   ['C+',-1,-1,2,1,1,0],   ['Csus',-1,-1,3,0,1,3], 
], [
['C#b',-1,-1,3,1,2,1],   ['C#m',-1,-1,2,1,2,0],  ['C#6',-1,-1,3,3,2,4],  ['C#7',-1,-1,3,4,2,4],
['C#9',-1,4,3,4,4,4],   ['C#m6',-1,-1,2,3,2,4], ['C#m7',-1,-1,2,4,2,4], ['C#M7',-1,4,3,1,1,1],
['C#o',-1,-1,2,3,2,3],  ['C#+',-1,-1,3,2,2,1],  ['C#sus',-1,-1,3,3,4,1],
], [
['D',-1,-1,0,2,3,2], ['Dm',-1,-1,0,2,3,1], ['D6',-1,0,0,2,0,2], ['D7',-1,-1,0,2,1,2], 
['D9',2,0,0,2,1,0], ['Dm6',-1,-1,0,2,0,1], ['Dm7',-1,-1,0,2,1,1], ['DM7',-1,-1,0,2,2,2], 
['Do',-1,-1,0,1,0,1], ['D+',-1,-1,0,3,3,2], ['Dsus',-1,-1,0,2,3,3],  
], [
['D#',-1,-1,3,1,2,1], ['D#m',-1,-1,4,3,4,2], ['D#6',-1,-1,1,3,1,3], ['D#7',-1,-1,1,3,2,3], 
['D#9',1,1,1,3,2,1], ['D#m6',-1,-1,1,3,1,2], ['D#m7',-1,-1,1,3,2,2], ['D#M7',-1,-1,1,3,3,3], 
['D#o',-1,-1,1,2,1,2], ['D#+',-1,-1,1,0,0,3], ['D#sus',-1,-1,1,3,4,4], 
], [
['E',0,2,2,1,0,0], ['Em',0,2,2,0,0,0], ['E6',0,2,2,1,2,0], ['E7',0,2,2,1,3,0], 
['E9',0,2,0,1,0,2], ['Em6',0,2,2,0,2,0], ['Em7',0,2,0,0,0,0], ['EM7',0,2,1,1,0,-1], 
['Eo',-1,-1,2,3,2,3], ['E+',-1,-1,2,1,1,0], ['Esus',0,2,2,2,0,0],
], [
['F',1,3,3,2,1,1], ['Fm',1,3,3,1,1,1], ['F6',-1,-1,0,2,1,1], ['F7',1,3,1,2,1,1], 
['F9',-1,-1,3,2,4,3], ['Fm6',-1,-1,0,1,1,1], ['Fm7',1,3,1,1,1,1], ['FM7',-1,-1,3,2,1,0], 
['Fo',-1,-1,0,1,0,1], ['F+',-1,-1,3,2,2,1], ['Fsus',-1,-1,3,3,1,1],  
], [
['F#',2,4,4,3,2,2], ['F#m',2,4,4,2,2,2], ['F#6',-1,4,4,3,4,-1], ['F#7',-1,-1,4,3,2,0], 
['F#9',-1,-1,2,1,4,3], ['F#m6',-1,-1,1,2,2,2], ['F#m7',-1,-1,2,2,2,2], ['F#M7',-1,-1,4,3,2,1], 
['F#o',-1,-1,1,2,1,2], ['F#+',-1,-1,4,3,3,2], ['F#sus',-1,-1,4,4,2,2],  
], [
['G',3,2,0,0,0,3], ['Gm',3,5,5,3,3,3], ['G6',3,2,0,0,0,0], ['G7',3,2,0,0,0,1],
['G9',3,0,0,2,0,1], ['Gm6',-1,-1,2,3,3,3], ['Gm7',3,5,3,3,3,3], ['GM7',-1,-1,5,4,3,2],
['Go',-1,-1,2,3,2,3], ['G+',-1,-1,1,0,0,3], ['Gsus',-1,-1,0,0,1,3], 
], [
['G#',4,6,6,5,4,4], ['G#m',4,6,6,4,4,4], ['G#6',4,3,1,1,1,1], ['G#7',-1,-1,1,1,1,2],
['G#9',-1,-1,1,3,1,2], ['G#m6',-1,-1,3,4,4,4], ['G#m7',-1,-1,1,1,0,2], ['G#M7',-1,-1,1,1,1,3],
['G#o',-1,-1,0,1,0,1], ['G#+',-1,-1,2,1,1,0], ['G#sus',-1,-1,1,1,2,4], 
], [
['A',-1,0,2,2,2,0], ['Am',-1,0,2,2,1,0], ['A6',-1,0,2,2,2,2], ['A7',-1,0,2,2,2,3], 
['A9',-1,0,2,4,2,3], ['Am6',0,0,2,2,1,2], ['Am7',-1,0,2,1,2,0], ['AM7',-1,0,2,1,2,0], 
['Ao',-1,-1,1,2,1,2], ['A+',-1,0,3,2,2,1], ['Asus',-1,-1,2,2,3,0], 
], [
['A#',-1,1,3,3,3,1], ['A#m',-1,1,3,3,2,1], ['A#6',1,1,3,3,3,3], ['A#7',-1,-1,3,3,3,4], 
['A#9',1,1,3,1,1,1], ['A#m6',-1,-1,3,3,2,3], ['A#m7',-1,-1,3,3,2,4], ['A#M7',-1,1,3,2,3,-1], 
['A#o',-1,-1,2,3,2,3], ['A#+',-1,-1,0,3,3,2], ['A#sus',-1,-1,3,3,4,1], 
], [
['B',-1,2,4,4,4,2], ['Bm',-1,2,4,4,3,2], ['B6',2,2,4,4,4,4], ['B7',0,2,1,2,0,2], 
['B9',-1,2,1,2,2,2], ['Bm6',-1,-1,5,5,4,5], ['Bm7',-1,2,4,2,3,2], ['BM7',-1,2,4,3,4,-1], 
['Bo',-1,-1,0,1,0,1], ['B+',-1,-1,5,4,4,3], ['Bsus',-1,-1,4,4,5,2], 
] ]; // gasp. and with no errors...

    // sure, that was useful. but a) tunings, b) a lot of those shapes are the same, 
    // c) addition is easy, d) better to know chord shapes than specific chords. 
    // look at how Gm, G#m, and Am are similar. 
    //    another format: [fundamental, strings, importance]
    // based on standard tuning. default all strings played. -'s for strings indicate 
    //       out-of-reach for std tuning, but others could work. no concessions for reachability
    // order og this array is chord type: M,m,6,7,9,m6,m7,M7,0,+,sus   INVERSIONS?
    //       importance: 5 if the note is an octave off the fundamental
    //          4 if it's the second note, 3 the third. minus 1 if inverted or scaled up
  
}

}















 








