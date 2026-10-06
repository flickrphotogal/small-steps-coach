# Small Steps coach

Small Steps is a private static web app. Routine history, grocery checks,
reviews, story choices, and weight stay in the browser's local storage. There
is no account, server, analytics, or AI connection.

## Run locally

Serve this directory over HTTP so the service worker can cache it:

```powershell
cd coach
python -m http.server 8080
```

Then open `http://localhost:8080`.

Opening `index.html` directly still runs the coach, but browsers do not allow a
service worker on `file://`, so offline caching cannot be tested that way.

## Test

With Node.js 18 or newer:

```powershell
node --test tests/state.test.js
```

## Reminders

`reminders.ics` contains:

- Daily breakfast prompt at 7:00 am
- Weekday movement prompt at 8:00 am
- Daily main-meal prompt at 1:00 pm
- No evening notification

Importing the calendar file and installing the app on an iPhone will be
completed after an HTTPS hosting option is selected.

## Backup

Use **Settings → Export backup** before clearing browser data or changing
devices. Import restores only Small Steps data. The app intentionally does not
read or delete the older `weekday-coach-v1` local-storage key.
