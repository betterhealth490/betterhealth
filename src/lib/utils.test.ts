import assert from "assert";
import { isDefined, isNullOrUndefined } from "./utils";

describe("Utility functions", () => {
    describe(isDefined.name, () => {
        it("returns true for a defined but truthy value", () => {
            assert.strictEqual(isDefined(1), true);
        });
        it("returns true for a defined but falsey value", () => {
            assert.strictEqual(isDefined(0), true);
        });
        it("returns false for an undefined value", () => {
            assert.strictEqual(isDefined(undefined), false);
        });
        it("returns false for a nullish value", () => {
            assert.strictEqual(isDefined(null), false);
        });
    });

    describe(isNullOrUndefined.name, () => {
        it("returns false for a defined but truthy value", () => {
            assert.strictEqual(isNullOrUndefined(1), false);
        });
        it("returns false for a defined but falsey value", () => {
            assert.strictEqual(isNullOrUndefined(0), false);
        });
        it("returns true for an undefined value", () => {
            assert.strictEqual(isNullOrUndefined(undefined), true);
        });
        it("returns true for a nullish value", () => {
            assert.strictEqual(isNullOrUndefined(null), true);
        });
    });
});
