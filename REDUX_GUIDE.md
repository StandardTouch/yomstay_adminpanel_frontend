# Redux Guide for YomStay Admin Panel

## Quick Start

Your Redux is already set up! Here's how to use it.

## 1. Create a Slice (Feature State Management)

```javascript
// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action for API calls
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
```

## 2. Create Selectors (Performance)

```javascript
// src/features/users/usersSelectors.js
import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// Computed selectors (memoized)
export const selectActiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.status === "active")
);
```

## 3. Add to Root Reducer

```javascript
// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
// import other reducers...

const rootReducer = combineReducers({
  users: usersReducer,
  // other reducers...
});

export default rootReducer;
```

## 4. Use in Components

```javascript
// src/features/users/screens/UsersScreen.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../usersSlice";
import { selectUsers, selectUsersLoading } from "../usersSelectors";

export default function UsersScreen() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Common Patterns

### Async Actions (API Calls)

```javascript
// In slice
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// In component
const handleCreateUser = async (userData) => {
  try {
    await dispatch(createUser(userData)).unwrap();
    // Success
  } catch (error) {
    // Handle error
  }
};
```

### Local State Updates

```javascript
// In slice
reducers: {
  updateUser: (state, action) => {
    const { id, updates } = action.payload;
    const user = state.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
    }
  },
}

// In component
dispatch(updateUser({ id: 1, updates: { name: 'New Name' } }));
```

### Loading States

```javascript
// Always handle loading states
const loading = useSelector(selectUsersLoading);
const error = useSelector(selectUsersError);

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

## File Structure for Each Feature

```
src/features/users/
├── screens/
│   └── UsersScreen.jsx
├── usersSlice.js          # State management
├── usersSelectors.js      # Performance selectors
└── usersThunks.js         # Async operations (optional)
```

## Quick Checklist for New Features

1. ✅ Create slice (`featureSlice.js`)
2. ✅ Create selectors (`featureSelectors.js`)
3. ✅ Add to root reducer (`rootReducer.js`)
4. ✅ Use in component (`useDispatch`, `useSelector`)

## Debugging

- Install Redux DevTools browser extension
- Open DevTools → Redux tab
- See all actions, state changes, and time-travel debug

## Tips

- **Keep slices small** - One slice per feature
- **Use selectors** - For performance and reusability
- **Handle loading states** - Always show loading/error states
- **Normalize data** - Use IDs for large datasets
- **Async thunks** - For API calls and complex async logic

## Example: Complete Auth Feature

```javascript
// authSlice.js
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

// authSelectors.js
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// In component
const user = useSelector(selectUser);
const isAuthenticated = useSelector(selectIsAuthenticated);
```

That's it! Your Redux is ready to use. 🚀
