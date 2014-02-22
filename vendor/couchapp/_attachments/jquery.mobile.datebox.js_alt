/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-datebox
 */
/* CORE Functions */

(function($) {
	$.widget( "mobile.datebox", $.mobile.widget, {
		options: {
			// All widget options, including some internal runtime details
			version: '2-1.3.0-2013040300', // jQMMajor.jQMMinor.DBoxMinor-YrMoDaySerial
			theme: false,
			themeDefault: 'c',
			themeHeader: 'a',
			mode: false,
			
			centerHoriz: false,
			centerVert: false,
			transition: 'pop',
			useAnimation: true,
			hideInput: false,
			hideFixedToolbars: false,
			
			lockInput: true,
			enhanceInput: true,
			
			zindex: '500',
			clickEvent: 'vclick',
			clickEventAlt: 'click',
			resizeListener: true,
			
			defaultValue: false,
			
			dialogEnable: false,
			dialogForce: false,
			enablePopup: false,
			
			popupPosition: false,
			popupForceX: false,
			popupForceY: false,
			
			useModal: false,
			useInline: false,
			useInlineBlind: false,
			useHeader: true,
			useImmediate: false,
			useNewStyle: false,
			useAltIcon: false,
			overrideStyleClass: false,
			
			useButton: true,
			useFocus: false,
			useClearButton: false,
			useCollapsedBut: false,
			usePlaceholder: false,
			
			openCallback: false,
			openCallbackArgs: [],
			closeCallback: false,
			closeCallbackArgs: [],
			
			startOffsetYears: false,
			startOffsetMonths: false,
			startOffsetDays: false,
			afterToday: false,
			beforeToday: false,
			notToday: false,
			maxDays: false,
			minDays: false,
			maxYear: false,
			minYear: false,
			blackDates: false,
			blackDatesRec: false,
			blackDays: false,
			minHour: false,
			maxHour: false,
			minuteStep: 1,
			minuteStepRound: 0,
			
			rolloverMode: { 'm': true, 'd': true, 'h': true, 'i': true, 's': true },
			
			useLang: 'default',
			lang: {
				'default' : {
					setDateButtonLabel: 'Set Date',
					setTimeButtonLabel: 'Set Time',
					setDurationButtonLabel: 'Set Duration',
					calTodayButtonLabel: 'Jump to Today',
					titleDateDialogLabel: 'Set Date',
					titleTimeDialogLabel: 'Set Time',
					daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					daysOfWeekShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					monthsOfYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					monthsOfYearShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					durationLabel: ['Days', 'Hours', 'Minutes', 'Seconds'],
					durationDays: ['Day', 'Days'],
					timeFormat: 24,
					headerFormat: '%A, %B %-d, %Y',
					tooltip: 'Open Date Picker',
					nextMonth: 'Next Month',
					prevMonth: 'Previous Month',
					dateFieldOrder: ['m', 'd', 'y'],
					timeFieldOrder: ['h', 'i', 'a'],
					slideFieldOrder: ['y', 'm', 'd'],
					dateFormat: '%Y-%m-%d',
					useArabicIndic: false,
					isRTL: false,
					calStartDay: 0,
					clearButton: 'Clear',
					durationOrder: ['d', 'h', 'i', 's'],
					meridiem: ['AM', 'PM'],
					timeOutput: '%k:%M', //{ '12': '%l:%M %p', '24': '%k:%M' },
					durationFormat: '%Dd %DA, %Dl:%DM:%DS',
					calDateListLabel: 'Other Dates'
				}
			}
		},
		_enhanceDate: function() {
			$.extend(this._date.prototype, {
				copy: function(adjust, override) {
					/* Get a modified copy of the date.
					 * First array - Offset the new date by #  (position determines date part)
					 * Second array - If non-zero, force the new date by # (position determines date part)
					 */
					if ( typeof adjust === 'undefined' ) { adjust = [0,0,0,0,0,0,0]; }
					if ( typeof override === 'undefined' ) { override = [0,0,0,0,0,0,0]; }
					while ( adjust.length < 7 ) { adjust.push(0); }
					while ( override.length < 7 ) { override.push(0); }
					return new Date(
						((override[0] > 0 ) ? override[0] : this.getFullYear() + adjust[0]),
						((override[1] > 0 ) ? override[1] : this.getMonth() + adjust[1]),
						((override[2] > 0 ) ? override[2] : this.getDate() + adjust[2]),
						((override[3] > 0 ) ? override[3] : this.getHours() + adjust[3]),
						((override[4] > 0 ) ? override[4] : this.getMinutes() + adjust[4]),
						((override[5] > 0 ) ? override[5] : this.getSeconds() + adjust[5]),
						((override[6] > 0 ) ? override[5] : this.getMilliseconds() + adjust[6]));
				},
				adj: function (type, amount) {
					/* Adjust the date.  Yes, this is chainable */
					if ( typeof amount !== 'number' ) {
						throw new Error("Adjustment value not specified");
					}
					if ( typeof type !== 'number' ) {
						throw new Error("Adjustment type not specified");
					}
					switch ( type ) {
						case 0: this.setFullYear(this.getFullYear() + amount); break;
						case 1: this.setMonth(this.getMonth() + amount); break;
						case 2: this.setDate(this.getDate() + amount); break;
						case 3: this.setHours(this.getHours() + amount); break;
						case 4: this.setMinutes(this.getMinutes() + amount); break;
						case 5: this.setSeconds(this.getSeconds() + amount); break;
						case 6: this.setMilliseconds(this.getMilliseconds() + amount); break;
					}
					return this;
				},
				set: function(type, amount) {
					/* A chainable version of setWhatever() */
					switch ( type ) {
						case 0: this.setFullYear(amount); break;
						case 1: this.setMonth(amount); break;
						case 2: this.setDate(amount); break;
						case 3: this.setHours(amount); break;
						case 4: this.setMinutes(amount); break;
						case 5: this.setSeconds(amount); break;
						case 6: this.setMilliseconds(amount); break;
					}
					return this;
				},
				get: function(type) {
					switch ( type ) {
						case 0: return this.getFullYear();
						case 1: return this.getMonth();
						case 2: return this.getDate();
						case 3: return this.getHours();
						case 4: return this.getMinutes();
						case 5: return this.getSeconds();
					}
					return false;
				},
				iso: function() {
					return String(this.getFullYear()) + '-' + (( this.getMonth() < 9 ) ? "0" : "") + String(this.getMonth()+1) + '-' + ((this.getDate() < 10 ) ? "0" : "") + String(this.getDate());
				},
				comp: function () { 
					return parseInt(this.iso().replace(/-/g,''),10); 
				},
				getEpoch: function() { 
					return (this.getTime() - this.getMilliseconds()) / 1000; 
				},
				getArray: function() {
					return [this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds()];
				},
				setFirstDay: function (day) {
					this.set(2,1).adj(2, (day - this.getDay()));
					if ( this.get(2) > 10 ) { this.adj(2,7); }
					return this; 
				},
				setWeek: function (type,num) {
					if ( type === 4 ) {
						return this.set(1,0).set(2,1).setFirstDay(4).adj(2,-3).adj(2,(num-1)*7);
					}
					return this.set(1,0).set(2,1).setFirstDay(type).adj(2,(num-1)*7);
				},
				getWeek: function (type) {
					var t1, t2;
					
					switch ( type ) {
						case 0:
							t1 = this.copy([0,-1*this.getMonth()]).setFirstDay(0);
							return Math.floor((this.getTime() - ( t1.getTime() + (( this.getTimezoneOffset() - t1.getTimezoneOffset()) * 60000))) / 6048e5) + 1;
							//return Math.floor((this.getTime() - t1.getTime()) / 6048e5) + 1;
						case 1:
							t1 = this.copy([0,-1*this.getMonth()]).setFirstDay(1);
							return Math.floor((this.getTime() - ( t1.getTime() + (( this.getTimezoneOffset() - t1.getTimezoneOffset()) * 60000))) / 6048e5) + 1;
							//return Math.floor((this.getTime() - t1.getTime()) / 6048e5) + 1;
						case 4:
							// this line is some bullshit.  but it does work.
							// (trap for dec 29, 30, or 31st being in the new year's week - these are the
							//  only 3 that can possibly fall like this)
							if ( this.getMonth() === 11 && this.getDate() > 28 ) { return 1; } 
							
							t1 = this.copy([0,-1*this.getMonth()],true).setFirstDay(4).adj(2,-3);
							t2 = Math.floor((this.getTime() - ( t1.getTime() + (( this.getTimezoneOffset() - t1.getTimezoneOffset()) * 60000))) / 6048e5) + 1;
							
							if ( t2 < 1 ) {
								t1 = this.copy([-1,-1*this.getMonth()]).setFirstDay(4).adj(2,-3);
								return Math.floor((this.getTime() - t1.getTime()) / 6048e5) + 1;
							}
							return t2;
						default:
							return 0;
					}
				}
			});
		},
		_event: function(e, p) {
			//var w = parseInt($.mobile.version.replace(/\./g,''),10) > 110 ? $(this).data('mobileDatebox') : $(this).data('datebox');
			var w = parseInt($.mobile.version.replace(/\./g,''),10) > 110 ? parseInt($().jquery.replace(/\./g,''),10) >= 200 ? $(this).data('mobile-datebox') : $(this).data('mobileDatebox') : $(this).data('datebox');
			if ( ! e.isPropagationStopped() ) {
				switch (p.method) {
					case 'close':
						w.close(); break;
					case 'open':
						w.open(); break;
					case 'set':
						$(this).val(p.value);
						$(this).trigger('change');
						break;
					case 'doset':
						if ( $.isFunction(w['_'+w.options.mode+'DoSet']) ) {
							w['_'+w.options.mode+'DoSet'].apply(w,[]);
						} else {
							$(this).trigger('datebox', {'method':'set', 'value':w._formatter(w.__fmt(), w.theDate), 'date':w.theDate});
						}
						break;
					case 'dooffset':
						if (p.type) { w._offset(p.type, p.amount, true); } break; 
					case 'dorefresh':
						w.refresh(); break;
					case 'doreset':
						w.hardreset(); break;
					case 'doclear':
						$(this).val('').trigger('change'); break;
					case 'clear':
						$(this).trigger('change');
				}
			}
		},
		_hoover: function(item) {
			// Hover toggle class, for calendar
			$(item).toggleClass('ui-btn-up-'+$(item).jqmData('theme')+' ui-btn-down-'+$(item).jqmData('theme'));
		},
		_ord: {
			'default': function (num) {
				// Return an ordinal suffix (1st, 2nd, 3rd, etc)
				var ending = num % 10;
				if ( num > 9 && num < 21 ) { return 'th'; }
				if ( ending > 3 ) { return 'th'; }
				return ['th','st','nd','rd'][ending];
			}
		},
		__ : function(val) {
			var o = this.options,
				oride = 'override' + val.charAt(0).toUpperCase() + val.slice(1);
				
			if ( typeof o[oride] !== 'undefined' ) { return o[oride]; }
			if ( typeof o.lang[o.useLang][val] !== 'undefined' ) { return o.lang[o.useLang][val]; }
			if ( typeof o[o.mode+'lang'] !== 'undefined' && typeof o[o.mode+'lang'][val] !== 'undefined' ) { return o[o.mode+'lang'][val]; }
			return o.lang['default'][val];
		},
		__fmt: function() {
			var w = this,
				o = this.options;
			
			switch ( o.mode ) {
				case 'timebox':
				case 'timeflipbox':
					return w.__('timeOutput');
				case 'durationbox':
				case 'durationflipbox':
					return w.__('durationFormat');
				default:
					return w.__('dateFormat');
			}
		},
		_zPad: function(number) {
			return (( number < 10 ) ? '0' + String(number) : String(number));
		},
		_dRep: function(oper, direction) {
			var start = 48,
				end = 57,
				adder = 1584,
				i = null, 
				ch = null,
				newd = '';
				
			if ( direction === -1 ) {
				start += adder;
				end += adder;
				adder = -1584;
			}
			
			for ( i=0; i<oper.length; i++ ) {
				ch = oper.charCodeAt(i);
				if ( ch >= start && ch <= end ) {
					newd = newd + String.fromCharCode(ch+adder);
				} else {
					newd = newd + String.fromCharCode(ch);
				}
			}
			
			return newd;
		},
		_doIndic: function() {
			var w = this;
				
			w.d.intHTML.find('*').each(function() {
				if ( $(this).children().length < 1 ) {
					$(this).text(w._dRep($(this).text()));
				} else if ( $(this).hasClass('ui-datebox-slideday') ) {
					$(this).html(w._dRep($(this).html()));
				}
			});
			w.d.intHTML.find('input').each(function() {
				$(this).val(w._dRep($(this).val()));
			});
		},
		_parser: {
			'default': function (str) { return false; }
		},
		_n: function (val,def) {
			return ( val < 0 ) ? def : val;
		},
		_pa: function (arr,date) {
			if ( typeof date === 'boolean' ) { return new this._date(arr[0],arr[1],arr[2],0,0,0,0); }
			return new this._date(date.getFullYear(), date.getMonth(), date.getDate(), arr[0], arr[1], arr[2], 0);
		},
		_makeDate: function (str) {
			// Date Parser
			str = $.trim(((this.__('useArabicIndic') === true)?this._dRep(str, -1):str));
			var w = this,
				o = this.options,
				adv = w.__fmt(),
				exp_input = null,
				exp_names = [],
				exp_format = null,
				exp_temp = null,
				date = new w._date(),
				d = { year: -1, mont: -1, date: -1, hour: -1, mins: -1, secs: -1, week: false, wtyp: 4, wday: false, yday: false, meri: 0 },
				i;
			
			if ( typeof o.mode === 'undefined' ) { return date; }
			if ( typeof w._parser[o.mode] !== 'undefined' ) { return w._parser[o.mode].apply(w,[str]); }
			
			if ( o.mode === 'durationbox' || o.mode === 'durationflipbox' ) {
				adv = adv.replace(/%D([a-z])/gi, function(match, oper) {
					switch (oper) {
						case 'd':
						case 'l':
						case 'M':
						case 'S': return '(' + match + '|' +'[0-9]+' + ')';
						default: return '.+?';
					}
				});
				
				adv = new RegExp('^' + adv + '$');
				exp_input = adv.exec(str);
				exp_format = adv.exec(w.__fmt());
				
				if ( exp_input === null || exp_input.length !== exp_format.length ) {
					if ( typeof o.defaultValue === "number" && o.defaultValue > 0 ) {
						return new w._date((w.initDate.getEpoch() + parseInt(o.defaultValue,10))*1000);
					} 
					return new w._date(w.initDate.getTime());
				} 
				
				exp_temp = w.initDate.getEpoch();
				for ( i=0; i<exp_input.length; i++ ) { //0y 1m 2d 3h 4i 5s
					if ( exp_format[i].match(/^%Dd$/i) )   { exp_temp = exp_temp + (parseInt(exp_input[i],10)*60*60*24); }
					if ( exp_format[i].match(/^%Dl$/i) )   { exp_temp = exp_temp + (parseInt(exp_input[i],10)*60*60); }
					if ( exp_format[i].match(/^%DM$/i) )   { exp_temp = exp_temp + (parseInt(exp_input[i],10)*60); }
					if ( exp_format[i].match(/^%DS$/i) )   { exp_temp = exp_temp + (parseInt(exp_input[i],10)); }
				}
				return new w._date((exp_temp*1000));
			}
			
			adv = adv.replace(/%(0|-)*([a-z])/gi, function(match, pad, oper) {
				exp_names.push(oper);
				switch (oper) {
					case 'p':
					case 'P':
					case 'b':
					case 'B': return '(' + match + '|' +'.+?' + ')';
					case 'H':
					case 'k':
					case 'I':
					case 'l':
					case 'm':
					case 'M':
					case 'S':
					case 'V':
					case 'U':
					case 'u':
					case 'W':
					case 'd': return '(' + match + '|' + (( pad === '-' ) ? '[0-9]{1,2}' : '[0-9]{2}') + ')';
					case 'j': return '(' + match + '|' + '[0-9]{3}' + ')';
					case 's': return '(' + match + '|' + '[0-9]+' + ')';
					case 'g':
					case 'y': return '(' + match + '|' + '[0-9]{2}' + ')';
					case 'E':
					case 'G':
					case 'Y': return '(' + match + '|' + '[0-9]{1,4}' + ')';
					default: exp_names.pop(); return '.+?';	
				}
			});
			
			adv = new RegExp('^' + adv + '$');
			exp_input = adv.exec(str);
			exp_format = adv.exec(w.__fmt());
			
			if ( exp_input === null || exp_input.length !== exp_format.length ) {
				if ( o.defaultValue !== false ) {
					switch ( typeof o.defaultValue ) {
						case 'object':
							if ( o.defaultValue.length === 3 ) {
								date =  w._pa(o.defaultValue,((o.mode === 'timebox' || o.mode === 'timeflipbox') ? date : false));
							} break;
						case 'number':
							date =  new w._date(o.defaultValue * 1000); break;
						case 'string':
							if ( o.mode === 'timebox' || o.mode === 'timeflipbox' ) {
								exp_temp = o.defaultValue.split(':');
								if ( exp_temp.length === 3 ) { date = w._pa([exp_temp[0],exp_temp[1],exp_temp[2]], date); }
								else if ( exp_temp.length === 2 ) { date = w._pa([exp_temp[0],exp_temp[1],0], date); }
							} else {
								exp_temp = o.defaultValue.split('-');
								if ( exp_temp.length === 3 ) { date = w._pa([exp_temp[0],exp_temp[1]-1,exp_temp[2]], false); }
							} break;
					}
				}
				if ( isNaN(date.getDate()) ) { date = new w._date(); }
			} else {
				for ( i=1; i<exp_input.length; i++ ) {
					switch ( exp_names[i-1] ) {
						case 's': return new w._date(parseInt(exp_input[i],10) * 1000);
						case 'Y':
						case 'G': d.year = parseInt(exp_input[i],10); break;
						case 'E': d.year = parseInt(exp_input[i],10) - 543; break;
						case 'y':
						case 'g':
							if ( o.afterToday === true || parseInt(exp_input[i],10) < 38 ) {
								d.year = parseInt('20' + exp_input[i],10);
							} else {
								d.year = parseInt('19' + exp_input[i],10);
							} break;
						case 'm': d.mont = parseInt(exp_input[i],10)-1; break;
						case 'd': d.date = parseInt(exp_input[i],10); break;
						case 'H':
						case 'k':
						case 'I':
						case 'l': d.hour = parseInt(exp_input[i],10); break;
						case 'M': d.mins = parseInt(exp_input[i],10); break;
						case 'S': d.secs = parseInt(exp_input[i],10); break;
						case 'u': d.wday = parseInt(exp_input[i],10)-1; break;
						case 'w': d.wday = parseInt(exp_input[i],10); break;
						case 'j': d.yday = parseInt(exp_input[i],10); break;
						case 'V': d.week = parseInt(exp_input[i],10); d.wtyp = 4; break;
						case 'U': d.week = parseInt(exp_input[i],10); d.wtyp = 0; break;
						case 'W': d.week = parseInt(exp_input[i],10); d.wtyp = 1; break;
						case 'p':
						case 'P': d.meri = (( exp_input[i].toLowerCase() === w.__('meridiem')[0].toLowerCase() )? -1:1); break;
						case 'b':
							exp_temp = $.inArray(exp_input[i], w.__('monthsOfYearShort'));
							if ( exp_temp > -1 ) { d.mont = exp_temp; }
							break;
						case 'B':
							exp_temp = $.inArray(exp_input[i], w.__('monthsOfYear'));
							if ( exp_temp > -1 ) { d.mont = exp_temp; }
							break;
					}
				}
				if ( d.meri !== 0 ) {
					if ( d.meri === -1 && d.hour === 12 ) { d.hour = 0; }
					if ( d.meri === 1 && d.hour !== 12 ) { d.hour = d.hour + 12; }
				}
				
				date = new w._date(w._n(d.year,0),w._n(d.mont,0),w._n(d.date,1),w._n(d.hour,0),w._n(d.mins,0),w._n(d.secs,0),0);
				
				if ( d.year < 100 && d.year !== -1 ) { date.setFullYear(d.year); }
				
				if ( ( d.mont > -1 && d.date > -1 ) || ( d.hour > -1 && d.mins > -1 && d.secs > -1 ) ) { return date; }
				
				if ( d.week !== false ) {
					date.setWeek(d.wtyp, d.week);
					if ( d.date > -1 ) { date.setDate(d.date); } 
				}
				if ( d.yday !== false ) { date.set(1,0).set(2,1).adj(2,(d.yday-1)); }
				if ( d.wday !== false ) { date.adj(2,(d.wday - date.getDay())); }
			}
			return date;
		},
		_customformat: {
			'default': function(oper, date) { return false; }
		},
		_formatter: function(format, date) {
			var w = this,
				o = this.options, tmp,
				dur = {
					part: [0,0,0,0], tp: 0
				};
				
				if ( o.mode === 'durationbox' || o.mode === 'durationflipbox' ) {
					dur.tp = this.theDate.getEpoch() - this.initDate.getEpoch();
					dur.part[0] = parseInt( dur.tp / (60*60*24),10); dur.tp -=(dur.part[0]*60*60*24); // Days
					dur.part[1] = parseInt( dur.tp / (60*60),10); dur.tp -= (dur.part[1]*60*60); // Hours
					dur.part[2] = parseInt( dur.tp / (60),10); dur.tp -= (dur.part[2]*60); // Minutes
					dur.part[3] = dur.tp; // Seconds
			
					if ( ! format.match(/%Dd/) ) { dur.part[1] += (dur.part[0]*24);}
					if ( ! format.match(/%Dl/) ) { dur.part[2] += (dur.part[1]*60);}
					if ( ! format.match(/%DM/) ) { dur.part[3] += (dur.part[2]*60);}
				}
				
			format = format.replace(/%(D|X|0|-)*([1-9a-zA-Z])/g, function(match, pad, oper) {
				if ( pad === 'X' ) {
					if ( typeof w._customformat[o.mode] !== 'undefined' ) { return w._customformat[o.mode](oper, date); }
					return match;
				}
				if ( pad === 'D' ) {
					switch ( oper ) {
						case 'd': return dur.part[0];
						case 'l': return w._zPad(dur.part[1]);
						case 'M': return w._zPad(dur.part[2]);
						case 'S': return w._zPad(dur.part[3]);
						case 'A': return ((dur.part[0] > 1)?w.__('durationDays')[1]:w.__('durationDays')[0]);
						default: return match;
					}
				}
				switch ( oper ) {
					case '%': // Literal %
						return '%';
					case 'a': // Short Day
						return w.__('daysOfWeekShort')[date.getDay()];
					case 'A': // Full Day of week
						return w.__('daysOfWeek')[date.getDay()];
					case 'b': // Short month
						return w.__('monthsOfYearShort')[date.getMonth()];
					case 'B': // Full month
						return w.__('monthsOfYear')[date.getMonth()];
					case 'C': // Century
						return date.getFullYear().toString().substr(0,2);
					case 'd': // Day of month
						return (( pad === '-' ) ? date.getDate() : w._zPad(date.getDate()));
					case 'H': // Hour (01..23)
					case 'k':
						return (( pad === '-' ) ? date.getHours() : w._zPad(date.getHours()));
					case 'I': // Hour (01..12)
					case 'l':
						return (( pad === '-' ) ? ((date.getHours() === 0 || date.getHours() === 12)?12:((date.getHours()<12)?date.getHours():(date.getHours()-12))) : w._zPad(((date.getHours() === 0 || date.getHours() === 12)?12:((date.getHours()<12)?date.getHours():date.getHours()-12))));
					case 'm': // Month
						return (( pad === '-' ) ? date.getMonth()+1 : w._zPad(date.getMonth()+1));
					case 'M': // Minutes
						return (( pad === '-' ) ? date.getMinutes() : w._zPad(date.getMinutes()));
					case 'p': // AM/PM (ucase)
						return ((date.getHours() < 12)?w.__('meridiem')[0].toUpperCase():w.__('meridiem')[1].toUpperCase());
					case 'P': // AM/PM (lcase)
						return ((date.getHours() < 12)?w.__('meridiem')[0].toLowerCase():w.__('meridiem')[1].toLowerCase());
					case 's': // Unix Seconds
						return date.getEpoch();
					case 'S': // Seconds
						return (( pad === '-' ) ? date.getSeconds() : w._zPad(date.getSeconds()));
					case 'u': // Day of week (1-7)
						return (( pad === '-' ) ? date.getDay() + 1 : w._zPad(date.getDay() + 1));
					case 'w': // Day of week
						return date.getDay();
					case 'y': // Year (2 digit)
						return date.getFullYear().toString().substr(2,2);
					case 'Y': // Year (4 digit)
						return date.getFullYear();
					case 'E': // BE (Buddist Era, 4 Digit)
						return date.getFullYear() + 543;
					case 'V':
						return (( pad === '-' ) ? date.getWeek(4) : w._zPad(date.getWeek(4)));
					case 'U':
						return (( pad === '-' ) ? date.getWeek(0) : w._zPad(date.getWeek(0)));
					case 'W':
						return (( pad === '-' ) ? date.getWeek(1) : w._zPad(date.getWeek(1)));
					case 'o': // Ordinals
						if ( typeof w._ord[o.useLang] !== 'undefined' ) { return w._ord[o.useLang](date.getDate()); }
						return w._ord['default'](date.getDate());
					case 'j':
						tmp = new Date(date.getFullYear(),0,1);
						tmp = Math.ceil((date - tmp) / 86400000)+1;
						return (( tmp < 100 ) ? (( tmp < 10 )? '00' : '0') : '' ) + String(tmp);
					case 'G':
						if ( date.getWeek(4) === 1 && date.getMonth() > 0 ) { return date.getFullYear() + 1; } 
						if ( date.getWeek(4) > 51 && date.getMonth() < 11 ) { return date.getFullYear() - 1; }
						return date.getFullYear();
					case 'g':
						if ( date.getWeek(4) === 1 && date.getMonth() > 0 ) { return parseInt(date.getFullYear().toString().substr(2,2),10) + 1; }
						if ( date.getWeek(4) > 51 && date.getMonth() < 11 ) { return parseInt(date.getFullYear().toString().substr(2,2),10) - 1; }
						return date.getFullYear().toString().substr(2,2);
					default:
						return match;
				}
			});
		
			if ( w.__('useArabicIndic') === true ) {
				format = w._dRep(format);
			}
		
			return format;
		},
		_btwn: function(value, low, high) {
			return ( value > low && value < high );
		},
		_minStepFix: function() {
			var tempMin = this.theDate.get(4), tmp,
				w = this,
				o = this.options;
				
			if ( o.minuteStep > 1 && tempMin % o.minuteStep > 0 ) {
				if ( o.minuteStepRound < 0 ) {
					tempMin = tempMin - (tempMin % o.minuteStep);
				} else if ( o.minStepRound > 0 ) {
					tempMin = tempMin + ( o.minuteStep - ( tempMin % o.minuteStep ) );
				} else {
					if ( tempMin % o.minuteStep < o.minuteStep / 2 ) {
						tempMin = tempMin - (tempMin % o.minuteStep);
					} else {
						tempMin = tempMin + ( o.minuteStep - ( tempMin % o.minuteStep ) );
					}
				}
			w.theDate.setMinutes(tempMin);
			}
		},
		_offset: function(mode, amount, update) {
			// Compute a date/time offset.
			//   update = false to prevent controls refresh
			var w = this,
				o = this.options,
				ok = false;
				
			mode = (mode || "").toLowerCase();
				
			if ( typeof(update) === "undefined" ) { update = true; }
			w.d.input.trigger('datebox', {'method':'offset', 'type':mode, 'amount':amount});
			
			if ( mode !== 'a' && ( typeof o.rolloverMode[mode] === 'undefined' || o.rolloverMode[mode] === true )) {
				ok = $.inArray(mode, ['y','m','d','h','i','s']);
			} else {
				switch(mode) {
					case 'y': ok = 0; break;
					case 'm':
						if ( w._btwn(w.theDate.getMonth()+amount,-1,12) ) { ok = 1; }
						break;
					case 'd':
						if ( w._btwn(w.theDate.getDate() + amount,0,(32 - w.theDate.copy([0],[0,0,32,13]).getDate() + 1) )) { ok = 2; }
						break;
					case 'h':
						if ( w._btwn(w.theDate.getHours() + amount,-1,24) ) { ok = 3; }
						break;
					case 'i':
						if ( w._btwn(w.theDate.getMinutes() + amount,-1,60) ) { ok = 4; }
						break;
					case 's':
						if ( w._btwn(w.theDate.getSeconds() + amount,-1,60) ) { ok = 5; }
						break;
					case 'a':
						w._offset('h',((amount>0)?1:-1)*12,false);
						break;
				}
			}
			if ( ok !== false ) { w.theDate.adj(ok,amount); }
			if ( update === true ) { w.refresh(); }
			if ( o.useImmediate ) { w.d.input.trigger('datebox', {'method':'doset'}); }
		},
		_startOffset: function(date) {
			var o = this.options;
			
			if ( o.startOffsetYears !== false ) {
				date.adj(0, o.startOffsetYears);
			}
			if ( o.startOffsetMonths !== false ) {
				date.adj(1, o.startOffsetMonths);
			}
			if ( o.startOffsetDays !== false ) {
				date.adj(2, o.startOffsetDays);
			}
			return date;
		},
		_create: function() {
			// Create the widget, called automatically by widget system
			$( document ).trigger( "dateboxcreate" );
		
			var w = this,
				o = $.extend(this.options, (typeof this.element.jqmData('options') !== 'undefined') ? this.element.jqmData('options') : this._getLongOptions(this.element) ),
				thisTheme = ( o.theme === false && typeof($(this).jqmData('theme')) === 'undefined' ) ?
					( ( typeof(this.element.parentsUntil(':jqmData(theme)').parent().jqmData('theme')) === 'undefined' ) ?
						o.themeDefault : this.element.parentsUntil(':jqmData(theme)').parent().jqmData('theme') )
					: o.theme,
				trans = o.useAnimation ? o.transition : 'none',
				d = o.useNewStyle === false ? {
					input: this.element,
					wrap: this.element.wrap('<div class="ui-input-datebox ui-shadow-inset ui-corner-all '+ (this.element.jqmData("mini") === true ? 'ui-mini ':'') +'ui-body-'+ thisTheme +'"></div>').parent(),
					mainWrap: $("<div>", { "class": 'ui-datebox-container ui-overlay-shadow ui-corner-all ui-datebox-hidden '+trans+' ui-body-'+thisTheme} ).css('zIndex', o.zindex),
					intHTML: false
				} : {
					input: this.element,
					wrap: this.element,
					mainWrap: $("<div>", { "class": 'ui-datebox-container ui-overlay-shadow ui-corner-all ui-datebox-hidden '+trans+' ui-body-'+thisTheme} ).css('zIndex', o.zindex),
					intHTML: false
				},
				touch = ( typeof window.ontouchstart !== 'undefined' ),
				drag = {
					eStart : (touch ? 'touchstart' : 'mousedown')+'.datebox',
					eMove  : (touch ? 'touchmove' : 'mousemove')+'.datebox',
					eEnd   : (touch ? 'touchend' : 'mouseup')+'.datebox',
					eEndA  : (touch ? 'mouseup.datebox touchend.datebox touchcancel.datebox touchmove.datebox' : 'mouseup.datebox'),
					move   : false,
					start  : false,
					end    : false,
					pos    : false,
					target : false,
					delta  : false,
					tmp    : false
				},
				calc = { },
				ns = (typeof $.mobile.ns !== 'undefined')?$.mobile.ns:'';
				
			$.extend(w, {d: d, ns: ns, drag: drag, touch:touch});
			
			if ( o.usePlaceholder !== false ) {
				if ( o.usePlaceholder === true && w._grabLabel() !== false ) { w.d.input.attr('placeholder', w._grabLabel()); }
				if ( typeof o.usePlaceholder === 'string' ) { w.d.input.attr('placeholder', o.usePlaceholder); }
			}
			
			o.theme = thisTheme;
			
			w.clearFunc = false;
			w.disabled = false;
			w.runButton = false;
			w._date = window.Date;
			w._enhanceDate();
			w.baseID = w.d.input.attr('id');
			
			w.initDate = new w._date();
			w.theDate = (o.defaultValue) ? w._makeDate(o.defaultValue) : new w._date();
			w.initDone = false;
			
			if ( o.useButton === true && o.useInline === false && o.useNewStyle === false ) {
				w.d.open = $('<a href="#" class="ui-input-clear" title="'+this.__('tooltip')+'">'+this.__('tooltip')+'</a>')
					.on(o.clickEvent, function(e) {
						e.preventDefault();
						if ( !w.disabled ) { w.d.input.trigger('datebox', {'method': 'open'}); w.d.wrap.addClass('ui-focus'); w.d.input.parent().removeClass('ui-focus'); }
						setTimeout( function() { $(e.target).closest('a').removeClass($.mobile.activeBtnClass); }, 300);
					}).appendTo(w.d.wrap).buttonMarkup({icon: 'grid', iconpos: 'notext', corners:true, shadow:true})
					.css({'vertical-align': 'middle', 'display': 'inline-block'});
			}
			
			w.d.screen = $("<div>", {'class':'ui-datebox-screen ui-datebox-hidden'+((o.useModal)?' ui-datebox-screen-modal':'')})
				.css({'z-index': o.zindex-1})
				.on(o.clickEventAlt, function(e) {
					e.preventDefault();
					w.d.input.trigger('datebox', {'method':'close'});
				});
			
			if ( o.enhanceInput === true && navigator.userAgent.match(/Android/i) ){
				w.inputType = 'number';
			} else {
				w.inputType = 'text';
			}
			
			if ( o.hideInput ) { w.d.wrap.hide(); }
		
			$('label[for=\''+w.d.input.attr('id')+'\']').addClass('ui-input-text').css('verticalAlign', 'middle');

			w.d.wrap.on(o.clickEvent, function() {
				if ( !w.disabled && ( o.noButtonFocusMode || o.focusMode ) ) { 
					w.d.input.trigger('datebox', {'method': 'open'});
					w.d.wrap.addClass('ui-focus');
					w.d.input.removeClass('ui-focus');
				}
			});
		
			w.d.input
				.removeClass('ui-corner-all ui-shadow-inset')
				.bind(w.touch?'touchend':'click', function(e){
					if ( w.disabled === false && o.useNewStyle === true && o.useFocus === false ) {
						if ( ((w.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX) - e.target.offsetLeft) > (e.target.offsetWidth - 20) ) {
							w.d.input.trigger('datebox', {'method': 'open'}); w.d.wrap.addClass('ui-focus'); w.d.input.removeClass('ui-focus');
						}
					}
				})
				.focus(function(){
					if ( w.disabled === false && o.useFocus === true ) {
						w.d.input.trigger('datebox', {'method': 'open'}); w.d.wrap.addClass('ui-focus');
					} 
					if ( o.useNewStyle === false ) { w.d.input.removeClass('ui-focus'); }
				})
				.blur(function(){
					w.d.wrap.removeClass('ui-focus');
					w.d.input.removeClass('ui-focus');
				})
				.change(function() {
					w.theDate = w._makeDate(w.d.input.val());
					w.refresh();
				})
				.attr("readonly", o.lockInput)
				.on('datebox', w._event);
			
			if ( o.useNewStyle === true ) {
				w.d.input.addClass('ui-corner-all '+((o.useAltIcon===true)?'ui-icon-datebox-alt':'ui-icon-datebox'));
				if ( o.overrideStyleClass !== false ) { w.d.input.addClass(o.overrideStyleClass); }
			} else {
				w.d.input.parent().css('border', 'none').removeClass('ui-shadow-inset');
			}
			
			// Check if mousewheel plugin is loaded
			if ( typeof $.event.special.mousewheel !== 'undefined' ) { w.wheelExists = true; }
		
			// Disable when done if element attribute disabled is true.
			if ( w.d.input.is(':disabled') ) {
				w.disable();
			}
			
			if ( o.useInline === true || o.useInlineBlind ) { w.open(); }
			
			w.applyMinMax(false, false);
			
			//Throw dateboxinit event
			$( document ).trigger( "dateboxaftercreate" );
		},
		applyMinMax: function(refresh, override) {
			var w = this,
					o = this.options,
					calc = {};
					
			if ( typeof refresh === 'undefined' ) { refresh = false; }
			if ( typeof override === 'undefined' ) { override = true; }
			
			if ( ( override === true || o.minDays === false ) && typeof(w.d.input.attr('min')) !== 'undefined' ) {
				calc.today  = new w._date();
				calc.lod    = 24 * 60 * 60 * 1000;
				calc.todayc = new w._date(calc.today.getFullYear(), calc.today.getMonth(), calc.today.getDate(), 0,0,0,0);
				calc.fromel = w.d.input.attr('min').split('-');
				calc.compdt  = new w._date(calc.fromel[0],calc.fromel[1]-1,calc.fromel[2],0,0,0,0);
				o.minDays = parseInt((((calc.compdt.getTime() - calc.todayc.getTime()) / calc.lod))*-1,10);
			}
			if ( ( override === true || o.maxDays === false ) && typeof(w.d.input.attr('max')) !== 'undefined' ) {
				calc.today  = new w._date();
				calc.lod    = 24 * 60 * 60 * 1000;
				calc.todayc = new w._date(calc.today.getFullYear(), calc.today.getMonth(), calc.today.getDate(), 0,0,0,0);
				calc.fromel = w.d.input.attr('max').split('-');
				calc.compdt  = new w._date(calc.fromel[0],calc.fromel[1]-1,calc.fromel[2],0,0,0,0);
				o.maxDays = parseInt((((calc.compdt.getTime() - calc.todayc.getTime()) / calc.lod)),10);
			}
			
			if ( refresh === true ) { w.refresh(); }
		},
		_build: {
			'default': function () {
				this.d.headerText = "Error";
				this.d.intHTML = $("<div class='ui-body-e'><h2 style='text-align:center'>There is no mode by that name loaded / mode not given</h2></div>");
			}
		},
		_applyCoords: function(e) {
			var w = e.widget,
				o = e.widget.options,
				fixd = {
					h: $.mobile.activePage.find('.ui-header').jqmData('position'),
					f: $.mobile.activePage.find('.ui-footer').jqmData('position'),
					fh: $.mobile.activePage.find('.ui-footer').outerHeight(),
					hh: $.mobile.activePage.find('.ui-header').outerHeight()
				},
				iput = {
					x: w.d.wrap.offset().left + (w.d.wrap.outerWidth() / 2),
					y: w.d.wrap.offset().top + (w.d.wrap.outerHeight() / 2)
				},
				size = {
					w: w.d.mainWrap.outerWidth(),
					h: w.d.mainWrap.outerHeight()
				},
				doc = {
					t: $(window).scrollTop(),
					h: $(window).height(),
					w: $.mobile.activePage.width(),
					ah: $(document).height()
				},
				pos = {
					y: (o.centerVert) ? doc.t + ((doc.h / 2) - (size.h / 2)) : iput.y  - ( size.h / 2 ),
					x: (doc.w < 400 || o.centerHoriz ) ? (doc.w / 2) - (size.w /2) : iput.x  - (size.w / 2)
				};
				
			if ( o.centerVert === false ) {
				if ( o.hideFixedToolbars === true && ( typeof fixd.f !== 'undefined' || typeof fixd.h !== 'undefined' )) {
					$.mobile.activePage.find(":jqmData(position='fixed')").fixedtoolbar('hide');
					fixd.f = undefined;
					fixd.h = undefined;
				}
				
				if ( typeof fixd.f !== 'undefined' ) {
					if ( ( pos.y + size.h ) > ( doc.h - fixd.fh - 2 ) ) {
						pos.y = doc.h - fixd.fh - 2 - size.h;
					}
				} else {
					if ( ( pos.y + size.h ) > ( doc.ah - fixd.fh - 2 ) ) {
						pos.y = doc.ah - fixd.fh - 2 - size.h;
					}
					if ( ( doc.h + doc.t ) < ( size.h + pos.y + 2 ) ) {
						pos.y = doc.h + doc.t - size.h - 2;
					}
				}
				
				if ( typeof fixd.h !== 'undefined' ) {
					if ( ( doc.t + fixd.hh + 2 ) > pos.y ) {
						pos.y = doc.t + fixd.hh + 2;
					}
				} else {
					if ( fixd.hh + 2 > pos.y ) {
						pos.y = fixd.hh + 2;
					}
					if ( pos.y < doc.t + 2 ) {
						pos.y = doc.t + 2;
					}
				}
			}
			w.d.mainWrap.css({'position': 'absolute', 'top': pos.y, 'left': pos.x});
		},
		_drag: {
			'default': function () { return false; }
		},
		open: function () {
			var w = this,
				o = this.options, 
				popopts = {},
				basepop = {'history':false},
				qns = 'data-'+this.ns,
				trans = o.useAnimation ? o.transition : 'none';
			
			if ( o.useFocus === true && w.fastReopen === true ) { w.d.input.blur(); return false; }
			if ( w.clearFunc !== false ) {
				clearTimeout(w.clearFunc); w.clearFunc = false;
			}
			
			// Call the open callback if provided. Additionally, if this
			// returns false then the open/update will stop.
			if ( o.openCallback !== false ) {
				if ( ! $.isFunction(o.openCallback) ) {
					if ( typeof window[o.openCallback] !== 'undefined' ) {
						o.openCallback = window[o.openCallback];
					} else {
						o.openCallback = new Function(o.openCallback);
					}
				}
				if ( o.openCallback.apply(w, $.merge([w.theDate],o.openCallbackArgs)) === false ) { return false; }
			}
				
			w.theDate = w._makeDate(w.d.input.val());
			if ( w.d.input.val() === "" ) { w._startOffset(w.theDate); }
			w.d.input.blur();
			
			if ( typeof w._build[o.mode] === 'undefined' ) {
				w._build['default'].apply(w,[]);
			} else {
				w._build[o.mode].apply(w,[]);
			}
			if ( typeof w._drag[o.mode] !== 'undefined' ) {
				w._drag[o.mode].apply(w, []);
			}
			w.d.input.trigger('datebox', {'method':'refresh'});
			if ( w.__('useArabicIndic') === true ) { w._doIndic(); }
			
			if ( ( o.useInline === true || o.useInlineBlind === true ) && w.initDone === false ) {
				w.d.mainWrap.append(w.d.intHTML);
				w.d.input.parent().parent().append(w.d.mainWrap);
				w.d.mainWrap.removeClass('ui-datebox-hidden');
				if ( o.useInline === true ) {
					w.d.mainWrap.addClass('ui-datebox-inline');
				} else {
					w.d.mainWrap.addClass('ui-datebox-inlineblind');
					w.d.mainWrap.hide();
				}
				w.initDone = false;
				w.d.input.trigger('datebox',{'method':'postrefresh'});
			}
			
			if ( o.useImmediate ) { w.d.input.trigger('datebox', {'method':'doset'}); }
			if ( o.useInline ) { return true; }
			if ( o.useInlineBlind ) { 
				if ( w.initDone ) { w.d.mainWrap.slideDown();  }
				else { w.initDone = true; }
				return true;
			}
			if ( w.d.intHTML.is(':visible') ) { return false; } // Ignore if already open
				
			if ( o.enablePopup === true ) {
				w.d.dialogPage = false;
				w.d.mainWrap.empty();
				if ( o.useHeader === true ) {
					w.d.headHTML = $('<div class="ui-header ui-bar-'+o.themeHeader+'"></div>');
					$("<a class='ui-btn-left' href='#'>Close</a>").appendTo(w.d.headHTML)
						.buttonMarkup({ theme  : o.themeHeader, icon   : 'delete', iconpos: 'notext', corners: true, shadow : true })
						.on(o.clickEventAlt, function(e) { e.preventDefault(); w.d.input.trigger('datebox', {'method':'close'}); });
					$('<h1 class="ui-title">'+w.d.headerText+'</h1>').appendTo(w.d.headHTML);
					w.d.mainWrap.append(w.d.headHTML);
				}
				w.d.mainWrap.append(w.d.intHTML).css('zIndex', o.zindex);
				w.d.input.trigger('datebox',{'method':'postrefresh'});
				
				if ( o.useAnimation === true ) {
					popopts.transition = o.transition;
				} else {
					popopts.transition = "none";
				}
				
				if ( o.popupForceX !== false && o.popupForceY !== false ) {
					popopts.x = o.popupForceX;
					popopts.y = o.popupForceY;
				}
				
				if ( o.popupPosition !== false ) {
					popopts.positionTo = o.popupPosition;
				} else {
					if ( typeof w.baseID !== undefined ) {
						popopts.positionTo = '#' + w.baseID;
					} else {
						popopts.positionTo = 'window';
					}
				}
				
				if ( o.useModal = true ) { basepop.overlayTheme = "a"; }
				
				w.d.mainWrap.removeClass('ui-datebox-hidden').popup(basepop).popup("open", popopts);
				w.refresh();
			} else {
				if ( o.dialogForce || ( o.dialogEnable && window.width() < 400 ) ) {
					w.d.dialogPage = $("<div "+qns+"role='dialog' "+qns+"theme='"+o.theme+"' >" +
						"<div "+qns+"role='header' "+qns+"theme='"+o.themeHeader+"'>" +
						"<h1>"+w.d.headerText+"</h1></div><div "+qns+"role='content'></div>")
						.appendTo( $.mobile.pageContainer )
						.page().css('minHeight', '0px').addClass(trans);
					w.d.dialogPage.find('.ui-header').find('a').off('click vclick').on(o.clickEventAlt, function(e) { e.preventDefault(); w.d.input.trigger('datebox', {'method':'close'}); });
					w.d.mainWrap.append(w.d.intHTML).css({'marginLeft':'auto', 'marginRight':'auto'}).removeClass('ui-datebox-hidden');
					w.d.dialogPage.find('.ui-content').append(w.d.mainWrap);
					w.d.input.trigger('datebox',{'method':'postrefresh'});
					$.mobile.activePage.off( "pagehide.remove" );
					$.mobile.changePage(w.d.dialogPage, {'transition': trans});
				} else {
					w.d.dialogPage = false;
					w.d.mainWrap.empty();
					if ( o.useHeader === true ) {
						w.d.headHTML = $('<div class="ui-header ui-bar-'+o.themeHeader+'"></div>');
						$("<a class='ui-btn-left' href='#'>Close</a>").appendTo(w.d.headHTML)
							.buttonMarkup({ theme  : o.themeHeader, icon   : 'delete', iconpos: 'notext', corners: true, shadow : true })
							.on(o.clickEventAlt, function(e) { e.preventDefault(); w.d.input.trigger('datebox', {'method':'close'}); });
						$('<h1 class="ui-title">'+w.d.headerText+'</h1>').appendTo(w.d.headHTML);
						w.d.mainWrap.append(w.d.headHTML);
					}
					w.d.mainWrap.append(w.d.intHTML).css('zIndex', o.zindex);
					w.d.mainWrap.appendTo($.mobile.activePage);
					w.d.screen.appendTo($.mobile.activePage);
					w.d.input.trigger('datebox',{'method':'postrefresh'});
					w._applyCoords({widget:w});
					
					if ( o.useModal === true ) { 
						if(o.useAnimation) {
							w.d.screen.fadeIn('slow');
						} else {
							w.d.screen.show();
						}
					} else {
						setTimeout(function () { w.d.screen.removeClass('ui-datebox-hidden');}, 500);
					}
					
					w.d.mainWrap.addClass('ui-overlay-shadow in').removeClass('ui-datebox-hidden');
					
					$(document).on('orientationchange.datebox', {widget:w}, function(e) { w._applyCoords(e.data); });
					if ( o.resizeListener === true ) {
						$(window).on('resize.datebox', {widget:w}, function (e) { w._applyCoords(e.data); });
					}
				}
			}
		},
		close: function() {
			var w = this,
				o = this.options;
			
			if ( o.useInlineBlind === true ) { w.d.mainWrap.slideUp(); return true;}
			if ( o.useInline === true || w.d.intHTML === false ) { return true; }

			if ( w.d.dialogPage !== false ) {
				$(w.d.dialogPage).dialog('close');
				
				if ( ! $.mobile.activePage.jqmData('page').options.domCache ) {
					$.mobile.activePage.on('pagehide.remove', function () { $(this).remove(); });
				}
				
				w.d.intHTML.detach().empty();
				w.d.mainWrap.detach().empty();
				w.d.wrap.removeClass('ui-focus');
				w.clearFunc = setTimeout(function () { w.d.dialogPage.empty().remove(); w.clearFunc = false; }, 1500);
			} else {
				if ( o.enablePopup === true ) {
					w.d.mainWrap.popup('close');
					w.d.wrap.removeClass('ui-focus');
				} else {
					if ( o.useModal ) {
						if(o.useAnimation) {
							w.d.screen.fadeOut('slow');
						} else {
							w.d.screen.hide();
						}
					} else {
						w.d.screen.addClass('ui-datebox-hidden');
					}
					w.d.screen.detach();
					w.d.mainWrap.addClass('ui-datebox-hidden').removeAttr('style').removeClass('in ui-overlay-shadow').empty().detach();
					w.d.intHTML.detach();
					w.d.wrap.removeClass('ui-focus');
					
					$(document).off('orientationchange.datebox');
					if ( o.resizeListener === true ) {
						$(window).off('resize.datebox');
					}
				}
			}
					
			$(document).off(w.drag.eMove);
			$(document).off(w.drag.eEnd);
			$(document).off(w.drag.eEndA);
			
			if ( o.useFocus ) { 
				w.fastReopen = true;
				setTimeout(function(t) { return function () { t.fastReopen = false; };}(w), 300);
			}
			
			if ( o.closeCallback !== false ) {
				if ( ! $.isFunction(o.closeCallback) ) {
					if ( typeof window[o.closeCallback] !== 'undefined' ) {
						o.closeCallback = window[o.closeCallback];
					} else {
						o.closeCallback = new Function(o.closeCallback);
					}
				}
				o.closeCallback.apply(w, $.merge([w.theDate], o.closeCallbackArgs));
			}
		},
		refresh: function() {
			if ( typeof this._build[this.options.mode] === 'undefined' ) {
				this._build['default'].apply(this,[]);
			} else {
				this._build[this.options.mode].apply(this,[]);
			}
			if ( this.__('useArabicIndic') === true ) { this._doIndic(); }
			this.d.mainWrap.append(this.d.intHTML);
			this.d.input.trigger('datebox',{'method':'postrefresh'});
		},
		_check: function() {
			var w = this,
				td = null, 
				o = this.options;
			
			w.dateOK = true;
			
			if ( o.afterToday !== false ) {
				td = new w._date();
				if ( w.theDate < td ) { w.theDate = td; }
			}
			if ( o.beforeToday !== false ) {
				td = new w._date();
				if ( w.theDate > td ) { w.theDate = td; }
			}
			if ( o.maxDays !== false ) {
				td = new w._date();
				td.adj(2, o.maxDays);
				if ( w.theDate > td ) { w.theDate = td; }
			}
			if ( o.minDays !== false ) {
				td = new w._date();
				td.adj(2, -1*o.minDays);
				if ( w.theDate < td ) { w.theDate = td; }
			}
			if ( o.minHour !== false ) {
				if ( w.theDate.getHours() < o.minHour ) {
					w.theDate.setHours(o.minHour);
				}
			}
			if ( o.maxHour !== false ) {
				if ( w.theDate.getHours() > o.maxHour ) {
					w.theDate.setHours(o.maxHour);
				}
			}
			if ( o.maxYear !== false ) {
				td = new w._date(o.maxYear, 0, 1);
				td.adj(2, -1);
				if ( w.theDate > td ) { w.theDate = td; }
			}
			if ( o.minYear !== false ) {
				td = new w._date(o.minYear, 0, 1);
				if ( w.theDate < td ) { w.theDate = td; }
			}
			
			if ( $.inArray(o.mode, ['timebox','durationbox','durationflipbox','timeflipbox']) > -1 ) { 
				if ( o.mode === 'timeflipbox' && o.validHours !== false ) {
					if ( $.inArray(w.theDate.getHours(), o.validHours) < 0 ) { w.dateOK = false; }
				}
			} else {
				if ( o.blackDatesRec !== false ) {
					for ( i=0; i<o.blackDatesRec.length; i++ ) {
						if ( 
							( o.blackDatesRec[i][0] === -1 || o.blackDatesRec[i][0] === year ) &&
							( o.blackDatesRec[i][1] === -1 || o.blackDatesRec[i][1] === month ) &&
							( o.blackDatesRec[i][2] === -1 || o.blackDatesRec[i][2] === date )
						) { w.dateOK = false; } 
					}
				}	
				if ( o.blackDates !== false ) {
					if ( $.inArray(w.theDate.iso(), o.blackDates) > -1 ) { w.dateOK = false; }
				}
				if ( o.blackDays !== false ) {
					if ( $.inArray(w.theDate.getDay(), o.blackDays) > -1 ) { w.dateOK = false; }
				}
			}
		},
		_grabLabel: function() {
			var w = this,
				o = this.options;
				
			if ( typeof o.overrideDialogLabel === 'undefined' ) {
				if ( typeof w.d.input.attr('placeholder') !== 'undefined' ) { return w.d.input.attr('placeholder'); }
				if ( typeof w.d.input.attr('title') !== 'undefined' ) { return w.d.input.attr('title'); }
				if ( w.d.wrap.parent().find('label[for=\''+w.d.input.attr('id')+'\']').text() !== '' ) {
					return w.d.wrap.parent().find('label[for=\''+w.d.input.attr('id')+'\']').text();
				}
				return false;
			}
			return o.overrideDialogLabel;
		},
		_makeEl: function(source, parts) {
			var part = false,
				retty = false;
			
			retty = source.clone();
			
			if ( typeof parts.attr !== 'undefined' ) {
				for ( part in parts.attr ) {
					if ( parts.attr.hasOwnProperty(part) ) {
						retty.jqmData(part, parts.attr[part]);
					}
				}
			}
			return retty;
		},
		_getLongOptions: function(element) {
			var key, retty = {}, prefix, temp;
			
			if ( $.mobile.ns === "" ) { 
				prefix = "datebox";
			} else { 
				prefix = $.mobile.ns.substr(0, $.mobile.ns.length - 1) + 'Datebox';
			}
			
			for ( key in element.data() ) {
				if ( key.substr(0, prefix.length) === prefix && key.length > prefix.length ) {
					temp = key.substr(prefix.length);
					temp = temp.charAt(0).toLowerCase() + temp.slice(1);
					retty[temp] = element.data(key);
				}
			}
			return retty;
		},
		disable: function(){
			// Disable the element
			this.d.input.attr("disabled",true);
			this.d.wrap.addClass("ui-disabled").blur();
			this.disabled = true;
			this.d.input.trigger('datebox', {'method':'disable'});
		},
		enable: function(){
			// Enable the element
			this.d.input.attr("disabled", false);
			this.d.wrap.removeClass("ui-disabled");
			this.disabled = false;
			this.d.input.trigger('datebox', {'method':'enable'});
		},
		_setOption: function() {
			$.Widget.prototype._setOption.apply( this, arguments );
			this.refresh();
		},
		getTheDate: function() {
			return this.theDate;
		},
		getLastDur: function() {
			return this.lastDuration;
		},
		setTheDate: function(newDate) {
			this.theDate = newDate;
			this.refresh();
		},
		callFormat: function(format, date) {
			return this._formatter(format, date);
		}
	});
	  
	// Degrade date inputs to text inputs, suppress standard UI functions.
	$( document ).on( "pagebeforecreate", function( e ) {
		$( ":jqmData(role='datebox')", e.target ).each(function() {
			$(this).prop('type', 'text');
		});
	});
	// Automatically bind to data-role='datebox' items.
	$( document ).on( "pagecreate create", function( e ){
		$( document ).trigger( "dateboxbeforecreate" );
		$( ":jqmData(role='datebox')", e.target ).each(function() {
			//var defed = parseInt($.mobile.version.replace(/\./g,''),10) > 111 ? typeof($(this).data('mobileDatebox')) : typeof($(this).data('datebox'));
			var defed = typeof (parseInt($.mobile.version.replace(/\./g,''),10) > 111 ? parseInt($().jquery.replace(/\./g,''),10) >= 200 ? $(this).data('mobile-datebox') : $(this).data('mobileDatebox') : $(this).data('datebox'));
			if ( defed === "undefined" ) {
				$(this).datebox();
			}
		});
	});
})( jQuery );
/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-datebox
 * calbox
 */
(function(a){a.extend(a.mobile.datebox.prototype.options,{themeDateToday:"a",themeDayHigh:"e",themeDatePick:"a",themeDateHigh:"e",themeDateHighAlt:"e",themeDateHighRec:"e",themeDate:"d",calHighToday:true,calHighPick:true,calShowDays:true,calOnlyMonth:false,calWeekMode:false,calWeekModeDay:1,calWeekHigh:false,calControlGroup:false,calShowWeek:false,calUsePickers:false,calNoHeader:false,useTodayButton:false,useCollapsedBut:false,highDays:false,highDates:false,highDatesRec:false,highDatesAlt:false,enableDates:false,calDateList:false,calShowDateList:false});a.extend(a.mobile.datebox.prototype,{_cal_gen:function(d,f,l,i,h){var b=0,e=0,k=1,g=1,c=[],m=[],j=false;for(b=0;b<=5;b++){if(j===false){m=[];for(e=0;e<=6;e++){if(b===0&&e<d){if(i===true){m.push([f+(e-d)+1,h-1])}else{m.push(false)}}else{if(b>3&&k>l){if(i===true){m.push([g,h+1]);g++}else{m.push(false)}j=true}else{m.push([k,h]);k++;if(k>l){j=true}}}}c.push(m)}}return c},_cal_check:function(b,h,f,d){var k=this,e,c=this.options,g={},j=new this._date(h,f,d,0,0,0,0).getDay();g.ok=true;g.iso=h+"-"+k._zPad(f+1)+"-"+k._zPad(d);g.comp=parseInt(g.iso.replace(/-/g,""),10);g.theme=c.themeDate;g.recok=true;g.rectheme=false;if(c.blackDatesRec!==false){for(e=0;e<c.blackDatesRec.length;e++){if((c.blackDatesRec[e][0]===-1||c.blackDatesRec[e][0]===h)&&(c.blackDatesRec[e][1]===-1||c.blackDatesRec[e][1]===f)&&(c.blackDatesRec[e][2]===-1||c.blackDatesRec[e][2]===d)){g.recok=false}}}if(a.isArray(c.enableDates)&&a.inArray(g.iso,c.enableDates)<0){g.ok=false}else{if(b.checkDates){if((g.recok!==true)||(c.afterToday===true&&b.thisDate.comp()>g.comp)||(c.beforeToday===true&&b.thisDate.comp()<g.comp)||(c.notToday===true&&b.thisDate.comp()===g.comp)||(c.maxDays!==false&&b.maxDate.comp()<g.comp)||(c.minDays!==false&&b.minDate.comp()>g.comp)||(a.isArray(c.blackDays)&&a.inArray(j,c.blackDays)>-1)||(a.isArray(c.blackDates)&&a.inArray(g.iso,c.blackDates)>-1)){g.ok=false}}}if(g.ok){if(c.highDatesRec!==false){for(e=0;e<c.highDatesRec.length;e++){if((c.highDatesRec[e][0]===-1||c.highDatesRec[e][0]===h)&&(c.highDatesRec[e][1]===-1||c.highDatesRec[e][1]===f)&&(c.highDatesRec[e][2]===-1||c.highDatesRec[e][2]===d)){g.rectheme=true}}}if(c.calHighPick&&d===b.presetDay&&(k.d.input.val()!==""|c.defaultValue!==false)){g.theme=c.themeDatePick}else{if(c.calHighToday&&g.comp===b.thisDate.comp()){g.theme=c.themeDateToday}else{if(a.isArray(c.highDatesAlt)&&(a.inArray(g.iso,c.highDatesAlt)>-1)){g.theme=c.themeDateHighAlt}else{if(a.isArray(c.highDates)&&(a.inArray(g.iso,c.highDates)>-1)){g.theme=c.themeDateHigh}else{if(a.isArray(c.highDays)&&(a.inArray(j,c.highDays)>-1)){g.theme=c.themeDayHigh}else{if(a.isArray(c.highDatesRec)&&g.rectheme===true){g.theme=c.themeDateHighRec}}}}}}}return g}});a.extend(a.mobile.datebox.prototype._build,{calbox:function(){var j=this,c=this.options,e,b=false,f="ui-datebox-",l=false,n=false,d=false,k=false,h=false;if(typeof j.d.intHTML!=="boolean"){j.d.intHTML.remove()}j.d.headerText=((j._grabLabel()!==false)?j._grabLabel():j.__("titleDateDialogLabel"));j.d.intHTML=a("<span>");a('<div class="'+f+'gridheader"><div class="'+f+'gridlabel"><h4>'+j.__("monthsOfYear")[j.theDate.getMonth()]+" "+j.theDate.getFullYear()+"</h4></div></div>").appendTo(j.d.intHTML);a("<div class='"+f+"gridplus"+(j.__("isRTL")?"-rtl":"")+"'><a href='#'>"+j.__("nextMonth")+"</a></div>").prependTo(j.d.intHTML.find("."+f+"gridheader")).buttonMarkup({theme:c.themeDate,icon:"arrow-r",inline:true,iconpos:"notext",corners:true,shadow:true}).on(c.clickEventAlt,function(i){i.preventDefault();if(j.calNext){if(j.theDate.getDate()>28){j.theDate.setDate(1)}j._offset("m",1)}});a("<div class='"+f+"gridminus"+(j.__("isRTL")?"-rtl":"")+"'><a href='#'>"+j.__("prevMonth")+"</a></div>").prependTo(j.d.intHTML.find("."+f+"gridheader")).buttonMarkup({theme:c.themeDate,icon:"arrow-l",inline:true,iconpos:"notext",corners:true,shadow:true}).on(c.clickEventAlt,function(i){i.preventDefault();if(j.calPrev){if(j.theDate.getDate()>28){j.theDate.setDate(1)}j._offset("m",-1)}});if(c.calNoHeader===true){j.d.intHTML.find("."+f+"gridheader").remove()}b={today:-1,highlightDay:-1,presetDay:-1,startDay:j.__("calStartDay"),thisDate:new j._date(),maxDate:j.initDate.copy(),minDate:j.initDate.copy(),currentMonth:false,weekMode:0,weekDays:null};b.start=(j.theDate.copy([0],[0,0,1]).getDay()-j.__("calStartDay")+7)%7;b.thisMonth=j.theDate.getMonth();b.thisYear=j.theDate.getFullYear();b.wk=j.theDate.copy([0],[0,0,1]).adj(2,(-1*b.start)+(j.__("calStartDay")===0?1:0)).getWeek(4);b.end=32-j.theDate.copy([0],[0,0,32,13]).getDate();b.lastend=32-j.theDate.copy([0,-1],[0,0,32,13]).getDate();b.presetDate=(j.d.input.val()==="")?j._startOffset(j._makeDate(j.d.input.val())):j._makeDate(j.d.input.val());b.thisDateArr=b.thisDate.getArray();b.theDateArr=j.theDate.getArray();b.checkDates=(a.inArray(false,[c.afterToday,c.beforeToday,c.notToday,c.maxDays,c.minDays,c.blackDates,c.blackDays])>-1);j.calNext=true;j.calPrev=true;if(b.thisDateArr[0]===b.theDateArr[0]&&b.thisDateArr[1]===b.theDateArr[1]){b.currentMonth=true}if(b.presetDate.comp()===j.theDate.comp()){b.presetDay=b.presetDate.getDate()}if(c.afterToday===true&&(b.currentMonth===true||(b.thisDateArr[1]>=b.theDateArr[1]&&b.theDateArr[0]===b.thisDateArr[0]))){j.calPrev=false}if(c.beforeToday===true&&(b.currentMonth===true||(b.thisDateArr[1]<=b.theDateArr[1]&&b.theDateArr[0]===b.thisDateArr[0]))){j.calNext=false}if(c.minDays!==false){b.minDate.adj(2,-1*c.minDays);if(b.theDateArr[0]===b.minDate.getFullYear()&&b.theDateArr[1]<=b.minDate.getMonth()){j.calPrev=false}}if(c.maxDays!==false){b.maxDate.adj(2,c.maxDays);if(b.theDateArr[0]===b.maxDate.getFullYear()&&b.theDateArr[1]>=b.maxDate.getMonth()){j.calNext=false}}if(c.calUsePickers===true){b.picker=a("<div>",{"class":"ui-grid-a ui-datebox-grid",style:"padding-top: 5px; padding-bottom: 5px;"});b.picker1=a('<div class="ui-block-a"><select name="pickmon"></select></div>').appendTo(b.picker).find("select");b.picker2=a('<div class="ui-block-b"><select name="pickyar"></select></div>').appendTo(b.picker).find("select");for(e=0;e<=11;e++){b.picker1.append(a('<option value="'+e+'"'+((b.thisMonth===e)?' selected="selected"':"")+">"+j.__("monthsOfYear")[e]+"</option>"))}for(e=(b.thisYear-6);e<=b.thisYear+6;e++){b.picker2.append(a('<option value="'+e+'"'+((b.thisYear===e)?' selected="selected"':"")+">"+e+"</option>"))}b.picker1.on("change",function(){j.theDate.setMonth(a(this).val());j.refresh()});b.picker2.on("change",function(){j.theDate.setFullYear(a(this).val());j.refresh()});b.picker.find("select").selectmenu({mini:true,nativeMenu:true});b.picker.appendTo(j.d.intHTML)}l=a('<div class="'+f+'grid">').appendTo(j.d.intHTML);if(c.calShowDays){j._cal_days=j.__("daysOfWeekShort").concat(j.__("daysOfWeekShort"));b.weekDays=a("<div>",{"class":f+"gridrow"}).appendTo(l);if(j.__("isRTL")===true){b.weekDays.css("direction","rtl")}if(c.calShowWeek){a("<div>").addClass(f+"griddate "+f+"griddate-empty "+f+"griddate-label").appendTo(b.weekDays)}for(e=0;e<=6;e++){a("<div>"+j._cal_days[(e+b.startDay)%7]+"</div>").addClass(f+"griddate "+f+"griddate-empty "+f+"griddate-label").appendTo(b.weekDays)}}b.gen=j._cal_gen(b.start,b.lastend,b.end,!c.calOnlyMonth,j.theDate.getMonth());for(var n=0,m=b.gen.length;n<m;n++){k=a("<div>",{"class":f+"gridrow"});if(j.__("isRTL")){k.css("direction","rtl")}if(c.calShowWeek){a("<div>",{"class":f+"griddate "+f+"griddate-empty"}).text("W"+b.wk).appendTo(k);b.wk++;if(b.wk>52&&typeof b.gen[parseInt(n,10)+1]!=="undefined"){b.wk=new Date(b.theDateArr[0],b.theDateArr[1],((j.__("calStartDay")===0)?b.gen[parseInt(n,10)+1][1][0]:b.gen[parseInt(n,10)+1][0][0])).getWeek(4)}}for(var d=0,g=b.gen[n].length;d<g;d++){if(c.calWeekMode){b.weekMode=b.gen[n][c.calWeekModeDay][0]}if(typeof b.gen[n][d]==="boolean"){a("<div>",{"class":f+"griddate "+f+"griddate-empty"}).appendTo(k)}else{h=j._cal_check(b,b.theDateArr[0],b.gen[n][d][1],b.gen[n][d][0]);if(b.gen[n][d][0]){a("<div>"+String(b.gen[n][d][0])+"</div>").addClass(b.thisMonth===b.gen[n][d][1]?(f+"griddate ui-corner-all ui-btn-up-"+h.theme+(h.ok?"":" "+f+"griddate-disable")):(f+"griddate "+f+"griddate-empty")).jqmData("date",((c.calWeekMode)?b.weekMode:b.gen[n][d][0])).jqmData("theme",b.thisMonth===b.gen[n][d][1]?h.theme:"-").jqmData("enabled",h.ok).jqmData("month",b.gen[n][((c.calWeekMode)?c.calWeekModeDay:d)][1]).appendTo(k)}}}if(c.calControlGroup===true){k.find(".ui-corner-all").removeClass("ui-corner-all").eq(0).addClass("ui-corner-left").end().last().addClass("ui-corner-right").addClass("ui-controlgroup-last")}k.appendTo(l)}if(c.calShowWeek){l.find("."+f+"griddate").addClass(f+"griddate-week")}if(c.calShowDateList===true&&c.calDateList!==false){b.datelist=a("<div>");b.datelistpick=a('<select name="pickdate"></select>').appendTo(b.datelist);b.datelistpick.append('<option value="false" selected="selected">'+j.__("calDateListLabel")+"</option>");for(e=0;e<c.calDateList.length;e++){b.datelistpick.append(a('<option value="'+c.calDateList[e][0]+'">'+c.calDateList[e][1]+"</option>"))}b.datelistpick.on("change",function(){b.datelistdate=a(this).val().split("-");j.theDate=new j._date(b.datelistdate[0],b.datelistdate[1]-1,b.datelistdate[2],0,0,0,0);j.d.input.trigger("datebox",{method:"doset"})});b.datelist.find("select").selectmenu({mini:true,nativeMenu:true});b.datelist.appendTo(j.d.intHTML)}if(c.useTodayButton||c.useClearButton){k=a("<div>",{"class":f+"controls"});if(c.useTodayButton){a('<a href="#">'+j.__("calTodayButtonLabel")+"</a>").appendTo(k).buttonMarkup({theme:c.theme,icon:"check",iconpos:"left",corners:true,shadow:true}).on(c.clickEvent,function(i){i.preventDefault();j.theDate=new j._date();j.theDate=new j._date(j.theDate.getFullYear(),j.theDate.getMonth(),j.theDate.getDate(),0,0,0,0);j.d.input.trigger("datebox",{method:"doset"})})}if(c.useClearButton){a('<a href="#">'+j.__("clearButton")+"</a>").appendTo(k).buttonMarkup({theme:c.theme,icon:"delete",iconpos:"left",corners:true,shadow:true}).on(c.clickEventAlt,function(i){i.preventDefault();j.d.input.val("");j.d.input.trigger("datebox",{method:"clear"});j.d.input.trigger("datebox",{method:"close"})})}if(c.useCollapsedBut){k.addClass("ui-datebox-collapse")}k.appendTo(l)}j.d.intHTML.on(c.clickEventAlt+" vmouseover vmouseout","div."+f+"griddate",function(i){if(i.type===c.clickEventAlt){i.preventDefault();if(a(this).jqmData("enabled")){j.theDate.set(2,1).set(1,a(this).jqmData("month")).set(2,a(this).jqmData("date"));j.d.input.trigger("datebox",{method:"set",value:j._formatter(j.__fmt(),j.theDate),date:j.theDate});j.d.input.trigger("datebox",{method:"close"})}}else{if(a(this).jqmData("enabled")&&typeof a(this).jqmData("theme")!=="undefined"){if(c.calWeekMode!==false&&c.calWeekHigh===true){a(this).parent().find("div").each(function(){j._hoover(this)})}else{j._hoover(this)}}}});j.d.intHTML.on("swipeleft",function(){if(j.calNext){j._offset("m",1)}}).on("swiperight",function(){if(j.calPrev){j._offset("m",-1)}});if(j.wheelExists){j.d.intHTML.on("mousewheel",function(i,o){i.preventDefault();if(o>0&&j.calNext){j.theDate.set(2,1);j._offset("m",1)}if(o<0&&j.calPrev){j.theDate.set(2,1);j._offset("m",-1)}})}}})})(jQuery);


/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-datebox
 */
 /* FLIPBOX Mode */
(function(a){a.extend(a.mobile.datebox.prototype.options,{themeDateHigh:"e",themeDatePick:"a",themeDate:"d",useSetButton:true,validHours:false,flen:{y:15,m:12,d:15,h:12,i:15,a:3}});a.extend(a.mobile.datebox.prototype,{_fbox_pos:function(){var b=this,f=null,e=null,d=this.d.intHTML.find(".ui-datebox-flipcontent").innerHeight(),c=null;b.d.intHTML.find(".ui-datebox-flipcenter").each(function(){f=a(this);e=f.innerHeight();f.css("top",((d/2)-(e/2)+4)*-1)});b.d.intHTML.find("ul").each(function(){f=a(this);d=f.parent().innerHeight();e=f.find("li").first();c=f.find("li").size()*e.outerHeight();e.css("marginTop",((c/2)-(d/2)+(e.outerHeight()/2))*-1)})}});a.extend(a.mobile.datebox.prototype._build,{timeflipbox:function(){this._build.flipbox.apply(this)},flipbox:function(){var l=this,d=this.options,e,j,m,f,k,g=(l.d.input.val()==="")?l._startOffset(l._makeDate(l.d.input.val())):l._makeDate(l.d.input.val()),h="ui-datebox-",c=a("<div class='ui-overlay-shadow'><ul></ul></div>"),b=a("<div>",{"class":h+"flipcontent"});if(typeof l.d.intHTML!=="boolean"){l.d.intHTML.empty()}l.d.input.on("datebox",function(n,i){if(i.method==="postrefresh"){l._fbox_pos()}});l.d.headerText=((l._grabLabel()!==false)?l._grabLabel():((d.mode==="flipbox")?l.__("titleDateDialogLabel"):l.__("titleTimeDialogLabel")));l.d.intHTML=a("<span>");l.fldOrder=((d.mode==="flipbox")?l.__("dateFieldOrder"):l.__("timeFieldOrder"));l._check();l._minStepFix();if(d.mode==="flipbox"){a('<div class="'+h+'header"><h4>'+l._formatter(l.__("headerFormat"),l.theDate)+"</h4></div>").appendTo(l.d.intHTML)}l.d.intHTML.append(b);for(j=0;j<l.fldOrder.length;j++){switch(l.fldOrder[j]){case"y":m=l._makeEl(c,{attr:{field:"y",amount:1}});for(e=d.flen.y*-1;e<(d.flen.y+1);e++){f=(e!==0)?((g.get(0)===(l.theDate.get(0)+e))?d.themeDateHigh:d.themeDate):d.themeDatePick;a("<li>",{"class":"ui-body-"+f}).html("<span>"+(l.theDate.get(0)+e)+"</span>").appendTo(m.find("ul"))}m.appendTo(b);break;case"m":m=l._makeEl(c,{attr:{field:"m",amount:1}});for(e=d.flen.m*-1;e<(d.flen.m+1);e++){k=l.theDate.copy([0],[0,0,1]);k.adj(1,e);f=(e!==0)?((g.get(1)===k.get(1)&&g.get(0)===k.get(0))?d.themeDateHigh:d.themeDate):d.themeDatePick;a("<li>",{"class":"ui-body-"+f}).html("<span>"+l.__("monthsOfYearShort")[k.getMonth()]+"</span>").appendTo(m.find("ul"))}m.appendTo(b);break;case"d":m=l._makeEl(c,{attr:{field:"d",amount:1}});for(e=d.flen.d*-1;e<(d.flen.d+1);e++){k=l.theDate.copy();k.adj(2,e);f=(e!==0)?((g.comp()===k.comp())?d.themeDateHigh:d.themeDate):d.themeDatePick;if((d.blackDates!==false&&a.inArray(k.iso(),d.blackDates)>-1)||(d.blackDays!==false&&a.inArray(k.getDay(),d.blackDays)>-1)){f+=" "+h+"griddate-disable"}a("<li>",{"class":"ui-body-"+f}).html("<span>"+k.getDate()+"</span>").appendTo(m.find("ul"))}m.appendTo(b);break;case"h":m=l._makeEl(c,{attr:{field:"h",amount:1}});for(e=d.flen.h*-1;e<(d.flen.h+1);e++){k=l.theDate.copy();k.adj(3,e);f=(e!==0)?d.themeDate:d.themeDatePick;if(d.validHours!==false&&a.inArray(k.get(3),d.validHours)<0){f+=" "+h+"griddate-disable"}a("<li>",{"class":"ui-body-"+f}).html("<span>"+((l.__("timeFormat")===12)?((k.get(3)===0)?"12":((k.get(3)<13)?k.get(3):(k.get(3)-12))):k.get(3))+"</span>").appendTo(m.find("ul"))}m.appendTo(b);break;case"i":m=l._makeEl(c,{attr:{field:"i",amount:d.minuteStep}});for(e=d.flen.i*-1;e<(d.flen.i+1);e++){k=l.theDate.copy();k.adj(4,(e*d.minuteStep));f=(e!==0)?d.themeDate:d.themeDatePick;a("<li>",{"class":"ui-body-"+f}).html("<span>"+l._zPad(k.get(4))+"</span>").appendTo(m.find("ul"))}m.appendTo(b);break;case"a":if(l.__("timeFormat")!==12){break}m=l._makeEl(c,{attr:{field:"a",amount:1}});k=a("<li class='ui-body-"+d.themeDate+"'><span> </span></li>");for(e=0;e<d.flen.a;e++){k.clone().appendTo(m.find("ul"))}if(l.theDate.get(3)<12){k.clone().appendTo(m.find("ul"))}f=(l.theDate.get(3)>11)?[d.themeDate,d.themeDatePick]:[d.themeDatePick,d.themeDate];a("<li>",{"class":"ui-body-"+f[0]}).html("<span>"+l.__("meridiem")[0]+"</span>").appendTo(m.find("ul"));a("<li>",{"class":"ui-body-"+f[1]}).html("<span>"+l.__("meridiem")[1]+"</span>").appendTo(m.find("ul"));if(l.theDate.get(3)>11){k.clone().appendTo(m.find("ul"))}for(e=0;e<d.flen.a;e++){k.clone().appendTo(m.find("ul"))}m.appendTo(b);break}}a("<div>",{"class":h+"flipcenter ui-overlay-shadow"}).css("pointerEvents","none").appendTo(l.d.intHTML);if(d.useSetButton||d.useClearButton){j=a("<div>",{"class":h+"controls"});if(d.useSetButton){a('<a href="#">'+((d.mode==="flipbox")?l.__("setDateButtonLabel"):l.__("setTimeButtonLabel"))+"</a>").appendTo(j).buttonMarkup({theme:d.theme,icon:"check",iconpos:"left",corners:true,shadow:true}).on(d.clickEventAlt,function(i){i.preventDefault();if(l.dateOK===true){l.d.input.trigger("datebox",{method:"set",value:l._formatter(l.__fmt(),l.theDate),date:l.theDate});l.d.input.trigger("datebox",{method:"close"})}})}if(d.useClearButton){a('<a href="#">'+l.__("clearButton")+"</a>").appendTo(j).buttonMarkup({theme:d.theme,icon:"delete",iconpos:"left",corners:true,shadow:true}).on(d.clickEventAlt,function(i){i.preventDefault();l.d.input.val("");l.d.input.trigger("datebox",{method:"clear"});l.d.input.trigger("datebox",{method:"close"})})}if(d.useCollapsedBut){j.addClass("ui-datebox-collapse")}j.appendTo(l.d.intHTML)}if(l.wheelExists){l.d.intHTML.on("mousewheel",".ui-overlay-shadow",function(i,n){i.preventDefault();l._offset(a(this).jqmData("field"),((n<0)?-1:1)*a(this).jqmData("amount"))})}l.d.intHTML.on(l.drag.eStart,"ul",function(n,i){if(!l.drag.move){if(typeof i!=="undefined"){n=i}l.drag.move=true;l.drag.target=a(this).find("li").first();l.drag.pos=parseInt(l.drag.target.css("marginTop").replace(/px/i,""),10);l.drag.start=l.touch?n.originalEvent.changedTouches[0].pageY:n.pageY;l.drag.end=false;n.stopPropagation();n.preventDefault()}});l.d.intHTML.on(l.drag.eStart,"."+h+"flipcenter",function(i){if(!l.drag.move){l.drag.target=l.touch?i.originalEvent.changedTouches[0].pageX-a(i.currentTarget).offset().left:i.pageX-a(i.currentTarget).offset().left;l.drag.tmp=l.d.intHTML.find("."+h+"flipcenter").innerWidth()/((a.inArray("a",l.fldOrder)>-1&&l.__("timeFormat")!==12)?l.fldOrder.length-1:l.fldOrder.length);a(l.d.intHTML.find("ul").get(parseInt(l.drag.target/l.drag.tmp,10))).trigger(l.drag.eStart,i)}})}});a.extend(a.mobile.datebox.prototype._drag,{timeflipbox:function(){this._drag.flipbox.apply(this)},flipbox:function(){var b=this,d=this.options,c=this.drag;a(document).on(c.eMove,function(f){if(c.move&&(d.mode==="flipbox"||d.mode==="timeflipbox")){c.end=b.touch?f.originalEvent.changedTouches[0].pageY:f.pageY;c.target.css("marginTop",(c.pos+c.end-c.start)+"px");f.preventDefault();f.stopPropagation();return false}});a(document).on(c.eEnd,function(f){if(c.move&&(d.mode==="flipbox"||d.mode==="timeflipbox")){c.move=false;if(c.end!==false){f.preventDefault();f.stopPropagation();c.tmp=c.target.parent().parent();b._offset(c.tmp.jqmData("field"),(parseInt((c.start-c.end)/c.target.innerHeight(),10)*c.tmp.jqmData("amount")))}c.start=false;c.end=false}})}})})(jQuery);