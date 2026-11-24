# Santa wrist and rein contact correction

Based on 83062d8. Reviewed the standing/petting Santa, M50 map flight, runway takeoff and large mosaic fly-by.

The petting wrist now has an explicit orientation after the arm solver: fingers follow the neck and the palm faces the reindeer. It blends in and out with the existing reach. Previously the hand inherited the elbow's roll.

Seated Santa uses neutral wrists parallel to the forearms with inward-facing palms. Both reins start at model-space glove contact points and follow the posed hands, including the takeoff seat's pitch, bank and lift. This replaces the disconnected fixed rein endpoints.

The 24-joint source rig has no finger joints. A fixed, relaxed curled-finger pose is applied to the seated glove mesh at load time. This is a glove mesh deformation, not a new skeletal finger animation. Standing/petting Santa retains the original open glove. Model source files are unchanged.

Only hand/wrist poses and hand-end rein attachments changed. Flight paths, runway acceleration/liftoff, backgrounds, timings, engineering labels, director gallery and 199-person mosaic remain as approved. Subtitles remain disabled and the film remains silent.

Validation: TypeScript; eleven project render checkpoints; enlarged hand/wrist inspections for petting, map flight, runway and fly-by; full 90-second 1920 × 1080, 25 fps review render.
