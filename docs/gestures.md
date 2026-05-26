# chakra-core · Gesture Catalogue

## Current Gestures (Rule-Based)

| Gesture | Trigger | Effect |
|---------|---------|--------|
| OPEN_PALM | Hand openness ≥ 0.22 | Wide aura expansion |
| CLOSED_FIST | Hand openness ≤ 0.06 | Compressed dense aura |
| TWO_HAND_CHARGE | Both fists, wrist distance < 0.3 | Charge pulse ring on both hands |

## Roadmap

| Gesture | Detection Method | Planned Effect |
|---------|-----------------|----------------|
| KAMEHAMEHA | Both palms facing, wide apart | Beam between hands |
| RASENGAN | Rapid wrist rotation | Spinning vortex |
| SPIRIT_BOMB | Arms raised, open palms | Rising sphere |
| FINGER_GUN | Index extended only | Laser trail |
| PEACE | Index + middle extended | Split aura fork |

## Adding a New Gesture

1. Define the constant in `tracking/gestures.js` → `GESTURE` object.
2. Add detection logic to `classifySingleHand()` or `classifyGestures()`.
3. Add visual effect in `effects/aura.js` keyed off the new gesture constant.
4. Add label to `GESTURE_LABELS` in `ui/hud.js`.
