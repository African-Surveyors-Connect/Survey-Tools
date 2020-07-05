/*
	This heading must remain intact at all times.
	Copyright (c) 2018 Mark Mason.

	File:	Q-Cogo-Adjusts.js
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

	CompassRule
	NonMutableArray
	OutputArray
	OutputTitle
*/



// *******************************************************************************************************************************

function CompassRule(Store) {
	
// Solves and adjusts a traverse by the Compass Rule, with or without an angle adjustment
// Input:  Store point flag
// Output: The solved traverse, along with the adjusted points

	var E1 = '', E2 = '', StoreMessage = '', LevDet = qG('TolDetail').value;

	
	
// --------------------------------------------------
//  Section 1: Initial Checks, Prep Data
// --------------------------------------------------

// Find the contents of the input text boxes

	var StartList = qG('StartPts').value, CloseList = qG('ClosePts').value, AdjList = qG('AdjustPts').value;
	var AdjustHeader = 'ADJUST INPUT';

// Make sure required fields aren't blank

	if (!CheckBlank(StartList, ' Start point list', qG('StartPts'))) return;
	if (!CheckBlank(CloseList, ' Close point list', qG('ClosePts'))) return;
	if (!CheckBlank(AdjList, ' list of Adjust points delineating the traverse', qG('AdjustPts'))) return;
	
// Get point matrices and check

	if (!(StartList = GetPointList(StartList, 1, 0, 0, qG('StartPts'))))  return;
	if (!(CloseList = GetPointList(CloseList, 1, 0, 0, qG('ClosePts'))))  return;
	if (!(AdjList = GetPointList(AdjList, 1, 1, 0, qG('AdjustPts'))))  return;

// Make sure point matrices contain an allowable number of points

	var lS = StartList.length, lC = CloseList.length, lA = AdjList.length;
	
	if (lS < 1 || lS > 2) {qError(qG('StartPts'), 'Enter 1-2 Start points', AdjustHeader, 'errormessage');  return;}

	if (lC < 1 || lC > 2) {qError(qG('ClosePts'), 'Enter 1-2 Close points', AdjustHeader, 'errormessage');  return;}

	if (lC == 1 && lA < 2) {qError(qG('AdjustPts'), 'Enter at least 2 Adjust points delineating the traverse, including 1 to match the Close point', AdjustHeader, 'errormessage');  return;}

	if (lC == 2 && lA < 3) {qError(qG('AdjustPts'), 'Enter at least 3 Adjust points delineating the traverse, including 2 to match the Close points', AdjustHeader, 'errormessage');  return;}
	
// Make sure Start points and Close points are not contained in the Adjust points matrix

	for (var i=0; i<lA; i++) {
		
		for (var j=0; j<lS; j++) {if (AdjList[i][0] == StartList[j][0]) {qError(qG('AdjustPts'), 'Start points and Adjust points must not include common points', AdjustHeader, 'errormessage');  return;}}
		
		for (var k=0; k<lC; k++) {if (AdjList[i][0] == CloseList[k][0]) {qError(qG('AdjustPts'), 'Close points and Adjust points must not include common points', AdjustHeader, 'errormessage');  return;}}
		
	}
	
// Separate matrices of sideshots and main traverse points
// Sideshot matrix requires 2 companion vectors to house the "From" and "BS" point names for later reconstruction

	var TravList = '', SideList = '', lastFrom = StartList[StartList.length - 1][0];
	var lastBS = (StartList.length > 1 ? StartList[StartList.length - 2][0] : '');
	var SideFromList = '', SideBSList = '';
	
	for (var i=0; i<lA; i++) {
		
		if (AdjList[i][0].search(/\*/) < 0) {
			
			TravList += (TravList != '' ? ',' : '') + AdjList[i][0];
			lastBS = lastFrom;  lastFrom = AdjList[i][0];
			
		}
		
		else {
			
			if (TravList == '') {
				
				qError(qG('AdjustPts'), 'Sideshots must be measured from a main traverse point (points measured from start or close points should not be included)', AdjustHeader, 'errormessage');  return;
				
			}
			
			SideList += (SideList != '' ? ',' : '') + AdjList[i][0];
			SideFromList += (SideFromList != '' ? ',' : '') + lastFrom;
			SideBSList += (SideBSList != '' ? ',' : '') + lastBS;
			
		}
		
	}
	
	if (!(TravList = GetPointList(TravList, 1, 0)))  return;
	if (!(SideList = GetPointList(SideList, 1, 1)))  return;
	SideFromList = SideFromList.split(',');  SideBSList = SideBSList.split(',');
	
	var lTL = TravList.length, lSL = SideList.length, lSFL = SideFromList.length;

// Make sure points only appear in the sideshot matrix once, and not in the sideshot and main traverse matrix
// (Duplicates already eliminated from main traverse in GetPointList)

	for (var i=0; i<lSL; i++) {
		
		for (var j=0; j<lSL; j++) {
			
			if (i != j && SideList[i][0].replace('*', '') == SideList[j][0].replace('*', '')) {
				
				qError(qG('AdjustPts'), 'Point "' + SideList[j][0].replace('*', '') + '" must not be measured more than once as a sideshot', AdjustHeader, 'errormessage');  return;
				
			}
			
		}
		
		for (var k=0; k<lTL; k++) {
			
			if (i != k && SideList[i][0].replace('*', '') == TravList[k][0].replace('*', '')) {
				
				qError(qG('AdjustPts'), 'Point "' + TravList[k][0].replace('*', '') + '" must not be as a sideshot and a main traverse point', AdjustHeader, 'errormessage');  return;
				
			}
			
		}
		
	}



// --------------------------------------------------
//  Section 2: Traverse Closure
// --------------------------------------------------

// Perform traverse closure checks - if above bounds, prompt and skip remainder of adjustment

	var aBal = (lS == 2 && lC == 2 ? 1 : 0);
	
	var Tdist = 0, TLcalc = (lC == 2 ? lTL - 1 : lTL), tempP1, tempP2;
	
	for (var i=0; i<TLcalc; i++) {
		
		tempP2 = TravList[i][0];
		if (i > 0) {tempP1 = TravList[i-1][0];}  else {tempP1 = StartList[lS-1][0];}
		
		Tdist += PtPtInverse(0, tempP1, tempP2)[0];
		
	}
	
	var Tmisc = PtPtInverse(0, TravList[TLcalc-1][0], CloseList[0][0])[0];
	var TmiscAz = PtPtInverse(0, CloseList[0][0], TravList[TLcalc-1][0])[2];
	var Tprec = RoundSig(Tdist / Tmisc, 2);

	if (Tmisc > qG('TolMisc').value || Tprec < qG('TolPrec').value) {
	
		E1 = 'Traverse misclosure or relative precision does not fall within selected tolerances';
		qError(qG('AdjustPts'), E1, AdjustHeader, 'errormessage');
	
	}
	
	
	
// --------------------------------------------------
//  Section 3: Angle Balance
// --------------------------------------------------
	
	if (!E1) {
	
// If angle balance triggered, check angle close - if above bounds, prompt and skip remainder of adjustment

		if (aBal) {
			
			var AzCon = PtPtInverse(0, CloseList[0][0], CloseList[1][0])[2];
			var AzObs = PtPtInverse(0, TravList[lTL-2][0], TravList[lTL-1][0])[2];
			var AngMisc = AzObs - AzCon;
			var AdjCorr = AngMisc * -1;
			var AdjEach = AdjCorr / lTL;
			
		}
		
		if (Math.abs(AdjEach) > ParseDMS(qG('TolAngle').value)) {
	
			E2 = 'Angle adjustment per traverse leg does not fall within selected tolerance';
			qError(qG('AdjustPts'), E2, AdjustHeader, 'errormessage');
	
		}
		
		if (!E2) {
		
			if (aBal) {
			
// Form matrix of adjusted observation values (From, To, Initial Azimuth, Adjusted Azimuth, Distance) between main traverse points

				var AngAdjust = new Array();

				for (var i=0; i<lTL; i++) {
				
					tempP2 = TravList[i][0];
					if (i > 0) {tempP1 = TravList[i-1][0];}  else {tempP1 = StartList[lS-1][0];}
				
					AngAdjust[i] = [tempP1, tempP2, PtPtInverse(0, tempP1, tempP2)[2], PtPtInverse(0, tempP1, tempP2)[2] + AdjEach * (i + 1), PtPtInverse(0, tempP1, tempP2)[0]];
				
				}
				
				var lAA = AngAdjust.length;

// Adjust azimuths and re-calculate main traverse points

				var TravAng = new Array();

				for (var i=0; i<lTL; i++) {
				
					if (i > 0) {var Pfrom = TravAng[i-1];}  else {var Pfrom = StartList[lS-1];}
					
					var TempN = parseFloat(Pfrom[1]) + Math.cos(AngAdjust[i][3]) * AngAdjust[i][4];
					var TempE = parseFloat(Pfrom[2]) + Math.sin(AngAdjust[i][3]) * AngAdjust[i][4];
					
					TravAng[i] = [TravList[i][0], TempN, TempE, TravList[i][3], TravList[i][4]];
			
				}

			}

			
			
// --------------------------------------------------
//  Section 4: Compass Rule
// --------------------------------------------------
			
// Perform compass rule adjustment

			var TravTemp = (aBal ? TravAng : TravList);
			
			var TravFinal = NonMutableArray(TravTemp);
			
			var LastTravPt = (lC > 1 ? 2 : 1);
			var Ncorr = CloseList[0][1] - TravTemp[lTL-LastTravPt][1], Ecorr = CloseList[0][2] - TravTemp[lTL-LastTravPt][2];
			
// Calculate closure after angle balance

			if (aBal) {
			
				var Nerror = Ncorr * -1, Eerror = Ecorr * -1;
				
				var TAmisc = Math.sqrt(Math.pow(Ncorr, 2) + Math.pow(Ecorr, 2));
				var TAmiscAz = Math.atan2(Eerror, Nerror);  TAmiscAz = ((TAmiscAz < 0) ? TAmiscAz + 2 * Math.PI : TAmiscAz);
				var TAprec = RoundSig(Tdist / TAmisc, 2);
			
			}
			
// Form matrix of adjusted observation values (Point, Line Weight, dN, dE) for main traverse points
// Weight correction distribution based on line length
// (Only calculate adjustment to first close - second close point receives identical adjustment)

			var TravAdjust = new Array();

			for (var i=0; i<lTL; i++) {
			
				tempP2 = TravList[i][0];
				if (i > 0) {tempP1 = TravList[i-1][0];}  else {tempP1 = StartList[lS-1][0];}
				
				var tempDist = PtPtInverse(0, tempP1, tempP2)[0];
				var tempW = tempDist / Tdist;
				var tempDN = Ncorr * tempW, tempDE = Ecorr * tempW;
				
				if (i == lTL-1 && lC > 1) {break;}
			
				TravAdjust[i] = [tempP2, tempDist, tempW, tempDN, tempDE];
			
			}
			
			var lTA = TravAdjust.length;
			
// Form matrix of total corrections

			var totalN = 0, totalE = 0, TravApplied = new Array();

			for (var i=0; i<lTL; i++) {
			
				var tempIndex = ((i == lTL-1 && lC > 1) ? i-1 : i);
				var tempDN = TravAdjust[tempIndex][3], tempDE = TravAdjust[tempIndex][4];
				if (!(i == lTL-1 && lC > 1)) {totalN += tempDN;  totalE += tempDE;}
			
				TravApplied[i] = [TravTemp[i][0], totalN, totalE, TravTemp[i][3], TravTemp[i][4]];
			
			}

// Apply matrix of total corrections to arrive at final adjusted results

			for (var i=0; i<lTL; i++) {TravFinal[i][1] += TravApplied[i][1];  TravFinal[i][2] += TravApplied[i][2];}



// --------------------------------------------------
//  Section 5: Sideshots, Final Differencing
// --------------------------------------------------
			
// Compute matrix of sideshot observations

			var SideObs = new Array(), SSBS, SSFrom, SSThis, SSdist, SSang;

			for (var i=0; i<lSL; i++) {
			
				SSFrom = SideFromList[i];
				SSBS = SideBSList[i];
				SSThis = SideList[i][0].replace('*', '');
			
				SSdist = PtPtInverse(0, SSFrom, SSThis)[0];
				SSang = PtPtInverse(0, SSFrom, SSThis)[2] - PtPtInverse(0, SSFrom, SSBS)[2];
			
				SideObs[i] = [SSFrom, SSBS, SSang, SSdist, SSThis];
			
			}
			
// Apply observations to final adjusted main traverse coordinates to produce adjusted sideshots

			var SideFinal = new Array();

			for (var i=0; i<lSL; i++) {
			
				for (var j=0; j<lTL; j++) {
				
					if (SideObs[i][0] == TravFinal[j][0]) {var tempFrom = TravFinal[j];}
					if (SideObs[i][1] == TravFinal[j][0]) {var tempBS = TravFinal[j];}
				
				}
				
				if (!tempBS) {for (var k=0; k<lS; k++) {if (SideObs[i][1] == StartList[k][0]) {var tempBS = StartList[k];}}}
			
				var dN = tempBS[1] - tempFrom[1];
				var dE = tempBS[2] - tempFrom[2];
			
				var tempA = Math.atan2(dE, dN);  tempA = ((tempA < 0) ? tempA + 2 * Math.PI : tempA);
				var tempA = tempA + SideObs[i][2];
				
				var TempN = parseFloat(tempFrom[1]) + Math.cos(tempA) * SideObs[i][3];
				var TempE = parseFloat(tempFrom[2]) + Math.sin(tempA) * SideObs[i][3];
				
				SideFinal[i] = [SideList[i][0].replace('*', ''), TempN, TempE, SideList[i][3], SideList[i][4]];
			
			}
			
// Form summary matrix of adjustment amounts and final coordinates

			var Summary = new Array();
			
			for (var i=0; i<lTL; i++) {
			
				Summary[i] = [TravFinal[i][0], TravFinal[i][1]-TravList[i][1], TravFinal[i][2]-TravList[i][2], TravFinal[i][1], TravFinal[i][2]];
			
			}
			
			for (var i=0; i<lSL; i++) {
			
				Summary[i + lTL] = [SideFinal[i][0], SideFinal[i][1]-SideList[i][1], SideFinal[i][2]-SideList[i][2], SideFinal[i][1], SideFinal[i][2]];
			
			}
			
			

			

// --------------------------------------------------
//  Section 6: Store Results
// --------------------------------------------------

// Make non-mutable store copies of final arrays: originals altered when sketching

			var TravStore = NonMutableArray(TravFinal);
			var SideStore = NonMutableArray(SideFinal);

// Prompt and overwrite points

			if (Store) {

				var Message = 'It is strongly recommended that you review the results of your adjustment using the "Solve" button before proceeding. <br><br>';
				
				Message += (TravList.length + SideList.length) + ' points will be edited!<br><br>';
				Message += '<span class="par-label">Misc:</span>' + FormatDecimal(Tmisc, 0, 1).trim() + ' @ ' + FormatDMS(TmiscAz, 0).trim() + '<br>';
				Message += '<span class="par-label">Ang:</span>';
				Message += aBal ? (FormatDMS(AdjEach, 0, 1) + '/ Leg') : 'Angle balance CANNOT be performed';
				Message += '<br><br>';
				
				Message += 'Adjust points?';
				
				$.prompt(qP(Message, 'ADJUST POINTS'), {
					
					classes: {message: 'editmessage'},
					buttons: {Ok: true, Cancel: false},
					submit: function(e,v,m,f){
					
						if (v) {
				
// Update points matrix with new values

							var ptMt = ParsePoints();

							for (var m=0; m<ptMt.length; m++) {

								for (var l=0; l<TravStore.length; l++) {

									if (ptMt[m][0] == TravStore[l][0]) {ptMt[m][1] = TravStore[l][1];  ptMt[m][2] = TravStore[l][2];}

								}
								
								for (var k=0; k<SideStore.length; k++) {

									if (ptMt[m][0] == SideStore[k][0]) {ptMt[m][1] = SideStore[k][1];  ptMt[m][2] = SideStore[k][2];}

								}

							}

							var lP = ptMt.length-2;
							OutputPoints(ptMt, lP);
							ClearSort();
							
							StoreMessage = 'Point values adjusted in database.\n';

						}
						
						else {StoreMessage = 'Cancelled point storage. Point values not adjusted in database.\n';}
						
						ZoomSketch(0, 0, 0);
						OutputCogo(StoreMessage, 'AdjustLog', 0, 0, 1);
						qF('StartPts');
						
					},
					close: function(e,v,m,f){if (typeof v == 'undefined') {
						
						StoreMessage = 'Cancelled point storage. Point values not adjusted in database.\n';
						ZoomSketch(0, 0, 0);
						OutputCogo(StoreMessage, 'AdjustLog', 0, 0, 1);
						qF('StartPts');
						
					}}
					
				});
			
			}
			
			else {StoreMessage = 'Point values not adjusted in database.';}

		}

	}
	
	
	
// --------------------------------------------------
//  Section 7: Output Results
// --------------------------------------------------
	
// Output results
	
	var StartString = FormatPtList(StartList, 0);
	var CloseString = FormatPtList(CloseList, 0);
	var AdjString = FormatPtList(AdjList, 0);
	var TravString = FormatPtList(TravList, 0);
	if (lSL > 0) {var SideString = FormatPtList(SideList, 0);}  else {var SideString = '';}

	var Results = ''; 
	
	Results += OutputTitle('TRAVERSE SUMMARY');
	
	Results += 'Statistics:' + '\n\n';
	Results += '   Start Point' + (lS > 1 ? 's:' : ': ') + '  ' + StartString + '\n';
	Results += '   Close Point' + (lC > 1 ? 's:' : ': ') + '  ' + CloseString + '\n';
	Results += '   Adjust Points: ' + AdjString + '\n\n';
	
	Results += '   Main Traverse Legs: ' + lTL + '\n';
	Results += '   Sideshots:          ' + lSL + '\n\n';

	Results += 'Traverse closure' + (aBal ? ' BEFORE angle balance:' : ':') + '\n\n';
	Results += '   Length / Misclosure: ' + FormatDecimal(Tdist, 0, 1).trim() + ' / ' + FormatDecimal(Tmisc, 0, 1).trim() + ' @ ' + FormatDMS(TmiscAz, 0).trim() + '\n';
	Results += '   Relative Precision:  1:' + Tprec + '\n\n';

	if (!E1) {
	
		Results += OutputTitle('ANGLE BALANCE');
	
		Results += 'Angle balance ' + (aBal ? 'CAN be performed:' : 'CANNOT be performed') + '\n';
		Results += (aBal ? '\n' : '\n   -> 2 Start and close points are required for angle balance\n');
		Results += (aBal ? '' : '   -> Traverse will be adjusted by compass rule only\n\n');

// Output angle balance results if applicable
	
		if (aBal) {
		
			if (LevDet > 1) {Results += '   Control Azimuth: ' + FormatDMS(AzCon, 0) + '\n';}
			if (LevDet > 1) {Results += '   Observed Azimuth:' + FormatDMS(AzObs, 0) + '\n';}
			if (LevDet > 1) {Results += '   Error:           ' + FormatDMS(AngMisc, 0, 1) + '\n';}
			Results += '   Adjustment:      ' + FormatDMS(AdjCorr, 0, 1) + '\n';
			Results += '   Adjustment/Leg:  ' + FormatDMS(AdjEach, 0, 1) + '\n\n';
			
		}
		
		if (!E2) {
		
			if (aBal) {
				
				if (LevDet > 1) {Results += OutputArray('Angle Adjustment Values:', ['From', 'To', 'Az(Obs)', 'Az(Adj)', 'Dist'], ['S', 'S', 'DMS', 'DMS', 'Dec'], AngAdjust);}

				if (LevDet > 1) {Results += OutputArray('Main Traverse, BEFORE Angle Adjustment:', ['Point', 'N', 'E', 'Z', 'Desc'], ['S', 'Dec', 'Dec', 'Dec', 'S'], TravList);}
				
				if (LevDet > 1) {Results += OutputArray('Main Traverse, AFTER Angle Adjustment:', ['Point', 'N', 'E', 'Z', 'Desc'], ['S', 'Dec', 'Dec', 'Dec', 'S'], TravAng);}
				
				Results += 'Traverse closure AFTER angle balance:\n\n';
				Results += '   Length / Misclosure: ' + FormatDecimal(Tdist, 0, 1).trim() + ' / ' + FormatDecimal(TAmisc, 0, 1).trim() + ' @ ' + FormatDMS(TAmiscAz, 0).trim() + '\n';
				Results += '   Relative Precision:  1:' + TAprec + '\n\n';
				
			}
			
// Output compass rule results

			Results += OutputTitle('COMPASS RULE');
	
			Results +=  'Main Traverse, Compass Rule Parameters:\n\n';
			Results +=  '   Correction Northing: ' + FormatDecimal(Ncorr, 0, 1).trim() + '\n';
			Results +=  '   Correction Easting:  ' + FormatDecimal(Ecorr, 0, 1).trim() + '\n\n';

			if (LevDet > 1) {Results += OutputArray('Main Traverse, Line Weights and Corrections:', ['Point', 'Dist', 'Weight', 'dN', 'dE'], ['S', 'Dec', 'Dec', 'Dec', 'Dec'], TravAdjust);}
			
			if (LevDet > 1) {if (lC > 1) {Results +=  '   -> Both close points receive identical adjustments\n\n';}}
			
			if (LevDet > 1) {Results += OutputArray('Main Traverse, Total Applied Corrections:', ['Point', 'dN', 'dE', 'Z', 'Desc'], ['S', 'Dec', 'Dec', 'Dec', 'S'], TravApplied);}

			if (LevDet > 1) {Results += OutputArray('Main Traverse, Final Adjusted Values:', ['Point', 'N', 'E', 'Z', 'Desc'], ['S', 'Dec', 'Dec', 'Dec', 'S'], TravFinal);}
			
// Output sideshot results

			if (LevDet > 1) {Results += OutputTitle('SIDESHOTS');}

			if (LevDet > 1) {Results += OutputArray('Sideshot Observations:', ['From', 'BS', 'HA', 'HD', 'To'], ['S', 'S', 'DMS', 'Dec', 'S'], SideObs);}

			if (LevDet > 1) {Results += OutputArray('Sideshots, Final Adjusted Values:', ['Point', 'N', 'E', 'Z', 'Desc'], ['S', 'Dec', 'Dec', 'Dec', 'S'], SideFinal);}
			
// Ouput final results

			Results += OutputTitle('FINAL RESULTS');

			Results += OutputArray('Final Results Comparison:', ['Point', 'dN', 'dE', 'N', 'E'], ['S', 'Dec', 'Dec', 'Dec', 'Dec'], Summary);

			if (StoreMessage) {Results +=  StoreMessage + '\n'};
			
		}
		
		else {Results += E2 + '\n';}
	
	}
	
	else {Results += E1 + '\n';}
	
// Output results

	if (!TravFinal) {TravFinal = TravList;}
	if (!SideFinal) {SideFinal = SideList;}
	
	qG('AdjustCanvasSt').value = 'SketchAdjust(' + JsonMat(TravFinal, 2) + ', ' + JsonMat(SideFinal, 2) + ', ' + JsonMat(SideFromList, 1) + ', ' + JsonMat(StartList, 2) +  ', ' + JsonMat(CloseList, 2) +  ', \'SVGCanvas\')';	ZoomSketch(0, 0, 0);
	SketchAdjust(TravFinal, SideFinal, SideFromList, StartList, CloseList, 'SVGCanvas');
	
	OutputCogo(Results, 'AdjustLog');
	qF('StartPts');
	
}

// *******************************************************************************************************************************

function NonMutableArray(source) {
	
// Creates a non-mutable copy of an array of the form PNEZD (altering copy will not alter original)
// Input:  Source array
// Output: Non-mutable copy of the source array

	var lS = source.length, result = new Array();
	
	for (var i=0; i<lS; i++) {result[i] = ['' + source[i][0], parseFloat(source[i][1]), parseFloat(source[i][2]), parseFloat(source[i][3]), '' + source[i][4]];}
	
	return result;

}

// *******************************************************************************************************************************

function OutputArray(Title, Headings, Types, Matrix) {
	
// Writes an array in a format appropriate for a textarea
// Input:  Title of table, Headings array, Types ("S"=String, "DMS"=DMS, "Dec"=Decimal) aray
// Output: Text string suitable for insertion into the area

// 'Angle Adjustment Values:', 'From, To, Az(Obs), Az(Adj), Dist', 'S, S, DMS, DMS, Dec'

	var Results = '', lH = Headings.length, lT = Types.length, lM = Matrix.length;
	
	if (lM > 0) {
	
		if (lH == lT) {

			Results += Title + '\n\n';
			Results += '   ';
			for (var i=0; i<lH; i++) {Results += Headings[i] + '   ';}
			Results += '\n';
			Results += '   ----------------------------------------------------------------\n';
			
			for (var i=0; i<lM; i++) {Results += '   ';
			
				for (var j=0; j<lH; j++) {
			
					if (Types[j] == 'S') {Results += FormatString(Matrix[i][j], 0, 0, 1) + '  ';}
					else if (Types[j] == 'DMS') {Results += FormatDMS(Matrix[i][j], 0) + '  ';}
					else if (Types[j] == 'Dec') {Results += FormatDecimal(Matrix[i][j], 0, 1) + '  ';}
					else {Results += ' ! No Value Type ! '}
					
				}
			
				Results += '\n';
				
			}
			
			Results += '\n';
			
			return Results;
		
		}
		
		else {return 'INPUT ARRAY LENGTHS MISMATCH!\n\n';}
	
	}
	
	else return '';
	
}

// *******************************************************************************************************************************

function OutputTitle(Title) {
	
// Writes a title for a given area of texarea output
// Input:  Title of section
// Output: Text string suitable for insertion into the area

	var SpacedTitle = '' + Title, CharSpacers = '', LineSize = 35;
	
	for (var i=SpacedTitle.length; i<LineSize-4; i++) {
		
		if (i%2 == 0) {SpacedTitle = ' ' + SpacedTitle;}
		else {SpacedTitle = SpacedTitle + ' ';}
		
	}
	
	SpacedTitle = '--' + SpacedTitle + ' --';
	
	for (var j=0; j<LineSize+1; j++) {CharSpacers += '*';}

	var Results = '\n\n' + CharSpacers + '\n';
	Results += SpacedTitle + '\n';
	Results += CharSpacers + '\n\n';
	
	return Results;
	
}

// *******************************************************************************************************************************
