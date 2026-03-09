# Customized Chart Feature — Requirements

**Feature Area:** Dashboard Home
**Date:** 2026-03-03

---

## 1. Overview

Users can define and manage personal charts on the Dashboard Home. Each chart visualises how many rooms fall into user-defined sensor value ranges. Charts are personal, persist across sessions, and reflect live sensor data at all times.

---

## 2. Feature Scope

| # | Capability | Description |
|---|------------|-------------|
| 1 | View custom charts | Display saved charts in a dedicated row on the dashboard. |
| 2 | Create a chart | Define a new chart with a name, room selection, sensor type, and value ranges. |
| 3 | Edit a chart | Modify any configuration of an existing chart. |
| 4 | Delete a chart | Permanently remove a chart after explicit confirmation. |
| 5 | Reorder charts | Rearrange charts via drag-and-drop; order persists per user. |
| 6 | Live data sync | Charts automatically reflect the latest sensor readings and room statuses. |
| 7 | List View | View a per-room breakdown of which range each room currently falls into. |
| 8 | Room detail | Open a room from List View to see its current reading and range assignment. |
| 9 | Room–chart association | Each room must be aware of the charts it belongs to, to support List View and detail display. |
| 10 | Export | Export list or detail data for a custom chart (e.g. to a spreadsheet). |

---

## 3. Functional Requirements

### 3.1 Dashboard Display

- Custom charts appear in a dedicated row, positioned below the fixed dashboard charts.
- Each chart is displayed as a **doughnut chart** card.
- Each segment represents one user-defined range (e.g. "Cold", "Normal", "Hot") with its assigned colour and the **count of rooms** currently in that range.
- Only rooms that are **online** and have a **valid reading** for the chart's sensor type are counted.
- Charts **update automatically** as sensor data or room statuses change — no manual refresh required.

### 3.2 Add a Custom Chart

- An **"Add Custom Chart"** button is visible in the dashboard header.
- Clicking it opens a configuration dialog with the following fields:

  | Field | Description |
  |-------|-------------|
  | **Name** | Required. Must be unique across the user's charts. |
  | **Rooms** | One or more rooms to include. Only rooms that have sensors are selectable. |
  | **Sensor Type** | The sensor to track. Only types available across all selected rooms are offered. |
  | **Ranges** | One or more named intervals. Each has a name, lower bound, upper bound, and colour. Ranges must not overlap. |

- On save, the chart is added to the custom charts row and persisted for future sessions.

### 3.3 Edit a Custom Chart

- Each chart card has a contextual options menu (⋮).
- The menu includes an **"Edit Chart"** option that opens the same dialog, pre-filled with current values.
- All fields are editable: name, rooms, sensor type, and ranges.
- On save, changes are reflected immediately everywhere the chart appears.

### 3.4 Delete a Custom Chart

- The options menu includes a **"Delete Chart"** option.
- A confirmation dialog is shown before deletion.
- On confirmation, the chart is permanently removed from the dashboard and storage. This action cannot be undone.

### 3.5 Reorder Custom Charts

- Chart cards can be **dragged and dropped** to change their display order.
- The updated order is saved and restored on future visits for the same user.
- Reordering does not affect any chart's configuration or data.

### 3.6 List View

- Each chart card provides access to a **List View** showing, per room, the current reading and which range it falls into.
- List View is only available when at least one room's reading falls within a defined range.
- Clicking a room opens a **Room Detail** view with the current reading, range assignment, and contextual room information.
- List View updates automatically in sync with the chart.

---

## 4. Validation Rules

| Rule | Requirement |
|------|-------------|
| Chart name | Required. Must be unique across all the user's charts. |
| Room selection | At least one room must be selected. |
| Sensor type | Must be selected from the types common to all selected rooms. |
| Ranges | At least one range must be defined. |
| Range overlap | No two ranges may share any value. Intervals must be strictly non-overlapping. |
| Range names | Must be unique within a single chart. |

---

## 5. States and Messaging

| State | Expected Behaviour |
|-------|--------------------|
| No custom charts yet | Show an empty state encouraging the user to create their first chart. |
| Chart has no rooms in any range | Show an appropriate empty state within the chart card. |
| Room ranges not configured in settings | Show a clear "Room Ranges Not Set!" message in place of the chart. |
| Failed create / edit / delete | Display a descriptive error message. The user's data must not be lost. |
| Loading | Show loading indicators while data is being fetched or saved. |

---

## 6. Mock Data & Real-Time Simulation

Two TypeScript files are provided. Use them as a stand-in for the real API and WebSocket layer. **Do not modify them.**

### `mock-data.json` — Initial State

Load this as the starting data for the dashboard.

| Key | Description |
|-----|-------------|
| `rooms` | 20 rooms across 4 floors. 17 online, 3 offline. All rooms have temperature and humidity; floors 2–4 also have CO₂. |
| `customCharts` | 3 pre-configured charts: Temperature Zones, Humidity Levels, CO₂ Monitor — with ranges, colours, and room assignments. |
| `chartOrder` | The saved display order for the current user. |
| `sensorBounds` | Min/max realistic values per sensor type. |

### `mock-socket.json` — Live Updates

Defines the socket event contract. The developer must implement an interval that fires every **2 seconds** and emits events matching these payloads.

| Event | Trigger | Action required |
|-------|---------|-----------------|
| `sensor_update` | Every tick, for a subset of online rooms | Update the room's sensor value, recompute chart counts, re-render |
| `room_status` | Occasionally | Update the room's `online`/`offline` status, recompute chart counts, re-render |

### Chart Count Algorithm

On every update, recount from scratch:

1. Take the chart's `roomIds`.
2. Keep only rooms that are **online** and have a reading for the chart's `sensorType`.
3. For each qualifying room, find its range: `from ≤ value < to` (last range: `from ≤ value ≤ to`).
4. Count rooms per range → doughnut segment values.

---

## 7. Acceptance Criteria

- [ ] Custom charts are displayed in a dedicated row on the dashboard.
- [ ] "Add Custom Chart" button opens the configuration dialog.
- [ ] A chart can be created, saved, and persists after page refresh.
- [ ] A chart can be edited; changes are reflected immediately.
- [ ] A chart can be deleted after confirmation and is fully removed.
- [ ] Charts can be reordered by drag-and-drop; order persists after refresh.
- [ ] Chart counts update automatically every 2 seconds via the mock socket — no manual refresh.
- [ ] Offline rooms are excluded from chart counts in real time.
- [ ] List View opens for eligible charts with correct per-room range data.
- [ ] Room Detail is accessible from List View.
- [ ] List View updates automatically alongside the chart.
- [ ] All validation rules are enforced with clear user-facing messages.
- [ ] All empty states and error states are handled as described in Section 5.
- [ ] Export of list/detail data is supported.

---

## 8. Design ( for reference only )

**Figma:** [Customized Chart Feature – UI Mockups](https://www.figma.com/design/wgDyztHKq8v2cAx9R5rZ9m)

Screens covered: Dashboard · Add/Edit Chart Dialog · List View

---

*End of document.*






