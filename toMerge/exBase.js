

/// exBase.js contains the base classes of musical composition
// the deck, notes, keys, chords, lines, tuned hands

// goal: musical composition toolkit. actual composition will happen in other classes, 
// but this set should provide all the tools. 

// using these classes, make a composition. convert it to a notelist. 
// then display it however. should accomodate static tab display pages and 
// clef-format playback machines. 

// notelist amounts to a format for digital music. 
// I have MIDI im mind





function exTimer(msPerUpdate) { 
    this.t = 0.0;
    this.dt = msPerUpdate / 1000.0; 
}

exTimer.prototype.copy = function(it) { 
    this.t = it.t;
    this.dt = it.dt;
}

exTimer.prototype.advance = function() { 
    this.t += this.dt;
}


/////////////////  timer holds the time and beat. 
/////////////////  measures are present for the sake of updating the notation

function exSignature(bpMin, bpMeas, measCt, timer) { 
    if (timer) { 
        this.tmr = new exTimer(timer.t); 
        this.tmr.copy(timer);
    }

    
    this.beatsPerMinute = bpMin; 
    this.beatInterval = 60.0/bpMin; // sec/min * min/bt = sec/bt 
    this.lastBeatTime = 0.0; 
    this.didCrossBeat = true; 
    this.beatCounter = 0; // Math.floor(this.t / this.beatInterval); 
    this.lastBeatTime = 0.0; // this.beatCounter * this.beatInterval; 
    this.beatFraction = 0.0; // (this.t- this.lastBeatTime)/this.beatInterval; 

    this.beatsPerMeasure = bpMeas; 
    this.measureInterval = this.beatInterval * bpMeas; 
    this.lastMeasureTime = 0.0; 
    this.didCrossMeasure = true; 
    this.measureCounter = 0; // Math.floor(this.t / this.measureInterval); 
    this.lastMeasureTime = 0.0; 
    this.measureFraction = 0.0;     


    this.measureCount = measCt; 
    this.workDuration = this.measureInterval * measCt;  
    this.repeats = true; 
    // t is time since beginning of work. 
    this.workFraction = this.t/this.workDuration; 
}


exTimer.prototype.copy = function (it) {  
    this.tmr.copy(it.tmr);

    this.beatsPerMinute     = it.beatsPerMinute;
    this.beatInterval       = it.beatInterval;
    this.lastBeatTime       = it.lastBeatTime;
    this.didCrossBeat       = it.didCrossBeat;
    this.beatCounter        = it.beatCounter;
    this.lastBeatTime       = it.lastBeatTime;
    this.beatFraction       = it.beatFraction;

    this.beatsPerMeasure     = it.beatsPerMeasure;
    this.measureInterval     = it.measureInterval;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.didCrossMeasure     = it.didCrossMeasure;
    this.measureCounter      = it.measureCounter;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.measureFraction     = it.measureFraction;

    this.measureCount = it.measureCount; 
    this.workDuration = it.workDuration; 
    this.repeats = it.repeat; 
    this.workFraction = it.workFraction; 
}


exTimer.prototype.restart = function() { 
    this.tmr.t = 0.0;
    this.measureCount = 0; 
    this.lastMeasureTime = 0.0; 
    this.lastBeatTime = 0.0; 
    this.recalculate(); 
}

// returns void; use didCross to get stuff
exTimer.prototype.recalculate = function() {
    this.beatFraction = (this.tmr.t- this.lastBeatTime)/this.beatInterval; 
    if (this.beatFraction>1.0) { 
        this.didCrossBeat = true; 
        this.beatCounter = Math.floor(this.tmr.t / this.beatInterval); 
        this.lastBeatTime = this.beatCounter * this.beatInterval; 
        this.beatFraction = (this.t- this.lastBeatTime)/this.beatInterval; 
    } else { 
        this.didCrossBeat = false;
    }

    this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    if (this.measureFraction>1.0) { 
        this.didCrossMeasure = true; 
        this.measureCounter = Math.floor(this.t / this.measureInterval); 
        this.lastMeasureTime = this.measureCounter * this.measureInterval; 
        this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    } else { 
        this.didCrossMeasure = false;
    }

    this.workFraction = this.workDuration/this.t; 
    if (this.repeats==true) { 
        if (this.t> this.workDuration) { 
            this.t = 0.0;
            this.workFraction = 0.0; 
            // should call recalculate at this point
            // risks oo recursion if workDuration is somehow 0
            // get the rest next call
            // which should be in ~.05 sec. 
        }
    }
}


exTimer.prototype.advance = function() { 
    this.timtr=e += this.dt; 
    this.recalculate(); 
}

// the point of lines is, not everything happens on THE beat. 
exTimer.prototype.timeOfNthBeat = function(n) { 
    return this.beatInterval * Math.floor(n); 
}

exTimer.prototype.beatForTime = function(t) { 
    return Math.floor(t/this.beatInterval);
}

exTimer.prototype.timeOfNthMeasure = function(n) { 
    return this.measureInterval * Math.floor(n); 
}

exTimer.prototype.measureForTime = function(t) { 
    return Math.floor(t/this.measureInterval);
}

exTimer.prototype.measureOfNthBeat = function(n) { 
    return Math.floor(n/this.beatsPerMeasure); 
}

exTimer.prototype.beatOfNthMeasure = function(n) { 
    return Math.floor(b/this.beatsPerMeasure); 
}








// the exDeck class is where I get all of the stochastic bits. 
// use .seed to set yourself up for a specific sequence of shuffled numbers. 
// use .next to step through them; it returns a number, 0-255-- each one in 
// the same order, every time. 

// I used .generate to make the standard value for this.ns
// But only the one time. That way, you can get the same random composition
// many times. 

// yes, I'm sure many JS implementations use identical pseudorandom generators.
// are you asking me to assume they will never change? 

function exDeck() { 
    this.ns = [ 
        208, 65, 128, 207, 250, 184, 151, 77, 149, 166, 102, 191, 190, 93, 140, 223, 
        75, 108, 47, 183, 23, 100, 242, 227, 202, 158, 228, 241, 96, 220, 84, 42,  
        119, 177, 217, 22, 28, 20, 71, 46, 186, 124, 161, 131, 105, 234, 159, 144,  
        215, 150, 182, 8, 221, 138, 35, 244, 91, 83, 53, 134, 153, 238, 218, 87,  

        97, 56, 125, 82, 135, 0, 62, 130, 103, 90, 200, 50, 94, 127, 204, 117, 
        121, 245, 229, 19, 37, 116, 21, 222, 43, 213, 162, 187, 209, 5, 33, 60,  
        111, 76, 201, 74, 34, 211, 254, 106, 219, 64, 45, 88, 185, 126, 206, 86,  
        73, 80, 10, 104, 52, 6, 66, 205, 4, 3, 233, 48, 114, 89, 255, 194,  

        247, 152, 14, 170, 212, 41, 122, 78, 169, 188, 17, 148, 171, 31, 40, 30,  
        155, 12, 235, 39, 92, 165, 59, 25, 199, 68, 18, 214, 57, 115, 160, 156, 
        85, 141, 118, 173, 107, 11, 139, 243, 133, 2, 24, 38, 175, 231, 253, 195, 
        98, 137, 251, 61, 7, 72, 180, 95, 167, 163, 63, 132, 147, 226, 193, 154, 

        26, 55, 1, 113, 181, 99, 51, 101, 240, 120, 198, 176, 172, 81, 189, 32, 
        178, 203, 236, 44, 70, 145, 36, 179, 210, 9, 174, 112, 168, 110, 79, 136, 
        246, 224, 129, 232, 13, 252, 216, 157, 230, 196, 49, 123, 69, 58, 109, 54,  
        237, 67, 16, 248,  27, 192, 29, 197,  239, 164, 249, 142,  143, 225, 146, 15];
    this.sz = 256; 
    this.factor = 1.0/256.0;
    this.place = 0; 
}

exDeck.prototype.copy = function(it) { 
    this.place = it.place; // everything else should be a class constant. better idiom?  
}

exDeck.prototype.seed = function(which) { 
    this.place = which % this.sz; 
}

exDeck.prototype.nextI = function() { 
    var res = this.ns[this.place];
    this.place = this.place +1; 
    if (this.place>=this.sz) { 
        this.place = 0; 
    }
    return res; 
}

exDeck.prototype.nextF = function() {
    var res = this.factor;
    res *= this.nextI(); 
    return res; 
}

/* Maybe 256 won't be enough.. keep this around. 
exDeck.prototype.generate = function(size) { 
    var i, j, k, swap; 
    var res = []; 
    for (i=0; i<size; i=i+1) { res[i] = i; }
    for (i=0; i<10; i=i+1) {
        for (j=0; j<size; j=j+1) { 
            k = Math.floor(Math.random()*size);
            swap = res[j]; 
            res[j] = res[k]; 
            res[k] = swap;  
        } // console.log(i, j, k, swap); 
    }
    var st;
    for (i=0; i<size; i=i+16) { 
        st = "";
        for (j=0; j<16; j=j+1) {
            k = i+ j;  
            st = st + res[k] + ', ';
        }
        // outputs a new this.ns; copy and paste
        console.log(st); 
    }
}
*/









///////////////////// ultimately, arrays of notes
///////////////////// This is more of a data structure than a class.
///////////////////// Very public, members modified from outside, often, 
/////////////////////       used a lot as input for routines. I guess. 
function exNote() { 
    this.t = 0.0; 
    this.midi = 60; 

    this.fret = 0;
    this.string = -1; 
    this.difficulty = 0;

    this.measure = 0; 
    this.beatInMeasure = 0; 

    this.tg = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 
    // 10 random things to remember
    // part#? difficulty? place in chord?
}


exNote.prototype.copy = function(it) { 
    this.t = it.t; 
    this.midi = it.midi; 
    this.fret = it.fret; 
    this.string = it.string; 
    this.difficulty = it.difficulty; 
    this.measure = it.measure; 
    this.beatInMeasure = it.beatInMeasure;
    var i; 
    for (i=0; i<10; i=i+1) {
        this.tg[i] = it.tg[i];
    } 
}

exNote.prototype.newCopy = function() { 
    var res = new exNote(); 
    res.copy(this);
    return res;  
}


exNote.prototype.letter = function() { 
    var index = this.midi % 12;
    var res = '';
    switch (index) { 
        case  0: res = 'C-'; break; 
        case  1: res = 'C#'; break; 
        case  2: res = 'D-'; break; 
        case  3: res = 'D#'; break; 
        case  4: res = 'E-'; break; 
        case  5: res = 'F-'; break; 
        case  6: res = 'F#'; break; 
        case  7: res = 'G-'; break; 
        case  8: res = 'G#'; break; 
        case  9: res = 'A-'; break; 
        case 10: res = 'A#'; break; 
        case 11: res = 'B-'; break; 
    }
    return res; 
}

exNote.prototype.dt(it) { 
    return it.t - this.t; 
}

exNote.prototype.dMIDI(it) { 
    return it.MIDI - this.MIDI; 
}

exNote.prototype.makeInterval(step) { 
    var res = new note();
    res.copy(this);
    // add code to take interval names
    res.MIDI = res.MIDI + step;     
    return res; 
}







function exNoteList() {
    this.ns = []; // notes
}


exNoteList.prototype.copy = function(it) { 
    var i; 
    for (i=0; i<it.ns.length; i=i+1) {
        this.ns[i] = it.ns[i].newCopy(); 
    }
}


exNoteList.prototype.newCopy = function() { 
    var res = new exNoteList(); 
    res.copy(this);
}


exNoteList.prototype.add = function(nt) { 
    var i = this.ns.length;
    this.ns[i] = new exNote(); // you can pass the same note over and over and still get a list
    this.ns[i].copy(nt);   
}


exNoteList.prototype.length = function() { return this.ns.length; }
exNoteList.prototype.nth = function(which) {  return this.ns[(which % this.ns.length)]; }


exNoteList.prototype.combineWith = function(it) {  // add it to this
    var i, lenMe=this.ns.length, lenIt = it.ns.length;
    for (i=0; i<lenIt; i=i+1) { 
        this.ns[lenMe+i] = it.ns[i].newCopy(); 
    }
}


exNoteList.prototype.sortBy = function(orderTest) {  // use test to order this
    var swap = new exNote; 
    var i, j, bestPlace, len=this.ns.length; 
    // swap sort
    for (i=0; i<len; i=i+1) {
        bestPlace = i; 
        for (j=i+1; j<len; j=j+1) {
            if (orderTest(this.ns[j], this.ns[bestPlace])) { 
                bestPlace = j; 
            }
        }
        if (bestPlace!=i) { 
            swap.copy(this.ns[i]);
            this.ns[i].copy(this.ns[bestPlace]);
            this.ns[bestPlace].copy(swap);
        }
    }
}


exNoteList.prototype.cullBy = function(test) {  // use test to remove notes from this
    var i, len = this.ns.length; 
    for (i=0; i<len; i=i+1) {
        if (!test(ths.ns[i])) {
            // remove from array
        }
    }
}


exNoteList.prototype.apply = function(xformer) { // use this.ns[i] = xformer(this.ns[i]) for all
    var i, len = this.ns.length; 
    for (i=0; i<len; i=i+1) {
        xformer(this.ns[i]);   
    }
}


exNoteList.prototype.sortByT = function() { // sort this by t
    var testerFun = function(n1, n2) { 
        var res = false; 
        if (n1.t<n2.t) { res=true; }
        return res; 
    }
    this.sortBy(testerFun); 
}


exNoteList.prototype.cullByRange = function(t0, t1) {  // remove 
    this.sortByT(); 
    var testerFun = function(n1) { 
        var res = false; 
        if ((t0<=n1.t)&&(n1.t<=t2)) { res=true; }
        return res; 
    }
    this.cullBy(testerFun); 
}


exNoteList.prototype.cullByMIDIList = function(listTest, noteList) {  // remove 
    // cull; only notes in notelist pass
}


exNoteList.prototype.emitXML = function() {  // remove 
    // cull; only notes in notelist pass
}





/////////////////  timer holds the time and beat. 
/////////////////  measures are present for the sake of updating the notation

function exTimer(bpMin, bpMeas, msPerUpdate, measCt) { 
    this.t = 0.0;
    this.dt = msPerUpdate / 1000.0;  // same as JS setInterval

    this.beatsPerMinute = bpMin; 
    this.beatInterval = 60.0/bpMin; // sec/min * min/bt = sec/bt 
    this.lastBeatTime = 0.0; 
    this.didCrossBeat = true; 
    this.beatCounter = 0; // Math.floor(this.t / this.beatInterval); 
    this.lastBeatTime = 0.0; // this.beatCounter * this.beatInterval; 
    this.beatFraction = 0.0; // (this.t- this.lastBeatTime)/this.beatInterval; 

    this.beatsPerMeasure = bpMeas; 
    this.measureInterval = this.beatInterval * bpMeas; 
    this.lastMeasureTime = 0.0; 
    this.didCrossMeasure = true; 
    this.measureCounter = 0; // Math.floor(this.t / this.measureInterval); 
    this.lastMeasureTime = 0.0; 
    this.measureFraction = 0.0;     

    this.measureCount = measCt; 
    this.workDuration = this.measureInterval * measCt;  
    this.repeats = true; 
    // t is time since beginning of work. 
    this.workFraction = this.t/this.workDuration; 
}


exTimer.prototype.copy = function (it) {  
    this.t                  = it.t;
    this.dt                 = it.dt;

    this.beatsPerMinute     = it.beatsPerMinute;
    this.beatInterval       = it.beatInterval;
    this.lastBeatTime       = it.lastBeatTime;
    this.didCrossBeat       = it.didCrossBeat;
    this.beatCounter        = it.beatCounter;
    this.lastBeatTime       = it.lastBeatTime;
    this.beatFraction       = it.beatFraction;

    this.beatsPerMeasure     = it.beatsPerMeasure;
    this.measureInterval     = it.measureInterval;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.didCrossMeasure     = it.didCrossMeasure;
    this.measureCounter      = it.measureCounter;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.measureFraction     = it.measureFraction;

    this.measureCount = it.measureCount; 
    this.workDuration = it.workDuration; 
    this.repeats = it.repeat; 
    this.workFraction = it.workFraction; 
}


exTimer.prototype.restart = function() { 
    this.t = 0.0;
    this.measureCount = 0; 
    this.lastMeasureTime = 0.0; 
    this.lastBeatTime = 0.0; 
    this.recalculate(); 
}


// returns void; use didCross to get stuff
exTimer.prototype.recalculate = function() {
    this.beatFraction = (this.t- this.lastBeatTime)/this.beatInterval; 
    if (this.beatFraction>1.0) { 
        this.didCrossBeat = true; 
        this.beatCounter = Math.floor(this.t / this.beatInterval); 
        this.lastBeatTime = this.beatCounter * this.beatInterval; 
        this.beatFraction = (this.t- this.lastBeatTime)/this.beatInterval; 
    } else { 
        this.didCrossBeat = false;
    }

    this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    if (this.measureFraction>1.0) { 
        this.didCrossMeasure = true; 
        this.measureCounter = Math.floor(this.t / this.measureInterval); 
        this.lastMeasureTime = this.measureCounter * this.measureInterval; 
        this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    } else { 
        this.didCrossMeasure = false;
    }

    this.workFraction = this.workDuration/this.t; 
    if (this.repeats==true) { 
        if (this.t> this.workDuration) { 
            this.t = 0.0;
            this.workFraction = 0.0; 
            // should call recalculate at this point
            // risks oo recursion if workDuration is somehow 0
            // get the rest next call
            // which should be in ~.05 sec. 
        }
    }
}


exTimer.prototype.advance = function() { 
    this.t += this.dt; 
    this.recalculate(); 
}

// the point of lines is, not everything happens on THE beat. 
exTimer.prototype.timeOfNthBeat = function(n) { 
    return this.beatInterval * Math.floor(n); 
}

exTimer.prototype.beatForTime = function(t) { 
    return Math.floor(t/this.beatInterval);
}

exTimer.prototype.timeOfNthMeasure = function(n) { 
    return this.measureInterval * Math.floor(n); 
}

exTimer.prototype.measureForTime = function(t) { 
    return Math.floor(t/this.measureInterval);
}

exTimer.prototype.measureOfNthBeat = function(n) { 
    return Math.floor(n/this.beatsPerMeasure); 
}

exTimer.prototype.beatOfNthMeasure = function(n) { 
    return Math.floor(b/this.beatsPerMeasure); 
}

exTimer.prototype.setNoteMeasure = function(n) { 
    // loop thru notes in list
    /// convert note[i].t to note[i].measure and note[i].beatInMeasure
    // note[i].measure = self.measureForTime(t);
    // note[i].measure = self.measureForTime(t);
    
}








/// exKey: given a tonic and a mode, generate all the notes you might play. 
// set tonic and mode; you have a key

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
}


exKey.prototype.isIn = function(aNote) { 
    var res = false; 
    var i, candidate, baseN, baseF, len = this.modes[this.mode].length; 
    baseN = aNode.MIDI %12; 
    baseF = this.tonic %12;
    if (baseN<baseF) { baseN+=12; } 
    for (i=0; i<len; i=i+1) { 
        candidate = baseF + this.modes[i]; 
        if (baseN===candidate) { res = true; }
    }
    return res; 
}


exKey.prototype.copyStep = function(aNote, steps) { 
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
}


exKey.prototype.allNotes = function(baseNote) {
    var res = new exNoteList(); 
    var i, j, m, aN, len=this.modes[this.mode].length; 
    for (i=0; i<20; i=i+1) {
        for (j=0; j<len; j=j+1) { 
            aN = baseNote.newCopy(); 
            aN.MIDI = (i*12) + this.modes[this.mode][j]; 
            res.addNote(aN);  
        }
    }
    return res; 
}


/* ok, musical theorists: interval naming
semis   Min/maj/perf    Short   Augmented/dimd     Short  ~Ratio    Other names
0      Perfect unison    P1  Diminished second       d2    1:1        
1      Minor second      m2  Augmented unison[5][7]  A1         Semitone,[8] half tone, half step   S   
2      Major second      M2  Diminished third        d3         Tone, whole tone, whole step        T   
3      Minor third       m3  Augmented second        A2    6:5    
4      Major third       M3  Diminished fourth       d4    5:4      
5      Perfect fourth    P4  Augmented third A3            4:3 
6                            Diminished fifth        d5         Tritone[6]                          TT  
                             Augmented fourth        A4
7      Perfect fifth     P5  Diminished sixth        d6    3:2      
8      Minor sixth       m6  Augmented fifth A5          
9      Major sixth       M6  Diminished seventh      d7         
10     Minor seventh     m7  Augmented sixth A6         
11     Major seventh     M7  Diminished octave       d8        
12     Perfect octave    P8  Augmented seventh       A7    2:1      
and then, chord naming 



Short   Long    Third   Fifth   Added   C version   semitones     names                 steps in key
C, CM   C,Cmaj  maj3    perf5           C-E-G       0,4,7       Major triad             M  0,2,4
Cm      Cmin    min3    perf5           C-E♭-G      0,3,7       Minor triad             m  0,2,4   
C+      Caug    maj3    aug5            C-E-G♯      0,4,8       Augmented triad         m  0,2,5
Co      Cdim    min3    dim5            C-E♭-G♭     0,3,6       Diminished triad        h  0,2,3
CM6     Cmaj6   maj3    perf5   maj6    C-E-G-A     0,4,7,9     Major sixth chord       M  0,2,4,5
Cm6     Cmin6   min3    perf5   maj6    C-E♭-G-A    0,3,7,9     Minor sixth chord       d  0,2,4,5
C7      Cdom7   maj3    perf5   min7    C-E-G-B♭    0,4,7,10    Dominant seventh chord  ?  
CM7     Cmaj7   maj3    perf5   maj7    C-E-G-B     0,4,7,11    Major seventh chord     M  0,2,4,6
Cm7     Cmin7   min3    perf5   min7    C-E♭-G-B♭   0,3,7,10    Minor seventh chord     m  0,2,4,6
C+7     Caug7   maj3    aug5    min7    C-E-G♯-B♭   0,4,8,10    Augmented seventh chord ?? 
Co7     Cdim7   min3    dim5    maj6    C-E♭-G♭-A   0,3,6,9     Diminished seventh chord ??
Cø,Cø7  -       min3    dim5    min7    C-E♭-G♭-B♭  0,3,6,10    Half-diminished seventh chord  h 0,2,3,6
CmM7, C-min-maj7 min3   perf5   maj7    C-E♭-G-B    0,3,7,11    Minor-major seventh chord  
Cmin^maj7, Cm/M7, Cmin/maj7, Cm(M7), Cmin(maj7)  
C+M7        CaugMaj7                    C-E-Gs-B        0,4,8,11        Augmented-major 7th
C7+5        Cdom7dim5                   C-E-Gs-Bf       0,4,6,10        Half-diminished flat five
CM9,CΔ9     Cmaj9                       C-E-G-B-D       0,4,7,11,14     Major 9th
C9          Cdom9                       C-E-G-B♭-D      0,4,7,10,14     Dominant 9th
CmM9,C−M9   Cminmaj9                    C-E♭-G-B-D      0,3,7,11,14     Minor Major 9th
Cm9,C−9     Cmin9                       C-E♭-G-B♭-D     0,3,7,10,14     Minor Dominant 9th  
C+M9        Caugmaj9                    C-E-G♯-B-D      0,4,8,11,14     Augmented Major 9th
C+9,C9♯5    Caug9                       C-E-G♯-B♭-D     0,4,8,10,14     Augmented Dominant 9th  
CØ9                                     C-E♭-G♭-B♭-D    0,3,6,10,14     Half-Diminished 9th 
CØ♭9                                    C-E♭-G♭-B♭-D♭   0,3,6,10,13     Half-Diminished Minor 9th   
Co9         Cdim9                       C-E♭-G♭-Bff-D   0,3,6,9,14      Diminished 9th  
Cof9        Cdim♭9                      C-E♭-G♭-Bff-D♭  0,3,6,9,13      Diminished Minor 9th    
C11         Cdom11                      C-E-G-B♭-D-F    0,4,7,10,14,17   11th, Dominant 11th
CM11        Cmaj11                      C-E-G-B-D-F     0,4,7,11,14,17   Major 11th  
CmM11,C−M11 Cminmaj11                   C-E♭-G-B-D-F    0,3,7,11,14,17   Minor-Major 11th    
Cm11,C−11   Cmin11                      C-E♭-G-B♭-D-F   0,3,7,10,14,17   Minor 11th  
C+M11       Caugmaj11                   C-E-G♯-B-D-F    0,4,8,11,14,17   Augmented-Major 11th    
C+11,C11♯5  Caug11                      C-E-G♯-B♭-D-F   0,4,8,10,14,17   Augmented 11th  
CØ11                                    C-E♭-G♭-B♭-D♭-F 0,3,6,10,13,17   Half-Diminished 11th    
C°11        Cdim11                    C-E♭-G♭-Bff-D♭-F♭ 0,3,6,9, 13,16   Diminished 11th    
CM13,CΔ13   Cmaj13                      C-E-G-B-D-F-A   0,4,7,11,14,17,21  Major 13th  
C13         Cdom13                      C-E-G-B♭-D-F-A  0,4,7,10,14,17,21  Dominant 13th   
CmM13,C−M13 Cminmaj13                   C-E♭-G-B-D-F-A  0,3,7,11,14,17,21  Minor Major 13th    
Cm13,C−13   Cmin13                      C-E♭-G-B♭-D-F-A 0,3,7,10,14,17,21  Minor Dominant 13th 
C+M13       Caugmaj13                   C-E-G♯-B-D-F-A  0,4,8,11,14,17,21  Augmented Major 13th    
C+13,C13♯5  Caug13                      C-E-G♯-B♭-D-F-A 0,4,8,10,14,17,21  Augmented Dominant 13th 
CØ13                                  C-E♭-G♭-B♭-D-F-A  0,3,6,10,14,17,21  Half-Diminished 13th    
*/

function exChord() { 
    this.namedChord = 0; // index into named chords, or -1
    this.tonic = 60; // midi of base note for chords
    
    this.numberedChord = -1;   // index into numberNames, or -1
    this.mode = 0; // need an exKey to make numbered chords: tonic and mode. 

    this.notes = []; 
    this.weights = [];

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
    this.numberNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii']; 

    this.recalculate(); 
}

exChord.prototype.copy = function(it) {  }

// 
exChord.prototype.recalculate = function() { 
    var i, ln, whichC; 
    whichC = this.namedChord; 
    if (whichC>0) { 
        // make a chord out of one of the entries in namedChords
        base = this.namedChords[whichC]; 
        ln = base.length; 

        this.notes = [];  
        this.weights = []; 
        // 8776 7665 6554 544...
        for (i=0; i<ln*4; i=i+1) { 
            this.weights[i] = 7 - Math.floor(i/4); /// should there be a seperate thing for transposition? 
            if (i%4==0) { ++(this.weights[i]); } // how am I going to get the actual chord out of this? 
            if (i%4==3) { --(this.weights[i]); }
        }

        ind = 0;
        this.notes[ind] = this.tonic; 
        this.notes[ind+1] = this.notes[ind] +12; 
        this.notes[ind+2] = this.notes[ind] -12;
        this.notes[ind+3] = this.notes[ind] +24;

        for (i=1; i<ln; i=i+1) {
            ind = i*3;
            this.notes[ind] = this.tonic + base[i]; 
            this.notes[ind+1] = this.notes[ind] +12;
            this.notes[ind+2] = this.notes[ind] -12;
            this.notes[ind+3] = this.notes[ind] +24;
        }
    } else { 
        whichC = this.numberedChord;
        if (whichC>-1) { 
            this.notes = [];
            this.weights = []; 
            //yawn

        }

    }

}


// change the note upon which the key is built
exChord.prototype.setTonic = function(ton) { 
    this.tonic = ton; 
    this.recalculate();
}

exChord.prototype.setName = function(str) {
    var i, len, ch; 
    len = this.namedChords.length; 

    this.namedChord = -1; 
    for (i=0; i<len; i=i+1) {
        ch = this.namedChords[i];
        if (str==ch[0]) {
            this.namedChord = i; 
        }
    }
    this.recalculate;
}

exChord.prototype.setNumber = function(str, mode) {
    var i, len, ch; 
    len = this.namedChords.length; 

    this.namedChord = -1; 
    for (i=0; i<len; i=i+1) {
        ch = this.namedChords[i];
        if (str==ch[0]) {
            this.namedChord = i; 
        }
    }
    if (this.namedChord>0) { 
        this.mode = mode; 
    }
    this.recalculate; 
}


exChord.prototype.nthChordNote = function(n) { 
    return this.notes[n%this.chord.length];
}

// returns the index of the best match
exChord.prototype.findClosest = function(midiIn) {
    var i, del, minDel, bestie; 
    
    bestie = -1; 
    minDel = 99999; 
    for (i=0; i<this.chord.length; ++i) { 
        del = abs(this.notes[i] - midiIn); 
        if (del<minDel) { 
            bestie = i; 
            minDel = del; 
        }
    }
    return bestie; 
}

// for a midi value, return the cooresponding weights value or -1000.
exChord.prototype.getWeight = function(midiIn) {
    var i, res, len; 
    res = -1000; 
    len = this.weights.length; 
    for (i=0; i<len; i=i+1) {
        if (this.notes[i] == midiIn) {
            res = this.weights[i];
        }
    }
    return res; 
}








function exChordProgression() {

}











/////////////////  exTunedHand: a hand on a tuned guitar.  
/////////////////  exTunedHand: a hand on a tuned guitar.  

// this object encapsulates the fact that a guitar 
// is played by putting fingers on a fretboard, 
// and the fingers are on a hand that goes somewhere. 
// so there are notes that you can reach easily, 
// and many that you have to move your hand to get to, 
// and you don't want to move your hand if you don't have to. 

// the tunedHand is given a key or a chord, and it returns 
// a list of notes with annotations on how important they are
// and how easy they are to get to, and where you should put your hand. 

// exTextTab uses a tunedHand to track what strings and stuff. 

// each motif has a hand. 

function exTunedHand() {
    this.hand = 0; 
    this.across = 0;        // finger across all strings-- or only some? to do. 0=>none
    this.acrossBase = -1;   // if !=-1, the across finger is on all strings greater than this. 

    this.setToTuning(0); 

    // the notes one can reach with this tuning and this hand. 
    this.available = new exNoteList(); 
}
   

exTunedHand.prototype.copy = function(it) { 
    this.hand = it.hand; 
    this.across = it.across;
    this.acrossBase = it.acrossBase;
    this.setToTuning(it.tuning); 
}


exTunedHand.prototype.setToTuning = function(which) { 
    this.tuning =which; 
    if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
    if (which==1) { this.strings = [38,45,50,54,57,62]; } // open D    d2 a2 d3 f#3 a3 d4
    if (which==2) { this.strings = [48,52,55,60,64,67]; } // open C    c3 e3 g3 c4 e4 g4
    if (which==3) { this.strings = [40,45,50,54,59,64]; } // don't remember! low!
    // the one for el noy, the one for passemezze
    if (which==10) { this.strings = [67,60,64,69]; } // uke!    g4 c4 e4 a4
    if (which==11) { this.strings = [55,62,69,76]; } // violin   g3,d4,a4,e5
    if (which==12) { this.strings = [55,62,69,76]; } // mandolin   as violin
    if (which==13) { this.strings = [67,50,55,59,62]; } // banjo   g4,d3,g3,b3,d4
    if (which==14) { this.strings = [36,43,50,57]; } // cello   c2,g2,d3,a3
    // Bazooki? Udtz? Samisan? Sitar?!
    this.strCount = this.strings.length; 
}


exTunedHand.prototype.setHandPlace = function(place) { 
    this.hand = place; 
    this.across = 0; 
}


exTunedHand.prototype.setBarre = function(place, lowest) { 
    this.hand = place; 
    this.across = place; 
    this.acrossBase = lowest; // the lowest string your finger's across. 
}


exTunedHand.prototype.setAvailable = function(keyOrChord) { 
    var i, strCt, baseNote, baseFret, inBarre, note, noteCtr; 
    strCt = this.strCount; 
    noteCtr = 0; 
    for (i=0; i<strCt; i=i+1) { // for each string
        baseNote = this.strings[i];
        baseFret = 0; 
        if (this.across!=0) {
            if (i>=this.acrossBase) { 
                baseFret = this.across; 
                baseNote += this.across; 
            }
        }
        for (j=0; j<5; j=j+1) { // for frets 0-4
            note = baseNote+j;
            wt = keyOrChord.getWeight(midi);
            if (wt>-999) {
                this.available[noteCtr] = note; 
                this.frt[noteCtr] = baseFret +j; 
                this.str[noteCtr] = i;
                this.weight[noteCtr] = wt; 
                this.dif[noteCtr] = j;
                noteCtr = noteCtr +1; 
            }
        }
    }
}

// given a note
exTunedHand.prototype.setANote = function(midi) { 
    var i, min, minStr; 
    min = 9999; 
    minStr = -1; 
    for (i=0; i<numStrings; i=i+1) { 
        dif = midi - this.strings[i]; 
        if (dif<min) { 
            min = dif; 
            minStr = i; 
        }
    }


}










/////////////////  exLine excapsulates a repeated bit of drumming. 
///////////////// many lines make a rhythm. much manipulation eventually.
// the timer object is the home of the tempo-- the beats per second. 
// it also has a "measure" length, but lines and rhythms ignore it. 
// lines do not use the timer?
// rhythms do. there is only one tempo. 

// lines contain dealings of notes onto hits. this is a second list, 
// same length as first, of random numbers, that place chord notes onto hits. 

// if there IS no timer, then the concept of measure lives here. 

function exLine(aDeck) {
    this.deck = new exDeck(); 
    this.deck.copy(aDeck); 
    // how many beats of the timer per rep 
    this.beatCount = 4; 
    this.beats = [1, 0, 0, 0]; // which beats to use, an array of 0's and 1's
    this.deals = [0, 1, 2, 3]; // the notes of the chord placed onto them
    // how we divide that time up; ==|beats|
    this.intervals = this.beats.length;     
    this.currentBeats = []; 
}

exLine.prototype.copy = function(it) { 
    this.deck.copy(it.deck); 
    this.beatCount = it.beatCount; 
    this.beats = new Array();
    for (var i=0; i<it.beatCount; i=i+i) {
        this.beats[i] = it.beats[i];
    }
    this.intervals = this.beats.length;
}

exLine.prototype.seed = function(x) { this.deck.seed(x); }

// sets using an int, beats per measure, and an array of all beats. Ex: 4,[1,0,1,0]; 8,[0,0,1,1,0,0,0,0]
exLine.prototype.setFromFull = function(count, list) {
    this.beatCount = count; 
    this.beats = list; 
    this.intervals = this.beats.length;     
}

// sets using an int, beats per measure, and an array of all beats. Ex: 4,[1,1]
exLine.prototype.setFromUsed = function(count, intv, list) {
    this.beatCount = count;
    this.beats = []; 
    var i = 0; 
    for (i=0; i<intv; i=i+1) { 
        this.beats[i] = 0; 
    } 
    for (i=0; i<list.length; i=i+1) {
        this.beats[list[i]]=1;
    }
    this.intervals = this.beats.length; 
}

// sets using an int, beats per measure, and a bit pattern. Ex: 16,0xf080
//exLine.prototype.setFromBits = function(count, list) {
//    this.beatCount = count; 
//    this.beats = list; 
//}

exLine.prototype.generateEventsForTimes = function(timer, t0, t1, lineTag) { 
    var btIntrv, myIntrv, lastT, endNotCrossed; 
    var lastT, nextT, interIntrv, thisT, intervStartT, i, n;
    this.currentBeats = []; 

    btIntrv = timer.beatInterval; 
    myIntrv = this.beatCount * btIntrv;
    thisMeas = Math.floor(t0/myInterv);  
    measStartT = thisMeas * myIntrv; 
    myBeatIntrv = (btIntrv * this.beatCount)/this.intervals; 
    endNotCrossed = 0; 
    
    n = 0; 

    while (endNotCrossed==0) { 
        intervStartT = measStartT + (n*myIntrv);     
        for (i=0; i<this.intervals; i=i+1) { 
            if (this.beats[i]==1) { 
                thisT = measStartT +(i*myBeatIntrv); 
                if ((t0<=thisT) && (thisT<t1)) { 
                    this.currentBeats.push([thisT, i, lineTag]);
                }
                if (thisT>t1) { 
                    endNotCrossed = 1; 
                }
            }
        }
        n=n+1;
    }
}

// remove percent of the used beats
exLine.prototype.thin = function(deck, percent) { 
    var i; 
    for (i=0; i<this.intervals; i=i+1) {
        if (this.beats[i] == 1) { 
            if (deck.nextF()<percent) {
                this.beats[i] =0; 
            }
        }
    }
}

// set percent of the used beats
exLine.prototype.thicken = function(deck, percent) { 
    var i; 
    for (i=0; i<this.intervals; i=i+1) {
        if (this.beats[i] == 0) { 
            if (deck.nextF()<percent) {
                this.beats[i] =1; 
            }
        }
    }
}

exLine.prototype.reverse = function() { 
    var i, s, ct, j;
    ct = Math.floor(this.intervals/2.0); 
    for (i=0; i<ct; i=i+1) {
        j = this.intervals - i; 
        s = this.beats[i]; 
        this.beats[i] = this.beats[j]; 
        this.beats[j] = s; 
    }
}

// n times as long, repeating
exLine.prototype.multiply = function(n) {
    var i, ct;
    var newList = []; 
    ct = Math.floor(this.intervals*n);  
    j= 0; 
    for (i=0; i<ct; i=i+1) {
        newList.push(this.beats[j]);
        j=j+1;   
        if (j>=this.intervals) { j=0; }
    }
}

// superimpose. length of this is not changed. it loops if short
exLine.prototype.superimpose = function(it) {
    var i, ct;
    var newList = []; 
    ct = Math.floor(this.intervals*n);  
    j= 0; 
    for (i=0; i<ct; i=i+1) {
        newList.push(this.beats[j]);
        j=j+1;   
        if (j>=this.intervals) { j=0; }
    }
}

// clears events between start and stop
exLine.prototype.wipe = function(start, stop) {
    var i1, i2, i;
    if (start<stop) {   
        i1 = start;
        i2 = stop; 
        if (i1<this.intervals) { 
            if (i2>=this.intervals) { i2 = this.intervals; }
            for (i=i1; i<i2; i=i+1) { this.beats[i] = 0; }
        } 
    }
}

// removes one event 
exLine.prototype.removeNth = function(n) { 
    if (n<this.intervals) { this.beats[n] = 0; }
}

// beats<=n ==1, 0 ow
exLine.prototype.setToFirstN = function(n) { 
    var i, ct;
    var newList = []; 
    ct = Math.floor(this.intervals*n);  
    j= 0; 
    for (i=0; i<ct; i=i+1) {
        newList.push(this.beats[j]);
        j=j+1;   
        if (j>=this.intervals) { j=0; }
    }
}

// repeat an a+1-length pattern, 1,0,0,..
exLine.prototype.setToEveryN = function(n, skipfirst) { 
    var i, j; 
    for (i=0; i<this.intervals; i=i+1) { 
        if (i%n==skipfirst) { 
            this.beats[i] = 1; 
        } else {
            this.beats[i] = 0; 
        }
    }
}

// n 0's 
exLine.prototype.setToEmptyLength = function(n) { 
    var i; 
    this.beats = []; 
    for (i=0; i<n; ++i) {
        this.beats.push(0); 
    }
}

// for each, p% chance of being a 1
exLine.prototype.randomize = function(density) {
    var i, q;
    for (i=0; i<this.intervals; i=i+1) {
        if (deck.nextF()<density) { this.beats[i] = 1; }
    }
}












///////////////////////////////////////////////////
// the circle of fifths. IDK, something. stash utilities here. 

function exCircle() { 
    // going clockwise!
    //          0  1  2   3  4  5   6  7  8   9  10  11
    this.c5 = [ 0, 7, 2,  9, 4, 11, 6, 1, 8,  3, 10, 5 ];

    // the place of each entry in nts
    //    x = this.c5[this.place[x]]
    // this.place=[ 0, 7, 2,  9, 4, 11, 6, 1, 8, 3, 10, 5 ]; Did not see that coming!
}

// go n steps around, clockwise, up to +/-24 steps
// the intention is to go around <12 steps. 
// if you do more, god help you cause I'm bored. 
exCircle.prototype.around = function(inp, n) { 
    var inOct = inp%12; 
    var oct = inp-inOct; 
    var inPlace = this.c5[inOct];
    // inplace is where note inp is on the c5ths
    // now, go around. 
    newPlace = (inPlace+n)%12;
    if (newPlace<0) { newPlace+=12; } 
    return this.c5[newPlace] +oct;
}

exCircle.prototype.opposite = function(n) { 
    return this.around(n,6); 
}

exCircle.prototype.minorEquivalent = function(inp) { 
    return this.around(n,3); 
}






