/*
	This heading must remain intact at all times.
	Copyright (c) 2018 Mark Mason.

	File:	Q-Cogo-Sugg.js
	Use:	To provide intelligent suggest behaviors for Q-Cogo, <http://www.q-cogo.com/>.
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

	autoCompleteDB
	autoCompleteDB.prototype.assignArray
	autoCompleteDB.prototype.getMatches
	autoComplete
	autoComplete.prototype.hideSuggest
	autoComplete.prototype.selectText
	autoComplete.prototype.textComplete
	autoComplete.prototype.keyDown
	autoComplete.prototype.moveDown
	autoComplete.prototype.moveUp
	autoComplete.prototype.keyUp
	autoComplete.prototype.positionSuggest
	autoComplete.prototype.onTextChange
	createAutoComplete
	setCursorAtEnd
	getScrollXY	
*/



// *******************************************************************************************************************************

function autoCompleteDB() {this.aNames = new Array();}

// Creates a new autocomplete array for holding matching elements
// Input:  None
// Output: The newly created array, accessible by the suggest object


// *******************************************************************************************************************************

autoCompleteDB.prototype.assignArray = function(aList) {this.aNames = aList;};

// Assigns the list of possible matches to the autocomplete array
// Input:  The list of matches
// Output: The filled array, accessible by the suggest object

// *******************************************************************************************************************************

autoCompleteDB.prototype.getMatches = function(str, aList, maxSize) {

// Gets matches for the current string based on the list of existing elements
// Input:  String to match, possible matches, maximum number of matches to include
// Output: The parsed list of matches, accessible by the suggest object

	var ctr = 0;
	for (var i in this.aNames) {if (this.aNames[i].indexOf(str) == 0) {aList.push(this.aNames[i]);  ctr++;}	 if (ctr == (maxSize-1))  break;}

};

// *******************************************************************************************************************************

function autoComplete(aNames, oText, oDiv, maxSize, mult, index) {

// Autocomplete constructor function
// Input:  List of possible matches, text box ID, div ID, maximum size of match array, multiple values flag
// Output: The newly constructed suggest object

	this.oText = oText;
	this.oDiv = oDiv;
	this.maxSize = maxSize;
	this.cur = -1;
	this.preText = '';
	this.mult = mult;
 	this.index = index;
    
	this.db = new autoCompleteDB();
	this.db.assignArray(aNames);
	
	oText.onkeyup = this.keyUp;
	oText.onkeydown = this.keyDown;
	oText.autoComplete = this;
	oText.onblur = this.hideSuggest;
	
}

// *******************************************************************************************************************************

autoComplete.prototype.hideSuggest = function() {

// Hides suggest div when no longer needed
// Input:  None
// Output: The hidden div

	this.autoComplete.oDiv.style.visibility = 'hidden';
	if (this.autoComplete.index == 4) {StrictDesc(this);}

};

// *******************************************************************************************************************************

autoComplete.prototype.selectText = function(iStart,iEnd) {

// Selects text that is part of the most possible string but has not been typed by the user
// Input:  Start and end index
// Output: The selected text

// FUNCTION NOT CALLED: left in place for future flexibility

// Select text range in IE

	if (this.oText.createTextRange) {

		var oRange = this.oText.createTextRange();
		oRange.moveStart('character', iStart);
		oRange.moveEnd('character', iEnd-this.oText.value.length);
		oRange.select();

	}

// Select text range in Gecko browsers

	else if (this.oText.setSelectionRange)  this.oText.setSelectionRange(iStart,iEnd);
	this.oText.focus();

};
 
// *******************************************************************************************************************************

autoComplete.prototype.textComplete = function(sFirstMatch) {

// Completes text that is part of the most possible string but has not been typed by the user
// Input:  First value that is a match to the user input
// Output: The matched and highlighted text

// FUNCTION NOT CALLED: left in place for future flexibility

	if (this.oText.createTextRange || this.oText.setSelectionRange) {

		var iStart = this.oText.value.length;  this.oText.value = sFirstMatch;  this.selectText(iStart, sFirstMatch.length);

	}

};

// *******************************************************************************************************************************

autoComplete.prototype.keyDown = function(oEvent) {

// Controls behaviours when a key is pressed down
// Input:  The keydown event
// Output: The appropriate action, depending on the key that was pressed

	oEvent = window.event || oEvent;  iKeyCode = oEvent.keyCode;
	var oThis = this.autoComplete;
	 
	switch(iKeyCode) {

// In case of up arrow

		case 38:  this.autoComplete.moveUp();  break;

// In case of down arrow

		case 40:  this.autoComplete.moveDown();  break;

// In case of right arrow

		case 39:  
//			oThis.oText.value += ' ';
			this.autoComplete.oDiv.style.visibility = 'hidden';  // Can't seem to call hideSuggest from within this function scope
			setCursorAtEnd(oThis.oText);
			break;

	}
	
};

// *******************************************************************************************************************************

autoComplete.prototype.moveDown = function() {

// Moves cursor down through the list of suggestions
// Input:  None
// Output: Highlighted text and the newly edited contents of the input box

	var oThis = this;

	if (this.oDiv.childNodes.length>0 && this.cur<(this.oDiv.childNodes.length-1)) {

		++this.cur;

		for (var i=0; i<this.oDiv.childNodes.length; i++) {

			if (i == this.cur) {

				this.oDiv.childNodes[i].className = 'suggOver';
				this.oText.value = this.preText + this.oDiv.childNodes[i].innerHTML;

			}

			else {

				this.oDiv.childNodes[i].className = '';

			}

		}

	}

	setCursorAtEnd(oThis.oText);

};

// *******************************************************************************************************************************

autoComplete.prototype.moveUp = function() {

// Moves cursor up through the list of suggestions
// Input:  None
// Output: Highlighted text and the newly edited contents of the input box

	var oThis = this;

	if(this.oDiv.childNodes.length > 0 && this.cur > 0) {

		--this.cur;

		for(var i=0; i<this.oDiv.childNodes.length; i++) {

			if(i == this.cur) {

				this.oDiv.childNodes[i].className = 'suggOver';
				this.oText.value = this.preText + this.oDiv.childNodes[i].innerHTML;

			}

			else {

				this.oDiv.childNodes[i].className = '';

			}

		}

	}

	setCursorAtEnd(oThis.oText);

};

// *******************************************************************************************************************************

autoComplete.prototype.keyUp = function(oEvent) {

// Controls behavior when a key is released
// Input:  The keyup event
// Output: The suggest creator function call, with the appropriate autocomplete flag

// Currently calls ontextchange without autocomplete in any real character key case: autocomplete option remains for future use

	oEvent = oEvent || window.event;
	var iKeyCode=oEvent.keyCode;

// Call suggest creator function, without autocomplete

	if (iKeyCode == 8 || iKeyCode == 46) {this.autoComplete.onTextChange(false);}
	else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {}

// Call suggest creator function, without autocomplete

	else {this.autoComplete.onTextChange(false);}

};
 
// *******************************************************************************************************************************

autoComplete.prototype.positionSuggest = function() {

// Calculates the appropriate position of the dropdown div
// Input:  None
// Output: The correctly positioned div, through CSS

	var oNode = this.oText;
	var x = 0, y = oNode.offsetHeight;
 
	while (oNode.offsetParent && oNode.offsetParent.tagName.toUpperCase() != 'BODY') {

		x += oNode.offsetLeft;
		y += oNode.offsetTop;
		oNode = oNode.offsetParent;
	}
 
	x += oNode.offsetLeft;
	y += oNode.offsetTop;

	y -= getScrollXY()[1];

	this.oDiv.style.top = y + 'px';
	this.oDiv.style.left = x + 'px';
	this.oDiv.style.zIndex = '999';

}

// *******************************************************************************************************************************

autoComplete.prototype.onTextChange = function(bTextComplete) {

// Creates and displays the dropdown div of suggestions when text is changed in the input box
// Input:  Text complete flag
// Output: The positioned and filled div, ready to be manipulated by the user (if screen height tall enough)

	var txt = this.oText.value.replace(/\.\.+/g,'-'); this.oText.value = txt;
	var oThis = this;
	this.cur = -1;

	var LastChar = Math.max(txt.lastIndexOf(','), txt.lastIndexOf('-')) + 1;
	var LStar = txt.lastIndexOf('*');
	var BStar = ((LStar >= 0) ? txt.substring(LStar - 1, LStar) : '');
	LStar = ((LStar == 0 || BStar == '-' || BStar == ',') ? LStar : -1) + 1;

	var Last = Math.max(LastChar, LStar);

	if (this.mult) {this.preText = txt.substring(0, Last);  txt = txt.substring(Last);  txt = FormatString(txt, 1, 0, 1);}
  
	if(txt.length >= 0 && $(window).height() > 550) {

		while(this.oDiv.hasChildNodes())  this.oDiv.removeChild(this.oDiv.firstChild);
       
		var aStr = new Array();
		this.db.getMatches(txt, aStr, this.maxSize);

		if (!aStr.length) {oThis.oDiv.style.visibility = 'hidden';  return;}
		if (aStr.length == 1 && aStr[0] == txt) {oThis.oDiv.style.visibility = 'hidden';  return;}

		if (bTextComplete && txt.length > 0)  this.textComplete(this.preText + aStr[0]);

		this.positionSuggest();
       
		for (i in aStr) {

			var oNew = document.createElement('div');
			this.oDiv.appendChild(oNew);
			oNew.style.paddingLeft = '2px';
			oNew.onmouseover=
			oNew.onmouseout=
			oNew.onmousedown = function(oEvent) {

				oEvent = window.event || oEvent;
				oSrcDiv = oEvent.target || oEvent.srcElement;
 
				if (oEvent.type == 'mousedown') {

					oThis.oText.value = oThis.preText + this.innerHTML + ' ';
					this.hideSuggest; setCursorAtEnd(oThis.oText);

				}

				else if (oEvent.type == 'mouseover') {this.className = 'suggOver';}
				else if (oEvent.type == 'mouseout') {this.className = '';}
				else {this.oText.focus();}

			};

			oNew.innerHTML = aStr[i];

		}
       
		this.oDiv.style.visibility = 'visible';
		setCursorAtEnd(oThis.oText);

	}

	else {

		this.oDiv.innerHTML = '';
		this.oDiv.style.visibility = 'hidden';

	}

};

// *******************************************************************************************************************************

function createAutoComplete(InputID, DivID, index, mult) {

// Parses points matrix appropriately and calls autocomplete constructor (called from HTML page)
// Input:  ID of input text box, ID of suggest div, index of fields to use from points matrix, multiple suggestions allowed flag
// Output: The newly created autocomplete object and manipulated HTML elements

	var pointsMatrix = SortPoints(index, 1);
	var lP = pointsMatrix.length;

	if (index == 0) {

 		var aNames = new Array();

 		for (var i=0; i<lP; i++)  aNames[i] = pointsMatrix[i][index];

	}

	else {

		var aNames = new Array();

 		for (var i=0; i<lP; i++) {

			var Exists = 0;
			var lN = aNames.length;

			for (var j=0; j<lN; j++) {if (aNames[j] == pointsMatrix[i][index]) {Exists = 1;  break;}}

			if (!Exists)  aNames[i] = pointsMatrix[i][index];

		}

	}
	
	var W = $('#' + InputID).outerWidth();  $('#' + DivID).css('width', W + 12);
	Sugg = new autoComplete(aNames, document.getElementById(InputID), document.getElementById(DivID), 11, mult, index);
//	Sugg.onTextChange(false);  // Uncomment to suggest on focus, before key pressed

}

// *******************************************************************************************************************************

function setCursorAtEnd(elem) {

// Sets the cursor at the end of a field
// Input:  Field DOM element
// Output: The cursor moved to the end of the element, with the scrolling set appropriately in long elements

	var CharPos = elem.value.length;
	if(elem != null) {

// Test for IE

		var IE = /*@cc_on!@*/false;

// Place cursor in IE

		if(IE) {

			var range = elem.createTextRange();
			range.move('character', CharPos);
			setTimeout(function() {range.select();}, 10);

		}

// Place cursor in Gecko-based browsers

        	else if (elem.selectionStart) {

			setTimeout(function() {elem.focus();}, 10);
			setTimeout(function() {elem.setSelectionRange(CharPos, CharPos);}, 10);

		var CEvent = document.createEvent("KeyboardEvent");

		if (CEvent.initKeyEvent) {

			CEvent.initKeyEvent('keypress', true, true, null, false, false, false, false, 0, 32);
			elem.dispatchEvent(CEvent);
			CEvent = document.createEvent('KeyboardEvent');
			CEvent.initKeyEvent('keypress', true, true, null, false, false, false, false, 8, 0);
			elem.dispatchEvent(CEvent);
		}

		}

// Try generic selection if the above methods fail

		else {

			setTimeout(function() {elem.focus();}, 10);
			setTimeout(function() {elem.value = elem.value;}, 10);

		}

	}

}



// *******************************************************************************************************************************

function getScrollXY() {

// Gets the X and Y scroll values for the entire window and returns them in a vector
// Input:  None
// Output: The X and Y values, 0 if they are not real numbers

	if (typeof(window.pageYOffset) == 'number') {

		var scrOfY = window.pageYOffset, scrOfX = window.pageXOffset;

	}

	else if (document.body && (document.body.scrollLeft || document.body.scrollTop )) {

		var scrOfY = document.body.scrollTop, scrOfX = document.body.scrollLeft;

	}

	else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {

		var scrOfY = document.documentElement.scrollTop, scrOfX = document.documentElement.scrollLeft;

	}

	return [((!isNaN(scrOfX)) ? scrOfX : 0), ((!isNaN(scrOfY)) ? scrOfY : 0)];

}
