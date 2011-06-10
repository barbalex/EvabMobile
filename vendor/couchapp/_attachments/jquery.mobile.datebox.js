/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 */
(function($, undefined ) {
  $.widget( "mobile.datebox", $.mobile.widget, {
	options: {
		theme: 'c',
		pickPageTheme: 'b',
		pickPageInputTheme: 'e',
		pickPageButtonTheme: 'a',
		pickPageHighButtonTheme: 'e',
		pickPageTodayButtonTheme: 'e',
		pickPageSlideButtonTheme: 'd',
		noAnimation: false,
		
		disabled: false,
		wheelExists: false,
		swipeEnabled: true,
		zindex: '500',
		
		setDateButtonLabel: 'Set date',
		setTimeButtonLabel: 'Set time',
		titleDateDialogLabel: 'Set Date',
		titleTimeDialogLabel: 'Set Time',
		titleDialogLabel: false,
		meridiemLetters: ['AM', 'PM'],
		daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		daysOfWeekShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		monthsOfYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'],
		monthsOfYearShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		timeFormat: 24,
		
		mode: 'datebox',
		calShowDays: true,
		calShowOnlyMonth: false,
		useDialogForceTrue: false,
		useDialogForceFalse: false,
		useDialog: false,
		useModal: false,
		useInline: false,
		noButtonFocusMode: false,
		noButton: false,
		closeCallback: false,
		
		fieldsOrder: ['m', 'd', 'y'],
		headerFormat: 'ddd, mmm dd, YYYY',
		dateFormat: 'YYYY-MM-DD',
		minuteStep: 1,
		calWeekMode: false,
		calWeekModeFirstDay: 1,
		calWeekModeHighlight: true,
		calStartDay: 0,
		defaultDate: false,
		minYear: false,
		maxYear: false,
		afterToday: false,
		maxDays: false,
		minDays: false,
		blackDays: false,
		blackDates: false,
		disabledDayColor: '#888'
	},
	_zeroPad: function(number) {
		return ( ( number < 10 ) ? "0" : "" ) + String(number);
	},
	_isInt: function (s) {
			return (s.toString().search(/^[0-9]+$/) === 0);
	},
	_dstAdjust: function(date) {
		if (!date) { return null; }
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},
	_getFirstDay: function(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	},
	_getLastDate: function(date) {
		return 32 - this._dstAdjust(new Date(date.getFullYear(), date.getMonth(), 32)).getDate();
	},
	_getLastDateBefore: function(date) {
		return 32 - this._dstAdjust(new Date(date.getFullYear(), date.getMonth()-1, 32)).getDate();
	},
	_formatter: function(format, date) {
		format = format.replace('YYYY', date.getFullYear());
		format = format.replace('mmm',  this.options.monthsOfYear[date.getMonth()] );
		format = format.replace('MM',   this._zeroPad(date.getMonth() + 1));
		format = format.replace('mm',   date.getMonth() + 1);
		format = format.replace('ddd',  this.options.daysOfWeek[date.getDay()] );
		format = format.replace('DD',   this._zeroPad(date.getDate()));
		format = format.replace('dd',   date.getDate());
		return format;
	},
	_formatHeader: function(date) {
		return this._formatter(this.options.headerFormat, date);
	},
	_formatDate: function(date) {
		return this._formatter(this.options.dateFormat, date);
	},
	_isoDate: function(y,m,d) {
		return String(y) + '-' + (( m < 10 ) ? "0" : "") + String(m) + '-' + ((d < 10 ) ? "0" : "") + String(d);
	},
	_formatTime: function(date) {
		var self = this,
			hours = '0',
			meri = 0;
			
		if ( this.options.timeFormat === 12 ) {
			if ( date.getHours() > 11 ) {
				meri = 1;
				hours = self._zeroPad(date.getHours() - 12);
				if ( hours === '00' ) { hours = '12'; }
			} else {
				meri = 0;
				hours = self._zeroPad(date.getHours());
				if ( hours === '00' ) { hours = '12'; }
			}
			return hours + ":" + self._zeroPad(date.getMinutes()) + ' ' + this.options.meridiemLetters[meri];
		} else {
			return self._zeroPad(date.getHours()) + ":" + self._zeroPad(date.getMinutes());
		}
	},
	_makeDate: function (str) {
		str = $.trim(str);
		var o = this.options,
			seperator = o.dateFormat.replace(/[myd ]/gi, "").substr(0,1),
			parts = o.dateFormat.split(seperator),
			data = str.split(seperator),
			date = new Date(),
			d_day = 1,
			d_mon = 0,
			d_yar = 2000,
			timeRegex = { '12': /^([012]?[0-9]):([0-5][0-9])\s*(am?|pm?)?$/i, '24': /^([012]?[0-9]):([0-5][0-9])$/i },
			match = null,
			i;
			
		if ( o.mode === 'timebox' ) {
			
			if ( o.timeFormat === 12 ) {
				match = timeRegex[o.timeFormat].exec(str);
				
				if( match === null || match.length < 3 ) { 
					return new Date();
				} else if ( match[1] < 12 && match[3].toLowerCase().charAt(0) === 'p' ) {  
					match[1] = parseInt(match[1],10) + 12;
				} else if ( match[1] === 12 ) {
					if ( match[3].toLowerCase().charAt(0) === 'a' ) { match[1] = 0; }
					else { match[1] = 12; }
				} else {
					match[1] = parseInt(match[1],10);
				}
			} else {
				match = timeRegex[o.timeFormat].exec(str);
				
				if( match === null || match.length < 2 || match[1] > 24 ) { 
					return new Date();
				}
			}
			
			date.setMinutes(match[2]);
			date.setHours(match[1]);
			
			return date;
		} else {
			if ( parts.length !== data.length ) { // Unrecognized string in input
				if ( o.defaultDate !== false ) {
					date = new Date(o.defaultDate);
					if ( ! date.getDate() ) {
						return new Date();
					} else {
						return date;
					}
				} else {
					return new Date();
				}
			} else { // Good string in input
				for ( i=0; i<parts.length; i++ ) {
					if ( parts[i].match(/d/i) ) { d_day = data[i]; }
					if ( parts[i].match(/m/i) ) { d_mon = data[i]; }
					if ( parts[i].match(/y/i) ) { d_yar = data[i]; }
				}
				date = new Date(d_yar, d_mon-1, d_day,0,0,0,0);
				if ( ! date.getDate() ) {
					return new Date();
				} else {
					return date;
				}
			}
		}
	},
	_checker: function(date) {
		return parseInt(String(date.getFullYear()) + this._zeroPad(date.getMonth()+1) + this._zeroPad(date.getDate()),10);
	},
	_hoover: function(item) {
		$(item).toggleClass('ui-btn-up-'+$(item).attr('data-theme')+' ui-btn-down-'+$(item).attr('data-theme'));
	},
	_offset: function(mode, amount, update) {
		var self = this,
			o = this.options;
			
		if ( typeof(update) === "undefined" ) { update = true; }
		switch(mode) {
			case 'y':
				self.theDate.setYear(self.theDate.getFullYear() + amount);
				break;
			case 'm':
				self.theDate.setMonth(self.theDate.getMonth() + amount);
				break;
			case 'd':
				self.theDate.setDate(self.theDate.getDate() + amount);
				break;
			case 'h':
				self.theDate.setHours(self.theDate.getHours() + amount);
				break;
			case 'i':
				self.theDate.setMinutes(self.theDate.getMinutes() + amount);
				break;
			case 'a':
				if ( self.pickerMeri.val() === o.meridiemLetters[0] ) { 
					self._offset('h',12,false);
				} else {
					self._offset('h',-12,false);
				}
				break;
		}
		if ( update === true ) { self._update(); }
	},
	_update: function() {
		var self = this,
			o = self.options, 
			testDate = null,
			i, gridWeek, gridDay, skipThis, thisRow, y, cTheme, inheritDate,
			calmode = {};
			
		/* BEGIN:TIMEBOX */
		if ( o.mode === 'timebox' ) {
			self.pickerMins.val(self._zeroPad(self.theDate.getMinutes()));
			if ( o.timeFormat === 12 ) {
				if ( self.theDate.getHours() > 11 ) {
					self.pickerMeri.val(o.meridiemLetters[1]);
					if ( self.theDate.getHours() === 12 ) {
						self.pickerHour.val(12);
					} else {
						self.pickerHour.val(self.theDate.getHours() - 12);
					}
				} else {
					self.pickerMeri.val(o.meridiemLetters[0]);
					if ( self.theDate.getHours() === 0 ) {
						self.pickerHour.val(12);
					} else {
						self.pickerHour.val(self.theDate.getHours());
					}
				}
			} else {
				self.pickerHour.val(self.theDate.getHours());
			}
		}
		/* END:TIMEBOX */
		/* BEGIN:SLIDEBOX */
		if ( o.mode === 'slidebox' ) {
			if ( o.afterToday !== false ) {
				testDate = new Date();
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			if ( o.maxDays !== false ) {
				testDate = new Date();
				testDate.setDate(testDate.getDate() + o.maxDays);
				if ( self.theDate > testDate ) { self.theDate = testDate; }
			}
			if ( o.minDays !== false ) {
				testDate = new Date();
				testDate.setDate(testDate.getDate() - o.minDays);
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			if ( o.maxYear !== false ) {
				testDate = new Date(o.maxYear, 0, 1);
				testDate.setDate(testDate.getDate() - 1);
				if ( self.theDate > testDate ) { self.theDate = testDate; }
			}
			if ( o.minYear !== false ) {
				testDate = new Date(o.minYear, 0, 1);
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			
			inheritDate = self._makeDate(self.input.val());
			
			self.controlsHeader.html( self._formatHeader(self.theDate) );
			self.controlsInput.html('');
			
			for ( y=0; y<3; y++ ) {
				thisRow = $("<div>", {'class': 'ui-datebox-sliderow', 'data-rowtype': y});
				if ( o.wheelExists ) {
					thisRow.bind('mousewheel', function(e,d) {
						e.preventDefault();
						self._offset(['y','m','d'][$(this).attr('data-rowtype')], ((d>0)?1:-1));
					});
				}
				if ( o.swipeEnabled ) {
					thisRow
						.bind('swipeleft', function() { self._offset(['y','m','d'][$(this).attr('data-rowtype')], [3,5,7][$(this).attr('data-rowtype')]);  })
						.bind('swiperight', function() { self._offset(['y','m','d'][$(this).attr('data-rowtype')], -1*[3,5,7][$(this).attr('data-rowtype')]); });
				}
				switch (y) {
					case 0:
						for ( i=-1; i<2; i++ ) {
							cTheme = ((inheritDate.getFullYear()===(self.theDate.getFullYear() + i))?o.pickPageHighButtonTheme:o.pickPageSlideButtonTheme);
							if ( i === 0 ) { cTheme = o.pickPageButtonTheme; }
							$("<div>", { 'class' : 'ui-datebox-slideyear ui-corner-all ui-btn-up-'+cTheme })
								.text(self.theDate.getFullYear() + i)
								.attr('data-offset', i)
								.attr('data-theme', cTheme)
								.bind('vmouseover vmouseout', function() { self._hoover(this); })
								.bind('vclick', function(e) { e.preventDefault(); self._offset('y', parseInt($(this).attr('data-offset'),10)); })
								.appendTo(thisRow);
						}
						break;
					case 1:
						for ( i=-2; i<3; i++ ) {
							testDate = new Date(self.theDate.getFullYear(), self.theDate.getMonth(), self.theDate.getDate());
							testDate.setMonth(testDate.getMonth()+i);
							cTheme = ( inheritDate.getMonth() === testDate.getMonth() && inheritDate.getYear() === testDate.getYear() ) ? o.pickPageHighButtonTheme : o.pickPageSlideButtonTheme;
							if ( i === 0 ) { cTheme = o.pickPageButtonTheme; }
							$("<div>", { 'class' : 'ui-datebox-slidemonth ui-corner-all ui-btn-up-'+cTheme })
								.attr('data-offset',i)
								.attr('data-theme', cTheme)
								.text(o.monthsOfYearShort[testDate.getMonth()])
								.bind('vmouseover vmouseout', function() { self._hoover(this); })
								.bind('vclick', function(e) { e.preventDefault(); self._offset('m', parseInt($(this).attr('data-offset'),10)); })
								.appendTo(thisRow);
						}
						break;
					case 2:
						$("<div>", {'class' : 'ui-datebox-slidearrow ui-corner-all ui-btn-up-'+o.pickPageButtonTheme})
							.attr('data-theme', o.pickPageButtonTheme)
							.text('<')
							.bind('vmouseover vmouseout', function() { self._hoover(this); })
							.bind('vclick', function(e) { e.preventDefault(); self._offset('d', -7); })
							.appendTo(thisRow);
						for ( i=-3; i<4; i++ ) {
							testDate = new Date(self.theDate.getFullYear(), self.theDate.getMonth(), self.theDate.getDate());
							testDate.setDate(testDate.getDate()+i);
							cTheme = ( inheritDate.getDate() === testDate.getDate() && inheritDate.getMonth() === testDate.getMonth() && inheritDate.getYear() === testDate.getYear() ) ? o.pickPageHighButtonTheme : o.pickPageSlideButtonTheme;
							if ( i === 0 ) { cTheme = o.pickPageButtonTheme; }
							
							$("<div>", { 'class' : 'ui-datebox-slideday ui-corner-all ui-btn-up-'+cTheme })
								.attr('data-offset', i)
								.attr('data-theme', cTheme)
								.html(testDate.getDate() + '<br /><span class="ui-datebox-slidewday">' + o.daysOfWeekShort[testDate.getDay()] + '</span>')
								.bind('vmouseover vmouseout', function() { self._hoover(this); })
								.bind('vclick', function(e) { e.preventDefault(); self._offset('d', parseInt($(this).attr('data-offset'),10)); })
								.appendTo(thisRow);
						}
						$("<div>", {'class' : 'ui-datebox-slidearrow ui-corner-all ui-btn-up-'+o.pickPageButtonTheme})
							.attr('data-theme', o.pickPageButtonTheme)
							.text('>')
							.bind('vmouseover vmouseout', function() { self._hoover(this); })
							.bind('vclick', function(e) { e.preventDefault(); self._offset('d', 7); })
							.appendTo(thisRow);
						break;
				}
				thisRow.appendTo(self.controlsInput);
			}
		}
		/* END:SLIDEBOX */
		/* BEGIN:DATEBOX */
		if ( o.mode === 'datebox' ) {
			if ( o.afterToday !== false ) {
				testDate = new Date();
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			if ( o.maxDays !== false ) {
				testDate = new Date();
				testDate.setDate(testDate.getDate() + o.maxDays);
				if ( self.theDate > testDate ) { self.theDate = testDate; }
			}
			if ( o.minDays !== false ) {
				testDate = new Date();
				testDate.setDate(testDate.getDate() - o.minDays);
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			if ( o.maxYear !== false ) {
				testDate = new Date(o.maxYear, 0, 1);
				testDate.setDate(testDate.getDate() - 1);
				if ( self.theDate > testDate ) { self.theDate = testDate; }
			}
			if ( o.minYear !== false ) {
				testDate = new Date(o.minYear, 0, 1);
				if ( self.theDate < testDate ) { self.theDate = testDate; }
			}
			
			self.controlsHeader.html( self._formatHeader(self.theDate) );
			self.pickerMon.val(self.theDate.getMonth() + 1);
			self.pickerDay.val(self.theDate.getDate());
			self.pickerYar.val(self.theDate.getFullYear());
		}
		/* END:DATEBOX */
		/* BEGIN:CALBOX */
		if ( o.mode === 'calbox' ) { // Meat and potatos - make the calendar grid.
			self.controlsInput.text( o.monthsOfYear[self.theDate.getMonth()] + " " + self.theDate.getFullYear() );
			self.controlsSet.html('');
			
			calmode = {'today': -1, 'highlightDay': -1, 'presetDay': -1, 'nexttoday': 1,
				'thisDate': new Date(), 'maxDate': new Date(), 'minDate': new Date(),
				'currentMonth': false, 'weekMode': 0, 'weekDays': null};
			calmode.start = self._getFirstDay(self.theDate);
			calmode.end = self._getLastDate(self.theDate);
			calmode.lastend = self._getLastDateBefore(self.theDate);
			calmode.presetDate = self._makeDate(self.input.val());	
			calmode.prevtoday = calmode.lastend - (calmode.start - 1);
			calmode.checkDates = ( o.afterToday !== false || o.maxDays !== false || o.minDays !== false || o.blackDates !== false || o.blackDays !== false );
			
			if ( o.calStartDay > 0 ) {
				calmode.start = calmode.start - o.calStartDay;
				if ( calmode.start < 0 ) { calmode.start = calmode.start + 7; }
			}
				
			if ( calmode.thisDate.getMonth() === self.theDate.getMonth() && calmode.thisDate.getFullYear() === self.theDate.getFullYear() ) { calmode.currentMonth = true; calmode.highlightDay = calmode.thisDate.getDate(); } 
			if ( self._checker(calmode.presetDate) === self._checker(self.theDate) ) { calmode.presetDay = calmode.presetDate.getDate(); }
			
			self.calNoPrev = false; self.calNoNext = false;
			
			if ( o.afterToday === true && 
				( calmode.currentMonth === true || ( calmode.thisDate.getMonth() >= self.theDate.getMonth() && self.theDate.getFullYear() === calmode.thisDate.getFullYear() ) ) ) { 
				self.calNoPrev = true; }

			if ( o.minDays !== false ) {
				calmode.minDate.setDate(calmode.minDate.getDate() - o.minDays);
				if ( self.theDate.getFullYear() === calmode.minDate.getFullYear() && self.theDate.getMonth() <= calmode.minDate.getMonth() ) { self.calNoPrev = true;}
			}
			if ( o.maxDays !== false ) {
				calmode.maxDate.setDate(calmode.maxDate.getDate() + o.maxDays);
				if ( self.theDate.getFullYear() === calmode.maxDate.getFullYear() && self.theDate.getMonth() >= calmode.maxDate.getMonth() ) { self.calNoNext = true;}
			}
			
			if ( o.calShowDays ) {
				if ( o.daysOfWeekShort.length < 8 ) { o.daysOfWeekShort = o.daysOfWeekShort.concat(o.daysOfWeekShort); }
				calmode.weekDays = $("<div>", {'class':'ui-datebox-gridrow'}).appendTo(self.controlsSet);
				for ( i=0; i<=6;i++ ) {
					$("<div>"+o.daysOfWeekShort[i+o.calStartDay]+"</div>").addClass('ui-datebox-griddate ui-datebox-griddate-empty ui-datebox-griddate-label').appendTo(calmode.weekDays);
				}
			}
			
			for ( gridWeek=0; gridWeek<=5; gridWeek++ ) {
				if ( gridWeek === 0 || ( gridWeek > 0 && (calmode.today > 0 && calmode.today <= calmode.end) ) ) {
					thisRow = $("<div>", {'class': 'ui-datebox-gridrow'}).appendTo(self.controlsSet);
					for ( gridDay=0; gridDay<=6; gridDay++) {
						if ( gridDay === 0 ) { calmode.weekMode = ( calmode.today < 1 ) ? (calmode.prevtoday - calmode.lastend + o.calWeekModeFirstDay) : (calmode.today + o.calWeekModeFirstDay); }
						if ( gridDay === calmode.start && gridWeek === 0 ) { calmode.today = 1; }
						if ( calmode.today > calmode.end ) { calmode.today = -1; }
						if ( calmode.today < 1 ) {
							if ( o.calShowOnlyMonth ) {
								$("<div>", {'class': 'ui-datebox-griddate ui-datebox-griddate-empty'}).appendTo(thisRow);
							} else {
								if (
									( o.blackDays !== false && $.inArray(gridDay, o.blackDays) > -1 ) ||
									( o.blackDates !== false && $.inArray(self._isoDate(self.theDate.getFullYear(), (self.theDate.getMonth()), calmode.prevtoday), o.blackDates) > -1 ) ||
									( o.blackDates !== false && $.inArray(self._isoDate(self.theDate.getFullYear(), (self.theDate.getMonth()+2), calmode.nexttoday), o.blackDates) > -1 ) ) {
										skipThis = true;
								} else { skipThis = false; }
									
								if ( gridWeek === 0 ) {
									$("<div>"+String(calmode.prevtoday)+"</div>")
										.addClass('ui-datebox-griddate ui-datebox-griddate-empty').appendTo(thisRow)
										.attr('data-date', ((o.calWeekMode)?(calmode.weekMode+calmode.lastend):calmode.prevtoday))
										.bind((!skipThis)?'vclick':'error', function(e) {
											e.preventDefault();
											if ( !self.calNoPrev ) {
												self.theDate.setMonth(self.theDate.getMonth() - 1);
												self.theDate.setDate($(this).attr('data-date'));
												self.input.val(self._formatDate(self.theDate)).trigger('change');
												self.close();
											}
										});
									calmode.prevtoday++;
								} else {
									$("<div>"+String(calmode.nexttoday)+"</div>")
										.addClass('ui-datebox-griddate ui-datebox-griddate-empty').appendTo(thisRow)
										.attr('data-date', ((o.calWeekMode)?calmode.weekMode:calmode.nexttoday))
										.bind((!skipThis)?'vclick':'error', function(e) {
											e.preventDefault();
											if ( !self.calNoNext ) {
												self.theDate.setDate($(this).attr('data-date'));
												if ( !o.calWeekMode ) { self.theDate.setMonth(self.theDate.getMonth() + 1); }
												self.input.val(self._formatDate(self.theDate)).trigger('change');
												self.close();
											}
										});
									calmode.nexttoday++;
								}
							}
						} else {
							skipThis = false;
							if ( calmode.checkDates ) {
								if ( o.afterToday && self._checker(calmode.thisDate) > (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
									skipThis = true;
								} 
								if ( !skipThis && o.maxDays !== false && self._checker(calmode.maxDate) < (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
									skipThis = true;
								} 
								if ( !skipThis && o.minDays !== false && self._checker(calmode.minDate) > (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
									skipThis = true;
								} 
								if ( !skipThis && ( o.blackDays !== false || o.blackDates !== false ) ) { // Blacklists
									if ( 
										( $.inArray(gridDay, o.blackDays) > -1 ) ||
										( $.inArray(self._isoDate(self.theDate.getFullYear(), self.theDate.getMonth()+1, calmode.today), o.blackDates) > -1 ) ) { 
											skipThis = true;
									}
								}
							}
							
							$("<div>"+String(calmode.today)+"</div>")
								.addClass('ui-datebox-griddate ui-corner-all')
								.attr('data-date', ((o.calWeekMode)?calmode.weekMode:calmode.today))
								.attr('data-theme', ((calmode.today===calmode.presetDay)?o.pickPageHighButtonTheme:((calmode.today===calmode.highlightDay)?o.pickPageTodayButtonTheme:o.pickPageButtonTheme)))
								.appendTo(thisRow)
								.addClass('ui-btn-up-'+((calmode.today===calmode.presetDay)?o.pickPageHighButtonTheme:((calmode.today===calmode.highlightDay)?o.pickPageTodayButtonTheme:o.pickPageButtonTheme)))
								.bind('vmouseover vmouseout', function() { 
									if ( o.calWeekMode !== false && o.calWeekModeHighlight === true ) {
										$(this).parent().find('div').each(function() { self._hoover(this); });
									} else { self._hoover(this); }
								})
								.bind((!skipThis)?'vclick':'error', function(e) {
										e.preventDefault();
										self.theDate.setDate($(this).attr('data-date'));
										self.input.val(self._formatDate(self.theDate)).trigger('change');
										self.close();
								})
								.css((skipThis)?'color':'nocolor', o.disabledDayColor);
							
							calmode.today++;
						}
					}
				}
			}
		}
		/* END:CALBOX */
	},
	_create: function() {
		var self = this,
			o = $.extend(this.options, this.element.data('options')),
			input = this.element,
			focusedEl = input.wrap('<div class="ui-input-datebox ui-shadow-inset ui-corner-all ui-body-'+ o.theme +'"></div>').parent(),
			theDate = new Date(),
			dialogTitle = ((o.titleDialogLabel === false)?((o.mode==='timebox')?o.titleTimeDialogLabel:o.titleDateDialogLabel):o.titleDialogLabel),
			openbutton = $('<a href="#" class="ui-input-clear" title="date picker">date picker</a>')
				.bind('vclick', function (e) {
					e.preventDefault();
					if ( !o.disabled ) { self.open(); }
					setTimeout( function() { $(e.target).closest("a").removeClass($.mobile.activeBtnClass); }, 300);
				})
				.appendTo(focusedEl).buttonMarkup({icon: 'grid', iconpos: 'notext', corners:true, shadow:true})
				.css({'vertical-align': 'middle', 'float': 'right'}),
			thisPage = input.closest('.ui-page'),
			pickPage = $("<div data-role='dialog' class='ui-dialog-datebox' data-theme='" + o.pickPageTheme + "' >" +
						"<div data-role='header' data-backbtn='false' data-theme='a'>" +
							"<div class='ui-title'>" + dialogTitle + "</div>"+
						"</div>"+
						"<div data-role='content'></div>"+
					"</div>")
					.appendTo( $.mobile.pageContainer )
					.page().css('minHeight', '0px').css('zIndex', o.zindex).addClass('pop'),
			pickPageContent = pickPage.find( ".ui-content" );
			
		$('label[for='+input.attr('id')+']').addClass('ui-input-text').css('verticalAlign', 'middle');
		
		/* BUILD:MODE */
			
		if ( o.noButtonFocusMode || o.useInline || o.noButton ) { openbutton.hide(); }
		
		focusedEl.tap(function() {
			if ( !o.disabled && o.noButtonFocusMode ) { self.open(); }
		});
		
		input
			.removeClass('ui-corner-all ui-shadow-inset')
			.focus(function(){
				if ( ! o.disabled ) {
					focusedEl.addClass('ui-focus');
					if ( o.noButtonFocusMode ) { focusedEl.addClass('ui-focus'); self.open(); }
				}
				input.removeClass('ui-focus');
			})
			.blur(function(){
				focusedEl.removeClass('ui-focus');
				input.removeClass('ui-focus');
			})
			.change(function() {
				self.theDate = self._makeDate(self.input.val());
				self._update();
			});
		
		pickPage.find( ".ui-header a").bind('vclick', function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			self.close();
		});

		$.extend(self, {
			pickPage: pickPage,
			thisPage: thisPage,
			pickPageContent: pickPageContent,
			input: input,
			theDate: theDate,
			focusedEl: focusedEl
		});
		
		if ( typeof $.event.special.mousewheel !== 'undefined' ) { o.wheelExists = true; }
		
		self._buildPage();
		
		if ( input.is(':disabled') ) {
			self.disable();
		}
	},
	_buildPage: function () {
		var self = this,
			o = self.options, x, newHour,
			linkdiv =$("<div><a href='#'></a></div>"),
			pickerContent = $("<div>", { "class": 'ui-datebox-container ui-overlay-shadow ui-corner-all ui-datebox-hidden pop ui-body-'+o.pickPageTheme} ).css('zIndex', o.zindex),
			templInput = $("<input type='text' />").addClass('ui-input-text ui-corner-all ui-shadow-inset ui-datebox-input ui-body-'+o.pickPageInputTheme),
			templControls = $("<div>", { "class":'ui-datebox-controls' }),
			controlsPlus, controlsInput, controlsMinus, controlsSet, controlsHeader,
			pickerHour, pickerMins, pickerMeri, pickerMon, pickerDay, pickerYar,
			calNoNext = false,
			calNoPrev = false,
			screen = $("<div>", {'class':'ui-datebox-screen ui-datebox-hidden'+((o.useModal)?' ui-datebox-screen-modal':'')})
				.css({'z-index': o.zindex-1})
				.appendTo(self.thisPage)
				.bind("vclick", function(event) {
					self.close();
					event.preventDefault();
				});
		
		if ( o.noAnimation ) { pickerContent.removeClass('pop');	}
		
		/* BEGIN:TIMEBOX */
		if ( o.mode === 'timebox' ) {
			controlsPlus = templControls.clone().appendTo(pickerContent);
			controlsInput = templControls.clone().appendTo(pickerContent);
			controlsMinus = templControls.clone().appendTo(pickerContent);
			controlsSet = templControls.clone().appendTo(pickerContent);
				
			pickerHour = templInput.clone()
				.keyup(function() {
					if ( $(this).val() !== '' && self._isInt($(this).val()) ) {
						newHour = parseInt($(this).val(),10);
						if ( newHour === 12 ) {
							if ( o.timeFormat === 12 && pickerMeri.val() === o.meridiemLetters[0] ) { newHour = 0; }
						}
						self.theDate.setHours(newHour);
						self._update();
					}
				});
				
			pickerMins = templInput.clone()
				.keyup(function() {
					if ( $(this).val() !== '' && self._isInt($(this).val()) ) {
						self.theDate.setMinutes(parseInt($(this).val(),10));
						self._update();
					}
				});
				
			pickerMeri = templInput.clone()
				.keyup(function() {
					if ( $(this).val() !== '' ) {
						self._update();
					}
				});
			
			if ( o.wheelExists ) {
					pickerHour.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('h', (d<0)?-1:1); });
					pickerMins.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('i', (d<0)?-1:1); });
					pickerMeri.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('a', d); });
				}
			
			pickerHour.appendTo(controlsInput);
			pickerMins.appendTo(controlsInput);
			if ( o.timeFormat === 12 ) { pickerMeri.appendTo(controlsInput); }
			
			$("<a href='#'>" + o.setTimeButtonLabel + "</a>")
				.appendTo(controlsSet).buttonMarkup({theme: o.pickPageTheme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
				.click(function(e) {
					e.preventDefault();
					self.input.val(self._formatTime(self.theDate)).trigger('change');
					self.close();
				});
				
			for ( x=0; x<((o.timeFormat === 12)?3:2); x++ ) {
				linkdiv.clone()
					.appendTo(controlsPlus).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'plus', iconpos: 'bottom', corners:true, shadow:true})
					.attr('data-field', ['h','i','a'][x])
					.bind('vclick', function(e) {
						e.preventDefault();
						self._offset($(this).attr('data-field'),1);
					});
					
				linkdiv.clone()
					.appendTo(controlsMinus).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'minus', iconpos: 'top', corners:true, shadow:true})
					.attr('data-field', ['h','i','a'][x])
					.bind('vclick', function(e) {
						e.preventDefault();
						self._offset($(this).attr('data-field'),-1);
					});
			}
			
			$.extend(self, {
				pickerHour: pickerHour,
				pickerMins: pickerMins,
				pickerMeri: pickerMeri
			});
			
			pickerContent.appendTo(self.thisPage);
		}
		/* END:TIMEBOX */
		/* BEGIN:DATEBOX */
		if ( o.mode === 'datebox' ) {
			controlsHeader = $("<div class='ui-datebox-header'><h4>Unitialized</h4></div>").appendTo(pickerContent).find("h4");
			controlsPlus = templControls.clone().appendTo(pickerContent);
			controlsInput = templControls.clone().appendTo(pickerContent);
			controlsMinus = templControls.clone().appendTo(pickerContent);
			controlsSet = templControls.clone().appendTo(pickerContent);
				
			pickerMon = templInput.clone()
				.keyup(function() {
					if ( $(this).val() !== '' && self._isInt($(this).val()) ) {
						self.theDate.setMonth(parseInt($(this).val(),10)-1);
						self._update();
					}
				});
				
			pickerDay = pickerMon.clone()
				.keyup(function() {
					if ( $(this).val() !== '' && self._isInt($(this).val()) ) {
						self.theDate.setDate(parseInt($(this).val(),10));
						self._update();
					}
				});
				
			pickerYar = pickerMon.clone()
				.keyup(function() {
					if ( $(this).val() !== '' && self._isInt($(this).val()) ) {
						self.theDate.setYear(parseInt($(this).val(),10));
						self._update();
					}
				});
					
			if ( o.wheelExists ) {
				pickerYar.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('y', (d<0)?-1:1); });
				pickerMon.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('m', (d<0)?-1:1); });
				pickerDay.bind('mousewheel', function(e,d) { e.preventDefault(); self._offset('d', (d<0)?-1:1); });
			}
		
			for(x=0; x<=o.fieldsOrder.length; x++) {
				if (o.fieldsOrder[x] === 'y') { pickerYar.appendTo(controlsInput); }
				if (o.fieldsOrder[x] === 'm') { pickerMon.appendTo(controlsInput); }
				if (o.fieldsOrder[x] === 'd') { pickerDay.appendTo(controlsInput); }
			}
		
			$("<a href='#'>" + o.setDateButtonLabel + "</a>")
				.appendTo(controlsSet).buttonMarkup({theme: o.pickPageTheme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
				.bind('vclick', function(e) {
					e.preventDefault();
					self.input.val(self._formatDate(self.theDate)).trigger('change');
					self.close();
				});
			
			for( x=0; x<self.options.fieldsOrder.length; x++ ) {
				linkdiv.clone()
					.appendTo(controlsPlus).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'plus', iconpos: 'bottom', corners:true, shadow:true})
					.attr('data-field', o.fieldsOrder[x])
					.bind('vclick', function(e) {
						e.preventDefault();
						self._offset($(this).attr('data-field'),1);
				});
				linkdiv.clone()
					.appendTo(controlsMinus).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'minus', iconpos: 'top', corners:true, shadow:true})
					.attr('data-field', o.fieldsOrder[x])
					.bind('vclick', function(e) {
						e.preventDefault();
						self._offset($(this).attr('data-field'),-1);
				});
			}
				
			$.extend(self, {
				controlsHeader: controlsHeader,
				pickerDay: pickerDay,
				pickerMon: pickerMon,
				pickerYar: pickerYar
			});
			
			pickerContent.appendTo(self.thisPage);
		}
		/* END:DATEBOX */
		/* BEGIN:CALBOX */
		if ( o.mode === 'calbox' ) {
			controlsHeader = $("<div>", {"class": 'ui-datebox-gridheader'}).appendTo(pickerContent);
			controlsSet = $("<div>", {"class": 'ui-datebox-grid'}).appendTo(pickerContent);
			controlsInput = $("<div class='ui-datebox-gridlabel'><h4>Uninitialized</h4></div>").appendTo(controlsHeader).find('h4');
			
			if ( o.swipeEnabled ) {
				pickerContent
					.bind('swipeleft', function() { if ( !self.calNoNext ) { self._offset('m', 1); } })
					.bind('swiperight', function() { if ( !self.calNoPrev ) { self._offset('m', -1); } });
			}
			
			if ( o.wheelExists) {
				pickerContent.bind('mousewheel', function(e,d) {
					e.preventDefault();
					if ( d > 0 && !self.calNoNext ) { 
						if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
						self.theDate.setMonth(self.theDate.getMonth() + 1);
						self._update(); 
					}
					if ( d < 0 && !self.calNoPrev ) {
						if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
						self.theDate.setMonth(self.theDate.getMonth() - 1);
						self._update();
					}
				});
			}
						
			$("<div class='ui-datebox-gridplus'><a href='#'>Next Month</a></div>")
				.prependTo(controlsHeader).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'plus', inline: true, iconpos: 'notext', corners:true, shadow:true})
				.bind('vclick', function(e) {
					e.preventDefault();
					if ( ! self.calNoNext ) {
						if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
						self._offset('m',1);
					}
				});
			$("<div class='ui-datebox-gridminus'><a href='#'>Prev Month</a></div>")
				.prependTo(controlsHeader).buttonMarkup({theme: o.pickPageButtonTheme, icon: 'minus', inline: true, iconpos: 'notext', corners:true, shadow:true})
				.bind('vclick', function(e) {
					e.preventDefault();
					if ( ! self.calNoPrev ) {
						if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
						self._offset('m',-1);
					}
				});
				
					
			$.extend(self, {
				controlsInput: controlsInput,
				controlsSet: controlsSet,
				calNoNext: calNoNext,
				calNoPrev: calNoPrev
			});
			
			pickerContent.appendTo(self.thisPage);
		}
		/* END:CALBOX */
		/* BEGIN:SLIDEBOX */
		if ( o.mode === 'slidebox' ) {
			controlsHeader = $("<div class='ui-datebox-header'><h4>Unitialized</h4></div>").appendTo(pickerContent).find("h4");
			controlsInput = $('<div>').addClass('ui-datebox-slide').appendTo(pickerContent);
			controlsSet = $("<div>", { "class":'ui-datebox-controls'}).appendTo(pickerContent);
				
			$("<a href='#'>" + o.setDateButtonLabel + "</a>")
				.appendTo(controlsSet).buttonMarkup({theme: o.pickPageTheme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
				.bind('vclick', function(e) {
					e.preventDefault();
					self.input.val(self._formatDate(self.theDate)).trigger('change');
					self.close();
				});
				
			$.extend(self, {
				controlsHeader: controlsHeader,
				controlsInput: controlsInput
			});
			
			pickerContent.appendTo(self.thisPage);
		}
		/* END:SLIDEBOX */

		$.extend(self, {
			pickerContent: pickerContent,
			screen: screen
		});
		
		if ( o.useInline ) { 
			self.input.parent().parent().append(self.pickerContent);
			if ( o.useInlineHideInput ) { self.input.parent().hide(); }
			self.input.trigger('change');
			self.pickerContent.removeClass('ui-datebox-hidden');
		}
			
	},
	refresh: function() {
		if ( this.options.useInline === true ) {
			this.input.trigger('change');
		}
		this._update();
	},
	open: function() {
		this.input.trigger('change').blur();
		
		var self = this,
			o = this.options,
			inputOffset = self.focusedEl.offset(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),
			pickWinTop = inputOffset.top + ( self.focusedEl.outerHeight() / 2 )- ( pickWinHeight / 2),
			pickWinLeft = inputOffset.left + ( self.focusedEl.outerWidth() / 2) - ( pickWinWidth / 2);

		if ( o.useInline ) { return false; }
					
		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { pickWinTop = 45; }
		
		if ( ( $(document).width() > 400 && !o.useDialogForceTrue ) || o.useDialogForceFalse ) {
			o.useDialog = false;
			if ( o.useModal ) {
				self.screen.fadeIn('slow');
			} else {
				self.screen.removeClass('ui-datebox-hidden');
			}
			self.pickerContent.addClass('ui-overlay-shadow in').css({'position': 'absolute', 'top': pickWinTop, 'left': pickWinLeft}).removeClass('ui-datebox-hidden');
		} else {
			o.useDialog = true;
			self.pickPageContent.append(self.pickerContent);
			self.pickerContent.css({'top': 'auto', 'left': 'auto', 'marginLeft': 'auto', 'marginRight': 'auto'}).removeClass('ui-overlay-shadow ui-datebox-hidden');
			$.mobile.changePage(self.pickPage, 'pop', false, true);
		}
	},
	close: function() {
		var self = this,
			callback;

		if ( self.options.useInline ) {
			return true;
		}

		if ( self.options.useDialog ) {
			$(self.pickPage).dialog('close');
			self.pickerContent.addClass('ui-datebox-hidden').removeAttr('style').css('zIndex', self.options.zindex);
			self.thisPage.append(self.pickerContent);
		} else {
			if ( self.options.useModal ) {
				self.screen.fadeOut('slow');
			} else {
				self.screen.addClass('ui-datebox-hidden');
			}
			self.pickerContent.addClass('ui-datebox-hidden').removeAttr('style').css('zIndex', self.options.zindex).removeClass('in');
		}
		self.focusedEl.removeClass('ui-focus');
		
		if ( self.options.closeCallback !== false ) { callback = new Function(self.options.closeCallback); callback(); }
	},
	disable: function(){
		this.element.attr("disabled",true);
		this.element.parent().addClass("ui-disabled");
		this.options.disabled = true;
		this.element.blur();
	},
	enable: function(){
		this.element.attr("disabled", false);
		this.element.parent().removeClass("ui-disabled");
		this.options.disabled = false;
	}
	
  });
	
  $( ".ui-page" ).live( "pagecreate", function() { 
	$( 'input[data-role="datebox"]', this ).each(function() {
		$(this).datebox();
	});

  });
	
})( jQuery );
