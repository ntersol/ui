[@ntersol/calendar](../README.md) / [Exports](../modules.md) / CalendarComponent

# Class: CalendarComponent

An Outlook style calendar based on @fullCalendar

## Implements

- _OnInit_
- _OnChanges_

## Table of contents

### Constructors

- [constructor](calendarcomponent.md#constructor)

### Properties

- [calendarPlugins](calendarcomponent.md#calendarplugins)
- [dateClick](calendarcomponent.md#dateclick)
- [defaultView](calendarcomponent.md#defaultview)
- [eventClick](calendarcomponent.md#eventclick)
- [events](calendarcomponent.md#events)
- [fc](calendarcomponent.md#fc)
- [header](calendarcomponent.md#header)
- [height](calendarcomponent.md#height)
- [maxTime](calendarcomponent.md#maxtime)
- [minTime](calendarcomponent.md#mintime)
- [selectable](calendarcomponent.md#selectable)
- [visible$](calendarcomponent.md#visible$)

### Methods

- [changeViewType](calendarcomponent.md#changeviewtype)
- [handleEventClick](calendarcomponent.md#handleeventclick)
- [ngOnChanges](calendarcomponent.md#ngonchanges)
- [ngOnInit](calendarcomponent.md#ngoninit)
- [select](calendarcomponent.md#select)

## Constructors

### constructor

\+ **new CalendarComponent**(): [_CalendarComponent_](calendarcomponent.md)

**Returns:** [_CalendarComponent_](calendarcomponent.md)

Defined in: [calendar.component.ts:48](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L48)

## Properties

### calendarPlugins

• **calendarPlugins**: PluginDef[]

Defined in: [calendar.component.ts:45](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L45)

---

### dateClick

• **dateClick**: _EventEmitter_<DateClick\>

Defined in: [calendar.component.ts:42](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L42)

---

### defaultView

• **defaultView**: DefaultView= 'dayGridMonth'

Defined in: [calendar.component.ts:31](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L31)

---

### eventClick

• **eventClick**: _EventEmitter_<EventClick\>

Defined in: [calendar.component.ts:43](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L43)

---

### events

• **events**: Event[]

Defined in: [calendar.component.ts:32](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L32)

---

### fc

• `Optional` **fc**: _FullCalendar_

Defined in: [calendar.component.ts:48](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L48)

---

### header

• **header**: _any_

https://fullcalendar.io/docs/header

Defined in: [calendar.component.ts:36](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L36)

---

### height

• **height**: _undefined_ \| _number_

Defined in: [calendar.component.ts:34](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L34)

---

### maxTime

• **maxTime**: _undefined_ \| _string_

A string with the END time for the timegrid view, IE "07:00:00"

Defined in: [calendar.component.ts:40](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L40)

---

### minTime

• **minTime**: _undefined_ \| _string_

A string with the START time for the timegrid view, IE "07:00:00"

Defined in: [calendar.component.ts:38](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L38)

---

### selectable

• **selectable**: _boolean_= false

Defined in: [calendar.component.ts:33](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L33)

---

### visible$

• **visible$**: _BehaviorSubject_<boolean\>

Defined in: [calendar.component.ts:46](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L46)

## Methods

### changeViewType

▸ **changeViewType**(`defaultView`: DefaultView): _void_

Change the type of view full calendar is displaying
Full calendar does not support this natively so reinstantiating the component is necessary

#### Parameters:

| Name          | Type        |
| :------------ | :---------- |
| `defaultView` | DefaultView |

**Returns:** _void_

Defined in: [calendar.component.ts:75](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L75)

---

### handleEventClick

▸ **handleEventClick**(`event`: _any_): _void_

#### Parameters:

| Name    | Type  |
| :------ | :---- |
| `event` | _any_ |

**Returns:** _void_

Defined in: [calendar.component.ts:67](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L67)

---

### ngOnChanges

▸ **ngOnChanges**(`model`: SimpleChanges): _void_

#### Parameters:

| Name    | Type          |
| :------ | :------------ |
| `model` | SimpleChanges |

**Returns:** _void_

Implementation of: void

Defined in: [calendar.component.ts:54](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L54)

---

### ngOnInit

▸ **ngOnInit**(): _void_

**Returns:** _void_

Implementation of: void

Defined in: [calendar.component.ts:52](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L52)

---

### select

▸ **select**(`select`: _any_): _void_

#### Parameters:

| Name     | Type  |
| :------- | :---- |
| `select` | _any_ |

**Returns:** _void_

Defined in: [calendar.component.ts:63](https://github.com/ntersol/angular-starter/blob/b6dd80a/libs/calendar/src/lib/calendar.component.ts#L63)
