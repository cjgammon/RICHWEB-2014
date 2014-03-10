      //grid class
      var HGridLayout = function (x, y, xSpace, ySpace, numColumns) {

        var _index = 0,
          _x,
          _y,
          _xSpace, 
          _ySpace, 
          _numCol;

        _x = x;
        _y = y;
        _xSpace = xSpace;
        _ySpace = ySpace;
        _numCol = numColumns;

        this.getNextPoint = function () {
          var pt = {x: 0, y: 0},
            row = Math.floor(_index / _numCol),
            col = _index % _numCol;
    
          pt.x = _x + (col * _xSpace);
          pt.y = _y + (row * _ySpace);
          _index += 1;
    
          return pt;
        }
      }