

// the core function of exMotif is to be portable. 
// we need to have functions that take a 0->1 and move objects about

/*
 
make reps with spacing
    

transpose to key

reverse

fit to hand

there is still not enough infrastructure




*/




/////////////////////////////////////
// exMotif takes a chord, lines, shufflings, and a deck, and returns
function exMotif(aChord) { 

    // what we're working with
    this.sourceChord = aChord; // MIDI tone values

    this.prefTime = [ 0, 4, 2, 6,  3, 5, 7, 1 ];  
    this.aprgTime = [ 0, 7, 2, 4,  1, 5, 4, 6 ];  

    // what we're making here
    this.notes = new Array(); // indices into sourceChord
    this.starts = new Array(); //indices into mdMotifPrefTime
    this.durations = new Array(); // 0-7; multiply by .125 to get duration

    // the motif has its own timing coordsys. this moves it within the comp
    this.trans = 0.0; 
    this.scale = 1.0; 
    
    // rendering targets containing only data derived from above
    this.MIDI = new Array(); // the notes in the motif
    this.startTime = new Array(); // when they start/end
    this.startTime = new Array();

}




// there should be more starts on start and half than 3/8ths of the way in

exMotif.prototype.render = function() {
    var i, j, st, stIndx, md; 

    this.MIDI =new Array(); 
    this.startTime = new Array(); 
    this.endTime = new Array(); 

    j=0; 
    for (i=0; i<this.notes.length; ++i) { 
        md = this.sourceChord.nthChordNote(i);
        this.MIDI[j] = md;
        if ((35<md)&&(md<87)) { 
            st = this.prefTime[this.starts[j]] * 0.125;
            st = this.trans + (this.scale*st); 
            st = st - floor(st); 
            this.startTime[j] = st;
            st = this.startTime[j] + this.durations[j] * 0.125 * this.scale;
            if (st>1.0) { st = 1.0; }
            this.endTime[j] = st;
            ++j; 
        }
    }
}


exMotif.prototype.copy = function(it) {
    this.sourceChord.copy(it.sourceChord);
    this.notes = it.notes.concat();     
    this.starts = it.starts.concat();     
    this.duration = it.duration.concat();     
    trans = it.trans; 
    scale = it.scale; 
    this.render();
}


/// return an int from 0-range
exMotif.prototype.niRand = function(range) {
    return Math.floor(Math.random()*range); 
}


// bias/100 of time, return 0, 
// (100-bias)bias/100, return 1, etc. 
// if bias==100, always return 0
// if bias<10, basically a random number in the bounds
exMotif.prototype.getPreferredIndex = function(bias, bound) {
    var i, res; 
    
    i=0; res = -1; 
    while (res==-1) { 
        if (this.niRand(100)>bias) { 
            res = i;
        } else {
            ++i; 
            if (i>bound) { i=0; }
        }
    }
    return res;
}


exMotif.prototype.setChord = function(chds) {
    this.sourceChord.copy(chds); 
    this.render(); 
 }

exMotif.prototype.makeFromChord = function(chord, complexity) {

    var i, j, chomper, startBias, noteBias, noteCount; 
 
    this.setChord(chord); 
 
    chomper = Math.floor(c*4)+1; // simple->1  complex->5
    noteCount = this.niRand(chomper) + 2; // at least 2; maybe 7
    
    startBias = 60 - Math.floor(c*30);
    noteBias = 80 - Math.floor(c*20);
    i=0; j=0; 
    while ((j<noteCount)&&(i<this.chord.chord.length)) {  
        if (this.niRand(100)>noteBias) { // strongly tend to get the first few chord notes
            this.notes[j] = i; 
            this.starts[j] = this.getPreferredIndex(startBias, 7);
            this.durations[j] = this.niRand(4);
            ++j;
        }
        ++i;
    }
    // noteCount = j;
    this.trans = 0.0; 
    this.scale = 1.0; 
    
    this.render(); 
}


exMotif.prototype.setFundamental = function() {

// - (void)setFundamental {
    this.notes[0] = 0; 
}


exMotif.prototype.findClosestInChord = function(md) {
// - (int)findClosestInChord:(int)md {
    var i, del, minDel, best; 
    
    best = -1; 
    minDel = 99999; 
    for (i=0; i<chordSz; ++i) { 
        del = abs(this.sourceChord[i] - md); 
        if (del<minDel) { 
            best = i; 
            minDel = del; 
        }
    }
    return best; 
}


exMotif.prototype.command = function(which, n) {
//- (void)command:(int)which withArgument:(float)n {
    var i, intn, swapper, a, b;
    
    var commands = ["scale", "trans", "multSc", "addTrans", "shift", "rev", 
        "invert", "shuffle", "randNote", "arp"]; 

    for (i=0; i<commands.length; i=i+1) {


    }

    intn = (int)(floor(n));
    switch (which) { 
        case MTC_SCALE: scale=n; break;
        case MTC_TRANSLATE: trans=n; break;
        case MTC_MULTIPLY_SCALE: scale*=n; break;
        case MTC_ADD_TRANSLATE: trans=((trans+n)-(floor(trans+n))); break;
        case MTC_SHIFT:
            // n == the number of semitones up/down; prefer mults of 3, 4 and 12!
            for (i=0; i<noteCount; ++i) {
                this.notes[i] = this.findClosestInChord(this.sourceChord[this.notes[i]])*n; 
            }
            break;
        case MTC_REVERSE:
            for (i=0; i<noteCount/2; ++i) { 
                swapper = this.notes[i]; 
                this.notes[i] = this.notes[(noteCount-1)-i];
                notes[(noteCount-1)-i] = swapper; 
            }
            break;
        case MTC_INVERT: 
            break;
        case MTC_SHUFFLE:
            for (i=0; i<10; ++i) {
                a = [self niRand:noteCount]; 
                b = [self niRand:noteCount]; 
                
                swapper = notes[a]; 
                notes[a] = notes[b];
                notes[b] = swapper; 
            }
            break;
        case MTC_RAND_NOTE: 
            i = [self niRand:noteCount];
            notes[i] = [self niRand:4]; 
            starts[i] = [self getPreferredIndex:66 max:7];
            break;
        case MTC_ADD_NOTE: 
            if (noteCount< MD_MOTIF_LEN) { 
                i= noteCount;
                notes[i] = [self niRand:4]; 
                starts[i] = [self getPreferredIndex:66 max:7];
                durations[i] = [self niRand:4];
                ++noteCount;
            }
            break;
        case MTC_ARPEGGIATE: 
            for (i=0; i<noteCount; ++i) {
                starts[i] = mdAprgTime[i];
                durations[i] = .125;
            }
            scale = .25;
            trans = [self niRand:4]*0.25;
            break;
    }
    [self render];
    
}


//////////  iteration for rendering
exMotif.prototype.noteCount = function() {
//- (int)noteCount { 
    return renderedNoteCount; 
}

// can return MIDI==-1!!
exMotif.prototype.getNthNote = function(n, target) {
//- (int)getNthNote:(int)n andPutItHere:(noteType*)storage {
    var res= 0; 

    if ((n>-1)&&(n<this.renderedNoteCount())) { 
        target.MIDI = this.MIDI[n];
        target.start = this.startTime[n];
        target.stop = this.endTime[n];
        res = 1; 
    }
    return res; 
}






















