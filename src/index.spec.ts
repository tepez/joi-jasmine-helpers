interface ISpec {

}

describe('joi-jasmine-helpers', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    it('must pass', () => {
       expect(1).toBe(1);
    });
});