# DoseKey regression review — 2026-09-15

## Requirements preserved

- Tracker language; no automatic medical evaluation or dose recommendations.
- Full-screen dose entry and record details; content-sized bottom sheets for daily check-in and filters.
- Name-based onboarding, four navigation tabs, light/dark theme.
- Dose periods optional; the user can keep the same dose indefinitely.
- Multiple retrospective records on one calendar day; creation metadata secondary.
- Progress sections stay together and the period selector filters their data.
- Weight, appetite and energy cards navigate and focus their own progress section.

## Browser scenarios completed

Tests ran against the supervised local preview, not the live user's browser data. Mobile sizes were same-origin iframe viewports in Chrome, not physical Android/iOS devices.

| Scenario | Result |
| --- | --- |
| Full-screen period form, widths 320 / 390 / 430 | Left and top both 0; correct viewport width; no horizontal overflow |
| Filter sheet at 320 × 480 | Fully within viewport; apply reachable |
| Settings in light mode at 320 × 480 | Fully within viewport, 16px side margins |
| Past dose on Sept 10 at 08:45 | Saved under Sept 10; latest use did not move backward |
| Edit that dose to 09:15 | Updated existing record successfully |
| New period at 10 mg | Previous period retained and closed; new period selected |
| Daily appetite 4, energy 5, nausea, weight 129.8 | Saved; corresponding progress values updated |
| Weight/appetite/energy home shortcuts | Target section focused and scrolled to ~20px from top |
| Previous period selection | Earlier weight data shown instead of active-period values |
| Calendar day Sept 10 | Only that day's two dose records shown |
| Weight filter on dose-only day | Correct empty state |
| Fresh onboarding, name and medication search | Completed with no prefilled clinical records |
| Empty dose / zero-day custom interval | Continue disabled |
| Daily oral-medication tracking | No injection-site selector; next date one day later |
| Preview data restoration/reload | Saved dose period and daily values preserved |
| Error inspection | No application error observed in final sampled logs; extension metadata errors excluded |

## Automated checks

`node scripts/qa-regression.mjs`: 14 passing assertions covering weekly/daily/custom/unscheduled dates, old-record ordering, period isolation, year and leap-day boundaries, modal translation reset and removal of hard-coded chart datasets.

`tsc --noEmit`: passed. Production build: passed (non-blocking bundle-size warning).

## Remaining limitations (not claimed as completed)

- Real push delivery when the app is closed is not implemented. The interface clearly labels reminder preference storage only.
- Data remains browser-local; no accounts, cloud synchronization, or guaranteed cold-start offline support.
- Medication dose/volume values are user-entered, not a validated country-specific product catalog.
- New period creation currently requires a date after the current period start and no later than today. Future-dated periods and same-day period changes need a dedicated plan-editing flow.
- Daily records have a readable detail view but not an editing flow yet.
- Physical Android keyboard, iOS Safari, and assistive-technology testing still need real-device validation.

The temporary mobile test harness was removed before publication. Existing live browser records were not reset or migrated.
