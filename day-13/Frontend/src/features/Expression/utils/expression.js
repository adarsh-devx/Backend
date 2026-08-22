const getScore = (blendshapes, name) => {
  const item = blendshapes.find(
    (item) => item.categoryName === name
  );

  return item?.score ?? 0;
};

export function detectExpression(result) {
  if (!result?.faceBlendshapes?.length) {
    return {
      name: "No Face",
      emoji: "❌",
    };
  }

  const bs = result.faceBlendshapes[0].categories;

  // -------------------------
  // Facial signals
  // -------------------------

  const smile =
    (getScore(bs, "mouthSmileLeft") +
      getScore(bs, "mouthSmileRight")) /
    2;

  const jawOpen = getScore(bs, "jawOpen");

  const browUp = getScore(
    bs,
    "browInnerUp"
  );

  const browDown =
    (getScore(bs, "browDownLeft") +
      getScore(bs, "browDownRight")) /
    2;

  const eyeWide =
    (getScore(bs, "eyeWideLeft") +
      getScore(bs, "eyeWideRight")) /
    2;

  const eyeSquint =
    (getScore(bs, "eyeSquintLeft") +
      getScore(bs, "eyeSquintRight")) /
    2;

  const frown =
    (getScore(bs, "mouthFrownLeft") +
      getScore(bs, "mouthFrownRight")) /
    2;

  const sneer =
    (getScore(bs, "noseSneerLeft") +
      getScore(bs, "noseSneerRight")) /
    2;

  const pucker = getScore(
    bs,
    "mouthPucker"
  );

  // -------------------------
  // Calculate expression scores
  // -------------------------

  const scores = {
    Happy: smile,

    Surprise:
      browUp * 0.35 +
      eyeWide * 0.35 +
      jawOpen * 0.30,

    Angry:
      browDown * 0.55 +
      eyeSquint * 0.45,

    Sad:
      browUp * 0.45 +
      frown * 0.55,

    Fear:
      browUp * 0.30 +
      eyeWide * 0.45 +
      jawOpen * 0.25,

    Disgust:
      sneer * 0.65 +
      eyeSquint * 0.35,

    Kiss:
      pucker,
  };

  // -------------------------
  // Strong-expression rules
  // -------------------------

  const surpriseScore = scores.Surprise;

  /*
    If the face strongly looks surprised,
    don't let mouthPucker steal the result.
  */

  if (
    browUp > 0.10 &&
    eyeWide > 0.10 &&
    jawOpen > 0.10 &&
    surpriseScore > 0.10
  ) {
    return {
      name: "Surprised",
      emoji: "😮",
    };
  }

  // -------------------------
  // Kiss
  // -------------------------

  /*
    Pucker alone isn't enough.
    Require low surprise signals.
  */

  if (
    pucker > 0.65 &&
    eyeWide < 0.4 &&
    browUp < 0.4 &&
    jawOpen < 0.5
  ) {
    return {
      name: "Kiss",
      emoji: "😘",
    };
  }

  // -------------------------
  // Happy
  // -------------------------

  if (smile > 0.55) {
    return {
      name: "Happy",
      emoji: "😊",
    };
  }

  // -------------------------
  // Angry
  // -------------------------

  if (browDown > 0.10) {
    return {
      name: "Angry",
      emoji: "😠",
    };
  }

  // -------------------------
  // Disgust
  // -------------------------

  if (sneer > 0.55) {
    return {
      name: "Disgust",
      emoji: "🤢",
    };
  }

  // -------------------------
  // Sad
  // -------------------------

  if (
    frown > 0.10 &&
    browUp > 0.10
  ) {
    return {
      name: "Sad",
      emoji: "😢",
    };
  }

  // -------------------------
  // Fear
  // -------------------------

  if (
    eyeWide > 0.55 &&
    browUp > 0.45
  ) {
    return {
      name: "Fear",
      emoji: "😨",
    };
  }

  // -------------------------
  // Neutral
  // -------------------------

  return {
    name: "Neutral",
    emoji: "😐",
  };
}