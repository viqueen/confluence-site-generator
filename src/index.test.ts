import { project } from './index';

test('prefixes project name with `node-project:`', () => {
    const name = 'viqueen';
    expect(project(name)).toEqual(`node-project: ${name}`);
});
