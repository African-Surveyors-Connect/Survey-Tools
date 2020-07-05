/*
	This heading must remain intact at all times.
	Copyright (c) 2018 Mark Mason.

	File:	Q-Cogo-Misc.js
	Use:	To provide miscellaneous operations for Q-Cogo, <http://www.q-cogo.com/>.
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

	JsonMat
	GetPointList
	
	SameCoords
	SamePoint
	ParseDMS
	ParseDecimal
	ParsePoints
	ConfirmDMS
	ConfirmDecimal
	FormatDMS
	FormatArea
	FormatDecimal
	FormatGrade
	FormatStn
	FormatString
	FormatPtList
	CheckBlank
	CheckPoint
	CheckDesc
	StrictCheck
	StrictPoint
	StrictDesc
	
	SetPoint
	AddPoint
	AutoPoint
	ClearSort
	SortPoints
	OutputPoints
	DeletePoint
	RewritePoints
	SampleData
	SampleData2
	OutputCogo
	
	RemoveBlank
	Round
	RoundSig
	debug
	qP
	
	SaveTo
	LoadFrom
	MakeTextFile
	ReadTextFile
	ReadTextFile2
	CheckFileName
*/



// *******************************************************************************************************************************

function JsonMat(ptMt, Dim) {

// Encodes a JSON string from a matrix
// Input:  The matrix to encode, dimension of matrix
// Output: The encoded string

	var JM =  '[';

	if (Dim == 2) {

		for (var i=0; i<ptMt.length; i++) {

			JM += '[';
			for (var j=0; j<ptMt[i].length; j++)  JM += '"' + ptMt[i][j] + '"' + ((j < ptMt[i].length - 1) ? ', ' : '');
			JM += ']' + ((i < ptMt.length - 1) ? ', ' : '');

		}

	}

	else if (Dim == 1)  for (var j=0; j<ptMt.length; j++)  JM += '\'' + ptMt[j] + '\'' + ((j < ptMt.length - 1) ? ', ' : '');

	JM += ']';  return JM;

}

// *******************************************************************************************************************************

function GetPointList(PtList, Multiple, Radial, suppress, element) {

// Gets a matrix of points as requested by a '-' '..' or ',' separated list string, or a single point request
// Input:  Point list, '-' '..' or ',' separated, multiple points flag (1 to allow many points), radial points flag (1 if list includes radial points), suppress flag, return element
// Output: The resulting points matrix or the single point

	var check = 0;

// Parse the existing points file contents into a points matrix and replace spaces

	var ptMt = ParsePoints();  PtList = PtList.replace(/\s+/g,'');  PtList = PtList.replace(/\.\.+/g,'-');

// If all contents indicated, return all existing points in their current order

	if (PtList == '*.*' && Multiple) {

		PtList = new Array(0);  for (i=0; i<ptMt.length - 1; i++)  PtList[i] = ptMt[i];  return (PtList);

	}

	PtList = PtList.split(',');

// If more than one point indicated, separate string into array of single points and point ranges

	if (Multiple) {

// Format every element in point list to match values in point records, parse ranges and replace with point lists

		var Range = 0, k = 0, Index1 = -1, Index2 = -1, Asterisk = '';

		for (var j=0; j<PtList.length; j++) {

			if (PtList[j].search(/\-/) < 0) {

				PtList[j] = ((PtList[j]) ? FormatString(PtList[j], 1, Radial) : 'Error_one_or_more_points_contain_null_values');

			}

			else {

				Range = PtList[j].split('-');

// Replace empty range values with empty string flag (much longer string than legal point)

				Range[0] = ((Range[0]) ? FormatString(Range[0], 1, Radial) : 'Error_one_or_more_points_contain_null_values');
				Range[1] = ((Range[1]) ? FormatString(Range[1], 1, Radial) : 'Error_one_or_more_points_contain_null_values');

				Range.sort(sortRange);

				ptMt.sort(sortByPt);

				for (k=0; k<ptMt.length; k++) {

					if (Range[0].replace(/\*/g,'') == ptMt[k][0])  Index1 = k;
					else if (Range[1].replace(/\*/g,'') == ptMt[k][0])  Index2 = k;

				}

				PtList.splice(j, 1, Range[0]);

				if (Index1 > -1 && Index2 > -1) {

					for (k=Index1+1; k<Index2; k++) {PtList.splice(j + 1, 0, ptMt[k][0]);  j++;}

				}

				PtList.splice(j + 1, 0, Range[1]);  j++;

			}

		}

	}

// Eliminate duplicates / empty strings, and get point for every element in point list

	for (var j=0; j<PtList.length; j++) {

		var PreAsterisk = '', PostAsterisk = '';

		if (PtList[j] == 'Error_one_or_more_points_contain_null_values')  {PtList.splice(j, 1);  j--;}

		else {

			for (var i=j; i<PtList.length; i++) {

				if (i != j && PtList[i] == PtList[j] && PtList[i].search(/\*/) < 0) {PtList.splice(i, 1);  i--;}

			}

			check = 0;

			for (i=0; i<ptMt.length; i++) {

				if ((ptMt[i][0] == PtList[j].replace(/\*/g,'') && Radial) || (ptMt[i][0] == PtList[j])) {

					if (PtList[j].search(/\*/) == PtList[j].length - 1)  PostAsterisk = '*';
					if (PtList[j].search(/\*/) == 0)  PreAsterisk = '*';

					check = 1;
					PtList[j] = [ptMt[i][0], ptMt[i][1], ptMt[i][2], ptMt[i][3], ptMt[i][4]];
					PtList[j][0] = PreAsterisk + PtList[j][0] + PostAsterisk;

					break;

				}

			}

// Alert and return error if point not found

			if (!check) {
				
				var Header = 'POINT INPUT';

				if (!suppress) {
				
					if (Radial) {qError(element, 'Point \"' + PtList[j].replace(/\*/g,'') + '\" not found!', Header, 'errormessage');}
					else {qError(element, 'Point \"' + PtList[j] + '\" not found!', Header, 'errormessage');}
				
				}
				
				return check;

			}

		}

	}

	return ((Multiple) ? PtList : PtList[0]);

}

// *******************************************************************************************************************************

function SameCoords(Pt1, Pt2, Error, suppress, element) {

// Checks to see if two given points have the same northing and easting
// Input:  The two point vectors to check, error string, suppress prompt flag
// Output: 0 if the points are different, 1 if they are identical, plus the appropriate alert boxes

	var check = 0;
	if (Pt1[1] == Pt2[1] && Pt1[2] == Pt2[2]) {if (!suppress) {qError(element, Error + ' points have identical northings and eastings!', 'POINT INPUT', 'errormessage')} check = 1;}
	return check;

}

// *******************************************************************************************************************************

function SamePoint(Pt1, Pt2, Error, suppress, element) {

// Checks to see if two given points are the same
// Input:  The two point names to check, and the error message to display
// Output: 0 if the points are different, 1 if they are identical, plus the appropriate alert boxes

	var check = 0;
	if (Pt1 == Pt2) {if (!suppress) {qError(element, Error + ' points are identical!', 'POINT INPUT', 'errormessage')} check = 1;}
	return check;

}

// *******************************************************************************************************************************

function ParseDMS(Value, AllowExpr, AllowConst, element) {

// Changes a DMS angle (DDD.MMSSSS... or DDD°MM'SS.SS..." or Pt..Pt) into a radian angle suitable for calculations
// Input:  DMS angle formed DDD.MMSSSS... or DDD°MM'SS.SS..." or Pt..Pt, Allow Expression flag (1 to allow expressions), Allow Constants flag (1 to allow constant +- angle), calling element (optional)
// Output: The radian angle, or X if it cannot be parsed, plus appropriate alert boxes

	var check = 1, negative = 0, ValCheck = 0;
	var ErrorStr = 'DMS angles must be simple mathematical expressions, Pt..Pt expressions, or numbers of the form DDD.MMSSSS... or DDD°MM\'SS.SS..." (seconds decimals allowed)';
	var Header = 'ANGLE FORMAT';

	Value = Value.replace(/\s+/g,'');

// Change all 'SS.SS..." to 'SSSS..." by replacing all . that fall between ' and "

	Value = Value.replace(/'(.*)"/g, function(text, p1) {return text.replace(/\.+/g, '');});
	
// Replace DMS formatting characters with expected values

	Value = Value.replace(/°/g,'.');
	Value = Value.replace(/'/g,'');
	Value = Value.replace(/"/g,'');
	
// Check for quadrantal bearing notations

	ValCheck = Value.replace(/[^N n S s E e W w]/g,'');
	ValCheck = ValCheck.toUpperCase();
	Value = Value.replace(/[N n S s E e W w]/g,'');

// Check for Pt..Pt type notation and retrieve azimuth if possible

	if (Value.search(/\.\./) > 0 && Value.search(/\.\./) != Value.length - 2) {

		Value = Value.split('..', 2);

		if (!GetPointList(Value[0], 0, 0, 0, element) || !GetPointList(Value[1], 0, 0, 0, element) || SamePoint(Value[0], Value[1], 'Reference', 0, element) || SameCoords(GetPointList(Value[0], 0, 0, 0, element), GetPointList(Value[1], 0, 0, 0, element), 'Reference', 0, element) || !(Value = PtPtInverse(0, Value[0], Value[1])[2])) {

			check = 'X';
			return check;

		}

		return Value;

	}

// Check for expressions and evaluate if allowed

	if (AllowExpr && Value.search(/\+|\-|\*|\//) >= 0) {

		var Ops = Value.split(/[^(,),\-,\+,\*,\/]/);
		var Vals = Value.split(/[(,),\-,\+,\*,\/]/);

		Ops = RemoveBlank(Ops);
		Vals = RemoveBlank(Vals);

// If expression starts with an operator, parse appropriately

		if (Value[0].split(/[^(,),\-,\+,\*,\/]/)[0]) {

			Value = '';

			for (var n=0; n<Ops.length; n++) {

				Value += ((Ops[n]) ? Ops[n] : '');
				Value += ((Vals[n]) ? ParseDMS(Vals[n], 0, 0) : '');

				if (Value.search(/X/) >= 0) {check = 'X';  return check;}

			}

			Value += ((Vals[n]) ? ParseDMS(Vals[n], 0, 0) : '');

		}

// If expression starts with a value, parse appropriately

		else {

			Value = '';

			for (var p=0; p<Vals.length; p++) {

				Value += ((Vals[p]) ? ParseDMS(Vals[p], 0, 0) : '');
				Value += ((Ops[p]) ? Ops[p] : '');

				if (Value.search(/X/) >= 0) {check = 'X';  return check;}

			}

			Value += ((Ops[p]) ? Ops[p] : '');

		}

		try {

	 		Value = eval(Value);

		}

		catch(e) {

			check = 'X';
			qError(element, ErrorStr, Header, 'errormessage');
			return check;

		}

	}

// Otherwise, check that input is a number and parse as DMS

	else {

		if (isNaN(parseFloat(Value))) {

			check = 'X';
			qError(element, ErrorStr, Header, 'errormessage');
			return check;

		}

		Value = parseFloat(Value);

// If value is negative, set to positive and flag as negative

		if (Value < 0) {Value = -1 * Value;  negative = 1;}

		var D = Math.floor(Value);
		var M = Math.floor(Round((Value - D) * 100, 10));
		var S = (Value - D - M / 100) * 10000;

// Check that user entered minutes and seconds are less than 60

		if (M >= 60 || S >= 60) {

			check = 'X';
			qError(element, 'DMS minutes and seconds must be less than 60', Header, 'errormessage');
			return check;

		}

		Value = (D + (M / 60) + (S / 3600)) * Math.PI / 180;

	}

// Check for infinite results

	if (Value == Infinity) {

		check = 'X';
		qError(element, ErrorStr, Header, 'errormessage');
		return check;

	}

// Convert quadrantal bearings to azimuths

	if (Value <= Math.PI / 2) {
	
		if (ValCheck == 'SE') {Value = Math.PI - Value;}
		if (ValCheck == 'SW') {Value = Math.PI + Value;}
		if (ValCheck == 'NW') {Value = 2 * Math.PI - Value;}
	
	}

// If value is flagged as negative, set back to negative

	Value = ((negative) ? -1 * Value : Value);
	
	return ((AllowConst) ? Value + ParseDMS(qG('GlobalAz').value, 0, 0) : Value);

}

// *******************************************************************************************************************************

function ParseDecimal(Value, AllowExpr, AllowSF, element, suppress, CoordType) {

// Changes a decimal string (VVV.VVV... or Pt..Pt) into a float value suitable for calculations
// Input:  Decimal formed VVV.VVV... or Pt..Pt, Allow Expression flag (1 to allow expressions), Allow Scale Factor flag (1 to allow applied scale), calling element (optional), suppress flag (optional), coordinate type (optional, 'dN', 'dE', 'dZ') to retrieve only one component of an inverse
// Output: The float value, or X if it cannot be parsed, plus appropriate alert boxes

	var check = 1;
	var ErrorStr = 'Distances, coordinates and scale factors must be must be simple mathematical expressions, Pt..Pt expressions, or numbers';
	var Header = 'NUMBER FORMAT';
	
// Check for Pt..Pt type notation and retrieve distances if possible

	if (Value.search(/\.\./) > 0 && Value.search(/\.\./) != Value.length - 2) {

		Value = Value.split('..', 2);
		
// Retrieve requested column, if any
		
		var Column = (CoordType == 'dN' ? 3 : CoordType == 'dE' ? 4 : CoordType == 'dZ' ? 5 : 0);

		if (!GetPointList(Value[0], 0, 0, suppress, element) ||
			!GetPointList(Value[1], 0, 0, suppress, element) ||
			SamePoint(Value[0], Value[1], 'Reference', suppress, element) ||
			SameCoords(GetPointList(Value[0], 0, 0, suppress, element), GetPointList(Value[1], 0, 0, suppress, element), 'Reference', suppress, element) ||
			!(Value = PtPtInverse(0, Value[0], Value[1])[Column])) {

			check = 'X';
			return check;

		}

		return Value;

	}

// Check for expressions and evaluate if allowed and possible

	if (AllowExpr && Value.search(/\+|\-|\*|\//) >= 0) {

		try {Value = eval(Value);}
		catch(e) {
			
			check = 'X';
			if (!suppress) {qError(element, ErrorStr, Header, 'errormessage');}
			return check;
			
		}

	}

// Otherwise, check that input is a number

	if (isNaN(parseFloat(Value))) {
		
		check = 'X';
		if (!suppress) {qError(element, ErrorStr, Header, 'errormessage');}
		return check;
		
	}
	
	Value = parseFloat(Value);

// Check for infinite results

	if (Value == Infinity) {
		
		check = 'X';
		if (!suppress) {qError(element, ErrorStr, Header, 'errormessage');}
		return check;
		
	}
	
// Return value if passed the above checks
	
	return ((AllowSF) ? Value * qG('GlobalSF').value : Value);

}

// *******************************************************************************************************************************

function ParsePoints() {

// Converts the precise textarea contents into a matrix of points
// Input:  None
// Output: 2D matrix of points

// Get points contents from textarea

	var pointsContents = qG('pointsContents').value;

// Remove "\n" and multiple spaces from Points Contents and split into a vector

	pointsContents = pointsContents.replace(/\n/g,'');  pointsContents = pointsContents.replace(/\s+/g,' ');
	var ptV = pointsContents.split(' ');

// Find length of points matrix, and initialize

	var lP = parseInt((ptV.length - 1) / 5);  var ptMt = new Array();

// Read data into 2D matrix and return

	for (var i=0; i<=lP; i++)   ptMt[i] = [ptV[0 + i*5], ptV[1 + i*5], ptV[2 + i*5], ptV[3 + i*5], ptV[4 + i*5]];
	return ptMt;

}

// *******************************************************************************************************************************

function ConfirmDMS(element) {

// Analyses and formats DMS values from input onblur, setting the input value appropriately
// Input: the element's 'this' 
// Output: The formatted, evaluated DMS value in the appropriate input

	var Box = qG(element.id);
	var Value = Box.value;
	
	if (Value) {
	
		Value = ParseDMS(Value, 1, 0, element);
		
		if (Value != 'X') {
		
			Value = FormatDMS(Value);
			Box.value = Value.trim();
			return true;
		
		}
		
		else {return false;}
	
	}

}
	
// *******************************************************************************************************************************
	
function ConfirmDecimal(element, Precise, CoordType) {

// Analyses and formats decimal values from input, setting the input value appropriately
// Input: the element's 'this', precise flag (0 for rounded value, 1 for 10 decimal place precise value), coordinate type (optional, 'dN', 'dE', 'dZ') to retrieve only one component of an inverse
// Output: The formatted, evaluated decimal value in the appropriate text box

	var Box = qG(element.id);
	var Value = Box.value;
	if (!CoordType) {CoordType = '';}
	
	if (Value) {
	
		Value = ParseDecimal(Value, 1, 0, element, 0, CoordType);
		
		if (Value != 'X') {
		
			Value = FormatDecimal(Value, Precise);
			Box.value = Value.trim();
			return true;
		
		}
		
		else {return false;}
	
	}

}

// *******************************************************************************************************************************
	
function FormatDMS(Value, DecimalForm, Signed) {

// Converts given radian string into a formatted DMS value (no standard width)
// Input:  Original radian string, decimal form flag (0 for symbolic output, 1 for DDD.MMSS... form), signed value flag (optional, does not force to 0-360 range, adds "+" or "-")
// Output: DMS formatted string

	var signVal = '';

// Change string into float DD value

	Value = parseFloat(Value);
	Value = Value * 180 / Math.PI;

// Ensure value is between 0 and 360, or remove and record sign

	if (!Signed) {while (Value < 0)  Value += 360;  Value = Value % 360;}
	
	else {
	
		if (Value < 0) {Value = Value * -1; signVal = '-';}
		else {signVal = '+';}
		
	}

// Find D, M, and S (S to specified precision)

	var valuePrecision = parseInt(qG('APrecision').value);
	var VP = -1 * (valuePrecision) * 5;
	
	D = Math.floor(Value);
	M = Math.floor((Value - D) * 60);
	S = (Value - D - M / 60) * 3600;

	var SMult = 1;
	if (VP > 5) {S = S / VP; SMult = VP; VP = 1;}

	S = SMult * ((valuePrecision >= 0) ? Round(S, valuePrecision) : Math.round(Math.round(S) / VP) * VP);

// Ensure minutes and seconds are less than 60 and degrees are between 0 and 360

	if (S == 60) {M += 1;  S = 0;}
	if (M == 60) {D += 1;  M = 0;}
	D = D % 360;

// Add leading spaces to convert unit to uniform spacing

	D = signVal + D;  for (var i=D.length; i<=3; i++)  D = ' ' + D;

// Add leading zero to minutes (if needed)

	M = M + '';  M = ((M.length < 2) ? '0' + M : M);

// Format seconds to working precision

	S = S + '';
	S = ((S.search(/\./) < 0 && valuePrecision > 0) ? S + '.' : S);
	S = (((S.search(/\./) < 2 && valuePrecision > 0) || S.length < 2) ? '0' + S : S);
	SZeros = ((valuePrecision > 0) ? S.length - S.search(/\./) : valuePrecision + 1);
	for (var j=SZeros; j<=valuePrecision; j++)  S = S + '0';

	return ((DecimalForm) ? D + '.' + M + S.replace(/\./, '') : D + '\u00B0' + M + '\'' + S + '\"');

}

// *******************************************************************************************************************************

function FormatArea(Value, Units) {

// Converts given area string (in square units) into a formatted value (in Ha or acres) to set number of sig figs
// Input:  Original value, units flag
// Output: Formatted value

// Set working number of significant figures

	var valuePrecision = parseInt(qG('AreaPrecision').value);
	var valuePrecisionN = parseInt(qG('DPrecision').value)-1;
	var valueUnits = parseInt(qG('AreaUnits').value);

// Convert to Ha or acres

	var ValueN = parseFloat(Value);
	Value = ((valueUnits == 1) ? parseFloat(Value) / 10000 : parseFloat(Value) / 43560);
	UnitN = ((valueUnits == 1) ? ' sq m' : ' sq ft');
	Unit = ((valueUnits == 1) ? ' Ha' : ' acre');

// Format to correct number of sig figs

	Value = RoundSig(Value, valuePrecision) + '';
	ValueN = Round(ValueN, valuePrecisionN) + '';

	var lV = Value.length, n = 0, go = 0;

	for (var i=0; i<lV; i++) {if (Value[i] != '.' && Value[i] != '0' && !go)  go = 1;  if (Value[i] != '.' && go) n++;}

	Value += ((n < valuePrecision && Value.search(/\./) < 0) ? '.' : '');
	for (i=n; i<valuePrecision; i++)  Value += '0';

// Add enough spaces to value to create uniform length value, add units

	var curWidth = ((Value.search(/\./) > -1) ? Value.search(/\./) : Value.length), valueWidth = 7;

	for (i=curWidth; i<=valueWidth; i++)  Value = ' ' + Value;
	
	Value += ((Units && qG('AreaUnitDisp').value == 1) ? Unit : '');
	Value += ' / ' + ValueN + ((Units && qG('AreaUnitDisp').value == 1) ? UnitN : '');
	
	return Value;

}

// *******************************************************************************************************************************

function FormatDecimal(Value, Precise, Units) {

// Converts given decimal string into a standard width value
// Input:  Original value, precise flag (0 for rounded value, 1 for 10 decimal place precise value), units flag
// Output: Formatted value

// Set width of columns and working number precision

	var valuePrecision = 10;
	if (!Precise)  valuePrecision = parseInt(qG('DPrecision').value);
	var valueWidth = 8 + valuePrecision;

// Round value to working precision

	Value = parseFloat(Value);
	Value = Round(Value, valuePrecision);

// Add decimal (if needed) and add trailing zeros to meet working precision

	Value = Value + '';
	if (Value.search(/\./) < 0)  Value += '.';
	valZeros = Value.length - Value.search(/\./);
	for (var j=valZeros; j<=valuePrecision; j++)  Value = Value + '0';

// Add enough spaces to value to create uniform length value, add units

	valSize = Value.length;
	Unit = ((qG('DistUnits').value == 1) ? 'm' : '\'');
	for (var i=valSize; i<=valueWidth; i++)  Value = ' ' + Value;
	
	return Value + ((Units && qG('DistUnitDisp').value == 1) ? Unit : '');

}

// *******************************************************************************************************************************

function FormatGrade(Rise, Run) {

// Converts given rise and run into a standard width % value
// Input:  Rise and run of slope
// Output: Formatted grade

// Set width of columns and working number precision

	var valuePrecision = parseInt(qG('GPrecision').value);

	var valueWidth = 7 + valuePrecision;

// Round values to working precision

	Rise = parseFloat(Rise);
	Run = parseFloat(Run);
	var Grade = 100 * Rise / Run;
	Grade = Round(Grade, valuePrecision);

	if (Grade > 10000 || Grade < -10000 || isNaN(Grade)) {Grade = '      N/A';  return Grade;}

	else {

// Add decimal (if needed) and add trailing zeros to meet working precision

		Grade = Grade + '';

		if (Grade.search(/\./) < 0)  Grade = Grade + '.';

		valZeros = Grade.length - Grade.search(/\./);

		for (var j=valZeros; j<=valuePrecision; j++)  Grade = Grade + '0';

// Add enough spaces to value to create uniform length value

		valSize = Grade.length;
		for (var i=valSize; i<=valueWidth; i++)  Grade = ' ' + Grade;
		return Grade + '%';

	}

}

// *******************************************************************************************************************************

function FormatStn(Value) {

// Converts given stationing string into a value of the form 1 + 234.567 (to specified precision)
// Input:  Value to be formatted
// Output: Formatted value

// Round value to current working precision and remove spaces

	Value = FormatDecimal(Value, 0, 1);
	Value = Value.replace(/\s+/g,'');

// Format as a standard stationing value

	var Sep = ' + ';

	if (Value.search(/\-/) >= 0) {Value = Value.substring(1);  Sep = ' - ';}

	var DP = Value.search(/\./);

	if (DP > 2) {var Val1 = Value.substring(0, DP - 2);  var Val2 = Value.substring(DP - 2);  Value = Val1 + Sep + Val2;}

	else if (DP <= 2) {

		for (var i=DP; i<2; i++)  Value = '0' + Value;
		Value = '0' + Sep + Value;

	}

	return Value;

}

// *******************************************************************************************************************************

function FormatString(Value, Short, Radial, IgnoreSpace) {

// Converts given string into a standard width value
// Input:  Original value, short flag (1 for short no-spaces output), radial flag (1 to allow extra '*' character at start / end), ignore space flag (true for no trim)
// Output: New value

// Check for radial symbol

	var PreAsterisk = '', PostAsterisk = '';

	if (Radial && Value.search(/\*/) == Value.length - 1) {Value = Value.replace(/\*/g,'');  PostAsterisk = '*';}
	else if (Radial && Value.search(/\*/) == 0) {Value = Value.replace(/\*/g,'');  PreAsterisk = '*';}

// Set width of columns and truncate value if necessary

	var valueWidth = 8;
	if (!IgnoreSpace) {Value = Value.trim();}
	Value = Value.replace(/\s+/g,'_');
	Value = Value.substring(0, valueWidth);
	Value = PreAsterisk + Value + PostAsterisk;

// If short flag not set, add enough spaces to value to create uniform length value

	if (!Short) {for (var i=Value.length; i<=valueWidth; i++)  Value = Value + ' ';}
	return Value;

}

// *******************************************************************************************************************************

function FormatPtList(PtList, Sort) {

// Converts given point list into a "," and "-" separated string ("-" denotes all points used between sorted points matrix elements)
// Input:  Point list to format, sort flag (1 to provide sorted output, 0 to leave point order as is)
// Output: Formatted point list

// Load points matrix and remove blank row, then sort

	var ptMt = ParsePoints();
	var lP = ptMt.length - 2;
	ptMt.splice(lP + 1, 1);
	ptMt.sort(sortByPt);

	var lL = PtList.length - 1;

// If sorted output required, sort point list

	if (Sort)  PtList.sort(sortByPt);

// Make array of point list element occurrences in points matrix

	var PtIndex = new Array(lL);

	for (var i=0; i<=lL; i++) {

		for (var j=0; j<=lP; j++) {if (PtList[i][0].replace(/\*/g,'') == ptMt[j][0]) {PtIndex[i] = j;  break;}}

	}

// Produce formatted string, separating any radial points

	var i1 = 0, i2 = 0, PtString = '';

	while (i1 <= lL) {

		for (i=i1; i<=lL; i++) {

			i2 = i;

			if (i2 - i1 != PtIndex[i2] - PtIndex[i1] || PtList[i2][0].search(/\*/) >= 0)  break;

		}

		if (i2 < lL) {

			PtString += ((i2 - i1 > 2) ? PtList[i1][0] + '-' + PtList[i2 - 1][0] : (i2 - i1 == 2) ? PtList[i1][0] + ',' + PtList[i2 - 1][0] : PtList[i1][0]);

			PtString += ',';

		}

		else {

			PtString += (

			(i2 - i1 > 2 && (PtIndex[i2] - PtIndex[i2 - 1] != 1 || PtList[i2][0].search(/\*/) >= 0)) ? PtList[i1][0] + '-' + PtList[i2 - 1][0] + ',' + PtList[i2][0]

			: (i2 - i1 > 1 && (PtIndex[i2] - PtIndex[i2 - 1] != 1 || PtList[i2][0].search(/\*/) >= 0)) ? PtList[i1][0] + ',' + PtList[i2 - 1][0] + ',' + PtList[i2][0]

			: (i2 - i1 > 1 && PtIndex[i2] - PtIndex[i2 - 1] == 1) ? PtList[i1][0] + '-' + PtList[i2][0]

			: (i2 - i1 == 1) ? PtList[i1][0] + ',' + PtList[i2][0]

			: PtList[i2][0]);

			break;

		}

		if (PtList[i2][0].search(/\*/) < 0)  {i1 = i;}

		else {

			if (i2 > 0)  PtString += PtList[i2][0] + ','
			i1 = i + 1;

		}

	}
	
// Remove duplicate adjacent radial points (sidestepping error that duplicates Pt2* appearing directly after Pt1*)

	PtString = PtString.split(',');  var lItem = PtString[0];
	
	for (var i=1; i<PtString.length; i++) {
	
		if (PtString[i].search(/\*/) >= 0 && PtString[i] == lItem) {PtString[i] = '';}
		else {lItem = PtString[i];}
	
	}
	
	PtString = PtString.join();  PtString = PtString.replace(/,,/g, ',');

	return PtString;

}

// *******************************************************************************************************************************

function CheckBlank(Value, errorString, element) {
	
// Checks that a field isn't blank
// Input:  Field Value, error string return element
// Output: 1 if OK, 0 if not, and the appropriate notification box

//	Value = Value.trim();

	if (!Value) {qError(element, 'Enter a' + errorString, 'REQUIRED VALUE', 'errormessage'); return 0;}
	
	else {return 1;}
	
}

// *******************************************************************************************************************************

function CheckPoint(Pt, element, suppress1, suppress2) {

// Checks that a point name is suitable (no commas, spaces, or dashes) and is not already in use. Both options can be suppressed and return 'X' instead of 0 and prompt.
// Input:  Point name, the element's 'this' (optional), suppress warning flags (optional)
// Output: Returns 1 if OK, 0 if not, plus appropriate prompts. Options to suppress first or second prompts will return 'X' on failure.

// Check and notify if name contains illegal characters

	if (Pt.search(/\+|\-|\*|\/|\,|\.|\(|\)|\[|\]|\{|\}/) >= 0) {
	
		if (!suppress1) {qError(element, 'Point names must not contain simple mathematical characters, dots, or commas', 'POINT FORMAT', 'errormessage');}
		
		return (suppress1 ? 'X' : 0);

	}

// Format input to match values in point records

	Pt = FormatString(Pt, 1, 0);

// Get point records matrix

	var ptMt = ParsePoints();
	var lP = ptMt.length;

// Check all point names against new value, notifying if point exists
// (Usually suppressed, but useful if overwriting a point is not allowed during a function)

	var PtFound = 0;

	for (var i=0; i<lP; i++) {if (ptMt[i][0] == Pt) {PtFound = 1; break;}}
	
	if (PtFound) {
	
		if (!suppress2) {
		
			var Ne = ptMt[i][1];  var Ee = ptMt[i][2];  var Ze = ptMt[i][3];
			Ne = FormatDecimal(Ne, 0, 1);  Ne = Ne.replace(/\s+/g,'');
			Ee = FormatDecimal(Ee, 0, 1);  Ee = Ee.replace(/\s+/g,'');
			Ze = FormatDecimal(Ze, 0, 1);  Ze = Ze.replace(/\s+/g,'');

			var Message = 'Point "' + ptMt[i][0] + '" exists!<br><br>';
			Message += '<span class="par-label">N:</span>' + Ne + '<br>';
			Message += '<span class="par-label">E:</span>' + Ee + '<br>';
			Message += '<span class="par-label">Z:</span>' + Ze + '<br>';
			Message += '<span class="par-label">Desc:</span>' + ptMt[i][4] + '<br><br>';
			Message += 'Delete the point first, or choose a new point name';

			qError(element, Message, 'POINT NAME CONFLICT', 'errormessage');
		
		}
	
		tryPt = Pt;
		
		return (suppress2 ? 'X' : 0);
			
	}

	else return 1;

}

// *******************************************************************************************************************************

function CheckDesc(Desc, element, suppress) {

// Checks that a point description is suitable (no commas, dashes, special characters)
// Input: Point name, the element's 'this' (optional)
// Output: Returns 1 if OK, 0 if not, plus appropriate prompts

	if (Desc.search(/\+|\-|\*|\/|\,|\.|\(|\)|\[|\]|\{|\}/) >= 0) {
	
		if (!suppress) {qError(element, 'Point descriptions must not contain simple mathematical characters, dots, or commas', 'POINT FORMAT', 'errormessage');}
		
		return 0;

	}
	
	return 1;

}

// *******************************************************************************************************************************
	
function StrictCheck(element, Precise, Default, ValType, callback, CBoption) {

// Checks an input using the provided method, reverting input to 0 if value is disallowed, callback function and option allowed
// Input:  the element's 'this', high precision flag, default value, type of check to perform, callback function, callback option
// Output: The formatted values in the input, the callback function executed

	element.value = element.value.trim();
	
// Delay value for timing, so values remain unformatted in the brief "blur" when picking a point from the sketch using "Pt..Pt" notation
	
	var delayVal = 0;	
	if (element.value.search(/\.\./) > 0 && element.value.search(/\.\./) == element.value.length - 2) {delayVal = 200;}
	
	if (element.value) {

		if (ValType == 'decimal') {
		
			setTimeout(function(){if (!ConfirmDecimal(element, Precise)) {element.value = Default; ConfirmDecimal(element, Precise);}}, delayVal);
			
		}
		
		if (ValType == 'dN' || ValType == 'dE' || ValType == 'dZ') {
		
			setTimeout(function(){if (!ConfirmDecimal(element, Precise, ValType)) {element.value = Default; ConfirmDecimal(element, Precise, ValType);}}, delayVal);
		
		}
		
		if (ValType == 'DMS') {
		
			setTimeout(function(){if (!ConfirmDMS(element)) {element.value = Default; ConfirmDMS(element, Precise);}}, delayVal);
			
		}
		
	}

// If callback function provided, call it with provided option
	
	if ((ValType == 'decimal' || ValType == 'DMS') && callback && typeof callback === "function") {callback(CBoption, element.value);}

}

// *******************************************************************************************************************************

function StrictPoint(element) {

// Checks a new point name and notifies the user of any problems through CheckPoint
// Input:  The element's 'this'
// Output: The formatted value in the input (if necessary to match future store value), the appropriate prompts (if any), point values inserted if duplicate in points area

	element.value = element.value.trim();

	if (element.value) {
	
		var Check = CheckPoint(element.value, element, 0, 1);
	
		if (Check) {element.value = FormatString(element.value, 1, 0);}
		else {element.value = '';}
		
// If duplicate point detected in points area, fill in existing values for editing
		
		if (Check == 'X' && $('#header').html() == 'Points') {
		
			var ptThis = GetPointList(element.value, 0, 0, 0, element);
			qG('N').value = FormatDecimal(ptThis[1], 0).trim();
			qG('E').value = FormatDecimal(ptThis[2], 0).trim();
			qG('Z').value = FormatDecimal(ptThis[3], 0).trim();
			qG('Desc').value = FormatString(ptThis[4], 1, 0);
		
		}
		
	}

}

// *******************************************************************************************************************************

function StrictDesc(element) {

// Checks a new point description and notifies the user of any problems through CheckDesc
// Input:  The element's 'this'
// Output: The formatted value in the input (if necessary to match future store value), the appropriate prompts (if any)

	if (element.value) {
	
		var Check = CheckDesc(element.value, element);
	
		if (Check) {element.value = FormatString(element.value, 1, 0);}
		else {element.value = '';}
		
	}

}

// *******************************************************************************************************************************

function SetPoint() {

// Takes a point from the point input boxes and passes it to the AddPoint function
// Input:  None
// Output: The values of the point summary text boxes (1 hidden, 1 display), through the AddPoint function

// Find the contents of the input text boxes and existing file

	var Pt = qG('Pt').value;  var N = qG('N').value;  var E = qG('E').value;  var Z = qG('Z').value;  var Desc = qG('Desc').value;

// Check that field aren't blank

	if (!CheckBlank(Pt, ' point name', qG('Pt')) || !CheckBlank(N, ' northing', qG('N')) || !CheckBlank(E, 'n easting', qG('E')) || !CheckBlank(Z, 'n elevation', qG('Z')) || !CheckBlank(Desc, ' point description', qG('Desc'))) return;

// Check that inputs are acceptable, then add point

	N = ParseDecimal(N, 1, 0);
	E = ParseDecimal(E, 1, 0);
	Z = ParseDecimal(Z, 1, 0);

	if (N != 'X' && E != 'X' && Z != 'X' && CheckDesc(Desc))  {
	
		AddPoint(Pt, N, E, Z, Desc, function() {qG('Pt').value = '';}, '', '', '', '', qG('Pt'));
		
	}

}

// *******************************************************************************************************************************

function AddPoint(Pt, N, E, Z, Desc, callback, ptMt2, Results, Type, Increment, element) {

// Adds a new point to the point summary box, through OutputPoints (Checks name through CheckPoint, but values and description must be pre-checked)
// Input:  Point, coords, description, optional callback function and 4 parameters based on Traverse type storage
// Output: The new contents of the text boxes (1 hidden, 1 display), including the new point

// Check for improperly formed or duplicate point name in two steps

	if (CheckPoint(Pt, '', 0, 1)) {
	
		if (CheckPoint(Pt, '', 0, 1) != 'X') {

// Add the new point to the points matrix
	 
			var ptMt = ParsePoints();
			lP = ptMt.length-1;
			ptMt[lP] = [Pt, N, E, Z, Desc];

			ClearSort();
		
// Update last recorded point number for AutoPoint function

			lastPt = Pt;

// Output the information from the 2D matrix back into the text boxes in the GUI

			OutputPoints(ptMt, lP);
			ZoomSketch(0, 0, 0);
			
			if (callback) {callback(ptMt2, Results, Type, Increment);}
			
			if (element) {qF(element.id);}
			
		}
		
// If duplicate point name detected, prompt to confirm, then overwrite point
		
		else {
		
			$.prompt(qP('Point ' + Pt + ' will be updated! Edit point?', 'POINT DATABASE EDIT'), {
		
				classes: {message: 'editmessage'},
				buttons: {Ok: true, Cancel: false},
				submit: function(e,v,m,f) {
					
					if (v) {
					
						var ptMt = ParsePoints();
						lP = ptMt.length-1;
						
						for (var i=0; i<lP; i++) {if (ptMt[i][0] == Pt) {break;}}
						
						ptMt[i] = [Pt, N, E, Z, Desc];
						
						ClearSort();
						lastPt = Pt;
						OutputPoints(ptMt, lP-1);
						ZoomSketch(0, 0, 0);
						
						if (callback) {callback(ptMt2, Results, Type, Increment);}
						
					}
					
					else {ZoomSketch(0, 0, 0);}
					
					if (element) {qF(element.id);}
					
				},
				
				close: function(e,v,m,f){if (typeof v == 'undefined') {ZoomSketch(0, 0, 0);} if (element) {qF(element.id);}}
		
			});
		
		}
		
// Draw line if tool selected, focus
		
		if (isSelected('LineLink')) {testAddLine(Pt);}
	
	}
	
}

// *******************************************************************************************************************************

function AutoPoint(element) {

// Suggests the next point in the logical series and fills it into the provided input
// Input:  The element's 'this'
// Output: The proposed point number, if sensible, filled into the required input

	if (element.value == '') {

// Get and sort point matrix data
	
		var ptMt = SortPoints(0, 1);
		var lP = ptMt.length - 1;

// If there are points, attempt to suggest the next point
		
		if (lP > 0) {

// If no last point or last point is a string, choose largest number value in points record
		
			if (!lastPt || parseInt(lastPt) != lastPt) {
			
				for (var j=0; j<=lP; j++) {if (parseInt(ptMt[j][0]) == ptMt[j][0]) {lastPt = parseInt(ptMt[j][0]);}}
				
			}
					
			var nextPt = '', thisLastPoint = lastPt;
			
// If there was a previous point attempt found in the database, start with this attempt instead

			if (tryPt && parseInt(tryPt) == tryPt) {thisLastPoint = tryPt; tryPt = '';}

// Increment suggested point number and check for duplicates, incrementing past if needed
			
			if (parseInt(thisLastPoint) == thisLastPoint) {
			
				nextPt = parseInt(thisLastPoint) + 1;
				for (var i=0; i<=lP; i++) {if (parseInt(ptMt[i][0]) == ptMt[i][0] && parseInt(ptMt[i][0]) == nextPt) {nextPt += 1;}}
				
			}
			
			element.value = nextPt;
			element.select();
			
		}
	
	}

}

// *******************************************************************************************************************************

function ClearSort() {

// Clears the point sorting indicators so none are displayed
// Input:  None
// Output: The cleared point indicators

	var Titles = ['Pt', 'N', 'E', 'Z', 'Desc'];
	var Objects = [qG('SortPt'), qG('SortN'), qG('SortE'), qG('SortZ'), qG('SortDesc')];

	for (var l=0; l<=4; l++) {Objects[l].innerHTML = Objects[l].innerHTML.split(' <i')[0];}

}

// *******************************************************************************************************************************

function SortPoints(j, returnVal) {

// Sorts the points areas (1 hidden, 1 display) by the label specified
// Input:  column, from 0 to 4, return value flag (optional)
// Output: The updated points listing, the returned sorted matrix (optional)

// Create arrays of titles and title objects

	var Titles = ['Pt', 'N', 'E', 'Z', 'Desc'];
	var Objects = [qG('SortPt'), qG('SortN'), qG('SortE'), qG('SortZ'), qG('SortDesc')];

// Change title to ascending or descending as appropriate

	var ObTst = Objects[j].innerHTML;
	
	if (!returnVal) {

		if (ObTst.search(/down/) < 0 && ObTst.search(/up/) < 0) {

			for (var l=0; l<=4; l++) {Objects[l].innerHTML = Objects[l].innerHTML.split(' <i')[0];}

			Objects[j].innerHTML = Objects[j].innerHTML.split(' <i')[0] + ' <i class="fa fa-arrow-circle-down fa-lg" style="color:#95a5a6;"></i>';

		}

		else if (ObTst.search(/down/) >= 0) {

			Objects[j].innerHTML = Objects[j].innerHTML.split(' <i')[0] + ' <i class="fa fa-arrow-circle-up fa-lg" style="color:#95a5a6;"></i>';

		}

		else if (ObTst.search(/up/) >= 0) {

			Objects[j].innerHTML = Objects[j].innerHTML.split(' <i')[0] + ' <i class="fa fa-arrow-circle-down fa-lg" style="color:#95a5a6;"></i>';

		}
	
	}

// Load points matrix and remove blank row

	var ptMt = ParsePoints();
	var lP = ptMt.length - 2;
	ptMt.splice(lP + 1, 1);

// Sort points by specified column, separating and sorting numerals in the case of point name or description

	switch (j) {

		case 0:

			ptMt.sort(sortByPt);
			break;

		case 1:

			ptMt.sort(sortByN);
			break;

		case 2:

			ptMt.sort(sortByE);
			break;

		case 3:

			ptMt.sort(sortByZ);
			break;

		case 4:

			ptMt.sort(sortByDesc);
			break;

		default:
			return;

	}

// If column is to be sorted descending, reverse order of point matrix

	if (ObTst.search(/down/) >= 0 && !returnVal)  ptMt = ptMt.reverse();
	
// If return value flag set, return matrix

	if (returnVal) {return ptMt;}

// If not, output and sketch points

	OutputPoints(ptMt, lP);

}

// The following functions help to sort the 2D points matrix by its appropriate columns through the sort() method

function chunkify(t) {var tz = [], x = 0, y = -1, n = 0, i, j;
	while (i = (j = t.charAt(x++)).charCodeAt(0)) {var m = (i == 46 || (i >=48 && i <= 57));  if (m !== n) {tz[++y] = '';  n = m;}  tz[y] += j;}  return tz;}
function sortRange(a, b) {
	var aa = chunkify(a.toLowerCase()), bb = chunkify(b.toLowerCase());
	for (x = 0; aa[x] && bb[x]; x++) {
		if (aa[x] !== bb[x]) {var c = Number(aa[x]), d = Number(bb[x]);
			if (c == aa[x] && d == bb[x])  return c - d;  else  return ((aa[x] > bb[x]) ? 1 : -1);}
	}  return aa.length - bb.length;}
function sortByPt(a, b) {
	var aa = chunkify(a[0].toLowerCase()), bb = chunkify(b[0].toLowerCase());
	for (x = 0; aa[x] && bb[x]; x++) {
		if (aa[x] !== bb[x]) {var c = Number(aa[x]), d = Number(bb[x]);
			if (c == aa[x] && d == bb[x])  return c - d;  else  return ((aa[x] > bb[x]) ? 1 : -1);}
	}  return aa.length - bb.length;}
function sortByDesc(a, b) {
	var aa = chunkify(a[4].toLowerCase()), bb = chunkify(b[4].toLowerCase());
	for (x = 0; aa[x] && bb[x]; x++) {
		if (aa[x] !== bb[x]) {var c = Number(aa[x]), d = Number(bb[x]);
			if (c == aa[x] && d == bb[x])  return c - d;  else  return ((aa[x] > bb[x]) ? 1 : -1);}
	}  return aa.length - bb.length;}
function sortByN(a, b) {var x = parseFloat(a[1]);  var y = parseFloat(b[1]);  return ((x < y) ? -1 : ((x > y) ? 1 : 0));}
function sortByE(a, b) {var x = parseFloat(a[2]);  var y = parseFloat(b[2]);  return ((x < y) ? -1 : ((x > y) ? 1 : 0));}
function sortByZ(a, b) {var x = parseFloat(a[3]);  var y = parseFloat(b[3]);  return ((x < y) ? -1 : ((x > y) ? 1 : 0));}

// *******************************************************************************************************************************

function OutputPoints(ptMt, lP) {

// Outputs given matrix to point summary textbox
// Input:  Points matrix, length of points matrix
// Output: The new contents of the text boxes (1 hidden, 1 display)

// Update hidden precise values textbox

	var ptStr = '';

	for (var i=0; i<=lP; i++) {

		ptStr += FormatString(ptMt[i][0], 0, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][1], 1, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][2], 1, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][3], 1, 0) + '      ';
		ptStr += FormatString(ptMt[i][4], 0, 0) + ' \n';

	}

	PointsField = qG('pointsContents');
	PointsField.value = ptStr;

// Update display values textbox

	ptStr = '';

	for (i=0; i<=lP; i++) {

		ptStr += FormatString(ptMt[i][0], 0, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][1], 0, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][2], 0, 0) + ' ';
		ptStr += FormatDecimal(ptMt[i][3], 0, 0) + '      ';
		ptStr += FormatString(ptMt[i][4], 0, 0) + ' \n';

	}

	ptStr += ' ';

	PointsField = qG('pointsContentsCopy');
	PointsField.value = ptStr;
	PointsField.scrollTop = PointsField.scrollHeight - PointsField.clientHeight;

// Sketch resulting points

	SketchPoints();

}

// *******************************************************************************************************************************

function DeletePoint(PtList) {

// Deletes the requested point from the point summary text box
// Input:  Point list
// Output: The updated point list, or an alert box if the point list is invalid (through GetPointList)

// If no value passed, get input value from textbox

	var DeleteInput = 0;
	if (!PtList) {var PtList = qG('Delete').value;  DeleteInput = 1;}

// Check to make sure field isn't blank

	if (!CheckBlank(PtList, ' list of points to delete', qG('Delete')))  return;

// Get list of points to delete

	if (!(PtList = GetPointList(PtList, 1, 0, 0, qG('Delete'))))  return;

// Get point record matrix, lines record matrix

	var ptMt = ParsePoints(), linesMt = ParseLines();

// Check all point names in list against existing points matrix and delete rows when found

	for (var j=0; j<PtList.length; j++) {

		for (var i=0; i<ptMt.length; i++) {
		
			if (ptMt[i][0] == PtList[j][0]) {ptMt.splice(i, 1);}
		
		}

	}

	var Plural = ((PtList.length > 1) ? 's' : '');
	
	if (DeleteInput) {
	
		$.prompt(qP(PtList.length + ' point' + Plural + ' will be deleted!\n\nDelete point' + Plural + '?', 'POINT DATABASE EDIT'), {
			
			classes: {message: 'errormessage'},
			buttons: {Ok: true, Cancel: false},
			submit: function(e,v,m,f){
			
				if (v) {
				
					OutputPoints(ptMt, ptMt.length-2);
					AuditLines();
					ZoomSketch(0, 0, 0, '#PointsCanvas');
					if (DeleteInput) {qG('Delete').value = ''; qF('Delete');}
					
				}},
				
			close: function(){qF('Delete');}
			
		});
	
	}
	
}

// *******************************************************************************************************************************

function RewritePoints() {

// Refreshes the points textbox and sketch
// Input:  None
// Output: Refreshed points listing and sketch

// Parse the existing points file contents into a points matrix

	var ptMt = ParsePoints(); 
	lP = ptMt.length-2;

// Output the information from the 2D matrix back into the text boxes in the GUI

	OutputPoints(ptMt, lP);

}

// *******************************************************************************************************************************

function SampleData() {

// Loads sample data into the points and lines databases
// Input:  None
// Output: The sample data, parsed and input into the points records

	var data = '';
	data += '1 5005.21537 5994.64016 0.00000 Old_IP\n';
	data += '2 5048.50502 6007.37165 0.00000 Old_IP\n';
	data += '3 5041.85840 6029.97153 0.00000 Old_IP\n';
	data += '4 4998.56874 6017.24004 0.00000 Old_IP\n';
	data += '5 5014.29197 5997.30959 0.00000 Center\n';
	data += '6 5049.57149 5992.10066 0.00000 Old_IP\n';
	data += '101 5050.37931 6042.70445 350.99457 TH\n';
	data += '102 5058.82988 5989.75057 351.15947 TH\n';
	data += '103 4992.11952 5981.32226 350.88795 TH\n';
	data += '104 4985.04583 6018.18664 350.53214 TH\n';
	data += '105 5050.39753 6042.72157 350.97254 OTH_101\n';
	data += '106 5058.86440 5989.76414 351.13456 OTH_102\n';
	data += '507 5061.04580 6035.61455 0.00000 Calc\n';
	data += '508 5067.69242 6013.01467 0.00000 Calc\n';
	data += '509 5069.35699 5989.17938 0.00000 Calc\n';
	data += '510 5046.12818 5968.77949 0.00000 Calc\n';
	data += '511 5065.91368 5965.85821 0.00000 Calc\n';
	data += '512 5052.29969 6065.35310 0.00000 Calc\n';
	data += '513 5033.11229 6059.71008 0.00000 Calc\n';
	data += '514 5004.46636 5967.85325 0.00000 Calc\n';
	data += '515 4989.82263 6046.97859 0.00000 Calc\n';
	data += '601 5034.65430 6006.71650 351.11945 House\n';
	data += '602 5031.21813 6017.42889 351.29845 House\n';
	data += '603 5033.89623 6018.28793 351.95615 House\n';
	data += '604 5032.69357 6022.03727 351.45679 House\n';
	data += '605 5022.51680 6018.77291 351.51643 House\n';
	data += '606 5027.15562 6004.31119 351.45167 House\n';
	
	var ptMt = ParsePoints(), lP = ptMt.length;

	if (lP > 1) {
	
		var Warning = 'Overwrite all points and lines with sample data? <br><br>To save your work first, choose "Cancel".';
		
		$.prompt(qP(Warning, 'POINT DATABASE EDIT'), {
			
			classes: {message: 'errormessage'},
			buttons: {Ok: true, Cancel: false},
			submit: function(e,v,m,f){if (v) {CheckAllPoints(data, 0, SampleData2, 0, qG('points-tiplink'));}},
			close: function(e,v,m,f){if (!v || typeof v == 'undefined') {qF('points-tiplink');}}
			
		});
	
	}
	
	else {CheckAllPoints(data, 0, SampleData2, 0, qG('points-tiplink'));}
		
}

// *******************************************************************************************************************************

function SampleData2() {

// Performs lines portion of sample data once points loaded
// Input:  None
// Output: The sample lines, parsed and input into the lines record

	var lineMt = new Array, t;
	
	if (t = FormLine('L', '1', '6', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '2', '3', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '3', '4', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '4', '1', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('A', '6', '2', '5', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '601', '602', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '602', '603', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '603', '604', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '604', '605', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '605', '606', '-', '0')) {lineMt.push(t);}
	if (t = FormLine('L', '606', '601', '-', '0')) {lineMt.push(t);}

	CheckLines(lineMt);
	
	var fileN = 'Sample Data';
	
	if (CheckFileName(fileN, 1)) {qG('filename').value = fileN;}

}

// *******************************************************************************************************************************

function OutputCogo(Results, Log, InputSF, InputRot, ShortOutput) {

// Adds the results of any type of cogo operation to the appropriate log
// Input:  Results string, textarea to output to, input scale flag, input rotation flag, short output flag
// Output: The values of the appropriate log textarea, appropriately spaced and separated with a horizontal rule, input scale factor and rotation noted

// Note scale factor and rotation if applied
		
	var GlbSF = qG('GlobalSF').value;
	var GlbAz = ParseDMS(qG('GlobalAz').value, 0, 0);
	
	var ResultsAlerts = '';
	
	ResultsAlerts += ((InputSF && GlbSF != 1) ? '\n   Input SF:   ' + FormatDecimal(GlbSF + '', 1, 0).trim() + '\n' : '');
	ResultsAlerts += ((InputRot && GlbAz != 0) ? '\n   Input Rot:  ' + FormatDMS(GlbAz + '', 0).trim() + '\n' : '');
	
	Results += ResultsAlerts.replace(/\n\n/g,'\n');

	if (!ShortOutput) {Results = '\n\n _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n\n\n' + Results;}

// Output values and scroll to the bottom of the output area

	OutputField = qG(Log);  OutputField.value += Results;  OutputField.scrollTop = OutputField.scrollHeight - OutputField.clientHeight;

}

// *******************************************************************************************************************************

function RemoveBlank(Arr) {for (var i=0; i<Arr.length; i++) {if (Arr[i] == '') {Arr.splice(i, 1);  i--;}}  return Arr;}

// Removes all blank elements from an array
// Input:  The array to process
// Output: The array with all blank elements removed

// *******************************************************************************************************************************

function Round(num, sig) {return Math.round(num * Math.pow(10, sig)) / Math.pow(10, sig);}

// Rounds a number to a specified number of decimal places
// Input:  Number to round, number of decimal places
// Output: Rounded number

// *******************************************************************************************************************************

function RoundSig(num, sig) {var factor = Math.pow(10, sig - Math.ceil(Math.log(Math.abs(num)) / Math.LN10));  return Math.round(num * factor) / factor;}

// Rounds a number to a specified number of significant figures
// Input:  Number to round, number of sig figs
// Output: Rounded number

// *******************************************************************************************************************************

function debug(String) {$('#debug').html(String).css('z-index', '1000');}

// Adds a string to the "debug" div for debugging analysis
// Input:  String to add
// Output: String added to "debug" div

// *******************************************************************************************************************************

function qP(String, Header) {return ('<div class="tooltip"><h4>' + Header + '</h4>' + String + '</div>');}

// Formats a string for use within jQuery Impromptu
// Input:  String to format, Header
// Output: Correctly formatted string

// *******************************************************************************************************************************

function SaveTo() {
	
// Saves a Q-Cogo .qcg file to a local computer 
// Input:  none
// Output: The saved file

	var FileName = qG('filename').value; qF('SaveFile');
	
	if (CheckFileName(FileName)) {

		var textToSave = MakeTextFile();
		var textToSaveAsBlob = new Blob([textToSave], {type:'text/qcg'});
		var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
		var fileNameToSaveAs = FileName + '.qcg';
		
		if (navigator.msSaveOrOpenBlob) {
		
			navigator.msSaveOrOpenBlob(textToSaveAsBlob, fileNameToSaveAs);
			return;
			
		}
	
		else if (window.navigator.msSaveBlob) {
		
			window.navigator.msSaveBlob(textToSaveAsBlob, fileNameToSaveAs);
			return;
		
		}

		var downloadLink = document.createElement('a');
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = 'Download File';
		downloadLink.href = textToSaveAsURL;
		downloadLink.onclick = function(e) {document.body.removeChild(e.target);};
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);

		downloadLink.click();
	
	}
		
}

// *******************************************************************************************************************************

function LoadFrom() {
	
// Loads a previously saved Q-Cogo .qcg file from a local computer 
// Input:  none
// Output: The loaded data from the file, parsed and saved as a current job

	var fileToLoad = qG('LoadFile').files[0];
 
    var fileReader = new FileReader();
	
    fileReader.onload = function(fileLoadedEvent) {
	
		var textFromFileLoaded = fileLoadedEvent.target.result;
		ReadTextFile(textFromFileLoaded);
		
    };
	
    if (fileToLoad) {fileReader.readAsText(fileToLoad, "UTF-8");  qG('LoadFile').value = '';}
	
}

// *******************************************************************************************************************************

function MakeTextFile() {
	
// Makes text suitable for insertion into a .qcg local save file
// Input:  none
// Output: Returns text file contents: File, Points, Lines, Settings

	var Output = '';
	var Section1 = '\n\n/*/*/*-', Section2 = '-/*/*/*\n\n';
	
// File

	Output += Section1 + 'File' + Section2;
	Output += qG('filename').value + '\n';
		
// Points
	
	Output += Section1 + 'Points' + Section2;
	var PtMt = ParsePoints();
	for (var i=0; i<PtMt.length-1; i++) {Output += PtMt[i][0] + ' ' + PtMt[i][1] + ' ' + PtMt[i][2] + ' ' + PtMt[i][3] + ' ' + PtMt[i][4] + '\n';}
	
// Lines
	
	Output += Section1 + 'Lines' + Section2;
	var LineMt = ParseLines();
	for (var j=0; j<LineMt.length; j++) {Output += LineMt[j][0] + ' ' + LineMt[j][1] + ' ' + LineMt[j][2] + ' ' + LineMt[j][3] + ' ' + LineMt[j][4] + ' ' + LineMt[j][5] + '\n';}
	

// Settings

	Output += Section1 + 'Settings' + Section2;
	
	var IDs = ['DPrecision', 'APrecision', 'GPrecision', 'AreaPrecision', 'GlobalSF', 'GlobalAz', 'DistUnits', 'DistUnitDisp', 'AreaUnits', 'AreaUnitDisp', 'TolPrec', 'TolMisc', 'TolAngle', 'TolDetail'];
	
	for (var k=0; k<IDs.length; k++){Output += IDs[k] + ' ' + qG(IDs[k]).value + '\n';}
	
// Traverse, Inverse, Intersect, Transform, Adjust, Area, Solver
// Set record contents and sketch states under single heading

	var allAreas = ['Traverse', 'Inverse', 'Intersect', 'Transform', 'Adjust', 'Area', 'Solver'], subSection = '\n\n///***///\n\n';
	
	for (var m=0; m<allAreas.length; m++) {

		Output += Section1 + allAreas[m] + Section2;
		Output += qG(allAreas[m] + 'Log').value;
		Output += subSection;
		Output += qG(allAreas[m] + 'CanvasPar').value;
		Output += subSection;
		Output += qG(allAreas[m] + 'CanvasSt').value;
	
	}

	return Output;

}

// *******************************************************************************************************************************

function ReadTextFile(Text) {
	
// Reads a .qcg local save file and saves it as data in the current job
// Input:  Contents of loaded text file
// Output: The stored data: file, points, lines, settings

// Read the file into array, separate into variables
// By calling section by name, function is flexible for future Q-Cogo versions with new section headers

	var Split1 = '/*/*/*-', Split2 = '-/*/*/*';
	var textArray = Text.split(Split1);
	var thisLine;
	var File = '', Points = '', Lines = '', Settings = '', Traverse = '', Inverse = '', Intersect = '', Transform = '', Adjust = '', Area = '', Solver = '';
	
	for (var i=0; i<textArray.length; i++) {
		
		thisLine = textArray[i].split(Split2);
		
		if (thisLine[0] == 'File' && thisLine.length == 2) {File = thisLine[1];}
		if (thisLine[0] == 'Points' && thisLine.length == 2) {Points = thisLine[1];}
		if (thisLine[0] == 'Lines' && thisLine.length == 2) {Lines = thisLine[1];}
		if (thisLine[0] == 'Settings' && thisLine.length == 2) {Settings = thisLine[1];}
		if (thisLine[0] == 'Traverse' && thisLine.length == 2) {Traverse = thisLine[1];}
		if (thisLine[0] == 'Inverse' && thisLine.length == 2) {Inverse = thisLine[1];}
		if (thisLine[0] == 'Intersect' && thisLine.length == 2) {Intersect = thisLine[1];}
		if (thisLine[0] == 'Transform' && thisLine.length == 2) {Transform = thisLine[1];}
		if (thisLine[0] == 'Adjust' && thisLine.length == 2) {Adjust = thisLine[1];}
		if (thisLine[0] == 'Area' && thisLine.length == 2) {Area = thisLine[1];}
		if (thisLine[0] == 'Solver' && thisLine.length == 2) {Solver = thisLine[1];}
		
	}
	
	var ptMt = ParsePoints(), lP = ptMt.length;

	if (lP > 1) {
	
		var Warning = 'Overwrite all points and lines with data from this file? <br><br>To save your current work first, choose "Cancel".';
		
		$.prompt(qP(Warning, 'POINT DATABASE EDIT'), {
			
			classes: {message: 'errormessage'},
			buttons: {Ok: true, Cancel: false},
			submit: function(e,v,m,f){if (v) {ReadTextFile2(File, Points, Lines, Settings, Traverse, Inverse, Intersect, Transform, Adjust, Area, Solver);}},
			close: function(){qF('LoadFileLabel');}
			
		});
	
	}
	
	else {ReadTextFile2(File, Points, Lines, Settings, Traverse, Inverse, Intersect, Transform, Adjust, Area, Solver);}
	
}

// *******************************************************************************************************************************

function ReadTextFile2(File, Points, Lines, Settings, Traverse, Inverse, Intersect, Transform, Adjust, Area, Solver) {
	
// Second portion of ReadTextFile, called in function parts
// Input:  Contents of loaded text file
// Output: The stored data: file, points, lines, settings

// Handle all portions of input file separately, only if they exist
// If a section is non-existent or corrupted, routine should fail silently, only issuing warnings associated with CheckAllPoints
// All functions passed as a callback through CheckAllPoints (if fails or cancelled, no changes made)
	
	if (Points && CheckAllPoints(Points, 1, 0, 0, qG('points-tiplink'))) {
			
		var CBvector = [File, Lines, Settings, Traverse, Inverse, Intersect, Transform, Adjust, Area, Solver];
		
		var LFchar = 'qqqqqqqq', s, t;
		
		CheckAllPoints(Points, 0, function() {
		
			if (CBvector[0]) {
				
				var File2 = CBvector[0];
				File2 = File2.replace(/\r?\n|\r/g, '');
				if (CheckFileName(File2, 1)) {qG('filename').value = File2;}
		
			}
			
			if (CBvector[1]) {
				
				var Lines2 = CBvector[1];
				
				Lines2 = Lines2.trim();
				Lines2 = Lines2.replace(/\r\n/g,LFchar);
				Lines2 = Lines2.replace(/\n\r/g,LFchar);
				Lines2 = Lines2.replace(/\n/g,LFchar);
				Lines2 = Lines2.replace(/\r/g,LFchar);
				Lines2 = Lines2.replace(/\s+/g,' ');
				
				var lineMt = Lines2.split(LFchar);
				
				for (var j=0; j<lineMt.length; j++) {
				
					s = lineMt[j].split(' ');
					if (s.length == 6 && (t = FormLine(s[1], s[2], s[3], s[4], s[5]))) {lineMt[j] = t;}
					else {lineMt.splice(j, 1); j--;}
				
				}
				
				CheckLines(lineMt);
				ZoomSketch(0, 0, 0);

			}
			
			if (CBvector[2]) {
			
				var Settings2 = CBvector[2];

				Settings2 = Settings2.trim();
				Settings2 = Settings2.replace(/\r\n/g,LFchar);
				Settings2 = Settings2.replace(/\n\r/g,LFchar);
				Settings2 = Settings2.replace(/\n/g,LFchar);
				Settings2 = Settings2.replace(/\r/g,LFchar);
				Settings2 = Settings2.replace(/\s+/g,' ');

				var setMt = Settings2.split(LFchar);
				
				for (var k=0; k<setMt.length; k++) {
				
					t = setMt[k].split(' ');
					if (t.length == 2 && qG(t[0])) {qG(t[0]).value = t[1];}
				
				}
			
			}
			
// Write contents of logs, sketch states, and sketch parameters
			
			var areaNames = ['Traverse', 'Inverse', 'Intersect', 'Transform', 'Adjust', 'Area', 'Solver'];
			
			for (var i=3; i<CBvector.length; i++) {
			
				if (CBvector[i]) {
				
					var ThisArea = CBvector[i].split('\n\n///***///\n\n');
					var ThisTitle = areaNames[i-3];
					
					if (ThisArea[0]) {qG(ThisTitle + 'Log').value = ThisArea[0];}
					if (ThisArea[1]) {qG(ThisTitle + 'CanvasPar').value = ThisArea[1];}
					if (ThisArea[2]) {qG(ThisTitle + 'CanvasSt').value = ThisArea[2];}
				
				}
			
			}
				
		}, CBvector, qG('points-tiplink'));
		
	}
	
	else {
	
		var LoadError = 'Unable to load points. <br><br>File was corrupt, was not a valid Q-Cogo (.qcg) file, or contained no valid points records.'
		qError(qG('LoadFileLabel'), LoadError, 'FILE READ ERROR', 'errormessage');
	
	}

}

// *******************************************************************************************************************************

function CheckFileName(Name, suppress) {
	
// Checks a that a file name is valid
// Input:  Name string (optional), suppress flag (optional)
// Output: Returns 1 for good, 0 for bad, plus the required prompts

	var Text = (Name ? Name : qG('filename').value);
	var OK = 1, Header = 'FILE NAME FORMAT';
	
	if (!CurrentFile) {CurrentFile = 'Job 1';}
	
// Check for valid filename, prompt and flag if invalid
	
	if (Text.search(/[\"\~\#\%\&\*\{\}\\\:\<\>\?\/\+\|]+/) >= 0) {if (!suppress) {qError(qG('filename'), 'File name must not contain special characters', Header, 'errormessage');}  OK = 0;}
	if (Text == '') {if (!suppress) {qError(qG('filename'), 'Enter a file name', Header, 'errormessage');}  OK = 0;}
	if(Name) {return OK;}
	
	else  {
		
		if (OK) {CurrentFile = Text;}
		else {qG('filename').value = CurrentFile;}
		
	}

}

