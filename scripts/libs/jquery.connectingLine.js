// Jquery Plugin
// Created - Gunjan Kothari
// Date - 24/04/2014
// Plugin to Draw a line between to elements

(function($) {
	$.fn.connect = function(param) {
		var _canvas;
		var _ctx;
		var _lines = new Array(); //This array will store all lines (option)
		var _me = this;
		var _parent = param || document;

		//Initialize Canvas object
		_canvas = document.getElementById('myCanvas');

		this.drawLine = function(option) {
			//It will push line to array.
			_lines.push(option);
			this.connect(option);
		};

		this.removeLines = function(elements) {
			for (var i = 0; i < elements.length; i++) {
				_lines.pop();
			}
		};

		this.removeElementsRemoved = function(elements) {
			var elementsRemoved = [];
			var indexes = [];

			elements.forEach(function(el) {
				for (var i = 0; i < _lines.length; i++) {
					if( el.element == _lines[i].left_node || el.element == _lines[i].right_node) {
						indexes.push(i);
						elementsRemoved.push(_lines[i]);
					}
				}
			});

			var i = indexes.length;
			while (i--) {
        _lines.splice(i,1);
			}   
			return elementsRemoved;
		};

		this.addLines = function(elements) {
			elements.forEach(function(el) {
				_lines.push(el);
			});
      console.log(_lines);
		};

		this.drawAllLine = function(option) {

			/*Mandatory Fields------------------
			left_selector = '.class',
			data_attribute = 'data-right',
			*/

			if (option.left_selector != '' && typeof option.left_selector !== 'undefined' && $(option.left_selector).length > 0) {
				$(option.left_selector).each(function(index) {
					var option2 = new Object();
					$.extend(option2, option);
					option2.left_node = $(this).attr('id');
					option2.right_node = $(this).data(option.data_attribute);
					if (option2.right_node != '' && typeof option2.right_node !== 'undefined') {
						_me.drawLine(option2);

					}
				});
			}
		};

		//This Function is used to connect two different div with a dotted line.
		this.connect = function(option) {
			_ctx = _canvas.getContext('2d');
			_ctx.beginPath();
			try {
				var _color;
				var _dash;
				var _left = new Object(); //This will store _left elements offset  
				var _right = new Object(); //This will store _right elements offset	
				var _error = (option.error == 'show') || false;
				/*
				option = {
					left_node - Left Element by ID - Mandatory
					right_node - Right Element ID - Mandatory
					status - accepted, rejected, modified, (none) - Optional
					style - (dashed), solid, dotted - Optional	
					horizantal_gap - (0), Horizantal Gap from original point
					error - show, (hide) - To show error or not
					width - (2) - Width of the line
				}
				*/

				if (option.left_node != '' && typeof option.left_node !== 'undefined' && option.right_node != '' && typeof option.right_node !== 'undefined' && $(option.left_node).length > 0 && $(option.right_node).length > 0) {

					//To decide colour of the line
					switch (option.status) {
						case 'accepted':
							_color = '#0969a2';
							break;

						case 'rejected':
							_color = '#e7005d';
							break;

						case 'modified':
							_color = '#bfb230';
							break;

						case 'none':
							_color = 'grey';
							break;

						default:
							_color = 'black';
							break;
					}

					//To decide style of the line. dotted or solid
					switch (option.style) {
						case 'Include':
						case 'Extend':
							_dash = [4, 2];
							break;

						case 'Association':
						case 'Generalization':
							_dash = [0, 0];
							break;

						case 'dotted':
							_dash = [4, 2];
							break;

						default:
							_dash = [4, 2];
							break;
					}

					
					_left_node = $(option.left_node); //first
					_right_node = $(option.right_node); //second
					var sidesInverted = false;

					//If left_node is actually right side, following code will switch elements.
					if (_left_node.offset().left >= _right_node.offset().left) {
						sidesInverted = true;
						_tmp = _left_node
						_left_node = _right_node
						_right_node = _tmp;
					}

					var verticalDifference = Math.abs(_left_node.offset().top - _right_node.offset().top);
					var horizontalDifference = Math.abs(_left_node.offset().left - _right_node.offset().left);
					var orientation;
					if (verticalDifference > horizontalDifference){
						orientation = "vertical";
					} else {
						orientation = "horizontal";
					}
					var verticalSign = _left_node.offset().top - _right_node.offset().top;
					var horizontalSign = _left_node.offset().left - _right_node.offset().left;

					if (orientation == "horizontal") {
						//Get Left point and Right Point
						_left.x = (_left_node.offset().left + _left_node.outerWidth()) - 10;
						_left.y = (_left_node.offset().top + (_left_node.outerHeight() / 2) -100);
						//offset top - altura do elemento
						_right.x = _right_node.offset().left + 10;
						_right.y = (_right_node.offset().top + (_right_node.outerHeight() / 2) -100);
					} else { //vertical
						if (verticalSign < 0) {
							if (!sidesInverted) { // below
								_left.x = (_left_node.offset().left + (_left_node.outerWidth() /2));
								_left.y = _left_node.offset().top;
								_right.x = (_right_node.offset().left + (_right_node.outerWidth() /2));
								_right.y = (_right_node.offset().top - _right_node.outerHeight()) + 50;
							} else { //above
								_right.x = (_right_node.offset().left + (_right_node.outerWidth() /2));
								_right.y = (_right_node.offset().top - _right_node.outerHeight()) + 50;
								_left.x = (_left_node.offset().left + (_left_node.outerWidth() /2));
								_left.y = _left_node.offset().top + (_left_node.outerWidth() /2) - 60;
							}
						} else {
							if (!sidesInverted) { //above
								_left.x = (_left_node.offset().left + (_left_node.outerWidth() /2));
								_left.y = _left_node.offset().top;
								_right.x = (_right_node.offset().left + (_right_node.outerWidth() /2));
								_right.y = _right_node.offset().top + (_right_node.outerWidth() /2) - 60;
							} else { //below
								_left.x = (_left_node.offset().left + (_left_node.outerWidth() /2));
								_left.y = (_left_node.offset().top - _left_node.outerHeight()) + 50;
								_right.x = (_right_node.offset().left + (_right_node.outerWidth() /2));
								_right.y = _right_node.offset().top;
							}
						}
					}

					//Draw Line
					var _gap = option.horizantal_gap || 0;
					_ctx.moveTo(_left.x, _left.y);

					if (_gap != 0) {
						_ctx.lineTo(_left.x + _gap, _left.y);
						_ctx.lineTo(_right.x - _gap, _right.y);
					}
					_ctx.lineTo(_right.x, _right.y);

					if (!_ctx.setLineDash) {
						_ctx.setLineDash = function() {}
					} else {
						_ctx.setLineDash(_dash);
					}
					_ctx.lineWidth = option.width || 2;
					_ctx.strokeStyle = _color;
					var line = _ctx.stroke();

					if (option.style != "Association") {
						_ctx.font = "15px Arial";

						if (option.style != "Generalization") {
							_ctx.fillText("<<"+ option.style +">>", (_left.x +_right.x)/2 ,(_left.y + _right.y)/2);
						}
						 // draw the starting arrowhead
						if (sidesInverted && (option.style == "Extend" || option.style == "Include" || option.style == "Generalization")) {
						 	var startRadians=Math.atan((_right.y-_left.y)/(_right.x-_left.x));
						  startRadians+=((_right.x>_left.x)?-90:90)*Math.PI/180;
						  drawArrowhead(_ctx,_left.x , _left.y,startRadians);
						}
						else if (!sidesInverted && (option.style == "Extend" || option.style == "Include" || option.style == "Generalization")) {
							 // draw the ending arrowhead
							var endRadians=Math.atan((_left.y-_right.y)/(_left.x-_right.x));
							endRadians+=((_right.x>_left.x)?90:-90)*Math.PI/180;
							drawArrowhead(_ctx,_right.x, _right.y, endRadians);
						}
					}
					//option.resize = option.resize || false;
				} else {
					if (_error) alert('Mandatory Fields are missing or incorrect');
				}
			} catch (err) {
				if (_error) alert('Mandatory Fields are missing or incorrect');
			}
		};

		function drawArrowhead(ctx,x,y,radians){
        ctx.save();
        ctx.beginPath();
        ctx.translate(x,y);
        ctx.rotate(radians);
        ctx.moveTo(0,0);
        ctx.lineTo(5,20);
        ctx.lineTo(-5,20);
        ctx.closePath();
        ctx.restore();
        ctx.fill();
    }

		//It will redraw all line when screen resizes
		$(window).resize(function() {
			_me.redrawLines();
		});
		this.redrawLines = function() {
			_ctx.clearRect(0, 0, $(_parent).width(), $(_parent).height());
			_lines.forEach(function(entry) {
				entry.resize = true;
				_me.connect(entry);
			});
		};
		return this;
	};
}(jQuery));