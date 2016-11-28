
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

Key, chord, line, and __ combine to generate a set of notes. 
A single motif will not be interesting enough to be a composition, 
but interesting music seems available through manipulating this structure. 

The tuned hand encapsulates stringed instrument physicality. 
When you playa a guitar, it makes some notes easier to get to than others. 
That seems like a nice way to reduce the number of arbitrary decisions. 




Time scales

A measure is 4-32 beats; long enough to present a pattern that repeats intelligibly. 
An "arc" is a set of 4-16 measures that repeat a pattern, but vary it interestingly. 
There is tension between savoring the pattern and being monotonous. 

Compositions are sets of interrelated arcs. A song on the radio has 3-5 arcs: intro,
verse, bridge, exit. Blues songs can have 2. A Mozart sonata will have ~1500 beats, 
~300 measures, and ~40 arcs. A Sor exercise usually has 1 or 2. A techno piece will 
have 10, overlapping, differing by adding and subtracting single motifs 
every 4 measures-- ugh!

Arcs in a composition almost always share rhythms. The extent to which invention
happens in rhythm is culturally fraught. 

So a composition is going to start with a set of motifs and use them to generate
a list of notes. The motifs will be generated from an overlapping set of keys, 
chords, and lines. 

exArcs take subsets of a composition's motifs, and use that subset to generate notes. 
The composition is then just an assignment of motifs and time ranges to arcs; 
a compositional form is just some loose rules about that assignment: song, blues, 
exercise, minuet, gavotte, sonata. 

There will be more to this: arcs are built to last ~500 beats. Symphonies will 
want more structure, but I'm here to make exercises. I suspect that I am incapable 
of emotionally connecting with symphonic structure, and that those who claim to be,
might just be engaging in intellectual/social posturing. 




Presentation and playback objects

The timer object encapsulates beat and measure. It's the metronome object. 
Other objects respond with event lists, given a time range; 
timer knows what time it is now. 

Music is always noisy. the deck object is a pseudorandom number generator. 
Compositions using the deck will be able to randomly produce the same effect 
over and over. The deck literally contians the pseudorandom number list; 
to do otherwise would invite dependence on JS doing math in particular ways. 
Which I'm sure it does. 

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
    this.weight = 4.0; 
    this.fret = 0;
    this.string = -1; 
    this.difficulty = 0;
    this.tonicSteps = 0; 
}

exNote.prototype.copy = function(it) { 
    this.t = it.t; 
    this.midi = it.midi; 
    this.weight = it.weight; 
    this.fret = it.fret; 
    this.string = it.string; 
    this.difficulty = it.difficulty; 
    this.tonicSteps = it.tonicSteps; 
}




function exNoteList() {
    this.ns = []; // notes
}

exNoteList.prototype.copy = function(it) { 
    var i; 
    for (i=0; i<it.ns.length; i=i+1) {
        this.ns[i] = new exNote(); 
        this.ns[i].copy(it.ns[i]);
    }
}

exNoteList.prototype.add = function(nt) { 
    var i = this.ns.length;
    this.ns[i] = new exNote(); // you can pass the same note over and over and still get a list
    this.ns[i].copy(nt);   
}

exNoteList.prototype.length = function() { return this.ns.length; }
exNoteList.prototype.nth = function(which) {  return this.ns[(which % this.ns.length)]; }






/// exKey: given a tonic and a mode, generate all the notes you might play. 
// implements a protocol: note list?
// need a nice way of addrssing. there could be several. 
//   time will tell. might not even want. 

function exKey() {
    this.tonic = 0;  // C
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

    this.nts = new exNoteList(); 
}



exKey.prototype.recalculate = function() { 
    var scale, midi, noteCt, octWt, scaleLen, noteCtr; 
    var stdWeight = [ 0, 3,3, 2,1,2,3 ];
    var newNote = new exNote(); 
        
    scaleLen = this.modes[this.mode].length; 
    scaleTon = this.tonic %12; 
    noteCtr = 0; 
    for (scale=-1; scale<12; scale=scale+1) {
        octWt = 8 - Math.abs(scaleTon - scale);
        for (octCt=0; octCt<scaleLen; octCt=octCt+1) { 
            thisn = (scale*12) + scaleTon + this.modes[octCt]; 
            if (thisn>-1) { 
                if (thisn == this.tonic) { 
                    tonicDex = noteCtr; 
                }
                newNote.midi = thisn; 
                newNote.weight = octWt - stdWeight[octCt];
                this.nts.add(newNote); 
                noteCtr = noteCtr+1; 
            }
        }
    }
    this.tonicIndex = tonicDex; 
    this.scaleLen = scaleLen; 
    for (i=0; i<noteCtr; i=i+1) {
        this.nts[i].tonicSteps = i-tonicDex;
    }
}

exKey.prototype.setTonic = function(n) { this.tonic=n; this.recalculate(); }
exKey.prototype.setMode = function(n) {  this.mode=(n%7); this.recalculate(); }
exKey.prototype.copy = function(it) { }


// for a given midi input, return the entry in offsets or -1000.
exKey.prototype.getWeight = function(midi) { 
    var i, len, res; 
    res = -1000;     
    len = this.notes.length; 
    for (i=0; i<len; ++i) { 
        if (midi == this.notes[i]) { 
            res = this.weights[i]; 
        }
    }
    return res; 
}


// give the nth note away from the tonic, up or down
exKey.prototype.getStepped = function(st) { 
    return this.notes[this.tonicIndex + st];
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








/* Motif embodies the bridge between line/key/chord/hand and noteLists.
    Motifs maintain internal structures that allow incremental modification.
    Mixers administer the internal modification, choosing which to use,
    and asking for note lists of particular iterations.

    Lines do this for rhythms, but rhythms are abstract, noteless. 
    
    Here's the issue. Motifs that generate from chord and line and key: that's a lot.
    Generation of variations is also a lot. 
    Either you keep all that functionality here, which makes for a huuuge class, 
    or you split it up, and then you have to communicate decisions. 

    Variations use note significance. There will have to be some notation about 
    note usage, note role, note meaning. 

    Of course, some of that will be emergant: highest note, most repeated, first, last. 
    I'm going pretty slow! 
    
*/


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











////// exMixers operate motifs inside arcs
/* mixers are the objects that turn motifs into steadily-varying
multi-measure sequences of notes.
*/

function exMixer() { 
    // the motif
    // parameters of variation
}

// returns a notelist
exMixer.prototype.notesForMeasure = function(which) { 
    switch (this.variationType) { }
}



////////////////// exArc: 8-32 measures

// 
function exArc(aDeck, aTimer, mixers, usage) {  
    this.startTime = 0.0;
}

exArc.prototype.copy = function(it) { }

// adds its notes to the list
exArc.prototype.execute = function(aNoteList) { }
exArc.prototype.copy = function(it) { }





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
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = this.cxw / this.tileSize; 
    this.tileH = this.cxh / this.tileSize; 
}

// 
exTabDisplay.prototype.drawMinSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x*ts, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawSliderSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawLargeSprite = function(x, y, tx, ty, txsz, tysz) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts, tysz*ts); 
}

exTabDisplay.prototype.drawStretchedSprite = function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts*xscale, tysz*ts*yscale); 
}

exTabDisplay.prototype.clear = function() {
    this.context.fillStyle = this.bg;
    this.context.beginPath();
    this.context.rect(0,0, 640, this.cxh);
    this.context.fill();
}

// given a MIDI tone and a place on the measures, draw. 
exTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn) { 
    var t0,mi,bpms,px,py,tx,ty, i; 
    
    t0 = this.timer.lastMeasureTime;
    mi = this.timer.measureInterval; 
    bi = this.timer.beatInterval; 
    bpms = this.timer.beatsPerMeasure; 

    px = (((tm-t0)/mi)*bpms);
    if ((px>=-0.01)&&(px<=(7.99*bpms))) {
        for (i=7; i>2; i=i-1) { 
            if (px>=((bpms*i)-0.1)) {
                px +=1.0; 
            }
        }
        if (px>=((bpms*2)-0.1)) {
            px +=1.0; 
        }
        if (px>=(bpms-0.1)) {
            px += 2.2; 
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
    if ((ms>=0) && (ms<16)) {
        px = px/bi; 
        px = ((px+ms)*ppn)+6;
        spx = 10-string;
        this.drawSliderSprite(px,8, spx,9);
    }
}



exTabDisplay.prototype.redrawer = function(noteList) {
    var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv, measCt; 

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

    // draw three measures of tab
    for (measCt=0; measCt<8; measCt=measCt+1) { 
        this.drawLargeSprite((bpm+1)*measCt,1, 3,1, 1,6); //xy txy sxy  rt bar
        this.drawStretchedSprite(1+((bpm+1)*measCt),1, 1,1, 1,6, bpm,1); // vert bar on left
        this.drawLargeSprite(1+((bpm+1)*measCt),0, 0,8, bpm,1); // above rt
    
        //this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
        //this.drawLargeSprite(bpm+1,1, 3,1, 1,6); //xy txy sxy  rt bar
        //this.drawLargeSprite((bpm*2)+2,1, 3,1, 1,6); //xy txy sxy  rt bar

//    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm,1); // vert bar on left
  //  this.drawStretchedSprite(2+bpm,1, 1,1, 1,6, bpm,1); // on mid
    //this.drawStretchedSprite(3+(bpm*2),1, 1,1, 1,6, bpm,1); // on rt

//    this.drawLargeSprite(1,0, 0,8, bpm,1); // beats ticks above left
  //  this.drawLargeSprite(2+bpm,0, 0,8, bpm,1); // above mid
    //this.drawLargeSprite(3+(bpm*2),0, 0,8, bpm,1); // above rt
    }
    // draw the miniscore at the bottom. instead of one sprite/beat, 
    // vertical scale is 8 px/beat
    var pxPerNote = 8; 
    this.drawStretchedSprite(0,8, 4,9, 1,1, 40,1); // horiz lines
    nc = 30; 
    if (noteList.length<nc) { nc = noteList.length; }
    for (i=0; i<16; i=i+1) { // measure vert bars
        this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
    }
    

    // plucks!
    for (i=0; i<noteList.length(); i=i+1) {
        p = noteList.nth(i); 
        this.drawPluck(p.string, p.fret, p.t, 8.0);
    }
}





//////////////////////////////////// PageTabDisplay: as TabDisplay, but still

function exPageTabDisplay(aCanvas, aTimer, aTuning) {
   this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
        
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = this.tileSize / this.cxw; 
    this.tileH = this.tileSize / this.cxh; 
}


// will JS use the this of exTabDisplay, or of exPageTabDisplay??  it's an experiment! 
exPageTabDisplay.prototype.drawMinSprite =        exTabDisplay.prototype.drawMinSprite;
exPageTabDisplay.prototype.drawSliderSprite =     exTabDisplay.prototype.drawSliderSprite;
exPageTabDisplay.prototype.drawLargeSprite =      exTabDisplay.prototype.drawLargeSprite;
exPageTabDisplay.prototype.drawStretchedSprite =  exTabDisplay.prototype.drawStretchedSprite;
exPageTabDisplay.prototype.clear =                exTabDisplay.prototype.clear;

// given a MIDI tone and a place on the measures, draw. 
exPageTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn, bx, by) { 
    var t0,mi,bpms,px,py,tx,ty; 
    
    t0 = this.timer.lastMeasureTime;
    mi = this.timer.measureInterval; 
    bi = this.timer.beatInterval; 
    bpms = this.timer.beatsPerMeasure; 

    px = (((tm-t0)/mi)*bpms);
    if ((px>=-0.01)&&(px<=(2.99*bpms))) {
        if (px>=((bpms*2)-0.1)) {
            px +=1.0; 
        }
        if (px>=(bpms-0.1)) {
            px += 2.2; 
        } else {
            px += 1.2; 
        } 
        py = 6-string; 

        // get the fret and string of the note-- without moving your hand
        tx = fret; 
        ty = 0; 
        this.drawMinSprite(px,py, tx,ty); 
    }
}


// given a MIDI tone and a place on the measures, draw. 
exPageTabDisplay.prototype.drawStaff = function(noteList, measureStart) { 
    var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv; 

    this.clear(); 
    bpm = this.timer.beatsPerMeasure; 


    // draw three measures of tab
    this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
    this.drawLargeSprite(bpm+1,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawLargeSprite((bpm*2)+2,1, 3,1, 1,6); //xy txy sxy  rt bar

    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm,1); // vert bar on left
    this.drawStretchedSprite(2+bpm,1, 1,1, 1,6, bpm,1); // on mid
    this.drawStretchedSprite(3+(bpm*2),1, 1,1, 1,6, bpm,1); // on rt

    this.drawLargeSprite(1,0, 0,8, bpm,1); // beats ticks above left
    this.drawLargeSprite(2+bpm,0, 0,8, bpm,1); // above mid
    this.drawLargeSprite(3+(bpm*2),0, 0,8, bpm,1); // above rt

    // draw the miniscore at the bottom. instead of one sprite/beat, 
    // vertical scale is 8 px/beat
    

    // plucks!
    for (i=0; i<noteList.length(); i=i+1) {
        p = noteList.nth(i); 
        this.drawPluck(p.string, p.fret, p.t, 8.0);
    }

}



exPageTabDisplay.prototype.redrawer = function(noteList, whichPage) {
    var tuning, notes, spritesPerRow, spritesPerMeasure, measPerRow, rowsPerPage, measuresPerPage, firstMeasure, i, j; 

    tuning = noteList.tuning; 
    notes = noteList.notes; 
    spritesPerRow = 2 + tuning.length; // vertical spacing 
    spritesPerMeasure = 2 + this.timer.beatsPerMeasure; 
    measPerRow = Math.floor(this.tileH / spritesPerMeasure); 
    rowsPerPage = Math.floor(this.tileV / spritesPerRow); 
    measuresPerPage = rowsPerPage + measPerPage; 
    firstMeasure = whichPage * measureserPage; 

    for (i=0; i<rowsToDraw; i=i+1) { 
        leftMeas = firstMeasure + (i*measPerRow); 
       // this.drawStaff(notes,)


    }
}




////////////////////////////////// exErciseInit: arguments and defaults     
// to make an exErcise, make an init, tweak it, and give it to "new eXercise(init)""
function exErciseInit() {  
    // timer things
    this.bpMeasure = 4;
    this.bpMinute = 60.0;
    this.measCt = 64;
    this.msPerUpdate = 50;

    // key
    this.tonic = 60;
    this.mode = 0; 
    this.tuning = 0; // for tuned hand

    this.exercise = 0;  // note generator selector
    this.argHi = 0; // high argument nibble
    this.argLo = 0; // low arg nib
    this.seed = 0; // for exDeck

    this.canvas = 0; // need a canvas; might as well!
    this.notes = -1; 
    this.score = 0; 
}



///////////////////////////////////
/////////////////////////////////// exErcise: enough infrastructure; make some notes!!
///////////////////////////////////

//////////// init; calls generator 
function exErcise(initr) { 
   // debugger;
    this.timer = new exTimer(initr.bpMinute, initr.bpMeasure, initr.msPerUpdate, initr.measCt);
    this.displ = new exTabDisplay(initr.canvas, this.timer); 
    this.hand = new exTunedHand(); 
    this.hand.setToTuning(initr.tuning);

    this.notes = new exNoteList(); 

    switch (initr.exercise) {
        case 0: this.initRandom(); break; 
        case 1: this.initFromScore(initr.score); break; /// oooo! global from spaaaace!
        //case 2: this.initRandomChord(); break; 
        default: this.initRandom(); break; 
    }
}




exErcise.prototype.initRandom = function() {
    var an = new exNote(); 
    var i, tot, intv, t;

    tot = this.timer.measureCount * this.timer.beatsPerMeasure; 
    intv = this.timer.beatInterval; 
    intvs = [0.0, 0.25, 0.5, 1.0, 2.0]; 

    t = 0; 
    while (t<tot) { 
        an.t = t; 
        an.fret = Math.floor(Math.random()*6); 
        an.string = Math.floor(Math.random()*6); 

        this.notes.add(an); 

        gapSel = Math.floor(Math.random()*5.0);
        gap = intv * intvs[gapSel];
        t+= intv;  
    }
}



exErcise.prototype.initFromScore = function() {
    var an = new exNote(); 
    var i, subnl, nll, tn, mintv, mi, mt;

    console.log(aNoteList.title);
   
    subnl = aNoteList.notes;
    nll = subnl.length - 1; 
    tn = aNoteList.tuning;

    this.timer.beatsPerMinute = aNoteList.beatsPerMinute;; 
    this.timer.beatsPerMeasure = aNoteList.beatsPerMeasure; 
    this.measureCount = aNoteList.notes[nll].m; 
    this.timer.restart(); 

    mintv = this.timer.measureInterval; 

    for (i=0; i<nll; i=i+1) {
        mi = subnl[i].m;
        an.string = 5- subnl[i].s;
        an.fret = subnl[i].f;
        mt = subnl[i].t;
        an.t = (mi+mt) * mintv;

        this.notes.add(an); 
    }
}




// draws on canvas using timer
exErcise.prototype.updateAndDraw = function() {
    this.timer.advance(); 
    this.displ.redrawer(this.notes);
} 

exErcise.prototype.restart = function() {
    this.timer.restart(); 
} 





