
/* A set of contoller object generators
    Each generates HTML code for pickers, filled with music-related options.
*/


// Canvas aCanvas, float x0, float y0
function exControls(document) {
    this.myDocument = document;
};


exControls.prototype = {
    // draw tile at tx,ty at grid point x, y-- minimal default case
    getHTMLForTonic: function() { 
        var res = "<select id='fundamental'>";
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
        res = res + "</select>";
        res = res + "<select id='octave'>";
        res = res + "<option value='36'>2</option>";
        res = res + "<option value='48'>3</option>";
        res = res + "<option value='60' selected>4</option>";
        res = res + "<option value='72'>5</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTonic: function() {
        var res = 0; 
        var fun = this.myDocument.getElementById('fundamental').value; 
        var oct = this.myDocument.getElementById('octave').value; 
        res = fun+(oct*12);
        return res; 
    },

//        anin.tuning = parseInt(document.getElementById('tuning').value);

    getHTMLForBeatsPerMeasure: function() { 
        var res = "<select id='beatsPerMeasure'>";
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
        var res = document.getElementById('beatsPerMeasure').value; 
        return res; 
    },


    // draw tile at tx,ty at grid point x, y-- minimal default case
    getHTMLForTonic: function() { 
        var res = "<select id='fundamental'>";
        res = res + "<option value='0' selected>C</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTonic: function() {
        var res = 0; 
        return res; 
    },



};

//        Beats per Minute:<input type="text" value='100' size=5 id ='tempo' /><br />
//        anin.bpMinute = parseInt(document.getElementById('tempo').value);




/*       
        <select id='mode'>
            <option value='0' selected>major</option>
            <option value='1'>minor</option>
            <option value='2'>Dorian</option>
            <option value='3'>whole</option>
            <option value='4'>Hungarian</option>
            <option value='5'>pentatonic</option>
            <option value='6'>hexatonic</option>
            </select>
        anin.mode = document.getElementById('mode').value; 
*/



/*
        Instrument Tuning:<select id='tuning'>
            <option value='0'>Std Guitar: EADGBE</option>
            <option value='1'>Open D: DADFAD</option>
            <option value='2'>Open C: CEGCEG</option>
            <option value='3'>El Noy: </option>
            <option value='10'>Uke! GCEA</option>
            </select>
            <br>
*/
//        anin.tuning = parseInt(document.getElementById('tuning').value);


/*
        var exHi = parseInt(document.getElementById('seedHi').value); 
        var exLo = parseInt(document.getElementById('seedLo').value); 
        anin.seed = exHi * 16 + exLo; 

        Number: <select id='seedHi'>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'  selected>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
            <option value='13'>13</option>
            <option value='14'>14</option>
            <option value='15'>15</option>
            </select> .
        <select id='seedLo'>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'  selected>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
            <option value='13'>13</option>
            <option value='14'>14</option>
            <option value='15'>15</option>
            </select>
            <br/>
       
*/

