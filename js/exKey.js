

var note = require('./exNote');
var noteList = require('.exNoteList');

/// exKey: given a tonic and a mode, test for inclusion, generate steps, ...
// set tonic and mode; you have a key

// the octave of the tonic does not affect the key. 

function exKey() {
    this.tonic = 60;  //  Middle C
    this.mode = 0; // major
    this.modes = [
        [ 0, 2,4, 5,7,9,11 ], // maj
        [ 0, 2,3, 5,7,8,10 ], // min
        [ 0, 2,3, 5,7,9,10 ], // dorian
        [ 0, 2,4, 5,6,10   ], // wholetone
        [ 0, 2,3, 6,7,8,10 ], // "hungarian"
        [ 0, 4,6, 7,11     ], // "chinese"
        [ 0, 1,3, 5,7,9,10 ]  // "javan"
    ];
    this.notes = new exNoteList(); // once the constants are set, this is filed in
}


exKey.prototype =  { 
    recalculate: function() { 
        var i, md, baseF; 
        baseF = this.tonic %12;
        md = this.modes[this.mode];
        this.notes.clear();
        for (i=0; i<20; i=i+1) { 
            md.forEach(function(obj, ind, ar) {
                this.notes.addNew(-1.0, baseF + (i*12));
            }); 
        }
    },


    setTonic = function(tn) { 
        this.tonic = tn; 
        this.recalculate(); 
    },


    setMode = function(md) { 
        this.mode = md; 
        this.recalculate(); 
    },


    // return t or f dep wheth the note is in this key
    isIn: function(aNote) { 
        var res = false; 
        var i, candidate, baseN, baseF, len = this.modes[this.mode].length; 
        baseN = aNote.MIDI %12; 
        baseF = this.tonic %12;
        if (baseN<baseF) { baseN+=12; } 
        for (i=0; i<len; i=i+1) { 
            candidate = baseF + this.modes[i]; 
            if (baseN===candidate) { res = true; }
        }
        return res; 
    },


    // return a new note that is 'steps' up from 'aNote' in this key
    copyStep: function(aNote, steps) { // const exNote aNote, 
        var res = aNote.newCopy();
        var inSteps, octSteps, len = this.modes[this.mode].length; 
        inSteps=0; octSteps=0;
        if (steps>0) { // stepUp, dammit
            inSteps = steps % len;
            octSteps = (steps-inSteps) / len;
        } 
        if (steps<0)
            downs = (-steps)%len; 
            octDowns = (((-steps)-downs)/len) +1; 
            inSteps = (len - downs)-1;
            octSteps = -octDowns; 
        }
        res.MIDI = aNote.MIDI + (octSteps*12) + (this.modes[this.mode][inSteps]);
        return res; 
    },

    // this is bullshit. use JSON.
    report: function() { 
        console.log("<exKey>"); 
        console.log("</exKey>"); 
    },


    tester: function() { 

    }

}

module.export = exKey;
