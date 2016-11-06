
// make a text string that contains tab notation

// the string "this.grid" is 96 characters wide x 60 lines 
// I can't seem to stick to ANY design decisions. 

var exNote = require('./exNote');
var exNoteList = require('./exNoteList');



function exTextTab(titleStr, tunedHand, tilesPerSecond) { 
    this.grid = ""; 
    this.columnsPerNote = columnsPerNote;
    this.hand = tunedHand; 
    this.strCount = this.hand.strCount; 
    this.blankPage(); 

    this.tilesPerSecond = tilesPerSec;
    this.rowHeight = this.strCount +2;  
    this.rowPerPage = Math.floor(this.rowHeight);
    this.rowsPerSecond = tilesPerSec / 60.0;  // 60 tiles/line
    this.pageDuration = this.rowsPerPage / this.rowsPerSecond;

    return this; 
}


exTextTab.prototype = { 
    // str and fill are strings. add fills to str until its length is len.
    fillout = function(str, fill, len) { 
        var i, inLen, fillLen, res; 
        inLen = str.length; 
        fillLen = fill.length; 
        res = str; 
        for (i=inLen; i<(len-fillLen); i=i+fillLen) { 
            res = res + fill; 
        } 
        return res;
    },


    // put string cha in column x, row y of this.grid
    plot: function(x, y, cha) {
        var len = cha.length;
        if ((x<0)||(x>(95-len))||(y<0)||(y>60)) { return; } 

        var ind = x + (y*96); 
        res = this.grid.substr(0, ind) + cha + this.grid.substr(ind+len);
        this.grid = res; 
    },


    // given an exNote, assuming this page starts at t=0
    plotNote = function(note) {
        var x, y, str, whichRow, rowt; 

        this.hand.setANote(note); // use hand to put note on a string/fret
        if ((note.string!=-1)&&(note.t>=0.0)&&(note.t<this.pageDuration)) {
            // which row to put the note on
            whichRow = Math.floor(note.t * this.rowsPerSecond);
            // start time of that row
            rowt = whichRow / this.rowsPerSecond; 

            x = 3 + Math.floor((note.t-rowt)*this.tilesPerSecond); 
            y = 2 + (this.rowHeight * whichRow) + (this.strCt - note.string);
            str = ''+this.fret;
            this.plot(x,y,str); 
        }
    },


    // returns a string containing empty lines
    blankPage: function() { 
        var i, j, k, scr;
        var aLine, aRow, aBlankLine, rowCt;
        var aNote = new exNote(); 

        // make sure title line is 96 chars!
        scr = "     " + titleStr;
        scr = this.fillout(scr, ' ', 95);
        scr = scr + '\n';

        aLine = this.fillout('-', '-', 93); 
        aLine += '\n';
        aBlankLine = this.fillout(' ', ' ', 95); 
        aBlankLine += '\n';

        aRow = aBlankLine;
        for (i=0; i<this.strCount; i=i+1) {
            aNote.midi = this.hand.strings[i];
            aRow = scr + aNote.letter() + aLine; 
        }
        aRow += aBlankLine; 
        
        // make a blank grid of lines
        for (i=0; i<this.linesPerPage; i=i+1) {
            scr = scr + aRow;
        }
        this.grid = scr; 
        this.rowCt = rowCt; 
    },


    plotNoteList: function(nl) { 
        this.blankPage(); 
        nl.apply(this.plotNote);
    }

}

module.export = exTextTab; 

