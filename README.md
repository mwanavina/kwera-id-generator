# KWERA ID Generator

A single-page tool for generating KWERA member IDs from a person's name, birthdate, and cohort number, with a built-in helpfulness counter.

## ID Formula

```
[First 2 letters of first name][First 2 letters of last name][DDMMYYYY][C][Cohort number]
```

**Example:** John Chirwa, born 07/12/2019, Cohort 6 → `JOCH07122019C6`

| Component | Input         | ID Segment |
|-----------|---------------|------------|
| Name      | John Chirwa   | JOCH       |
| Birthdate | 07/12/2019    | 07122019   |
| Cohort    | Cohort 6      | C6         |

If a first or last name has fewer than 2 letters, the tool uses whatever letters are available and shows a note that the segment is shorter than usual.

## Features

- **Live ID preview** — updates as you type, with each segment color-coded (name, birthdate, cohort) so it's easy to see how the ID is assembled.
- **Breakdown table** — shows the input data next to the matching ID segment.
- **Copy to clipboard** — one tap to copy the generated ID.
- **ID log** — save generated IDs to a running list for record-keeping, with per-entry copy/remove and a clear-all option.
- **Feedback counter** — a "Yes, this helped" button that tracks how many people have found the tool useful.

## How Data Is Stored

This tool uses a key-value storage API available in the environment it runs in:

- **ID log** (`kwera-id-log`) — personal scope. Saved entries are tied to your account and are not visible to other people who open this page.
- **Feedback count** (`kwera-helpful-count`) — shared scope. This total is visible to and shared by everyone who uses the page.

This storage only works while the page is open in an environment that supports the `window.storage` API. If the HTML file is opened directly in a standalone web browser, storage calls will fail silently — the page will still work for generating IDs, but nothing will be saved or persist between visits.

## Contact

KWERA · George Kalua
WhatsApp: +265 992 838 636
Email: gka@kwera.com
