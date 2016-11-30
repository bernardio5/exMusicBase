
/* A set of contoller object generators
    Each generates HTML code for pickers, filled with music-related options.
    Each also provides a value-fetching function.

    Does place constraints on what ID's you use in your HTML
*/


// Canvas aCanvas, float x0, float y0
function exControls(document) {
    this.myDocument = document;
};


exControls.prototype = {
    // two drop-downs that allow users to select a MIDI notes 12-96,
    //   many of which I can't hear on my laptop's speakers. 
    getHTMLForTonic: function() { 
        var res = "<select id='exTonic'>";
        res = res + "<option value='0' selected>C</option>";
        res = res + "<option value='1'>C#</option>";
        res = res + "<option value='2'>D</option>";
        res = res + "<option value='3'>D#</option>";
        res = res + "<option value='4'>E</option>";
        res = res + "<option value='5'>F</option>";
        res = res + "<option value='6'>F#</option>";
        res = res + "<option value='7'>G</option>";
        res = res + "<option value='8'>G#</option>";
        res = res + "<option value='9'>A</option>";
        res = res + "<option value='10'>A#</option>";
        res = res + "<option value='11'>B</option>";
        res = res + "</select>/";
        res = res + "<select id='exOctave'>";
        res = res + "<option value='12'>0</option>";
        res = res + "<option value='24'>1</option>";
        res = res + "<option value='36'>2</option>";
        res = res + "<option value='48'>3</option>";
        res = res + "<option value='60' selected>4</option>";
        res = res + "<option value='72'>5</option>";
        res = res + "<option value='84'>5</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTonic: function() {
        var res = 0; 
        var fun = parseInt(document.getElementById('exTonic').value);
        var oct = parseInt(document.getElementById('exOctave').value);
        res = fun+oct;
        return res; 
    },


    // for those thinking of measures.. doofs. 
    getHTMLForBeatsPerMeasure: function() { 
        var res = "<select id='exBeatsPerMeasure'>";
        res = res + "<option value='0' selected>1</option>";
        res = res + "<option value='1'>2</option>";
        res = res + "<option value='2'>3</option>";
        res = res + "<option value='3'>4</option>";
        res = res + "<option value='4'>5</option>";
        res = res + "<option value='5'>6</option>";
        res = res + "<option value='6'>7</option>";
        res = res + "<option value='7'>8</option>";
        res = res + "<option value='8'>9</option>";
        res = res + "<option value='9'>10</option>";
        res = res + "<option value='10'>11</option>";
        res = res + "<option value='11'>12</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForBeatsPerMeasure: function(document) {
        var res = parseInt(document.getElementById('exBeatsPerMeasure').value); 
        return res; 
    },

/*      [ 0, 2,4, 5,7,9,11 ], // major
        [ 0, 2,3, 5,7,8,10 ], // minor
        [ 0, 2,3, 5,7,9,10 ], // dorian
        [ 0, 2,4, 5,6,10   ], // wholetone
        [ 0, 2,3, 6,7,8,10 ], // "hungarian"
        [ 0, 4,6, 7,11     ], // "chinese"
        [ 0, 1,3, 5,7,9,10 ]  // "javan"
        [ 0,1,2,3,4,5,6,7,8,9,10,11 ]  // 12 */

    getHTMLForMode: function() { 
        var res = "<select id='exMode'>";
        res = res + "<option value='0' selected>Major</option>";
        res = res + "<option value='1'>Minor</option>";
        res = res + "<option value='2'>Dorian</option>";
        res = res + "<option value='3'>Whole</option>";
        res = res + "<option value='4'>Hungarian</option>";
        res = res + "<option value='5'>Pentatonic</option>";
        res = res + "<option value='6'>Heptatonic</option>";
        res = res + "<option value='7'>12</option>"; // seriously? kinda moots key.
        res = res + "</select>";
        return res; 
    },
    getValueForMode: function() {
        var res = parseInt(this.document.getElementById('exMode').value); 
        return res; 
    },

    /*  if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
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
        For use with exTunedHand
    */
    getHTMLForTuning: function() { 
        var res = "<select id='exTuning'>";
        res = res + "<option value='0' selected>Standard Guitar</option>";
        res = res + "<option value='1' selected>Guitar Drop D</option>";
        res = res + "<option value='2' selected>Open C</option>";
        res = res + "<option value='3' selected>EADF#BE</option>";
        res = res + "<option value='10' selected>Ukulele</option>";
        res = res + "<option value='11' selected>Violin/Mandolin</option>";
        res = res + "<option value='13' selected>Banjo</option>";
        res = res + "<option value='14' selected>Cello</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTuning: function() {
        var res = parseInt(this.document.getElementById('exTuning').value); 
        return res; 
    },


    // for use with deck
    getHTMLForSeed: function() { 
        var res = "<select id='exSeedHi'>";
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
        res = res + "<select id='exSeedLo'>";
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
        var exHi = parseInt(document.getElementById('exSeedHi').value); 
        var exLo = parseInt(document.getElementById('exSeedLo').value); 
        var res = exHi * 16 + exLo; 
        return res; 
    },


//        Beats per Minute:<input type="text" value='100' size=5 id ='tempo' /><br />
//        anin.bpMinute = parseInt(document.getElementById('tempo').value);

};


