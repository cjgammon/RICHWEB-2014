      var ColorPool = function (colors) {
        var _colorTable = [],
          i;

        if (typeof(colors) !== 'undefined') {
          for (i = 0; i < colors.length; i += 1) {
            _colorTable.push(colors[i]);
          }
        }
        

        this.addColor = function (c, f) {

          if (typeof(f) !== 'undefined') {
            if (f < 0) return;
              for (i = 0; i < f; i += 1) {
                _colorTable.push(c);
              }
          } else {
            _colorTable.push(c);
          }
        }

        this.getColor = function () {
          var color = _colorTable[Math.floor(Math.random() * _colorTable.length)];
          return color;
        }
      }