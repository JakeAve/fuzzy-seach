import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { predicates as ps, PredicateEnum } from "./predicates.ts";
import { scoreMatch, scoreMatches, ScoresArray, ScoresObject } from "./mod.ts";
import { findLongestStreak } from "./utils/findLongestStreak.ts";
import { getNumberOfSharedLetters } from "./utils/getNumberOfSharedLetters.ts";

Deno.test("hasExactMatch works", () => {
  const isFooInFood = ps[PredicateEnum.hasExactMatch]("foo", "food");
  assert(isFooInFood);
  const isDInFoo = ps[PredicateEnum.hasExactMatch]("d", "foo");
  assertEquals(isDInFoo, false);
});

Deno.test("hasExactMatchWithDiacritics works", () => {
  const mamaInmamá = ps[PredicateEnum.hasExactMatchWithDiacritics](
    "mama",
    "mamá"
  );
  assert(mamaInmamá);
  const isDInFoo = ps[PredicateEnum.hasExactMatchWithDiacritics]("d", "fóo");
  assertEquals(isDInFoo, false);
});

Deno.test("hasLettersInOrder works", () => {
  const fooWithFood = ps[PredicateEnum.hasLettersInOrder]("foo", "food");
  assert(fooWithFood);
  const walkInWhamlkd = ps[PredicateEnum.hasLettersInOrder]("walk", "whamlkd");
  assert(walkInWhamlkd);
  const pkgJsonInPackageJson = ps[PredicateEnum.hasLettersInOrder](
    "pkgjson",
    "packagejson"
  );
  assert(pkgJsonInPackageJson);
  const effInEvanston = ps[PredicateEnum.hasLettersInOrder]("eff", "evanston");
  assertEquals(effInEvanston, false);
  const stateIsState = ps[PredicateEnum.hasLettersInOrder]("state", "states");
  assert(stateIsState);
});

Deno.test("isSimilarWithoutConsecutives works", () => {
  const fooWithFood = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "foo",
    "food"
  );
  assert(fooWithFood);
  const lluuckWithLuck = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "lluuck",
    "luckk"
  );
  assert(lluuckWithLuck);
  const ardvarkInElephant = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "ardvark",
    "elephant"
  );
  assertEquals(ardvarkInElephant, false);
});

Deno.test("hasDiacriticsInOrder works", () => {
  const test1 = ps[PredicateEnum.hasDiacriticsInOrder]("ándrés", "andres");
  assert(test1);
  const test2 = ps[PredicateEnum.hasDiacriticsInOrder]("cliché", "cliche");
  assert(test2);
  const test3 = ps[PredicateEnum.hasDiacriticsInOrder]("naïve", "naive");
  assert(test3);
  const test4 = ps[PredicateEnum.hasDiacriticsInOrder](
    "são paulo",
    "sao paulo"
  );
  assert(test4);
  const test5 = ps[PredicateEnum.hasDiacriticsInOrder]("piñón", "pinon");
  assert(test5);
  const test6 = ps[PredicateEnum.hasDiacriticsInOrder]("cæsar", "caesar"); // not the best test
  assert(test6);
  const test7 = ps[PredicateEnum.hasDiacriticsInOrder]("françois", "franswa");
  assertEquals(test7, false);
});

Deno.test("findLongestStreak works", () => {
  const l1 = findLongestStreak("ace", "race");
  assertEquals(l1, 3);
  const l2 = findLongestStreak("camera", "cam");
  assertEquals(l2, 3);
  const l3 = findLongestStreak(
    "somefragilistic",
    "supercalifragilisticexpialidocious"
  );
  assertEquals(11, l3);
});

Deno.test("isLongestStreak3orMore", () => {
  const t1 = ps[PredicateEnum.isLongestStreak3orMore]("stadium", "titanium");
  assert(t1);
  const t2 = ps[PredicateEnum.isLongestStreak3orMore]("tough", "stuff");
  assertEquals(t2, false);
});

Deno.test("isLongestStreak4orMore", () => {
  const t1 = ps[PredicateEnum.isLongestStreak4orMore](
    "mysterious",
    "victorious"
  );
  assert(t1);
  const t2 = ps[PredicateEnum.isLongestStreak3orMore]("tough", "stuff");
  assertEquals(t2, false);
});

Deno.test("getNumberOfSharedLetters works", () => {
  const five = getNumberOfSharedLetters("abcde", "a blue cow drank");
  assertEquals(five, 5);
  const two = getNumberOfSharedLetters("foo", "food");
  assertEquals(two, 2);
});

Deno.test("has3OrMoreSharedLetters works", () => {
  const t1 = ps[PredicateEnum.has3OrMoreSharedLetters]("mars", "martes");
  assert(t1);
  const t2 = ps[PredicateEnum.has3OrMoreSharedLetters]("clap", "snap");
  assertEquals(t2, false);
});

Deno.test("areMoreThanHalfLettersShared works", () => {
  const shouldBeTrue = ps[PredicateEnum.areMoreThanHalfLettersShared](
    "foo",
    "food"
  );
  assert(shouldBeTrue);
  const shouldBeFalse = ps[PredicateEnum.areMoreThanHalfLettersShared](
    "bollywood",
    "baffled"
  );
  assertEquals(shouldBeFalse, false);
});

Deno.test("hasExactMatchWithoutVowels works", () => {
  const s1 = ps[PredicateEnum.hasExactMatchWithoutVowels]("moma", "mamá");
  assert(s1);
  const s2 = ps[PredicateEnum.hasExactMatchWithoutVowels]("mommma", "mamá");
  assertEquals(s2, false);
});

Deno.test("scoreMatch returns number", () => {
  const s1 = scoreMatch("foo", "food");
  const s2 = scoreMatch("walk", "whamlkd");
  const s3 = scoreMatch("cæsar", "caesar");
  const s4 = scoreMatch("lluuck", "luckk");
  const s5 = scoreMatch("pkgjson", "packagejson");
  const results = [s1, s2, s3, s4, s5];
  results.forEach((score) => assertEquals(typeof score, "number"));
});

Deno.test("scoreMatch returns 0 on empty string", () => {
  assertEquals(scoreMatch("", "anything"), 0);
});

Deno.test("scoreMatches sorts appropriately", () => {
  const scores = scoreMatches("trick", [
    "train",
    "true",
    "tamberine",
    "tacid",
    "rock",
    "expert",
    "food",
    "brick",
    "tricky",
    "trim",
  ]);
  let didIncrease = false;
  let highScore = 999;
  for (const score of Object.values(scores as ScoresObject)) {
    if (score > highScore) {
      didIncrease = true;
      break;
    }
    highScore = score;
  }
  assertEquals(didIncrease, false);
});

Deno.test("scoreMatches does an object", () => {
  const scores = scoreMatches("trick", [
    "train",
    "true",
    "tamberine",
    "tacid",
    "rock",
    "expert",
    "food",
    "brick",
    "tricky",
    "trim",
  ]) as ScoresObject;
  assert(typeof scores === "object");
  assert(scores["train"]);
});

Deno.test("scoreMatches does an array", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "array" }
  ) as ScoresArray;
  assert(Array.isArray(scores));
});

Deno.test("scoreMatches does a tuple", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "tuple" }
  ) as ScoresArray;
  assert(Array.isArray(scores));
  assert(Array.isArray(scores[0]));
});

Deno.test("scoreMatches maxLength", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "array", maxLength: 2 }
  ) as ScoresArray;
  assertEquals(scores.length, 2);
});
