## Project Overview

This project is a **public bookmark manager** that does not require user authentication (no login or registration). It provides a simple, file-system-like interface for organizing and accessing bookmarked links.

---

## Core Functionality

### 1. Hierarchical Structure

The application mimics a traditional operating system file structure, consisting of:

- **Folders**
- **Files (Bookmarks)**

#### Folders

- Users can create folders to organize bookmarks.
- Each folder:
  - Has a **user-defined name**.
  - Must have a **unique name within the current directory scope**.
- Each folder view should include a navigation helper:
  - At the **beginning of the elements list**, there should be a special item that allows the user to navigate one level up in the hierarchy.
  - This item:
    - Should be labeled as **"..."**
    - Should include a **folder icon**
    - Acts as a **"go up one level"** control (similar to parent directory navigation in file systems)

#### Files (Bookmarks)

- Files represent saved links (favorites).
- Each file:
  - Has a **name** and a **URL**.
  - Is created inside the **currently active folder**.
  - Must have a **unique name within the current directory scope**.

---

### 2. Element Creation

- A global **"Add Element"** button is located in the top navigation bar.
- Users can create either:
  - A **folder**, or
  - A **file (bookmark)**

#### Creation Logic

- If the **URL field is empty**, the element is created as a **folder**.
- If the **URL field is provided**, the element is created as a **file (bookmark)**.

---

### 3. Navigation & Interaction

- The main content area displays the current folder’s contents.
- Users can:
  - **Click on a folder** to navigate into it and view its contents.
  - **Click on a file (bookmark)** to be redirected to the associated URL.

---

### 4. Data Fetching & State Management

- All elements (folders and files) must be **fetched only once when the application starts**.
- After the initial load, data should be kept in local state.
- Re-fetching is only allowed when:
  - The application starts, or
  - The state of elements changes (creation, update, deletion)
- No repeated fetching should occur on simple navigation between folders; navigation must operate on already loaded in-memory state.

---

## UX Behavior

- Holding the **Shift key while clicking on any element** enters **edit mode** for that element (desktop behavior).
- Edit mode opens a **modal dialog** where the user can modify:
  - **Name**
  - **URL** (only applicable for files/bookmarks)

### Additional behavior for files (bookmarks)

- When editing a file, the modal must also allow the user to:
  - **Reassign the file to a different folder**
  - The folder selection should be presented as a **tree-like structure**, allowing navigation through the hierarchy to pick the destination folder

- In edit mode, there should also be a **red "Delete" button** placed at the bottom of the modal, used to remove the selected element.

- Any global or full-screen waiting/loading state (e.g. data fetching, saving, navigation between folders) must be indicated by a **centered loader displayed in the middle of the screen**, blocking interaction until the operation is completed.

---

## User Interface Design

### General Styling

- The UI should follow a style similar to the **default Tailwind CSS design system**:
  - Clean, minimal, and utility-first appearance
  - Consistent spacing, rounded corners, and subtle shadows
- Default color palette:
  - **Light blue** (primary actions, highlights)
  - **Light gray** (backgrounds, borders, secondary elements)
- Default font:
  - **Montserrat**, applied globally across the application
- Default icons:
  - **Folder** and **file (bookmark)** icons should be loaded from SVG files located in the `assets` directory
- Interaction behavior:
  - Hovering over interactive elements should change the cursor to a **pointer**
  - **Link colors should remain consistent on hover** (no default color change)

---

### Desktop View

- Uses a **grid-based layout** with a "thumbnail" style presentation:
  - Each element is displayed as:
    - An **icon (64x64 px)**
    - A **text label below the icon**
  - Font size for elements should be approximately **12px**

- On **desktop only**, the top navigation bar must include a **search input field**.
  - The search field must have a label/placeholder: **"Search..."**
  - It should be positioned **before the “Add Element” button**.

#### Desktop Search Behavior

- The search filters **only files (bookmarks)** in the current folder view.
- Matching is performed against:
  - File **name**
  - Optionally the **URL**
- Search operates only on **in-memory state** (no re-fetching).
- Clearing the search restores the full view.
- Search does **not modify navigation state**.
- This feature is **not visible on mobile devices**.

#### Global Search Result Behavior

- When searching, the system should additionally show **all files from the entire database** (not only the current folder) that match the query.
- Results must be displayed in a **flat structure (no folders, no hierarchy)**.
- This global result view is separate from folder navigation and does not change the current directory context.

---

### Mobile View

- Uses a **list-based layout**:
  - Each element is displayed as:
    - An **icon (24x24 px)**
    - A **text label on the right**
  - Font size for elements should be approximately **14px**

---

## Additional Notes

- The system should enforce **name uniqueness validation** within the same directory.
- Navigation should maintain a clear sense of **current folder context** (breadcrumbs recommended).
- The UI should remain lightweight and responsive across devices.
