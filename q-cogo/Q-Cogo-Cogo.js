/*
	This heading must remain intact at all times.
	Copyright (c) 2018 Mark Mason.

	File:	Q-Cogo-Cogo.js
	Use:	To provide coordinate geometry operations for Q-Cogo, <http://www.q-cogo.com/>.
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

	Solver
	SolveTriangle
	SolveCurve
	Area
	Transform
	Inverse
	PtLineInverse
	PtPtInverse
	Intersect
	BrgBrg
	BrgDist
	DistDist
	Traverse
*/



// *******************************************************************************************************************************

function Solver() {var T = qG('SolverTitle');  if (T.innerHTML == 'Triangle')  SolveTriangle();  else if (T.innerHTML == 'Curve')  SolveCurve();}

// Calls the Solve Triangle or Solve Curve functions as appropriate
// Input:  None
// Output: The appropriate function call

// *******************************************************************************************************************************

function SolveTriangle() {

// Solves a plane triangle from three values in the input boxes
// Input:  None
// Output: The solution of the triangle output to the solver record

// Find the contents of the input text boxes

	var A = qG('SolverA').value, B = qG('SolverB').value;
	var C = qG('SolverC').value, a = qG('Solveraa').value;
	var b = qG('Solverbb').value, c = qG('Solvercc').value;

// Check to make sure fields aren't blank as appropriate

	var valCheck = [A, B, C, a, b, c];
	var ValNames = ['A', 'B', 'C', 'a', 'b', 'c'];
	var Side = 0, Ang = 0, Entered = '';
	var TriHeader = 'TRIANGLE INPUT';

	for (var v=0; v<6; v++) {

		Ang = ((valCheck[v] && v <= 2) ? Ang + 1 : Ang);
		Side = ((valCheck[v] && v > 2) ? Side + 1 : Side);
		Entered += ((valCheck[v]) ? ValNames[v] + ', ' : '');

	}

	Entered = Entered.substring(0, Entered.length - 2);
	if (Side + Ang != 3) {qError(qG('SolverA'), 'Enter 3 values to solve triangle (leave remaining values blank)', TriHeader, 'errormessage'); return;}
	if (Side == 0) {qError(qG('Solveraa'), 'Enter the length of at least one side', TriHeader, 'errormessage'); return;}

// Check all values, if entered

	A = ((A) ? ParseDMS(A, 1, 0) : 0); B = ((B) ? ParseDMS(B, 1, 0) : 0); C = ((C) ? ParseDMS(C, 1, 0) : 0);
	a = ((a) ? ParseDecimal(a, 1, 1) : 0); b = ((b) ? ParseDecimal(b, 1, 1) : 0); c = ((c) ? ParseDecimal(c, 1, 1) : 0);

	if (A == 'X' || B == 'X' || C == 'X' || a == 'X' || b == 'X' || c == 'X') {return;}
	if (A + B + C >= Math.PI) {qError(qG('SolverA'), 'Angles must add to less than 180°!', TriHeader, 'errormessage'); return;}
	if (A < 0 || B < 0 || C < 0 || a < 0 || b < 0 || c < 0) {qError(qG('SolverA'), 'All values must be positive!', TriHeader, 'errormessage'); return;}

// Calculate SSS case

	if (a && b && c) {A = AngleCos(a,b,c);  B = AngleCos(b,a,c);  C = AngleCos(c,a,b);}

// Calculate SAS cases

	else if (a && C && b) {c = SideCos(C, a, b);  A = AngleCos(a,b,c);  B = AngleCos(b,a,c);}
	else if (b && A && c) {a = SideCos(A, b, c);  B = AngleCos(b,a,c);  C = AngleCos(c,a,b);}
	else if (c && B && a) {b = SideCos(B, a, c);  A = AngleCos(a,b,c);  C = AngleCos(c,a,b);}

// Calculate SSA cases for each situation (ambiguous)

	else if (a && b && A) {B = AngleSin(A, b, a);  C = Math.PI - A - B;  c = SideSin(C, B, b);
		var a2 = a,  b2 = b,  A2 = A,  B2 = Math.PI - AngleSin(A2, b2, a2),  C2 = Math.PI - A2 - B2,  c2 = SideSin(C2, B2, b2);}
	else if (a && b && B) {A = AngleSin(B, a, b);  C = Math.PI - A - B;  c = SideSin(C, B, b);
		var a2 = a,  b2 = b,  B2 = B,  A2 = Math.PI - AngleSin(B2, a2, b2),  C2 = Math.PI - A2 - B2,  c2 = SideSin(C2, B2, b2);}
	else if (b && c && B) {C = AngleSin(B, c, b);  A = Math.PI - B - C;  a = SideSin(A, B, b);
		var b2 = b,  c2 = c,  B2 = B,  C2 = Math.PI - AngleSin(B2, c2, b2),  A2 = Math.PI - B2 - C2,  a2 = SideSin(A2, B2, b2);}
	else if (b && c && C) {B = AngleSin(C, b, c);  A = Math.PI - B - C;  a = SideSin(A, B, b);
		var b2 = b,  c2 = c,  C2 = C,  B2 = Math.PI - AngleSin(C2, b2, c2),  A2 = Math.PI - B2 - C2,  a2 = SideSin(A2, B2, b2);}
	else if (c && a && C) {A = AngleSin(C, a, c);  B = Math.PI - A - C;  b = SideSin(B, A, a);
		var c2 = c,  a2 = a,  C2 = C,  A2 = Math.PI - AngleSin(C2, a2, c2),  B2 = Math.PI - A2 - C2,  b2 = SideSin(B2, A2, a2);}
	else if (c && a && A) {C = AngleSin(A, c, a);  B = Math.PI - A - C;  b = SideSin(B, A, a);
		var c2 = c,  a2 = a,  A2 = A,  C2 = Math.PI - AngleSin(A2, c2, a2),  B2 = Math.PI - A2 - C2,  b2 = SideSin(B2, A2, a2);}

// Calculate ASA cases

	else if (A && c && B) {C = Math.PI - A - B;  a = SideSin(A, C, c);  b = SideSin(B, C, c);}
	else if (B && a && C) {A = Math.PI - B - C;  b = SideSin(B, A, a);  c = SideSin(C, A, a);}
	else if (C && b && A) {B = Math.PI - A - C;  c = SideSin(C, B, b);  a = SideSin(A, B, b);}

// Calculate AAS cases

	else if (A && B && a) {C = Math.PI - A - B;  b = SideSin(B, A, a);  c = SideSin(C, B, b);}
	else if (A && B && b) {C = Math.PI - A - B;  a = SideSin(A, B, b);  c = SideSin(C, B, b);}
	else if (B && C && b) {A = Math.PI - B - C;  a = SideSin(A, B, b);  c = SideSin(C, B, b);}
	else if (B && C && c) {A = Math.PI - B - C;  a = SideSin(A, C, c);  b = SideSin(B, C, c);}
	else if (C && A && c) {B = Math.PI - A - C;  a = SideSin(A, C, c);  b = SideSin(B, C, c);}
	else if (C && A && a) {B = Math.PI - A - C;  b = SideSin(B, A, a);  c = SideSin(C, B, b);}

// Notify and exit if no solution found

	var TriOK = 1;
	var TL1 = [a, b, c, A, B, C];

	for (var i=0; i<6; i++) TriOK = ((typeof TL1[i] =="undefined" || isNaN(TL1[i]) || TL1[i] <= 0) ? 0 : TriOK);

	if (!TriOK) {qError(qG('SolverA'), 'Impossible triangle!', TriHeader, 'errormessage'); return;}

// Format display values

	var ADisp = FormatDMS(A + '', 0), BDisp = FormatDMS(B + '', 0), CDisp = FormatDMS(C + '', 0);
	var aDisp = FormatDecimal(a + '', 0, 1), bDisp = FormatDecimal(b + '', 0, 1), cDisp = FormatDecimal(c + '', 0, 1);
	var ArDisp = FormatArea((c * Math.sin(B) * a / 2)  + '', 1);

	var PtList = new Array(7);
	PtList[0] = ['B', 0, 0, 0, 'B'];
	PtList[1] = ['C', 0, a, 0, 'C'];
	PtList[2] = ['A', c * Math.sin(B), c * Math.cos(B), 0, 'A'];
	PtList[3] = ['a', 0, a / 2, 0, 'a'];
	PtList[4] = ['b', c * Math.sin(B) / 2, (c * Math.cos(B) + a) / 2, 0, 'b'];
	PtList[5] = ['c', c * Math.sin(B) / 2, c * Math.cos(B) / 2, 0, 'c'];
	PtList[6] = [0];

// Find and process second solution for ambiguous case, if possible and not equal to first case

	var TwoSols = 1, AreSame = 0;
	var TL2 = [a2, b2, c2, A2, B2, C2];
	var Results2 = '', TwoText = '';

	for (var i=0; i<6; i++) {

		TwoSols = ((typeof TL2[i] =="undefined" || isNaN(TL2[i]) || TL2[i] <= 0) ? 0 : TwoSols);
		AreSame += ((i <= 2 && Round(Math.abs(TL2[i] - TL1[i]), parseInt(qG('DPrecision').value)) == 0) ? 1 : 0);

	}

	if (TwoSols && AreSame < 3) {

		var A2Disp = FormatDMS(A2 + '', 0), B2Disp = FormatDMS(B2 + '', 0), C2Disp = FormatDMS(C2 + '', 0);
		var a2Disp = FormatDecimal(a2 + '', 0, 1), b2Disp = FormatDecimal(b2 + '', 0, 1), c2Disp = FormatDecimal(c2 + '', 0, 1);
		var Ar2Disp = FormatArea((c2 * Math.sin(B2) * a2 / 2)  + '', 1);

		PtList[6]  = ['B', 0, 1.3 * a, 0, 'B'];
		PtList[7]  = ['C', 0, 1.3 * a + a2, 0, 'C'];
		PtList[8]  = ['A', c2 * Math.sin(B2), 1.3 * a + c2 * Math.cos(B2), 0, 'A'];
		PtList[9]  = ['a', 0, 1.3 * a + a2 / 2, 0, 'a'];
		PtList[10] = ['b', c2 * Math.sin(B2) / 2, 1.3 * a + (c2 * Math.cos(B2) + a2) / 2, 0, 'b'];
		PtList[11] = ['c', c2 * Math.sin(B2) / 2, 1.3 * a + c2 * Math.cos(B2) / 2, 0, 'c'];
		PtList[12] = [0];

		Results2 += '\n       A:        ' + A2Disp + '       a: ' + a2Disp + '\n';
		Results2 += '       B:        ' + B2Disp + '       b: ' + b2Disp + '\n';
		Results2 += '       C:        ' + C2Disp + '       c: ' + c2Disp + '\n';
		Results2 += '       Area: ' + Ar2Disp + '\n';

		TwoText = '- Two Solutions ';

	}

// Output results

	qG('SolverCanvasSt').value = 'SketchTriangle(' + JsonMat(PtList, 2) + ', \'SVGCanvas\')';
	ZoomSketch(0, 0, 0);
	SketchTriangle(PtList, 'SVGCanvas');

	var Results = 'Triangle ' + TwoText + '(Entered ' + Entered + '):\n';

	Results += '\n       A:        ' + ADisp + '       a: ' + aDisp + '\n';
	Results += '       B:        ' + BDisp + '       b: ' + bDisp + '\n';
	Results += '       C:        ' + CDisp + '       c: ' + cDisp + '\n';
	Results += '       Area: ' + ArDisp + '\n';
	Results += Results2;

	OutputCogo(Results, 'SolverLog', 1, 0);
	qF('SolverA');

}

// The following functions perform sin and cos law calculations for the triangle solver

function SideCos (A, b, c) {return Math.sqrt(Math.pow(b, 2) + Math.pow(c, 2) - 2 * b * c * Math.cos(A));}
function AngleCos(a, b, c) {return Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c));}
function SideSin (A, B, b) {return b * Math.sin(A) / Math.sin(B);}
function AngleSin(B, a, b) {return Math.asin(a * Math.sin(B) / b);}

// *******************************************************************************************************************************

function SolveCurve() {

// Solves a plane curve from two values in the input boxes
// Input:  None (obtains input from user input fields)
// Output: The solution of the curve output to the solver record

// Find the contents of the input text boxes

	var R = qG('SolverRad').value, D = qG('SolverDelta').value;
	var T = qG('SolverTang').value, L = qG('SolverLen').value;
	var C = qG('SolverChord').value;
	var CrvHeader = 'CURVE INPUT';
	
// Check exactly 2 values have been entered

	var valCheck = [D, R, T, L, C], vals = ['Delta', 'Radius', 'Tangent', 'Length', 'Chord'], NumEntered = 0, Entered = '';
	for (var i=0; i<valCheck.length; i++) {if (valCheck[i]) {NumEntered++;  Entered += ' ' + vals[i];}}
	if (NumEntered != 2) {qError(qG('SolverDelta'), 'Enter 2 values to solve curve (leave remaining values blank)', CrvHeader, 'errormessage'); return;}

// Check all values, if entered

	D = (D ? ParseDMS(D, 1, 0) : 0);  R = (R ? ParseDecimal(R, 1, 1) : 0);  T = (T ? ParseDecimal(T, 1, 1) : 0);
	L = (L ? ParseDecimal(L, 1, 1) : 0);  C = (C ? ParseDecimal(C, 1, 1) : 0);

	if (D == 'X' || R == 'X' || T == 'X' || L == 'X' || C == 'X')  return;
	R = Math.abs(R);  if (!(T && L)) {T = Math.abs(T);}  L = Math.abs(L);  C = Math.abs(C);
	if (D && (D >= 2 * Math.PI || D <= 0)) {qError(qG('SolverDelta'), 'Delta must be between 0 and 360°!', CrvHeader, 'errormessage'); return;}

// Calculate results

	if (D && R) {T = R * Math.tan(D / 2);  L = R * D;  C = 2 * R * Math.sin(D / 2);}
	else if (D && T) {R = T / Math.tan(D / 2);  L = R * D;  C = 2 * R * Math.sin(D / 2);}
	else if (D && L) {R = L / D;  T = R * Math.tan(D / 2);  C = 2 * R * Math.sin(D / 2);}
	else if (D && C) {R = C / (2 * Math.sin(D / 2));  T = R * Math.tan(D / 2);  L = R * D;}
	else if (R && T) {D = 2 * Math.atan2(T, R);  L = R * D;  C = 2 * R * Math.sin(D / 2);}
	else if (R && L) {D = L / R;  T = R * Math.tan(D / 2);  C = 2 * R * Math.sin(D / 2);}
	else if (R && C) {D = 2 * Math.asin(C / (2 * R));  T = R * Math.tan(D / 2);  L = R * D;}
	else if (T && C) {D = 2 * Math.acos(C / (2 * T));  R = C / (2 * Math.sin(D / 2));  L = R * D;}

// Iterative solutions based on L and variables other than D or R	
// D first guess based on lookup table, iterate using Newton-Raphson method, solve remaining curve variables
		
	else if (T && L) {
	
		D = DlookupLT(L, T);
		
		for (var i=0; i<20; i++) {D = D - FofDLT(L, T, D) / F2ofDLT(D);}
		R = T / Math.tan(D / 2);  C = 2 * R * Math.sin(D / 2);
		
	}
	
	else if (L && C) {
		
		D = DlookupLC(L, C);
	
		for (var i=0; i<20; i++) {D = D - FofDLC(L, C, D) / F2ofDLC(D);}
		R = C / (2 * Math.sin(D / 2));  T = R * Math.tan(D / 2);
		
	}
	
// Solve remaining curve parts that are not part of user input

	var M = R * (1 - Math.cos(D / 2)), E = R * (1 / Math.cos(D / 2) - 1), Sec = Math.pow(R, 2) * D / 2, Seg = Math.pow(R, 2) * (D - Math.sin(D)) / 2;

// Ensure values are positive, prompt and exit if no solution found

	var CrvOK = 1, Crv = [R, D, T, L, C, M];
	D = Math.abs(D);  R = Math.abs(R);  T = Math.abs(T);  L = Math.abs(L);  C = Math.abs(C);  M = Math.abs(M);  E = Math.abs(E);
	for (var i=0; i<6; i++)  CrvOK = ((typeof Crv[i] =="undefined" || isNaN(Crv[i]) || Crv[i] == 0) ? 0 : CrvOK);

	if (!CrvOK) {qError(qG('SolverDelta'), 'Impossible curve, or entered values produce extremely sensitive result', CrvHeader, 'errormessage'); return;}

// Format display values

	var RDisp = FormatDecimal(R + '', 0, 1), DDisp = FormatDMS(D + '', 0), TDisp = FormatDecimal(T + '', 0, 1);
	var LDisp = FormatDecimal(L + '', 0, 1), CDisp = FormatDecimal(C + '', 0, 1), MDisp = FormatDecimal(M + '', 0, 1);
	var EDisp = FormatDecimal(E + '', 0, 1), SecDisp = FormatArea(Sec + '', 1), SegDisp = FormatArea(Seg + '', 1);

	if (Round(D, 7) == Round(Math.PI, 7)) {

		TDisp = '       N/A';  EDisp = '       N/A';
		for (var i=0; i<qG('DPrecision').value - 1; i++) {TDisp += ' ';  EDisp += ' ';}

	}

	var PtList = new Array(11);
	PtList[0] = ['D', 0, 0, 0, 'D'];
	PtList[1] = ['BC', R * Math.cos(-1 * D / 2), R * Math.sin(-1 * D / 2), 0, 'BC'];
	PtList[2] = ['EC', R * Math.cos(D / 2), R * Math.sin(D / 2), 0, 'EC'];

	var tBrg1 = ((D < Math.PI) ? Math.PI / 2 - D / 2 : 3 * Math.PI / 2 - D / 2);
	var tBrg2 = ((D < Math.PI) ? D / 2 - Math.PI / 2 : D / 2 - 3 * Math.PI / 2);

	PtList[3] = ['PI', T * Math.cos(tBrg1) + PtList[1][1], T * Math.sin(tBrg1) + PtList[1][2], 0, 'PI'];
	PtList[4] = ['C', PtList[1][1], PtList[1][2] + C / 2, 0, 'C'];
	PtList[5] = ['L', R, 0, 0, 'L'];
	PtList[6] = ['T', T / 2 * Math.cos(tBrg1) + PtList[1][1], T / 2 * Math.sin(tBrg1) + PtList[1][2], 0, 'T'];
	PtList[7] = ['T', T / 2 * Math.cos(tBrg2) + PtList[2][1], T / 2 * Math.sin(tBrg2) + PtList[2][2], 0, 'T'];
	PtList[8] = ['R', R / 2 * Math.cos(-1 * D / 2), R / 2 * Math.sin(-1 * D / 2), 0, 'R'];
	PtList[9] = ['R', R / 2 * Math.cos(D / 2), R / 2 * Math.sin(D / 2), 0, 'R'];
	PtList[10] = [0];

	qG('SolverCanvasSt').value = 'SketchCurve(' + JsonMat(PtList, 2) + ', \'SVGCanvas\')';
	ZoomSketch(0, 0, 0);
	SketchCurve(PtList, 'SVGCanvas');

// Output results

	Entered = (Entered.trim()).split(' ');

	var Results = 'Curve (Entered ' + Entered[0] + ' and ' + Entered[1] + '):\n';

	Results += '\n       Radius:  ' + RDisp + '       Delta:       ' + DDisp + '\n';
	Results += '       Tangent: ' + TDisp + '       Length:  ' + LDisp + '\n';
	Results += '       Chord:   ' + CDisp + '\n';
	Results += '       Mid-Ord: ' + MDisp + '       Sector:  ' + SecDisp + '\n';
	Results += '       Ext:     ' + EDisp + '       Segment: ' + SegDisp + '\n';

	OutputCogo(Results, 'SolverLog', 1, 0);
	qF('SolverDelta');

}

// The following helper functions perform calculations for the length and chord iterative combination

function DlookupLC(L, C) {  // First guess for D given L and C based on lookup tables
	
	var X = L / C;
	
	if (X < 1.0000001 || X > 9999) {return 'X';}
	
	else if (X <= 1.0001){return 0.001;}  else if (X <= 1.0003){return 0.087;}  else if (X <= 1.001) {return 0.175;}
	else if (X <= 1.003) {return 0.262;}  else if (X <= 1.005) {return 0.349;}  else if (X <= 1.008) {return 0.436;}
	else if (X <= 1.012) {return 0.524;}  else if (X <= 1.016) {return 0.611;}  else if (X <= 1.021) {return 0.698;}
	else if (X <= 1.026) {return 0.785;}  else if (X <= 1.032) {return 0.873;}  else if (X <= 1.039) {return 0.960;}
	else if (X <= 1.047) {return 1.047;}  else if (X <= 1.056) {return 1.134;}  else if (X <= 1.065) {return 1.222;}
	else if (X <= 1.075) {return 1.309;}  else if (X <= 1.086) {return 1.396;}  else if (X <= 1.098) {return 1.484;}
	else if (X <= 1.111) {return 1.571;}  else if (X <= 1.155) {return 1.833;}  else if (X <= 1.209) {return 2.094;}
	else if (X <= 1.275) {return 2.356;}  else if (X <= 1.355) {return 2.618;}  else if (X <= 1.452) {return 2.880;}
	else if (X <= 1.571) {return 3.142;}  else if (X <= 1.716) {return 3.403;}  else if (X <= 1.897) {return 3.665;}
	else if (X <= 2.125) {return 3.927;}  else if (X <= 2.418) {return 4.189;}  else if (X <= 2.805) {return 4.451;}
	else if (X <= 3.332) {return 4.712;}  else if (X <= 4.085) {return 4.974;}  else if (X <= 5.236) {return 5.236;}
	else if (X <= 7.183) {return 5.498;}  else if (X <= 11.13) {return 5.760;}  else if (X <= 23.07) {return 6.021;}
	else if (X <= 35.04) {return 6.109;}  else if (X <= 71.02) {return 6.196;}  else if (X <= 359.005) {return 6.266;}
	else if (X <= 99999) {return 6.283;}
	
}

function FofDLC(L, C, D) { // F(D) for Newton-Raphson method, given L and C

	return (L / C) - D / (2 * Math.sin(D / 2));

}

function F2ofDLC(D) { // F'(D) for Newton-Raphson method, given L and C

	return (Math.cos(D / 2) * D - 2 * Math.sin(D / 2)) / (4 * Math.pow(Math.sin(D / 2), 2));

}

// The following helper functions perform calculations for the length and tangent iterative combination

function DlookupLT(L, T) {  // First guess for D given L and T based on lookup tables (
	
	var X = L / T;
	
	if (X >= 2) {return 'X';}
	
	if (X >= 1.9999) {return 0.001;}
	else if (X >= 1.9998) {return 0.035;}  else if (X >= 1.9995) {return 0.052;}  else if (X >= 1.9987) {return 0.087;}
	else if (X >= 1.995) {return 0.175;}  else if (X >= 1.989) {return 0.262;}  else if (X >= 1.980) {return 0.349;}
	else if (X >= 1.968) {return 0.436;}  else if (X >= 1.954) {return 0.524;}  else if (X >= 1.937) {return 0.611;}
	else if (X >= 1.918) {return 0.698;}  else if (X >= 1.896) {return 0.785;}  else if (X >= 1.871) {return 0.873;}
	else if (X >= 1.844) {return 0.960;}  else if (X >= 1.814) {return 1.047;}  else if (X >= 1.781) {return 1.134;}
	else if (X >= 1.745) {return 1.222;}  else if (X >= 1.706) {return 1.309;}  else if (X >= 1.664) {return 1.396;}
	else if (X >= 1.619) {return 1.484;}  else if (X >= 1.571) {return 1.571;}  else if (X >= 1.519) {return 1.658;}
	else if (X >= 1.465) {return 1.745;}  else if (X >= 1.406) {return 1.833;}  else if (X >= 1.344) {return 1.920;}
	else if (X >= 1.279) {return 2.007;}  else if (X >= 1.209) {return 2.094;}  else if (X >= 1.136) {return 2.182;}
	else if (X >= 1.058) {return 2.269;}  else if (X >= 0.976) {return 2.356;}  else if (X >= 0.889) {return 2.443;}
	else if (X >= 0.798) {return 2.531;}  else if (X >= 0.701) {return 2.618;}  else if (X >= 0.600) {return 2.705;}
	else if (X >= 0.492) {return 2.793;}  else if (X >= 0.379) {return 2.880;}  else if (X >= 0.260) {return 2.967;}
	else if (X >= 0.133) {return 3.054;}  else if (X >= 0.027) {return 3.124;}  else if (X >= 0.003) {return 3.140;}
	else if (X >= -0.003) {return 3.143;}  else if (X >= -0.028) {return 3.159;}  else if (X >= -0.141) {return 3.229;}
	else if (X >= -0.290) {return 3.316;}  else if (X >= -0.448) {return 3.403;}  else if (X >= -0.615) {return 3.491;}
	else if (X >= -0.793) {return 3.578;}  else if (X >= -0.982) {return 3.665;}  else if (X >= -1.183) {return 3.752;}
	else if (X >= -1.398) {return 3.840;}  else if (X >= -1.627) {return 3.927;}  else if (X >= -1.872) {return 4.014;}
	else if (X >= -2.135) {return 4.102;}  else if (X >= -2.418) {return 4.189;}  else if (X >= -2.724) {return 4.276;}
	else if (X >= -3.055) {return 4.363;}  else if (X >= -3.415) {return 4.451;}  else if (X >= -3.808) {return 4.538;}
	else if (X >= -4.238) {return 4.625;}  else if (X >= -4.712) {return 4.712;}  else if (X >= -5.238) {return 4.800;}
	else if (X >= -5.824) {return 4.887;}  else if (X >= -6.482) {return 4.974;}  else if (X >= -7.229) {return 5.061;}
	else if (X >= -8.082) {return 5.149;}  else if (X >= -9.069) {return 5.236;}  else if (X >= -10.226) {return 5.323;}
	else if (X >= -11.603) {return 5.411;}  else if (X >= -13.273) {return 5.498;}  else if (X >= -15.345) {return 5.585;}
	else if (X >= -17.990) {return 5.672;}  else if (X >= -21.495) {return 5.760;}  else if (X >= -26.373) {return 5.847;}
	else if (X >= -33.654) {return 5.934;}  else if (X >= -45.737) {return 6.021;}  else if (X >= -69.822) {return 6.109;}
	else if (X >= -141.910) {return 6.196;}  else if (X >= -237.946) {return 6.231;}  else if (X >= -357.964) {return 6.248;}
	else if (X >= -71998.000) {return 6.283;}  else {return 6.28318;}
	
}

function FofDLT(L, T, D) { // F(D) for Newton-Raphson method, given L and T

	return (L / T) - D / Math.tan(D / 2);

}

function F2ofDLT(D) { // F'(D) for Newton-Raphson method, given L and T

	return (D / Math.pow(Math.sin(D / 2), 2)) / 2 - 1 / Math.tan(D / 2);

}

// *******************************************************************************************************************************

function Area() {

// Finds the area contained by a list of points that define straight lines and curves
// Input:  None
// Output: The resulting area and a sketch of the operation

// Find the contents of the input text boxes

	var PtList = qG('AreaPts').value;
	var AreaHeader = 'AREA INPUT';

// Check to make sure fields aren't blank

	if (!CheckBlank(PtList, ' list of points bounding the area', qG('AreaPts')))  return;

// Get area point matrix and check

	if (!(PtList = GetPointList(PtList, 1, 1, 0, qG('AreaPts'))))  return;

// Make sure points matrix contains at least three points

	if (PtList.length < 3) {qError(qG('AreaPts'), 'Enter at least three points bounding the area', AreaHeader, 'errormessage');  return;}

// Check that any radial points are isolated

	PtList[PtList.length] = PtList[0];
	var Total = 0, intAng = -2, intTest = 0, radChk = 0, Perimeter = 0;

	for (var i=0; i<PtList.length-1; i++) {if (PtList[i][0].search(/\*/) >= 0 && PtList[i + 1][0].search(/\*/) >= 0) {radChk = 1;  break;}}

	if ((PtList[0][0].search(/\*/) >= 0 && PtList[PtList.length-2][0].search(/\*/) >= 0) || radChk) {qError(qG('AreaPts'), 'Radial points must be separated by at least one non-radial point', AreaHeader, 'errormessage'); return;}

// Perform straight line area calculations, check that any radial distances are equal, find direction of entry (CW or CCW)

	for (i=0; i<PtList.length-1; i++) {

		var indexM = ((i == 0) ? PtList.length - 2 : i - 1);

		if (PtList[i][0].search(/\*/) >= 0) {

			var radC = Math.abs(PtPtInverse(0, PtList[i][0].replace(/\*/g,''), PtList[i + 1][0])[0] - PtPtInverse(0, PtList[i][0].replace(/\*/g,''), PtList[indexM][0])[0]);

			if (Round(radC, parseInt(qG('DPrecision').value)) > Math.pow(10, -1 * parseInt(qG('DPrecision').value))) {
				
				qError(qG('AreaPts'), 'Distances from radial point "' + PtList[i][0].replace(/\*/g,'') + '" to BC and EC are unequal!', AreaHeader, 'errormessage'); return;

			}

		}

		else {

			var indexP = i + 1;
			indexP = ((PtList[indexP][0].search(/\*/) >= 0) ? indexP + 1 : indexP);
			indexP = ((indexP > PtList.length - 1) ? 1 : indexP);

			Total += parseFloat(PtList[i][1]) * parseFloat(PtList[indexP][2]);
			Total -= parseFloat(PtList[indexP][1]) * parseFloat(PtList[i][2]);

			intAng += 1;

			indexM = ((PtList[indexM][0].search(/\*/) >= 0) ? indexM - 1 : indexM);
			indexM = ((indexM < 0) ? PtList.length - 2 : indexM);

			intTest += (PtPtInverse(0, PtList[i][0], PtList[indexM][0])[2] - PtPtInverse(0, PtList[i][0], PtList[indexP][0])[2] + 2 * Math.PI) % (2 * Math.PI);
			
			Perimeter += PtPtInverse(0, PtList[i][0], PtList[indexM][0])[0];

		}

	}

	Total = Math.abs(Total / 2);

	var CW = ((parseInt(intAng * Math.PI) != parseInt(intTest)) ? -1 : 1);

// Add or subtract any segment areas from total as appropriate

	for (i=0; i<PtList.length-1; i++) {

		if (PtList[i][0].search(/\*/) >= 0) {

			indexM = ((i == 0) ? PtList.length - 2 : i - 1);

			var R = PtPtInverse(0, PtList[i][0].replace(/\*/g,''), PtList[indexM][0])[0];
			var Theta = (PtPtInverse(0, PtList[i][0].replace(/\*/g,''), PtList[indexM][0])[2] - PtPtInverse(0, PtList[i][0].replace(/\*/g,''), PtList[i + 1][0])[2] + 2 * Math.PI) % (2 * Math.PI);
			Theta = ((Theta > Math.PI) ? 2 * Math.PI - Theta : Theta);
			var segArea = Math.pow(R, 2.0) * (Theta - Math.sin(Theta)) / 2;
			var LR = PtLineInverse(0, PtList[i][0].replace(/\*/g,''), PtList[indexM][0], PtList[i + 1][0])[0];
			LR = ((LR.search(/right/i) >= 0) ? 1 : -1);

// If the point is preceded by an asterisk (*Pt), change segment area and left / right flag appropriately

			segArea = ((PtList[i][0].search(/\*/) == 0) ? Math.PI * Math.pow(R, 2.0) - segArea : segArea);
			LR *= ((PtList[i][0].search(/\*/) == 0) ? -1 : 1);

			Total += CW * LR * segArea;
			
// Subtract chord distance from perimeter, add arc length
			
			Perimeter -= PtPtInverse(0, PtList[indexM][0], PtList[i + 1][0])[0];
			var pTheta = ((PtList[i][0].search(/\*/) == 0) ? 2 * Math.PI - Theta : Theta);
			Perimeter += R * pTheta;

		}

	}

	Total = Math.abs(Total);

// Output results

	PtList.splice(PtList.length - 1, 1);
	qG('AreaCanvasSt').value = 'SketchArea(' + JsonMat(PtList, 2) + ', \'SVGCanvas\')';
	ZoomSketch(0, 0, 0);
	SketchArea(PtList, 'SVGCanvas');

	var PtString = FormatPtList(PtList, 0);
	var Results = 'By Perimeter: ' + PtString + '\n';
	Results += '\n       Area: ' + FormatArea(Total + '', 1) + '\n';
	Results += '       Perimeter: ' + FormatDecimal(Perimeter, 0, 1) + '\n';
	OutputCogo(Results, 'AreaLog');
	qF('AreaPts');

}

// *******************************************************************************************************************************

function Transform() {

// Scales, shifts, and rotates point list as indicated by the input fields
// Input:  None
// Output: The solution of the transformation, a sketch of the operation, and the updated points

// Find the contents of the input text boxes

	var PtList = qG('TransPts').value, AboutPt = qG('TransAbout').value;
	var SF = qG('TransSF').value,  NShift = qG('TransN').value;
	var EShift = qG('TransE').value, ZShift = qG('TransZ').value;
	var Rot = qG('TransHA').value;
	var Dir2 = qG('TransDir2').value;
	
	var TransType = qG('TransTitle').innerHTML;
	var Header = 'REQUIRED VALUE';

// Check to make sure fields aren't blank as appropriate

	if (!CheckBlank(PtList, ' list of points to transform', qG('TransPts'))) return;
	if (!SF && !NShift && !EShift && !ZShift && !Rot && 
		((TransType == 'Points' && !Dir2) || TransType == 'Values')) {
		qError(qG('TransN'), 'Enter at least one transformation parameter', Header, 'errormessage'); return;}
	if (!AboutPt && (SF || Rot)) {qError(qG('TransAbout'), 'Enter a point to transform about', Header, 'errormessage'); return;}
	if (TransType == 'Points' && ((Rot && !Dir2) || (!Rot && Dir2))) {qError(qG('TransHA'), 'Enter both a starting and ending direction to define a rotation, or leave both fields blank', Header, 'errormessage'); return;}

// Format input to match values in point records

	AboutPt = FormatString(AboutPt, 1, 0);

// Get transform point matrix and about point vector from points record and check

	if (!(PtList = GetPointList(PtList, 1, 0, 0, qG('TransPts'))) || !(AboutPt = GetPointList(AboutPt, 0, 0, 0, qG('TransAbout')))) {return;}

// Check all values, if entered

	if (TransType == 'Values') {NShift = ((NShift) ? ParseDecimal(NShift, 1, 1) : 0);}
	
// Variable collected as NShift is actually Azimuth (DMS) when switched to Points type
// (Variable collected as EShift is actually HD, but type can be parsed the same)
// (Variable collected as Rot is actually Dir1, but type can be parsed the same)
	
	else {NShift = ((NShift) ? ParseDMS(NShift, 1, 0) : 0);}
		
	EShift = ((EShift) ? ParseDecimal(EShift, 1, 1) : 0);
	ZShift = ((ZShift) ? ParseDecimal(ZShift, 1, 1) : 0);
	SF = ((SF) ? ParseDecimal(SF, 1, 0) : 0);
	Rot = ((Rot) ? ParseDMS(Rot, 1, 0) : 0);
	Dir2 = ((Dir2) ? ParseDMS(Dir2, 1, 0) : 0);

	if (SF == 'X' || NShift == 'X' || EShift == 'X' || ZShift == 'X' || Rot == 'X' || Dir2 == 'X')  return;
	
// Convert Points type input into values suitable for processing with Values type methodology

	if (TransType == 'Points') {
	
		var ShiftAz = NShift, ShiftDist = EShift, Dir1 = Rot;
		
		Rot = Dir2-Dir1;
		NShift = ShiftDist * Math.cos(ShiftAz);
		EShift = ShiftDist * Math.sin(ShiftAz);
	
	}

// Find coordinates of four corners of extents of points to be transformed and add to point list two times (one set to be transformed, one not)

	var Ymax = -1e15, Xmax = -1e15, Ymin = 1e15, Xmin = 1e15;

	for (var h=0; h<PtList.length; h++) {

		if (parseFloat(PtList[h][1]) > Ymax) { Ymax = parseFloat(PtList[h][1]); }
		if (parseFloat(PtList[h][1]) < Ymin) { Ymin = parseFloat(PtList[h][1]); }
		if (parseFloat(PtList[h][2]) > Xmax) { Xmax = parseFloat(PtList[h][2]); }
		if (parseFloat(PtList[h][2]) < Xmin) { Xmin = parseFloat(PtList[h][2]); }

	}

	for (var g=0; g<2; g++) {

		PtList[PtList.length] = ['NW_Extents', Ymax, Xmin, 0, 'NW_Extents'];
		PtList[PtList.length] = ['NE_Extents', Ymax, Xmax, 0, 'NE_Extents'];
		PtList[PtList.length] = ['SW_Extents', Ymin, Xmin, 0, 'SW_Extents'];
		PtList[PtList.length] = ['SE_Extents', Ymin, Xmax, 0, 'SE_Extents'];

	}

	var dN = 0;
	var dE = 0;

// Perform Scale, if necessary

	if (SF) {

		for (var f=0; f<PtList.length-4; f++) {

			dN = (parseFloat(PtList[f][1]) - parseFloat(AboutPt[1])) * parseFloat(SF);
			dE = (parseFloat(PtList[f][2]) - parseFloat(AboutPt[2])) * parseFloat(SF);

			PtList[f][1] = parseFloat(AboutPt[1]) + dN;
			PtList[f][2] = parseFloat(AboutPt[2]) + dE;

		}

	}

	else  SF = '1';

// Perform Rotation, if necessary

	if (Rot) {

		for (var d=0; d<PtList.length-4; d++) {

			var DN1 = parseFloat(PtList[d][1]) - parseFloat(AboutPt[1]);
			var DE1 = parseFloat(PtList[d][2]) - parseFloat(AboutPt[2]);

			var DistAtoD = Math.sqrt(Math.pow(DN1, 2) + Math.pow(DE1, 2));

			var AzAtoD = Math.atan2(DE1, DN1);

			if (AzAtoD < 0)  AzAtoD = AzAtoD + 2 * Math.PI;

			AzAtoD += Rot;

			dN = DistAtoD * Math.cos(AzAtoD);
			dE = DistAtoD * Math.sin(AzAtoD);

			PtList[d][1] = parseFloat(AboutPt[1]) + dN;
			PtList[d][2] = parseFloat(AboutPt[2]) + dE;

		}

	}

	else  Rot = '0';

// Perform Shifts, if necessary

	if (NShift) {for (var i=0; i<PtList.length-4; i++)  PtList[i][1] = (parseFloat(PtList[i][1]) + NShift) + '';}
	else  NShift = '0';

	if (EShift) {for (var j=0; j<PtList.length-4; j++)  PtList[j][2] = (parseFloat(PtList[j][2]) + EShift) + '';}
	else  EShift = '0';

	if (ZShift) {for (var k=0; k<PtList.length-4; k++)  PtList[k][3] = (parseFloat(PtList[k][3]) + ZShift) + '';}
	else  ZShift = '0';

// Confirm before changing any points

	var SFDisp = FormatDecimal(SF, 1, 0);
	var NShiftDisp = FormatDecimal(NShift, 0, 1);
	var EShiftDisp = FormatDecimal(EShift, 0, 1);
	var ZShiftDisp = FormatDecimal(ZShift, 0, 1);
	var RotDisp = FormatDMS(Rot, 0);

	var Plural = ((PtList.length > 9) ? 's' : '');

	var Message = PtList.length-8 + ' point' + Plural + ' will be edited!<br><br>';
	Message += '<span class="par-label">+N:</span>' + NShiftDisp.replace(/\s+/g,'') + '<br>';
	Message += '<span class="par-label">+E:</span>' + EShiftDisp.replace(/\s+/g,'') + '<br>';
	Message += '<span class="par-label">+Z:</span>' + ZShiftDisp.replace(/\s+/g,'') + '<br>';
	Message += '<span class="par-label">SF:</span>' + SFDisp.replace(/\s+/g,'') + '<br>';
	Message += '<span class="par-label">Rot:</span>' + RotDisp.replace(/\s+/g,'') + '<br><br>';
	Message += 'Edit point' + Plural + '?';

	$.prompt(qP(Message, 'TRANSFORM POINTS'), {
		
		classes: {message: 'editmessage'},
		buttons: {Ok: true, Cancel: false},
		submit: function(e,v,m,f){
		
			if (v) {
	
// Update points matrix with new values

				var ptMt = ParsePoints();

				for (var l=0; l<PtList.length; l++) {

					for (var m=0; m<ptMt.length; m++) {

						if (ptMt[m][0] == PtList[l][0]) {ptMt[m] = PtList[l];}

					}

				}

				lP = ptMt.length-2;
				OutputPoints(ptMt, lP);
				ClearSort();

// Output results and sketch transformation

				PtList[PtList.length] = [0];
				qG('TransformCanvasSt').value = 'SketchTransform(' + JsonMat(PtList, 2) + ', \'SVGCanvas\')';
				ZoomSketch(0, 0, 0);
				SketchTransform(PtList, 'SVGCanvas');

				PtList.splice(PtList.length - 9, 9);

				var PtString = FormatPtList(PtList, 1);

				var Results = 'Transformed: ' + PtString + '\n';

				if (AboutPt[0]) {Results += 'About:       ' + AboutPt[0] + '\n';}

				Results += '\n       +N:  ' + NShiftDisp + '       SF:  ' + SFDisp + '\n';
				Results += '       +E:  ' + EShiftDisp + '       Rot:     ' + RotDisp + '\n';
				Results += '       +Z:  ' + ZShiftDisp + '\n';

				OutputCogo(Results, 'TransformLog', ((NShift != 0 || EShift != 0 || ZShift != 0) ? 1 : 0), 0);
				
				qF('TransPts');

			}
			
		},
		
		close: function() {qF('TransPts');}
		
	});

}

// *******************************************************************************************************************************

function Inverse() {var T = qG('InvType').innerHTML;  if (T == 'Point')  PtPtInverse(1, 0, 0);  else if (T == 'Line')  PtLineInverse(1, 0, 0, 0);}

// Finds input type of inverse and calls appropriate inverse function
// Input:  None
// Output: The solution of the inverse, through the various inverse functions

// *******************************************************************************************************************************

function PtLineInverse(Output, PtPt, StartPt, EndPt) {

// Computes an inverse between a point and a line defined by two points and adds the result to the inverse log
// Input:  Output flag, points to calculate (0's to get points from input boxes)
// Output: The values of the inverse log text box

// If no o/s point, start point, or end point requested, get point names from input boxes

	if (!PtPt || !StartPt || !EndPt) {PtPt = qG('InvPtPt').value;  StartPt = qG('FromPt').value;  EndPt = qG('ToPt').value;}

// Check to make sure fields aren't blank

	if (!CheckBlank(PtPt, ' point to inverse from', qG('InvPtPt')) || !CheckBlank(StartPt, ' point at the start of line', qG('FromPt')) || !CheckBlank(EndPt, ' point at the end of line', qG('ToPt')))  return;

// Format input to match values in point records

	PtPt = FormatString(PtPt, 1, 0);  StartPt = FormatString(StartPt, 1, 0);  EndPt = FormatString(EndPt, 1, 0);

// Get point vectors from points record and check

	if (!(PtPt = GetPointList(PtPt, 0, 0, 0, qG('InvPtPt'))) || !(StartPt = GetPointList(StartPt, 0, 0, 0, qG('FromPt'))) || !(EndPt = GetPointList(EndPt, 0, 0, 0, qG('ToPt'))) || SamePoint(PtPt[0], StartPt[0], 'From and start', 0, qG('InvPtPt')) || SamePoint(PtPt[0], EndPt[0], 'From and end', 0, qG('InvPtPt')) || SamePoint(StartPt[0], EndPt[0], 'Start and end', 0, qG('FromPt')) || SameCoords(PtPt, StartPt, 'From and start', 0, qG('InvPtPt')) || SameCoords(PtPt, EndPt, 'From and end', 0, qG('InvPtPt')) || SameCoords(StartPt, EndPt, 'Start and end', 0, qG('FromPt')))  return;

// Compute inverse northing and easting results by brg-brg intersection

	var Az1 = PtPtInverse(0, StartPt[0], EndPt[0])[2], Az2 = Az1 + Math.PI / 2;
	var Np = BrgBrg(0, 0, StartPt, Az1, PtPt, Az2, '', '')[0], Ep = BrgBrg(0, 0, StartPt, Az1, PtPt, Az2, '', '')[1];

// Compute inverse elevation and stationing results

	var Station = Math.sqrt(Math.pow(Np - StartPt[1], 2) + Math.pow(Ep - StartPt[2], 2));

	var Az4 = Math.atan2(Ep - StartPt[2], Np - StartPt[1]);
	Az4 = ((Az4 < 0) ? Az4 + 2 * Math.PI : Az4);

	Station *= ((Round(Az4, 1) != Round(Az1, 1)) ? -1 : 1);

	var Zp = parseFloat(StartPt[3]) + Station * (EndPt[3] - StartPt[3]) / PtPtInverse(0, StartPt[0], EndPt[0])[0];

	var DN = Np - PtPt[1], DE = Ep - PtPt[2], DZ = Zp - PtPt[3];
	var HD = Math.sqrt(Math.pow(DN, 2) + Math.pow(DE, 2)), SD = Math.sqrt(Math.pow(HD, 2) + Math.pow(DZ, 2));

	var Az = Math.atan2(DE, DN);  Az = ((Az < 0) ? Az + 2 * Math.PI : Az);
	
	var AzDiff = (PtPtInverse(0, StartPt[0], PtPt[0])[2] - Az1 + 2 * Math.PI) % (2 * Math.PI);
	var LR = ((AzDiff > 0 && AzDiff < Math.PI) ? 'RIGHT of line' : (AzDiff > Math.PI && AzDiff < 2 * Math.PI) ? 'LEFT of line' : 'ON LINE');
	Az = ((LR == 'ON LINE') ? 0 : Az);

// If output requested, form points matrix for sketching routine

	if (Output) {

		var ptMt = new Array(5);
		ptMt[0] = StartPt;  ptMt[1] = EndPt;  ptMt[2] = PtPt;
		ptMt[3] = ['Calc_Pt', Np, Ep, Zp, 'Calc_Pt'];  ptMt[4] = [0];

// Form line vector of points (in points matrix) that are furthest apart, so no gaps exist in the line

		var HD1 = Math.sqrt(Math.pow(EndPt[1] - StartPt[1], 2) + Math.pow(EndPt[2] - StartPt[2], 2));
		var HD2 = Math.sqrt(Math.pow(EndPt[1] - Np, 2) + Math.pow(EndPt[2] - Ep, 2));
		var MaxHD = Math.max(Station, HD1, HD2);

		var Line = ((MaxHD == Station) ? [0, 3] : (MaxHD == HD1) ? [0, 1] : [1, 3]);

		qG('InverseCanvasSt').value = 'SketchPtLine(' + JsonMat(ptMt, 2) + ', \'SVGCanvas\',' + JsonMat(Line, 1) + ')';
		ZoomSketch(0, 0, 0);
		SketchPtLine(ptMt, 'SVGCanvas', Line);

		var StationDisp = FormatStn(Station + ''), HDDisp = FormatDecimal(HD + '', 0, 1);
		var SDDisp = FormatDecimal(SD + '', 0, 1), dNDisp = FormatDecimal(DN + '', 0, 1);
		var dEDisp = FormatDecimal(DE + '', 0, 1), dZDisp = FormatDecimal(DZ + '', 0, 1);
		var AzDisp = FormatDMS(Az + '', 0), GradeDisp = FormatGrade(DZ, HD);

// Sketch and output results to inverse log

		var Results = PtPt[0] + '(' + PtPt[4] + ') to Line ' + StartPt[0] + '(' + StartPt[4] + ') --> ' + EndPt[0] + '(' +  EndPt[4] + '): \n\n';
		Results += LR + ', Stn:  ' + StationDisp + '\n\n';
		Results += '       HD: ' + HDDisp + '       Az:     ' + AzDisp + '\n';
		if (qG('InvDim').innerHTML == '3D')  Results += '       SD: ' + SDDisp + '       Grd: ' + GradeDisp + '\n';
		Results += '       dN: ' + dNDisp + '       dE: ' + dEDisp + '\n';
		if (qG('InvDim').innerHTML == '3D')  Results += '       dZ: ' + dZDisp + '\n';

		OutputCogo(Results, 'InverseLog');
		
		qF('InvPtPt');

	}

// If output not requested, return calculated values

	else  return [LR, HD, SD, Az];

}

// *******************************************************************************************************************************

function PtPtInverse(Output, FromPt, ToPt) {

// Computes an inverse between two points and adds the result to the inverse log, or returns a vector of results
// Input:  Output flag (1 to request textarea output) and points to calculate (0's to get points from input boxes)
// Output: The values of the inverse log text box, or the vector of results

// If no from or to point requested, get point names from input boxes

	if (!FromPt || !ToPt) {FromPt = qG('FromPt').value;  ToPt = qG('ToPt').value;}

// Check to make sure fields aren't blank

	if (!CheckBlank(FromPt, ' point to inverse from', qG('FromPt')) || !CheckBlank(ToPt, ' point to inverse to', qG('ToPt')))  return;

// If inputs are not vectors, format input to match values in point records, get point vectors from points record and check

	if (typeof(FromPt) != 'object') {

		FromPt = FormatString(FromPt, 1, 0);  ToPt = FormatString(ToPt, 1, 0);
		if (!(FromPt = GetPointList(FromPt, 0, 0, 0, qG('FromPt'))) || !(ToPt = GetPointList(ToPt, 0, 0, 0, qG('ToPt'))) || (Output && SamePoint(FromPt[0], ToPt[0], 'From and to', 0, qG('FromPt'))))  return;

	}

// Compute inverse results and format for display

	var DN = parseFloat(ToPt[1]) - parseFloat(FromPt[1]), DE = parseFloat(ToPt[2]) - parseFloat(FromPt[2]);
	var DZ = parseFloat(ToPt[3]) - parseFloat(FromPt[3]);

	var HD = Math.sqrt(Math.pow(DN, 2) + Math.pow(DE, 2)), SD = Math.sqrt(Math.pow(HD, 2) + Math.pow(DZ, 2)), Az = Math.atan2(DE, DN);
	Az = ((Az < 0) ? Az + 2 * Math.PI : Az);

	var HDDisp = FormatDecimal(HD + '', 0, 1), SDDisp = FormatDecimal(SD + '', 0, 1);
	var dNDisp = FormatDecimal(DN + '', 0, 1), dEDisp = FormatDecimal(DE + '', 0, 1);
	var dZDisp = FormatDecimal(DZ + '', 0, 1), AzDisp = FormatDMS(Az + '', 0);
	var GradeDisp = FormatGrade(DZ, HD);

// If output requested, sketch and output results to inverse log

	if (Output) {

		var ptMt = new Array(3);  ptMt[0] = FromPt;  ptMt[1] = ToPt;  ptMt[2] = [0];
		qG('InverseCanvasSt').value = 'SketchPtPt(' + JsonMat(ptMt, 2) + ', \'SVGCanvas\')';
		ZoomSketch(0, 0, 0);
		SketchPtPt(ptMt, 'SVGCanvas');

		var Results = FromPt[0] + '(' + FromPt[4] + ') to ' + ToPt[0] + '(' + ToPt[4] + '): \n\n';
		Results += '       HD: ' + HDDisp + '       Az:     ' + AzDisp + '\n';
		if (qG('InvDim').innerHTML == '3D')  Results += '       SD: ' + SDDisp + '       Grd: ' + GradeDisp + '\n';
		Results += '       dN: ' + dNDisp + '       dE: ' + dEDisp + '\n';
		if (qG('InvDim').innerHTML == '3D')  Results += '       dZ: ' + dZDisp + '\n';

		OutputCogo(Results, 'InverseLog');
		
		qF('FromPt');

	}

// If output not requested, return calculated values

	else  return [HD, SD, Az, DN, DE, DZ];

}

// *******************************************************************************************************************************

function Intersect(Store) {

// Finds input type of intersection and calls appropriate intersection function
// Input:  Store point switch, 0 for no, 1 for yes
// Output: The solution of the intersection, through the various intersection functions

// Find the contents of the input text boxes

	var FromPt = qG('IntFrom').value, ValueFrom = qG('IntValueFrom').value, ToPt = qG('IntTo').value;
	var ValueTo = qG('IntValueTo').value, Pt = qG('IntPt').value, Desc = qG('IntDesc').value;

// Read title to find out which intersection to perform

	var Title = qG('IntTitle');

// Check to make sure points fields aren't blank

	if (!CheckBlank(FromPt, ' point to intersect from', qG('IntFrom')) || !CheckBlank(ToPt, ' point to intersect to', qG('IntTo')))  return;

// Format input to match values in point records

	FromPt = FormatString(FromPt, 1, 0);  ToPt = FormatString(ToPt, 1, 0);

// Get from point vectors from points record and check

	if (!(FromPt = GetPointList(FromPt, 0, 0, 0, qG('IntFrom'))) || !(ToPt = GetPointList(ToPt, 0, 0, 0, qG('IntTo'))) || SamePoint(FromPt[0], ToPt[0], 'From and to', 0, qG('IntFrom')) || SameCoords(FromPt, ToPt,'From and to', 0, qG('IntFrom')))  return;

// Call appropriate intersection function

	if (Title.innerHTML == 'Brg-Brg')  BrgBrg(1, Store, FromPt, ValueFrom, ToPt, ValueTo, Pt, Desc);
	else if (Title.innerHTML == 'Brg-Dist')  BrgDist(Store, FromPt, ValueFrom, ToPt, ValueTo, Pt, Desc);
	else if (Title.innerHTML == 'Dist-Dist')  DistDist(Store, FromPt, ValueFrom, ToPt, ValueTo, Pt, Desc);

}

// *******************************************************************************************************************************

function BrgBrg(Output, Store, FromPt, AzFrom, ToPt, AzTo, Pt, Desc) {

// Performs bearing-bearing intersection to create new point coordinates at zero elevation, storing if necessary, or returns a vector of results
// Input:  Store point switch, from point and azimuth, to point and azimuth, store point and description, output switch
// Output: The values of the intersection record text box and stored point, through the AddPoint function

// If output is requested, check to make sure appropriate fields aren't blank and parse DMS input (if not, input will be in radians)

	if (Output) {

		if (!CheckBlank(AzFrom, ' "from" azimuth', qG('IntValueFrom')) || !CheckBlank(AzTo, ' "to" azimuth', qG('IntValueTo')) || (Store == 1 && (!CheckBlank(Pt, ' point name', qG('IntPt')) || !CheckBlank(Desc, ' point description', qG('IntDesc')))))  return;

		AzFrom = ParseDMS(AzFrom, 1, 1);
		if (AzFrom != 'X')  AzTo = ParseDMS(AzTo, 1, 1);
		else  return;

	}

// Check to ensure inputs are acceptable, then compute results, output results, and add point (if necessary)

	if (AzTo != 'X' && CheckDesc(Desc)) {

// Check that Azimuths are not parallel

		if (Round(AzFrom, 7) == Round(AzTo, 7) || Round(AzFrom - Math.PI, 7) == Round(AzTo, 7) || Round(AzFrom, 7) == Round(AzTo - Math.PI, 7)) {qError(qG('IntValueFrom'), 'Azimuths do not intersect!', 'INTERSECT INPUT', 'errormessage'); return;}

// Calculate unique solution

		var AzAB = PtPtInverse(0, FromPt[0], ToPt[0])[2];

		var A = AzFrom - AzAB;
		var B = AzAB + Math.PI - AzTo;
		var P = Math.PI - A - B;

		var AP = PtPtInverse(0, FromPt[0], ToPt[0])[0] * Math.sin(B) / Math.sin(P);

		var Yp = parseFloat(FromPt[1]) + AP * Math.cos(AzFrom);
		var Xp = parseFloat(FromPt[2]) + AP * Math.sin(AzFrom);

// Format display values

		AzFrom = FormatDMS(AzFrom + '', 0);
		AzTo = FormatDMS(AzTo + '', 0);
		var N = FormatDecimal(Yp + '', 0, 1);
		var E = FormatDecimal(Xp + '', 0, 1);

// Create precise store point values

		var Np = Yp + '', Ep = Xp + '', Zp = 0 + '';

		if (Output) {

			var ptMt2 = new Array(3);
			ptMt2[0] = FromPt;
			ptMt2[1] = ToPt;
			ptMt2[2] = ['Calc_Pt', Np, Ep, Zp, 'Calc_Pt'];
			ptMt2[3] = [0];

			var Results = 'Brg-Brg from ' + FromPt[0] + '(' + FromPt[4] + ') to ' + ToPt[0] + '(' + ToPt[4] + '):\n\n';
			Results += '       From Az: ' + AzFrom + '        To Az: ' + AzTo + '\n\n';

			if (Store == 0) {Results += 'Calculated Point (NOT STORED):\n\n';}

			else if (Store == 1) {

				Pt = FormatString(Pt, 1, 0);
				Desc = FormatString(Desc, 1, 0);

				ptMt2[2] = [Pt, Np, Ep, Zp, Desc];
				
				Results += 'STORED ' + Pt + '(' + Desc + '):\n\n'

			}

			else  return;

			Results += '       N:  ' + N + '\n       E:  ' + E + '\n';
			
			if (Store == 0) {

				OutputCogo(Results, 'IntersectLog', 0, 1);
				qG('IntersectCanvasSt').value = 'SketchBrgBrg(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\')';
				ZoomSketch(0, 0, 0);
				SketchBrgBrg(ptMt2, 'SVGCanvas');
				qF('IntPt');
			
			}
			
			else if (Store == 1) {
			
				AddPoint(Pt, Np, Ep, Zp, Desc, function() {

					qG('IntPt').value = '';
					
					OutputCogo(Results, 'IntersectLog', 0, 1);
					qG('IntersectCanvasSt').value = 'SketchBrgBrg(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\')';
					SketchBrgBrg(ptMt2, 'SVGCanvas');
					
				}, ptMt2, Results, '', '', qG('IntFrom'));
			
			}

		}

		else  return [Yp, Xp];

	}

}

// *******************************************************************************************************************************

function BrgDist(Store, FromPt, AzFrom, ToPt, DistTo, Pt, Desc) {

// Performs bearing-distance intersection to create new point coordinates at zero elevation, storing if necessary, prompting user for solution point
// Input:  Store point switch, from point and azimuth, to point and distance, store point and description
// Output: The values of the intersection record text box and stored point, through the AddPoint function

// Check to make sure appropriate fields aren't blank

	if (!CheckBlank(AzFrom, ' "from" azimuth', qG('IntValueFrom')) || !CheckBlank(DistTo, ' "to" distance', qG('IntValueTo')) || (Store == 1 && (!CheckBlank(Pt, ' point name', qG('IntPt')) || !CheckBlank(Desc, ' point description', qG('IntDesc')))))  return;

// Check to ensure inputs are acceptable, then compute results, output results, and add point (if necessary)

	AzFrom = ParseDMS(AzFrom, 1, 1);
	DistTo = ParseDecimal(DistTo, 1, 1);

	if (AzFrom != 'X' && DistTo != 'X' && CheckDesc(Desc)) {

// Get point coordinates from points vector

		var Ya = parseFloat(FromPt[1]);
		var Xa = parseFloat(FromPt[2]);
		var Yb = parseFloat(ToPt[1]);
		var Xb = parseFloat(ToPt[2]);

// Calculate both solution points

		var AzAB = Math.atan2(Xb - Xa, Yb - Ya);

		if (AzAB < 0) {
	
			AzAB = AzAB + 2 * Math.PI;

		}

		var A = AzFrom - AzAB;
		var AB = Math.sqrt(Math.pow(Ya - Yb, 2) + Math.pow(Xa - Xb, 2));

		var AP1 = (2 * (AB) * Math.cos(A) + Math.sqrt(Math.pow(2 * AB * Math.cos(A), 2) - 4 * (Math.pow(AB, 2) - Math.pow(DistTo, 2)))) / 2;
		var AP2 = (2 * (AB) * Math.cos(A) - Math.sqrt(Math.pow(2 * AB * Math.cos(A), 2) - 4 * (Math.pow(AB, 2) - Math.pow(DistTo, 2)))) / 2;

		var Xp1 = Xa + AP1 * Math.sin(AzFrom);
		var Yp1 = Ya + AP1 * Math.cos(AzFrom);
		var Xp2 = Xa + AP2 * Math.sin(AzFrom);
		var Yp2 = Ya + AP2 * Math.cos(AzFrom);

// Alert and exit if no solution exists

		if (isNaN(Xp1) || isNaN(Yp1) || isNaN(Xp2) || isNaN(Yp2)) {qError(qG('IntValueFrom'), 'Azimuth and distance do not intersect!', 'INTERSECT INPUT', 'errormessage'); return;}

// Sketch both solutions and prompt user to choose correct point

		var ptMt = new Array(5);
		ptMt[0] = FromPt;
		ptMt[1] = ToPt;
		ptMt[2] = ['Sol_1', Yp1, Xp1, 0, 'Sol_1'];
		ptMt[3] = ['Sol_2', Yp2, Xp2, 0, 'Sol_2'];
		ptMt[4] = [0];

		var HD1 = Math.sqrt(Math.pow(Ya - Yp1, 2) + Math.pow(Xa - Xp1, 2));
		var HD2 = Math.sqrt(Math.pow(Ya - Yp2, 2) + Math.pow(Xa - Xp2, 2));
		var HD3 = Math.sqrt(Math.pow(Yp1 - Yp2, 2) + Math.pow(Xp1 - Xp2, 2));
		var MaxHD = Math.max(HD1, HD2, HD3);

		var Line = ((MaxHD == HD1) ? [0, 2] : (MaxHD == HD2) ? [0, 3] : [2, 3]);

		ZoomSketch(0, 0, 0);
		SketchBrgDist(ptMt, 'SVGCanvas', 1, Line);

		var Message = 'Solution 1:<br><br>';
		Message += '<span class="par-label">N:</span>' + FormatDecimal(Yp1, 0, 1).replace(/\s+/g,'') + '<br>';
		Message += '<span class="par-label">E:</span>' + FormatDecimal(Xp1, 0, 1).replace(/\s+/g,'') + '<br><br>';
		Message += 'Solution 2:<br><br>';
		Message += '<span class="par-label">N:</span>' + FormatDecimal(Yp2, 0, 1).replace(/\s+/g,'') + '<br>';
		Message += '<span class="par-label">E:</span>' + FormatDecimal(Xp2, 0, 1).replace(/\s+/g,'') + '<br><br>';
		Message += 'Pick the preferred solution:';
			
		$.prompt(qP(Message, 'MULTIPLE SOLUTIONS'), {
		
			classes: {message: 'editmessage'},
			buttons: {'Sol 1': 1, 'Sol 2': 2, Cancel: false},
			submit: function(e,v,m,f){
			
				if (v) {

					if (v == 1) {var Xp = Xp1, Yp = Yp1;}
					else if (v == 2) {var Xp = Xp2, Yp = Yp2;}

// Format display values

					AzFrom = FormatDMS(AzFrom + '', 0);
					DistTo = FormatDecimal(DistTo + '', 0, 1);
					var N = FormatDecimal(Yp + '', 0, 1);
					var E = FormatDecimal(Xp + '', 0, 1);

// Create precise store point values

					var Np = Yp + '', Ep = Xp + '', Zp = 0 + '';

// Refresh from and to point coordinates, then form new diminished points matrix

					FromPt = GetPointList(FromPt[0], 0, 0, 0, qG('IntFrom'));
					ToPt = GetPointList(ToPt[0], 0, 0, 0, qG('IntTo'));

					ptMt2 = new Array(4);
					ptMt2[0] = FromPt;
					ptMt2[1] = ToPt;
					ptMt2[2] = ['Calc_Pt', Np, Ep, Zp, 'Calc_Pt'];
					ptMt2[3] = [0];

					var Results = 'Brg-Dist from ' + FromPt[0] + '(' + FromPt[4] + ') to ' + ToPt[0] + '(' + ToPt[4] + '):\n\n';
					Results += '       From Az: ' + AzFrom + '        To Dist: ' + DistTo + '\n\n';

					if (Store == 0) {Results += 'Calculated Point (NOT STORED):\n\n';}

					else if (Store == 1) {

						Pt = FormatString(Pt, 1, 0);
						Desc = FormatString(Desc, 1, 0);
						Results += 'STORED ' + Pt + '(' + Desc +'):\n\n';
						ptMt2[2] = [Pt, Yp, Xp, 0, Pt];

					}

					else  return;

					Results += '       N:  ' + N + '\n       E:  ' + E + '\n';

					if (Store == 0) {
					
						OutputCogo(Results, 'IntersectLog', 1, 1);
						qG('IntersectCanvasSt').value = 'SketchBrgDist(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\', 0, \'\')';
						ZoomSketch(0, 0, 0);
						SketchBrgDist(ptMt2, 'SVGCanvas', 0, '');
						qF('IntPt');
						
					}
					
					else if (Store == 1) {
					
						AddPoint(Pt, Np, Ep, Zp, Desc, function() {
						
							qG('IntPt').value = '';
							
							OutputCogo(Results, 'IntersectLog', 1, 1);
							qG('IntersectCanvasSt').value = 'SketchBrgDist(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\', 0, \'\')';
							SketchBrgDist(ptMt2, 'SVGCanvas', 0, '');
								
						}, ptMt2, Results, '', '', qG('IntFrom'));
						
					}

				}
				
				else {

					qG('SVGCanvas').innerHTML = '';  qG('PointsControl').innerHTML = '';
					eval(qG('IntersectCanvasSt').value);
					qF('IntPt');
					return;

				}
				
			},
			close: function(e,v,m,f){if (typeof v == 'undefined') {
				
				qG('SVGCanvas').innerHTML = '';  qG('PointsControl').innerHTML = '';
				eval(qG('IntersectCanvasSt').value);
				qF('IntFrom');
				return;
				
			}}
		
		});

	}

}

// *******************************************************************************************************************************

function DistDist(Store, FromPt, DistFrom, ToPt, DistTo, Pt, Desc) {

// Performs distance-distance intersection to create new point coordinates at zero elevation, storing if necessary, prompting user for solution point
// Input:  Store point switch, from point and distance, to point and distance, store point and description
// Output: The values of the intersection record text box and stored point, through the AddPoint function

// Check to make sure appropriate fields aren't blank

	if (!CheckBlank(DistFrom, ' "from" distance', qG('IntValueFrom')) || !CheckBlank(DistTo, ' "to" distance', qG('IntValueTo')) || (Store == 1 && (!CheckBlank(Pt, ' point name', qG('IntPt')) || !CheckBlank(Desc, ' point description', qG('IntDesc')))))  return;

// Check to ensure inputs are acceptable, then compute results, output results, and add point (if necessary)

	DistFrom = ParseDecimal(DistFrom, 1, 1);  DistTo = ParseDecimal(DistTo, 1, 1);

	if (DistFrom != 'X' && DistTo != 'X' && CheckDesc(Desc)) {

// Calculate both solution points

		var AB = PtPtInverse(0, FromPt[0], ToPt[0])[0];
		var AzAB = PtPtInverse(0, FromPt[0], ToPt[0])[2];
		var A = Math.acos((Math.pow(AB, 2) + Math.pow(DistFrom, 2) - Math.pow(DistTo, 2)) / (2 * AB * DistFrom));

		var Xp1 = parseFloat(FromPt[2]) + DistFrom * Math.sin(AzAB + A);
		var Yp1 = parseFloat(FromPt[1]) + DistFrom * Math.cos(AzAB + A);
		var Xp2 = parseFloat(FromPt[2]) + DistFrom * Math.sin(AzAB - A);
		var Yp2 = parseFloat(FromPt[1]) + DistFrom * Math.cos(AzAB - A);

// Alert and exit if no solution exists

		if (isNaN(Xp1) || isNaN(Yp1) || isNaN(Xp2) || isNaN(Yp2)) {qError(qG('IntValueFrom'), 'Distances do not intersect!', 'INTERSECT INPUT', 'errormessage'); return;}

// Sketch both solutions and prompt user to choose correct point

		var ptMt = new Array(5);
		ptMt[0] = FromPt;
		ptMt[1] = ToPt;
		ptMt[2] = ['Sol_1', Yp1, Xp1, 0, 'Sol_1'];
		ptMt[3] = ['Sol_2', Yp2, Xp2, 0, 'Sol_2'];
		ptMt[4] = [0];

		ZoomSketch(0, 0, 0);
		SketchDistDist(ptMt, 'SVGCanvas', 1);

		var Message = 'Solution 1:<br><br>';
		Message += '<span class="par-label">N:</span>' + FormatDecimal(Yp1, 0, 1).replace(/\s+/g,'') + '<br>';
		Message += '<span class="par-label">E:</span>' + FormatDecimal(Xp1, 0, 1).replace(/\s+/g,'') + '<br><br>';
		Message += 'Solution 2:<br><br>';
		Message += '<span class="par-label">N:</span>' + FormatDecimal(Yp2, 0, 1).replace(/\s+/g,'') + '<br>';
		Message += '<span class="par-label">E:</span>' + FormatDecimal(Xp2, 0, 1).replace(/\s+/g,'') + '<br><br>';
		Message += 'Pick the preferred solution:';

		$.prompt(qP(Message, 'MULTIPLE SOLUTIONS'), {
		
			classes: {message: 'editmessage'},
			buttons: {'Sol 1': 1, 'Sol 2': 2, Cancel: false},
			submit: function(e,v,m,f){
			
				if (v) {

					if (v == 1) {var Xp = Xp1, Yp = Yp1;}
					else if (v == 2) {var Xp = Xp2, Yp = Yp2;}

// Format display values

					DistFrom = FormatDecimal(DistFrom + '', 0, 1);
					DistTo = FormatDecimal(DistTo + '', 0, 1);
					var N = FormatDecimal(Yp + '', 0, 1);
					var E = FormatDecimal(Xp + '', 0, 1);

// Create precise store point values

					var Np = Yp + '';
					var Ep = Xp + '';
					var Zp = 0 + '';

// Refresh from and to point coordinates, then form new diminished points matrix

					FromPt = GetPointList(FromPt[0], 0, 0, 0, qG('IntFrom'));
					ToPt = GetPointList(ToPt[0], 0, 0, 0, qG('IntTo'));

					ptMt2 = new Array(4);
					ptMt2[0] = FromPt;
					ptMt2[1] = ToPt;
					ptMt2[2] = ['Calc_Pt', Np, Ep, Zp, 'Calc_Pt'];
					ptMt2[3] = [0];

					var Results = 'Dist-Dist from ' + FromPt[0] + '(' + FromPt[4] + ') to ' + ToPt[0] + '(' + ToPt[4] + '):\n\n';
					Results += '       From Dist: ' + DistFrom + '        To Dist: ' + DistTo + '\n\n';

					if (Store == 0) {Results += 'Calculated Point (NOT STORED):\n\n';}

					else if (Store == 1) {

						Pt = FormatString(Pt, 1, 0);
						Desc = FormatString(Desc, 1, 0);
						Results += 'STORED ' + Pt + '(' + Desc +'):\n\n';
						ptMt2[2] = [Pt, Yp, Xp, 0, Pt];

					}

					else  return;

					Results += '       N:  ' + N + '\n       E:  ' + E + '\n';
					
					if (Store == 0) {

						OutputCogo(Results, 'IntersectLog', 1, 0);
						qG('IntersectCanvasSt').value = 'SketchDistDist(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\', 0)';
						ZoomSketch(0, 0, 0);
						SketchDistDist(ptMt2, 'SVGCanvas', 0);
						qF('IntPt');
					
					}
					
					else if (Store == 1) {
					
						AddPoint(Pt, Np, Ep, Zp, Desc, function() {
						
							qG('IntPt').value = '';
							
							OutputCogo(Results, 'IntersectLog', 1, 0);
							qG('IntersectCanvasSt').value = 'SketchDistDist(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\', 0)';
							SketchDistDist(ptMt2, 'SVGCanvas', 0);
							
						}, ptMt2, Results, '', '', qG('IntFrom'));
					
					}
					
				}
					
				else {

					qG('SVGCanvas').innerHTML = '';  qG('PointsControl').innerHTML = '';
					eval(qG('IntersectCanvasSt').value);
					qF('IntPt');
					return;

				}

			},
			close: function(e,v,m,f){if (typeof v == 'undefined') {
				
				qG('SVGCanvas').innerHTML = '';  qG('PointsControl').innerHTML = '';
				eval(qG('IntersectCanvasSt').value);
				qF('IntFrom');
				return;
				
			}}
		
		});
		
	}

}

// *******************************************************************************************************************************

function Traverse(Store, Increment) {

// Traverses to create new coordinates, storing a point if necessary (2D choice will result in same elevation)
// Input:  Store point flag (0 for no, 1 for yes), increment flag
// Output: The values of the traverse record text box and stored point, through the AddPoint function

// Find the contents of the input text boxes

	var FromPt = qG('TravFrom').value, HI = qG('TravHI').value, HT = qG('TravHT').value, BSPt = qG('TravBS').value, Ang = qG('TravAng').value, Dist = qG('TravDist').value, ZA = qG('TravZA').value, Pt = qG('TravPt').value, Desc = qG('TravDesc').value;

	var Dim = qG('TravDim').innerHTML, Type = qG('TravType').innerHTML;
	
// Check to make sure appropriate fields aren't blank (HA case) and format BS point if necessary

	var AngBlankError = 'n azimuth';
	var BSRecord = '';
	var HIHTRecord = '';
	var AngRecord = '        Az:     ';

	if (Type == 'Angle') {

		if (!CheckBlank(BSPt, ' backsight point', qG('TravBS')))  return;

		BSPt = FormatString(BSPt, 1, 0);

		if (!(BSPt = GetPointList(BSPt, 0, 0, 0, qG('TravBS'))))  return;

		AngBlankError = ' horizontal angle';
		BSRecord = ' BS ' + BSPt[0] + '(' + BSPt[4] + ')';
		AngRecord = '        HA:     ';

	}

// Check to make sure appropriate fields aren't blank (2D and 3D cases)

	if (Dim == '2D' && (!CheckBlank(FromPt, ' point to traverse from', qG('TravFrom')) || !CheckBlank(Ang, AngBlankError, qG('TravAng')) || !CheckBlank(Dist, ' horizontal distance', qG('TravDist')) || (Store == 1 && (!CheckBlank(Pt, ' point name', qG('TravPt')) || !CheckBlank(Desc, ' point description', qG('TravDesc'))))))  {return;}

	else if (Dim == '3D' && (!CheckBlank(FromPt, ' point to traverse from', qG('TravFrom')) || !CheckBlank(HI, ' height of instrument', qG('TravHI')) || !CheckBlank(HT, ' height of target', qG('TravHT')) || !CheckBlank(Ang, AngBlankError, qG('TravAng')) || !CheckBlank(Dist, ' slope distance', qG('TravDist')) || !CheckBlank(ZA, ' zenith angle', qG('TravZA')) || (Store == 1 && (!CheckBlank(Pt, ' point name', qG('TravPt')) || !CheckBlank(Desc, ' point description', qG('TravDesc'))))))  {return;}

// Format input to match values in point records

	FromPt = FormatString(FromPt, 1, 0);

// Get from point vector from points record and check

	if (!(FromPt = GetPointList(FromPt, 0, 0, 0, qG('TravFrom'))) || (Type == 'Angle' && SamePoint(FromPt[0], BSPt[0], 'From and BS', 0, qG('TravFrom')))) {return;}

// Check to ensure inputs are acceptable, then compute results, output results, and add point (if necessary)

	Ang = ((Type == 'Angle') ? ParseDMS(Ang, 1, 0) : ParseDMS(Ang, 1, 1));

	ZA = ((Dim == '3D') ? ParseDMS(ZA, 1, 0) : Math.PI / 2);

	if (Dim == '3D') {HI = ParseDecimal(HI, 1, 0); HT = ParseDecimal(HT, 1, 0);}
	Dist = ParseDecimal(Dist, 1, 1);

	if (Ang != 'X' && Dist != 'X' && HI != 'X' && HT != 'X' && ((Dim == '2D') || (Dim == '3D' && ZA != 'X')) && CheckDesc(Desc)) {

		Ang2 = Ang;

		if (Type == 'Angle') {Ang = Ang + PtPtInverse(0, FromPt[0], BSPt[0])[2];}

		if (Dim == '3D') {

			HIdisp = FormatDecimal(HI + '', 0, 1);  HIdisp = HIdisp.replace(/\s+/g,'');
			HTdisp = FormatDecimal(HT + '', 0, 1);  HTdisp = HTdisp.replace(/\s+/g,'');

			HIHTRecord = ' [HI=' + HIdisp + ', HT=' + HTdisp + ']';

		}

		else {HI = 0; HT = 0;}

// Format zenith angle for calculations

		ZA = ((Dim == '3D' && ZA > Math.PI) ? Math.PI * 2 - ZA : ZA);

		HD = Math.sin(ZA) * Dist;
		VD = Math.cos(ZA) * Dist + HI - HT;

		var Np = HD * Math.cos(Ang) + parseFloat(FromPt[1]);
		var Ep = HD * Math.sin(Ang) + parseFloat(FromPt[2]);
		var Zp = VD + parseFloat(FromPt[3]);

// Format display values

		Ang = FormatDMS(Ang2 + '', 0);
		ZA = FormatDMS(ZA + '', 0);
		Dist = FormatDecimal(Dist + '', 0, 1);
		var N = FormatDecimal(Np + '', 0, 1);
		var E = FormatDecimal(Ep + '', 0, 1);
		var Z = FormatDecimal(Zp + '', 0, 1);

// Create precise store point values

		Np = Np + '';
		Ep = Ep + '';
		Zp = Zp + '';

// Create calc output and sketch traverse

		var ZAline = '';
		var Zline = '';
		var distLabel = 'HD:';

		if (Dim == '3D') {

			var Spacer = '           ';

				for (var j=0; j<Dist.length; j++) {

					Spacer += ' ';

				}

			ZAline= Spacer + '        ZA:     ' + ZA + '\n';
			Zline= '       Z:  ' + Z + '\n';
			distLabel = 'SD:';

		}

		var Results = Dim + ' by ' + Type + ' from ' + FromPt[0] + '(' + FromPt[4] + ')' + BSRecord + HIHTRecord + ':\n\n';
		Results += '       ' + distLabel +' ' + Dist + AngRecord + Ang + '\n';
		Results += ZAline;

		if (Store == 0) {Results += '\nCalculated Point (NOT STORED):\n\n';  Pt = 'Calc_Pt';  Desc = 'Calc_Pt';}

		else if (Store == 1) {

			Pt = FormatString(Pt, 1, 0);
			Desc = FormatString(Desc, 1, 0);

			Results += '\nSTORED ' + Pt + '(' + Desc +'):\n\n'

		}

		else  return;

		Results += '       N:  ' + N + '\n       E:  ' + E + '\n' + Zline;
		
		if (Type == 'Azimuth') {

			var ptMt2 = new Array(3);
			ptMt2[0] = FromPt;
			ptMt2[1] = [Pt, Np, Ep, Zp, Desc];
			ptMt2[2] = [0];

		}

		else {

			var ptMt2 = new Array(3);
			ptMt2[0] = BSPt;
			ptMt2[1] = FromPt;
			ptMt2[2] = [Pt, Np, Ep, Zp, Desc];
			ptMt2[3] = [0];

		}

		if (Store == 0) {
		
			qG('TraverseCanvasSt').value = 'SketchPtPt(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\')';
			ZoomSketch(0, 0, 0);
			SketchPtPt(ptMt2, 'SVGCanvas');
			OutputCogo(Results, 'TraverseLog', 1, (Type == 'Azimuth' ? 1 : 0));
			qF('TravPt');
			
		}
		
		else if (Store == 1) {
		
			AddPoint(Pt, Np, Ep, Zp, Desc, function() {

				if (Increment) {qG('TravBS').value = qG('TravFrom').value;  qG('TravFrom').value = Pt;}
				qG('TravPt').value = '';
				
				qG('TraverseCanvasSt').value = 'SketchPtPt(' + JsonMat(ptMt2, 2) + ', \'SVGCanvas\')';
				SketchPtPt(ptMt2, 'SVGCanvas');
				OutputCogo(Results, 'TraverseLog', 1, (Type == 'Azimuth' ? 1 : 0));
			
			}, ptMt2, Results, Type, Increment, qG('TravFrom'));
		
		}

	}

}
