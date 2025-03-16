# Volunteering Recommendations Randomization

This feature implements randomized volunteering recommendations in the home feed to provide users with a fresh and diverse selection of volunteering opportunities.

## Implementation Details

### Daily Rotation

- Recommendations are randomized once per day
- The randomization state (timestamp and seed) is stored in AsyncStorage
- Each day, a new random seed is generated to shuffle the recommendations

### Randomization Logic

- We fetch more recommendations than we display (10 vs 5) to have a larger pool for randomization
- A seeded shuffle algorithm is used to ensure consistent randomization within the same day
- The randomization is deterministic within a day, ensuring a consistent experience during a user session

### Components Modified

1. `VolunteeringRecos.tsx` - Updated to use the randomization hook and fetch more recommendations
2. `useRandomizedRecos.ts` - New hook that handles the randomization logic and daily rotation

## How It Works

1. When the app loads, it checks if it's been more than 24 hours since the last randomization (can be adjusted)
2. If it's a new day, a new random seed is generated
3. The recommendations are shuffled using this seed and the first 5 are displayed
4. The same randomized order is maintained throughout the day

## Performance Considerations

- The randomization happens only once when the component mounts
- AsyncStorage operations are minimal (once per day)
- If there's an error in the randomization process, we fallback to the original order
