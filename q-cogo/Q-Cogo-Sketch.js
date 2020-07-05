/*
	This heading must remain intact at all times.
	Copyright (c) 2018 Mark Mason.

	File:	Q-Cogo-Sketch.js
	Use:	To provide sketching operations for Q-Cogo, <http://www.q-cogo.com/>.
	Ver:	1.5

	Created by Mark Mason. Latest version available from <http://www.q-cogo.com/>.



	This file is part of Q-Cogo.
	
	Q-Cogo is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Q-Cogo is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with Q-Cogo.  If not, see <http://www.gnu.org/licenses/>.



	FUNCTION LISTING

	* Navigation *
	
	PutCanvas
	DropCanvas
	PanSketch
	ZoomSketch
	RefreshSketches
	
	* Function Sketches *
	
	SketchArea
	SketchTransform
	SketchAdjust
	SketchBrgBrg
	SketchBrgDist
	SketchDistDist
	SketchPtLine
	SketchPtPt
	SketchCurve
	SketchTriangle
	SketchPoints
	
	* General *
	
	Points
	Labels
	FindScale
	ImgCoord
	ScaleBar
	DrawControls
	psLineEnd
	ImgTrim
	GetLT
	qLine
	qArc
	sortAng
	qDraw
	
	* Linework *
	
	OutputLines
	CheckLines
	FormLine
	ParseLines
	DeleteLine
	AuditLines
	PtClickSwitch
	LineClickSwitch
	ToolSwitch
	qAddLine
	isSelected
	clearAll
	AllLines
	FindPt
	CADinfo
	
*/



// --------------------------------------------------
//  Navigation
// --------------------------------------------------

// *******************************************************************************************************************************

function PutCanvas(Canvas, We, He, Xe, Ye) {$(Canvas).css({left:-We, top:-He}).css('width', 3 * We).css('height', 3 * He);}

// Resets the base canvas to its default position (called after every pan or zoom operation)
// Input:  Canvas, dimensions and position of easel
// Output: The reset base canvas

// *******************************************************************************************************************************

function DropCanvas() {

// Updates the pseudocanvas info, resets the real canvas, and redraws the canvas information
// Input:  None
// Output: The dropped canvas, with all appropriate info updated

	var Canvas = '#PointsCanvas';  var Easel = '#PointsEasel';
	var Header = qG('header').innerHTML;  var CanvasPar = '#' + Header + 'CanvasPar';

	var PSP = $(CanvasPar).val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

	var XcReal = $(Canvas).offset().left, YcReal = $(Canvas).offset().top;

	var We = $(Easel).outerWidth(), He = $(Easel).outerHeight(), Xe = $(Easel).offset().left, Ye = $(Easel).offset().top;

	$(CanvasPar).val(Wc + ' ' + Hc + ' ' + (Xc + XcReal - Xe + We) + ' ' + (Yc + YcReal - Ye + He));
	PutCanvas(Canvas, We, He, Xe, Ye);
	eval(qG(Header + 'CanvasSt').value);
	
}

// *******************************************************************************************************************************

function PanSketch(Left, Top, NoFactor) {

// Repositions the canvas
// Input:  Right direction, top direction
// Output: The newly positioned canvas

// Return if no sketch is visible

	var Header = qG('header').innerHTML;  if (Header == 'Help' || Header == 'Settings')  return;

	var Canvas = '#PointsCanvas';  var Easel = '#PointsEasel';
	var We = $(Easel).outerWidth(), He = $(Easel).outerHeight(), Xe = $(Easel).offset().left, Ye = $(Easel).offset().top;

	var Factor = (NoFactor ? 1 : 20);
	$(Canvas).css({left: -We+(Factor * Left), top: -He+(Factor * Top)});
	DropCanvas();
	
}

// *******************************************************************************************************************************

function ZoomSketch(Dir, MouseX, MouseY, Scale) {

// Zooms a sketch canvas and redraws information on it as appropriate
// Input:  Zoom dir / all (positive for zoom in, negative for zoom out, 0 for zoom all), coords of mouse (0 and 0 to use coordinates of easel centre)
// Output: The zoomed sketch

// Define canvas easel and header, return if no sketch is visible

	var Canvas = '#PointsCanvas';  var Easel = '#PointsEasel';
	var Header = qG('header').innerHTML, CanvasPar = '#' + Header + 'CanvasPar';

	if (Header == 'Help' || Header == 'Settings')  return;

// Compute zoom parameters, zooming by ratio and fixing the center at the center of the viewport

	Dir = ((Dir < 0) ? -1 : (Dir > 0) ? 1 : 0);

// Find canvas pseudo-size and pseudo-position from canvas parameter textbox title

	var PSP = $(CanvasPar).val().split(' ');

	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);
	var We = $(Easel).outerWidth() - 126, He = $(Easel).outerHeight() - 24, Xe = $(Easel).offset().left + 75, Ye = $(Easel).offset().top + 12;

	var Zoom = (Scale ? Scale : Math.pow(1.3, Dir));
	
// Set min Hc, to disallow zooming out beyond a minimum ratio of the initial canvas size

	var HcMIN = 1;
	
// Compute new width and height of canvas (newWc and newHc)

	if (Dir) {

		var newWc = ((Hc > HcMIN || Dir > 0) ? parseFloat(Wc * Zoom) : Wc);
		var newHc = parseFloat(newWc * He / We);

// Compute new centre point and coords -- Xc and Yc are the upper left corner of the pseudocanvas relative to the canvas, not the easel
// Mouse coordinates are relative to the canvas, not the easel

		Xp = ((MouseX) ? MouseX - Xc : Xe - Xc + We / 2);
		Yp = ((MouseY) ? MouseY - Yc : Ye - Yc + He / 2);

		Xc = Xc + ((newWc != Wc) ? Xp - Xp * Zoom : 0);
		Yc = Yc + ((newWc != Wc) ? Yp - Yp * Zoom : 0);
		
	}
	
// Zooming extents, center slightly right to accommodate controls area
	
	else {Xc = Xe; Yc = Ye; newWc = We; newHc = He;}

// Resize and center the pseudocanvas and the real canvas, redraw

	$(CanvasPar).val(newWc + ' ' + newHc + ' ' + (Xc) + ' ' + (Yc));
	PutCanvas(Canvas, We + 126, He + 24, Xe - 75, Ye - 12);  // Important to prevent pan jump!
	eval(qG(Header + 'CanvasSt').value);

// Return false to prevent page scroll
	
	return false;
	
}

// The following helper functions perform event handling for the Zoom Sketch function

function MouseZoom(e) {
	if (!e) var e = window.event;
	cancelEvent(e);
	var normal = e.detail ? e.detail * -1 : e.wheelDelta / 40;
	if (e.pageX || e.pageY) {var posx = e.pageX, posy = e.pageY;}
	else if (e.clientX || e.clientY) {var posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		var posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;}
	ZoomSketch(normal, posx, posy);}

function hookEvent(element, eventName, callback) {
	if (typeof(element) == "string") element = qG(element);
	if (element == null) return;
	if (element.addEventListener) {
		if (eventName == 'mousewheel') {element.addEventListener('DOMMouseScroll', callback, false); element.addEventListener('MozMousePixelScroll', callback, false);}
		element.addEventListener(eventName, callback, false);
	}
  	else if (element.attachEvent) element.attachEvent("on" + eventName, callback);}

function cancelEvent(e) {
	e = e ? e : window.event;  if (e.stopPropagation)  e.stopPropagation();  if (e.preventDefault)  e.preventDefault();
	e.cancelBubble = true;  e.cancel = true;  e.returnValue = false;  return false;}

// *******************************************************************************************************************************

function RefreshSketches() {

// Refreshes relevant sketch data for fresh screen loads and resizes to avoid jumps on first manipulation
// Input:  None
// Output: The updated sketch parameters for each sketch

	var Canvases = ['#PointsCanvas', '#TraverseCanvas', '#InverseCanvas', '#IntersectCanvas', '#TransformCanvas', '#AdjustCanvas', '#AreaCanvas', '#SolverCanvas'];
	var cL = Canvases.length;
	var Easel = '#PointsEasel';
	var We = $(Easel).outerWidth() - 126, He = $(Easel).outerHeight() - 24, Xe = $(Easel).offset().left + 75, Ye = $(Easel).offset().top + 12;

	for (var i=0; i<cL; i++)  $(Canvases[i] + 'Par').val(We + ' ' + He + ' ' + (Xe) + ' ' + (Ye));

	PutCanvas('#PointsCanvas', We + 126, He + 24, Xe - 75, Ye - 12);

}

	
	
// --------------------------------------------------
//  Function Sketches
// --------------------------------------------------
	
// *******************************************************************************************************************************

function SketchArea(ptMt, Canvas) {

// Sketches the most recent area operation of three or many points into the appropriate sketch area
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas; if not found, default to size of points canvas

	if (ptMt) {

		ptMt[ptMt.length] = ptMt[0];

		var PSP = $('#AreaCanvasPar').val().split(' ');
		var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Form matrix of circle / curve points (top left and bottom right of circle / curve extents) and array of start and end angles

		var cM = new Array(0);
		var SEang = new Array(0);
		var cE = new Array(0);
		var lP = ptMt.length - 1;

		for (var i=0; i<lP; i++) {

			var indexM = ((i == 0) ? ptMt.length - 2 : i - 1);

			if (ptMt[i][0].search(/\*/) >= 0) {

				var R = PtPtInverse(0, ptMt[i], ptMt[i + 1])[0];

// Total extents of circle containing curve, used for drawing curve

				cM[cM.length] = ['P', parseFloat(ptMt[i][1]) + R, parseFloat(ptMt[i][2]) - R, 0, 'D'];
				cM[cM.length] = ['P', parseFloat(ptMt[i][1]) - R, parseFloat(ptMt[i][2]) + R, 0, 'D'];

				var Ang1 = PtPtInverse(0, ptMt[i], ptMt[i + 1])[2];
				var Ang2 = PtPtInverse(0, ptMt[i], ptMt[indexM])[2];

				var Ang11 = Math.min((5 * Math.PI / 2 - Ang1) % (2 * Math.PI), (5 * Math.PI / 2 - Ang2) % (2 * Math.PI));
				var Ang22 = Math.max((5 * Math.PI / 2 - Ang1) % (2 * Math.PI), (5 * Math.PI / 2 - Ang2) % (2 * Math.PI));

// Start and end angles of curve

				if (ptMt[i][0].search(/\*/) == 0) {

					SEang[SEang.length] = ((Ang22 - Ang11 < Math.PI) ? Ang22 : Ang11);
					SEang[SEang.length] = ((Ang22 - Ang11 < Math.PI) ? Ang11 : Ang22);

				}

				else {

					SEang[SEang.length] = ((Ang22 - Ang11 < Math.PI) ? Ang11 : Ang22);
					SEang[SEang.length] = ((Ang22 - Ang11 < Math.PI) ? Ang22 : Ang11);

				}

// Extents of curve only, used for finding appropriate scale for sketch

				Ang2 = SEang[SEang.length-1];  Ang1 = SEang[SEang.length-2];
				var totAng = (Ang2 - Ang1 + 2 * Math.PI) % (2 * Math.PI);

				var Emax = (((Ang2 > 0 && Ang2 - totAng < 0) || (Ang1 < 360 && Ang1 + totAng > 360)) ? parseFloat(ptMt[i][2]) + R : Math.max(parseFloat(ptMt[indexM][2]), parseFloat(ptMt[i + 1][2])));

				var Nmax = (((Ang2 > Math.PI / 2 && Ang2 - totAng < Math.PI / 2) || (Ang1 < Math.PI / 2 && Ang1 + totAng > Math.PI / 2)) ? parseFloat(ptMt[i][1]) + R : Math.max(parseFloat(ptMt[indexM][1]), parseFloat(ptMt[i + 1][1])));

				var Emin = (((Ang2 > Math.PI && Ang2 - totAng < Math.PI) || (Ang1 < Math.PI && Ang1 + totAng > Math.PI)) ? parseFloat(ptMt[i][2]) - R : Math.min(parseFloat(ptMt[indexM][2]), parseFloat(ptMt[i + 1][2])));

				var Nmin = (((Ang2 > Math.PI * 3 / 2 && Ang2 - totAng < Math.PI * 3 / 2) || (Ang1 < Math.PI * 3 / 2 && Ang1 + totAng > Math.PI * 3 / 2)) ? parseFloat(ptMt[i][1]) - R : Math.min(parseFloat(ptMt[indexM][1]), parseFloat(ptMt[i + 1][1])));

				cE[cE.length] = ['P', Nmax, Emin, 0, 'D'];
				cE[cE.length] = ['P', Nmin, Emax, 0, 'D'];

			}

		}

		cM[cM.length] = [0];

// Find appropriate scale for sketch

		var SPar = FindScale(cE.concat(ptMt), Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

		ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		lP = ptMt.length - 1;

		cM = ImgCoord(cM, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);

// Get matrix of scenery points (all existing points)

		var sceneryMatrix = ParsePoints();
		sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and dashed line / curve between sequential points

		var pntsCode = '';

		pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
		pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
		pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

		var ptMt2 = ptMt.slice(0), lP2 = lP;
		ptMt = ImgTrim(ptMt, Canvas);
		lP = ptMt.length - 1;

		pntsCode += Points(Canvas, ptMt, lP, '#000099');
		pntsCode += Labels(Canvas, ptMt, lP, '#000099');

		var indexC = 0;

		for (i=0; i<lP2; i++) {

			if (ptMt2[i][0].search(/\*/) < 0 &&  ptMt2[i + 1][0].search(/\*/) < 0)  {pntsCode += qLine(ptMt2[i], ptMt2[i + 1], Canvas, '#666', 'Dotted');}

			else if (ptMt2[i][0].search(/\*/) >= 0) {

				var hwC = Math.abs(parseInt(cM[indexC][2]) - parseInt(cM[indexC + 1][2]));
				pntsCode += qArc(parseInt(cM[indexC][2]) + hwC/2, parseInt(cM[indexC][1]) + hwC/2, hwC/2, SEang[indexC], SEang[indexC + 1], Canvas,  '#666', 'Dotted');
				indexC += 2;

			}

		}

		qDraw(Canvas, pntsCode, 0);
		
// Draw scale bar

		ScaleBar('PointsControl', Scale);

	}

}

// *******************************************************************************************************************************

function SketchTransform(ptMatrix, Canvas) {

// Sketches the most recent transformation into the appropriate sketch area
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	if (ptMatrix) {

		var ptMt = ptMatrix.slice(0);

		var PSP = $('#TransformCanvasPar').val().split(' ');
		var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

		var SPar = FindScale(ptMt, Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

		ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lP = ptMt.length - 1;

// Get matrix of scenery points (all existing points)

		var sceneryMatrix = ParsePoints();
		sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and appropriate lines between points

		var pntsCode = '';

		pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
		pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
		pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

		var ptMt2 = ptMt.slice(0);  ptMt2.splice(0,lP-8);  var lP2 = ptMt2.length - 1;
		ptMt.splice(lP-8, 8);  ptMt = ImgTrim(ptMt, Canvas);  lP = ptMt.length - 1;
		
		pntsCode += qLine(ptMt2[4], ptMt2[5], Canvas, '#999', 'Dotted');
		pntsCode += qLine(ptMt2[5], ptMt2[7], Canvas, '#999', 'Dotted');
		pntsCode += qLine(ptMt2[7], ptMt2[6], Canvas, '#999', 'Dotted');
		pntsCode += qLine(ptMt2[6], ptMt2[4], Canvas, '#999', 'Dotted');

		if (ptMatrix.length - 1 == 9) {

			ptMt2[4][1] -= 4;  ptMt2[4][2] -= 4;  ptMt2[6][1] += 4;  ptMt2[6][2] += 4;
			ptMt2[7][1] += 4;  ptMt2[7][2] -= 4;  ptMt2[5][1] -= 4;  ptMt2[5][2] += 4;

			pntsCode += qLine(ptMt2[4], ptMt2[6], Canvas, '#999', 'Solid');
			pntsCode += qLine(ptMt2[7], ptMt2[5], Canvas, '#999', 'Solid');

		}

		pntsCode += qLine(ptMt2[0], ptMt2[1], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[1], ptMt2[3], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[3], ptMt2[2], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[2], ptMt2[0], Canvas, '#000099', 'Dashed');

		pntsCode += Points(Canvas, ptMt, lP, '#000099');
		pntsCode += Labels(Canvas, ptMt, lP, '#000099');

		qDraw(Canvas, pntsCode, 0);
		
// Draw scale bar

		ScaleBar('PointsControl', Scale);

	}

}

// *******************************************************************************************************************************

function SketchAdjust(TravList, SideList, SideFromList, StartList, CloseList, Canvas) {

// Sketches the most recent traverse adjustment into the appropriate sketch area
// Input:  Main traverse matrix, sideshot matrix, sideshot companion "from point" vector, start matrix, close matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	if (TravList && StartList && CloseList) {

		var ptMt = TravList.concat(SideList, StartList, CloseList);

		var PSP = $('#AdjustCanvasPar').val().split(' ');
		var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);
		
// Find appropriate scale for sketch

		var SPar = FindScale(ptMt, Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];
		
// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates (for each matrix)

		TravList.push(0); SideList.push(0); StartList.push(0); CloseList.push(0);  // Add null row for complete cycling

		TravMt = ImgCoord(TravList, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lTR = TravMt.length - 1;

		SideMt = ImgCoord(SideList, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lSI = SideMt.length - 1;
		
		StartMt = ImgCoord(StartList, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lST = StartMt.length - 1;
		
		CloseMt = ImgCoord(CloseList, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lCL = CloseMt.length - 1;
		
// Get matrix of scenery points (all existing points)

		var sceneryMatrix = ParsePoints();
		sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lS = sceneryMatrix.length - 1;
		
// Sketch all points and labels (scenery points and labels in muted colour) and appropriate lines between points

		var pntsCode = '';
		
		pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
		pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
		pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');
		
		pntsCode += Points(Canvas, TravMt, lTR, '#000099');
		pntsCode += Labels(Canvas, TravMt, lTR, '#000099');
		
		pntsCode += Points(Canvas, SideMt, lSI, '#000099');
		pntsCode += Labels(Canvas, SideMt, lSI, '#000099');
		
		pntsCode += Points(Canvas, StartMt, lST, '#990000');
		pntsCode += Labels(Canvas, StartMt, lST, '#990000');
		
		pntsCode += Points(Canvas, CloseMt, lCL, '#990000');
		pntsCode += Labels(Canvas, CloseMt, lCL, '#990000');
		
		if (lST > 1) {pntsCode += qLine(StartMt[0], StartMt[1], Canvas, '#990000', 'Dashed');}
		if (lCL > 1) {pntsCode += qLine(CloseMt[0], CloseMt[1], Canvas, '#990000', 'Dashed');}
		
		pntsCode += qLine(TravMt[0], StartMt[lST-1], Canvas, '#000099', 'Dashed');
		for (var i=1; i<lTR; i++) {pntsCode += qLine(TravMt[i], TravMt[i-1], Canvas, '#000099', 'Dashed');}
		
		var thisFrom;
		
		for (var i=0; i<lSI; i++) {

// Fetch current image coords of sideshot from traverse matrix
		
			for (var j=0; j<lTR; j++) {if (TravMt[j][0] == SideFromList[i]) {thisFrom = TravMt[j]; break;}}
			
			pntsCode += qLine(SideMt[i], thisFrom, Canvas, '#000099', 'Dotted');
		
		}
		
		qDraw(Canvas, pntsCode, 0);
		
// Draw scale bar

		ScaleBar('PointsControl', Scale);
		
	}
	
}

// *******************************************************************************************************************************

function SketchBrgBrg(ptMt, Canvas) {

// Sketches the most recent bearing-bearing intersection into the appropriate sketch area
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	if (ptMt) {

		var PSP = $('#IntersectCanvasPar').val().split(' ');
		var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

		var SPar = FindScale(ptMt, Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

		ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lP = ptMt.length - 1;

// Get matrix of scenery points (all existing points)

		var sceneryMatrix = ParsePoints();
		sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and dashed line between sequential points

		var pntsCode = '';

		var ptMt2 = ptMt.slice(0), lP2 = lP;
		ptMt = ImgTrim(ptMt, Canvas);
		lP = ptMt.length - 1;

		pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
		pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
		pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

		pntsCode += Points(Canvas, ptMt, lP, '#000099');

		pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#000099', 'Dashed');

		pntsCode += Labels(Canvas, ptMt, lP, '#000099');
		
		qDraw(Canvas, pntsCode, 0);

	}

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}

// *******************************************************************************************************************************

function SketchBrgDist(ptMt, Canvas, TwoPoints, Line) {

// Sketches the most recent bearing-distance intersection into the appropriate sketch area
// Input:  Points matrix, canvas to sketch, two points flag (1 if both solutions are to be sketched), bearing line vector
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#IntersectCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

	var SPar = FindScale(ptMt, Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lP = ptMt.length - 1;

// Get matrix of scenery points (all existing points)

	var sceneryMatrix = ParsePoints();
	sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and appropriate lines between points

	var pntsCode = '';

	pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
	pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
	pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

	var ptMt2 = ptMt.slice(0), lP2 = lP;
	ptMt = ImgTrim(ptMt, Canvas);
	lP = ptMt.length - 1;

	pntsCode += Points(Canvas, ptMt, lP, '#000099');

	if (TwoPoints) {
		
		var D21	= ptMt2[1][2] - ptMt2[2][2], D22 = ptMt2[1][1] - ptMt2[2][1];
		var Rad2 = Math.sqrt(Math.pow(D21, 2) + Math.pow(D22, 2));
		
		pntsCode += qLine(ptMt2[Line[0]], ptMt2[Line[1]], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qLine(ptMt2[1], ptMt2[3], Canvas,  '#000099', 'Dotted');
		pntsCode += qArc(ptMt2[1][2], ptMt2[1][1], Rad2, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');

	}

	else {
	
		var D11	= ptMt2[1][2] - ptMt2[2][2], D12 = ptMt2[1][1] - ptMt2[2][1];
		var Rad1 = Math.sqrt(Math.pow(D11, 2) + Math.pow(D12, 2));

		pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#000099', 'Dashed');
		pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qArc(ptMt2[1][2], ptMt2[1][1], Rad1, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');

	}

	pntsCode += Labels(Canvas, ptMt, lP, '#000099');
	
	qDraw(Canvas, pntsCode, 0);

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}

// *******************************************************************************************************************************

function SketchDistDist(ptMt, Canvas, TwoPoints) {

// Sketches the most recent distance-distance intersection into the appropriate sketch area
// Input:  Points matrix, canvas to sketch, two points flag (1 if both solutions are to be sketched)
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#IntersectCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

	var SPar = FindScale(ptMt, Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lP = ptMt.length - 1;

// Get matrix of scenery points (all existing points)

	var sceneryMatrix = ParsePoints();
	sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and appropriate lines between points

	var pntsCode = '';

	pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
	pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
	pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

	var ptMt2 = ptMt.slice(0), lP2 = lP;
	ptMt = ImgTrim(ptMt, Canvas);
	lP = ptMt.length - 1;

	pntsCode += Points(Canvas, ptMt, lP, '#000099');

	if (TwoPoints) {
	
		var D1 = ptMt2[0][2] - ptMt2[2][2], D2 = ptMt2[0][1] - ptMt2[2][1];
		var Rad1 = Math.sqrt(Math.pow(D1, 2) + Math.pow(D2, 2));
		
		D1 = ptMt2[1][2] - ptMt2[2][2]; D2 = ptMt2[1][1] - ptMt2[2][1];
		var Rad2 = Math.sqrt(Math.pow(D1, 2) + Math.pow(D2, 2));

		pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qLine(ptMt2[0], ptMt2[3], Canvas, '#000099', 'Dotted');
		pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qLine(ptMt2[1], ptMt2[3], Canvas, '#000099', 'Dotted');
		pntsCode += qArc(ptMt2[0][2], ptMt2[0][1], Rad1, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');
		pntsCode += qArc(ptMt2[1][2], ptMt2[1][1], Rad2, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');

	}

	else {

		var D1 = ptMt2[0][2] - ptMt2[2][2], D2 = ptMt2[0][1] - ptMt2[2][1];
		var Rad1 = Math.sqrt(Math.pow(D1, 2) + Math.pow(D2, 2));
		
		D1 = ptMt2[1][2] - ptMt2[2][2]; D2 = ptMt2[1][1] - ptMt2[2][1];
		var Rad2 = Math.sqrt(Math.pow(D1, 2) + Math.pow(D2, 2));

		pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#000099', 'Dotted');
		pntsCode += qArc(ptMt2[0][2], ptMt2[0][1], Rad1, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');
		pntsCode += qArc(ptMt2[1][2], ptMt2[1][1], Rad2, 0.005, 2 * Math.PI - 0.005, Canvas, '#000099', 'Dashed');

	}

	pntsCode += Labels(Canvas, ptMt, lP, '#000099');
	
	qDraw(Canvas, pntsCode, 0);

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}

// *******************************************************************************************************************************

function SketchPtLine(ptMt, Canvas, Line) {

// Sketches the most recent point to line operation into the appropriate sketch area
// Input:  Points matrix, canvas to sketch, line point numbers
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#InverseCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

	var SPar = FindScale(ptMt, Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lP = ptMt.length - 1;

// Get matrix of scenery points (all existing points)

	var sceneryMatrix = ParsePoints();
	sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lS = sceneryMatrix.length - 1;

// Make diminished matrix of points, excluding calc point

	var dimMatrix = [ptMt[0], ptMt[1], ptMt[2], ptMt[4]];

// Sketch all points and labels (scenery points and labels in muted colour) and lines between appropriate points

	var pntsCode = '';

	pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
	pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
	pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');

	var ptMt2 = ptMt.slice(0), lP2 = lP;
	ptMt = ImgTrim(ptMt, Canvas);  lP = ptMt.length - 1;
	dimMatrix = ImgTrim(dimMatrix, Canvas);  lD = dimMatrix.length - 1;

	pntsCode += Points(Canvas, dimMatrix, lD, '#000099');

	pntsCode += qLine(ptMt2[Line[0]], ptMt2[Line[1]], Canvas, '#000099', 'Dashed');
	pntsCode += qLine(ptMt2[2], ptMt2[3], Canvas, '#000099', 'Dotted');
	
	pntsCode += Labels(Canvas, dimMatrix, lP - 1, '#000099');

	qDraw(Canvas, pntsCode, 0);

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}

// *******************************************************************************************************************************

function SketchPtPt(ptMt, Canvas) {

// Sketches the most recent point to point operation of two or many points into the appropriate sketch area
//		* Works as a default sketch for all operations when no operation has been performed *
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#' + qG('header').innerHTML + 'CanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

	if (ptMt) {

		var SPar = FindScale(ptMt, Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

		ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
		var lP = ptMt.length - 1;
		
	}

// If no points matrix provided, produce scale based on all points
	
	else {
		
		var ptMtDummy = ParsePoints();
		var SPar = FindScale(ptMtDummy, Wc, Hc);
		var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];
		
	}

// Get matrix of scenery points (all existing points)

	var sceneryMatrix = ParsePoints();
	sceneryMatrix = ImgCoord(sceneryMatrix, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lS = sceneryMatrix.length - 1;

// Sketch all points and labels (scenery points and labels in muted colour) and dashed line between sequential points

	var pntsCode = '';
	
	pntsCode += AllLines(Canvas, sceneryMatrix, lS, 1);
	pntsCode += Points(Canvas, sceneryMatrix, lS, '#999');
	pntsCode += Labels(Canvas, sceneryMatrix, lS, '#999');
	
	if (ptMt) {

		var ptMt2 = ptMt.slice(0), lP2 = lP;
		ptMt = ImgTrim(ptMt, Canvas);
		lP = ptMt.length - 1;

		pntsCode += Points(Canvas, ptMt, lP, '#000099');

		for (var i=0; i<lP2-1; i++)  {
			
			pntsCode += qLine(ptMt2[i], ptMt2[i + 1], Canvas, '#000099', 'Dashed');
			
		}

		pntsCode += Labels(Canvas, ptMt, lP, '#000099');
		
	}
	
	qDraw(Canvas, pntsCode, 0);

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}

// *******************************************************************************************************************************

function SketchCurve(ptMt, Canvas) {

// Sketches the most recent triangle solve operation into the appropriate sketch area
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#SolverCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// If no points matrix was provided, create standard display curve

	var PMdef = 1;

	if (ptMt == '') {

		var R = 1;  var D = 82 * Math.PI / 180;  T = R * Math.tan(D / 2);  C = 2 * R * Math.sin(D / 2);

		var ptMt = new Array(11);
		ptMt[0] = ['D', 0, 0, 0, 'D'];
		ptMt[1] = ['BC', R * Math.cos(-1 * D / 2), R * Math.sin(-1 * D / 2), 0, 'BC'];
		ptMt[2] = ['EC', R * Math.cos(D / 2), R * Math.sin(D / 2), 0, 'EC'];

		var tBrg1 = ((D < Math.PI) ? Math.PI / 2 - D / 2 : 3 * Math.PI / 2 - D / 2);
		var tBrg2 = ((D < Math.PI) ? D / 2 - Math.PI / 2 : D / 2 - 3 * Math.PI / 2);

		ptMt[3] = ['PI', T * Math.cos(tBrg1) + ptMt[1][1], T * Math.sin(tBrg1) + ptMt[1][2], 0, 'PI'];
		ptMt[4] = ['C', ptMt[1][1], ptMt[1][2] + C / 2, 0, 'C'];
		ptMt[5] = ['L', R, 0, 0, 'L'];
		ptMt[6] = ['T', T / 2 * Math.cos(tBrg1) + ptMt[1][1], T / 2 * Math.sin(tBrg1) + ptMt[1][2], 0, 'T'];
		ptMt[7] = ['T', T / 2 * Math.cos(tBrg2) + ptMt[2][1], T / 2 * Math.sin(tBrg2) + ptMt[2][2], 0, 'T'];
		ptMt[8] = ['R', R / 2 * Math.cos(-1 * D / 2), R / 2 * Math.sin(-1 * D / 2), 0, 'R'];
		ptMt[9] = ['R', R / 2 * Math.cos(D / 2), R / 2 * Math.sin(D / 2), 0, 'R'];
		ptMt[10] = [0];

		PMdef = 0;

	}

	var lP = ptMt.length - 1;

// Find curve parameters for finding curve scale

	var R = PtPtInverse(0, ptMt[0], ptMt[1])[0];
	var D = PtPtInverse(0, ptMt[0], ptMt[2])[2] * 2;

	var Emax = ((D > Math.PI) ? R : ptMt[2][2]);
	var Emin = ((D > Math.PI) ? -1 * R : ptMt[1][2]);
	var cE = new Array(3);  cE[0] = ['P', R, Emin, 0, 'D'];  cE[1] = ['P', R, Emax, 0, 'D'];  cE[2] = [0];
	var toAng = (5 * Math.PI / 2 - (2 * Math.PI - D / 2)) % (2 * Math.PI);
	var frAng = (5 * Math.PI / 2 - D / 2) % (2 * Math.PI);

// Eliminate PI point if delta is in region that is impractical to sketch

	if (D > 175 * Math.PI / 180 && D < 185 * Math.PI / 180) {

		ptMt[3][1] = 0;  ptMt[3][2] = 0;  ptMt.splice(6, 1);  ptMt.splice(6, 1);

	}

// Find appropriate scale for sketch

	var SPar = FindScale(cE.concat(ptMt), Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);

// Sketch curve with labels on important components

	var pntsCode = '';

	var ptMt2 = ptMt.slice(0), lP2 = lP;
	ptMt = ImgTrim(ptMt, Canvas);
	lP = ptMt.length - 1;

	pntsCode += qLine(ptMt2[0], ptMt2[1], Canvas, '#666', 'Dotted');
	pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#666', 'Dotted');
	pntsCode += qLine(ptMt2[1], ptMt2[2], Canvas, '#666', 'Dotted');

	if (D <= 175 * Math.PI / 180 || D >= 185 * Math.PI / 180) {

		pntsCode += qLine(ptMt2[1], ptMt2[3], Canvas, '#666', 'Dotted');
		pntsCode += qLine(ptMt2[2], ptMt2[3], Canvas, '#666', 'Dotted');

	}

	pntsCode += qArc(ptMt2[0][2], ptMt2[0][1], R * Scale, frAng, toAng, Canvas, '#666', 'Dotted');
	
	pntsCode += Labels(Canvas, ptMt, lP, '#000099');

	qDraw(Canvas, pntsCode, 0);

// Draw scale bar

	if (PMdef) {ScaleBar('PointsControl', Scale);}
	else {ScaleBar('PointsControl', 0);}

}

// *******************************************************************************************************************************

function SketchTriangle(ptMt, Canvas) {

// Sketches the most recent triangle solve operation into the appropriate sketch area
// Input:  Points matrix, canvas to sketch
// Output: The updated sketch of the operation

// Find width and height of canvas

	var PSP = $('#SolverCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// If no points matrix was provided, create standard display triangle

	var PMdef = 1;

	if (ptMt == '') {

		ptMt = new Array(7);
		ptMt[0] = ['B', 0, 0, 0, 'B'];
		ptMt[1] = ['C', 0, 6, 0, 'C'];
		ptMt[2] = ['A', 4, 3, 0, 'A'];
		ptMt[3] = ['a', 0, 3, 0, 'a'];
		ptMt[4] = ['c', 2, 1.5, 0, 'c'];
		ptMt[5] = ['b', 2, 4.5, 0, 'b'];
		ptMt[6] = [0];

		PMdef = 0;

	}

	var lP = ptMt.length - 1;

// Find appropriate scale for sketch

	var SPar = FindScale(ptMt, Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);

// Sketch triangle with labels on angles and sides

	var pntsCode = '';

	var ptMt2 = ptMt.slice(0), lP2 = lP;
	ptMt = ImgTrim(ptMt, Canvas);
	lP = ptMt.length - 1;

	for (var i=0; i<2; i++) {pntsCode += qLine(ptMt2[i], ptMt2[i + 1], Canvas, '#666', 'Dotted');}
	pntsCode += qLine(ptMt2[0], ptMt2[2], Canvas, '#666', 'Dotted');

// If two triangles were provided (ambiguous case), sketch the second one

	if (lP2 > 6) {

		for (var i=6; i<8; i++) {pntsCode += qLine(ptMt2[i], ptMt2[i + 1], Canvas, '#666', 'Dotted');}
		pntsCode += qLine(ptMt2[6], ptMt2[8], Canvas, '#666', 'Dotted');

	}

	pntsCode += Labels(Canvas, ptMt, lP, '#000099');

	qDraw(Canvas, pntsCode, 0);
	
// Draw scale bar

	if (PMdef) {ScaleBar('PointsControl', Scale);}
	else {ScaleBar('PointsControl', 0);}

}

// *******************************************************************************************************************************

function SketchPoints() {

// Sketches the current points into the sketch area
// Input:  None
// Output: The updated sketch of the points

// Parse the existing points file contents into a points matrix

	var ptMt = ParsePoints();
	
	var Canvas = 'SVGCanvas';

	var PSP = $('#PointsCanvasPar').val().split(' ');
	var Wc = parseFloat(PSP[0]), Hc = parseFloat(PSP[1]), Xc = parseFloat(PSP[2]), Yc = parseFloat(PSP[3]);

// Find appropriate scale for sketch

	var SPar = FindScale(ptMt, Wc, Hc);
	var Scale = SPar[0], Xmax = SPar[1], Xmin = SPar[2], Ymax = SPar[3], Ymin = SPar[4];

// Convert matrix of Northings and Eastings into matrix of X and Y image coordinates

	ptMt = ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, 1, Canvas);
	var lP = ptMt.length - 1;

// Sketch points

	var SkCode = '';

	SkCode += AllLines(Canvas, ptMt, lP, 0);
	SkCode += Points(Canvas, ptMt, lP, '#000099');
	SkCode += Labels(Canvas, ptMt, lP, '#000099');
	
	qDraw(Canvas, SkCode, 0);

// Draw scale bar

	ScaleBar('PointsControl', Scale);

}



// --------------------------------------------------
//  General
// --------------------------------------------------
	
// *******************************************************************************************************************************

function Points(Canvas, ptMt, lP, Color) {

// Draws points into the canvas
// Input:  Canvas ID, matrix of points to draw, matrix length, point color
// Output: The updated sketch with the new points added

	var pntsCode = '';
	
	for (var i=0; i<lP; i++) {
	
		pntsCode += '<circle class="pt-basic" cx="' + (ptMt[i][2]) + '" cy="' + (ptMt[i][1]) + '" r="2" fill="' + Color + '" fill-opacity="1" stroke="' + Color + '" stroke-width="12" stroke-opacity="0" ';
		pntsCode += 'onmouseover="evt.target.setAttribute(\'r\', \'8\'); evt.target.setAttribute(\'fill-opacity\', \'0.1\'); evt.target.setAttribute(\'stroke-width\', \'2\'); evt.target.setAttribute(\'stroke-opacity\', \'0.5\');"';
		pntsCode += 'onmouseout="evt.target.setAttribute(\'r\', \'2\'); evt.target.setAttribute(\'fill-opacity\', \'1\'); evt.target.setAttribute(\'stroke-width\', \'12\'); evt.target.setAttribute(\'stroke-opacity\', \'0\');"';
		pntsCode += 'onclick="evt.stopPropagation(); PtClickSwitch(\'' + (ptMt[i][0]) + '\');"';
		pntsCode += '><title>' + ptMt[i][0].replace(/\*/g,'') + ' | ' + FormatDecimal(ptMt[i][3], 0, 0).trim() + ' | ' + ptMt[i][4] + '</title>';
		pntsCode += '</circle>';
		
	} 
	
	return pntsCode;

}

// *******************************************************************************************************************************

function Labels(Canvas, ptMt, lP, Color) {

// Draws point labels into the canvas
// Input:  Canvas ID, matrix of points to draw, matrix length, point color
// Output: The updated sketch with the new labels added

// Label parameters

	var fSize = 12;	var fFamily = 'sans-serif';	var xOff = 5; var yOff = 4;

// Set label type

	var Header = qG('header').innerHTML;

	if (Header != 'Solver') {

		var Title = qG('LabelLink');
		var Titles = ['Point Name', 'Elevation', 'Description', 'None'];
		var Index = [0, 3, 4, -1];

		for (var i=0; i<Titles.length; i++) {if (Title.innerHTML.split('</i>')[1] == Titles[i])  break;}
		var k = Index[i];

	}

	else  var k = 0;
	
// Collect SVG code and add to canvas if necessary
	
	var pntsCode = '';
	
	if (k == 0 || k == 4 || k == 3) {
	
		var textLabel;
	
		for (i=0; i<lP; i++) {
			
			if (k == 3) {textLabel = FormatDecimal(ptMt[i][k], 0, 0).trim(); textLabel = (parseInt(textLabel) == 0 ? '--' : textLabel);}
			else {textLabel = ptMt[i][k].replace(/\*/g,'');}
			
			pntsCode += '<text x="' + (ptMt[i][2] + xOff) + '" y="' + (ptMt[i][1] + yOff) + '" font-family="' + fFamily + '" font-size="' + fSize + '" fill="' + Color + '">' + textLabel + '</text>';
			
		}

	}
	
	return pntsCode;
	
}

// *******************************************************************************************************************************

function FindScale(ptMt, Width, Height) {

// Finds an appropriate scale for a given sketch using points matrix and the target div
// Input:  Points matrix and target canvas div
// Output: The maximum possible scale, max and min values for both northing and easting

// Find maximum range of northings and eastings

	var lP = ptMt.length;
	var Ymax = -10e25, Xmax = -10e25, Ymin = 10e25, Xmin = 10e25;

	for (var i=0; i<lP; i++) {

		var Xi = parseFloat(ptMt[i][2]), Yi = parseFloat(ptMt[i][1]);
		if (Yi > Ymax)  Ymax = Yi;  if (Yi < Ymin)  Ymin = Yi;  if (Xi > Xmax)  Xmax = Xi;  if (Xi < Xmin)  Xmin = Xi;

	}

	var RangeN = Ymax - Ymin, RangeE = Xmax - Xmin;

// Calculate maximum scale in both directions, and return minimum

	var ScaleN = ((RangeN) ? Height / RangeN : 10e25), ScaleE = ((RangeE) ? Width / RangeE : 10e25);
	return[Math.min(ScaleE, ScaleN), Xmax, Xmin, Ymax, Ymin];

}

// *******************************************************************************************************************************

function ImgCoord(ptMt, Scale, Xmax, Xmin, Ymax, Ymin, Xc, Yc, Wc, Hc, ForceAll, Canvas) {

// Changes matrix of point northings and eastings into X and Y image coordinates
// Input:  Points matrix and the defined scale, max and min values for X and Y, width and height of target div, force all points flag (1 for no delete)
// Output: A matrix of X and Y image coordinates

	var lP = ptMt.length - 1;

// Get further easel and canvas dimensions and positions

	var Easel = Canvas.replace(/Canvas/, 'Easel'), jCanvas = '#' + Canvas, jEasel = '#' + Easel;
	var WcReal = $(jCanvas).outerWidth(), HcReal = $(jCanvas).outerHeight(), XcReal = $(jCanvas).offset().left, YcReal = $(jCanvas).offset().top;

// Find X and Y padding, convert northings and eastings to image coordinates

	var PadX = (Wc - (Xmax - Xmin) * Scale) / 2, PadY = (Hc - (Ymax - Ymin) * Scale) / 2;

	for (var i=0; i<lP; i++) {

		var Xval = Math.round((parseFloat(ptMt[i][2]) - Xmin) * Scale + PadX - XcReal + Xc);
		var Yval = Math.round((Ymax - parseFloat(ptMt[i][1])) * Scale + PadY - YcReal + Yc);

		if ((Yval < 0 || Yval > HcReal || Xval < 0 || Xval > WcReal) && !ForceAll) {ptMt.splice(i, 1);  lP -= 1;  i -= 1;}
		else {ptMt[i][1] = Yval;  ptMt[i][2] = Xval;}

	}

	return(ptMt);

}

// *******************************************************************************************************************************

function ScaleBar(Canvas, Scale) {

// Draws scale bar into the current open sketch at a fixed position
// Input:  The open graphics canvas object and its working scale
// Output: The updated sketch, including the scale bar, if drawing is at a sensible scale

	qDraw(Canvas, '', 0);

// Define optimal length of line, and base scale factor multiples

	var OptimalWidth = 36, BaseScales = [10, 15, 20, 25, 40, 50, 75, 100];

// Find appropriate scale, an order of magnitude of a base factor, and bar width

	if (Scale > 0) {

		var Factor = OptimalWidth / Scale;

		while (Factor > BaseScales[BaseScales.length - 1] || Factor < BaseScales[0]) {

			Factor = ((Factor > BaseScales[BaseScales.length - 1]) ? Factor / 10 : (Factor < BaseScales[0]) ? Factor * 10 : Factor);

		}

		var Index = 0, Max = 100;

		for (var i=0; i<BaseScales.length; i++) {

			if (Math.abs(BaseScales[i] - Factor) < Max) {Index = i;  Max = Math.abs(BaseScales[i] - Factor);}

		}

		var BarWidth = Math.round(BaseScales[Index] * OptimalWidth / (Factor * 2)) * 2;
		var Mult = ((OptimalWidth / (Scale * Factor) >= 1) ? Math.round(OptimalWidth / (Scale * Factor)) : 1 / Math.round((Scale * Factor) / OptimalWidth));

		Factor = BaseScales[Index] * Mult;  Factor = Round(Factor, 8);

// Output results to provided control canvas

		if (Factor > 0) {
			
			var pntsCode = '', Color1 = '#666', Color2 = '#f9f9f9', Color3 = '#ccc';

			pntsCode += '<rect x="8" y="175" width="54" height="22" rx="2" ry="2" fill="' + Color2 + '" style="stroke:' + Color3 + '; stroke-width:3" />';
			pntsCode += '<text x="35" y="186" text-anchor="middle" font-family="sans-serif" font-size="9" fill="' + Color1 + '">' + Factor + '</text>';
			pntsCode += '<line x1="' + (35 - BarWidth / 2) + '" y1="191" x2="' + (35 + BarWidth / 2) + '" y2="191" style="stroke:' + Color1 + '; stroke-width:3" />';

			qDraw(Canvas, pntsCode, 0);

		}

	}

}

// *******************************************************************************************************************************

function DrawControls() {

// Draws the sketch control buttons
// Input:  None
// Output: The click-able SVG elements for controlling the sketch

	var Canvas = 'PointsButtons', pntsCode = '', ColorBG = '#fff', Color1 = '#666', Color2 = '#eee', Color3 = '#ccc';
	
	pntsCode += '<circle cx="35" cy="35" r="21" fill="' + ColorBG + '" style="stroke:' + Color3 + '; stroke-width:5" />';
	
// North arrow control (Triangles are 8 high and 12 wide)
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="PanSketch(0, 1)"><title>Pan up ( up arrow )</title>';
	pntsCode += '<circle cx="35" cy="14" r="10" fill="' + Color1 + '" style="stroke:' + ColorBG + '; stroke-width:3" />';
	pntsCode += '<path d="M 35,8 l 6,8 l -12,0 Z" fill="' + Color2 + '" /></a>'
	
// East arrow control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="PanSketch(-1, 0)"><title>Pan right ( right arrow )</title>';
	pntsCode += '<circle cx="56" cy="35" r="10" fill="' + Color1 + '" style="stroke:' + ColorBG + '; stroke-width:3" />';
	pntsCode += '<path d="M 62,35 l -8,6 l 0,-12 Z" fill="' + Color2 + '" /></a>'
	
// South arrow control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="PanSketch(0, -1)"><title>Pan down ( down arrow )</title>';
	pntsCode += '<circle cx="35" cy="56" r="10" fill="' + Color1 + '" style="stroke:' + ColorBG + '; stroke-width:3" />';
	pntsCode += '<path d="M 35,62 l -6,-8 l 12,0 Z" fill="' + Color2 + '" /></a>'
	
// West arrow control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="PanSketch(1, 0)"><title>Pan left ( left arrow )</title>';
	pntsCode += '<circle cx="14" cy="35" r="10" fill="' + Color1 + '" style="stroke:' + ColorBG + '; stroke-width:3" />';
	pntsCode += '<path d="M 8,35 l 8,-6 l 0,12 Z" fill="' + Color2 + '" /></a>'
	
// Zoom in control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="ZoomSketch(1, 0, 0)"><title>Zoom in ( Page Up )</title>';
	pntsCode += '<rect x="22" y="74" width="26" height="26" rx="3" ry="3" fill="' + ColorBG + '" />';
	pntsCode += '<line x1="28" y1="87" x2="42" y2="87" style="stroke:' + Color1 + '; stroke-width:4" />';
	pntsCode += '<line x1="35" y1="80" x2="35" y2="94" style="stroke:' + Color1 + '; stroke-width:4" /></a>';

// Zoom all control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="ZoomSketch(0, 0, 0)"><title>Refresh ( Home )</title>';
	pntsCode += '<rect x="22" y="108" width="26" height="26" rx="3" ry="3" fill="' + ColorBG + '" />';
	pntsCode += '<circle cx="35" cy="121" r="5" fill="' + Color1 + '" /></a>';
	
// Zoom out control
	pntsCode += '<a xlink:href="javascript:void(0);" onclick="ZoomSketch(-1, 0, 0)"><title>Zoom out ( Page Down )</title>';
	pntsCode += '<rect x="22" y="142" width="26" height="26" rx="3" ry="3" fill="' + ColorBG + '" />';
	pntsCode += '<line x1="28" y1="155" x2="42" y2="155" style="stroke:' + Color1 + '; stroke-width:4" /></a>';
	
	qDraw(Canvas, pntsCode, 0);

}

// *******************************************************************************************************************************

function psLineEnd(F, C, Canvas) {

// Produces line endpoints to the edge of the canvas from lines extending off the canvas
// Input:  Fixed point, change point, canvas
// Output: The updated change point

// If point is on canvas, return

	var WcReal = $('#' + Canvas).outerWidth(), HcReal = $('#' + Canvas).outerHeight();
	if (C[2] > 0 && C[2] < WcReal && C[1] > 0 && C[1] < HcReal)  return C;

// If not, place virtual point on line at edge of canvas by similar triangles

	if (C[2] < 0) {C[1] = Math.round(C[1] + (F[1] - C[1]) / (F[2] - C[2]) * (-1 * C[2]));  C[2] = 0;}
	else if (C[2] > WcReal) {C[1] = Math.round(C[1] + (F[1] - C[1]) / (F[2] - C[2]) * (WcReal - C[2]));  C[2] = WcReal;}
	if (C[1] < 0) {C[2] = Math.round(C[2] + (F[2] - C[2]) / (F[1] - C[1]) * (-1 * C[1]));  C[1] = 0;}
	else if (C[1] > HcReal) {C[2] = Math.round(C[2] + (F[2] - C[2]) / (F[1] - C[1]) * (HcReal - C[1]));  C[1] = HcReal;}

// If non-real results (no intersection with canvas) place change point at fixed point so no line will be drawn

	if (isNaN(C[1]) || isNaN(C[2])) {C[1] = F[1];  C[2] = F[2];}  return C;

}

// *******************************************************************************************************************************

function ImgTrim(ptMt, Canvas) {

// Eliminates point that do not fall within the drawing canvas
// Input:  Points Matrix (image coords), drawing canvas
// Output: The updated points matrix

	var WcReal = $('#' + Canvas).outerWidth(), HcReal = $('#' + Canvas).outerHeight(), lP = ptMt.length - 1;
	for (var i=0; i<lP; i++) if (ptMt[i][1] < 0 || ptMt[i][1] > HcReal || ptMt[i][2] < 0 || ptMt[i][2] > WcReal) {ptMt.splice(i, 1); lP -= 1; i -= 1;}
	return ptMt;

}

// *******************************************************************************************************************************

function GetLT(Type) {

// Forms the SVG code for a given line type 
// Input:  Requested line type
// Output: The SVG code for the requested line

	if	(Type == 'Solid') 	{return '';}
	if	(Type == 'Dashed')	{return ' stroke-dasharray="10,10"';}
	if	(Type == 'Dotted')	{return ' stroke-dasharray="2,2"';}
	
}

// *******************************************************************************************************************************

function qLine(F, T, Canvas, Color, Type, LineID) {

// Sketches a line between two points for as long as the line is on the canvas
// Input:  From point, to point, canvas ID, color, line type, line ID (optional)
// Output: The SVG code for the requested line

// Create virtual internal endpoints for lines ending outside the canvas, draw line if endpoints unequal
	
	var Fr = F.slice(0), To = T.slice(0);
	Fr = psLineEnd(To, Fr, Canvas);  To = psLineEnd(Fr, To, Canvas);
	
	if (!(Fr[1] == To[1] && Fr[2] == To[2])) {
		
		var LineCode = '';
		
		LineCode += '<line' + GetLT(Type) + ' x1="' + (Fr[2]) + '" y1="' + (Fr[1]) + '" x2="' + (To[2]) + '" y2="' + (To[1]) + '" style="stroke:' + Color + '; stroke-width:1" />';

// If provided ID, make lines clickable with second transparent line
		
		if (LineID) {
		
				LineCode += '<line x1="' + (Fr[2]) + '" y1="' + (Fr[1]) + '" x2="' + (To[2]) + '" y2="' + (To[1]) + '" ';
				LineCode += 'onclick="LineClickSwitch(\'' + LineID + '\');" ';
				LineCode += 'onmouseover="evt.target.setAttribute(\'stroke-opacity\', \'0.1\');" ';
				LineCode += 'onmouseout="evt.target.setAttribute(\'stroke-opacity\', \'0\');" ';
				LineCode += 'style="stroke:' + Color + '; stroke-width:16" stroke-linecap="round" stroke-opacity="0" />';
			
		}
		
		return LineCode;
	
	}

}

// *******************************************************************************************************************************

function qArc(Xc, Yc, R, As, Ae, Canvas, Color, Type, LineID) {

// Draws an arc on the working canvas, or a series of arcs if the required arc exceeds the canvas bounds
// Input:  Arc centre and radius, start angle, end angle, canvas, line type, line ID (optional)
// Output: The SVG code for the requested arc or series of arcs

// If curve is within canvas extents, draw curve and return

	var LongFlag, SweepAngle, arcCode = '';

	var WcReal = $('#' + Canvas).parent().outerWidth(), HcReal = $('#' + Canvas).parent().outerHeight();

	if (Xc - R > 0 && Yc - R > 0 && Xc + R < WcReal && Yc + R < HcReal)  {
		
		SweepAngle = (Ae - As < 0 ? Ae - As + 2 * Math.PI : Ae - As);
		LongFlag = (SweepAngle > Math.PI ? 1 : 0);
		
		arcCode += '<path' + GetLT(Type) + ' d="M' + (Xc + R * Math.cos(As)) + ', ' + (Yc - R * Math.sin(As)) + ' A ' + R + ' ' + R + ' 0 ' + LongFlag + ' 0 ' + (Xc + R * Math.cos(Ae)) + ' ' + (Yc - R * Math.sin(Ae)) + '" style="stroke:' + Color + '; stroke-width:1" fill="none" />';
		
		if (LineID) {
		
			arcCode += '<path d="M' + (Xc + R * Math.cos(As)) + ', ' + (Yc - R * Math.sin(As)) + ' A ' + R + ' ' + R + ' 0 ' + LongFlag + ' 0 ' + (Xc + R * Math.cos(Ae)) + ' ' + (Yc - R * Math.sin(Ae)) + '" ';
			arcCode += 'onclick="LineClickSwitch(\'' + LineID + '\');" ';
			arcCode += 'onmouseover="evt.target.setAttribute(\'stroke-opacity\', \'0.1\');" ';
			arcCode += 'onmouseout="evt.target.setAttribute(\'stroke-opacity\', \'0\');" ';
			arcCode += 'style="stroke:' + Color + '; stroke-width:16" stroke-linecap="round" stroke-opacity="0" fill="none" />';
			
		}
		
		return arcCode;
		
	}

// Find all possible intersections with real canvas and start and end points of requested arc

	var Ints = new Array(10);

	Ints[0] = [Math.round(Xc - Math.sqrt(Math.pow(R, 2) - Math.pow(Yc, 2))), 0, 0, 'A\n'];
	Ints[1] = [Math.round(Xc + Math.sqrt(Math.pow(R, 2) - Math.pow(Yc, 2))), 0, 0, 'B\n'];
	Ints[2] = [Math.round(Xc - Math.sqrt(Math.pow(R, 2) - Math.pow(HcReal - Yc, 2))), HcReal, 0, 'C\n'];
	Ints[3] = [Math.round(Xc + Math.sqrt(Math.pow(R, 2) - Math.pow(HcReal - Yc, 2))), HcReal, 0, 'D\n'];
	Ints[4] = [0, Math.round(Yc - Math.sqrt(Math.pow(R, 2) - Math.pow(Xc, 2))), 0, 'E\n'];
	Ints[5] = [0, Math.round(Yc + Math.sqrt(Math.pow(R, 2) - Math.pow(Xc, 2))), 0, 'F\n'];
	Ints[6] = [WcReal, Math.round(Yc - Math.sqrt(Math.pow(R, 2) - Math.pow(WcReal - Xc, 2))), 0, 'G\n'];
	Ints[7] = [WcReal, Math.round(Yc + Math.sqrt(Math.pow(R, 2) - Math.pow(WcReal - Xc, 2))), 0, 'H\n'];
	Ints[8] = [Math.round(Xc + Math.cos(As) * R), Math.round(Yc - Math.sin(As) * R), As, 'St\n'];
	Ints[9] = [Math.round(Xc + Math.cos(Ae) * R), Math.round(Yc - Math.sin(Ae) * R), Ae, 'End\n'];

// Place solutions that lie on the canvas edge or inside the canvas into a matrix with their corresponding angles

	var Sols = new Array(0);

	for (var i=0; i<=9; i++) {

		if (Ints[i][0] >= 0 && !isNaN(Ints[i][0]) && Ints[i][0] <= WcReal && Ints[i][1] >= 0 && !isNaN(Ints[i][1]) && Ints[i][1] <= HcReal) {

			Sols[Sols.length] = Ints[i];  var lS = Sols.length - 1;
			Sols[lS][2] = Math.atan2(Sols[lS][1] - Yc, Sols[lS][0] - Xc);
			Sols[lS][2] = ((Sols[lS][2] < 0) ? 2 * Math.PI + Sols[lS][2] : Sols[lS][2]);

		}

	}

	var StAng = Math.atan2(Ints[8][1] - Yc, Ints[8][0] - Xc);  StAng = ((StAng < 0) ? 2 * Math.PI + StAng : StAng);
	var EndAng = Math.atan2(Ints[9][1] - Yc, Ints[9][0] - Xc);  EndAng = ((EndAng < 0) ? 2 * Math.PI + EndAng : EndAng);

// Remove results that are not between start and end angles

	for (var i=0; i<=lS; i++) {

		var AngChk = 0;

			var Ang = Sols[i][2];
			if (StAng - EndAng > 0 && (Ang < StAng && Ang > EndAng))  AngChk = 1;
			if (StAng - EndAng < 0 && (Ang == 0 || (Ang < 2 * Math.PI && Ang > EndAng) || (Ang > 0 && Ang < StAng)))  AngChk = 1;
			if (Ang == StAng || Ang == EndAng)  AngChk = 1;

		if (!AngChk) {Sols.splice(i, 1);  i--;  lS--;}

	}

// If resulting matrix is longer than 0, sort matrix of intersection results by angle

	if (Sols.length > 0)  Sols.sort(sortAng);
	else  return;

// Draw arcs between all appropriate resulting intersection pairs

	var BChk = 0;

	for (i=0; i<=lS; i++) {

		var E = ((i < lS) ? Sols[i + 1][2] : Sols[0][2]), S = Sols[i][2];

		if (E - S > 0) {

			if (Math.PI / 2 <= E && Math.PI / 2 >= S && Yc + R > HcReal) {BChk = 1;  break;}
			if (Math.PI <= E && Math.PI > S && Xc - R < 0) {BChk = 1;  break;}
			if (3 * Math.PI / 2 <= E && 3 * Math.PI / 2 >= S && Yc - R < 0) {BChk = 1;  break;}

		}

		if (E - S < 0) {

			if (Math.PI / 2 >= S && Yc + R > HcReal) {BChk = 1;  break;}
			if (Math.PI >= S && Xc - R < 0) {BChk = 1;  break;}
			if (3 * Math.PI / 2 >= S && Yc - R < 0) {BChk = 1;  break;}
			if (Xc + R > WcReal) {BChk = 1;  break;}

		}

	}

	if (i % 2 == 0 && BChk) {Sols[Sols.length] = Sols[0];  Sols.splice(0,1);}
	
	var As2, Ae2;
	
	for (i=0; i<=lS-1; i+=2) {
	
		As2 = 2 * Math.PI - Sols[i + 1][2]; Ae2 = 2 * Math.PI - Sols[i][2];
		
		SweepAngle = (Ae2 - As2 < 0 ? Ae2 - As2 + 2 * Math.PI : Ae2 - As2);
		LongFlag = (SweepAngle > Math.PI ? 1 : 0);
		
		arcCode += '<path' + GetLT(Type) + ' d="M' + (Xc + R * Math.cos(As2)) + ', ' + (Yc - R * Math.sin(As2)) + ' A ' + R + ' ' + R + ' 0 ' + LongFlag + ' 0 ' + (Xc + R * Math.cos(Ae2)) + ' ' + (Yc - R * Math.sin(Ae2)) + '" style="stroke:' + Color + '; stroke-width:1" fill="none" />';
		
		if (LineID) {
		
			arcCode += '<path d="M' + (Xc + R * Math.cos(As2)) + ', ' + (Yc - R * Math.sin(As2)) + ' A ' + R + ' ' + R + ' 0 ' + LongFlag + ' 0 ' + (Xc + R * Math.cos(Ae2)) + ' ' + (Yc - R * Math.sin(Ae2)) + '" ';
			arcCode += 'onclick="LineClickSwitch(\'' + LineID + '\');" ';
			arcCode += 'onmouseover="evt.target.setAttribute(\'stroke-opacity\', \'0.1\');" ';
			arcCode += 'onmouseout="evt.target.setAttribute(\'stroke-opacity\', \'0\');" ';
			arcCode += 'style="stroke:' + Color + '; stroke-width:16" stroke-linecap="round" stroke-opacity="0" fill="none" />';
			
		}
		
	};
	
	return arcCode;

}

// The following function helps to sort the Solutions Matrix by the angles column through the sort() method

function sortAng(a, b) {return ((a[2] < b[2]) ? -1 : ((a[2] > b[2]) ? 1 : 0));}

// *******************************************************************************************************************************

function qDraw(Canvas, SVG, addCode) {

// Draws SVG code onto the current canvas, using techniques friendly to IE 9-11 (innerHTML not available for SVG elements)
// Input:  Canvas ID, SVG code, add flag (0 to replace, 1 to add to existing contents)
// Output: The SVG code correctly added/replaced on the canvas

	var svgExisting = '', holdDiv, svgNew, svgNode = qG(Canvas);;

// Delete current contents

	if (!addCode) {while (svgNode.firstChild) {svgNode.removeChild(svgNode.firstChild);}}
	
// Write all SVG contents as required

	holdDiv = document.createElement('div');
	svgNew = '<svg>' + svgExisting + SVG + '</svg>';
	holdDiv.innerHTML = '' + svgNew;
	Array.prototype.slice.call(holdDiv.childNodes[0].childNodes).forEach(function(el) {svgNode.appendChild(el);});

}



// --------------------------------------------------
//  Linework
// --------------------------------------------------
	
// *******************************************************************************************************************************

function OutputLines(lineMt, lL) {

// Outputs given (checked) matrix to line summary textbox (hidden)
// Input:  Lines matrix, length of lines matrix
// Output: The new contents of the text box (hidden)

// Update hidden lines matrix textbox

	var lineStr = '';

	for (var i=0; i<lL; i++) {

		lineStr += lineMt[i][0] + ' '; 
		lineStr += lineMt[i][1] + ' ';
		lineStr += lineMt[i][2] + ' ';
		lineStr += lineMt[i][3] + ' ';
		lineStr += lineMt[i][4] + ' ';
		lineStr += lineMt[i][5] + '\n';

	}

	LinesField = qG('linesContents');
	LinesField.value = lineStr;

}

// *******************************************************************************************************************************

function CheckLines(lineMt) {

// Checks, corrects and outputs lines matrix to line summary textbox through OutputLines
// Input:  Lines matrix, length of lines matrix
// Output: The new contents of the text box through OutputLines

// Check for duplicate records and delete

	var checkLine;
	
	for (var i=0; i<lineMt.length; i++) {
	
		checkLine = lineMt[i];
		for (var j=i+1; j<lineMt.length; j++) {if (checkLine[0] == lineMt[j][0]) {lineMt.splice(j,1);}}
	
	}
	
	OutputLines(lineMt, lineMt.length);
	
}

// *******************************************************************************************************************************

function FormLine(Type, From, To, Radial, Layer) {

// Correctly forms record for insertion in lines database
// Input:  Type of record (A or L), from to and radial points, line layer
// Output: The correctly formed line record, from smaller to larger

	if ((Type == 'A' || Type == 'L') && From && To && From != To && Radial && Layer && GetPointList(From, 0, 0, 1, 0) && GetPointList(To, 0, 0, 1, 0) && (GetPointList(Radial, 0, 0, 1, 0) || Radial == '-')) {
	
		var No1 = (From < To || Type == 'A') ? From : To;
		var No2 = (From < To || Type == 'A') ? To : From;
	
		return ['' + No1 + No2 + Radial, Type, No1, No2, Radial, Layer];
	
	}
	
	else {return 0;}

}

// *******************************************************************************************************************************

function ParseLines() {

// Converts the standard textarea lines contents into a matrix of points
// Input:  None
// Output: 2D matrix of points and lines

// Get lines contents from textarea

	var linesContents = qG('linesContents').value;

// Remove "\n" and multiple spaces from Lines Contents and split into a vector

	linesContents = linesContents.replace(/\n/g,' ');  linesContents = linesContents.replace(/\s+/g,' ');
	var liV = linesContents.split(' ');

// Find length of lines matrix, and initialize

	var lL = parseInt((liV.length - 1) / 6);  var lineMt = new Array();

// Read data into 2D matrix and return

	for (var i=0; i<lL; i++)   lineMt[i] = [liV[0 + i*6], liV[1 + i*6], liV[2 + i*6], liV[3 + i*6], liV[4 + i*6], liV[5 + i*6]];
	return lineMt;

}

// *******************************************************************************************************************************

function DeleteLine(ID) {

// Deletes the required line from the database
// Input:  ID of line
// Output: The database, with the required line removed

	var linesMt = ParseLines();
	
	for (var i=0; i<linesMt.length; i++) {
	
		if (linesMt[i][0] == ID) {linesMt.splice(i, 1);}
	
	}
			
	CheckLines(linesMt);

}

// *******************************************************************************************************************************

function AuditLines() {
	
// Deletes lines that depend on deleted points
// Input:  none
// Output: The updated database, with any necessary lines removed

	var ptMt = ParsePoints(), lP = ptMt.length, linesMt = ParseLines(), pt1, pt2, pt3, lType, Fpt1, Fpt2, Fpt3;
	
	for (var k=0; k<linesMt.length; k++) {
		
		Fpt1 = 0; Fpt2 = 0; Fpt3 = 0;
				
		lType = linesMt[k][1];
		pt1 = linesMt[k][2];
		pt2 = linesMt[k][3];
		pt3 = (lType == 'A' ? linesMt[k][4] : '');

// Check all point names, delete 

		for (var i=0; i<lP; i++) {
			
			if (ptMt[i][0] == pt1) {Fpt1 = 1;}
			if (ptMt[i][0] == pt2) {Fpt2 = 1;}
			if (ptMt[i][0] == pt3) {Fpt3 = 1;}
		
		}
		
		if (!Fpt1 || !Fpt2 || (lType == 'A' && !Fpt3)) {linesMt.splice(k, 1); k--;}
	
	}
	
	CheckLines(linesMt);
	
}

// *******************************************************************************************************************************

function PtClickSwitch(ptID) {

// Chooses what action to take when point clicked based on the current state of the UI
// Input:  ID of clicked point
// Output: Appropriate action or function call
	
// Replace "*" in the case of radial data on the sketches

	ptID = ptID.replace(/\*/g, '');
	
// Input point at cursor if appropriate input field was previously focussed
// Contents appended to Points and Desc fields, contents replaced with "Pt..Pt" notation in data fields

	if (window.prevFocus.attr('id')) {
	
		var Value = window.prevFocus.val().trim(), Content = window.prevFocus.attr('data-content'), goNext = 0;;
		
// PointMult

		if (Content == 'pointmult') {
		
			if (Value == '' 
			|| (Value.search(/\.\./) > 0 && Value.search(/\.\./) == Value.length - 2) 
			|| (Value.lastIndexOf('-') > 0 && Value.lastIndexOf('-') == Value.length - 1) 
			|| (Value.lastIndexOf(',') > 0 && Value.lastIndexOf(',') == Value.length - 1) 
			|| (Value.lastIndexOf('*') > 0 && Value.lastIndexOf('*') == Value.length - 1 && Value.lastIndexOf(',') == Value.length - 2)) {
			
				window.prevFocus.val(Value + ptID + ' ');
			
			}
			
			else {window.prevFocus.val(Value + ',' + ptID + ' ');}
		
		}
		
// PointSingle: simple replace

		else if (Content == 'pointsingle') {window.prevFocus.val(ptID + ' '); goNext = 1;}
		
// DataAng, DataDist, DataMisc, DataCoord: form "Pt..Pt" syntax with 2 clicks, replace existing contents

		else if (Content == 'dataang' || Content == 'datadist' || Content == 'datamisc' || Content == 'datacoord') {
		
			Value = ((Value.search(/\.\./) > 0 && Value.search(/\.\./) == Value.length - 2) ? Value : '');
			
			if (Value) {var Separator = ''; goNext = 1;}
			else {var Separator = '..';}
		
			window.prevFocus.val(Value + ptID + Separator);
		
		}
		
// DataText: simple append

		else if (Content == 'datatext') {window.prevFocus.val(Value + ptID); goNext = 1;}
		
		window.prevFocus.focus();
		
		if (goNext) {qNext();}
	
	}

// Draw lines if tool selected

	else if (isSelected('LineLink')) {testAddLine(ptID);}
	
// Draw arcs if tool selected
	
	else if (isSelected('ArcLink')) {
	
		if (!lwRadPt && !lwFromPt) {
		
			lwRadPt = ptID;
			CADinfo('Pick start point');
		
		}
	
		else if (lwRadPt && !lwFromPt) {
		
			lwFromPt = ptID;
			CADinfo('Pick end point');
		
		}
		
		else if (lwRadPt && lwFromPt) {
		
			var rad1 = FormatDecimal(PtPtInverse(0, '' + lwRadPt, '' + lwFromPt)[0], 0, 0);
			var rad2 = FormatDecimal(PtPtInverse(0, '' + lwRadPt, '' + ptID)[0], 0, 0);
		
			if (rad1 == rad2) {
		
				var newLine = FormLine('A', '' + lwFromPt, '' + ptID, '' + lwRadPt, '0');
				
				var linesMt = ParseLines();
				linesMt[linesMt.length] = newLine;
				
				CheckLines(linesMt);
				eval(qG(qG('header').innerHTML + 'CanvasSt').value);
				
				CADinfo('Pick radial point');
				
			}
			
			else {CADinfo('Radial distance unequal! Pick radial point');}
			
			lwRadPt = ''; lwFromPt = '';
		
		}
		
	}
	
// Otherwise, clear all
	
	else {
		
		lwRadPt = ''; lwFromPt = '';
		if (!isSelected('DeleteLink')) {CADinfo('');}
		
	}

}

// *******************************************************************************************************************************

function LineClickSwitch(lineID) {

// Chooses what action to take when line or arc clicked based on the current state of the UI
// Input:  ID of clicked line or arc
// Output: Appropriate action or function call

	if (isSelected('DeleteLink')) {

		DeleteLine(lineID);
		eval(qG(qG('header').innerHTML + 'CanvasSt').value);
		
	}

}

// *******************************************************************************************************************************

function ToolSwitch(toolID) {

// Modifies the linework tools based on the current state of the UI
// Input:  ID of tool
// Output: Appropriate tool styling and behaviour

// If no tool ID, clear and exit

	if (!toolID) {clearAll();  return;}

// If tool selected already, deselect all

	if (isSelected(toolID)) {clearAll();}

// If not, deselect all, select

	else {clearAll();  $('#' + toolID).addClass('button-selected');}

// Add appropriate tool start message
	
	if (isSelected('LineLink')) {CADinfo('Pick start point');}	
	if (isSelected('ArcLink')) {CADinfo('Pick radial point');}
	if (isSelected('DeleteLink')) {CADinfo('Pick segment to delete');}
	
}

// *******************************************************************************************************************************

function testAddLine(ptID) {

// Draws databased line between points as appropriate
// Input:  ID of "To" point
// Output: Databased line added to sketch, if appropriate

	lwRadPt = '';
	CADinfo('Pick end point');
	
	if (lwFromPt) {
	
		var newLine = FormLine('L', '' + lwFromPt, '' + ptID, '-', '0');
		
		var linesMt = ParseLines();
		linesMt[linesMt.length] = newLine;
		
		CheckLines(linesMt);
		eval(qG(qG('header').innerHTML + 'CanvasSt').value);
		
	}
	
	lwFromPt = ptID;

}

// *******************************************************************************************************************************

function isSelected(toolID) {return $('#' + toolID).hasClass('button-selected');}

// Returns the selected state of the required linework tool button
// Input:  ID of tool
// Output: Selected switch

// *******************************************************************************************************************************

function clearAll() {

// Clears the selection states of all linework tools
// Input:  None
// Output: Cleared tool states

	['DeleteLink', 'ArcLink', 'LineLink'].forEach(function(entry) {$('#' + entry).removeClass('button-selected');});
	
	lwRadPt = ''; lwFromPt = '';
	
	CADinfo('');

}

// *******************************************************************************************************************************

function AllLines(Canvas, ptMt, lP, Background) {

// Adds all databased lines to current sketch
// Input:  Canvas, current point matrix and length, background flag (to force less obtrusive colours)
// Output: All lines and arcs in database, added to drawing

	var linesCode = '', linesMt = ParseLines(), lL = linesMt.length, pt1, pt2, ptRad, Radius, dX1, dY1, dX2, dY2, SA, EA;
	
	var lColour = Background ? '#999' : '#000099';
	
	for (var i=0; i<lL; i++) {
		
		if (linesMt[i][1] == 'L') {
		
			pt1 = FindPt(linesMt[i][2], ptMt, lP); pt2 = FindPt(linesMt[i][3], ptMt, lP); 
			if (pt1 && pt2) {linesCode += qLine(pt1, pt2, Canvas, lColour, 'Solid', linesMt[i][0]);}
		
		}
		
		if (linesMt[i][1] == 'A') {
		
			pt1 = FindPt(linesMt[i][2], ptMt, lP); pt2 = FindPt(linesMt[i][3], ptMt, lP);  ptRad = FindPt(linesMt[i][4], ptMt, lP);
			
			if (pt1 && pt2 && ptRad) {
			
				dX1 = pt1[2] - ptRad[2], dY1 = ptRad[1] - pt1[1];
				dX2 = pt2[2] - ptRad[2], dY2 = ptRad[1] - pt2[1];
				
				Radius = Math.sqrt(Math.pow(dX1, 2) + Math.pow(dY1, 2));
				
				SA = Math.atan2(dY2, dX2);  EA = Math.atan2(dY1, dX1);
				
				linesCode += qArc(ptRad[2], ptRad[1], Radius, SA, EA, Canvas, lColour, 'Solid', linesMt[i][0]);
			
			}
		
		}
	
	}
	
	return linesCode;

}

// *******************************************************************************************************************************

function FindPt(Pt, ptMt, lP) {for (var i=0; i<lP; i++) {if (ptMt[i][0] == Pt) {return ptMt[i];}}  return 0;}

// Returns a point's coordinates if included in the provided points matrix
// Input:  Point to find, point matix and length
// Output: The requested PNEZD point vector

// *******************************************************************************************************************************

function CADinfo(Message) {$('#infosketch').remove();  if (Message) {$('#PointsEasel').append('<div class="infosketch" id="infosketch"> ' + Message + '</div>');}}

// Updates the 
// Input:  Point to find, point matix and length
// Output: The requested PNEZD point vector

// *******************************************************************************************************************************
