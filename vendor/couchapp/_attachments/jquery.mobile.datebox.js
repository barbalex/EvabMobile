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
			version: '2-1.1.0-2012091200', // jQMMajor.jQMMinor.DBoxMinor-YrMoDaySerial
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
			
			afterToday: false,
			beforeToday: false,
			notToday: false,
			maxDays: false,
			minDays: false,
			maxYear: false,
			minYear: false,
			blackDates: false,
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
					durationFormat: '%Dd %DA, %Dl:%DM:%DS'
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
			var w = $(this).data('datebox');
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
			if ( typeof o[o.mode+'lang'][val] !== 'undefined' ) { return o[o.mode+'lang'][val]; }
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
			
			if ( o.mode === 'durationbox' ) {
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
				
				date = new w._date(w._n(d.year,1),w._n(d.mont,1),w._n(d.date,1),w._n(d.hour,0),w._n(d.mins,0),w._n(d.secs,0),0);
				
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
				
				if ( o.mode === 'durationbox' ) {
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
			
			w.initDate = new w._date();
			w.theDate = (o.defaultValue) ? w._makeDate(o.defaultValue) : new w._date();
			w.initDone = false;
			
			if ( o.useButton === true && o.useInline === false && o.useNewStyle === false ) {
				w.d.open = $('<a href="#" class="ui-input-clear" title="'+this.__('tooltip')+'">'+this.__('tooltip')+'</a>')
					.on(o.clickEvent, function(e) {
						e.preventDefault();
						if ( !w.disabled ) { w.d.input.trigger('datebox', {'method': 'open'}); w.d.wrap.addClass('ui-focus'); }
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
							w.d.input.trigger('datebox', {'method': 'open'}); w.d.wrap.addClass('ui-focus');
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
				w.d.input.addClass('ui-shadow-inset ui-corner-all '+((o.useAltIcon===true)?'ui-icon-datebox-alt':'ui-icon-datebox'));
				if ( o.overrideStyleClass !== false ) { w.d.input.addClass(o.overrideStyleClass); }
			}
			
			// Check if mousewheel plugin is loaded
			if ( typeof $.event.special.mousewheel !== 'undefined' ) { w.wheelExists = true; }
		
			// Disable when done if element attribute disabled is true.
			if ( w.d.input.is(':disabled') ) {
				w.disable();
			}
			
			if ( o.useInline === true || o.useInlineBlind ) { w.open(); }
			
			//Throw dateboxinit event
			$( document ).trigger( "dateboxaftercreate" );
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
		},
		close: function() {
			var w = this,
				o = this.options;
			
			if ( o.useInlineBlind === true ) { w.d.mainWrap.slideUp(); return true;}
			if ( o.useInline === true ) { return true; }

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
			
			if ( $.inArray(o.mode, ['timebox','durationbox','timeflipbox']) > -1 ) { 
				if ( o.mode === 'timeflipbox' && o.validHours !== false ) {
					if ( $.inArray(w.theDate.getHours(), o.validHours) < 0 ) { w.dateOK = false; }
				}
			} else {
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
				if ( typeof w.d.input.attr('title') !== 'undefined' ) { return w.d.input.attr('title'); }
				if ( w.d.wrap.parent().find('label[for='+w.d.input.attr('id')+']').text() !== '' ) {
					return w.d.wrap.parent().find('label[for='+w.d.input.attr('id')+']').text();
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
			if ( typeof($(this).data('datebox')) === "undefined" ) {
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
 */
/* CALBOX Mode */

(function($) {
	$.extend( $.mobile.datebox.prototype.options, {
		themeDateToday: 'a',
		themeDayHigh: 'e',
		themeDatePick: 'a',
		themeDateHigh: 'e',
		themeDateHighAlt: 'e',
		themeDate: 'd',
		
		calHighToday: true,
		calHighPick: true,
		
		calShowDays: true,
		calOnlyMonth: false,
		calWeekMode: false,
		calWeekModeDay: 1,
		calWeekHigh: false,
		calControlGroup: false,
		calShowWeek: false,
		calUsePickers: false,
		calNoHeader: false,
		
		useTodayButton: false,
		useCollapsedBut: false,
		
		highDays: false,
		highDates: false,
		highDatesAlt: false,
		enableDates: false
	});
	$.extend( $.mobile.datebox.prototype, {
		_cal_gen: function (start,prev,last,other,month) {
			var rc = 0, cc = 0, day = 1, 
				next = 1, cal = [], row = [], stop = false;
				
			for ( rc = 0; rc <= 5; rc++ ) {
				if ( stop === false ) {
					row = [];
					for ( cc = 0; cc <= 6; cc++ ) {
						if ( rc === 0 && cc < start ) {
							if ( other === true ) {
								row.push([prev + (cc - start) + 1,month-1]);
							} else {
								row.push(false);
							}
						} else if ( rc > 3 && day > last ) {
							if ( other === true ) {
								row.push([next,month+1]); next++;
							} else {
								row.push(false);
							}
							stop = true;
						} else {
							row.push([day,month]); day++;
							if ( day > last ) { stop = true; }
						}
					}
					cal.push(row);
				}
			}
			return cal;
		},
		_cal_check : function (cal, year, month, date) {
			var w = this,
				o = this.options,
				ret = {},
				day = new this._date(year,month,date,0,0,0,0).getDay();
				
			ret.ok = true;
			ret.iso = year + '-' + w._zPad(month+1) + '-' + w._zPad(date);
			ret.comp = parseInt(ret.iso.replace(/-/g,''),10);
			ret.theme = o.themeDate;
			
			if ( $.isArray(o.enableDates) && $.inArray(ret.iso, o.enableDates) < 0 ) {
				ret.ok = false;
			} else if ( cal.checkDates ) {
				if (
					( o.afterToday === true && cal.thisDate.comp() > ret.comp ) ||
					( o.beforeToday === true && cal.thisDate.comp() < ret.comp ) ||
					( o.notToday === true && cal.thisDate.comp() === ret.comp ) ||
					( o.maxDays !== false && cal.maxDate.comp() < ret.comp ) ||
					( o.minDays !== false && cal.minDate.comp() > ret.comp ) ||
					( $.isArray(o.blackDays) && $.inArray(day, o.blackDays) > -1 ) ||
					( $.isArray(o.blackDates) && $.inArray(ret.iso, o.blackDates) > -1 ) 
				) {
					ret.ok = false;
				}
			}
			if ( ret.ok ) {
				if ( o.calHighPick && date === cal.presetDay ) {
					ret.theme = o.themeDatePick;
				} else if ( o.calHighToday && ret.comp === cal.thisDate.comp() ) {
					ret.theme = o.themeDateToday;
				} else if ( $.isArray(o.highDatesAlt) && ($.inArray(ret.iso, o.highDatesAlt) > -1) ) {
					ret.theme = o.themeDateHighAlt;
				} else if ( $.isArray(o.highDates) && ($.inArray(ret.iso, o.highDates) > -1) ) {
					ret.theme = o.themeDateHigh;
				} else if ( $.isArray(o.highDays) && ($.inArray(day, o.highDays) > -1) ) {
					ret.theme = o.themeDayHigh;
				}
			}
			return ret;
		}
	});
	$.extend( $.mobile.datebox.prototype._build, {
		'calbox': function () {
			var w = this,
				o = this.options, i,
				cal = false,
				uid = 'ui-datebox-',
				temp = false, row = false, col = false, hRow = false, checked = false;
				
			if ( typeof w.d.intHTML !== 'boolean' ) {
				w.d.intHTML.remove();
			}
			
			w.d.headerText = ((w._grabLabel() !== false)?w._grabLabel():w.__('titleDateDialogLabel'));
			w.d.intHTML = $('<span>');
			
			$('<div class="'+uid+'gridheader"><div class="'+uid+'gridlabel"><h4>' +
				w.__('monthsOfYear')[w.theDate.getMonth()] + " " + w.theDate.getFullYear() +
				'</h4></div></div>').appendTo(w.d.intHTML);
				
			// Previous and next month buttons, define booleans to decide if they should do anything
			$("<div class='"+uid+"gridplus"+(w.__('isRTL')?'-rtl':'')+"'><a href='#'>"+w.__('nextMonth')+"</a></div>")
				.prependTo(w.d.intHTML.find('.'+uid+'gridheader'))
				.buttonMarkup({theme: o.themeDate, icon: 'arrow-r', inline: true, iconpos: 'notext', corners:true, shadow:true})
				.on(o.clickEventAlt, function(e) {
					e.preventDefault();
					if ( w.calNext ) {
						if ( w.theDate.getDate() > 28 ) { w.theDate.setDate(1); }
						w._offset('m',1);
					}
				});
			$("<div class='"+uid+"gridminus"+(w.__('isRTL')?'-rtl':'')+"'><a href='#'>"+w.__('prevMonth')+"</a></div>")
				.prependTo(w.d.intHTML.find('.'+uid+'gridheader'))
				.buttonMarkup({theme: o.themeDate, icon: 'arrow-l', inline: true, iconpos: 'notext', corners:true, shadow:true})
				.on(o.clickEventAlt, function(e) {
					e.preventDefault();
					if ( w.calPrev ) {
						if ( w.theDate.getDate() > 28 ) { w.theDate.setDate(1); }
						w._offset('m',-1);
					}
				});
				
			if ( o.calNoHeader === true ) { w.d.intHTML.find('.'+uid+'gridheader').remove(); }
			
			cal = {'today': -1, 'highlightDay': -1, 'presetDay': -1, 'startDay': w.__('calStartDay'),
				'thisDate': new w._date(), 'maxDate': w.initDate.copy(), 'minDate': w.initDate.copy(),
				'currentMonth': false, 'weekMode': 0, 'weekDays': null };
			cal.start = (w.theDate.copy([0],[0,0,1]).getDay() - w.__('calStartDay') + 7) % 7;
			cal.thisMonth = w.theDate.getMonth();
			cal.thisYear = w.theDate.getFullYear();
			cal.wk = w.theDate.copy([0],[0,0,1]).adj(2,(-1*cal.start)+(w.__('calStartDay')===0?1:0)).getWeek(4);
			cal.end = 32 - w.theDate.copy([0],[0,0,32,13]).getDate();
			cal.lastend = 32 - w.theDate.copy([0,-1],[0,0,32,13]).getDate();
			cal.presetDate = w._makeDate(w.d.input.val());
			cal.thisDateArr = cal.thisDate.getArray();
			cal.theDateArr = w.theDate.getArray();
			cal.checkDates = ( $.inArray(false, [o.afterToday, o.beforeToday, o.notToday, o.maxDays, o.minDays, o.blackDates, o.blackDays]) > -1 );

			w.calNext = true;
			w.calPrev = true;
			
			if ( cal.thisDateArr[0] === cal.theDateArr[0] && cal.thisDateArr[1] === cal.theDateArr[1] ) { cal.currentMonth = true; } 
			if ( cal.presetDate.comp() === w.theDate.comp() ) { cal.presetDay = cal.presetDate.getDate(); }
			
			if ( o.afterToday === true && 
				( cal.currentMonth === true || ( cal.thisDateArr[1] >= cal.theDateArr[1] && cal.theDateArr[0] === cal.thisDateArr[0] ) ) ) { 
				w.calPrev = false; }
			if ( o.beforeToday === true &&
				( cal.currentMonth === true || ( cal.thisDateArr[1] <= cal.theDateArr[1] && cal.theDateArr[0] === cal.thisDateArr[0] ) ) ) {
				w.calNext = false; }
			
			if ( o.minDays !== false ) {
				cal.minDate.adj(2, -1*o.minDays);
				if ( cal.theDateArr[0] === cal.minDate.getFullYear() && cal.theDateArr[1] <= cal.minDate.getMonth() ) { w.calPrev = false;}
			}
			if ( o.maxDays !== false ) {
				cal.maxDate.adj(2, o.maxDays);
				if ( cal.theDateArr[0] === cal.maxDate.getFullYear() && cal.theDateArr[1] >= cal.maxDate.getMonth() ) { w.calNext = false;}
			}
			
			if ( o.calUsePickers === true ) {
				cal.picker = $('<div>', {'class': 'ui-grid-a ui-datebox-grid','style':'padding-top: 5px; padding-bottom: 5px;'});
				
				cal.picker1 = $('<div class="ui-block-a"><select name="pickmon"></select></div>').appendTo(cal.picker).find('select');
				cal.picker2 = $('<div class="ui-block-b"><select name="pickyar"></select></div>').appendTo(cal.picker).find('select');
				
				for ( i=0; i<=11; i++ ) {
					cal.picker1.append($('<option value="'+i+'"'+((cal.thisMonth===i)?' selected="selected"':'')+'>'+w.__('monthsOfYear')[i]+'</option>'));
				}
				for ( i=(cal.thisYear-6); i<=cal.thisYear+6; i++ ) {
					cal.picker2.append($('<option value="'+i+'"'+((cal.thisYear===i)?' selected="selected"':'')+'>'+i+'</option>'));
				}
				
				cal.picker1.on('change', function () { w.theDate.setMonth($(this).val()); w.refresh(); });
				cal.picker2.on('change', function () { w.theDate.setFullYear($(this).val()); w.refresh(); });
				
				cal.picker.find('select').selectmenu({mini:true, nativeMenu: true});
				cal.picker.appendTo(w.d.intHTML);
			}
			
			temp = $('<div class="'+uid+'grid">').appendTo(w.d.intHTML);
			
			if ( o.calShowDays ) {
				w._cal_days = w.__('daysOfWeekShort').concat(w.__('daysOfWeekShort'));
				cal.weekDays = $("<div>", {'class':uid+'gridrow'}).appendTo(temp);
				if ( w.__('isRTL') === true ) { cal.weekDays.css('direction', 'rtl'); }
				if ( o.calShowWeek ) { 
					$("<div>").addClass(uid+'griddate '+uid+'griddate-empty '+uid+'griddate-label').appendTo(cal.weekDays);
				}
				for ( i=0; i<=6;i++ ) {
					$("<div>"+w._cal_days[(i+cal.startDay)%7]+"</div>").addClass(uid+'griddate '+uid+'griddate-empty '+uid+'griddate-label').appendTo(cal.weekDays);
				}
			}
			
			cal.gen = w._cal_gen(cal.start, cal.lastend, cal.end, !o.calOnlyMonth, w.theDate.getMonth());
			for ( var row=0, rows=cal.gen.length; row < rows; row++ ) {
				hRow = $('<div>', {'class': uid+'gridrow'});
				if ( w.__('isRTL') ) { hRow.css('direction', 'rtl'); }
				if ( o.calShowWeek ) {
						$('<div>', {'class':uid+'griddate '+uid+'griddate-empty'}).text('W'+cal.wk).appendTo(hRow);
						cal.wk++;
						if ( cal.wk > 52 && typeof cal.gen[parseInt(row,10)+1] !== 'undefined' ) { cal.wk = new Date(cal.theDateArr[0],cal.theDateArr[1],((w.__('calStartDay')===0)?cal.gen[parseInt(row,10)+1][1][0]:cal.gen[parseInt(row,10)+1][0][0])).getWeek(4); }
					} 
				for ( var col=0, cols=cal.gen[row].length; col<cols; col++ ) {
					if ( o.calWeekMode ) { cal.weekMode = cal.gen[row][o.calWeekModeDay][0]; }
					if ( typeof cal.gen[row][col] === 'boolean' ) {
						$('<div>', {'class':uid+'griddate '+uid+'griddate-empty'}).appendTo(hRow);
					} else {
						checked = w._cal_check(cal, cal.theDateArr[0], cal.gen[row][col][1], cal.gen[row][col][0]);
						if (cal.gen[row][col][0]) {
							$("<div>"+String(cal.gen[row][col][0])+"</div>")
								.addClass( cal.thisMonth === cal.gen[row][col][1] ?
									(uid+'griddate ui-corner-all ui-btn-up-'+checked.theme + (checked.ok?'':' '+uid+'griddate-disable')):
									(uid+'griddate '+uid+'griddate-empty')
								)
								.jqmData('date', ((o.calWeekMode)?cal.weekMode:cal.gen[row][col][0]))
								.jqmData('theme', cal.thisMonth === cal.gen[row][col][1] ? checked.theme : '-')
								.jqmData('enabled', checked.ok)
								.jqmData('month', cal.gen[row][col][1])
								.appendTo(hRow);
						}
					}
				}
				if ( o.calControlGroup === true ) {
					hRow.find('.ui-corner-all').removeClass('ui-corner-all').eq(0).addClass('ui-corner-left').end().last().addClass('ui-corner-right').addClass('ui-controlgroup-last');
				}
				hRow.appendTo(temp);
			}
			if ( o.calShowWeek ) { temp.find('.'+uid+'griddate').addClass(uid+'griddate-week'); }
			
			if ( o.useTodayButton || o.useClearButton ) {
				hRow = $('<div>', {'class':uid+'controls'});
				
				if ( o.useTodayButton ) {
					$('<a href="#">'+w.__('calTodayButtonLabel')+'</a>')
						.appendTo(hRow).buttonMarkup({theme: o.theme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
						.on(o.clickEvent, function(e) {
							e.preventDefault();
							w.theDate = new w._date();
							w.theDate = new w._date(w.theDate.getFullYear(), w.theDate.getMonth(), w.theDate.getDate(),0,0,0,0);
							w.d.input.trigger('datebox',{'method':'doset'});
						});
				}
				if ( o.useClearButton ) {
					$('<a href="#">'+w.__('clearButton')+'</a>')
						.appendTo(hRow).buttonMarkup({theme: o.theme, icon: 'delete', iconpos: 'left', corners:true, shadow:true})
						.on(o.clickEventAlt, function(e) {
							e.preventDefault();
							w.d.input.val('');
							w.d.input.trigger('datebox',{'method':'clear'});
							w.d.input.trigger('datebox',{'method':'close'});
						});
				}
				if ( o.useCollapsedBut ) {
					hRow.addClass('ui-datebox-collapse');
				}
				hRow.appendTo(temp);
			}
			
			w.d.intHTML.on(o.clickEventAlt+' vmouseover vmouseout', 'div.'+uid+'griddate', function(e) {
				if ( e.type === o.clickEventAlt ) {
					e.preventDefault();
					if ( $(this).jqmData('enabled') ) {
						w.theDate.set(2,1).set(1,$(this).jqmData('month')).set(2,$(this).jqmData('date'));
						w.d.input.trigger('datebox', {'method':'set', 'value':w._formatter(w.__fmt(),w.theDate), 'date':w.theDate});
						w.d.input.trigger('datebox', {'method':'close'});
					}
				} else {
					if ( $(this).jqmData('enabled') && typeof $(this).jqmData('theme') !== 'undefined' ) {
						if ( o.calWeekMode !== false && o.calWeekHigh === true ) {
							$(this).parent().find('div').each(function() { w._hoover(this); });
						} else { w._hoover(this); }
					}
				}
			});
			w.d.intHTML
				.on('swipeleft', function() { if ( w.calNext ) { w._offset('m', 1); } })
				.on('swiperight', function() { if ( w.calPrev ) { w._offset('m', -1); } });
			
			if ( w.wheelExists) { // Mousewheel operations, if plugin is loaded
				w.d.intHTML.on('mousewheel', function(e,d) {
					e.preventDefault();
					if ( d > 0 && w.calNext ) { 
						w.theDate.set(2,1);
						w._offset('m', 1);
					}
					if ( d < 0 && w.calPrev ) {
						w.theDate.set(2,1);
						w._offset('m', -1);
					}
				});
			}
		}
	});
})( jQuery );



/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-datebox
 */
/* FLIPBOX Mode */

(function($) {
	$.extend( $.mobile.datebox.prototype.options, {
		themeDateHigh: 'e',
		themeDatePick: 'a',
		themeDate: 'd',
		useSetButton: true,
		validHours: false,
		flen: {'y': 15, 'm':12, 'd':15, 'h':12, 'i':15, 'a':3}
	});
	$.extend( $.mobile.datebox.prototype, {
		'_fbox_pos': function () {
			var w = this,
				ech = null,
				top = null,
				par = this.d.intHTML.find('.ui-datebox-flipcontent').innerHeight(),
				tot = null;
				
			w.d.intHTML.find('.ui-datebox-flipcenter').each(function() {
				ech = $(this);
				top = ech.innerHeight();
				ech.css('top', ((par/2)-(top/2)+4)*-1);
			});
			w.d.intHTML.find('ul').each(function () {
				ech = $(this);
				par = ech.parent().innerHeight();
				top = ech.find('li').first();
				tot = ech.find('li').size() * top.outerHeight();
				top.css('marginTop', ((tot/2)-(par/2)+(top.outerHeight()/2))*-1);
			});
		}
	});
	$.extend( $.mobile.datebox.prototype._build, {
		'timeflipbox': function() {
			this._build.flipbox.apply(this);
		},
		'flipbox': function () {
			var w = this,
				o = this.options, i, y, hRow, tmp, testDate,
				iDate = this._makeDate(this.d.input.val()),
				uid = 'ui-datebox-',
				flipBase = $("<div class='ui-overlay-shadow'><ul></ul></div>"),
				ctrl = $("<div>", {"class":uid+'flipcontent'});
			
			if ( typeof w.d.intHTML !== 'boolean' ) {
				w.d.intHTML.empty();
			}
			
			w.d.input.on('datebox', function (e,p) {
				if ( p.method === 'postrefresh' ) {
					w._fbox_pos();
				}
			});
			
			w.d.headerText = ((w._grabLabel() !== false)?w._grabLabel():((o.mode==='flipbox')?w.__('titleDateDialogLabel'):w.__('titleTimeDialogLabel')));
			w.d.intHTML = $('<span>')
			
			w.fldOrder = ((o.mode==='flipbox')?w.__('dateFieldOrder'):w.__('timeFieldOrder'));
			w._check();
			w._minStepFix();
			
			if ( o.mode === 'flipbox' ) { $('<div class="'+uid+'header"><h4>'+w._formatter(w.__('headerFormat'), w.theDate)+'</h4></div>').appendTo(w.d.intHTML); }
			
			w.d.intHTML.append(ctrl);
			
			for ( y=0; y<w.fldOrder.length; y++ ) {
				switch (w.fldOrder[y]) {
					case 'y':
						hRow = w._makeEl(flipBase, {'attr': {'field':'y','amount':1} });
						for ( i=o.flen.y*-1; i<(o.flen.y+1); i++ ) {
							tmp = (i!==0)?((iDate.get(0) === (w.theDate.get(0) + i))?o.themeDateHigh:o.themeDate):o.themeDatePick;
							$('<li>', {'class':'ui-body-'+tmp})
								.html('<span>'+(w.theDate.get(0)+i)+'</span>').appendTo(hRow.find('ul'));
						}
						hRow.appendTo(ctrl);
						break;
					case 'm':
						hRow = w._makeEl(flipBase, {'attr': {'field':'m','amount':1} });
						for ( i=o.flen.m*-1; i<(o.flen.m+1); i++ ) {
							testDate = w.theDate.copy([0],[0,0,1]);
							testDate.adj(1,i);
							tmp = (i!==0)?((iDate.get(1) === testDate.get(1) && iDate.get(0) === testDate.get(0))?o.themeDateHigh:o.themeDate):o.themeDatePick;
							$("<li>", { 'class' : 'ui-body-'+tmp})
								.html("<span>"+w.__('monthsOfYearShort')[testDate.getMonth()]+"</span>").appendTo(hRow.find('ul'));
						}
						hRow.appendTo(ctrl);
						break;
					case 'd':
						hRow = w._makeEl(flipBase, {'attr': {'field':'d','amount':1} });
						for ( i=o.flen.d*-1; i<(o.flen.d+1); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj(2,i);
							tmp = (i!==0)?((iDate.comp() === testDate.comp())?o.themeDateHigh:o.themeDate):o.themeDatePick;
							if ( ( o.blackDates !== false && $.inArray(testDate.iso(), o.blackDates) > -1 ) ||
								( o.blackDays !== false && $.inArray(testDate.getDay(), o.blackDays) > -1 ) ) {
								tmp += ' '+uid+'griddate-disable';
							}
							$("<li>", { 'class' : 'ui-body-'+tmp})
								.html("<span>"+testDate.getDate()+"</span>").appendTo(hRow.find('ul'));
						}
						hRow.appendTo(ctrl);
						break;
					case 'h':
						hRow = w._makeEl(flipBase, {'attr': {'field':'h','amount':1} });
						for ( i=o.flen.h*-1; i<(o.flen.h+1); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj(3,i);
							tmp = (i!==0)?o.themeDate:o.themeDatePick;
							if ( o.validHours !== false && $.inArray(testDate.get(3), o.validHours) < 0 ) {
								tmp += ' '+uid+'griddate-disable';
							}
							$("<li>", { 'class' : 'ui-body-'+tmp})
								.html("<span>"+((w.__('timeFormat')===12) ? (( testDate.get(3) === 0 ) ? '12' : (( testDate.get(3) < 13 ) ? testDate.get(3) : (testDate.get(3)-12))) : testDate.get(3))+"</span>").appendTo(hRow.find('ul'));
						}
						hRow.appendTo(ctrl);
						break;
					case 'i':
						hRow = w._makeEl(flipBase, {'attr': {'field':'i','amount':o.minuteStep} });
						for ( i=o.flen.i*-1; i<(o.flen.i+1); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj(4,(i*o.minuteStep));
							tmp = (i!==0)?o.themeDate:o.themeDatePick;
							$("<li>", { 'class' : 'ui-body-'+tmp})
								.html("<span>"+w._zPad(testDate.get(4))+"</span>").appendTo(hRow.find('ul'));
						}
						hRow.appendTo(ctrl);
						break;
					case 'a':
						if ( w.__('timeFormat') !== 12 ) { break; }
						hRow = w._makeEl(flipBase, {'attr': {'field':'a','amount':1} });
						testDate = $("<li class='ui-body-"+o.themeDate+"'><span> </span></li>");
						
						for ( i=0; i<o.flen.a; i++ ) { testDate.clone().appendTo(hRow.find('ul')); }
						if ( w.theDate.get(3) < 12 ) { testDate.clone().appendTo(hRow.find('ul')); }
						
						tmp = (w.theDate.get(3) > 11) ? [o.themeDate,o.themeDatePick] : [o.themeDatePick,o.themeDate];
						
						$("<li>", { 'class' : 'ui-body-'+tmp[0]}).html('<span>'+w.__('meridiem')[0]+'</span>').appendTo(hRow.find('ul'));
						$("<li>", { 'class' : 'ui-body-'+tmp[1]}).html('<span>'+w.__('meridiem')[1]+'</span>').appendTo(hRow.find('ul'));
						
						if ( w.theDate.get(3) > 11 ) { testDate.clone().appendTo(hRow.find('ul')); }
						for ( i=0; i<o.flen.a; i++ ) { testDate.clone().appendTo(hRow.find('ul')); }
						
						hRow.appendTo(ctrl);
						break;
				}
			}
			
			$("<div>", {"class":uid+'flipcenter ui-overlay-shadow'}).css('pointerEvents', 'none').appendTo(w.d.intHTML);
			
			if ( o.useSetButton || o.useClearButton ) {
				y = $('<div>', {'class':uid+'controls'});
				
				if ( o.useSetButton ) {
					$('<a href="#">'+((o.mode==='flipbox')?w.__('setDateButtonLabel'):w.__('setTimeButtonLabel'))+'</a>')
						.appendTo(y).buttonMarkup({theme: o.theme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
						.on(o.clickEventAlt, function(e) {
							e.preventDefault();
							if ( w.dateOK === true ) {
								w.d.input.trigger('datebox', {'method':'set', 'value':w._formatter(w.__fmt(),w.theDate), 'date':w.theDate});
								w.d.input.trigger('datebox', {'method':'close'});
							}
						});
				}
				if ( o.useClearButton ) {
					$('<a href="#">'+w.__('clearButton')+'</a>')
						.appendTo(y).buttonMarkup({theme: o.theme, icon: 'delete', iconpos: 'left', corners:true, shadow:true})
						.on(o.clickEventAlt, function(e) {
							e.preventDefault();
							w.d.input.val('');
							w.d.input.trigger('datebox',{'method':'clear'});
							w.d.input.trigger('datebox',{'method':'close'});
						});
				}
				if ( o.useCollapsedBut ) {
					y.addClass('ui-datebox-collapse');
				}
				y.appendTo(w.d.intHTML);
			}
			
			if ( w.wheelExists ) { // Mousewheel operation, if plugin is loaded
				w.d.intHTML.on('mousewheel', '.ui-overlay-shadow', function(e,d) {
					e.preventDefault();
					w._offset($(this).jqmData('field'), ((d<0)?-1:1)*$(this).jqmData('amount'));
				});
			}
			
			w.d.intHTML.on(w.drag.eStart, 'ul', function(e,f) {
				if ( !w.drag.move ) {
					if ( typeof f !== "undefined" ) { e = f; }
					w.drag.move = true;
					w.drag.target = $(this).find('li').first();
					w.drag.pos = parseInt(w.drag.target.css('marginTop').replace(/px/i, ''),10);
					w.drag.start = w.touch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
					w.drag.end = false;
					e.stopPropagation();
					e.preventDefault();
				}
			});
			
			w.d.intHTML.on(w.drag.eStart, '.'+uid+'flipcenter', function(e) { // Used only on old browsers and IE.
				if ( !w.drag.move ) {
					w.drag.target = w.touch ? e.originalEvent.changedTouches[0].pageX - $(e.currentTarget).offset().left : e.pageX - $(e.currentTarget).offset().left;
					w.drag.tmp = w.d.intHTML.find('.'+uid+'flipcenter').innerWidth() / (( $.inArray('a', w.fldOrder) > -1 && w.__('timeFormat') !== 12 )?w.fldOrder.length-1:w.fldOrder.length);
					$(w.d.intHTML.find('ul').get(parseInt(w.drag.target / w.drag.tmp,10))).trigger(w.drag.eStart,e);
				}
			});
		}
	});
	$.extend( $.mobile.datebox.prototype._drag, {
		'timeflipbox': function() {
			this._drag.flipbox.apply(this);
		},
		'flipbox': function() {
			var w = this,
				o = this.options,
				g = this.drag;
			
			$(document).on(g.eMove, function(e) {
				if ( g.move && ( o.mode === 'flipbox' || o.mode === 'timeflipbox' )) {
					g.end = w.touch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
					g.target.css('marginTop', (g.pos + g.end - g.start) + 'px');
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			});
			
			$(document).on(g.eEnd, function(e) {
				if ( g.move && (o.mode === 'flipbox' || o.mode === 'timeflipbox' )) {
					g.move = false;
					if ( g.end !== false ) {
						e.preventDefault();
						e.stopPropagation();
						g.tmp = g.target.parent().parent();
						w._offset(g.tmp.jqmData('field'), (parseInt((g.start - g.end) / g.target.innerHeight(),10) * g.tmp.jqmData('amount')));
					}
					g.start = false;
					g.end = false;
				}
			});
		}
	});
})( jQuery );

/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: Chris P. Vigelius <me@cv.gd>, Pascal Hofmann <crowdin>
 *
 */

jQuery.extend(jQuery.mobile.datebox.prototype.options.lang, {
	'de': {
		setDateButtonLabel: "speichern",
		setTimeButtonLabel: "speichern",
		setDurationButtonLabel: "speichern",
		calTodayButtonLabel: "heute",
		titleDateDialogLabel: "Datum wählen",
		titleTimeDialogLabel: "Zeit wählen",
		daysOfWeek: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
		daysOfWeekShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
		monthsOfYear: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		monthsOfYearShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"],
		durationLabel: ["Tage", "Stunden", "Minuten", "Sekunden"],
		durationDays: ["Tag", "Tage"],
		tooltip: "Öffne Datumsauswahl",
		nextMonth: "Nächster Monat",
		prevMonth: "Vorheriger Monat",
		timeFormat: 24,
		headerFormat: '%A, %B %-d, %Y',
		dateFieldOrder: ['d','m','y'],
		timeFieldOrder: ['h', 'i', 'a'],
		slideFieldOrder: ['y', 'm', 'd'],
		dateFormat: "%d.%m.%Y",
		useArabicIndic: false,
		isRTL: false,
		calStartDay: 0,
		clearButton: "löschen",
		durationOrder: ['d', 'h', 'i', 's'],
		meridiem: ["AM", "PM"],
		timeOutput: "%k:%M",
		durationFormat: "%Dd %DA, %Dl:%DM:%DS",
		calDateListLabel: "Weitere Termine"
	}
});
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	useLang: 'de'
});
