    //
		// Startup
		//
		var _isDown, _points, _r, _g, _rc;
		function onLoadEvent()
		{
			_points = new Array();
			_r = new DollarRecognizer();
			var cancelPoints = '[{"X":317,"Y":136},{"X":317,"Y":136},{"X":317,"Y":134},{"X":316,"Y":134},{"X":316,"Y":134},{"X":316,"Y":133},{"X":316,"Y":132},{"X":314,"Y":130},{"X":313,"Y":130},{"X":313,"Y":129},{"X":312,"Y":128},{"X":312,"Y":126},{"X":312,"Y":126},{"X":310,"Y":124},{"X":309,"Y":124},{"X":308,"Y":122},{"X":306,"Y":121},{"X":305,"Y":120},{"X":304,"Y":118},{"X":302,"Y":118},{"X":301,"Y":118},{"X":300,"Y":117},{"X":297,"Y":116},{"X":296,"Y":116},{"X":294,"Y":114},{"X":292,"Y":113},{"X":289,"Y":112},{"X":288,"Y":112},{"X":286,"Y":110},{"X":284,"Y":110},{"X":282,"Y":110},{"X":280,"Y":109},{"X":278,"Y":108},{"X":276,"Y":108},{"X":273,"Y":106},{"X":272,"Y":106},{"X":268,"Y":106},{"X":266,"Y":106},{"X":264,"Y":106},{"X":260,"Y":106},{"X":257,"Y":106},{"X":254,"Y":106},{"X":252,"Y":106},{"X":248,"Y":106},{"X":245,"Y":106},{"X":242,"Y":106},{"X":240,"Y":106},{"X":237,"Y":106},{"X":236,"Y":106},{"X":232,"Y":106},{"X":230,"Y":106},{"X":228,"Y":106},{"X":225,"Y":106},{"X":224,"Y":108},{"X":221,"Y":108},{"X":220,"Y":109},{"X":216,"Y":110},{"X":212,"Y":112},{"X":208,"Y":113},{"X":204,"Y":114},{"X":200,"Y":116},{"X":196,"Y":117},{"X":192,"Y":120},{"X":189,"Y":121},{"X":184,"Y":124},{"X":181,"Y":125},{"X":180,"Y":126},{"X":176,"Y":128},{"X":176,"Y":130},{"X":172,"Y":132},{"X":172,"Y":132},{"X":172,"Y":133},{"X":172,"Y":134},{"X":170,"Y":134},{"X":170,"Y":136},{"X":168,"Y":138},{"X":168,"Y":140},{"X":166,"Y":141},{"X":165,"Y":144},{"X":164,"Y":146},{"X":164,"Y":148},{"X":164,"Y":150},{"X":164,"Y":152},{"X":164,"Y":153},{"X":162,"Y":154},{"X":161,"Y":157},{"X":160,"Y":158},{"X":160,"Y":160},{"X":160,"Y":162},{"X":160,"Y":166},{"X":158,"Y":170},{"X":158,"Y":173},{"X":157,"Y":176},{"X":156,"Y":180},{"X":156,"Y":182},{"X":156,"Y":184},{"X":156,"Y":188},{"X":156,"Y":190},{"X":154,"Y":193},{"X":154,"Y":194},{"X":153,"Y":198},{"X":153,"Y":200},{"X":153,"Y":202},{"X":153,"Y":204},{"X":153,"Y":208},{"X":153,"Y":210},{"X":153,"Y":212},{"X":153,"Y":214},{"X":153,"Y":218},{"X":153,"Y":222},{"X":154,"Y":228},{"X":156,"Y":232},{"X":158,"Y":238},{"X":160,"Y":241},{"X":160,"Y":245},{"X":164,"Y":250},{"X":164,"Y":252},{"X":165,"Y":256},{"X":168,"Y":258},{"X":169,"Y":262},{"X":172,"Y":266},{"X":173,"Y":270},{"X":177,"Y":274},{"X":180,"Y":278},{"X":184,"Y":282},{"X":186,"Y":285},{"X":189,"Y":288},{"X":192,"Y":289},{"X":196,"Y":292},{"X":200,"Y":294},{"X":201,"Y":298},{"X":204,"Y":300},{"X":208,"Y":302},{"X":210,"Y":305},{"X":213,"Y":306},{"X":216,"Y":308},{"X":218,"Y":309},{"X":220,"Y":310},{"X":222,"Y":310},{"X":224,"Y":310},{"X":228,"Y":312},{"X":229,"Y":312},{"X":232,"Y":312},{"X":233,"Y":312},{"X":236,"Y":312},{"X":237,"Y":312},{"X":240,"Y":312},{"X":244,"Y":312},{"X":245,"Y":312},{"X":250,"Y":312},{"X":252,"Y":312},{"X":256,"Y":312},{"X":258,"Y":312},{"X":261,"Y":312},{"X":264,"Y":310},{"X":268,"Y":310},{"X":272,"Y":310},{"X":272,"Y":309},{"X":276,"Y":309},{"X":276,"Y":308},{"X":277,"Y":308},{"X":280,"Y":308},{"X":281,"Y":306},{"X":284,"Y":306},{"X":284,"Y":306},{"X":286,"Y":306},{"X":288,"Y":305},{"X":289,"Y":304},{"X":292,"Y":302},{"X":294,"Y":301},{"X":296,"Y":300},{"X":297,"Y":298},{"X":300,"Y":297},{"X":301,"Y":296},{"X":304,"Y":294},{"X":304,"Y":292},{"X":305,"Y":292},{"X":306,"Y":292},{"X":308,"Y":290},{"X":308,"Y":289},{"X":309,"Y":289},{"X":310,"Y":288},{"X":312,"Y":286},{"X":312,"Y":286},{"X":313,"Y":286},{"X":313,"Y":284},{"X":316,"Y":284},{"X":316,"Y":282},{"X":318,"Y":281},{"X":320,"Y":280},{"X":320,"Y":278},{"X":322,"Y":277},{"X":324,"Y":276},{"X":324,"Y":274},{"X":326,"Y":274},{"X":328,"Y":273},{"X":328,"Y":272},{"X":328,"Y":272},{"X":329,"Y":270},{"X":330,"Y":270},{"X":332,"Y":269},{"X":332,"Y":268},{"X":332,"Y":268}]';
			cancelPoints = JSON.parse(cancelPoints);
			_r.AddGesture("cancel", cancelPoints); //adding my custom gesture - cancel-

			var canvas = document.getElementById('myCanvas');
			_g = canvas.getContext('2d');
			_g.fillStyle = "rgb(0,0,225)";
			_g.strokeStyle = "rgb(0,0,225)";
			_g.lineWidth = 3;
			_g.font = "16px Arial";
			_rc = getCanvasRect(canvas); // canvas rect on page

			_isDown = false;
		}
		function getCanvasRect(canvas)
		{
			var w = canvas.width;
			var h = canvas.height;

			var cx = canvas.offsetLeft;
			var cy = canvas.offsetTop;
			while (canvas.offsetParent != null)
			{
				canvas = canvas.offsetParent;
				cx += canvas.offsetLeft;
				cy += canvas.offsetTop;
			}
			return {x: cx, y: cy, width: w, height: h};
		}
		function getScrollY()
		{
			var scrollY = $(window).scrollTop();
			return scrollY;
		}
		//
		// Mouse Events
		//
		function mouseDownEvent(x, y)
		{
			document.onselectstart = function() { return false; } // disable drag-select
			document.ontouchstart = function() { return false; } // disable drag-select
			_isDown = true;
			console.log(_isDown);
			x -= _rc.x;
			y -= _rc.y - getScrollY();
			if (_points.length > 0)
				_g.clearRect(0, 0, _rc.width, _rc.height);
			_points.length = 1; // clear
			_points[0] = new Point(x, y);
			_g.fillRect(x - 4, y - 3, 9, 9);
		}
		function mouseMoveEvent(x, y)
		{
			if (_isDown)
			{
				x -= _rc.x;
				y -= _rc.y - getScrollY();
				_points[_points.length] = new Point(x, y); // append
				drawConnectedPoint(_points.length - 2, _points.length - 1);
			}
		}
		function mouseUpEvent(x, y)
		{
			document.onselectstart = function() { return true; } // enable drag-select
			document.ontouchstart = function() { return true; } // enable drag-select
			if (_isDown)
			{
				_isDown = false;
				console.log(_points);
				if (_points.length >= 10)
				{	
					var result = _r.Recognize(_points, false);
					//drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
					alert("Result: " + result.Name + " (" + round(result.Score,2) + ").");
				}
				else // fewer than 10 points were inputted
				{
					drawText("Too few points made. Please try again.");
				}
			}
			_g.clearRect(0, 0, _rc.width, _rc.height);
		}
		function drawText(str)
		{
			_g.fillStyle = "rgb(255,255,136)";
			_g.fillRect(0, 0, _rc.width, 20);
			_g.fillStyle = "rgb(0,0,255)";
			_g.fillText(str, 1, 14);
		}
		function drawConnectedPoint(from, to)
		{
			_g.beginPath();
			_g.moveTo(_points[from].X, _points[from].Y);
			_g.lineTo(_points[to].X, _points[to].Y);
			_g.closePath();
			_g.stroke();
		}
		function round(n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d
		}
		//
		// Unistroke Adding and Clearing
		//
		function onClickAddExisting()
		{
			if (_points.length >= 10)
			{
				var unistrokes = document.getElementById('unistrokes');
				var name = unistrokes[unistrokes.selectedIndex].value;
				var num = _r.AddGesture(name, _points);
				drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
			}
		}
		function onClickAddCustom()
		{
			var name = document.getElementById('custom').value;
			if (_points.length >= 10 && name.length > 0)
			{
				var num = _r.AddGesture(name, _points);
				drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
			}
		}
		function onClickCustom()
		{
			document.getElementById('custom').select();
		}
		function onClickDelete()
		{
			var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
			alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
		}
	// -->