# Natural petting arm alignment

Replaces the petting arm solver from 94bf70f. The previous wrist orientation corrected the palm direction but left an excessive bend between the forearm and glove.

The new two-bone arm solve places the elbow behind/below the contact point. Its target is the palm surface, with an allowance for glove length, rather than the wrist itself. Forearm and hand share the same finger direction and roll, keeping the cuff straight. Reach, elbow pole and withdrawal blend smoothly with the existing petting timing; the gentle stroke and reindeer idle remain.

Only the standing petting arm is changed. Seated rein grips, flight paths, approved backgrounds, timing, typography, gallery, roster, silent audio settings and disabled subtitle source remain unchanged.

Validation: TypeScript; enlarged contact-frame inspection; encoded reach/stroke/withdrawal preview; full 90-second 1080p25 review export.
