
// chords produce noteLists using a tonic, mode, and a name. 
// don't know the theory to name inverted chords yet... 



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

var exNote = require('./exNote');
var exNoteList = require('./exNoteList');
var exKey = require('./exKey');

function exChord() { 
    this.namedChord = '-'; // index into named chords, or -1
    this.tonic = 60; // midi of base note for chords-- octave matters a lot!
    
    this.numberedChord = -1;   // index into numberNames, or -1
    this.mode = 0; // need an exKey to make numbered chords: tonic and mode. 

    this.notes = new exNoteList(); 

    this.namedChords = [ // move to prototype
        '-': [4,7],
        'M': [4,7],
        'm': [3,7],
        '+': [4,8], 'o': [3,6], 'M6': [4,7,9], 'm6': [3,7,9],
        '7': [4,7,10], 'M7': [4,7,11], 'm7': [3,7,10], '+7': [4,8,10], 
        'o7': [3,6,9], '0': [3,6,10], '07': [3,6,10],
        'mM7': [3,7,11], '+M7': [4,8,11], '7+5': [4,6,10], 
        'M9': [4,7,11,14], '9': [4,7,10,14], 'mM9': [3,7,11,14],
        '-M9': [3,7,11,14], 'm9': [3,7,10,14], '-9': [3,7,10,14], 
        '+M9': [4,8,11,14], '+9': [4,8,10,14],
        '09': [3,6,10,14], '0f9': [3,6,10,13], 'o9': [3,6,9,14], 
        'of9': [3,6,9,13], '11': [4,7,10,14,17],
        'M11': [4,7,11,14,17], 'mM11': [3,7,11,14,17], 
        '-M11': [3,7,11,14,17], 'm11': [3,7,10,14,17],
        '-11': [3,7,10,14,17], '+M11': [4,8,11,14,17], 
        '+11': [4,8,10,14,17], '011': [3,6,10,13,17], 'o11': [3,6,9,13,16],
        'M13': [4,7,11,14,17,21], '13': [4,7,10,14,17,21], 
        'mM13': [3,7,11,14,17,21], '-M13': [3,7,11,14,17,21],
        'm13': [3,7,11,14,17,21], '-13': [3,7,10,14,17,21], 
        '+M13': [4,8,11,14,17,21], '013',3,6,10,14,17,21]
    ];
    this.numberNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii']; 

    this.recalculate(); 
}


exChord.prototype = {

    /**
      * non-inline assignment
      * @function
      * @param {exChord} it - the other chord, to be copied
      */
    copy: function(it) {  
        this.namedChord = it.namedChord; 
        this.tonic = it.tonic; 
        this.numberedChord = it.numberedChord; 
        this.mode = it.mode;
        this.notes.copy(it.notes); 
        this.recalculate(); 
    },

    /**
      * makes a new exChord and sets its contents to this. 
      * @function
      */
    newCopy: function() {
        var res = new exChord();   
        res.copy(this); 
    },


    recalculate: function() { 
        var i, ln, base; 
        base = this.namedChords[this.namedChord]; 
        ln = base.length; 
        this.notes = [];  
        this.notes.addNew(this.tonic, 0.0); 
        for (i=1; i<ln; i=i+1) {
            this.notes.addNew(this.tonic + base[i], 0.0); 
        }
    },


    /**
      * Changes the note upon which the chord is built
      * @function
      * @param {int} tonic - MIDI tone value for the new tonic for the chord
      */
    setTonic: function(tonic) {
        // test tonic is an int?  
        this.tonic = tonic; 
        this.recalculate();
    },
    

    /**
      * Changes the chord to be built from the tonic.
      * @function
      * @param {string} nm - Name of the chord, from the list this.namedChords. 
      */
    setName: function(nm) {
        // test nm in this.namedChords?
        // test is a string/name
        // test is a roman number notation?
        // test is a longer name, convert to shorter?
        this.namedChord = nm; 
        this.recalculate();
    },
    

    /**
      * Changes the chord to be built from the tonic.
      * @function
      * @param {string} nm - Name of the chord, from the list of named chords. 
      */
    setNumber: function(str, mode) {
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
    },


    nthChordNote: function(n) { 
        return this.notes[n%this.chord.length];
    },


    // returns the index of the best match
    findClosest: function(midiIn) {
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
    },


    // invert, etc. 
    // report, test

}

module.exports = exChord;

