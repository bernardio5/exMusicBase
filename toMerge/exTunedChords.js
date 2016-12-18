

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


// this object encapsulates the fact that a guitar 
// is played by putting fingers on a fretboard, 
// and the fingers are on a hand that goes somewhere. 
// so there are notes that you can reach easily, 
// and many that you have to move your hand to get to, 
// and you don't want to move your hand if you don't have to. 

function exChordShapes() { 
    this.setToTuning(0); 
    this.hand = 0; 
    this.across = 0;  // finger across all strings-- or only some? to do. 

    // the notes one can reach with this tuning and this hand. 
    this.reachable = []; 
    // notes in both reachable and a list of notes
    this.filters = []; 
    // len=strCount, -1=x, ow frets used. 
    this.fingers = []; 

    /* guitar chords, based on standard tuning. there are 168 on the chart I've got. I should automate. 
        Kinda have. Still. */
    this.keyNames = [ 
        ['C', 'c', '0'], 
        ['C#','c#','Db','db', '1'], 
        ['D','d'], 
        ['D#','d#', 'Eb','eb'], 
        ['E','e'], 
        ['F','f'], 
        ['F#','f#','Gb','gb'], 
        ['G','g'], 
        ['G#','g#',
        ['Ab','ab'],
        ['A','a'], 
        ['A#','a#','Bb','bb'], 
        ['B','b'] 
    ];

/* why bother? use midi values. this is a display problem
  this.keyNames = [ 'C', 'c', '0'], 'C#','c#','Db','db', '1'], 'D','d'], 'D#','d#','Eb','eb'], 
        'E','e'], 'F','f'], 'F#','f#','Gb','gb'], 'G','g'], 'G#','g#','Ab','ab'],
        'A','a'], 'A#','a#','Bb','bb'], 'B','b'] ];
*/
// chord names are only meaningful if their names evoke their sounds for you. 
    this.namedChords = {
        'M':[4,7], 'm':[3,7], '+':[4,8], 
        'o':[3,6], 'M6':[4,7,9], 'm6':[3,7,9],
        '7':[4,7,10], 'M7':[4,7,11], 'm7':[3,7,10], 
        '+7':[4,8,10], 'o7':[3,6,9], '0':[3,6,10], 
        '07':[3,6,10], 'mM7':[3,7,11], '+M7':[4,8,11], 
        '7+5':[4,6,10], 'M9':[4,7,11,14], '9':[4,7,10,14], 'mM9':[3,7,11,14],
        '-M9':[3,7,11,14], 'm9':[3,7,10,14], '-9':[3,7,10,14], '+M9':[4,8,11,14], 
        '+9':[4,8,10,14], '09':[3,6,10,14], '0f9':[3,6,10,13], 'o9':[3,6,9,14], 
        'of9':[3,6,9,13], '11':[4,7,10,14,17], 'M11':[4,7,11,14,17], 
        'mM11':[3,7,11,14,17], '-M11':[3,7,11,14,17], 'm11':[3,7,10,14,17],
        '-11':[3,7,10,14,17], '+M11':[4,8,11,14,17], '+11':[4,8,10,14,17], 
        '011':[3,6,10,13,17], 'o11':[3,6,9,13,16], 'M13':[4,7,11,14,17,21], 
        '13':[4,7,10,14,17,21], 'mM13':[3,7,11,14,17,21], '-M13':[3,7,11,14,17,21],
        'm13':[3,7,11,14,17,21], '-13':[3,7,10,14,17,21], '+M13':[4,8,11,14,17,21], 
        '013',[3,6,10,14,17,21]
    };


    this.knownChords = [
        { 'C':[-1,2,1,0,1,0],     'C':[3,3,2,0,1,0],      'Cm':[-1,3,5,5,4,3],    'C6':[-1,0,2,2,1,3], 
        'C7':[0,3,2,3,1,0],     'C9':[-1,3,2,3,3,3],    'Cm6':[-1,-1,1,2,1,3],  'Cm7':[-1,-1,1,3,1,3], 
        'CM7':[-1,3,2,0,0,0],   'Co':[-1,-1,1,2,1,2],   'C+':[-1,-1,2,1,1,0],   'Csus':[-1,-1,3,0,1,3], 
        }, { 
        'C#b':[-1,-1,3,1,2,1],   'C#m':[-1,-1,2,1,2,0],  'C#6':[-1,-1,3,3,2,4],  'C#7':[-1,-1,3,4,2,4],
        'C#9':[-1,4,3,4,4,4],   'C#m6':[-1,-1,2,3,2,4], 'C#m7':[-1,-1,2,4,2,4], 'C#M7':[-1,4,3,1,1,1],
        'C#o':[-1,-1,2,3,2,3],  'C#+':[-1,-1,3,2,2,1],  'C#sus':[-1,-1,3,3,4,1],
        }, {
        'D':[-1,-1,0,2,3,2], 'Dm':[-1,-1,0,2,3,1], 'D6':[-1,0,0,2,0,2], 'D7':[-1,-1,0,2,1,2], 
        'D9':[2,0,0,2,1,0], 'Dm6':[-1,-1,0,2,0,1], 'Dm7':[-1,-1,0,2,1,1], 'DM7':[-1,-1,0,2,2,2], 
        'Do':[-1,-1,0,1,0,1], 'D+':[-1,-1,0,3,3,2], 'Dsus':[-1,-1,0,2,3,3],  
        }, {
        'D#':[-1,-1,3,1,2,1], 'D#m':[-1,-1,4,3,4,2], 'D#6':[-1,-1,1,3,1,3], 'D#7':[-1,-1,1,3,2,3], 
        'D#9':[1,1,1,3,2,1], 'D#m6':[-1,-1,1,3,1,2], 'D#m7':[-1,-1,1,3,2,2], 'D#M7':[-1,-1,1,3,3,3], 
        'D#o':[-1,-1,1,2,1,2], 'D#+':[-1,-1,1,0,0,3], 'D#sus':[-1,-1,1,3,4,4], 
        }, {
        'E':[0,2,2,1,0,0], 'Em':[0,2,2,0,0,0], 'E6':[0,2,2,1,2,0], 'E7':[0,2,2,1,3,0], 
        'E9':[0,2,0,1,0,2], 'Em6':[0,2,2,0,2,0], 'Em7':[0,2,0,0,0,0], 'EM7':[0,2,1,1,0,-1], 
        'Eo':[-1,-1,2,3,2,3], 'E+':[-1,-1,2,1,1,0], 'Esus':[0,2,2,2,0,0],
        }, {
        'F':[1,3,3,2,1,1], 'Fm':[1,3,3,1,1,1], 'F6':[-1,-1,0,2,1,1], 'F7':[1,3,1,2,1,1], 
        'F9':[-1,-1,3,2,4,3], 'Fm6':[-1,-1,0,1,1,1], 'Fm7':[1,3,1,1,1,1], 'FM7':[-1,-1,3,2,1,0], 
        'Fo':[-1,-1,0,1,0,1], 'F+':[-1,-1,3,2,2,1], 'Fsus':[-1,-1,3,3,1,1],  
        }, {
        'F#':[2,4,4,3,2,2], 'F#m':[2,4,4,2,2,2], 'F#6':[-1,4,4,3,4,-1], 'F#7':[-1,-1,4,3,2,0], 
        'F#9':[-1,-1,2,1,4,3], 'F#m6':[-1,-1,1,2,2,2], 'F#m7':[-1,-1,2,2,2,2], 'F#M7':[-1,-1,4,3,2,1], 
        'F#o':[-1,-1,1,2,1,2], 'F#+':[-1,-1,4,3,3,2], 'F#sus':[-1,-1,4,4,2,2],  
        }, {
        'G':[3,2,0,0,0,3], 'Gm':[3,5,5,3,3,3], 'G6':[3,2,0,0,0,0], 'G7':[3,2,0,0,0,1],
        'G9':[3,0,0,2,0,1], 'Gm6':[-1,-1,2,3,3,3], 'Gm7':[3,5,3,3,3,3], 'GM7':[-1,-1,5,4,3,2],
        'Go':[-1,-1,2,3,2,3], 'G+':[-1,-1,1,0,0,3], 'Gsus':[-1,-1,0,0,1,3], 
        }, {
        'G#':[4,6,6,5,4,4], 'G#m':[4,6,6,4,4,4], 'G#6':[4,3,1,1,1,1], 'G#7':[-1,-1,1,1,1,2],
        'G#9':[-1,-1,1,3,1,2], 'G#m6':[-1,-1,3,4,4,4], 'G#m7':[-1,-1,1,1,0,2], 'G#M7':[-1,-1,1,1,1,3],
        'G#o':[-1,-1,0,1,0,1], 'G#+':[-1,-1,2,1,1,0], 'G#sus':[-1,-1,1,1,2,4], 
        }, {
        'A':[-1,0,2,2,2,0], 'Am':[-1,0,2,2,1,0], 'A6':[-1,0,2,2,2,2], 'A7':[-1,0,2,2,2,3], 
        'A9':[-1,0,2,4,2,3], 'Am6':[0,0,2,2,1,2], 'Am7':[-1,0,2,1,2,0], 'AM7':[-1,0,2,1,2,0], 
        'Ao':[-1,-1,1,2,1,2], 'A+':[-1,0,3,2,2,1], 'Asus':[-1,-1,2,2,3,0], 
        }, {
        'A#':[-1,1,3,3,3,1], 'A#m':[-1,1,3,3,2,1], 'A#6':[1,1,3,3,3,3], 'A#7':[-1,-1,3,3,3,4], 
        'A#9':[1,1,3,1,1,1], 'A#m6':[-1,-1,3,3,2,3], 'A#m7':[-1,-1,3,3,2,4], 'A#M7':[-1,1,3,2,3,-1], 
        'A#o':[-1,-1,2,3,2,3], 'A#+':[-1,-1,0,3,3,2], 'A#sus':[-1,-1,3,3,4,1], 
        }, {
        'B':[-1,2,4,4,4,2], 'Bm':[-1,2,4,4,3,2], 'B6':[2,2,4,4,4,4], 'B7':[0,2,1,2,0,2], 
        'B9':[-1,2,1,2,2,2], 'Bm6':[-1,-1,5,5,4,5], 'Bm7':[-1,2,4,2,3,2], 'BM7':[-1,2,4,3,4,-1], 
        'Bo':[-1,-1,0,1,0,1], 'B+':[-1,-1,5,4,4,3], 'Bsus':[-1,-1,4,4,5,2], 
        } 
        ]; // gasp. and with no errors...

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
    ];

}

exChordShapes.prototype = {
    copy: function(it) { }


    // returns an array: [string, fret]
    // can fail if you can't reach the note without moving your hand
    // fails if
    stillFretForNote: function(midi) {
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
    },



    getFretForNote = function(midi) {
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
    },



    setReachable = function() { 
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
    },


    // if you can reach it, keep it. 
    setFilters = function(notesIn) { 
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
    },



    // given a string and a note, return the fret needed 
    // to play the note, or -1.
    noteOnStringP = function(n,st) {
        var nt, res = -1; 
        nt = this.strings[st]+this.across; 
        for (j=0; j<4; j=j+1) { 
            if (nt+j==n) { res = this.across+j; }
        }
        return res; 
    },


    // for each string, find any note in 'filters' you can play on it 
    randomizeFingers = function(maxFingers) { 
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


}



