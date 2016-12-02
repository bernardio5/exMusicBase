
exMusicBase is how I am teaching myself JavaScript library-writing and musical composition. And git, too. 

I play classical guitar. My goal for this library is to be able to generate
little works that I can play. I also wish to improve my sight-reading. 

I am not a trained musician. 


For help on how to use the library, I intend to post a set of web pages in the 
“tests” directory. 

Help yourself. Let me know if you find a use for it, OK? : )


------

Design notes

0) I'm working in Safari. I am not humoring Chrome or IE. I'll get to firefox. 

1) it should be notelist-based; notelists are the glue 

2) everything that makes more than one note, makes a notelist. the object wraps and extends the notelist. The noteList is named “notes”.
	Key is set, then recalculates its nl
	Chord is set; recalculates
	TunedHand is set, recalculates

3) Operations in the service of composition are like string manipulation.
	pattern matching, pattern enforcement, concatenation, superimposition. 

4) I guess that one way to interesting composition could be: of starting with simple patterns, mixing them, combining them, and gradually imposing greater and greater order upon them 

5) You'll want to try all kinds of composition methods, so they should not be part of the core class set. 

6) The motif will be a basis for composition. It is a notelist, generated from a key or chord, and a “exLine”, which provides time patterns (rhythms) and maps key/chords onto time. 

7) The tunedHand represents a stringed instrument. It gives a set of strings with a tuning, and maps notes onto the instrument. Keys/chords/motifs generate notes, tunedHands filter them, in a way. 

8) cutting the library into multiple parts adds a preprocessing step that is not pure JS? 
	I don't want to bind the project to more tools than needed. 
	I am not a partisan of anything but .js and .html-- I'm sure that grunt is awesome and you need it; I don't. 
	All the contents of the ".js" folder will be merged into the main exMusic.js-- following the example of jQuery

9) multiple output/presentation methods. 
	1) using exTabText, which takes a notelist and makes a string in its ".grid"; put that in an HTML <pre>
	2) using exSpriteClef or exSpriteTab; draw to a canvas with graphics from sprite sheets. 
	3) sound output, using MIDI or other. 

	all of these methods can be/have been animated to various effects. 

10) the "tests" folder will contain examples of library use in various modes as I get them all working together. The index page will link to the tests after they work. 

11) I've been dinking with this stuff since the 90's; this project combines many abandoned projects. Organizaion in progress. 

12) The "sources" folder contains source material for constants. 

13) _JavaScript: the good parts_ is a good guide, but I don't approve of modifying base objects. 



To make a composition

Make a key
make a tunedHand
make some lines, 2 or 3
make a few motifs, 

use the motifs to make notelists -- ?
concatenate the noteLists
use the tunedHand to ensure playability. 
display


To make a comosition

make a key
make tuned hand
make several lines
use the tuned hand to cast notes into the lines-> motifs
give the motifs to a playbacker-> noteList
display


Implementation plan/ to do 

Don't try to get it all working at once, of course. 

1) Reduce duplication from "toMerge"
2) Using intereim tests 11 and 12, troubleshoot exDisplay, convert to tests 3 and 4. 
3) Future tests
    exChord
    exChordShapes
    start makign compositions using motifs-- design before testing, right? 



----------------------------------


Earlier considerations: 

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
their important relationships. We have all waited through a composer 
fluffing out a work with a tedious set of chord changes. Ok, enable that. 

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

The deck object is a pseudorandom number generator. 
Compositions using the deck will be able to randomly produce the same effect 
over and over. The deck literally contians the pseudorandom number list; 
to do otherwise would invite dependence on JS doing math in particular ways. 
Which I'm sure it does, mmmmmostly. It's not your fault!

The tuned hand encapsulates stringed instrument physicality. 
When you playa a guitar, it makes some notes easier to get to than others. 
That seems like a nice way to reduce the number of arbitrary decisions. 

There are various display objects: tab, clef, a metronome, sound, ... 




