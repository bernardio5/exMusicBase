
/* Input: two notelists, an operation, and a exDeck seed. 
The first notelist is the note set; its times are not used. 
The second nl is a line (of rhythm); its tones are not used. 
They will usually be of differing lengths. 

These are combined via the operations to make a new noteList. 
Which is put into "notes".
The amount of randomness varies by op. 

    Like JS strings; don't alter them, just make new? 

So, could this not just be a set of notelist member functions? 
*/

function exShuffle(tonesList, aLine, anOp, aSeed) { 
    this.notes = tonesList.copyNew(); 
    this.line = aLine.copyNew(); 
    this.notes = new exNoteList(); 
    this.seed = aSeed; // you don't need a member deck; they're all the same. 

    switch (anOp) {
        case 0: this.setToSteady(); break; 
        case 1: this.setToChord(); break; // all the notes at each strike
        case 2: this.setToSweeps(); break; // notes, in order, one per strike
        case 3: this.setToTrill(); break; // pick two, alternate
        case 4: this.setToNoodle(); break; // random walk?
    }
};

// one note? a chord? every hit? one? 
// chord selected how? 
exShuffle.prototype = {
    setToSteady: function() { 
    },
    setToChord: function() { 
    },
    setToSweeps: function() { 
    },
    setToTrill: function() { 
    },
    setToNoodle: function() { 
    }

};











