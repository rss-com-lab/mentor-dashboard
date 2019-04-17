import { tasks, getSelectOptions } from './utils';

describe('take values for form select', () => {
  it('process utils data', () => {
    const selectOptions = getSelectOptions(tasks);

    expect(selectOptions[0].label).toBe('CJ "CoreJS"');
    expect(selectOptions[0].value).toBe('Code Jam "CoreJS"');
  });
});
