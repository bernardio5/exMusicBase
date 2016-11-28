
// musical exercises classes 
// javascript about music


/*
Considerations: 

How to compose with short inputs and randomness. 

Music is sound structured like language. 
Music uses many patterns. The patterns reduce the number of choices. 
But not so much that there are not too many choices. Like language!

Music has structure that is not exposed except over time. 
The structures I am aware of seem pretty trivial: interpolation, alternation, 
arithmetic progression. So I can get good results soon? Hah. 

Music Theory Choices: 

Key, mode, and rhythm are the first reductions. Key changes for melodies
are a way to transform a set of frequency relationships and preserve 
their important relationships. Ok, got that.

Key/mode are represented by chord: an arbitrary set of notes in a scale. 

Lines are repeating rhythmic fragments; no tone assignments, just timing. 
One line is never enough. 

Shuffles are meant to map chord notes to line events in a controllably 
random way. 

Key, chord, line, and shuffle combine to generate a set of notes. 
A single motif will not be interesting enough to be a composition, 
but interesting music seems available through manipulating this structure. 

A song object is essentially a list of notes, which are arrays; each note has 
at least a midi value and a time (in seconds). Other values could be standardized 
later? But it would be good for some tools to be able to examine and change notes
without dealing with why they are in the work. 



Presentation and playback objects

The timer object encapsulates beat and measure. It's the metronome object. 
Other objects respond with event lists, given a time range; 
timer knows what time it is now. 

Music is always noisy. the deck object is a pseudorandom number generator. 
Compositions using the deck will be able to randomly produce the same effect 
over and over. The deck literally contians the pseudorandom number list; 
to do otherwise would invite dependence on JS doing math in particular ways. 
Which I'm sure it does. 

The tuned hand encapsulates stringed instrument physicality. 
When you playa a guitar, it makes some notes easier to get to than others. 
That seems like a nice way to reduce the number of arbitrary decisions. 

The tabDisplay object uses a sprite sheet to display stringed-instrument 
tablature for a song. It requires a tuned hand to know what notes go where. 



*/

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






// the chord class works with tones, and not timing. 
// a chord has a fundamental note, given as a midi number. 
// it has a mode: major, monor, dorian, etc. 
// it has a set of steps-- how to skip through the scale. 
// leading to the chord: some notes in a mode and key. 

// improvements: steps is too random. acknowledge that octave intervals are special. 
// more than one octave down-- why stop anywhere? why have a frequency range limit here? 
// deal with notes lower than fundamentals better. 

// adding "setToNamed" chords-- chords match modes only sometimes; they're incompatible. 
// if "namedChord"!=-1, scales is set from namedChords, steps=all 1's, and chord==scales

function exChord(aDeck) { 
    this.deck = new exDeck(); 
    this.deck.copy(aDeck); 
    this.mode = 0;        // index into MODES -- 
    this.namedChord = -1; // -1 indicates, use mode and steps. 
    this.fundamental = 60; // midi of base note for chords
    this.stepBase = 2;
    this.stepVar = 2;

    this.scales = [];  // the notes to choose from in this scale
    this.steps = [];   // the steps through the chord
    this.chord = [];   // the selected notes

    this.modes = [
[ 0, 2,4, 5,7,9,11, 12, 14,16, 17,19,21,23, 24, 26,28, 29,31,33,35, 36, -1,-3,-5,-7,-8,-10,-12 ], //major
[ 0, 2,3, 5,7,8,10, 12, 14,15, 17,19,20,22, 24, 26,27, 29,31,32,34, 36, -2,-4,-5,-7,-9,-10,-12 ], // minor
[ 0, 2,3, 5,7,9,10, 12, 14,15, 17,19,21,22, 24, 26,27, 29,31,33,34, 36, -2,-3,-5,-7,-9,-10,-12 ], // dorian
[ 0, 2,4, 5,6,10,   12, 14,16, 17,18,22,    24, 26,28, 29,30,34,    36, -2,-6,-7,-8,-10,-12    ], // wholetone
[ 0, 2,3, 6,7,8,10, 12, 14,15, 18,19,20,22, 24, 26,28, 30,31,32,34, 36, -2,-4,-5,-6,-8,-10,-12 ],// hungarian
[ 0, 4,6, 7,11,     12, 16,18, 19,23,       24, 28,30, 31,35,       36, -1,-5,-6,-8,-12 ], // "chinese"
[ 0, 1,3, 5,7,9,10, 12, 13,15,17,19,21,22,  24, 25,27,29,31,33,34,  36, -2,-3,-5,-7,-9,-11,-12 ], // javan
    ];

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

    this.recalculate(); 
}

exChord.prototype.copy = function(it) { 
    this.deck.copy(it.deck); 
    this.mode = it.mode;              // index into MODES 
    this.namedChord = it.namedChord;
    this.fundamental = it.fundamental;    
    this.stepBase = it.stepBase; 
    this.stepVar = it.stepVar;
    this.scales = it.scales.concat();  
    this.steps = it.steps.concat(); 
    this.chord = it.chord.concat(); 
    // modes always the same; namedChords always the same. 
    this.recalculate(); 
}

exChord.prototype.seed = function(x) { this.deck.seed(x); }

/// private, don't call
exChord.prototype.resetScale = function() { 
    var i, ln;
    if (this.chordNumber==-1) { 
        ln = this.modes[this.mode].length;
        for (i=0; i<ln; ++i) {
            this.scales[i] = this.modes[this.mode][i] + this.fundamental;
        }
    } else {
//        this.scales[i] = 
    }
}

exChord.prototype.resetSteps = function() { 
    var i, st;
    st = 0;
    for (i=0; i<30; ++i) {
        st = Math.floor(this.deck.nextF() * this.stepVar);
        this.steps[i] = this.stepBase + st;
    }
}

exChord.prototype.resetChord = function() { 
    var i, ln;
    lnC = this.scales.length;
    lnS = this.steps.length;
    i = 0; 
    place = 0;
    this.chord = [];  
    while ((i<lnS)&&(place<lnC)) {
        this.chord[i] = this.scales[place];
        place += this.steps[i]; 
        ++i; 
    }
}

exChord.prototype.resetNamed = function() { 
    var i, ln;
    lnC = this.steps.length;
    lnS = this.steps.length;
    i = 0; 
    this.scales = [];  
    this.chord = [];  
    for (i=0; i<lnS; i=i+1) {
        this.scales[i] = this.fundamental + this.steps[i]; 
        this.chord[i] = this.scales[i];
    }
}

exChord.prototype.recalculate = function() { 
    if (this.mode!=-1) { 
        this.resetScale(); 
        this.resetSteps(); 
        this.resetChord(); 
    } else { 
        // "steps" contains a named chord; there is no scale.  
        this.resetNamed(); 
    }
}


// change the note upon which the key is built
exChord.prototype.setFundamental = function(fun) { 
    this.fundamental = fun; 
    this.recalculate();
}

// yeah
exChord.prototype.setMode = function(mod) { 
    this.mode = mod;
    this.recalculate();
}

// randomly change how the chord steps thru the scale
exChord.prototype.setSteps = function(b, v) { 
    this.stepBase = b; 
    this.stepVar = v;
    this.resetChord(); 
}

// have the "chord" just be all the notes in the key 
exChord.prototype.setToScale = function() { 
    this.setpBase = 1; 
    this.stepVar = 0;
    this.recalculate();
}

// use these to get the MIDI notes of the scale. kinda cheaty!
exChord.prototype.scaleSize = function() {
    return this.scales.length;   
}

exChord.prototype.nthScaleNote = function(n) {
    return this.scales[n%this.scales.length];   // notes available in a given key. 
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

exChord.prototype.setToNamed = function(aFun, aName) { 
    this.fundamental = aFun;
    this.mode = -1; 
    var i; 
    for (i=0; i<chords.length; i=i+1) {
        ch = chords[i]; 

    }
    this.resetNamed(); 
}
*/

exChord.prototype.chordSize = function() { 
    return this.chord.length;
}

exChord.prototype.nthChordNote = function(n) { 
    return this.chord[n%this.chord.length];
}


exChord.prototype.findClosest = function(midiIn) {
    var i, del, minDel, bestie; 
    
    bestie = -1; 
    minDel = 99999; 
    for (i=0; i<this.chord.length; ++i) { 
        del = abs(this.chord[i] - midiIn); 
        if (del<minDel) { 
            bestie = i; 
            minDel = del; 
        }
    }
    return bestie; 
}







/////////////////  exLine excapsulates a repeated bit of drumming. 
///////////////// many lines make a rhythm. much manipulation eventually.
// the timer object is the home of the tempo-- the beats per second. 
// it also has a "measure" length, but lines and rhythms ignore it. 
// lines do not use the timer?
// rhythms do. there is only one tempo. 

// lines contain dealings of notes onto hits. this is a second list, 
// same length as first, of random numbers, that place chord notes onto hits. 


function exLine(aDeck) {
    this.deck = new exDeck(); 
    this.deck.copy(aDeck); 
    // how many beats of the timer per rep 
    this.beatCount = 4; 
    // which beats to use, an array of 0's and 1's
    this.beats = [1, 0, 0, 0]; // the hits that are used  
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








/* you have rhythm and a chord. shuffle takes them and ... ?

    There are three shuffle types: 
        Note: one note, same note, per line 
        Chord: same chord 
            oo: some notes in or out? 
        

    Operations on shuffles tend to just be regeneration
        Note: pick a different note: change the chord!
        Chord: different chord: change that

        Arpeggiation: 

            Changes to inputs keep that randomness, 
            are recognizably the same. 

    Duration is set by the line. 
    Emphasis is set by having many lines. 


    I don't like the interface yet. 
    goals: 
        set from one line of code. 
        init random
        modify incrementally
        have incremental mods not disrupt

    life cycle: init, according to various patterns

*/


function exShuffle(aChord, aLine, aType) { 
    this.chord = new exChord(); 
    this.chord.copy(aChord); 
    
    this.line = aLine; 
    this.distType = aType; 
    this.events = []; 
    this.type = 0; 
}


exShuffle.prototype.copy = function(it) { 
}

exShuffle.prototype.setLine = function(aLine) { 
    this.line = aLine; 
    this.rerender(); 
}

exShuffle.prototype.setChord = function(aCh) { 
    this.chord = aCh; 
    this.rerender(); 
}

// yeah, this will make really boring music. 
// if this is all that you are doing!
exShuffle.prototype.rerender = function(controlA, controlB, deck) {
    switch (this.type) {
        case 0: this.setToSteadies(controlA, controlB, deck); break; 
        case 1: this.setToChord(controlA, controlB, deck); break; 
        case 2: this.setToSweeps(controlA, controlB, deck); break; 
        case 3: this.setToTrill(controlA, controlB, deck); break; 
        case 4: this.setToNoodle(controlA, controlB, deck); break; 
    }
}

// one note? a chord? every hit? one? 
// chord selected how? 
exShuffle.prototype.setToSteady = function() { 

}

// 
exShuffle.prototype.setToSweep = function() { 

}


// can't apply
exShuffle.prototype.apply = function(t0, t1) {
    this.events = [];
    this.line.setEventsForSpan(t0,t1); 

    var i,j;
    baseNote = this.chord.getNthNote(0);
    for (i=0; i<this.line.eventCount; i=i+1) {
        // set line's events for span
        baseLineEv = this.line.getNthEvent(i);
        t = baseLineEv[0]; 

        switch (this.type) { 
            case 0: // single note
            // push [t,baseNote]
//                this.events.push()
                break;
            case 1: // chord
            // for each n in chord
            // push [t, n]
                break;
            case 2: // arpeg
            // n = this.chord.getNthNote(randos[i])
            // push [t, n];
                break; 
        }

    }
}

// what a mess! 






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









/*
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


*/





















/////////////////////
/////////////////////
//// 20 years old, this one. 

function exNote() { 
    this.t = 0.0; 
    this.midi = 60; 
}

exNote.prototype.copy = function(it) { 
    this.t = it.t; 
    this.midi = it.midi; 
}

exNote.prototype.timeInMeasure = function(aTimer) {
    md = aTimer

}



function exNoteList() {
    this.ns = []; // notes
}

exNoteList.prototype.copy = function(it) { 
    var i; 
    for (i=0; i<it.ns.length; i=i+1) {
        this.ns[i].copy(it.ns[i]);
    }
}

// copy, clear, addNote, setForRange(t0,t1), getCountInRange, nthInRange








/////////////////  exTabDisplay: tab notation for guitars  
/////////////////  exTabDisplay: tab notation for guitars  
// the tab display has a two-measure area, a current and a next measure. 
// there is a slider at the top, and it shows where you are in playback.

// aHand, aNoteList..? 
function exTabDisplay(aCanvas, aTimer) {
    this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
        
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 32;     

    this.timer = aTimer; 

}

// the scales, building off of fundamental tones
// 



exTabDisplay.prototype.copy = function (n) {  
    // as above, so here. later
}

// 
exTabDisplay.prototype.drawMinSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, ts, ts, x*ts, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawSliderSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, ts, ts, x, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawLargeSprite = function(x, y, tx, ty, txsz, tysz) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, txsz*ts, tysz*ts, x*ts, y*ts, txsz*ts, tysz*ts); 
}

exTabDisplay.prototype.drawStretchedSprite = function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, txsz*ts, tysz*ts, x*ts, y*ts, txsz*ts*xscale, tysz*ts*yscale); 
}

/*
    the whole point of this is... not this. 
exTabDisplay.prototype.drawMidi = function(midi, step) { 
    var site = this.aTunedHand.getFretForNote(midi); 
    this.drawPluck(site[0], site[1], step); 
}
*/
    


exTabDisplay.prototype.clear = function() {
    this.objCount = 1;
    this.iteratorCounter = 0;
    
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.context.fillStyle = this.bg;
    this.context.beginPath();
    this.context.rect(0,0, this.cxw, this.cxh);
    this.context.fill();
        
}

// given a MIDI tone and a place on the measures, draw. 
exTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn) { 
    var t0,mi,bpms,px,py,tx,ty; 
    
    t0 = this.timer.lastMeasureTime;
    mi = this.timer.measureInterval; 
    bi = this.timer.beatInterval; 
    bpms = this.timer.beatsPerMeasure; 

    px = (((tm-t0)/mi)*bpms);
    if ((px>=-0.01)&&(px<=(2.99*bpms))) {
        if (px>=((bpms*2)-0.1)) {
            px +=3.0; 
        }
        if (px>=(bpms-0.1)) {
            px += 4.2; 
        } else {
            px += 1.2; 
        } 
        py = 6-string; 

        // get the fret and string of the note-- without moving your hand
        tx = fret; 
        ty = 0; 
        this.drawMinSprite(px,py, tx,ty); 
    }

    // also draw below
    // what measure is this note in? 
    px = tm-t0; 
    ms = Math.floor((px/mi)+0.1);
    if ((ms>=0) && (ms<20)) {
        px = px/bi; 
        px = ((px+ms)*ppn)+6;
        spx = 10-string;
        this.drawSliderSprite(px,8, spx,9);
    }
}



exTabDisplay.prototype.redrawer = function(noteList) {
    var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv; 

    this.clear(); 
    bpm = this.timer.beatsPerMeasure; 

    // two time sliders: one for measure
    perc = this.timer.measureFraction;
    x = this.tileSize * ((this.timer.beatsPerMeasure * perc)+1.0); 
    this.drawSliderSprite(x, 0, 2,9);
    // .. one for beat.
    perc = this.timer.beatFraction;
    x = this.tileSize * (perc+1.0); 
    this.drawSliderSprite(x, 0, 2,9);

    // draw two measures of tab
    this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
    this.drawLargeSprite(bpm+3,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawLargeSprite((bpm*2)+6,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm+1,1); // vert bar on left
    this.drawStretchedSprite(4+bpm,1, 1,1, 1,6, bpm+1,1); // on rt
    this.drawStretchedSprite(7+(bpm*2),1, 1,1, 1,6, bpm+1,1); // on rt
    this.drawLargeSprite(1,0, 0,8, bpm+1,1); // beats ticks above left
    this.drawLargeSprite(4+bpm,0, 0,8, bpm+1,1); // above rt
    this.drawLargeSprite(7+(bpm*2),0, 0,8, bpm+1,1); // above rt

    // draw the miniscore at the bottom. instead of one sprite/beat, 
    // vertical scale is 8 px/beat
    var pxPerNote = 8; 
    this.drawStretchedSprite(0,8, 4,9, 1,1, 26,1); // horiz lines
    nc = 30; 
    if (noteList.length<nc) { nc = noteList.length; }
    for (i=0; i<30; i=i+1) { // measure vert bars
        this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
    }
    

    // plucks!
    for (i=0; i<noteList.length; i=i+1) {
        p = noteList[i]; 
        this.drawPluck(p[2], p[3], p[1], 8.0); 
    }
}

        






