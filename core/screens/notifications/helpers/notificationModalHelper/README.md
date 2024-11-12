

# Technical Documentation for `notificationModalHelper.ts`

## Overview
The `notificationModalHelper.ts` file provides functionality for managing the eligibility of displaying a.o. `NotificationOptInModal.tsx`. It utilizes `AsyncStorage` to persist modal state across app sessions and implements logic to determine when the modal should be shown based on user interactions and configurable parameters.

---

## Interfaces

### `ModalState`
Represents the state of the notification modal.

| **Property**                     | **Type**     | **Description**                                           |
|----------------------------------|--------------|-----------------------------------------------------------|
| `minIntervalBetweenAttemptsMs`   | `number`     | Minimum interval between attempts in milliseconds.        |
| `attempts`                       | `number`     | Number of attempts made to show the modal.               |
| `lastAttemptDate`                | `string`     | Date of the last attempt to show the modal.              |
| `lastShowTime`                   | `number`     | Timestamp of the last time the modal was shown.          |
| `expirationTime`                 | `number`     | Timestamp when the modal can be shown again.             |
| `activeDays`                     | `number`     | Number of active days the modal has been shown.          |
| `configActiveDays`               | `number`     | Configured number of active days for eligibility.        |

---

### `NotificationEligibilityConfig`
Configuration for determining notification eligibility.

| **Property**                     | **Type**     | **Description**                                           |
|----------------------------------|--------------|-----------------------------------------------------------|
| `maxAttemptsPerDay`              | `number`     | Maximum number of attempts allowed per day.              |
| `pauseDays`                      | `number`     | Number of days to pause after reaching max attempts.     |
| `activeDays`                     | `number`     | Number of active days required for eligibility.          |
| `minIntervalBetweenAttemptsMs`   | `number`     | Minimum interval between attempts in milliseconds.        |

---

## Constants

### `NOTIFICATION_MODAL_STORAGE_KEY`
A constant string used as the key for storing the modal state in `AsyncStorage`.

### `notificationConfig`
Default configuration for notification eligibility. It can be adjusted as needed.

```typescript
export const notificationConfig: NotificationEligibilityConfig = {
  maxAttemptsPerDay: 2,
  pauseDays: 3,
  activeDays: 2,
  minIntervalBetweenAttemptsMs: 6 * 60 * 60 * 1000, // 6 hours
}
```

---

## Functions

### `checkNotificationEligibility(): Promise<boolean>`
Checks if the notification modal can be shown based on the provided configuration and the current modal state.

- **Parameters:**
  - `config`: The configuration object for eligibility checks.
  
- **Returns:** A promise that resolves to a boolean indicating whether the modal is eligible to be shown.

---

### `getNotificationModalState(): Promise<ModalState | null>`
Retrieves the current state of the notification modal from `AsyncStorage`.

- **Returns:** A promise that resolves to the current `ModalState` or `null` if no state is found.

---

### `useNotificationEligibility()`
A custom hook that manages the eligibility state of the notification modal.

- **Parameters:**
  - `config`: Optional configuration for eligibility checks.
  
- **Returns:** An object containing:
  - `isEligible`: A boolean indicating if the modal is eligible to be shown.
  - `modalState`: The current state of the modal. Can be used to display additional information for testing.

---

### `incrementModalAttempts(): Promise<void>`
Increments the number of attempts made to show the notification modal and updates the last show time.

- **Returns:** A promise that resolves when the state has been updated in `AsyncStorage`.

---

## Usage Example

```typescript
import { useNotificationEligibility, notificationConfig, incrementModalAttempts } from 'core/screens/notifications/helpers/notificationModalHelper';

// Inside a component
const MyComponent = () => {
  const { isEligible, modalState } = useNotificationEligibility(notificationConfig);

  const handleShowModal = async () => {
    if (isEligible) {
      // Show the notification modal
      await incrementModalAttempts();
    }
  };

  return (
    <View>
      {/* Your component logic */}
    </View>
  );
};
```

---

## Error Handling
The functions handle errors by returning `false` or `null` in case of exceptions, ensuring that the application can gracefully handle issues with `AsyncStorage`.
