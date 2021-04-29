import { matchToken, parseTokens } from './main';
import { AsyncIterable } from 'ix'

describe("token matching logic", () => {
    test("should match F*B*", () => {
        expect(matchToken("a.b.FooBarBaz", "FooBar")).toEqual(true)
        expect(matchToken("a.b.FooBarBaz", "FoBr")).toEqual(true)
        expect(matchToken("a.b.FooBarBaz", "FB")).toEqual(true)
        expect(matchToken("a.b.FooBarBaz", "F")).toEqual(true)
        expect(matchToken("a.b.FooBarBaz", "FBar")).toEqual(true)
        expect(matchToken("a.b.FooBarBaz", "Br")).toEqual(true)
    })

    test("should not match Z*B*", () => {
        expect(matchToken("a.b.FooBarBaz", "ZooBar")).toEqual(false)
        expect(matchToken("a.b.FooBarBaz", "ZoBr")).toEqual(false)
        expect(matchToken("a.b.FooBarBaz", "ZB")).toEqual(false)
        expect(matchToken("a.b.FooBarBaz", "Z")).toEqual(false)
        expect(matchToken("a.b.FooBarBaz", "ZBar")).toEqual(false)
        expect(matchToken("a.b.FooBarBaz", "Zr")).toEqual(false)
    })


})


describe("token parsing logic", () => {

    test("parsing simple case data", async () => {
        const data = [
            `a.b.FooBarBaz
c.d.FooBar

codeborne.WishMaker
codeborne.MindReader

TelephoneOperator
ScubaArgentineOperator
       YoureLeavingUsHere
   YouveComeToThisPoint
YourEyesAreSpinningInTheirSockets
`
        ]
        const result = await AsyncIterable.from(parseTokens(data)).toArray()
        expect(result).toEqual([
            "a.b.FooBarBaz",
            "c.d.FooBar",
            "codeborne.WishMaker",
            "codeborne.MindReader",
            "TelephoneOperator",
            "ScubaArgentineOperator",
            "YoureLeavingUsHere",
            "YouveComeToThisPoint",
            "YourEyesAreSpinningInTheirSockets",
        ])
    })


    test("checking complext", async () => {
        const data = [
            `a.b.Foo!BarBaz
c.d.Foo(Bar)

codeborne.Wish[Maker]
codeborne.Mind#Reader

Telephone|Operator
Scuba,ArgentineOperator
       YoureLeavingUsHere
   YouveComeToThisPoint
YourEyesAreSpinningInTheirSockets
`
        ]
        const result = await AsyncIterable.from(parseTokens(data)).toArray()
        expect(result).toEqual([
            "a.b.Foo",
            "BarBaz",
            "c.d.Foo",
            "Bar",
            "codeborne.Wish",
            "Maker",
            "codeborne.Mind",
            "Reader",
            "Telephone",
            "Operator",
            "Scuba",
            "ArgentineOperator",
            "YoureLeavingUsHere",
            "YouveComeToThisPoint",
            "YourEyesAreSpinningInTheirSockets",
        ])
    })

})