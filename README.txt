
exMusicBase is how I am teaching myself JavaScript library-writing and musical composition. And git, too. 

I play classical guitar. My goal for this library is to be able to generate
little works that I can play. I also wish to improve my sight-reading. 

Demonstrations of how to use the library are in the directories "studies" and "tests".

Help yourself. Let me know if you find a use for it, OK? : )


------------------------
Design notes:


0) The library comes in 3 parts. "exMusic.js" contains classes for manipulating notes, "exDisplay.js" has classes for displaying them (generally in web pages). "exTiles.png" holds the graphics used by exDisplay. exDisplay requires exMusic. 

1) I'm working in Safari. All the tests work in Chrome and Firefox as of Dec 12, 2016.

2) The operations are notelist-based; notelists are the common currency. Everything that makes more than one note, makes a notelist. Other objects wrap and extend the notelist; they contain a noteList named “notes”.

3) Notes contain a ".midi", which is an integer (usually) that specifies tone frequency: middle-C is 60, 12 notes/octave, lower notes give lower tones. Notes contain a "t" that is just seconds since the start of the work. 

4) Operations in the service of composition are like string manipulation. Pattern matching, pattern enforcement, concatenation, superimposition. One way to interesting composition could be: of starting with simple patterns, mixing them, combining them, and gradually imposing greater and greater order upon them.
  There will be infinitely many effective composition methods, so they should not be part of the core class set. 

  To make a composition: Make a key, make a tunedHand, make some lines, 2 or 3, make a few motifs, throw them in, sort in time... or! Use the motifs to make notelists, combine the noteLists, use the tunedHand to ensure playability. or! Make a key, make tuned hand, make several lines, use the tuned hand to cast notes into the lines-> motifs, etc!

5) The motif will be a basis for composition. It is a notelist, generated from a key or chord, and a “exLine”, which provides time patterns (rhythms) and maps key/chords onto time. 

6) The tunedHand represents a stringed instrument. It gives a set of strings with a tuning, and maps notes onto the instrument. Keys/chords/motifs generate notes, tunedHands filter them, in a way. 

7) Cutting the library into multiple parts adds a preprocessing step that is not pure JS? 
	I don't want to bind the project to more tools than needed. 
	I am not a partisan of anything but .js and .html-- I'm sure that grunt is awesome and you need it; I don't. 

8) Multiple output/presentation methods. 
	1) using exTabText, which takes a notelist and makes a string in its ".grid"; put that in an HTML <pre>
	2) using exSpriteClef or exSpriteTab; draw to a canvas with graphics from sprite sheets. 
	3) sound output, using MIDI or other. 

	All of these methods can be/have been animated to various effects. Display of music is not composition.

9) The "tests" folder will contain examples of library use in various modes as I get them all working together. If your browser can display all the tests, you know that exMusic works in your browser. The tests should use screen grabs from my working tests!

10) I've been dinking with this stuff since the 90's; this project combines many abandoned projects. Organizaion in progress. 

11) The "sources" folder contains source material for musical constants. 


Implementation plan/ to do 

	exMetronome: why are you so busted?
	exMotif: make things, rather than things for making things!
    exChord
    exChordShapes



Earlier considerations: 

How to compose with short inputs and randomness: ???

Music is sound structured like language. Music uses many patterns. The patterns reduce the number of choices, but not so much that there are not too many choices. Like language!

Music has structure that is not exposed except over time. The structures I am aware of seem pretty trivial: interpolation, alternation, arithmetic progression. So I can get good results soon? Hah. 


Music Theory Choices: 

Key, mode, and rhythm are the first reductions. Key changes for melodies are a way to transform a set of frequency relationships and preserve their important relationships. We have all waited through a composer fluffing out a work with a tedious set of chord changes. Ok, enable that. 

Lines are repeating rhythmic fragments; no tone assignments, just timing. One line is never enough. 

Shuffles are meant to map chord notes to line events in a controllably random way. 

Key, chord, line, and shuffle combine to generate a set of notes. A single motif will not be interesting enough to be a composition, but interesting music seems available through manipulating this structure. 

A song object is essentially a list of notes, which are arrays; each note has at least a midi value and a time (in seconds). Other values could be standardized later? But it would be good for some tools to be able to examine and change notes without dealing with why they are in the work. 



Presentation and playback objects

The metronome object encapsulates beat and measure. Other objects respond with event lists, given a time range; Metronome knows what time it is now. 

The deck object is a pseudorandom number generator. Compositions using the deck will be able to randomly produce the same effect over and over. The deck literally contians the pseudorandom number list; to do otherwise would invite dependence on JS doing math in particular ways. 




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

I really like the idea of a set of compositions consisting only of events distributed
over 256 beats. It seems... tractable! 








