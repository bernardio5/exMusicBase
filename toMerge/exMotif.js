

function exMotif(aDeck, aChord, aLine, aType) { 
    this.chord = new exChord(); 
    this.chord.copy(aChord); 
    
    this.line = aLine; 
    this.distType = aType; 
    this.events = []; 
    this.type = 0; 
}


exMotif.prototype.copy = function(it) { 
}

exMotif.prototype.setLine = function(aLine) { 
    this.line = aLine; 
    this.rerender(); 
}

exMotif.prototype.setChord = function(aCh) { 
    this.chord = aCh; 
    this.rerender(); 
}

// yeah, this will make really boring music. 
// if this is all that you are doing!
exMotif.prototype.rerender = function(controlA, controlB, deck) {
    switch (this.type) {
        // picks a note, sets all notes using that note and the line
        case 0: this.setToSteadies(controlA, controlB, deck); break;
        // picks a hit, and sets several notes to occur dring that hit
        case 1: this.setToChord(controlA, controlB, deck); break; 
        // lowest note to highest, one per hit. 
        case 2: this.setToSweeps(controlA, controlB, deck); break; 
        // picks two and alternates per hit
        case 3: this.setToTrill(controlA, controlB, deck); break; 
        // all the way up, then all down, again, till hit repeats. 
        case 4: this.setToNoodle(controlA, controlB, deck); break; 
    }
}

// one note? a chord? every hit? one? 
// chord selected how? 
exMotif.prototype.setToSteady = function() { 

}

// 
exMotif.prototype.setToSweep = function() { 

}



