[@ntersol/calendar](../README.md) / [Exports](../modules.md) / CalendarComponent

# Class: CalendarComponent

An Outlook style calendar based on @fullCalendar

## Implements

- `OnChanges`

## Table of contents

### Constructors

- [constructor](CalendarComponent.md#constructor)

### Properties

- [calendarPlugins](CalendarComponent.md#calendarplugins)
- [dateClick](CalendarComponent.md#dateclick)
- [defaultView](CalendarComponent.md#defaultview)
- [eventClick](CalendarComponent.md#eventclick)
- [events](CalendarComponent.md#events)
- [fc](CalendarComponent.md#fc)
- [header](CalendarComponent.md#header)
- [height](CalendarComponent.md#height)
- [maxTime](CalendarComponent.md#maxtime)
- [minTime](CalendarComponent.md#mintime)
- [selectable](CalendarComponent.md#selectable)
- [visible$](CalendarComponent.md#visible$)

### Methods

- [changeViewType](CalendarComponent.md#changeviewtype)
- [handleEventClick](CalendarComponent.md#handleeventclick)
- [ngOnChanges](CalendarComponent.md#ngonchanges)
- [select](CalendarComponent.md#select)

## Constructors

### constructor

• **new CalendarComponent**()

## Properties

### calendarPlugins

• **calendarPlugins**: `PluginDef`[]

#### Defined in

[calendar.component.ts:55](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L55)

___

### dateClick

• **dateClick**: `EventEmitter`<`DateClick`\>

#### Defined in

[calendar.component.ts:52](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L52)

___

### defaultView

• **defaultView**: `DefaultView` = `'dayGridMonth'`

#### Defined in

[calendar.component.ts:41](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L41)

___

### eventClick

• **eventClick**: `EventEmitter`<`EventClick`\>

#### Defined in

[calendar.component.ts:53](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L53)

___

### events

• **events**: `Event`[] = `[]`

#### Defined in

[calendar.component.ts:42](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L42)

___

### fc

• `Optional` **fc**: `FullCalendar`

#### Defined in

[calendar.component.ts:58](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L58)

___

### header

• **header**: `unknown`

https://fullcalendar.io/docs/header

#### Defined in

[calendar.component.ts:46](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L46)

___

### height

• **height**: `undefined` \| `number`

#### Defined in

[calendar.component.ts:44](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L44)

___

### maxTime

• **maxTime**: `undefined` \| `string`

A string with the END time for the timegrid view, IE "07:00:00"

#### Defined in

[calendar.component.ts:50](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L50)

___

### minTime

• **minTime**: `undefined` \| `string`

A string with the START time for the timegrid view, IE "07:00:00"

#### Defined in

[calendar.component.ts:48](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L48)

___

### selectable

• **selectable**: `boolean` = `false`

#### Defined in

[calendar.component.ts:43](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L43)

___

### visible$

• **visible$**: `BehaviorSubject`<`boolean`\>

#### Defined in

[calendar.component.ts:56](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L56)

## Methods

### changeViewType

▸ **changeViewType**(`defaultView`): `void`

Change the type of view full calendar is displaying
Full calendar does not support this natively so reinstantiating the component is necessary

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultView` | `DefaultView` |

#### Returns

`void`

#### Defined in

[calendar.component.ts:81](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L81)

___

### handleEventClick

▸ **handleEventClick**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `EventClick` |

#### Returns

`void`

#### Defined in

[calendar.component.ts:73](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L73)

___

### ngOnChanges

▸ **ngOnChanges**(`model`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `SimpleChanges` |

#### Returns

`void`

#### Implementation of

OnChanges.ngOnChanges

#### Defined in

[calendar.component.ts:60](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L60)

___

### select

▸ **select**(`select`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `select` | `unknown` |

#### Returns

`void`

#### Defined in

[calendar.component.ts:69](https://github.com/ntersol/angular-starter/blob/215f8745/libs/calendar/src/lib/calendar.component.ts#L69)
