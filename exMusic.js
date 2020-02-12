

/*
 * Ok, so, first version contains all the nformation, but fails on usability. 
 how to work with note lists? Surely someone had solved this. 
 * 
 Operations on lists
 * chunk up into parts that have more data/value; process them
 *    motifs, chords, hand placements, beat lines, 
 * filters, combers: take the list; remove or jostle. 
 * recognizers: id chunks, then change, then re-recognize, 
 *    add noise to blur focus


When mixing paints, if you use more than 3, it's just brown. 
* Bottom-up organizations of notes in a work are probably similar. 
* 
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

    this.measure = 0; 
    this.beatInMeasure = 0; 

    this.tg = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 
    // 10 random things to remember
    // part#? difficulty? place in chord?
}


exNote.prototype = { 
    copy: function(it) { 
        this.t = it.t; 
        this.midi = it.midi; 
        this.fret = it.fret; 
        this.string = it.string; 
        this.measure = it.measure; 
        this.beatInMeasure = it.beatInMeasure;
        var i; 
        for (i=0; i<10; i=i+1) {
            this.tg[i] = it.tg[i];
        } 
    },


    newCopy: function() { 
        var res = new exNote(); 
        res.copy(this);
        return res;  
    },


    letter: function() { 
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
    },


    dt: function(it) { 
        return it.t - this.t; 
    },


    dmidi: function(it) { 
        return it.midi - this.midi; 
    },


    // not named interval, just the number of semitones, up or down. 
    makeInterval: function(step) { 
        var res = new note();
        res.copy(this);
        res.midi = res.midi + step;     
        return res; 
    }, 


/* interval naming
semis   Min/maj/perf    Short   Augmented/dimd     Short  ~Ratio    Other names
0      Perfect unison    P1  Diminished second       d2    1:1        
1      Minor second      m2  Augmented unison[5][7]  A1         Semitone,[8] half tone, half step   S   
2      Major second      M2  Diminished third        d3         Tone, whole tone, whole step        T   
3      Minor third       m3  Augmented second        A2    6:5    
4      Major third       M3  Diminished fourth       d4    5:4      
5      Perfect fourth    P4  Augmented third         A3    4:3 
6                            Diminished fifth        d5             Tritone[6]                     TT  
                             Augmented fourth        A4
7      Perfect fifth     P5  Diminished sixth        d6    3:2      
8      Minor sixth       m6  Augmented fifth         A5          
9      Major sixth       M6  Diminished seventh      d7         
10     Minor seventh     m7  Augmented sixth         A6         
11     Major seventh     M7  Diminished octave       d8        
12     Perfect octave    P8  Augmented seventh       A7    2:1      
and on to chord naming 
*/
    makeNamedInterval: function(nm) { 
        var mmp = ['P1', 'm2', 'M2',  'm3', 'M3', 'P4',  '-&', '-&',  'P5', 'm6', 'M6',  'm7', 'M7', 'P8'];
        var ad  = ['d2', 'A1', 'd3',  'A2', 'd4', 'A3',  'd5', 'A4',  'd6', 'A5', 'd7',  'A6', 'd8', 'A7']; 
        var vals= [  0,    1,    2,     3,    4,    5,     6,    6,     7,    8,    9,   10,   11,    12 ]; 

        var i, res, step;       
        for (i=0; i<14; i=i+1) { 
            if ((nm==mmp[i]) || (nm==ad[i])) {
                step = vals[i]; 
            }
        }
        res = new note();
        res.copy(this);
        res.midi = res.midi + step;     
        return res;     
    },



    report: function() { 

    },

    tester: function() { 
        // I don't know! Do testy things. 
    }
}



////////////////////////////////////// notelists
////////////////////////////////////// notelists
////////////////////////////////////// notelists
////////////////////////////////////// notelists
////////////////////////////////////// notelists




function exNoteList() {
    this.ns = []; // notes
}


exNoteList.prototype = {
    copy: function(it) { 
        this.clear(); 
        it.ns.forEach(function(item, index, array) {
            this.ns.push(item.newCopy()); 
        });
    },


    newCopy: function() { 
        var res = new exNoteList(); 
        res.copy(this);
    },


    add: function(nt) { 
        this.ns.push(nt.newCopy()); 
    },


    addNCopies: function(n, aNote) {
        var i; 
        for (i=0; i<n; i=i+1) { 
            this.add(aNote); 
        }
    },


    addNew: function(t, md) { 
        var nt = new exNote();
        nt.t = t; 
        nt.midi = md;
        this.ns.push(nt);   
    },


    length: function() { 
        return this.ns.length; 
    },


    nth: function(which) {  
                var i, j, k; 
        i = which; 
        j = this.ns.length; 
        k = i%j; 


        return this.ns[(which % this.ns.length)]; 
    },


    getFirst: function(which) {  
        return this.ns[0]; 
    },


    concat: function(it) {  // add it to this
        this.ns.concat(it); 
    },


    selectBy: function(test) {  // return the note for which test returns the lowest number
        var min, best, aVal;
        min = test(this.ns[0]); 
        it.ns.forEach(function(item, index, array) {
            aVal = test(item, index, array);
            if (aVal<min) {
                best = index; 
                min = aVal;
            }
        });
        return this.ns[best];
    },


    sortBy: function(orderTest) {  // use test to order this
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
    },


    cullBy: function(test) {  // keep only notes for which test is true
        var i, newLen, len = this.ns.length; 
        var res = [];
        newLen = 0; 
        for (i=0; i<len; i=i+1) {
            if (test(this.ns[i])) {
                res[newLen] = this.ns[i];
                newLen = newLen+1;  
            }
        }
        this.ns = res; 
    },

    // a this and a function
    apply: function(cx, xformer) { // use this.ns[i] = xformer(this.ns[i]) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(cx, this.ns[i]);   
        }
    },


    applyIndex: function(xformer) { // use this.ns[i] = xformer(this.ns[i], i) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(this.ns[i], i);   
        }
    },


    applyNoteList: function(xformer, aNoteList) { // use this.ns[i] = xformer(this.ns[i], i, nL) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(this.ns[i], i, aNoteList);   
        }
    },


    sortByT: function() { // sort this by t
        var testerFun = function(n1, n2) { 
            var res = false; 
            if (n1.t<n2.t) { res=true; }
            return res; 
        }
        this.sortBy(testerFun); 
    },


    cullByRange: function(t0, t1) {  // remove 
        var testerFun = function(n1) { 
            var res = false; 
            if ((t0<=n1.t)&&(n1.t<=t2)) { res=true; }
            return res; 
        }
        this.cullBy(testerFun); 
    },


    cullBymidiList: function(listTest, noteList) {  // remove 
        // cull; only notes in notelist pass
        this.sortByT(); 
        var testerFun = function(n1) { 
            var res = false; 
//            var i;
  //          if ((t0<=n1.t)&&(n1.t<=t2)) { res=true; }
            return res; 
        }
        this.cullBy(testerFun); 
    },


    clear: function() { 
        this.ns = []; 
    },


    report: function() { 
        console.log("<noteList>");
        this.apply(function (note, index) { 
            console.log("  index:"+index);
            note.report(); 
        });
        console.log("</noteList>");
    },


    tester: function() { 
        // jeez
    },


    //////////////////////////// initializers.. where else?

    initRandom: function() {
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
    },



    initFromScore: function() {
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

}
// operations on lists of lists
// groupings of notes into chords, break up, remerge. 
// how to separate provisionally? data in notes? 
// 


///////////////////////////////////////// key
///////////////////////////////////////// key
///////////////////////////////////////// key
///////////////////////////////////////// key
///////////////////////////////////////// key


// exKey: given a tonic and a mode, test for inclusion, generate steps, ...
// set tonic and mode; you have a key

// the octave of the tonic does not affect the key. 
// to do: nomenclature and treatment of greek modes & adding others
function exKey() {
    this.tonic = 60;  //  Middle C
    this.mode = 0; // major
    this.modes = [
        [ 0, 2,4, 5,7, 9,11 ], // major
        [ 0, 2,3, 5,7, 8,10 ], // minor
        [ 0, 2,3, 5,7, 9,10 ], // dorian
        [ 0, 2,4, 5,6, 10   ], // wholetone
        [ 0, 2,3, 6,7, 8,10 ], // "hungarian"
        [ 0, 4,   6,7, 11   ], // "chinese" 
        [ 0, 1,3, 5,7, 9,10 ],  // "javan"
		[ 0, 2,4, 7,   9 ], // major pentatonic
		[ 0, 3,   5,7, 9 ], // minor pentatonic
		[ 0, 3,   5,6,7, 10 ], // blues
		[ 0, 2,3, 5,7, 8,10 ], // Aolian
        [ 0, 1,2,3,4,5,6,7,8,9,10,11 ] // diatonic
    ];
    this.numberNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
    this.mode = 0; // major
    this.modeLen = 7; // |major|
    this.scale = [0,2,4,5,7,9,11];
    this.notes = new exNoteList(); // once the constants are set, this is filed in
    this.HTMLTag = "XX"; // enables multiple key controls to have unique HTML/DOM id's
    this.recalculate();
}

exKey.prototype =  { 
    recalculate: function() { 
        var i, md, baseF; 
        baseF = this.tonic %12;
        md = this.modes[this.mode];
        this.modeLen = this.modes[this.mode].length;
        this.notes.clear();

        for (i=0; i<20; i=i+1) { 
            for (j=0; j<this.modeLen; j=j+1) {
                this.notes.addNew(-1.0, baseF + (i*12) + md[j]);
                this.scale[j] = (md[j] + baseF)%12; 
            } 
        }
    },


    setTonic: function(tn) { 
        this.tonic = tn; 
        this.recalculate(); 
    },


    setMode: function(md) { 
        this.mode = md; 
        this.recalculate(); 
    },


    // return t or f dep wheth the note is in this key
    isIn: function(aNote) { 
        var res = false; 
        var i, candidate, baseN, baseF, len = this.modes[this.mode].length; 
        baseN = aNote.midi %12; 
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
        var i, found, len, n; 
        found = -1; 
        len = this.notes.length(); 
        for (i=0; i<len; i=i+1) {
            n = this.notes.nth(i); 
            if ((found==-1)&&(n.midi>=aNote.midi)) {
                found = i; 
            }
        }
        if (found!=-1) { 
            n = this.notes.nth(found+steps);
            res.midi = n.midi;
        }
        return res; 
    },


    // this is silly. use JSON.
    report: function() { 
        console.log("<exKey>"); 
        console.log("</exKey>"); 
    },


    // use this to add a control to an HTML doc
    getHTMLForModeControl: function(tag) { 
        this.HTMLTag = tag; 
        var res = "Fundamental / Octave / Mode:";
        res = res + "<select id='exKeyFun"+tag+"'>";
        res = res + " <option value='0' selected>C</option>";
        res = res + " <option value='1'>C#</option>";
        res = res + " <option value='2'>D</option>";
        res = res + " <option value='3'>D#</option>";
        res = res + " <option value='4'>E</option>";
        res = res + " <option value='5'>F</option>";
        res = res + " <option value='6'>F#</option>";
        res = res + " <option value='7'>G</option>";
        res = res + " <option value='8'>G#</option>";
        res = res + " <option value='9'>A</option>";
        res = res + " <option value='10'>A#</option>";
        res = res + " <option value='11'>B</option>";
        res = res + "</select>";
        res = res + "<select id='exKeyOct"+tag+"'>";
        res = res + " <option value='36'>2</option>";
        res = res + " <option value='48'>3</option>";
        res = res + " <option value='60' selected>4</option>";
        res = res + " <option value='72'>5</option>";
        res = res + "</select>";
        res = res + "<select id='exKeyMode" + tag +"'>";
        res = res + " <option value='0' selected>Major</option>";
        res = res + " <option value='1'>Minor</option>";
        res = res + " <option value='2'>Dorian</option>";
        res = res + " <option value='3'>Whole</option>";
        res = res + " <option value='4'>Hungarian</option>";
        res = res + " <option value='5'>Chinese</option>";
        res = res + " <option value='6'>Javan</option>";
        res = res + " <option value='7'>M Pentatonic</option>";
        res = res + " <option value='8'>m Pentatonic</option>";
        res = res + " <option value='9'>Blues</option>";
        res = res + " <option value='10'>Aolian</option>";
        res = res + " <option value='11'>Chromatic</option>"; // seriously? kinda moots key.
        res = res + "</select><button onclick='setParameters();'' href='javascript:;''>Go</button>";
        return res; 
    },


    setModeFromHTMLControl: function(doc) {
        var tag, fun, oct; 
        fun = 0; oct = 48; this.mode = 0; // defaults in case of error
        tag = "exKeyFun"+ this.HTMLTag;
        fun = parseInt(doc.getElementById(tag).value); 
        tag = "exKeyOct"+ this.HTMLTag;
        oct = parseInt(doc.getElementById(tag).value); 
        this.tonic = oct+fun;
        tag = "exKeyMode"+ this.HTMLTag;
        this.mode = parseInt(doc.getElementById(tag).value); 
        this.recalculate();  
    },
    
    getNumberChord: function(nm) { 
		// given the number, return a nl with the given num chord
		// 1 convert number to int-1
		// count that many steps up the scale
		// give that note, skip up the next two, next 4
	}
}



///////////////////////////////////////// chord
///////////////////////////////////////// chord
///////////////////////////////////////// chord
///////////////////////////////////////// chord
///////////////////////////////////////// chord
// chords produce noteLists using a tonic, mode, and a name. 

/*  chord naming 
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

Numbered chords are defined wrt M/m chords of a tonic that is usually not in the chord
For instance, for CM: 	
#	chord	notes	semitones (up from tonic)	worry about going up too much? 
I	CM		C-E-G	0,4,7						0,4,7
II	Dm		DFA		2,5,9 ((0,3,7)+2)			-3,2,5
III Em		Eetc	4,7,11						-1,4,7
IV  FM		F		5,9,12						-3,0,5
V   GM		G		7,11,14						-1,2,7
VI  Am		A		9,12,16	((0,4,8)+9)			-3,0,4
VII Bo7		B		11,14,17,20	 ((0,3,6,9)+11)	-1,2,5,8
*/

function exChord() { 
    this.namedChord = '-'; // index into named chords, or -1
    this.tonic = 60; // midi of base note for chords-- octave matters a lot!
    
    this.numberedChord = -1;   // index into numberNames, or -1
    this.mode = 0; // need an exKey to make numbered chords: tonic and mode. 

    this.notes = new exNoteList(); 

    this.namedChords = { 
        '-': [0,4,7],
        'M': [0,4,7],
        'm': [0,3,7],
        '+': [0,4,8], 'o': [0,3,6], 'M6': [0,4,7,9], 'm6': [0,3,7,9],
        '7': [0,4,7,10], 'M7': [0,4,7,11], 'm7': [0,3,7,10], '+7': [0,4,8,10], 
        'o7': [0,3,6,9], '0': [0,3,6,10], '07': [0,3,6,10],
        'mM7': [0,3,7,11], '+M7': [0,4,8,11], '7+5': [0,4,6,10], 
        'M9': [0,4,7,11,14], '9': [0,4,7,10,14], 'mM9': [0,3,7,11,14],
        '-M9': [0,3,7,11,14], 'm9': [0,3,7,10,14], '-9': [0,3,7,10,14], 
        '+M9': [0,4,8,11,14], '+9': [0,4,8,10,14],
        '09': [0,3,6,10,14], '0f9': [0,3,6,10,13], 'o9': [0,3,6,9,14], 
        'of9': [0,3,6,9,13], '11': [0,4,7,10,14,17],
        'M11': [0,4,7,11,14,17], 'mM11': [0,3,7,11,14,17], 
        '-M11': [0,3,7,11,14,17], 'm11': [0,3,7,10,14,17],
        '-11': [0,3,7,10,14,17], '+M11': [0,4,8,11,14,17], 
        '+11': [0,4,8,10,14,17], '011': [0,3,6,10,13,17], 'o11': [0,3,6,9,13,16],
        'M13': [0,4,7,11,14,17,21], '13': [0,4,7,10,14,17,21], 
        'mM13': [0,3,7,11,14,17,21], '-M13': [0,3,7,11,14,17,21],
        'm13': [0,3,7,11,14,17,21], '-13': [0,3,7,10,14,17,21], 
        '+M13': [0,4,8,11,14,17,21], '013': [0,3,6,10,14,17,21],
        'I': [0,4,7], 'II':[2,5,9], 'III':[4,7,11], 'IV':[5,9,12], 
        'V':[7,11,14],'VI':[9,13,17],'VII':[11,14,17],
    };
	// numbered chords happen wrt keys,
	// but they're also all in Major or minor, so the intervals are simple
    this.available = ['-', 'M', 'm', '+', 'o', 'M6', 'm6',
        '7', 'M7', 'm7', '+7', 'o7', '0', '07', 'mM7', '+M7', '7+5', 
        'M9', '9', 'mM9', '-M9', 'm9', '-9', '+M9', '+9', '09', '0f9', 'o9', 'of9', 
        '11', 'M11', 'mM11', '-M11', 'm11', '-11', '+M11', '+11', '011', 'o11',
        'M13', '13', 'mM13', '-M13', 'm13', '-13', '+M13', '013',
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII']; 
        
    this.guitarChords = [
	        [ ['C',-1,2,1,0,1,0],     ['C',3,3,2,0,1,0],      ['Cm',-1,3,5,5,4,3],    ['C6',-1,0,2,2,1,3], 
	          ['C7',0,3,2,3,1,0],     ['C9',-1,3,2,3,3,3],    ['Cm6',-1,-1,1,2,1,3],  ['Cm7',-1,-1,1,3,1,3], 
	          ['CM7',-1,3,2,0,0,0],   ['Co',-1,-1,1,2,1,2],   ['C+',-1,-1,2,1,1,0],   ['Csus',-1,-1,3,0,1,3], 
	        ], [ 
	          ['C#b',-1,-1,3,1,2,1],  ['C#m',-1,-1,2,1,2,0],  ['C#6',-1,-1,3,3,2,4],  ['C#7',-1,-1,3,4,2,4],
	          ['C#9',-1,4,3,4,4,4],   ['C#m6',-1,-1,2,3,2,4], ['C#m7',-1,-1,2,4,2,4], ['C#M7',-1,4,3,1,1,1],
	          ['C#o',-1,-1,2,3,2,3],  ['C#+',-1,-1,3,2,2,1],  ['C#sus',-1,-1,3,3,4,1],
	        ],[
	          ['D',-1,-1,0,2,3,2],    ['Dm',-1,-1,0,2,3,1],  ['D6',-1,0,0,2,0,2],    ['D7',-1,-1,0,2,1,2], 
	          ['D9',2,0,0,2,1,0],     ['Dm6',-1,-1,0,2,0,1], ['Dm7',-1,-1,0,2,1,1],  ['DM7',-1,-1,0,2,2,2], 
	          ['Do',-1,-1,0,1,0,1],   ['D+',-1,-1,0,3,3,2],  ['Dsus',-1,-1,0,2,3,3],  
	        ],[
	          ['D#',-1,-1,3,1,2,1],    ['D#m',-1,-1,4,3,4,2],  ['D#6',-1,-1,1,3,1,3],   ['D#7',-1,-1,1,3,2,3], 
	          ['D#9',1,1,1,3,2,1],     ['D#m6',-1,-1,1,3,1,2], ['D#m7',-1,-1,1,3,2,2], ['D#M7',-1,-1,1,3,3,3], 
		      ['D#o',-1,-1,1,2,1,2],   ['D#+',-1,-1,1,0,0,3],  ['D#sus',-1,-1,1,3,4,4], 
	        ],[
		        ['E',0,2,2,1,0,0],    ['Em',0,2,2,0,0,0],   ['E6',0,2,2,1,2,0],   ['E7',0,2,2,1,3,0], 
	    	    ['E9',0,2,0,1,0,2],   ['Em6',0,2,2,0,2,0],  ['Em7',0,2,0,0,0,0],  ['EM7',0,2,1,1,0,-1], 
	        	['Eo',-1,-1,2,3,2,3], ['E+',-1,-1,2,1,1,0], ['Esus',0,2,2,2,0,0],
	        ],[
		        ['F',1,3,3,2,1,1],    ['Fm',1,3,3,1,1,1],    ['F6',-1,-1,0,2,1,1], ['F7',1,3,1,2,1,1], 
		        ['F9',-1,-1,3,2,4,3], ['Fm6',-1,-1,0,1,1,1], ['Fm7',1,3,1,1,1,1],  ['FM7',-1,-1,3,2,1,0], 
	    	    ['Fo',-1,-1,0,1,0,1], ['F+',-1,-1,3,2,2,1],  ['Fsus',-1,-1,3,3,1,1],  
	        ],[
		        ['F#',2,4,4,3,2,2],    ['F#m',2,4,4,2,2,2],    ['F#6',-1,4,4,3,4,-1],  ['F#7',-1,-1,4,3,2,0], 
		        ['F#9',-1,-1,2,1,4,3], ['F#m6',-1,-1,1,2,2,2], ['F#m7',-1,-1,2,2,2,2], ['F#M7',-1,-1,4,3,2,1], 
	    	    ['F#o',-1,-1,1,2,1,2], ['F#+',-1,-1,4,3,3,2],  ['F#sus',-1,-1,4,4,2,2],  
	        ],[
		        ['G',3,2,0,0,0,3],    ['Gm',3,5,5,3,3,3],     ['G6',3,2,0,0,0,0],    ['G7',3,2,0,0,0,1],
		        ['G9',3,0,0,2,0,1],   ['Gm6',-1,-1,2,3,3,3],  ['Gm7',3,5,3,3,3,3],   ['GM7',-1,-1,5,4,3,2],
		        ['Go',-1,-1,2,3,2,3], ['G+',-1,-1,1,0,0,3],   ['Gsus',-1,-1,0,0,1,3], 
	        ],[
		        ['G#',4,6,6,5,4,4],    ['G#m',4,6,6,4,4,4],    ['G#6',4,3,1,1,1,1],    ['G#7',-1,-1,1,1,1,2],
		        ['G#9',-1,-1,1,3,1,2], ['G#m6',-1,-1,3,4,4,4], ['G#m7',-1,-1,1,1,0,2], ['G#M7',-1,-1,1,1,1,3],
		        ['G#o',-1,-1,0,1,0,1], ['G#+',-1,-1,2,1,1,0],  ['G#sus',-1,-1,1,1,2,4], 
	        ],[
		        ['A',-1,0,2,2,2,0],   ['Am',-1,0,2,2,1,0], ['A6',-1,0,2,2,2,2],   ['A7',-1,0,2,2,2,3], 
		        ['A9',-1,0,2,4,2,3],  ['Am6',0,0,2,2,1,2], ['Am7',-1,0,2,1,2,0],  ['AM7',-1,0,2,1,2,0], 
		        ['Ao',-1,-1,1,2,1,2], ['A+',-1,0,3,2,2,1], ['Asus',-1,-1,2,2,3,0], 
	        ],[
		        ['A#',-1,1,3,3,3,1],   ['A#m',-1,1,3,3,2,1],   ['A#6',1,1,3,3,3,3],    ['A#7',-1,-1,3,3,3,4], 
		        ['A#9',1,1,3,1,1,1],   ['A#m6',-1,-1,3,3,2,3], ['A#m7',-1,-1,3,3,2,4], ['A#M7',-1,1,3,2,3,-1], 
		        ['A#o',-1,-1,2,3,2,3], ['A#+',-1,-1,0,3,3,2],  ['A#sus',-1,-1,3,3,4,1], 
	        ],[
		        ['B',-1,2,4,4,4,2],   ['Bm',-1,2,4,4,3,2],    ['B6',2,2,4,4,4,4],    ['B7',0,2,1,2,0,2], 
		        ['B9',-1,2,1,2,2,2],  ['Bm6',-1,-1,5,5,4,5],  ['Bm7',-1,2,4,2,3,2],  ['BM7',-1,2,4,3,4,-1], 
		        ['Bo',-1,-1,0,1,0,1], ['B+',-1,-1,5,4,4,3],   ['Bsus',-1,-1,4,4,5,2], 
	        ]
        ];     
        
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
        for (i=1; i<ln; i=i+1) {
            this.notes.addNew(this.tonic + base[i], 0.0); 
        }
    },


    /**
      * Changes the note upon which the chord is built
      * @function
      * @param {int} tonic - midi tone value for the new tonic for the chord
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
        this.namedChord = nm; 
        this.recalculate();
    },
    
 
    getNamedChordSpacings: function(nm) {
		switch (nm) { 
			case '-': 	return [0,4,7]; break; 
			case 'M': 	return [0,4,7]; break;
			case 'm': 	return [0,3,7]; break; 
			case '+': 	return [0,4,8]; break; 
			case 'o': 	return [0,3,6]; break; 
			case 'M6': 	return [0,4,7,9]; break; 
			case 'm6': 	return [0,3,7,9]; break; 
			case '7': 	return [0,4,7,10]; break; 
			case 'M7': 	return [0,4,7,11]; break; 
			case 'm7': 	return [0,3,7,10]; break; 
			case '+7': 	return [0,4,8,10]; break; 
			case 'o7': 	return [0,3,6,9]; break; 
			case '0': 	return [0,3,6,10]; break; 
			case '07': 	return [0,3,6,10]; break; 
			case 'mM7': return [0,3,7,11]; break; 
			case '+M7': return [0,4,8,11]; break; 
			case '7+5': return [0,4,6,10]; break; 
			case 'I': 	return [0,4,7]; break; 
			case 'II':	return [2,5,9]; break; 
			case 'III':	return [4,7,11]; break; 
			case 'IV':	return [5,9,12]; break; 
			case 'V':	return [7,11,14]; break; 
			case 'VI':	return [9,13,17]; break; 
			case 'VII':	return [11,14,17]; break; 
			case 'M9': 	return [0,4,7,11,14]; break; 
			case '9': 	return [0,4,7,10,14]; break; 
			case 'mM9': return [0,3,7,11,14]; break; 
			case '-M9': return [0,3,7,11,14]; break; 
			case 'm9': 	return [0,3,7,10,14]; break; 
			case '-9': 	return [0,3,7,10,14]; break; 
			case '+M9': return [0,4,8,11,14]; break; 
			case '+9': 	return [0,4,8,10,14]; break; 
			case '09': 	return [0,3,6,10,14]; break; 
			case '0f9': return [0,3,6,10,13]; break; 
			case 'o9': 	return [0,3,6,9,14]; break; 
			case 'of9': return [0,3,6,9,13]; break; 
			case '11': 	return [0,4,7,10,14,17]; break; 
			case 'M11': return [0,4,7,11,14,17]; break; 
			case 'mM11': return [0,3,7,11,14,17]; break; 
			case '-M11': return [0,3,7,11,14,17]; break; 
			case 'm11': return [0,3,7,10,14,17]; break; 
			case '-11': return [0,3,7,10,14,17]; break; 
			case '+M11': return [0,4,8,11,14,17]; break; 
			case '+11': return [0,4,8,10,14,17]; break; 
			case '011': return [0,3,6,10,13,17]; break; 
			case 'o11': return [0,3,6,9,13,16]; break; 
			case 'M13': return [0,4,7,11,14,17,21]; break; 
			case '13': 	return [0,4,7,10,14,17,21]; break; 
			case 'mM13': return [0,3,7,11,14,17,21]; break; 
			case '-M13': return [0,3,7,11,14,17,21]; break; 
			case 'm13': return [0,3,7,11,14,17,21]; break; 
			case '-13': return [0,3,7,10,14,17,21]; break; 
			case '+M13': return [0,4,8,11,14,17,21]; break; 
			case '013': return [0,3,6,10,14,17,21]; break; 
			case 'I': 	return [0,4,7]; break; 
			case 'II':	return [2,5,9]; break; 
			case 'III':	return [4,7,11]; break; 
			case 'IV':	return [5,9,12]; break; 
			case 'V':	return [7,11,14]; break; 
			case 'VI':	return [9,13,17]; break; 
			case 'VII':	return [11,14,17]; break; 
		}
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


    // inversions: add or subtract 12 from nth note
    // rolling: make all notes within 12 of a tone
    roll: function(center) { 
	},
    
    
    
    // report, test
	// matching: given a nl, give matching chord


}
///////////////////////////////////////// tuned hand
///////////////////////////////////////// tuned hand
///////////////////////////////////////// tuned hand
///////////////////////////////////////// tuned hand
///////////////////////////////////////// tuned hand
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
   

exTunedHand.prototype = { 
    copy: function(it) { 
        this.hand = it.hand; 
        this.across = it.across;
        this.acrossBase = it.acrossBase;
        this.setToTuning(it.tuning); 
    },


    setToTuning: function(which) { 
        this.tuning =which; 
        if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
        if (which==1) { this.strings = [38,45,50,54,57,62]; } // open D    d2 a2 d3 f#3 a3 d4
        if (which==2) { this.strings = [48,52,55,60,64,67]; } // open C    c3 e3 g3 c4 e4 g4
        if (which==3) { this.strings = [40,45,50,54,59,64]; } // don't remember! low!
        // the one for el noy, the one for passemezze
        if (which==10) { this.strings = [67,60,64,69]; } // uke    g4 c4 e4 a4
        if (which==11) { this.strings = [55,62,69,76]; } // violin   g3,d4,a4,e5
        if (which==12) { this.strings = [55,62,69,76]; } // mandolin   as violin
        if (which==13) { this.strings = [67,50,55,59,62]; } // banjo   g4,d3,g3,b3,d4
        if (which==14) { this.strings = [36,43,50,57]; } // cello   c2,g2,d3,a3
        // Bazooki? Udtz? Samisan? Sitar?!
        this.strCount = this.strings.length; 
    },


    setHandPlace: function(place) { 
        this.hand = place; 
        this.across = 0; 
    },


    setBarre: function(place, lowest) { 
        this.hand = place; 
        this.across = place; 
        this.acrossBase = lowest; // the lowest string your finger's across. 
    },


    setAvailable: function(keyOrChord) { 
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
    },

    // given a note, set its fret and string
    setANote: function(aNote) { 
        var i, min, minStr, dif; 
        min = 9999; 
        minStr = -1; 
        for (i=0; i<this.strCount; i=i+1) { 
            dif = aNote.midi - this.strings[i]; 
            if ((dif>=0) && (dif<min)) { 
                min = dif; 
                minStr = i; 
            }
        }
        aNote.string = minStr; 
        aNote.fret = min; 
    }
}


///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// the circle of fifths. IDK, something. stash utilities here. 

function exCircle() { 
    // going clockwise!
    //          0  1  2   3  4  5   6  7  8   9  10  11
    this.c5 = [ 0, 7, 2,  9, 4, 11, 6, 1, 8,  3, 10, 5 ];

    // the place of each entry in nts
    //    x = this.c5[this.place[x]]
    // this.place=[ 0, 7, 2,  9, 4, 11, 6, 1, 8, 3, 10, 5 ]; 
    // Did not see that coming!
}

// go n steps around, clockwise, up to +/-24 steps
// the intention is to go around <12 steps. 
// if you do more, god help you cause I'm bored. 
exCircle.prototype = {  // seems like these should all be external-- stateless?

    around: function(inp, n) { 
        var inOct = inp%12; 
        var oct = inp-inOct; 
        var inPlace = this.c5[inOct];
        // inplace is where note inp is on the c5ths
        // now, go around. 
        newPlace = (inPlace+n)%12;
        if (newPlace<0) { newPlace+=12; } // op order? 
        return this.c5[newPlace] +oct;
    },

    opposite: function(n) { 
        return this.around(n,6); 
    },

    minorEquivalent: function(inp) { 
        return this.around(n,3); 
    }
}





///////////////////////////////////////// deck
///////////////////////////////////////// deck
///////////////////////////////////////// deck
///////////////////////////////////////// deck
///////////////////////////////////////// deck
// the exDeck class provides controlled randomness. 
// use .seed to set yourself up for a specific sequence of shuffled numbers. 
// use .next to step through them; it returns a number, 0-255-- each one in 
// the same order, every time. 

// I used .generate to make the standard value for this.ns
// But only the one time. That way, you can get the same random composition
// many times. 

// yes, I'm sure many JS implementations use identical pseudorandom generators.

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
    this.HTMLTag = "XX";
}

exDeck.prototype = {
    copy: function(it) { 
        this.place = it.place; // everything else should be a class constant. better idiom?  
    },

    seed: function(which) { 
        this.place = which % this.sz; 
    },

    nextI: function() { 
        var res = this.ns[this.place];
        this.place = this.place +1; 
        if (this.place>=this.sz) { 
            this.place = 0; 
        }
        return res; 
    },

    nextF: function() {
        var res = this.factor;
        res *= this.nextI(); 
        return res; 
    },

    // for use with deck
    getHTMLForSeed: function(tag) { 
        this.HTMLTag = tag; 
        var res = "<select id='exDeckHi"+tag+"'>";
        res = res + "<option value='0'>0</option>";
        res = res + "<option value='1'>1</option>";
        res = res + "<option value='2'>2</option>";
        res = res + "<option value='3'>3</option>";
        res = res + "<option value='4'>4</option>";
        res = res + "<option value='5'>5</option>";
        res = res + "<option value='6'>6</option>";
        res = res + "<option value='7' selected>7</option>";
        res = res + "<option value='8'>8</option>";
        res = res + "<option value='9'>9</option>";
        res = res + "<option value='10'>10</option>";
        res = res + "<option value='11'>11</option>";
        res = res + "<option value='12'>12</option>";
        res = res + "<option value='13'>13</option>";
        res = res + "<option value='14'>14</option>";
        res = res + "<option value='15'>15</option>";
        res = res + "</select>.";
        res = res + "<select id='exDeckLo"+tag+"'>";
        res = res + "<option value='0'>0</option>";
        res = res + "<option value='1'>1</option>";
        res = res + "<option value='2'>2</option>";
        res = res + "<option value='3'>3</option>";
        res = res + "<option value='4'>4</option>";
        res = res + "<option value='5' selected>5</option>";
        res = res + "<option value='6'>6</option>";
        res = res + "<option value='7'>7</option>";
        res = res + "<option value='8'>8</option>";
        res = res + "<option value='9'>9</option>";
        res = res + "<option value='10'>10</option>";
        res = res + "<option value='11'>11</option>";
        res = res + "<option value='12'>12</option>";
        res = res + "<option value='13'>13</option>";
        res = res + "<option value='14'>14</option>";
        res = res + "<option value='15'>15</option>";
        res = res + "</select>.";
        return res; 
    },
    getValueForSeed: function() {
        var tag, exHi, exLo, res; 
        tag = "exDeckHi" + this.HTMLTag;
        res = 0; // this is not good error-checking...
        exHi = parseInt(document.getElementById(tag).value); 
        tag = "exDeckLo" + this.HTMLTag;
        exLo = parseInt(document.getElementById(tag).value); 
        res = exHi * 16 + exLo; 
        return res; 
    },

    /* Maybe 256 won't be enough.. keep this around. 
    exDeck.prototype.generate: function(size) { 
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
}

////////////////////////////////////////////////// 
////////////////////////////////////////////////// exMetronome
////////////////////////////////////////////////// 
////////////////////////////////////////////////// 

// it's a metronome, b/c it tracks beats and measures. 
// set t and dt; calls to "update" add dt to t. 
// various statistics are maintained
// didCrossBeat and dcMeasure become briefly true when that happens, 
// and beatFraction and measureFraction go from 1->0 and then sawtooth back up. 
// also lets you compute t for beat and measure starts. 

function exMetronome(msPerUpdate, bpMin, bpMeas, measCt) { 
    this.t = 0.0;
    this.dt = msPerUpdate / 1000.0; 
    
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
    this.workFraction = this.t/this.workDuration; 
}


exMetronome.prototype = {
    copy: function (it) {  
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
    },


    restart: function() { 
        this.t = 0.0;
        this.measureCount = 0; 
        this.lastMeasureTime = 0.0; 
        this.lastBeatTime = 0.0; 
        this.recalculate(); 
    },

    // returns void; use didCross to get stuff
    recalculate: function() {
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
    },


    update: function() { 
        this.t += this.dt; 
        this.recalculate(); 
    },

    // the point of lines is, not everything happens on THE beat. 
    timeOfNthBeat: function(n) { 
        return this.beatInterval * Math.floor(n); 
    },

    beatForTime: function(t) { 
        return Math.floor(t/this.beatInterval);
    },

    timeOfNthMeasure: function(n) { 
        return this.measureInterval * Math.floor(n); 
    },

    measureForTime: function(t) { 
        return Math.floor(t/this.measureInterval);
    },

    measureOfNthBeat: function(n) { 
        return Math.floor(n/this.beatsPerMeasure); 
    },

    beatOfNthMeasure: function(n) { 
        return Math.floor(b/this.beatsPerMeasure); 
    }
};





///////////////////////////////////////// line
///////////////////////////////////////// line
///////////////////////////////////////// line
///////////////////////////////////////// line
///////////////////////////////////////// line
/////////////////  exLine excapsulates a repeated bit of drumming. 
///////////////// one or more lines make a rhythm. 

// the timer object is the home of the tempo-- the beats per second. 
// it also has a "measure" length, but lines and rhythms ignore it. 
// lines do not use the timer?
// rhythms do. there is only one tempo; you have to share it.

// lines contain dealings of notes onto hits. this is a second list, 
// same length as first, of random numbers, that place chord notes onto hits. 

// if there IS no timer, then the concept of measure lives here.

function exLine() {
    // how many beats of the timer per rep 
    this.beatCount = 4; 
    this.strikes = [1, 0, 0, 0]; // which beats to use, an array of 0's and 1's

    this.reps = 64;
    this.beatsPerSecond = 120; 
}

exLine.prototype = {

    copy: function(it) { 
        this.beatCount = it.beatCount; 
        this.strikes = [];
        for (var i=0; i<it.beatCount; i=i+i) {
            this.strikes[i] = it.strikes[i];
        }
        this.reps = it.reps;
        this.beatsPerSecond = it.beatsPerSecond; 
    },

    secondsPerBeat: function() { 
        var res = 1.0; 
        if (this.beatsPerSecond>0) { 
            res = (1.0 / this.beatsPerSecond); 
        } 
        return res; 
    },

    secondsPerLoop: function() { 
        return this.beatCount * this.secondsPerBeat(); 
    },

    secondsPerPlay: function() { 
        return this.reps * this.secondsPerLoop(); 
    },

    // set from array of 0's and 1's
    setFromArray: function(list) {
        this.beatCount = list.length; 
        this.strikes = list; 
    },

    // set from a string containing # in base-16
    setFromHex: function(str) {
    },

    // return a notelist with one note per strike
    generateNotes: function() {
    },

/*
    generateEventsForTimes: function(timer, t0, t1, lineTag) { 
        var btIntrv, myIntrv, lastT, endNotCrossed; 
        var lastT, nextT, interIntrv, thisT, intervStartT, i, n;
        this.currentBeats = []; 

        btIntrv = timer.beatInterval; 
        myIntrv = this.beatCount * btIntrv;
        thisMeas = Math.floor(t0/myInterv);  
        measStartT = thisMeas * myIntrv; 
        myBeatIntrv = (btIntrv * this.beatCount)/this.beatCount; 
        endNotCrossed = 0; 
        
        n = 0; 

        while (endNotCrossed==0) { 
            intervStartT = measStartT + (n*myIntrv);     
            for (i=0; i<this.beatCount; i=i+1) { 
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
    },
*/

    // remove percent of the used beats
    thin: function(deck, percent) { 
        var i; 
        for (i=0; i<this.beatCount; i=i+1) {
            if (this.strikes[i] == 1) { 
                if (deck.nextF()<percent) {
                    this.strikes[i] =0; 
                }
            }
        }
    },

    // set percent of the used beats
    thicken: function(deck, percent) { 
        var i; 
        for (i=0; i<this.beatCount; i=i+1) {
            if (this.strikes[i] == 0) { 
                if (deck.nextF()<percent) {
                    this.strikes[i] =1; 
                }
            }
        }
    },

    reverse: function() { 
        var i, s, ct, j;
        ct = Math.floor(this.beatCount/2.0); 
        for (i=0; i<ct; i=i+1) {
            j = this.beatCount - i; 
            s = this.strikes[i]; 
            this.strikes[i] = this.strikes[j]; 
            this.strikes[j] = s; 
        }
    },

    // n times as long, repeating
    multiply: function(n) {
        var i, ct;
        var newList = []; 
        ct = Math.floor(this.beatCount*n);  
        j= 0; 
        for (i=0; i<ct; i=i+1) {
            newList.push(this.strikes[j]);
            j=j+1;   
            if (j>=this.beatCount) { j=0; }
        }
    },



    // removes one event 
    removeNth: function(n) { 
        if (n<this.beatCount) { this.strikes[n] = 0; }
    },

    // strikes<=n ==1, 0 ow
    setToFirstN: function(n) { 
        var i, ct;
        var newList = []; 
        ct = Math.floor(this.beatCount*n);  
        j= 0; 
        for (i=0; i<ct; i=i+1) {
            newList.push(this.strikes[j]);
            j=j+1;   
            if (j>=this.beatCount) { j=0; }
        }
    },

    // repeat an a+1-length pattern, 1,0,0,..
    setToEveryN: function(n, skipfirst) { 
        var i, j; 
        for (i=0; i<this.beatCount; i=i+1) { 
            if (i%n==skipfirst) { 
                this.strikes[i] = 1; 
            } else {
                this.strikes[i] = 0; 
            }
        }
    },

    // n 0's 
    setToEmptyLength: function(n) { 
        var i; 
        this.strikes = []; 
        for (i=0; i<n; ++i) {
            this.strikes.push(0); 
        }
    },

    // for each, p% chance of being a 1
    randomize: function(density) {
        var i, q;
        for (i=0; i<this.beatCount; i=i+1) {
            if (deck.nextF()<density) { this.strikes[i] = 1; }
        }
    },


    rotate: function(n) {
        var i, j, newStr; 
        newStr = []; 
        for (i=0; i<this.beatCount; i=i+1) {
            j = (i+n)%this.beatCount;
            newStr[j] = this.strikes[i];
        }
        this.strikes = newStr; 
    }
}












