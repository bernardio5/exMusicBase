

/*
    Replaces loosey-goosey canvas drawing with 
    a tile map drawn on a rectilinear grid. 
    For the ex library, there is a default tile set. 
    The grid size in it is 32. The grid size is 16px.

    Default is to draw only with integer grid coordinates. 

    Takes an origin in grid coords; draws relative to that. 

    Tracks a bounding-box; erases only that, to white.
    
    for the drawing functions, (x,y) are grid/canvas coords, 
    and (tx,ty) specify the sprite to draw.
*/

var note = require('./note');
var noteList = require('.noteList');

// Canvas aCanvas, float x0, float y0
function exSpriteCanvas(aCanvas, x0, y0) {
    this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = (this.cxw / this.tileSize) + 1; // # tiles available on canvas in X
    this.tileH = (this.cxh / this.tileSize) + 1; // in Y
    this.x0 = x0 * this.tileSize;
    this.y0 = y0 * this.tileSize;

    // load the tile set bitmap. 
    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload: function(that) { that.loaded=1; }

    // bbox for all draws since last erase-- uses canvas 
    this.minX = 0; 
    this.minY = 0; 
    this.maxX = 1; 
    this.maxY = 1; 
}


exSpriteCanvas.prototype = {
    // draw tile at tx,ty at grid point x, y-- minimal default case
    drawSprite: function(x, y, tx, ty) { 
        if ((x>-1)&&(x<this.tileW)&&(y>-1)&&(y<this.tileH)) {
            var ts = this.tileSize; 
            var is = this.imgTileSz;
            var xpos = this.x0 + (ts*x); 
            var ypos = this.y0 + (ts*y); 
            this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xpos, ypos, ts, ts); 
            if (x<this.minX) { this.minX = x; }
            if (y<this.minY) { this.minY = y; }
            if (x>this.maxX) { this.maxX = x; }
            if (y>this.maxY) { this.maxY = y; }
        }
    },


    // draws multiple tiles on a grid point
    drawLargeSprite: function(x, y, tx, ty, txsz, tysz) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz;
        var xpos = this.x0 + (ts*x); 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, xpos, ypos, txsz*ts, tysz*ts); 
        if (x<this.minX) { this.minX = x; }
        if (y<this.minY) { this.minY = y; }
        if ((x+txsz)>this.maxX) { this.maxX = (x+txsz); }
        if ((y+tysz)>this.maxY) { this.maxY = (y+tysz); }
    }


    // scale the sprite by xscale and yscale 
    drawStretchedSprite: function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = this.x0 + (ts*x); 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, xpos, ypos, txsz*ts*xscale, tysz*ts*yscale); 
        if (x<this.minX) { this.minX = x; }
        if (y<this.minY) { this.minY = y; }
        if (((x+txsz)*xscale)>this.maxX) { this.maxX = ((x+txsz)*xscale); }
        if (((y+tysz)*yscale)>this.maxY) { this.maxY = ((y+tysz)*yscale); }
    },


    // frees sprite from grid in x-- useful for timer sliders. 
    drawSliderSprite = function(xsl, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = xsl/ts; 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xsl+this.x0, ypos, ts, ts); 
        if (xpos<this.minX) { this.minX = xpos; }
        if (y<this.minY) { this.minY = y; }
        if (((xpos+txsz)*xscale)>this.maxX) { this.maxX = ((xpos+txsz)*xscale); }
        if (((y+tysz)*yscale)>this.maxY) { this.maxY = ((y+tysz)*yscale); }
    },


    // sigh. what is this whole class even for? 
    drawCheaterSprite = function(x, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = x/ts; 
        var ypos = y/ts; 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x+this.x0, y+this.y0, ts, ts); 
        if (xpos<this.minX) { this.minX = xpos; }
        if (ypos<this.minY) { this.minY = ypos; }
        if (((xpos+txsz)*xscale)>this.maxX) { this.maxX = ((xpos+txsz)*xscale); }
        if (((ypos+tysz)*yscale)>this.maxY) { this.maxY = ((ypos+tysz)*yscale); }
    },


    // erases canvas
    clear: function() {
        var ts = this.tileSize; 
        this.context.fillStyle = this.bg;
        this.context.beginPath();
        this.context.rect(this.x0 + (this.minX*ts), this.y0+(this.minY*ts), this.maxX*ts, this.maxY*ts);
        this.context.fill();
        this.minX = 0; 
        this.minY = 0; 
        this.maxX = 1; 
        this.maxY = 1; 
        this.
    },
}

module.export = exSpriteCanvas;




